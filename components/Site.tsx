'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, Menu, X, Crosshair } from 'lucide-react'
import type { Problem } from '@/lib/types'
import { fetchPublic } from '@/lib/api'

const links = [['HOME','home'],['REVEALS','reveals'],['ABOUT','about']]

function Navbar(){
  const [open,setOpen]=useState(false); const [active,setActive]=useState('home')
  useEffect(()=>{const on=()=>{let a='home';links.forEach(([,id])=>{const e=document.getElementById(id);if(e&&e.getBoundingClientRect().top<200)a=id});setActive(a)};on();addEventListener('scroll',on);return()=>removeEventListener('scroll',on)},[])
  const item=(l:string,id:string)=><a key={id} href={`#${id}`} onClick={()=>setOpen(false)} className={`font-display text-xs tracking-[.2em] pb-1 border-b ${active===id?'border-doom text-ink':'border-transparent text-mute hover:text-ink'}`}>{l}</a>
  return <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-3xl rounded-3xl md:rounded-full border border-white/10 bg-black/60 backdrop-blur-md px-6 py-3">
    <div className="flex items-center justify-between">
      <span className="font-display tracking-[.3em] text-sm">DEEP<span className="text-doom">LABS</span></span>
      <div className="hidden md:flex gap-7 items-center">{links.map(([l,id])=>item(l,id))}<Link href="/admin/login" className="font-display text-xs tracking-[.2em] text-mute/60 hover:text-ink">ADMIN</Link></div>
      <button className="md:hidden" aria-label="Toggle menu" onClick={()=>setOpen(!open)}>{open?<X size={20}/>:<Menu size={20}/>}</button>
    </div>
    {open&&<div className="md:hidden flex flex-col gap-4 pt-4">{links.map(([l,id])=>item(l,id))}<Link href="/admin/login" className="font-display text-xs tracking-[.2em] text-mute">ADMIN</Link></div>}
  </nav>
}

function Hero(){
  const {scrollY}=useScroll(); const y=useTransform(scrollY,[0,600],[0,120]); const o=useTransform(scrollY,[0,500],[1,0])
  const up=(d:number)=>({initial:{opacity:0,y:28,filter:'blur(10px)'},animate:{opacity:1,y:0,filter:'blur(0px)'},transition:{duration:1.1,delay:d}})
  return <section id="home" className="relative min-h-[100svh] flex items-center justify-center text-center px-6">
    <motion.div style={{y,opacity:o}} className="flex flex-col items-center">
      <div className="absolute w-[70vw] max-w-[700px] aspect-square rounded-full bg-doom/20 blur-[110px] -z-10 animate-pulse"/>
      <motion.p {...up(.3)} className="font-display text-xs tracking-[.5em] text-metal mb-6">DEEPLABS PRESENTS</motion.p>
      <motion.h1 {...up(.7)} className="font-display font-black text-[2.1rem] min-[400px]:text-5xl sm:text-7xl md:text-9xl tracking-[.08em] sm:tracking-[.12em] text-metal drop-shadow-[0_0_30px_rgba(34,224,107,.4)]">NEURAL CRUNCH</motion.h1>
      <motion.p {...up(1.2)} className="font-display tracking-[.2em] sm:tracking-[.35em] text-xs sm:text-sm md:text-lg mt-6">THE NEXT CHAPTER BEGINS.</motion.p>  
      <motion.p {...up(1.5)} className="font-display text-doom tracking-[.15em] sm:tracking-[.25em] mt-8 text-base sm:text-lg md:text-2xl">HACKATHON COMING SOON</motion.p>
      <motion.p {...up(1.7)} className="text-mute mt-4 max-w-md">Twelve challenges. One arena. The future is yours to build.</motion.p>
      <motion.a {...up(2)} href="#reveals" className="mt-10 active:scale-95 border border-doom bg-doom/10 hover:bg-doom/25 px-8 py-3 font-display text-xs tracking-[.3em] transition">ENTER THE INITIATIVE</motion.a>
      <motion.p {...up(2.2)} className="mt-6 text-[10px] tracking-[.2em] sm:tracking-[.35em] text-mute">CLASSIFIED CHALLENGE ARCHIVE // ACCESS PENDING</motion.p>
    </motion.div>
    <ChevronDown className="absolute bottom-8 text-mute animate-bounce" aria-hidden/>
  </section>
}

function ProblemCard({p,i}:{p:Problem;i:number}){
  const n=String(p.number).padStart(2,'0')
  return <motion.article initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.7,delay:(i%3)*.12}}
    className={`relative overflow-hidden min-h-[260px] sm:min-h-[320px] border p-5 sm:p-6 flex flex-col bg-gradient-to-b from-s2 to-s1 transition ${p.is_revealed?'border-doom/60 shadow-[0_0_30px_rgba(34,224,107,.15)]':'border-white/10 hover:border-doom/50 hover:shadow-[0_0_30px_rgba(34,224,107,.2)]'}`}>
    <div className="flex justify-between items-center font-display text-xs tracking-[.2em]">
      <span className="text-doom">#{n}</span>
      <span className={`border px-2 py-1 text-[10px] ${p.is_revealed?'border-doom text-doom':'border-white/20 text-mute'}`}>{p.is_revealed?'REVEALED':'CLASSIFIED'}</span>
    </div>
    {p.is_revealed?
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="flex-1 flex flex-col justify-center mt-4">
        {p.category&&<span className="text-[10px] tracking-[.3em] text-mute mb-2">{p.category.toUpperCase()}</span>}
        <h3 className="font-display text-xl tracking-wider mb-3">{p.title||`Challenge ${n}`}</h3>
        <p className="text-metal/80 text-sm leading-relaxed whitespace-pre-line">{p.description||'Challenge details will be updated soon.'}</p>
        {p.pdf_url&&<a href={p.pdf_url} target="_blank" rel="noopener noreferrer" className="mt-5 self-start border border-doom bg-doom/10 hover:bg-doom/25 px-4 py-3 font-display text-xs tracking-[.18em] transition">DOWNLOAD PROBLEM STATEMENT</a>}
      </motion.div>:
      <div className="flex-1 flex flex-col items-center justify-center gap-5">
        <div className="relative w-20 h-20 flex items-center justify-center"><span className="ring"/><span className="ring [animation-delay:1.3s]"/><Crosshair className="text-doom" size={34}/></div>
        <div className="text-center"><p className="font-display tracking-[.3em]">COMING SOON</p><p className="text-[10px] tracking-[.3em] text-mute mt-2">AWAITING AUTHORIZATION</p></div>
      </div>}
  </motion.article>
}

function Reveals(){
  const [items,setItems]=useState<Problem[]>(Array.from({length:12},(_,i)=>({number:i+1,title:null,description:null,category:null,is_revealed:false,pdf_url:null})))
  useEffect(()=>{
    const load=async()=>{const data=await fetchPublic();if(data&&data.length)setItems(data)}
    load();const t=setInterval(load,5000);const v=()=>document.visibilityState==='visible'&&load()
    document.addEventListener('visibilitychange',v);return()=>{clearInterval(t);document.removeEventListener('visibilitychange',v)}
  },[])
  return <section id="reveals" className="px-4 sm:px-6 py-20 sm:py-28 max-w-6xl mx-auto">
    <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-14">
      <h2 className="font-display text-2xl sm:text-3xl md:text-5xl tracking-[.1em] sm:tracking-[.15em]">THE DOOMSDAY PROTOCOL</h2>
      <p className="text-mute mt-4">Twelve challenges remain classified. Their fate awaits authorization.</p>
    </motion.div>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{items.map((p,i)=><ProblemCard key={p.number} p={p} i={i}/>)}</div>
  </section>
}

export default function Site(){
  return <main>
    <Navbar/><Hero/><Reveals/>
    <section id="about" className="px-6 py-24 text-center max-w-2xl mx-auto">
      <h2 className="font-display text-2xl tracking-[.2em] mb-4">BUILT BY DEEPLABS</h2>
      <p className="text-mute">A space for bold ideas, difficult problems, and builders who are ready for the challenge.</p>
    </section>
    <footer className="border-t border-white/10 py-8 text-center text-xs text-mute tracking-widest">
      <p className="font-display">DEEP<span className="text-doom">LABS</span> — HACKATHON COMING SOON</p><p className="mt-2">© 2026 DeepLabs</p>
    </footer>
  </main>
}
