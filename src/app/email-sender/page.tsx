'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface FormData {
  name: string;
  email: string;
  hobbies: string;
  artist: string;
  movie: string;
}

export default function EmailSender() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    hobbies: '',
    artist: '',
    movie: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:8001/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setMessage(data.success ? 'Email sent successfully!' : 'Failed to send email');
      
      if (data.generated_text) {
        setGeneratedText(data.generated_text);
      }
    } catch (error) {
      setMessage('Error sending email');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Email Sender</h1>
      <Card className="max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="hobbies">Favorite Hobbies</Label>
            <Input
              id="hobbies"
              value={formData.hobbies}
              onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="artist">Favorite Musical Artist</Label>
            <Input
              id="artist"
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="movie">Favorite Movie</Label>
            <Input
              id="movie"
              value={formData.movie}
              onChange={(e) => setFormData({ ...formData, movie: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Email'}
          </Button>

          {message && (
            <div className={`mt-4 p-4 rounded ${
              message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}

          {generatedText && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Generated Message:</h2>
              <div className="whitespace-pre-wrap">{generatedText}</div>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
} 