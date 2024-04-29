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
    <Card>
        <CardHeader>
            <CardTitle>Card Title</CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive"><X className='h-5 w-5'/></Button>
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
            <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
            <p>Card Content</p>
        </CardContent>
        <CardFooter>
            <p>Card Footer</p>
        </CardFooter>
    </Card>

  )
}

export default MessageCard