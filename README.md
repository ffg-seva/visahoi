<p align="center"><img src="/docs/img/logo.png" alt="VisAhoi" width="35%" /></p>
<p align="center">
  <a href="https://github.com/datavisyn/visAhoi/actions">
    <img src="https://github.com/datavisyn/visAhoi/workflows/Build%20and%20deploy%20demos/badge.svg?branch=develop" alt="CI" />
  </a>
</p>

# Contributors

Christina Stoiber contributed to the library regarding conceptual design, evaluation, and publication.

# DEPRECATION Information
Please note that this project has been archived and is no longer being maintained.

# What is VisAhoi?

**VisAhoi is a library to onboard users to visualizations by explaining the data and visual encoding.** VisAhoi employs the visualization specifications of high-level descriptive visualization grammars from [ECharts](https://echarts.apache.org), [Plotly.js](https://plotly.com/javascript/), or [Vega-Lite](https://vega.github.io/vega-lite), and provides onboarding messages and anchors for different visualization types (e.g., bar chart, change matrix, horizon graph).

# Key Features

- Integrable
- Extensible
- Reusable
- Automated
- Customizable

# Getting Started

VisAhoi offers adapter packages for [ECharts](https://echarts.apache.org), [Plotly.js](https://plotly.com/javascript/), or [Vega-Lite](https://vega.github.io/vega-lite). Choose the VisAhoi adapter for your visualization library below and follow the instructions.

## VisAhoi for ECharts

Install the VisAhoi adapter:

```
npm install @visahoi/echarts --save
# or with yarn
yarn add @visahoi/echarts
```

Let's enhance a bar chart with VisAhoi:

```js
import * as echarts from "echarts";
import { ahoi } from "@visahoi/echarts";

function render() {
  const data = {
    /* bar chart data */
  };

  const chart = echarts.init(document.getElementById("vis"), null, {
    renderer: "svg",
  });
  chart.setOption({
    /* EChart specification */
  });

  ahoi("bar-chart", chart, ahoiConfig);
}

render();
```

Please note that VisAhoi supports currently only the SVG renderer.

📊 See the [entire source code of the bar chart example](./packages/echarts-demo/src/bar-chart.js) or explore the other [ECharts demos](https://ffg-seva.github.io/onboarding-prototype/demos/echarts-demo/build/).

## VisAhoi for Plotly.js

Install the VisAhoi adapter:

```
npm install @visahoi/plotly --save
# or with yarn
yarn add @visahoi/plotly
```

Let's enhance a bar chart with VisAhoi:

```js
import { ahoi } from "@visahoi/plotly";

async function render() {
  const traces = {
    /* bar chart data */
  };
  const layout = {
    /* bar chart specification */
  };

  const chart = await Plotly.newPlot("vis", traces, layout);

  ahoi("bar-chart", chart, ahoiConfig);
}

render();
```

📊 See the [entire source code of the bar chart example](./packages/plotly-demo/src/bar-chart.js) or explore the other [Plotly.js demos](https://ffg-seva.github.io/onboarding-prototype/demos/plotly-demo/build/).

## VisAhoi for Vega-Lite

Install the VisAhoi adapter:

```
npm install @visahoi/vega --save
# or with yarn
yarn add @visahoi/vega
```

Let's enhance a bar chart with VisAhoi:

```js
import vegaEmbed from "vega-embed";
import { ahoi } from "@visahoi/vega";

async function render() {
  const spec = {
    /* Vega-Lite specification with data */
  };

  const chart = await vegaEmbed("#vis", spec, { renderer: "svg" });

  ahoi("bar-chart", chart, ahoiConfig);
}

render();
```

Please note that VisAhoi supports currently only the SVG renderer.

📊 See the [entire source code of the bar chart example](./packages/vega-demo/src/bar-chart.js) or explore the other [Vega-Lite demos](https://ffg-seva.github.io/onboarding-prototype/demos/vega-demo/build/).

# Supported Visualization Types

Currently VisAhoi provides the onboarding messages for following visualization types:

- Bar Chart (`bar-chart`)
- Change Matrix (`change-matrix`)
- Horizon Graph (`horizon-graph`)

The visualization type is passed as first parameter to the `ahoi(type, chart, ahoiConfig)` function. The second paramter is the the chart instance of the used visualization library.

# Customization

The onboarding can be customized via the `ahoiConfig` parameter which is passed to the `ahoi(type, chart, ahoiConfig)` function.
It allows you to customize the onboarding messages and the backdrop.

The interface of the ahoiConfig looks like this:

```
interface IAhoiConfig {
  onboardingMessages: IOnboardingMessage[];
  backdrop: IBackdropConfig;
}
```

To customize the onboarding messages, you can either pass your own onboarding messages, or adapt the automatically generated onboarding messages for your specific visualization type. To get the automatically generated messages use our function `generateBasicAnnotations()`. It returns an array of onbaording messages which you can modify or directly pass to the `ahoi()` function.

An onboarding message has the following interface:

```
interface IOnboardingMessage {
  anchor: any;
  requires: string[];
  text: string;
  title: string;
  onboardingStage: IOnboardingStage;
  tooltipPosition?: TooltipPosition;
}
```

The backdrop can also be configured via the `ahoiConfig`. You can define if you want to show a backdrop at all and customize it's opacity.
The interface for the backdrop looks like this:

```
interface IBackdropConfig {
  show: boolean;
  opacity: number;
}
```

# Developer Information

VisAhoi uses [lerna.js](<https://[lernajs.org](https://lerna.js.org/)>) to divide the soruce code into separate npm packages and demos.

## Build Instructions

For a basic setup allowing you to build and run examples:

```
git clone https://github.com/datavisyn/visAhoi.git
cd visAhoi
npm run bootstrap
```

Afterwards you can run the following npm scripts:

- `npm run build` compiles all npm packages and builds the sources of the demo pages
- `npm start` runs all demo pages and opens them in the browser

In case you want to start a specific demo page for a chosen visualization library (`echarts`, `plotly`, or `vega`):

```
cd ./packages/onboarding-<visualization-library>-demo
npm start
```

<!--
## Publish (internal)

TBD
-->
