import{c as W,g as $,r as b,d as I,j as t,s as C,h as D,k as B,m as k,p as T,q as A,t as P,u as _,b as m,S as g,T as f,B as v,A as H,o as S}from"./index-D00mcfc6.js";import{R as L}from"./Remove-CJxnlg8L.js";function M(r){return W("MuiDivider",r)}$("MuiDivider",["root","absolute","fullWidth","inset","middle","flexItem","light","vertical","withChildren","withChildrenVertical","textAlignRight","textAlignLeft","wrapper","wrapperVertical"]);const V=r=>{const{absolute:e,children:i,classes:d,flexItem:p,light:l,orientation:a,textAlign:s,variant:n}=r;return B({root:["root",e&&"absolute",n,l&&"light",a==="vertical"&&"vertical",p&&"flexItem",i&&"withChildren",i&&a==="vertical"&&"withChildrenVertical",s==="right"&&a!=="vertical"&&"textAlignRight",s==="left"&&a!=="vertical"&&"textAlignLeft"],wrapper:["wrapper",a==="vertical"&&"wrapperVertical"]},M,d)},z=C("div",{name:"MuiDivider",slot:"Root",overridesResolver:(r,e)=>{const{ownerState:i}=r;return[e.root,i.absolute&&e.absolute,e[i.variant],i.light&&e.light,i.orientation==="vertical"&&e.vertical,i.flexItem&&e.flexItem,i.children&&e.withChildren,i.children&&i.orientation==="vertical"&&e.withChildrenVertical,i.textAlign==="right"&&i.orientation!=="vertical"&&e.textAlignRight,i.textAlign==="left"&&i.orientation!=="vertical"&&e.textAlignLeft]}})(k(({theme:r})=>({margin:0,flexShrink:0,borderWidth:0,borderStyle:"solid",borderColor:(r.vars||r).palette.divider,borderBottomWidth:"thin",variants:[{props:{absolute:!0},style:{position:"absolute",bottom:0,left:0,width:"100%"}},{props:{light:!0},style:{borderColor:r.vars?`rgba(${r.vars.palette.dividerChannel} / 0.08)`:T(r.palette.divider,.08)}},{props:{variant:"inset"},style:{marginLeft:72}},{props:{variant:"middle",orientation:"horizontal"},style:{marginLeft:r.spacing(2),marginRight:r.spacing(2)}},{props:{variant:"middle",orientation:"vertical"},style:{marginTop:r.spacing(1),marginBottom:r.spacing(1)}},{props:{orientation:"vertical"},style:{height:"100%",borderBottomWidth:0,borderRightWidth:"thin"}},{props:{flexItem:!0},style:{alignSelf:"stretch",height:"auto"}},{props:({ownerState:e})=>!!e.children,style:{display:"flex",textAlign:"center",border:0,borderTopStyle:"solid",borderLeftStyle:"solid","&::before, &::after":{content:'""',alignSelf:"center"}}},{props:({ownerState:e})=>e.children&&e.orientation!=="vertical",style:{"&::before, &::after":{width:"100%",borderTop:`thin solid ${(r.vars||r).palette.divider}`,borderTopStyle:"inherit"}}},{props:({ownerState:e})=>e.orientation==="vertical"&&e.children,style:{flexDirection:"column","&::before, &::after":{height:"100%",borderLeft:`thin solid ${(r.vars||r).palette.divider}`,borderLeftStyle:"inherit"}}},{props:({ownerState:e})=>e.textAlign==="right"&&e.orientation!=="vertical",style:{"&::before":{width:"90%"},"&::after":{width:"10%"}}},{props:({ownerState:e})=>e.textAlign==="left"&&e.orientation!=="vertical",style:{"&::before":{width:"10%"},"&::after":{width:"90%"}}}]}))),G=C("span",{name:"MuiDivider",slot:"Wrapper",overridesResolver:(r,e)=>{const{ownerState:i}=r;return[e.wrapper,i.orientation==="vertical"&&e.wrapperVertical]}})(k(({theme:r})=>({display:"inline-block",paddingLeft:`calc(${r.spacing(1)} * 1.2)`,paddingRight:`calc(${r.spacing(1)} * 1.2)`,whiteSpace:"nowrap",variants:[{props:{orientation:"vertical"},style:{paddingTop:`calc(${r.spacing(1)} * 1.2)`,paddingBottom:`calc(${r.spacing(1)} * 1.2)`}}]}))),j=b.forwardRef(function(e,i){const d=I({props:e,name:"MuiDivider"}),{absolute:p=!1,children:l,className:a,orientation:s="horizontal",component:n=l||s==="vertical"?"div":"hr",flexItem:o=!1,light:h=!1,role:c=n!=="hr"?"separator":void 0,textAlign:x="center",variant:u="fullWidth",...R}=d,w={...d,absolute:p,component:n,flexItem:o,light:h,orientation:s,role:c,textAlign:x,variant:u},y=V(w);return t.jsx(z,{as:n,className:D(y.root,a),role:c,ref:i,ownerState:w,"aria-orientation":c==="separator"&&(n!=="hr"||s==="vertical")?s:void 0,...R,children:l?t.jsx(G,{className:y.wrapper,ownerState:w,children:l}):null})});j&&(j.muiSkipListHighlight=!0);const E=A(t.jsx("path",{d:"M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"})),F=A(t.jsx("path",{d:"m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"})),J=()=>{const{id:r}=P(),[e,i]=b.useState(null),d=_();b.useEffect(()=>{m.get(`/api/game/${r}`).then(n=>{i(n)}).catch(n=>console.error("Error fetching game:",n))},[r]);const p=async n=>{if(e.currentHole===e.holes.length&&n===1){d(`/game/results/${e._id}?finish=true`);return}try{const o=await m.put(`/api/game/${e._id}/hole`,{direction:n});i(o)}catch(o){console.error(o)}},l=async(n,o)=>{const h={...e},c=h.players.find(u=>u._id.toString()===n),x=c.scores.find(u=>u.hole===e.currentHole);x?x.strokes+=o:c.scores.push({hole:e.currentHole,strokes:o}),i(h)},a=async(n,o)=>{const h={...e};l(n,o);try{await m.put(`/api/game/${e._id}/${n}/stroke`,{stroke:o})}catch(c){console.error(c),i(h)}};if(!e)return t.jsx("div",{children:"Loading..."});const s=async n=>{const o={...e},h={...e},c=o.holes[e.currentHole-1].par+n;o.holes[e.currentHole-1].par=c,i(o);try{await m.put(`/api/game/${e._id}/hole/${e.currentHole}`,{par:c})}catch(x){console.error(x),i(h)}};return t.jsxs(t.Fragment,{children:[t.jsx(g,{spacing:2,children:e.players.map((n,o)=>t.jsxs(t.Fragment,{children:[t.jsx(N,{game:e,player:n,onChangeStroke:a},n.name),o<e.players.length-1&&t.jsx(j,{})]}))}),t.jsxs(g,{spacing:2,sx:{position:"fixed",bottom:"56px",left:0,right:0,backgroundColor:"background.paper",boxShadow:3,zIndex:10,maxWidth:"700px",margin:"0 auto",padding:"1rem",borderBottom:"1px solid #e0e0e0"},children:[t.jsxs(g,{direction:"row",spacing:2,alignItems:"center",justifyContent:"space-between",children:[t.jsxs(f,{variant:"h4",children:["Par ",e.holes[e.currentHole-1].par]}),t.jsxs(g,{direction:"row",spacing:2,alignItems:"center",children:[t.jsx(v,{variant:"contained",color:"primary",onClick:()=>s(-1),sx:{minWidth:"40px",width:"40px",height:"40px",padding:0},children:t.jsx(L,{})}),t.jsx(v,{sx:{minWidth:"40px",width:"40px",height:"40px",padding:0},variant:"contained",color:"primary",onClick:()=>s(1),children:t.jsx(H,{})})]})]}),t.jsxs(S,{sx:{display:"flex",justifyContent:"space-between"},children:[t.jsx(v,{variant:"contained",color:"primary",onClick:()=>p(-1),children:t.jsx(E,{})}),t.jsxs(f,{variant:"h4",textAlign:"center",children:["Hole ",e.currentHole]}),t.jsx(v,{variant:"contained",color:"primary",onClick:()=>p(1),children:e.currentHole===e.holes.length?"Finish":t.jsx(F,{})})]})]})]})},N=({game:r,player:e,onChangeStroke:i})=>{var p;const d=e.scores.reduce((l,a)=>{const s=r.holes.find(n=>n.number===a.hole);return l+((a.strokes||0)-s.par)},0);return t.jsx(S,{children:t.jsxs(g,{direction:"row",justifyContent:"space-between",children:[t.jsxs(g,{direction:"row",spacing:2,alignItems:"center",children:[t.jsxs(f,{variant:"body1",style:{minWidth:"18px"},children:[d>0?"+":"",d]}),t.jsx(f,{variant:"h4",children:e.name})]}),t.jsxs(g,{direction:"row",spacing:2,alignItems:"center",children:[t.jsx(v,{variant:"contained",color:"primary",onClick:()=>i(e._id,-1),sx:{minWidth:"40px",width:"40px",height:"40px",padding:0},children:t.jsx(L,{})}),t.jsx(f,{variant:"h4",children:((p=e.scores.find(l=>l.hole===r.currentHole))==null?void 0:p.strokes)||0}),t.jsx(v,{sx:{minWidth:"40px",width:"40px",height:"40px",padding:0},variant:"contained",color:"primary",onClick:()=>i(e._id,1),children:t.jsx(H,{})})]})]})})};export{J as default};
