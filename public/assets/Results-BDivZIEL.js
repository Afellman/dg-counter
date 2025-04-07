import{t as j,r as d,a as g,u as b,b as v,j as e,S as h,o as r,T as o,B as y}from"./index-D00mcfc6.js";const S=()=>{const{id:x}=j(),[n,f]=d.useState(null),[u]=g(),p=u.get("finish"),m=b();return d.useEffect(()=>{v.get(`/api/game/${x}`).then(s=>{f(s)}).catch(s=>console.error("Error fetching game results:",s))},[x]),n?e.jsx(e.Fragment,{children:e.jsxs(h,{spacing:2,children:[e.jsxs(r,{children:[e.jsxs(r,{sx:{display:"flex"},children:[e.jsx(r,{sx:{width:"75px",flexShrink:0}}),n.players.map(s=>{const t=s.scores.reduce((a,i)=>{const c=n.holes.find(l=>l.number===i.hole);return a+((i.strokes||0)-c.par)},0);return e.jsxs(r,{sx:{flex:1,textAlign:"center"},children:[e.jsx(o,{variant:"h6",children:s.name}),e.jsxs(o,{variant:"subtitle1",children:[t>0?"+":"",t]})]},s._id)})]}),n.holes.map(s=>e.jsxs(r,{sx:{display:"flex",marginY:1},children:[e.jsx(r,{sx:{width:"75px",display:"flex",alignItems:"center"},children:e.jsxs(o,{variant:"body1",children:["H",s.number," (P",s.par,")"]})}),n.players.map(t=>{const a=t.scores.find(l=>l.hole===s.number),i=(a==null?void 0:a.strokes)||0,c=i-s.par;return e.jsx(r,{sx:{flex:1,display:"flex",justifyContent:"center"},children:e.jsx(r,{sx:{backgroundColor:c===0?"#fff":c>0?"#ffebee":"#e8f5e9",borderRadius:"4px",padding:"4px 12px",textAlign:"center"},children:e.jsx(o,{variant:"body1",fontWeight:"bold",children:i})})},t._id)})]},s.number))]}),p&&e.jsx(h,{direction:"row",justifyContent:"center",children:e.jsx(y,{sx:{flex:1},size:"large",variant:"contained",color:"success",onClick:()=>m("/"),children:"New Game"})})]})}):e.jsx("div",{children:"Loading..."})};export{S as default};
