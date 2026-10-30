'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Problem } from '@/lib/types'
import { adminLoad, adminUpdate, adminSignOut } from '@/lib/api'
export default function Admin(){
  const r=useRouter(); const [state,setState]=useState<'loading'|'denied'|'ok'>('loading')
  const [rows,setRows]=useState<Problem[]>([]); const [msg,setMsg]=useState<{ok:boolean;t:string}|null>(null)
  const load=async()=>{const d=await adminLoad()
    if(d==='unauth'){r.replace('/admin/login');return}
    if(!d){setState('denied');return}; setRows(d); setState('ok')}
  useEffect(()=>{load()},[])
  const edit=(n:number,k:'title'|'description'|'category'|'pdf_url',v:string)=>setRows(rs=>rs.map(x=>x.number===n?{...x,[k]:v}:x))
  const run=async(n:number,patch:Partial<Problem>,ok:string)=>{
    const error=await adminUpdate(n,patch)
    setMsg(error?{ok:false,t:`#${n}: ${error}`}:{ok:true,t:`#${n}: ${ok}`}); if(!error)load()}
  const save=(p:Problem)=>{if((p.title||'').length>120||(p.description||'').length>2000){setMsg({ok:false,t:'Title max 120, description max 2000 chars.'});return}
    run(p.number,{title:(p.title||'').trim(),description:(p.description||'').trim(),category:(p.category||'').trim()||null},'saved')}
  const savePdf=(p:Problem)=>run(p.number,{pdf_url:(p.pdf_url||'').trim()||null},'PDF URL saved')
  const toggle=(p:Problem)=>{if(confirm(`${p.is_revealed?'HIDE':'REVEAL'} challenge #${p.number} ${p.is_revealed?'from':'to'} the public?`))run(p.number,{is_revealed:!p.is_revealed},p.is_revealed?'hidden':'revealed')}
  if(state==='loading')return <main className="p-10 text-mute">Verifying clearance…</main>
  if(state==='denied')return <main className="min-h-screen flex flex-col items-center justify-center gap-4"><h1 className="font-display text-doom tracking-[.3em]">ACCESS DENIED</h1><a className="text-mute underline" href="/admin/login">Sign in with an admin account</a></main>
  const f="w-full bg-s1 border border-white/15 px-3 py-3 text-base"
  return <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
    <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
      <div><h1 className="font-display text-3xl tracking-[.2em]">COMMAND CENTER</h1><p className="text-mute text-xs tracking-[.3em] mt-1">CLASSIFIED CHALLENGE CONTROL</p></div>
      <div className="text-right"><p className="font-display text-doom">REVEALED: {rows.filter(x=>x.is_revealed).length} / {rows.length}</p>
        <button className="text-xs text-mute underline" onClick={async()=>{await adminSignOut();r.push('/')}}>Sign out</button></div></div>
    {msg&&<p role="status" className={`mb-6 border px-4 py-2 text-sm ${msg.ok?'border-green-700 text-green-400':'border-doom text-doom'}`}>{msg.t}</p>}
    <div className="space-y-4">{rows.map(p=><div key={p.number} className={`border p-5 bg-s1 ${p.is_revealed?'border-doom/60':'border-white/10'}`}>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 mb-3 font-display text-xs tracking-[.2em]"><span>#{String(p.number).padStart(2,'0')}</span>
        <span className={p.is_revealed?'text-doom':'text-mute'}>{p.is_revealed?'REVEALED (PUBLIC)':'CLASSIFIED'}{p.revealed_at&&` · ${new Date(p.revealed_at).toLocaleString()}`}</span></div>
      <div className="space-y-2">
        <input className={f} aria-label="Title" placeholder="Title" maxLength={120} value={p.title||''} onChange={e=>edit(p.number,'title',e.target.value)}/>
        <input className={f} aria-label="Category" placeholder="Category (optional)" maxLength={40} value={p.category||''} onChange={e=>edit(p.number,'category',e.target.value)}/>
        <textarea className={f} aria-label="Description" rows={3} placeholder="Description" maxLength={2000} value={p.description||''} onChange={e=>edit(p.number,'description',e.target.value)}/>
        <label className="block text-xs text-mute tracking-widest"><span>PDF DOWNLOAD URL</span><input className={`${f} mt-1`} aria-label="PDF Download URL" type="url" inputMode="url" placeholder="https://raw.githubusercontent.com/.../problem.pdf" value={p.pdf_url||''} onChange={e=>edit(p.number,'pdf_url',e.target.value)}/></label>
        <p className={`text-xs ${p.pdf_url?'text-green-400':'text-mute'}`}>{p.pdf_url?'PDF CONFIGURED':'NO PDF CONFIGURED'}</p></div>
      <div className="flex flex-col sm:flex-row gap-3 mt-3">
        <button onClick={()=>save(p)} className="border border-white/25 px-4 py-3 text-xs font-display tracking-widest">SAVE</button>
        <button onClick={()=>savePdf(p)} className="border border-white/25 px-4 py-3 text-xs font-display tracking-widest">SAVE PDF URL</button>
        <button onClick={()=>toggle(p)} className="border border-doom bg-doom/15 px-4 py-3 text-xs font-display tracking-widest">{p.is_revealed?'HIDE':'REVEAL'}</button></div>
    </div>)}</div></main>
}
