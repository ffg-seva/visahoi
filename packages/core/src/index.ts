import { EVisualizationType, IOnboardingSpec, IOnboardingMessages } from './interfaces';
import { barChart, IOnboardingBarChartSpec } from './bar-chart';
import { changeMatrix, IOnboardingChangeMatrixSpec } from './change-matrix';
import { horizonGraph, IOnboardingHorizonGraphSpec } from './horizon-graph';

export * from './injector';
export * from './onboarding';
export * from './interfaces';
export { IOnboardingBarChartSpec } from './bar-chart';
export { IOnboardingChangeMatrixSpec } from './change-matrix';
export { IOnboardingHorizonGraphSpec } from './horizon-graph';

export function generateOnboardingMessages(chartType: EVisualizationType, spec: IOnboardingSpec, visElementId: string): IOnboardingMessages[] {
  switch(chartType) {
    case EVisualizationType.BAR_CHART:
      return barChart.generateOnboardingMessages(<IOnboardingBarChartSpec>spec, visElementId);

    case EVisualizationType.CHANGE_MATRIX:
      return changeMatrix.generateOnboardingMessages(<IOnboardingChangeMatrixSpec>spec, visElementId);

    case EVisualizationType.HORIZON_GRAPH:
      return horizonGraph.generateOnboardingMessages(<IOnboardingHorizonGraphSpec>spec, visElementId);
  }

  return [];
}

export default function logger(message: string) {
  console.log(message);
}
