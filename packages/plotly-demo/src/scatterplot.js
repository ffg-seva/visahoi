// Use Plotly.js via CDN in HTML template, because we cannot bundle it using Snowpack.
// See https://github.com/ffg-seva/onboarding-prototype/issues/7
// import * as Plotly from 'plotly.js';

import { ahoi, EVisualizationType } from '@visahoi/plotly';

function render() {
  Plotly.d3.json("./data/cars.json", function(data) {
      const {x, y} = processData(data);
      makePlotly(x, y).then((chart) => {
        ahoi(EVisualizationType.SCATTERPLOT, chart, '#onboarding');
      });
  });
}

function processData(allRows) {
  const x = Object.values(allRows).map((d) => d["Horsepower"]);
  const y = Object.values(allRows).map((d) => d["Miles_per_Gallon"]);
  return {x, y};
}

function makePlotly(x, y) {
  document.getElementById("plot");
  const traces = [
    {
      type: "scatter",
      mode: "markers",
      x,
      y,
      marker: {
        size: 5
      }
    }
  ];

  const layout = {
    title: "Some title of cars or something",
    xaxis: {
      title: "Horsepower",
    },
    yaxis: {
      title: "Miles per Gallon"
    }
  };

  return Plotly.newPlot("vis", traces, layout);
}

render();
