'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function AdminPayouts() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/payouts');
      setUsers(res.data.users || []);
    } catch (error: any) {
      toast({ title: 'Error fetching payouts', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const handleReset = async (username: string) => {
    try {
      await axios.post('/api/admin/payouts/reset', { username });
      toast({ title: 'Balance Reset', description: `${username}'s wallet has been zeroed out.` });
      fetchPayouts();
    } catch (error: any) {
      toast({ title: 'Error resetting balance', description: error.message, variant: 'destructive' });
    }
  };

  // Only Rishabh (or whoever) should see this page.
  // In a real app, protect this in middleware or via session.user.role.
  if (session?.user?.username !== 'rishabh' && session?.user?.username !== 'jaiyaxh') {
    return <div className="p-10 text-center font-black text-2xl uppercase">Unauthorized</div>;
  }

  return (
    <div className="min-h-screen bg-pink-500 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black mb-8 border-b-4 border-black pb-4">
            End of Month <span className="text-pink-500">Payouts</span>
          </h1>

          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin h-10 w-10" /></div>
          ) : users.length === 0 ? (
            <div className="text-xl font-bold uppercase text-center p-10 bg-gray-100 border-4 border-black">
              No pending payouts. Everyone is broke.
            </div>
          ) : (
            <div className="space-y-6">
              {users.map(user => (
                <div key={user.username} className="flex flex-col md:flex-row items-center justify-between border-4 border-black bg-yellow-400 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div>
                    <h3 className="text-2xl font-black uppercase">@{user.username}</h3>
                    <p className="font-bold text-gray-800">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <div className="text-3xl font-black bg-white border-4 border-black px-4 py-2">
                      ₹{user.walletBalance}
                    </div>
                    <Button 
                      onClick={() => handleReset(user.username)}
                      className="bg-black hover:bg-gray-800 text-white rounded-none border-4 border-black font-black uppercase px-6 py-6"
                    >
                      Mark Paid & Reset
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
