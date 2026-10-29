import { NextResponse } from 'next/server'
export function POST(){const r=NextResponse.json({ok:true});r.cookies.delete('dl_admin');return r}
