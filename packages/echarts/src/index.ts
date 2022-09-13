import {
  createBasicOnboardingMessage,
  createBasicOnboardingStage,
  deleteOnboardingStage,
  EVisualizationType,
  getOnboardingMessages,
  getOnboardingStages,
  IAhoiConfig,
  injectOnboarding,
  IOnboardingMessage,
  setEditMode,
  setOnboardingMessage,
  setOnboardingStage
} from '@visahoi/core'
import { barChartFactory } from './bar-chart'
import { changeMatrixFactory } from './change-matrix'
import { horizonGraphFactory } from './horizon-graph'
import { scatterplotFactory } from './scatterplot'
import { treemapFactory } from './treemap'
// just pass them through
export {
  createBasicOnboardingMessage,
  createBasicOnboardingStage,
  getOnboardingStages,
  getOnboardingMessages,
  deleteOnboardingStage,
  setOnboardingStage,
  setOnboardingMessage,
  setEditMode
}

/**
 *
 * @param visType see EVisualizationType
 * @param chart runtime object of the visualization
 * @param onboardingElement ID of the DOM Element where the onboarding Messages should be displayed
 */
export const generateBasicAnnotations = (
  visType: EVisualizationType,
  chart: any
): IOnboardingMessage[] => {
  const coords = {}
  const visElement = chart._dom

  // TODO: coords
  const chartTitlePosition =
    chart._componentsMap['_ec_\u0000series\u00000\u00000_title']?.group
      .position
  coords.chartTitle = chartTitlePosition
    ? { x: chartTitlePosition[0], y: chartTitlePosition[1] + 20 }
    : null

  let onboardingMessages: IOnboardingMessage[]

  switch (visType) {
    case EVisualizationType.BAR_CHART:
      onboardingMessages = barChartFactory(chart, coords, visElement)
      break

    case EVisualizationType.CHANGE_MATRIX:
      onboardingMessages = changeMatrixFactory(chart, coords, visElement)
      break

    case EVisualizationType.HORIZON_GRAPH:
      onboardingMessages = horizonGraphFactory(chart, coords, visElement)
      break

    case EVisualizationType.SCATTERPLOT:
      onboardingMessages = scatterplotFactory(chart, coords, visElement)
      break

    case EVisualizationType.TREEMAP:
      onboardingMessages = treemapFactory(chart, coords, visElement)
      break

    default:
      throw new Error(
        `No onboarding for visualization type ${visType} available.`
      )
  }
  return onboardingMessages
}

/**
 *
 * @param visType
 * @param chart
 * @param onboardingElement ID of the DOM Element where the onboarding Messages should be displayed
 */
export async function ahoi (
  visType: EVisualizationType,
  chart: any,
  ahoiConfig: IAhoiConfig
) {
  const visElement = chart._dom
  return injectOnboarding(ahoiConfig, visElement, 'column')
}

export { EVisualizationType }
