import{ahoi as y,EVisualizationType as c}from"../web_modules/@visahoi/plotly.js";function r(){Plotly.d3.json("./data/matrix.json",function(e){const{x:a,y:n,z:o}=u(e);d(a,n,o).then(s=>{y(c.CHANGE_MATRIX,s,"onboarding")})})}function u(e){const a=Plotly.d3.nest().key(t=>t.b).sortKeys(Plotly.d3.ascending).entries(e),n=a.map(t=>t.key),o=Plotly.d3.nest().key(t=>t.a).sortKeys(Plotly.d3.descending).sortValues((t,l)=>parseFloat(t.b)-parseFloat(l.b)).entries(e),s=o.map(t=>t.key),i=o.map(t=>t.values.map(l=>l.c));return{x:n,y:s,z:i}}function d(e,a,n){document.getElementById("plot");const o=[{type:"heatmap",x:e,y:a,z:n,zmin:-9,zmax:9,colorscale:[[0,"#4682b4"],[.5,"#FDFDFD"],[1,"#D2B48C"]],colorbar:{title:{text:"Value Change"}}}],s={title:"Average temperature change in °C between 1990 and 1991",xaxis:{title:"Month"},yaxis:{title:"City"}};return Plotly.newPlot("vis",o,s)}r();
