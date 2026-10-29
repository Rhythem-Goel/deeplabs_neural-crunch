import { supabase, type Problem } from './supabase'
// Supabase mode if env is set, otherwise local file mode (API routes).
export const SB = !!process.env.NEXT_PUBLIC_SUPABASE_URL
const j=(u:string,o?:RequestInit)=>fetch(u,{...o,headers:{'Content-Type':'application/json'}})
export async function fetchPublic():Promise<Problem[]|null>{
  if(SB){const {data}=await supabase.from('public_problems').select('*').order('number');return data as Problem[]|null}
  const r=await fetch('/api/problems',{cache:'no-store'});return r.ok?r.json():null}
export async function adminLoad():Promise<Problem[]|'unauth'|null>{
  if(SB){const {data:s}=await supabase.auth.getSession();if(!s.session)return 'unauth'
    const {data,error}=await supabase.from('problem_statements').select('*').order('number');return error||!data?.length?null:data as Problem[]}
  const r=await fetch('/api/admin/problems',{cache:'no-store'});if(r.status===401)return 'unauth';return r.ok?r.json():null}
export async function adminUpdate(n:number,patch:Partial<Problem>):Promise<string|null>{
  if(SB){const {error}=await supabase.from('problem_statements').update(patch).eq('number',n);return error?error.message:null}
  const r=await j('/api/admin/problems',{method:'PUT',body:JSON.stringify({number:n,patch})});return r.ok?null:(await r.json()).error||'failed'}
export async function adminSignIn(email:string,pw:string):Promise<string|null>{
  if(SB){const {error}=await supabase.auth.signInWithPassword({email,password:pw});return error?error.message:null}
  const r=await j('/api/admin/login',{method:'POST',body:JSON.stringify({password:pw})});return r.ok?null:'Wrong password'}
export async function adminSignOut(){if(SB)await supabase.auth.signOut();else await j('/api/admin/logout',{method:'POST'})}
