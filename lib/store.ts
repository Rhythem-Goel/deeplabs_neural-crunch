import fs from 'fs'; import path from 'path'; import crypto from 'crypto'; import { cookies } from 'next/headers'
const F=path.join(process.cwd(),'data','problems.json')
export type Row={number:number;title:string;description:string;category:string|null;is_revealed:boolean;revealed_at:string|null;pdf_url:string|null}
export function read():Row[]{let r:Row[]=[];try{r=JSON.parse(fs.readFileSync(F,'utf8'))}catch{}
  return Array.from({length:12},(_,i)=>{const row=r.find(x=>x.number===i+1);return row?{...row,pdf_url:typeof row.pdf_url==='string'?row.pdf_url:null}:{number:i+1,title:'',description:'',category:null,is_revealed:false,revealed_at:null,pdf_url:null}})}
export function write(r:Row[]){fs.mkdirSync(path.dirname(F),{recursive:true});fs.writeFileSync(F,JSON.stringify(r,null,2))}
export const token=()=>crypto.createHmac('sha256',process.env.ADMIN_PASSWORD||'').update('deeplabs-admin').digest('hex')
export const isAdmin=()=>!!process.env.ADMIN_PASSWORD&&cookies().get('dl_admin')?.value===token()
