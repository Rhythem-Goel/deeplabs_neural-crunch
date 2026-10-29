import type { Config } from 'tailwindcss'
export default { content:['./app/**/*.tsx','./components/**/*.tsx'],
theme:{extend:{colors:{bg:'#040605',s1:'#0A0F0C',s2:'#0F1511',doom:'#22E06B',doomdark:'#0B5A2B',metal:'#C3CEC7',ink:'#F2F5F3',mute:'#7F8C84'},
fontFamily:{display:['var(--font-display)','sans-serif'],body:['var(--font-body)','sans-serif']}}},plugins:[]} satisfies Config
