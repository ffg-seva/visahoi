import {
  EVisualizationType,
  IOnboardingMessage,
  generateMessages
} from '@visahoi/core'
import { IOnboardingScatterplotSpec } from '@visahoi/core/src/scatterplot'

/**
 * To get onboarding specifications.
 * @param {any} chart - Runtime object of the visualization.
 * @param {any} coords - x and y position. It is optional.
 * @returns {IOnboardingScatterplotSpec} - It returns the specification for scatterplot.
 */

function extractOnboardingSpec (chart: any, coords): IOnboardingScatterplotSpec {
  const heatmapData = (<any>(
    Array.from(<NodeList>chart.querySelectorAll('.hm'))[0]
  )).__data__
  const t = heatmapData[0].trace

  const minColor = chart?._fullData[0]?.colorscale[0][1]
  const maxColor = chart?._fullData[0]?.colorscale[2][1]
  const midColor = chart?._fullData[0]?.colorscale[1][1]

  const minArray = t.z.map((d) => Math.min(...d.filter(n => n !== null)))
  const maxArray = t.z.map((d) => Math.max(...d))

  const min = minArray ? Math.min(...minArray) : null
  const max = maxArray ? Math.max(...maxArray) : null

  /** To get the position for placing the max, min and empty value markers */

  const xGrids = document.getElementsByClassName('xgrid crisp')
  const yGrids = document.getElementsByClassName('ygrid crisp')

  const emptyValue = t.z.map((tt) => tt.filter(n => n === null))[0]

  const getXYPosition = (value) => {
    const ZArray = t.z.map((tt) => tt.indexOf(value))
    const XGridIndex = ZArray.filter(t => t > -1)[0]
    const YGridIndex = ZArray.indexOf(XGridIndex)

    const x = xGrids[XGridIndex].getBoundingClientRect().x
    const y = yGrids[YGridIndex].getBoundingClientRect().y
    return [x, y]
  }

  const [minX, minY] = getXYPosition(min)
  const [maxX, maxY] = getXYPosition(max)

  let nullX, nullY

  if (emptyValue) {
    [nullX, nullY] = getXYPosition(null)
  }

  return {
    chartTitle: {
      value: chart.layout.title.text,
      anchor: {
        findDomNodeByValue: true,
        offset: { left: -40, top: -20 }
      }
    },
    heatmapDescription: {
      value: t.type,
      anchor: {
        sel: '.heatmaplayer > .hm > image',
        offset: { left: -50, top: -40 }
      }
    },
    legendDescription: {
      value: t.colorbar.title.text,
      anchor: {
        sel: '.infolayer > .colorbar',
        offset: { top: -10 }
      }
    },
    axisDescription: {
      value: t?.yaxis?.title?.text,
      anchor: {
        sel: '.infolayer > .g-ytitle',
        offset: { bottom: -320, left: -50 }
      }
    },
    xAxis: {
      value: chart.layout?.xaxis?.title?.text
    },
    yAxis: {
      value: chart.layout?.yaxis?.title?.text
    },
    hoverDescription: {
      value: t?.xaxis?.title?.text,
      anchor: {
        sel: '.cartesianlayer',
        offset: { left: -120, top: -90 }
      }
    },
    maxValue: {
      value: max,
      anchor: {
        coords: { x: maxX, y: maxY }
      }
    },
    minValue: {
      value: min,
      anchor: {
        coords: { x: minX, y: minY }
      }
    },
    emptyValue: {
      value: 0,
      anchor: {
        coords: { x: nullX, y: nullY }
      }
    },
    plotlyModebar: {
      value: "",
      anchor: {
        sel: '.modebar--hover'
      }
    },
    minColor: {
      value: minColor 
    },
    maxColor: {
      value: maxColor
    },
    midColor: {
      value: midColor
    }
  }
}

/**
 * To generate basic onboarding messages for heatmap. 
 * @param {string} contextKey -Context key of the visualization.
 * @param {Element} chart - Runtime object of the visualization.
 * @param {any} coords - x and y cordinates to which the onboarding is attached.
 * @param {Element} visElementId - The DOM element to which the onboardings to be placed.
 * @returns {IOnboardingMessage[]} - It returns all the generated onboarding messages for the visualization.
 */

export function heatmapFactory (
  contextKey: string, 
  chart: Element,
  coords,
  visElementId: Element
): IOnboardingMessage[] {
  const onbordingSpec = extractOnboardingSpec(chart, coords)
  return generateMessages(
    contextKey, 
    EVisualizationType.HEATMAP,
    onbordingSpec,
    visElementId
  )
}
