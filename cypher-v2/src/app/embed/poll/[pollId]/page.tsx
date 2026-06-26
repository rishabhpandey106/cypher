"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Zap, CheckCircle } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';

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

export default function PollEmbedPage() {
  const { pollId } = useParams<{ pollId: string }>();
  const searchParams = useSearchParams();
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const observer = new ResizeObserver(() => {
      window.parent.postMessage({
        type: 'cypher-poll-resize',
        pollId,
        height: document.body.scrollHeight
      }, '*');
    });
    observer.observe(document.body);
    return () => observer.disconnect();
  }, [pollId, poll]);


  useEffect(() => {
    if (searchParams.get('status') === 'succeeded') {
      setTimeout(() => {
        toast({
          title: "Vote Boosted!",
          description: "Your boosted votes have been added successfully. ⚡",
          className: "border-4 border-black font-bold uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-green-300 text-black",
        });
      }, 300);

      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('status');
        url.searchParams.delete('payment_id');
        window.history.replaceState({}, document.title, url.toString());
      }
    }
  }, [searchParams, toast]);

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
      const returnUrl = searchParams.get('return_url') || undefined;
      const res = await axios.post('/api/payments/checkout', {
        pollId: poll._id,
        optionId,
        amount: 100, // Default $1, user can choose amount on Dodo Checkout
        return_url: returnUrl
      });
      if (res.data.checkout_url) {
        if (window.top) {
          window.top.location.href = res.data.checkout_url;
        } else {
          window.location.href = res.data.checkout_url;
        }
      }
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
    return <div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin border-black text-black" /></div>;
  }

  if (!poll) {
    return <div className="min-h-screen bg-white flex items-center justify-center font-black text-2xl uppercase">Poll Not Found</div>;
  }

  return (
    <>
      <style>{`body { background: transparent !important; }`}</style>
      <div className="bg-transparent p-4 font-sans flex flex-col w-full h-full">
        <div className="w-full max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            {/* <span ref="https://cypher.itsrishabh.tech" className="bg-black text-yellow-400 font-black uppercase text-xs px-2 py-1 border-2 border-black -rotate-2">⚡ CYPHER POLL</span> */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-black bg-yellow-400 border-2 border-black px-2 py-1 uppercase text-black hover:bg-yellow-300 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
            >
              ⚡ Built with Cypher
            </a>
            {poll.userId?.username && <span className="font-bold text-gray-500 uppercase text-xs">By @{poll.userId.username}</span>}
          </div>

          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-black mb-6 leading-tight">
            {poll.question}
          </h1>

          {!poll.isActive && (
            <div className="bg-red-500 border-4 border-black text-white font-black uppercase p-3 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center text-lg tracking-widest transform -rotate-1">
              POLL CLOSED - FINAL RESULTS
            </div>
          )}

          <div className="space-y-4">
            {poll.options.map((option) => {
              const totalOptionVotes = option.freeVotes + option.boostedVotes;
              const totalPollVotes = poll.options.reduce((sum, opt) => sum + opt.freeVotes + opt.boostedVotes, 0);
              const percentage = totalPollVotes === 0 ? 0 : Math.round((totalOptionVotes / totalPollVotes) * 100);

              return (
                <div key={option.id} className="relative group">
                  <div className="border-4 border-black bg-gray-50 p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">

                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-lg uppercase">{option.id}. {option.text}</span>
                      <span className="font-bold text-gray-600 text-sm">{totalOptionVotes} Votes ({percentage}%)</span>
                    </div>

                    <div className="w-full h-3 bg-gray-200 border-2 border-black mb-3 overflow-hidden">
                      <div className="h-full bg-black transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                    </div>

                    {poll.isActive && (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          disabled={isVoting || hasVotedFree}
                          onClick={() => handleFreeVote(option.id)}
                          className="flex-1 bg-white text-black hover:bg-gray-100 border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase text-xs h-10"
                        >
                          {hasVotedFree ? <CheckCircle className="mr-1 h-3 w-3" /> : "Vote (Free)"}
                        </Button>

                        <Button
                          // disabled={isVoting}
                          disabled
                          onClick={() => handleBoostVote(option.id)}
                          className="flex-1 bg-pink-500 text-white hover:bg-pink-600 border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase text-xs h-10"
                        >
                          <Zap className="mr-1 h-3 w-3 fill-white" /> BOOST VOTE <span className="text-xs">(UPCOMING)</span>
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
    </>
  );
}
