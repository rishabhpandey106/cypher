'use client'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import { Message } from '@/models/User'
import { useToast } from './ui/use-toast'
import axios from 'axios'
import { apiResponse } from '@/types/apiResponse'
import dayjs from 'dayjs';
import Link from 'next/link';
type MessageCradProps = {
    message: Message,
    onDelete: (messageId: string) => void,
}

const MessageCard = ({message , onDelete}: MessageCradProps) => {
    const {toast} = useToast();
    const handleDeleteMessage = async () => {
        const res = await axios.delete<apiResponse>(`/api/deletemessage/${message._id}`);
        toast({
            title: "Message Deleted",
        })
        onDelete(message._id)
    }
  return (
    <Card className="card-bordered">
      
        <CardHeader>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50" variant="destructive"><X className='h-5 w-5'/></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            message.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteMessage}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            <CardDescription>Cypher - Secret Adventure</CardDescription>
        </CardHeader>
        <CardContent>
            <p className='text-3xl font-semibold'>{message.content}</p>
        </CardContent>
        <CardFooter>
        <div className='flex flex-row justify-between items-center'>
            <p className='mr-4'>{dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}</p>
            <Checkbox id="terms1" />
        </div>
        </CardFooter>
    </Card>
  )
}

export default MessageCard