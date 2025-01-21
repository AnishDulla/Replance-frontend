'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { marked } from 'marked';

interface StockData {
  previousClose: string;
  marketOpen: string;
  lastUpdated: string;
}

interface EventData {
  eventTitle: string;
  eventDateTime: string;
  location: string;
  address: string;
  description: string;
}

interface EventsResponse {
  events: EventData[];
  lastUpdated: string;
}

export default function StockPage() {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [eventsData, setEventsData] = useState<EventsResponse | null>(null);
  const [eventsSummary, setEventsSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Starting data fetch...');
      
      // Fetch stock data
      console.log('Fetching stock data...');
      const stockResponse = await fetch('http://localhost:8001/api/stock-data', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!stockResponse.ok) {
        throw new Error(`HTTP error! status: ${stockResponse.status}`);
      }
      const stockData = await stockResponse.json();
      console.log('Stock data received:', stockData);
      setStockData(stockData);

      // Fetch events data
      console.log('Fetching events data...');
      const eventsResponse = await fetch('http://localhost:8001/api/events', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!eventsResponse.ok) {
        throw new Error(`HTTP error! status: ${eventsResponse.status}`);
      }
      const eventsData = await eventsResponse.json();
      console.log('Events data received:', eventsData);
      setEventsData(eventsData);
      
      // After events data is loaded, fetch the summary
      if (eventsData) {
        setSummaryLoading(true);
        const summaryResponse = await fetch('http://localhost:8001/api/events-summary', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json();
          if (!summaryData.error) {
            setEventsSummary(summaryData.summary);
          }
        }
        setSummaryLoading(false);
      }
      
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
      console.log('Fetch complete');
    }
  };

  // Add loading state logging
  useEffect(() => {
    console.log('Component mounted, starting initial fetch');
    fetchData();
    
    // Refresh every minute
    const interval = setInterval(fetchData, 60000);
    return () => {
      console.log('Component unmounting, clearing interval');
      clearInterval(interval);
    };
  }, []);

  // Add state change logging
  useEffect(() => {
    console.log('Current loading state:', loading);
    console.log('Current stock data:', stockData);
    console.log('Current events data:', eventsData);
  }, [loading, stockData, eventsData]);

  // Improve loading state display
  if (loading) return (
    <div className="container mx-auto p-4">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mx-auto p-4">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    </div>
  );

  if (!stockData || !eventsData) return (
    <div className="container mx-auto p-4">
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
        <p className="font-bold">Loading Data</p>
        <p>Please wait while we fetch the latest information...</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Stock Data Section */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Adobe (ADBE) Stock Price</h1>
        <Card className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold">Previous Close</h2>
              <p className="text-3xl">${stockData.previousClose}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Market Open</h2>
              <p className="text-3xl">${stockData.marketOpen}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">
                Last updated: {new Date(stockData.lastUpdated).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Events Data Section */}
      <div>
        <h1 className="text-2xl font-bold mb-4">San Francisco Events</h1>
        <Card className="p-6">
          <div className="space-y-6">
            {eventsData?.events.map((event, index) => (
              <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                <h2 className="text-xl font-semibold mb-2">{event.eventTitle}</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-600">Date & Time</p>
                    <p>{event.eventDateTime}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Location</p>
                    <p>{event.location}</p>
                    <p className="text-gray-500">{event.address}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-medium text-gray-600">Description</p>
                    <p className="text-gray-700">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="text-sm text-gray-500">
              Last updated: {new Date(eventsData?.lastUpdated || '').toLocaleString()}
            </div>
          </div>
        </Card>
      </div>

      {/* AI Summary Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">AI Events Overview</h2>
        <Card className="p-6">
          {summaryLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
            </div>
          ) : eventsSummary ? (
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: marked(eventsSummary) 
              }}
            />
          ) : (
            <p className="text-gray-500">No summary available</p>
          )}
        </Card>
      </div>
    </div>
  );
} 