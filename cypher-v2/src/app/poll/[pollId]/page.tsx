"use client"

import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Zap, CheckCircle } from 'lucide-react';
import { useParams } from 'next/navigation';

interface PollOption {
  id: string;
  text: string;
  freeVotes: number;
  boostedVotes: number;
}

interface Poll {
  _id: string;
  question: string;
  options: PollOption[];
  isActive: boolean;
  userId: { _id: string, username: string };
}

export default function PollPage() {
  const { pollId } = useParams<{ pollId: string }>();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVotedFree, setHasVotedFree] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await axios.get(`/api/polls/${pollId}`);
        setPoll(res.data.poll);
        // Check local storage for free vote
        if (localStorage.getItem(`voted_poll_${pollId}`)) {
          setHasVotedFree(true);
        }
      } catch (error) {
        toast({
          title: "Error fetching poll",
          variant: "destructive",
          className: "border-4 border-black font-bold uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPoll();
  }, [pollId, toast]);

  const handleFreeVote = async (optionId: string) => {
    if (hasVotedFree || !poll) return;
    setIsVoting(true);
    try {
      const res = await axios.post('/api/polls/vote', { pollId: poll._id, optionId });
      setPoll(res.data.poll);
      setHasVotedFree(true);
      localStorage.setItem(`voted_poll_${poll._id}`, 'true');
      toast({
        title: "Vote Cast!",
        description: "Your free vote has been recorded.",
        className: "border-4 border-black font-bold uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-green-300 text-black",
      });
    } catch (error) {
      toast({
        title: "Vote Failed",
        description: "You may have already voted or an error occurred.",
        variant: "destructive",
        className: "border-4 border-black font-bold uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
      });
    } finally {
      setIsVoting(false);
    }
  };

  const handleBoostVote = async (optionId: string) => {
    if (!poll) return;
    setIsVoting(true);
    try {
      const return_url = `${window.location.origin}/poll/${poll._id}?status=succeeded`;
      const res = await axios.post('/api/payments/checkout', {
        pollId: poll._id,
        optionId,
        amount: 100, // Sends $1 default, but they can pay what they want on Dodo
        return_url
      });
      window.location.href = res.data.checkout_url;
    } catch (error) {
      toast({
        title: "Checkout Error",
        variant: "destructive",
        className: "border-4 border-black font-bold uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
      });
      setIsVoting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-yellow-400 flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin border-black text-black" /></div>;
  }

  if (!poll) {
    return <div className="min-h-screen bg-yellow-400 flex items-center justify-center font-black text-4xl uppercase">Poll Not Found</div>;
  }

  return (
    <div className="min-h-screen bg-yellow-400 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-pink-500 selection:text-white flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-10 -left-10 w-32 h-32 bg-blue-500 border-4 border-black rotate-12 z-0 hidden md:block"></div>
      <div className="absolute bottom-20 -right-10 w-40 h-40 bg-pink-500 border-4 border-black -rotate-6 z-0 hidden md:block"></div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="bg-white border-4 border-black p-6 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none mb-12 mt-4 md:mt-0">
          <div className="flex justify-between items-center mb-6">
            <span className="bg-black text-yellow-400 font-black uppercase text-sm px-3 py-1 border-2 border-black -rotate-2">⚡ CYPHER POLL</span>
            {poll.userId?.username && <span className="font-bold text-gray-500 uppercase">By @{poll.userId.username}</span>}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black mb-8 leading-tight">
            {poll.question}
          </h1>

          {!poll.isActive && (
            <div className="bg-red-500 border-4 border-black text-white font-black uppercase p-4 mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center text-xl tracking-widest transform -rotate-1">
              POLL CLOSED - FINAL RESULTS
            </div>
          )}

          <div className="space-y-6">
            {poll.options.map((option) => {
              const totalOptionVotes = option.freeVotes + option.boostedVotes;
              const totalPollVotes = poll.options.reduce((sum, opt) => sum + opt.freeVotes + opt.boostedVotes, 0);
              const percentage = totalPollVotes === 0 ? 0 : Math.round((totalOptionVotes / totalPollVotes) * 100);

              return (
                <div key={option.id} className="relative group">
                  <div className="border-4 border-black bg-gray-50 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-black text-xl uppercase">{option.id}. {option.text}</span>
                      <span className="font-bold text-gray-600">{totalOptionVotes} Votes ({percentage}%)</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-4 bg-gray-200 border-2 border-black mb-4 overflow-hidden">
                      <div className="h-full bg-black transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                    </div>

                    {poll.isActive && (
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                          disabled={isVoting || hasVotedFree}
                          onClick={() => handleFreeVote(option.id)}
                          className="flex-1 bg-white text-black hover:bg-gray-100 border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase"
                        >
                          {hasVotedFree ? <CheckCircle className="mr-2 h-4 w-4" /> : "Vote (Free)"}
                        </Button>
                        
                        <Button 
                          // disabled={isVoting}
                          disabled
                          onClick={() => handleBoostVote(option.id)}
                          className="flex-1 bg-pink-500 text-white hover:bg-pink-600 border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase"
                        >
                          <Zap className="mr-2 h-4 w-4 fill-white" /> BOOST VOTE <span className="text-xs">(UPCOMING)</span>
                        </Button>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
