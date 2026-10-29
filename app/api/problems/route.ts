import { NextResponse } from 'next/server'
import { read } from '@/lib/store'
export const dynamic='force-dynamic'
export function GET(){return NextResponse.json(read().map(r=>({number:r.number,is_revealed:r.is_revealed,title:r.is_revealed?r.title:null,description:r.is_revealed?r.description:null,category:r.is_revealed?r.category:null})))}
