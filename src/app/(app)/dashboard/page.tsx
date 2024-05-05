'use client'
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { Message } from '@/models/User'
import { acceptMessageSchema } from '@/schema/acceptMessageSchema'
import { apiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { HoverEffect } from "../../../components/ui/card-hover-effect";

const page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setloading] = useState(false)
  const [switchLoading, setSwitchLoading] = useState(false)

  const {toast} = useToast();

  const handleDeleteMessage = async (messageId: string) => {
    setMessages(messages.filter((message) => messageId !== message._id))
  }

  const {data: session} = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const {watch , register , setValue} = form;

  const acceptMessages = watch('acceptMessages')

  const fetchActiveMessages = useCallback(async () => {
    setSwitchLoading(true);
    try {
      const res = await axios.get<apiResponse>("/api/acceptmessages")
      setValue("acceptMessages", res.data.isAccepting)
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
      setMessages(res.data.messages || [])

      if(refresh){
        toast({
          title: "Messages Reloaded",
          description: "Showing Latest Messages"
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
  }, [setloading, setMessages])

  useEffect(() => {
    if(!session || !session.user)
      return;
    fetchActiveMessages();
    fetchMessages();

  }, [session, toast, setValue, fetchActiveMessages, fetchMessages])
  
  const handleSwitchChange = async () => {
    try {
      const res = await axios.post("/api/acceptmessages", {acceptMessages : !acceptMessages});
      setValue("acceptMessages", !acceptMessages)
      toast({
        title: res.data.message,
        variant: "default"
      })
    } catch (error) {
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
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const url = `${baseUrl}/u/${username}`;

  const copyToClipboard = async () => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "Profile URL has been copied to clipboard."
    })
  }

  if(!session || !session.user){
    return <div>404</div>
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={url}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={switchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
                key={message._id}
                message={message}
                onDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );

}

export default page