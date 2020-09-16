import m from"../web_modules/echarts.js";import*as l from"../web_modules/d3.js";import{ahoi as u,EVisualizationType as d}from"../web_modules/@visahoi/echarts.js";let c=null;function h(){l.csv("../data/oslo-2018.csv").then(o=>{const{x:e,y:n}=y(o),s=g(e,n);u(d.CHANGE_MATRIX,s,"onboarding")})}const p=["Tallin","Oslo","Munich"],f=[[0,2,-.6],[1,2,-8.4],[2,2,-2.2],[3,2,1.35],[4,2,-6.2],[5,2,1.1],[6,2,1.1],[7,2,-1.2],[8,2,3.8],[9,2,.5],[10,2,-1.45],[11,2,0],[0,1,-3.5],[1,1,-8.65],[2,1,-3.8],[3,1,-.5],[4,1,-2.4],[5,1,-3.55],[6,1,2],[7,1,.4],[8,1,.25],[9,1,-.3],[10,1,2.3],[11,1,.5],[0,0,.2],[1,0,-6.95],[2,0,-1.5],[3,0,-3.1],[4,0,-2.1],[5,0,-1],[6,0,.8],[7,0,1.1],[8,0,.95],[9,0,2],[10,0,2.65],[11,0,2.4]];function g(o,e){const n={title:{text:"Average temperature change in °C between 1990 and 1991",left:"center"},tooltip:{},grid:{height:"50%",top:"10%"},yAxis:{type:"category",data:p,name:"City",nameLocation:"middle",nameGap:35},xAxis:{type:"category",data:o,axisLabel:{formatter:function(s,a){var t=new Date(s);return t.getMonth()}},name:"Month",nameLocation:"middle",nameGap:30},series:[{type:"heatmap",data:f,label:{show:!1}}],visualMap:{min:-9,max:9,calculable:!0,orient:"horizontal",left:"center",bottom:"15%",color:["#D2B48C","#FDFDFD","#4682b4"],text:["High","Low"]}};return c.setOption(n),c}function y(o){const e=[],n=[];for(let a=0;a<o.length;a++){const t=o[a],r=`${t.year}-${t.month}`;if(e.includes(r)){const i=e.indexOf(r);n[i].push(parseFloat(t.temp))}else e.push(`${t.year}-${t.month}`),n.push([parseFloat(t.temp)])}const s=n.map(a=>{const t=a.reduce((r,i)=>r+i,0);return Math.round(t/a.length,2)});return{x:e,y:s}}const x=(o="svg")=>{const e=document.getElementById("vis");c=m.init(e,null,{renderer:o}),h()};export default x;
