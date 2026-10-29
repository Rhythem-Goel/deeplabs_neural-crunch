import { NextResponse } from 'next/server'
import { read, write, isAdmin } from '@/lib/store'
export const dynamic='force-dynamic'
const no=()=>NextResponse.json({error:'unauthorized'},{status:401})
export function GET(){return isAdmin()?NextResponse.json(read()):no()}
export async function PUT(req:Request){
  if(!isAdmin())return no()
  const {number,patch}=await req.json().catch(()=>({}))
  const rows=read();const row=rows.find(r=>r.number===number)
  if(!row||!patch)return NextResponse.json({error:'bad request'},{status:400})
  if(typeof patch.title==='string'){if(patch.title.length>120)return NextResponse.json({error:'title too long'},{status:400});row.title=patch.title}
  if(typeof patch.description==='string'){if(patch.description.length>2000)return NextResponse.json({error:'description too long'},{status:400});row.description=patch.description}
  if('category' in patch)row.category=typeof patch.category==='string'?patch.category.slice(0,40):null
  if(typeof patch.is_revealed==='boolean'){row.revealed_at=patch.is_revealed?(row.is_revealed?row.revealed_at:new Date().toISOString()):null;row.is_revealed=patch.is_revealed}
  write(rows);return NextResponse.json({ok:true})}
