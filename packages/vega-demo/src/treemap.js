import embed from 'vega-embed';
import debounce from "lodash.debounce";
import '../public/data/jobsplan.json'

// Options for the vega embed
// const opt = {
//   'title': 'American Jobs Plan',
//   'data': [
//     {
//       'url' : '../public/data/jobsplan.json',  
//       'transform': [
//         {
//           'type': 'stratify',
//           'key': 'id',
//           'parentKey': 'parent'
//         },
//         {'type': 'treemap'}
//       ]    
//     }
//   ],
//     'marks': [
//       {
//         'type': 'rect'
//       }
//     ]
  
//   // theme: 'default',
//   // actions: false,
//   // renderer: 'svg',
// };

const opt = {
  // "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "An example of treemap layout for hierarchical data.",
  "width": 960,
  "height": 500,
  "padding": 2.5,
  "autosize": "none",

  "signals": [
    {
      "name": "layout", "value": "squarify",
      "bind": {
        "input": "select",
        "options": [
          "squarify",
          "binary",
          "slicedice"
        ]
      }
    },
    {
      "name": "aspectRatio", "value": 1.6,
      "bind": {"input": "range", "min": 1, "max": 5, "step": 0.1}
    }
  ],

  "data": [
    {
      "name": "tree",
      "url": "./data/jobsplan.json",
      "transform": [
        {
          "type": "stratify",
          "key": "id",
          "parentKey": "parent"
        },
        {
          "type": "treemap",
          "field": "size",
          "sort": {"field": "value"},
          "round": true,
          "method": {"signal": "layout"},
          "ratio": {"signal": "aspectRatio"},
          "size": [{"signal": "width"}, {"signal": "height"}]
        }
      ]
    },
    {
      "name": "nodes",
      "source": "tree",
      "transform": [{ "type": "filter", "expr": "datum.children" }]
    },
    {
      "name": "leaves",
      "source": "tree",
      "transform": [{ "type": "filter", "expr": "!datum.children" }]
    }
  ],

  "scales": [
    {
      "name": "color",
      "type": "ordinal",
      "domain": {"data": "nodes", "field": "name"},
      "range": [
        "#80b1d3",
        "#80b1d3",
        "#fdb462",
        "#b3de69",
        "#fccde5"
      ]
    },
    {
      "name": "size",
      "type": "ordinal",
      "domain": [0, 1, 2, 3],
      "range": [100, 25, 20, 14]
    },
    {
      "name": "opacity",
      "type": "ordinal",
      "domain": [0, 1, 2, 3],
      "range": [0.15, 0.5, 0.8, 1.0]
    }
  ],

  "marks": [
    {
      "type": "rect",
      "from": {"data": "nodes"},
      "interactive": false,
      "encode": {
        "enter": {
          "fill": {"scale": "color", "field": "name"}
        },
        "update": {
          "x": {"field": "x0"},
          "y": {"field": "y0"},
          "x2": {"field": "x1"},
          "y2": {"field": "y1"}
        }
      }
    },
    {
      "type": "rect",
      "from": {"data": "leaves"},
      "encode": {
        "enter": {
          "stroke": {"value": "#fff"}
        },
        "update": {
          "x": {"field": "x0"},
          "y": {"field": "y0"},
          "x2": {"field": "x1"},
          "y2": {"field": "y1"},
          "fill": {"value": "transparent"}
        },
        "hover": {
          "fill": {"value": "red"}
        }
      }
    },
    {
      "type": "text",
      "from": {"data": "nodes"},
      "interactive": false,
      "encode": {
        "enter": {
          "font": {"value": "Helvetica Neue, Arial"},
          "align": {"value": "center"},
          "baseline": {"value": "middle"},
          "fill": {"value": "#000"},
          "text": {"field": "name"},
          "fontSize": {"scale": "size", "field": "depth"},
          "fillOpacity": {"scale": "opacity", "field": "depth"}
        },
        "update": {
          "x": {"signal": "0.5 * (datum.x0 + datum.x1)"},
          "y": {"signal": "0.5 * (datum.y0 + datum.y1)"}
        }
      }
    }
  ]
}
let chart = null;
let onboardingUI = null;

// const debouncedResize = debounce(async (event) => {
//   const config = await getAhoiConfig();
//   onboardingUI?.updateOnboarding(config)
// }, 250);

const debouncedResize = debounce((event) => {
  onboardingUI?.updateOnboarding(getAhoiConfig())
}, 250);


async function render() {
  const response = await fetch('./data/jobsplan.json');
  const json = await response.json();  
  console.log(json);

  chart = await embed('#vis', opt);
  window.addEventListener("resize", debouncedResize);
};



// registerEventListener();
render();
