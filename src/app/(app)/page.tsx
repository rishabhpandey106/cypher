'use client'
import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { CardStack } from "../../components/ui/card-stack";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

// export const Home = () => {
//   return (
//     <main className='flex-grow flex flex-col items-center jusify-center px-4 py-12 md:px-24'>
//       <section className='text-center mb-8 md:mb-12'>
//         <h1 className='text-3xl font-extrabold md:text-5xl'>Dive into secret world of messages</h1>
//         <p className='mt-3 md:mt-4 text-base md:textlg'>Explore Cypher - Anonymously Anonymous</p>
//       </section>
//     </main>
//   )
// }

export default function Home() {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="overflow-hidden">
    <div 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="h-[34.5rem] flex flex-col lg:flex-row overflow-hidden items-center justify-center bg-black w-full gap-4 mx-auto px-8 relative">
  
    <div className="h-[35rem] flex items-center justify-center w-full">
      <CardStack items={CARDS} />
    </div>
  <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full absolute inset-0"
          >
            <CanvasRevealEffect
              animationSpeed={5}
              containerClassName="bg-transparent"
              colors={[
                [59, 130, 246],
                [139, 92, 246],
              ]}
              opacities={[0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.4, 0.4, 0.4, 1]}
              dotSize={2}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] bg-black/50 dark:bg-black/90" />
      
  </div>
  <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
    <div className='flex-col text-pink-500 animate-pulse'><Drawer>
      <DrawerTrigger>Secret Message For You</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Do you believe in end-to-end encryption??</DrawerTitle>
          <DrawerDescription>
          <DrawerClose>
          <Button variant="default" className='mr-2'>Yes</Button>
          </DrawerClose>
          <DrawerClose>
          <Button variant="destructive">No</Button>
          </DrawerClose>
          </DrawerDescription>
        </DrawerHeader>
        {/* <DrawerFooter>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter> */}
      </DrawerContent>
    </Drawer></div>

        <div className='flex-col'>© 2024 Cypher. All rights reserved.</div>
  </footer>
  </div>
  );
}

const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-700/[0.2] dark:text-emerald-500 px-1 py-0.5",
        className
      )}
    >
      {children}
    </span>
  );
};

const CARDS = [
  {
    id: 0,
    name: "Manu Arora",
    designation: "Senior Software Engineer",
    content: (
      <p>
        These cards are amazing, <Highlight>I want to use them</Highlight> in my
        project. Framer motion is a godsend ngl tbh fam 🙏
      </p>
    ),
  },
  {
    id: 1,
    name: "Elon Musk",
    designation: "Senior Shitposter",
    content: (
      <p>
        I dont like this Twitter thing,{" "}
        <Highlight>deleting it right away</Highlight> because yolo. Instead, I
        would like to call it <Highlight>X.com</Highlight> so that it can easily
        be confused with adult sites.
      </p>
    ),
  },
  {
    id: 2,
    name: "Tyler Durden",
    designation: "Manager Project Mayhem",
    content: (
      <p>
        The first rule of
        <Highlight>Fight Club</Highlight> is that you do not talk about fight
        club. The second rule of
        <Highlight>Fight club</Highlight> is that you DO NOT TALK about fight
        club.
      </p>
    ),
  },
];