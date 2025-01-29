from fastapi import FastAPI
from starlette.requests import Request
from fastapi.middleware.cors import CORSMiddleware
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
import logging
import aiohttp
import asyncio
import random
import os
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
from langchain.callbacks import StreamingStdOutCallbackHandler
from langchain_community.cache import SQLiteCache
from langchain.globals import set_llm_cache
import resend
from dotenv import load_dotenv
from pydantic import BaseModel
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from starlette.middleware.sessions import SessionMiddleware
import json

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()  # This should be one of the first things that happens

app = FastAPI()

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:8000",
        "http://localhost:8001",
        "https://replance.vercel.app",  # Add your Vercel domain
        "https://replance-frontend.vercel.app",  # Add variations of your Vercel domain
        "*"  # Temporarily allow all origins for testing
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global cache for stock data and event data
cached_data = {
    "stock_data": {
        "data": None,
        "last_updated": None
    },
    "event_data": {
        "data": None,
        "last_updated": None
    }
}

# List of user-agents for rotation
user_agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:34.0) Gecko/20100101 Firefox/34.0',
    'Mozilla/5.0 (Windows NT 6.1; rv:38.0) Gecko/20100101 Firefox/38.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; rv:52.0) Gecko/20100101 Firefox/52.0',
    'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:44.0) Gecko/20100101 Firefox/44.0',
]

# Set up caching
set_llm_cache(SQLiteCache(database_path=".langchain.db"))

# Get API key from environment variable
openai_api_key = os.getenv('OPENAI_API_KEY')
if not openai_api_key:
    raise ValueError("No OpenAI API key found. Please set OPENAI_API_KEY environment variable")

# Simplest possible initialization
llm = ChatOpenAI(
    api_key=openai_api_key,
    model_name="gpt-3.5-turbo"
)

# Create a prompt template for event analysis
event_summary_prompt = ChatPromptTemplate.from_template("""
You are an AI event curator for San Francisco. Analyze these events and provide a brief overview:

Events:
{events_summary}

Please provide:
1. A 2-3 sentence overview of what's happening in SF right now
2. Notable trends or patterns in these events
3. A quick recommendation for different types of interests (e.g., for art lovers, tech enthusiasts, etc.)

Keep your response concise and engaging. Format in markdown.
""")

analysis_chain = LLMChain(
    llm=llm,
    prompt=event_summary_prompt,
    verbose=True
)

# Initialize Resend
resend.api_key = os.getenv('RESEND_API_KEY')

# Add the email prompt template
email_prompt = ChatPromptTemplate.from_template("""
You are a friendly AI assistant writing a fun, personalized email. Use the following information to craft a warm, engaging message:

Name: {name}
Hobbies: {hobbies}
Favorite Artist: {artist}
Favorite Movie: {movie}

Write a friendly email that:
1. Greets them by name
2. Makes interesting connections between their hobbies, favorite artist, and movie
3. Suggests a fun activity based on their interests
4. Ends with a warm sign-off

Keep the tone light and friendly. The email should be 3-4 short paragraphs.
""")

email_chain = LLMChain(
    llm=llm,
    prompt=email_prompt,
    verbose=True
)

# Add this class to define the expected request body structure
class EmailFormData(BaseModel):
    name: str
    email: str
    hobbies: str
    artist: str
    movie: str

async def fetch_event_data(url_subA, session):
    headers = {'User-Agent': random.choice(user_agents)}
    try:
        async with session.get(url_subA, headers=headers) as response:
            if response.status == 200:
                content = await response.text()
                soup = BeautifulSoup(content, 'html.parser')

                event_title = soup.find('h1', class_='event-title css-0')
                event_title = event_title.text.strip() if event_title else None

                event_date_time = soup.find('span', class_='date-info__full-datetime')
                event_date_time = event_date_time.text.strip() if event_date_time else None

                location_info_tag = soup.find('div', class_='location-info__address')
                location_name = None
                address = None
                if location_info_tag:
                    location_name_tag = location_info_tag.find('p', class_='location-info__address-text')
                    location_name = location_name_tag.get_text(strip=True) if location_name_tag else None

                    address_parts = location_info_tag.contents
                    address_text = ''
                    for part in address_parts:
                        if isinstance(part, str):
                            address_text += part.strip() + " "
                    address = address_text.replace(location_name, "").strip() if location_name else address_text.strip()

                description_tag = soup.find('div', class_='event-description__content')
                description = description_tag.get_text(separator=" ", strip=True)[:300] if description_tag else "Description not found."

                return {
                    'eventTitle': event_title,
                    'eventDateTime': event_date_time,
                    'location': location_name,
                    'address': address,
                    'description': description
                }
    except Exception as e:
        logger.error(f"Error fetching event data from {url_subA}: {e}")
        return None

async def enhance_event_data(event_data):
    """Add AI-generated insights to each event using Llama 2"""
    enhanced_events = []
    
    for event in event_data:
        try:
            # Run analysis in a separate thread to not block async operations
            ai_insights = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: analysis_chain.run(
                    title=event['eventTitle'],
                    datetime=event['eventDateTime'],
                    location=event['location'],
                    description=event['description']
                )
            )
            
            event['aiInsights'] = ai_insights
            logger.info(f"Generated AI insights for event: {event['eventTitle']}")
            enhanced_events.append(event)
            
        except Exception as e:
            logger.error(f"Error generating AI insights: {e}")
            event['aiInsights'] = "Unable to generate insights"
            enhanced_events.append(event)
    
    return enhanced_events

async def scrape_events():
    try:
        logger.info("Starting events scrape...")
        headers = {'User-Agent': random.choice(user_agents)}
        
        async with aiohttp.ClientSession() as session:
            # First, get the list of event URLs
            url = 'https://www.eventbrite.com/d/ca--san-francisco/all-events/'
            async with session.get(url, headers=headers) as response:
                if response.status != 200:
                    logger.error(f"Failed to fetch event list: {response.status}")
                    return None
                
                content = await response.text()
                soup = BeautifulSoup(content, 'html.parser')
                event_links = soup.find_all('a', class_='event-card-link', href=True)
                event_urls = list(set(event_link['href'] for event_link in event_links))[:5]  # Limit to 5 events
                
                # Fetch all event details concurrently
                tasks = [fetch_event_data(url, session) for url in event_urls]
                event_data = await asyncio.gather(*tasks)
                event_data = [data for data in event_data if data is not None]
                
                if event_data:
                    return {
                        "events": event_data,
                        "lastUpdated": datetime.now().isoformat()
                    }
                return None
                
    except Exception as e:
        logger.error(f"Error occurred during events scraping: {e}")
        return None

async def update_cache():
    try:
        # Update stock data
        logger.info("Attempting stock cache update...")
        stock_data = scrape_adobe_stock()
        if stock_data:
            cached_data["stock_data"]["data"] = stock_data
            cached_data["stock_data"]["last_updated"] = datetime.now()
            logger.info(f"Stock cache updated successfully at {cached_data['stock_data']['last_updated']}")
        else:
            logger.error("Failed to fetch stock data")
    except Exception as e:
        logger.error(f"Error updating stock cache: {e}")
    
    try:
        # Update event data
        logger.info("Attempting events cache update...")
        events_data = await scrape_events()
        if events_data:
            cached_data["event_data"]["data"] = events_data
            cached_data["event_data"]["last_updated"] = datetime.now()
            logger.info(f"Events cache updated successfully at {cached_data['event_data']['last_updated']}")
        else:
            logger.error("Failed to fetch events data")
    except Exception as e:
        logger.error(f"Error updating events cache: {e}")

def scrape_adobe_stock():
    try:
        logger.info("Starting scrape...")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get('https://finance.yahoo.com/quote/ADBE', headers=headers)
        logger.info(f"Yahoo response status: {response.status_code}")
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        previous_close = soup.find('fin-streamer', {'data-field': 'regularMarketPreviousClose'})
        market_open = soup.find('fin-streamer', {'data-field': 'regularMarketOpen'})
        
        logger.info(f"Found previous close: {previous_close is not None}")
        logger.info(f"Found market open: {market_open is not None}")
        
        if previous_close and market_open:
            data = {
                "previousClose": previous_close.text,
                "marketOpen": market_open.text,
                "lastUpdated": datetime.now().isoformat()
            }
            logger.info(f"Scraped data: {data}")
            return data
            
        logger.warning("Failed to find stock data elements")
        return None
        
    except Exception as e:
        logger.error(f"Error occurred during scraping: {e}")
        return None

@app.get("/api/stock-data")
async def get_stock_data():
    logger.info(f"Current stock cache status - has data: {cached_data['stock_data']['data'] is not None}")
    
    if cached_data["stock_data"]["data"]:
        logger.info("Returning cached stock data")
        return cached_data["stock_data"]["data"]
    
    logger.error("No stock data available in cache")
    return {"error": "Failed to fetch stock data"}

@app.get("/")
async def root():
    return {"message": "Server is running"}

# Modify the scheduler to run daily
scheduler = BackgroundScheduler()
scheduler.add_job(
    lambda: asyncio.run(update_cache()),
    'cron',
    hour=0,  # Run at midnight
    minute=0,
    next_run_time=datetime.now()  # Still run immediately on startup
)
scheduler.start()

@app.get("/api/events")
async def get_events():
    logger.info(f"Current events cache status - has data: {cached_data['event_data']['data'] is not None}")
    
    if cached_data["event_data"]["data"]:
        logger.info("Returning cached events data")
        return cached_data["event_data"]["data"]
    
    logger.error("No events data available in cache")
    return {"error": "Failed to fetch events data"}

# Graceful shutdown
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down scheduler...")
    scheduler.shutdown() 

# Add this at the start of your FastAPI app
@app.on_event("startup")
async def startup_event():
    logger.info("Starting up server...")
    # Perform initial cache update
    await update_cache()
    logger.info("Initial cache update complete") 

@app.get("/api/events-summary")
async def get_events_summary():
    logger.info("Generating events summary...")
    
    # First check if we have event data
    if not cached_data["event_data"]["data"] or not cached_data["event_data"]["data"].get("events"):
        logger.error("No event data available for summary")
        return {"error": "No event data available"}
    
    try:
        events = cached_data["event_data"]["data"]["events"]
        
        # Format events in a more readable way for the LLM
        events_summary = "\n\n".join([
            f"Event: {e['eventTitle']}\n"
            f"When: {e['eventDateTime']}\n"
            f"Where: {e['location']}\n"
            f"Description: {e['description'][:200]}..."  # Truncate long descriptions
            for e in events
        ])
        
        # Add logging to debug the input
        logger.info(f"Sending the following events to LLM:\n{events_summary}")
        
        # Run the analysis in a try-catch block
        try:
            summary = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: analysis_chain.run(events_summary=events_summary)
            )
            
            logger.info(f"Generated summary: {summary}")
            
            return {
                "summary": summary,
                "lastUpdated": datetime.now().isoformat(),
                "eventCount": len(events)
            }
            
        except Exception as chain_error:
            logger.error(f"Error in LLM chain: {chain_error}")
            return {"error": f"Failed to generate summary: {str(chain_error)}"}
            
    except Exception as e:
        logger.error(f"Error generating summary: {e}")
        return {"error": f"Failed to generate summary: {str(e)}"}

@app.get("/api/test-email")
async def test_email():
    """Test endpoint for email functionality"""
    test_data = EmailFormData(
        name="Test User",
        email="adulla10@gmail.com",  # Replace with your email
        hobbies="coding, reading, hiking",
        artist="Van Gogh",
        movie="The Matrix"
    )
    
    try:
        # Reuse the send_email function
        result = await send_email(test_data)
        return {
            "message": "Test email initiated",
            "result": result
        }
    except Exception as e:
        logger.error(f"Test email failed: {e}")
        return {"error": str(e)}

@app.post("/api/send-email")
async def send_email(form_data: EmailFormData):
    try:
        # Generate personalized message using OpenAI
        message = await asyncio.get_event_loop().run_in_executor(
            None,
            lambda: email_chain.run(
                name=form_data.name,
                hobbies=form_data.hobbies,
                artist=form_data.artist,
                movie=form_data.movie
            )
        )
        
        # Send email using Resend
        response = resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to": form_data.email,
            "subject": f"A Special Message for {form_data.name}",
            "text": message
        })
        
        logger.info(f"Email sent successfully to {form_data.email}")
        return {
            "success": True, 
            "message": "Email sent successfully",
            "generated_text": message
        }
        
    except Exception as e:
        logger.error(f"Error sending email: {e}")
        return {"success": False, "message": str(e)}

# Add session middleware
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv('SESSION_SECRET_KEY', 'your-secret-key')  # Change this!
)

# Configure OAuth
oauth = OAuth()
oauth.register(
    "auth0",
    client_id=os.getenv('AUTH0_CLIENT_ID'),
    client_secret=os.getenv('AUTH0_CLIENT_SECRET'),
    client_kwargs={
        "scope": "openid profile email",  # Basic OpenID scopes
    },
    server_metadata_url=f'https://{os.getenv("AUTH0_DOMAIN")}/.well-known/openid-configuration'
)

# LinkedIn API endpoints
@app.get("/api/auth/login")
async def auth_login(request):
    redirect_uri = request.url_for('auth_callback')
    return await oauth.auth0.authorize_redirect(request, redirect_uri)

@app.get("/api/auth/callback")
async def auth_callback(request):
    token = await oauth.auth0.authorize_access_token(request)
    user = await oauth.auth0.parse_id_token(request, token)
    request.session['user'] = dict(user)
    return {"success": True, "user": user}

@app.get("/api/auth/logout")
async def auth_logout(request):
    request.session.pop('user', None)
    return {"success": True}

@app.get("/api/linkedin/profile")
async def get_linkedin_profile(request):
    try:
        # Get access token from session
        user = request.session.get('user')
        if not user:
            return {"error": "Not authenticated"}

        # Get LinkedIn access token from Auth0 user
        linkedin_token = user.get('https://api.linkedin.com/access_token')
        if not linkedin_token:
            return {"error": "No LinkedIn access token"}

        # Make request to LinkedIn API
        headers = {
            'Authorization': f'Bearer {linkedin_token}',
            'Accept': 'application/json',
        }
        
        # Get basic profile
        profile_response = requests.get(
            'https://api.linkedin.com/v2/me',
            headers=headers
        )
        
        # Get positions
        positions_response = requests.get(
            'https://api.linkedin.com/v2/positions',
            headers=headers,
            params={'q': 'member'}
        )
        
        # Get education
        education_response = requests.get(
            'https://api.linkedin.com/v2/educations',
            headers=headers,
            params={'q': 'member'}
        )

        return {
            "profile": profile_response.json(),
            "positions": positions_response.json(),
            "education": education_response.json()
        }

    except Exception as e:
        logger.error(f"Error fetching LinkedIn profile: {e}")
        return {"error": str(e)}

# Add this to your existing email generation endpoint
@app.post("/api/generate-linkedin-email")
async def generate_linkedin_email(
    request: Request,
    profile_data: dict
):
    try:
        # Create a prompt template for LinkedIn data
        linkedin_prompt = ChatPromptTemplate.from_template("""
        You are writing a personalized email based on someone's LinkedIn profile.

        Profile Information:
        Name: {name}
        Current Position: {current_position}
        Company: {company}
        Experience: {experience}
        Education: {education}

        Write an engaging email that:
        1. Acknowledges their professional background
        2. Makes interesting connections between their experiences
        3. Suggests potential career opportunities or growth areas
        4. Ends with a professional call to action

        Keep the tone professional but friendly.
        """)

        # Generate the email content
        message = await asyncio.get_event_loop().run_in_executor(
            None,
            lambda: analysis_chain.run(
                name=profile_data.get('name'),
                current_position=profile_data.get('current_position'),
                company=profile_data.get('company'),
                experience=profile_data.get('experience'),
                education=profile_data.get('education')
            )
        )

        return {
            "success": True,
            "generated_text": message
        }

    except Exception as e:
        logger.error(f"Error generating LinkedIn email: {e}")
        return {"error": str(e)} 