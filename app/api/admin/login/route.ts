import { NextResponse } from 'next/server'
import { token } from '@/lib/store'
export const dynamic='force-dynamic'
export async function POST(req:Request){
  const {password}=await req.json().catch(()=>({}))
  if(!process.env.ADMIN_PASSWORD||typeof password!=='string'||password!==process.env.ADMIN_PASSWORD)return NextResponse.json({error:'denied'},{status:401})
  const res=NextResponse.json({ok:true})
  res.cookies.set('dl_admin',token(),{httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*12})
  return res}
