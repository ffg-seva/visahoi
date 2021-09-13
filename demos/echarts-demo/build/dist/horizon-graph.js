import*as c from"../web_modules/echarts.js";import{ahoi as u,EVisualizationType as d}from"../web_modules/@visahoi/echarts.js";import{importCsv as m}from"./utils.js";let l=null;async function p(){const r=await m("../data/oslo-2018.csv"),{x:t,y:i}=y(r),e=h(t,i);window.addEventListener("resize",()=>u(d.HORIZON_GRAPH,e,"#onboarding")),u(d.HORIZON_GRAPH,e,"#onboarding")}function y(r){const t=[],i=[];for(let a=0;a<r.length;a++){const n=r[a],o=`${n.year}-${n.month}`;if(t.includes(o)){const s=t.indexOf(o);i[s].push(parseFloat(n.temp))}else t.push(`${n.year}-${n.month}`),i.push([parseFloat(n.temp)])}const e=i.map(a=>{const n=a.reduce((o,s)=>o+s,0);return Math.round(n/a.length,2)});return{x:t,y:e}}function h(r,t){const i={title:{text:"Average temperature in Oslo, Norway in 2018",left:"center"},tooltip:{trigger:"axis",axisPointer:{snap:!1,type:"none"},formatter:function(e,a,n){let o=0;o+=e[0].value,o+=e[1].value,o-=e[2].value;const s=`Month: ${e[0].name}<br/> Average temperature in °C: ${o}`;return setTimeout(function(){n(a,s)},100),s}},xAxis:{type:"category",boundaryGap:!1,data:r,axisLabel:{formatter:function(e,a){var n=new Date(e);return n.getMonth()+1}},name:"Month",nameLocation:"middle",nameGap:30},yAxis:{type:"value",min:-1,max:16,name:"Average Temperature in °C",nameLocation:"middle",nameGap:30},series:[{data:t.map(e=>e<0?0:e>15?15:e),type:"line",areaStyle:{opacity:.6},color:"#a1d76a",smooth:!0,symbol:"none",lineStyle:{width:0}},{data:t.map(e=>e>15?e-15:0),type:"line",areaStyle:{opacity:1},color:"#a1d76a",smooth:!0,symbol:"none",lineStyle:{width:0}},{data:t.map(e=>e<0?e*-1:0),type:"line",areaStyle:{opacity:1},color:"#0571b0",smooth:!0,symbol:"none",lineStyle:{width:0}}]};return l.setOption(i),l}const f=(r="svg")=>{const t=document.getElementById("vis");l=c.init(t,null,{renderer:r}),window.addEventListener("resize",()=>l.resize()),p()};export default f;
