import { useState } from 'react';
import { Search } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TicketStatusPage() {
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ticket, setTicket] = useState<any>(null);

  const checkStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError('');
    setTicket(null);

    try {
      const res = await fetch(`/api/status/${trackingId.trim()}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setTicket(data.ticket);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Check Ticket Status
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Enter your Tracking ID to view the admin's reply to your message.
          </p>
        </div>

        <form onSubmit={checkStatus} className="mb-12 max-w-md mx-auto relative flex items-center">
          <Input 
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="e.g. TK-48F9A1" 
            className="pr-24 py-6 text-lg"
          />
          <Button 
            type="submit" 
            disabled={loading}
            className="absolute right-2 h-10"
          >
            {loading ? 'Checking...' : <><Search className="w-4 h-4 mr-2" /> Check</>}
          </Button>
        </form>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md text-center">
            {error}
          </div>
        )}

        {ticket && (
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Ticket Details: {ticket.tracking_id}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Status: <span className={`font-semibold ${ticket.status === 'replied' ? 'text-green-600' : 'text-yellow-600'}`}>{ticket.status.toUpperCase()}</span>
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Your Message</h4>
                <div className="mt-2 bg-gray-50 p-4 rounded-md text-gray-700 whitespace-pre-wrap">
                  {ticket.message}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Admin Reply</h4>
                <div className="mt-2">
                  {ticket.admin_reply ? (
                    <div className="bg-blue-50 p-4 rounded-md text-blue-900 whitespace-pre-wrap border border-blue-100">
                      {ticket.admin_reply}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">No reply yet. Please check back later.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
