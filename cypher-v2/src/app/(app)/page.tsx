'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export default function Home() {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div className="min-h-screen bg-pink-500 font-sans selection:bg-yellow-400 selection:text-black flex flex-col">
      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-16 md:py-24 relative overflow-hidden">
        
        {/* Background decorations */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-blue-500 border-4 border-black rotate-12 z-0 hidden md:block"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-yellow-400 border-4 border-black -rotate-6 z-0 hidden md:block"></div>

        <div className="w-full max-w-5xl relative z-10 flex flex-col items-center">
          
          <div className="bg-white border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center mb-12 transform -rotate-1">
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-black mb-6 leading-none">
              SEND <span className="text-pink-500">SECRET</span> MESSAGES.
            </h1>
            <p className="text-xl md:text-3xl font-bold uppercase tracking-tight bg-yellow-400 inline-block px-4 py-2 border-2 border-black transform rotate-2">
              No strings attached.
            </p>
          </div>

          <Link href="/dashboard" className="bg-blue-500 hover:bg-blue-600 text-white rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all font-black uppercase tracking-widest px-12 py-8 text-2xl md:text-3xl inline-flex items-center justify-center">
            DASHBOARD
          </Link>
        </div>
      </main>

      {/* Feature / Testimonial Grid Section */}
      <section className="bg-yellow-400 border-t-8 border-black py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-12 text-center text-black tracking-tighter">
            Why CYPHER?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Interactive Canvas Card */}
            <div 
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="group bg-black border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col relative overflow-hidden min-h-[250px]"
            >
              {hovered && (
                <div
                  className="h-full w-full absolute inset-0 z-0 animate-in fade-in duration-300"
                >
                  <CanvasRevealEffect
                    animationSpeed={5}
                    containerClassName="bg-transparent"
                    colors={[
                      [59, 130, 246],
                      [236, 72, 153],
                    ]}
                    opacities={[0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.4, 0.4, 0.4, 1]}
                    dotSize={2}
                  />
                </div>
              )}
              <div className="relative z-10 flex flex-col h-full justify-between pointer-events-none">
                <div className="bg-pink-500 border-2 border-black inline-block px-2 py-1 uppercase font-black text-white self-start transform -rotate-2">
                  Interactive
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase text-white mt-4">Reveal Secrets</h3>
                  <p className="text-gray-300 font-bold mt-2 uppercase text-sm">Hover over me.</p>
                </div>
              </div>
            </div>

            {/* Testimonial Cards */}
            {CARDS.map((card) => (
              <div key={card.id} className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col">
                <div className="bg-blue-500 border-2 border-black inline-block px-2 py-1 uppercase font-black text-white self-start transform rotate-1 mb-4">
                  {card.name}
                </div>
                <p className="text-xs font-bold uppercase text-gray-500 mb-4">{card.designation}</p>
                <div className="text-lg md:text-xl font-bold uppercase text-black leading-tight flex-grow">
                  {card.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white border-t-8 border-black p-8 md:p-12 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase px-6 py-6 text-lg">
                Secret Message For You
              </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-white border-t-8 border-black rounded-none">
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle className="text-3xl font-black uppercase text-black text-center mb-4">Do you believe in end-to-end encryption??</DrawerTitle>
                  <div className="flex flex-row gap-4 justify-center mt-6">
                    <DrawerClose asChild>
                      <Button className="bg-green-500 hover:bg-green-600 text-white rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase px-8 py-6 text-xl">
                        YES
                      </Button>
                    </DrawerClose>
                    <DrawerClose asChild>
                      <Button className="bg-red-500 hover:bg-red-600 text-white rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase px-8 py-6 text-xl">
                        NO
                      </Button>
                    </DrawerClose>
                  </div>
                </DrawerHeader>
              </div>
            </DrawerContent>
          </Drawer>

          <div className="text-xl font-black uppercase tracking-widest mt-8">
            © {new Date().getFullYear()} Cypher. All rights reserved.
          </div>
        </div>
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
        "font-black bg-pink-300 border-2 border-black text-black px-2 py-0.5 inline-block transform -rotate-1",
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
    name: "Madhusudan",
    designation: "Senior Looksmaxxxxer",
    content: (
      <p>
        These cards are amazing, <Highlight>I want to use them</Highlight> in my
        project. Brutalism is a godsend ngl tbh fam 🙏
      </p>
    ),
  },
  {
    id: 1,
    name: "Rishabh",
    designation: "Senior Shitposter",
    content: (
      <p>
        I probably would&apos;ve been <Highlight>6&apos;5&apos;&apos;</Highlight> , if my siblings did not walk over me as a child.
      </p>
    ),
  },
];