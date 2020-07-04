import { SpecProp, OnboardingSpec, OnboardingMessages } from "./interfaces";

export interface OnboardingBarChartSpec extends OnboardingSpec {
  chartTitle: SpecProp;
  type: SpecProp;
  orientation: SpecProp;
  xAxisOrientation: SpecProp;
  yAxisOrientation: SpecProp;
  barLength: SpecProp;
  xMin: SpecProp;
  xMax: SpecProp;
  yMin: SpecProp;
  yMax: SpecProp;
  xAxisTitle: SpecProp;
  yAxisTitle: SpecProp;
}


export function generateOnboardingMessages(spec: OnboardingBarChartSpec): OnboardingMessages[] {
  const messages = [
    {
      anchor: spec.chartTitle.anchor,
      requires: ['chartTitle'],
      legend: `The chart shows the ${spec.chartTitle.value}.`,
    },
    {
      anchor: spec.type.anchor,
      requires: ['type'],
      legend: `Each ${spec.type.value} represents a data item.`,
    },
    {
      anchor: spec.yAxisTitle.anchor,
      requires: ['type', 'barLength', 'yAxisTitle', 'xAxisTitle'],
      legend: `The ${spec.barLength.value} of each ${spec.type.value} shows e.g., the <span class="hT">${spec.yAxisTitle.value} (y-axis)</span> for a certain ${spec.xAxisTitle.value}.`,
    },
    {
      anchor: spec.xAxisTitle.anchor,
      requires: ['type', 'xAxisOrientation', 'xAxisTitle'],
      legend: `The ${spec.xAxisOrientation.value} position of each ${spec.type.value} represents the <span class="hT">${spec.xAxisTitle.value} (x-axis)</span>.`,
    },
    {
      anchor: spec.yMin.anchor,
      requires: ['yAxisTitle', 'yMin'],
      legend: `The <span class="hT">minimum</span> ${spec.yAxisTitle.value} is ${spec.yMin.value}.`,
    },
    {
      anchor: spec.yMax.anchor,
      requires: ['yAxisTitle', 'yMax'],
      legend: `The <span class="hT">maximum</span> ${spec.yAxisTitle.value} is ${spec.yMax.value}.`,
    },
  ];

  // Filter for messages where all template variables are available in the spec
  return messages.filter((message) => message.requires.every((tplVars) => spec[tplVars]));
};
