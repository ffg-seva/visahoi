import readingIcon from './assets/glasses-solid.svg';
import analyzingIcon from './assets/lightbulb-solid.svg';
import interactingIcon from './assets/hand-point-up-regular.svg';

/**
 * Supported chart types
 */
export enum EVisualizationType {
  BAR_CHART = 'bar-chart',
  CHANGE_MATRIX = 'change-matrix',
  HORIZON_GRAPH = 'horizon-graph',
  SCATTERPLOT = 'scatterplot',
  TREEMAP = 'treemap',
  HEATMAP = 'heatmap',
}

export interface IBackdrop {
  visElement: Element;
  color?: string;
}

export type NavigationAlignment = 'row' | 'column';

interface IPoint {
  x: number;
  y: number;
}

interface IOnboardingAnchorBase {
  offset?: { left?: number; top?: number; right?: number; bottom?: number };
  findDomNodeByValue?: boolean;
}

interface IOnboardingCoordsAnchor extends IOnboardingAnchorBase {
  sel?: string; // TODO: can we remove this? it is part of IOnboardingDOMAnchor
  coords: IPoint | number[];
}

interface IOnboardingDOMAnchor extends IOnboardingAnchorBase {
  sel: string;
}

interface IOnboardingElementAnchor extends IOnboardingAnchorBase {
  element?: HTMLElement;
}

export type OnboardingAnchor =
  | IOnboardingCoordsAnchor
  | IOnboardingDOMAnchor
  | IOnboardingElementAnchor;

export const isOnboardingElementAnchor = (
  element: OnboardingAnchor
): element is IOnboardingElementAnchor => {
  return (element as IOnboardingElementAnchor).element !== undefined
}

export interface ISpecProp {
  value: any;
  anchor?: OnboardingAnchor;
  domNodeValue?: string;
}

export interface IOnboardingSpec {
  [key: string]: ISpecProp | undefined;
}

export interface IBackdropConfig {
  show: boolean;
  opacity?: number;
}

export interface IAhoiIcons {
  trash: string;
  close: string;
  questionmark: string;
  toggleOn: string;
  toggleOff: string;
  edit: string;
  check: string;
  chevronUp: string;
  chevronDown: string;
}

export type OnboardingStage = string;

export interface IOnboardingStage {
  id: string;
  title: string;
  icon: string;
  backgroundColor: string;
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
  order?: number;
}

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface IMarker {
  radius?: number;
  fontSize?: string;
  content?: string;
  id: string;
}

export interface IOnboardingMessage {
  id: string;
  anchor: OnboardingAnchor | undefined;
  requires?: string[]; // TODO: remove optional again
  text: string;
  title: string;
  onboardingStage: IOnboardingStage;
  tooltipPosition?: TooltipPosition;
  marker: IMarker;
  order?: number;
}

export interface IAhoiConfig {
  onboardingMessages: IOnboardingMessage[];
  backdrop?: IBackdropConfig;
  showHelpCloseText?: boolean;
  showOnboardingNavigation?: boolean;
}

export enum EDefaultOnboardingStages {
  READING = 'reading-the-chart',
  USING = 'using-the-chart',
  ANALYZING = 'analyze-the-chart',
}

export enum EDefaultOnboardingStageNavigation {
  PREVIOUS = 'previous',
  NEXT = 'next',
}

export interface IOnboardingStageNavigation {
  id: string;
  backgroundColor: string;
}

// TODO: move to right place
export const defaultOnboardingStages: Map<
  EDefaultOnboardingStages,
  IOnboardingStage
> = new Map([
  [
    EDefaultOnboardingStages.READING,
    {
      id: EDefaultOnboardingStages.READING,
      title: 'Reading',
      icon: readingIcon,
      hoverBackgroundColor: 'rgb(92, 59, 112)',
      backgroundColor: 'rgb(123, 80, 150)',
      activeBackgroundColor: 'rgb(76, 46, 94)',
      order: 3
    }
  ],
  [
    EDefaultOnboardingStages.USING,
    {
      id: EDefaultOnboardingStages.USING,
      title: 'Interacting',
      icon: interactingIcon,
      backgroundColor: 'rgb(0, 61, 92)',
      order: 2
    }
  ],
  [
    EDefaultOnboardingStages.ANALYZING,
    {
      id: EDefaultOnboardingStages.ANALYZING,
      title: 'Analyzing',
      icon: analyzingIcon,
      backgroundColor: 'rgb(254, 128, 41)',
      order: 1
    }
  ]
])

export interface IAnchorPosition {
  x: number;
  y: number;
  cx: number;
  cy: number;
  offset?: { left?: number; top?: number; right?: number; bottom?: number };
}

export interface ITooltip {
  title: string;
  text: string;
  position: TooltipPosition;
}

export interface IMarkerInformation {
  tooltip: ITooltip;
  anchorPosition: IAnchorPosition;
  message: IOnboardingMessage;
  marker: IMarker;
}
