import {
    EVisualizationType,
    IOnboardingMessages,
    generateMessages,
  } from "@visahoi/core";
import { IOnboardingScatterplotSpec } from "@visahoi/core/src/scatterplot";
  
  function extractOnboardingSpec(chart, coords): IOnboardingScatterplotSpec {
      console.log(chart)
    const dataCoords = chart._chartsViews[0]._symbolDraw._data._itemLayouts;
    const data = chart._chartsViews[0]._symbolDraw._data;
    const options = chart._model.option;

    const points = chart._chartsViews[0].renderTask.context.data._itemLayouts.filter(
        (point) => point[0] && point[1]
      );
    const xVals = [...points.map((point) => point[0])];
    const yVals = [...points.map((point) => point[1])];
    const maxX = Math.max(...xVals);
    const maxXIndex = xVals.indexOf(maxX);
    const maxY = yVals[maxXIndex];

    console.log(dataCoords[8])
    console.log("maxX ", maxX, "maxY ", maxY)
    console.log(options.xAxis)
    console.log(options.yAxis)
  
    return {
      chartTitle: {
        value: options.title[0].text,
        anchor: {
          findDomNodeByValue: true,
          offset: {left: -20, top: 10}
        }
      },
      type: {
        value: "scatter",
        anchor: {
          coords: {x: dataCoords[16][0], y: dataCoords[16][1]}
        }
      },
      yAxisTitle: {
        value: options.yAxis[0].name,
        anchor: {
          findDomNodeByValue: true,
          offset: {top: -20, left: 10}
        }
      },
      xAxisTitle: {
        value: options.xAxis[0].name,
        anchor: {
          findDomNodeByValue: true,
          offset: {left: -20, top: 10}
        }
      },
      maxValue: {
          value: maxX,
          anchor: {
            coords: {x: maxX, y: maxY}
          }
      }
    };
  }
  
  export function scatterplotFactory(chart, coords, visElementId: Element): IOnboardingMessages[] {
    const onbordingSpec = extractOnboardingSpec(chart, coords);
    return generateMessages(EVisualizationType.SCATTERPLOT, onbordingSpec, visElementId);
  }
  