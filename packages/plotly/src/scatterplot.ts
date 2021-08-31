import { EVisualizationType, IOnboardingMessages, generateMessages } from "@visahoi/core";
import { IOnboardingScatterplotSpec } from "@visahoi/core/src/scatterplot";

function extractOnboardingSpec(chart: any): IOnboardingScatterplotSpec {
  const traceNodes = chart.querySelectorAll("g.points");
  const areaNodes = traceNodes[0].querySelectorAll("path.point");
  const areaNodesData = Array.from(areaNodes).map((point: any) => point.__data__);
  const t = areaNodesData[0].trace;

  const grid = document
    .getElementsByClassName("nsewdrag drag")[0]
    .getBoundingClientRect();

  const points = (Array.from(areaNodes)as any[]).filter((point) =>
      point.getBoundingClientRect().x &&
      point.getBoundingClientRect().x <= grid.width + grid.x &&
      point.getBoundingClientRect().y &&
      point.getBoundingClientRect().y <= grid.height + grid.y
  );

  const xVals = points.map((point) => point.getBoundingClientRect().x);
  const yVals = points.map((point) => point.getBoundingClientRect().y);

  const maxX = Math.max(...xVals);
  const maxXIndex = xVals.indexOf(maxX);
  const maxY = yVals[maxXIndex];

  console.log(maxY)

  return {
    chartTitle: {
      value: chart.layout.title.text,
      anchor: {
        findDomNodeByValue: true,
        offset: {left: -20, top: 10}
      }
    },
    type: {
      value: t.type,
      anchor: {
        sel: '.points > .point:nth-child(4)' }
    },
    xAxisTitle: {
      value: chart.layout.xaxis.title.text,
      anchor: {
        sel: '.infolayer .xtitle',
        offset: {left: -20}
      }
    },
    yAxisTitle: {
      value: chart.layout.yaxis.title.text,
      anchor: {
        sel: '.infolayer .ytitle',
        offset: {top: -25}
      }
    },
    maxValue: {
      value: maxX,
      anchor: {
        coords: {x: maxX, y: maxY} //rendered too low (bc onset in anchor creation)
      }
  }
  };
}

export function scatterplotFactory(chart: Element): IOnboardingMessages[] {
  const onbordingSpec = extractOnboardingSpec(chart);
  return generateMessages(EVisualizationType.SCATTERPLOT, onbordingSpec, chart);
}
