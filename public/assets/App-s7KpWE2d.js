import{u as f,a as G,r,j as e,B as i,S as n,T as c,b as m}from"./index-D00mcfc6.js";import{G as d}from"./GameCard-BAGijEQN.js";import{T as w,a as h}from"./Tabs-BwC8jvZ1.js";function A(){const t=f(),[g,x]=G(),[p,u]=r.useState([]),[o,j]=r.useState([]),[l,y]=r.useState(()=>{const a=g.get("tab");return a?parseInt(a,10):0});r.useEffect(()=>{(async()=>{try{const s=await m.get("/api/game/recent");u(s);const b=await m.get("/api/game/my-recent");j(b)}catch(s){console.error("Error fetching games:",s)}})()},[]);const v=(a,s)=>{y(s),x({tab:s.toString()})};return e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{display:"flex"},children:e.jsx(i,{sx:{flex:1},size:"large",variant:"contained",color:"success",onClick:()=>{t("/game")},children:"Start new game"})}),e.jsxs(w,{value:l,onChange:v,variant:"fullWidth",sx:{mt:2},children:[e.jsx(h,{label:"My Games"}),e.jsx(h,{label:"All Games"})]}),e.jsx(n,{spacing:2,sx:{width:"100%",marginTop:2},children:l===0?e.jsxs(n,{spacing:2,children:[e.jsxs(n,{direction:"row",justifyContent:"space-between",children:[e.jsx(c,{variant:"h5",textAlign:"center",children:"My Recent Games"}),e.jsx(i,{variant:"outlined",color:"primary",onClick:()=>t("/my-games"),children:"View all my games"})]}),o.length===0?e.jsx(c,{variant:"body1",children:"You haven't created any games yet."}):o.map(a=>e.jsx(d,{game:a,onNavigate:()=>t(`/game/results/${a._id}`)},a._id))]}):e.jsxs(n,{spacing:2,children:[e.jsxs(n,{direction:"row",justifyContent:"space-between",children:[e.jsx(c,{variant:"h5",textAlign:"center",children:"Recent Games"}),e.jsx(i,{variant:"outlined",color:"primary",onClick:()=>t("/all-games?tab=1"),children:"View all games"})]}),p.map(a=>e.jsx(d,{game:a,onNavigate:()=>t(`/game/results/${a._id}`),showUser:!0},a._id))]})})]})}export{A as default};
