import i from"../web_modules/vega-embed.js";import{ahoi as o,EVisualizationType as a}from"../web_modules/@visahoi/vega.js";const t={theme:"default",actions:!1,renderer:"svg"};async function r(){const n=await fetch("./data/horizonGraphOslo2018.json"),s=await n.json();let e=await i("#vis",s,t);window.addEventListener("resize",()=>o(a.HORIZON_GRAPH,e,"#onboarding")),o(a.HORIZON_GRAPH,e,"#onboarding")}r();
