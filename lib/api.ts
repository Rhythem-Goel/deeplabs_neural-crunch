import type { Problem } from './types'
const j=(u:string,o?:RequestInit)=>fetch(u,{...o,headers:{'Content-Type':'application/json'}})
export async function fetchPublic():Promise<Problem[]|null>{
  const r=await fetch('/api/problems',{cache:'no-store'});return r.ok?r.json():null}
export async function adminLoad():Promise<Problem[]|'unauth'|null>{
  const r=await fetch('/api/admin/problems',{cache:'no-store'});if(r.status===401)return 'unauth';return r.ok?r.json():null}
export async function adminUpdate(n:number,patch:Partial<Problem>):Promise<string|null>{
  const r=await j('/api/admin/problems',{method:'PUT',body:JSON.stringify({number:n,patch})});return r.ok?null:(await r.json()).error||'failed'}
export async function adminSignIn(email:string,pw:string):Promise<string|null>{
  const r=await j('/api/admin/login',{method:'POST',body:JSON.stringify({password:pw})});return r.ok?null:'Wrong password'}
export async function adminSignOut(){await j('/api/admin/logout',{method:'POST'})}
