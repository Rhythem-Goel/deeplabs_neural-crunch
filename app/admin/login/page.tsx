'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminSignIn } from '@/lib/api'
export default function Login(){
  const r=useRouter(); const [pw,setPw]=useState(''); const [err,setErr]=useState(''); const [busy,setBusy]=useState(false)
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setErr('');
    if(pw.length<4){setErr('Enter a valid password.');return}
    setBusy(true);const error=await adminSignIn('',pw);setBusy(false)
    if(error)setErr('Access denied: '+error);else r.push('/admin')}
  const f="w-full bg-s1 border border-white/15 px-4 py-3 text-base"
  return <main className="min-h-screen flex items-center justify-center px-6">
    <form onSubmit={submit} className="w-full max-w-sm border border-white/10 bg-black/60 p-8 space-y-4">
      <h1 className="font-display tracking-[.25em] text-xl text-center">ADMIN <span className="text-doom">ACCESS</span></h1>
      <input className={f} type="password" placeholder="Password" aria-label="Password" value={pw} onChange={e=>setPw(e.target.value)}/>
      {err&&<p role="alert" className="text-doom text-sm">{err}</p>}
      <button disabled={busy} className="w-full border border-doom bg-doom/15 py-3 font-display text-xs tracking-[.3em] disabled:opacity-50">{busy?'VERIFYING…':'SIGN IN'}</button>
      <a href="/" className="block text-center text-xs text-mute">← Back</a>
    </form></main>
}
