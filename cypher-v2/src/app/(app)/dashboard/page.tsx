'use client'
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { Message } from '@/models/User'
import { acceptMessageSchema } from '@/schema/acceptMessageSchema'
import { apiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw, Copy, ChevronLeft, ChevronRight } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import dayjs from 'dayjs'

function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setloading] = useState(false)
  const [switchLoading, setSwitchLoading] = useState(false)
  const [viewDate, setViewDate] = useState(dayjs())
  const [showEmbed, setShowEmbed] = useState(false)
  const [walletBalance, setWalletBalance] = useState(0)

  const { toast } = useToast();

  const handleDeleteMessage = async (messageId: string) => {
    setMessages(messages.filter((message) => messageId !== String(message._id)))
  }

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: false
    }
  })

  const { watch, register, setValue } = form;

  const acceptMessages = watch('acceptMessages')

  const fetchActiveMessages = useCallback(async () => {
    setSwitchLoading(true);
    try {
      const res = await axios.get<apiResponse>("/api/acceptmessages")
      setValue("acceptMessages", res.data.isAccepting ?? false)
    } catch (error) {
      const axioserror = error as AxiosError<apiResponse>
      toast({
        title: "Error",
        description: axioserror.response?.data.message,
        variant: "destructive"
      })
    } finally {
      setSwitchLoading(false);
    }
  }, [setValue, toast])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setSwitchLoading(false);
    setloading(true);
    try {
      const res = await axios.get<apiResponse>("/api/getmessages");
      console.log(res.data.messages)
      // Sort messages: Boosted messages first, then chronologically
      const fetchedMessages = res.data.messages || [];
      fetchedMessages.sort((a: any, b: any) => {
        if (a.isBoosted && !b.isBoosted) return -1;
        if (!a.isBoosted && b.isBoosted) return 1;
        return 0; // maintain default date sort from backend
      });
      setMessages(fetchedMessages)
      
      // We need to type-cast res.data to include walletBalance since apiResponse type might not have it yet
      setWalletBalance((res.data as any).walletBalance || 0)

      if (refresh) {
        toast({
          title: "Messages Reloaded",
          description: "Showing Latest Messages",
          className: "border-4 border-black font-bold uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        })
      }
    } catch (error) {
      const axioserror = error as AxiosError<apiResponse>
      toast({
        title: "Error",
        description: axioserror.response?.data.message,
        variant: "destructive"
      })
    } finally {
      setSwitchLoading(false);
      setloading(false)
    }
  }, [setloading, setMessages, toast])

  useEffect(() => {
    if (!session || !session.user)
      return;
    fetchActiveMessages();
    fetchMessages();

  }, [session, toast, setValue, fetchActiveMessages, fetchMessages])

  const handleSwitchChange = async (checked: boolean) => {
    setValue("acceptMessages", checked);
    try {
      const res = await axios.post("/api/acceptmessages", { acceptMessages: checked });
      toast({
        title: res.data.message,
        variant: "default",
        className: "border-4 border-black font-bold uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
      })
    } catch (error) {
      setValue("acceptMessages", !checked);
      const axioserror = error as AxiosError<apiResponse>
      toast({
        title: "Error",
        description: axioserror.response?.data.message,
        variant: "destructive"
      })
    }
  }

  const username = session?.user.username
  console.log(username)
  
  const [baseUrl, setBaseUrl] = useState('https://cypher.itsrishabh.tech');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    }
  }, []);

  const url = `${baseUrl}/u/${username}`;

  const copyToClipboard = async () => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied!",
      description: "Profile URL has been copied to clipboard.",
      className: "border-4 border-black font-bold uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-green-300 text-black",
    })
  }

  const handlePrevDay = () => setViewDate(prev => prev.subtract(1, 'day'));
  const handleNextDay = () => {
    if (!viewDate.isSame(dayjs(), 'day')) {
      setViewDate(prev => prev.add(1, 'day'));
    }
  };

  const displayedMessages = messages.filter(m => dayjs(m.createdAt).isSame(viewDate, 'day'));

  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-blue-500 flex flex-col items-center justify-center gap-6 p-8">
        <div className="text-5xl md:text-7xl font-black uppercase text-white">
          Authenticating
        </div>

        <div className="w-full max-w-xl h-8 border-4 border-black overflow-hidden bg-white">
          <div className="h-full w-1/2 bg-black animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-500 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-yellow-400 selection:text-black relative overflow-hidden">

      {/* Background decorations */}
      <div className="absolute top-20 right-10 w-48 h-48 bg-yellow-400 border-4 border-black rotate-12 z-0 hidden lg:block"></div>
      <div className="absolute bottom-40 left-10 w-32 h-32 bg-pink-500 border-4 border-black -rotate-6 z-0 hidden lg:block"></div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header Section */}
        <div className="bg-white border-4 border-black p-6 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-black break-words leading-none">
              USER <span className="bg-yellow-400 text-black px-2 inline-block transform -rotate-1">DASHBOARD</span>
            </h1>

            <div className="bg-green-300 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center transform rotate-1 min-w-[200px]">
              <div className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-1">Creator Earnings</div>
              <div className="text-4xl font-black">₹{Number(walletBalance).toFixed(2)}</div>
              <div className="text-xs font-bold uppercase mt-1">End of month payout</div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-black uppercase mb-4 tracking-tight">Copy Your Unique Link</h2>
            <div className="flex flex-col md:flex-row items-stretch gap-4">
              <input
                type="text"
                value={url}
                disabled
                className="w-full p-4 border-4 border-black rounded-none text-lg font-bold bg-gray-100 text-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
              <Button
                onClick={copyToClipboard}
                className="bg-pink-500 hover:bg-pink-600 text-white rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase px-8 py-7 md:py-0 text-xl w-full md:w-auto"
              >
                <Copy className="mr-2 h-6 w-6" strokeWidth={3} /> COPY
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-t-4 border-black pt-8 gap-6">
            <div className="flex items-center gap-4 bg-gray-100 p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full md:w-auto">
              <Switch
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={switchLoading}
                className="border-2 border-black data-checked:bg-green-500 data-unchecked:bg-red-500 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
              <span className="text-xl font-black uppercase">
                Accepting: <span className={acceptMessages ? 'text-green-600' : 'text-red-600'}>{acceptMessages ? 'ON' : 'OFF'}</span>
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <Button 
                onClick={() => setShowEmbed(!showEmbed)}
                variant="outline"
                className="bg-yellow-400 hover:bg-yellow-500 text-black border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase px-6 py-6 text-lg w-full md:w-auto"
              >
                {showEmbed ? "HIDE EMBED" : "GET EMBED"}
              </Button>
              <Button
                className="bg-white text-black hover:bg-gray-200 border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase px-6 py-6 text-lg w-full md:w-auto"
                onClick={(e) => {
                  e.preventDefault();
                  fetchMessages(true);
                }}
              >
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                ) : (
                  <RefreshCcw className="h-6 w-6 mr-2" strokeWidth={3} />
                )}
                {loading ? 'LOADING...' : 'REFRESH'}
              </Button>
            </div>
          </div>

          {showEmbed && (
            <div className="bg-yellow-100 border-4 border-black p-6 mt-8">
              <h3 className="font-black uppercase mb-4 text-xl">Website Embed Snippet</h3>
              <div className="flex flex-col md:flex-row items-stretch gap-4">
                <input
                  type="text"
                  value={`<iframe src="${baseUrl}/embed/${username}" width="100%" height="350" style="border:none; border-radius: 0px; background: transparent;"></iframe>`}
                  disabled
                  className="w-full p-4 border-4 border-black rounded-none text-lg font-bold bg-white text-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono text-sm"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(`<iframe src="${baseUrl}/embed/${username}" width="100%" height="350" style="border:none; border-radius: 0px; background: transparent;"></iframe>`);
                    toast({
                      title: "Embed Code Copied!",
                      description: "Paste it anywhere on your portfolio.",
                      className: "border-4 border-black font-bold uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-green-300 text-black",
                    });
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase px-8 py-7 md:py-0 text-xl w-full md:w-auto"
                >
                  <Copy className="mr-2 h-6 w-6" strokeWidth={3} /> COPY
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Date Navigator & Messages Section */}
        <div className="mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <h2 className="text-4xl font-black uppercase text-white tracking-tighter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] stroke-black">Your Messages</h2>
            
            {/* Daily Drop Navigator */}
            <div className="flex items-center bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-2 gap-4">
              <Button 
                onClick={handlePrevDay}
                className="bg-yellow-400 hover:bg-yellow-500 text-black border-4 border-black rounded-none p-2 h-auto hover:-translate-x-1 transition-all"
              >
                <ChevronLeft strokeWidth={3} className="h-6 w-6" />
              </Button>
              
              <div className="text-2xl font-black uppercase min-w-[180px] text-center">
                {viewDate.isSame(dayjs(), 'day') ? "TODAY" : viewDate.format('MMM DD, YYYY')}
              </div>

              <Button 
                onClick={handleNextDay}
                disabled={viewDate.isSame(dayjs(), 'day')}
                className="bg-yellow-400 hover:bg-yellow-500 text-black border-4 border-black rounded-none p-2 h-auto disabled:opacity-50 disabled:cursor-not-allowed hover:translate-x-1 transition-all"
              >
                <ChevronRight strokeWidth={3} className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {displayedMessages.length > 0 ? (
              displayedMessages.map((message, index) => (
                <MessageCard
                  key={String(message._id)}
                  message={message}
                  onDelete={handleDeleteMessage}
                />
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 bg-white border-4 border-black p-12 text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform rotate-1 mt-4">
                <p className="text-3xl font-black uppercase text-black mb-4">No secrets dropped on this day.</p>
                {viewDate.isSame(dayjs(), 'day') ? (
                  <p className="text-xl font-bold uppercase text-pink-600 bg-pink-200 inline-block px-4 py-2 border-2 border-black">Share your link to get some!</p>
                ) : (
                  <Button onClick={() => setViewDate(dayjs())} className="bg-black hover:bg-gray-800 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all rounded-none font-black uppercase px-6 py-4 mt-2">
                    BACK TO TODAY
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard