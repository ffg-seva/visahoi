// @ts-ignore
import OnboardingUI from './components/OnboardingUI.svelte'
import { stores } from './components/stores.js'
import debounce from 'lodash.debounce'
import {
  IAhoiConfig,
  IAhoiIcons,
  IMarker,
  IOnboardingMessage,
  IOnboardingStage,
  NavigationAlignment,
  SvgIcons
} from './interfaces'
import { v4 as uuidv4 } from 'uuid'
import { get } from 'svelte/store'
import { getMarkerInformation } from './components/getMarkerInformation'
import { VisahoiState } from './components/state'
import { getMarkerDomId } from './utils'

let onboardingUI: OnboardingUI

export const injectOnboarding = (
  contextKey: string,
  ahoiConfig: IAhoiConfig,
  visElement: Element,
  alignment: NavigationAlignment,
  icons?: IAhoiIcons
) => {
  const s = get(stores)
  if (!s.has(contextKey)) {
    // INITIALIZING THE STORE FOR A NEW VIS
    const newState = new VisahoiState()
    newState.visElement.set(visElement)
    s.set(contextKey, newState)
  }
  const visState = s.get(contextKey)
  if (visState) {
    const {
      onboardingMessages,
      visahoiIcons,
      navigationAlignment,
      onboardingStages,
      showBackdrop,
      backdropOpacity,
      showHideCloseText,
      showOnboardingNavigation,      
      showOnboarding,
      contextId     
    } = visState
    
    contextId.set(contextKey)

    onboardingMessages.set(ahoiConfig.onboardingMessages)
    if (icons) {
      visahoiIcons.set(icons)
    }

    if (ahoiConfig?.alignment) {
      navigationAlignment.set(ahoiConfig.alignment)
    }

    if (ahoiConfig?.showOnboardingNavigation) {
      showOnboardingNavigation.set(ahoiConfig?.showOnboardingNavigation)
    }

    // de-duplicate onboarding stages
    const uniqueStages: IOnboardingStage[] = ahoiConfig.onboardingMessages
      .map((m) => m.onboardingStage)
      .reduce((prev: IOnboardingStage[], next: IOnboardingStage) => {
        if (prev.map((p) => p.id).includes(next.id)) {
          return prev
        }
        return [...prev, next]
      }, [] as IOnboardingStage[])
    onboardingStages.set(uniqueStages)

    navigationAlignment.set(alignment)
    if (
      ahoiConfig?.backdrop?.show !== null &&
      ahoiConfig?.backdrop?.show !== undefined
    ) {
      showBackdrop.set(ahoiConfig?.backdrop?.show)
    }
    if (
      ahoiConfig?.backdrop?.opacity !== null &&
      ahoiConfig?.backdrop?.opacity !== undefined
    ) {
      backdropOpacity.set(ahoiConfig?.backdrop?.opacity)
    }
    if (ahoiConfig?.showHelpCloseText === false) {
      showHideCloseText.set(ahoiConfig?.showHelpCloseText)
    }

    const ref = { update: () => {} }

    const updateOnboarding = (config: IAhoiConfig) => {
      onboardingMessages.set(config.onboardingMessages)
      ref.update()
    }

    onboardingUI = new OnboardingUI({
      target: document.body as Element,
      props: {
        // state for one specific visahoi Instance (usually a vis)
        visState,
        ref,
        visElement,
        contextKey
      }
    })
    showOnboarding.set(true)
    return {
      contextKey,
      updateOnboarding: debounce(updateOnboarding),
      showOnboarding: () => {
        showOnboarding.set(true)
      },
      removeOnboarding: () => {
        showOnboarding.set(false)
      }
    }
  } else {
    console.error('No store for contextKey ', contextKey)
    return null
  }
}

export const getOnboardingStages = (contextKey: string): IOnboardingStage[] => {
  const s = get(stores)
  const visState = s.get(contextKey)
  if (visState) {
    const { onboardingStages } = visState
    return get(onboardingStages)
  } else {
    console.error('No store for contextKey ', contextKey)
    return []
  }
}

export const getOnboardingMessages = (contextKey: string): IOnboardingMessage[] => {
  const s = get(stores)
  const visState = s.get(contextKey)
  if (visState) {
    const { onboardingMessages } = visState
    return get(onboardingMessages)
  } else {
    console.error('No store for contextKey ', contextKey)
    return []
  }
}

export const createBasicOnboardingStage = (contextKey: string, stage: IOnboardingStage) => {
  const s = get(stores)
  const visState = s.get(contextKey)
  if (visState) {
    const { onboardingStages } = visState
    if (!stage.id) {
      stage.id = `visahoi-stage-${uuidv4()}`
    }
    if (!stage.order) {
      const stages = get(onboardingStages)
      stage.order =
        stages.length > 0 ? Math.max(...stages.filter((s) => s.order).map((s) => s.order)) + 1 : 1
    }
    onboardingStages.set([...get(onboardingStages), stage])
    return stage
  } else {
    console.error('No store for contextKey ', contextKey)
    return null
  }
}

export const createBasicOnboardingMessage = (
  contextKey: string,
  message: Pick<
    IOnboardingMessage,
    'title' | 'text' | 'onboardingStage' | 'anchor' | 'id' | 'order'
  >
): IOnboardingMessage => {
  const s = get(stores)
  const visState = s.get(contextKey)
  if (visState) {
    const { onboardingStages, onboardingMessages, markerInformation, visElement } = visState

    const marker: IMarker = {
      id: `visahoi-marker-${contextKey}- ${uuidv4()}`
    }

    if (!message.id) {      
      message.id = `visahoi-message-${contextKey}- ${uuidv4()}`
    }

    if (!message.order) {
      const newMessageStage = get(onboardingStages).filter(
        (s) => s.id === message.onboardingStage.id
      )[0]

      const noOfMessages: IOnboardingMessage[] = get(onboardingMessages).filter(
        (m) => m.onboardingStage.id === newMessageStage?.id
      )

      message.order =
        noOfMessages.length > 0
          ? Math.max(...noOfMessages.filter((m) => m.order).map((m) => m.order as number)) + 1
          : 1
    }

    const onboardingMessage: IOnboardingMessage = {
      marker,
      ...message
    }
    onboardingMessages.set([...get(onboardingMessages), onboardingMessage])

    const newMarkerInfo = getMarkerInformation(get(visElement), get(onboardingMessages))
    markerInformation.set(newMarkerInfo)

    return onboardingMessage
  } else {
    console.error('No store for contextKey ', contextKey)
    return null
  }
}

export const deleteOnboardingStage = (contextKey: string, id: string) => {
  const s = get(stores)
  const visState = s.get(contextKey)
  if (visState) {
    const { onboardingStages } = visState
    const stages: IOnboardingStage[] = get(onboardingStages)
    stages.forEach((m, i) => {
      if (m.id === id) {
        stages.splice(i, 1)
      }
    })
    return onboardingStages.set(stages)
  } else {
    console.error('No store for contextKey ', contextKey)
    return null
  }
}

export const setOnboardingStage = (contextKey: string, stage: Partial<IOnboardingStage>) => {
  const s = get(stores)
  const visState = s.get(contextKey)
  if (visState) {
    const { onboardingStages, onboardingMessages, markerInformation, visElement } = visState

    let newStage: IOnboardingStage
    if (stage.id === undefined) {
      console.error('Provide the id of stage to be updated')
      return null
    } else {
      const tempOnboardingStages = get(onboardingStages)
      for (const tempStage of tempOnboardingStages) {
        if (tempStage.id === stage.id) {
          tempStage.order = stage.order ? stage.order : tempStage.order
          tempStage.title = stage.title ? stage.title : tempStage.title
          tempStage.activeBackgroundColor = stage.activeBackgroundColor
            ? stage.activeBackgroundColor
            : tempStage.activeBackgroundColor
          tempStage.backgroundColor = stage.backgroundColor
            ? stage.backgroundColor
            : tempStage.backgroundColor
          tempStage.hoverBackgroundColor = stage.hoverBackgroundColor
            ? stage.hoverBackgroundColor
            : tempStage.hoverBackgroundColor
          tempStage.icon = stage.icon
            ? stage.icon
            : tempStage.icon
          newStage = tempStage
          break
        }
      }
      const tempMessage = get(onboardingMessages).filter(
        (m) => m.onboardingStage.id === stage.id
      )
      const messages = get(onboardingMessages).filter(
        (m) => m.onboardingStage.id !== stage.id
      )
      const updateMsg = tempMessage.map((m) => {
        return {
          ...m,
          onboardingStage: newStage
        }
      })

      onboardingMessages.set([...messages, ...updateMsg])

      const newMarkerInfo = getMarkerInformation(get(visElement), get(onboardingMessages))
      markerInformation.set(newMarkerInfo)

      return onboardingStages.set(tempOnboardingStages)
    }
  } else {
    console.error('No store for contextKey ', contextKey)
    return null
  }
}

export const setOnboardingMessage = (
  contextKey: string,
  message: Pick<IOnboardingMessage, 'title' | 'text' | 'id'>
) => {
  const s = get(stores)
  const visState = s.get(contextKey)
  if (visState) {
    const { onboardingMessages, markerInformation } = visState
    if (message.id === undefined) {
      console.error('Please provide the id of message to be updated')
      return null
    } else {
      const tempOnboardingMessages = get(onboardingMessages)
      const tempMarkerInfo = get(markerInformation)
      for (const tempMessage of tempOnboardingMessages) {
        if (tempMessage.id === message.id) {
          tempMessage.text = message.text ? message.text : tempMessage.text
          tempMessage.title = message.title ? message.title : tempMessage.title
          break
        }
      }
      for (const tempMarker of tempMarkerInfo) {
        if (tempMarker.message.id === message.id) {
          tempMarker.tooltip.title = message.title
            ? message.title
            : tempMarker.tooltip.title
          tempMarker.tooltip.text = message.text
            ? message.text
            : tempMarker.tooltip.text

          break
        }
      }

      markerInformation.set(tempMarkerInfo)
      onboardingMessages.set(tempOnboardingMessages)
      return onboardingMessages.set(tempOnboardingMessages)
    }
  } else {
    console.error('No store for contextKey ', contextKey)
    return null
  }
}

export const setEditMode = (contextKey: string, value: boolean) => {
  const s = get(stores)
  const visState = s.get(contextKey)
  if (visState) {
    const { isEditModeActive } = visState
    return isEditModeActive.set(value)
  } else {
    console.error('No store for contextKey ', contextKey)
    return null
  }
}

export const getModeBarInteractions = (text) => {
  console.log(text);
  const modeBarDescriptions = new Map([
    ['Download plot as a png', 'You can download a .png of the chart'],
    ['Zoom', 'Click and drag the mouse over a certain part of the visualization to zoom in and get a more detailed view of the data.'],
    ['Pan', 'You can move the view left and right while dragging the mouse.'],
    ['Box Select', 'Drag the mouse over the chart to select some data.'],
    ['Lasso Select', 'Select the desired data by drawing a lasso loop.'],
    ['Zoom in', ' Zoom in to get a more detailed view of the chart.'],
    ['Zoom out', 'Zoom out to get a better overview of the chart.'],
    ['Autoscale', 'Zooms out to get a view of the whole visualization.'],
    ['Reset axes', 'It takes the chart to the inital layout settings.']
  ])
  
  let cameraIcon, zoomIcon, panIcon, selectionIcon, lassoSelectIcon, zoomInIcon, zoomOutIcon, autoScaleIcon, resetIcon;
  
  
  cameraIcon = `${text.includes('Download plot as a png') ? `${SvgIcons.CAMERA} <b>Screenshot</b>: ${modeBarDescriptions.get('Download plot as a png')}<br/>`: ''}`
zoomIcon = `${text.includes('Zoom') ? `${SvgIcons.ZOOM} <b>Zooming</b>: ${modeBarDescriptions.get('Zoom')}<br/>`: ''}`
panIcon = `${text.includes('Pan') ? `${SvgIcons.PAN} <b>Panning</b>: ${modeBarDescriptions.get('Pan')}<br/>`: ''}`
selectionIcon = `${text.includes('Box Select') ? `${SvgIcons.BOX_SELECTION} <b>Selection</b>: ${modeBarDescriptions.get('Box Select')}<br/>`: ''}`
 lassoSelectIcon = `${text.includes('Lasso Select') ? `${SvgIcons.LASSO_SELECTION} <b>Lasso Select</b>: ${modeBarDescriptions.get('Lasso Select')}<br/>`: ''}`
 zoomInIcon = `${text.includes('Zoom in') ? `${SvgIcons.ZOOM_IN} <b>Zoom in</b>: ${modeBarDescriptions.get('Zoom in')}<br/>`: ''}`
 zoomOutIcon = `${text.includes('Zoom out') ? `${SvgIcons.ZOOM_OUT} <b>Zoom out</b>: ${modeBarDescriptions.get('Zoom out')}<br/>`: ''}`
 autoScaleIcon = `${text.includes('Autoscale') ? `${SvgIcons.AUTO_SCALE} <b>Autoscale</b>: ${modeBarDescriptions.get('Autoscale')}<br/>`: ''}`
 resetIcon = `${text.includes('Reset axes') ? `${SvgIcons.RESET} <b>Reset</b>: ${modeBarDescriptions.get('Reset axes')}<br/>`: ''}`

  
  return {modeBarDescriptions, cameraIcon, zoomIcon, panIcon, selectionIcon, lassoSelectIcon, zoomInIcon, zoomOutIcon, autoScaleIcon, resetIcon}
}


// const cameraIcon = `${modebarText.includes('Download plot as a png') ? `${SvgIcons.CAMERA} <b>Screenshot</b>: ${getModeBarInteractions().get('Download plot as a png')}<br/>`: ''}`
// const zoomIcon = `${modebarText.includes('Zoom') ? `${SvgIcons.ZOOM} <b>Zooming</b>: ${getModeBarInteractions().get('Zoom')}<br/>`: ''}`
// const panIcon = `${modebarText.includes('Pan') ? `${SvgIcons.PAN} <b>Panning</b>: ${getModeBarInteractions().get('Pan')}<br/>`: ''}`
// // export  const selectionIcon = `${modebarText.includes('Box Select') ? `${SvgIcons.BOX_SELECTION} <b>Selection</b>: ${getModeBarInteractions().get('Box Select')}<br/>`: ''}`
// // export  const lassoSelectIcon = `${modebarText.includes('Lasso Select') ? `${SvgIcons.LASSO_SELECTION} <b>Lasso Select</b>: ${getModeBarInteractions().get('Lasso Select')}<br/>`: ''}`
// // export  const zoomInIcon = `${modebarText.includes('Zoom in') ? `${SvgIcons.ZOOM_IN} <b>Zoom in</b>: ${getModeBarInteractions().get('Zoom in')}<br/>`: ''}`
// // export  const zoomOutIcon = `${modebarText.includes('Zoom out') ? `${SvgIcons.ZOOM_OUT} <b>Zoom out</b>: ${getModeBarInteractions().get('Zoom out')}<br/>`: ''}`
// // export  const autoScaleIcon = `${modebarText.includes('Autoscale') ? `${SvgIcons.AUTO_SCALE} <b>Autoscale</b>: ${getModeBarInteractions().get('Autoscale')}<br/>`: ''}`
// // export  const resetIcon = `${modebarText.includes('Reset axes') ? `${SvgIcons.RESET} <b>Reset</b>: ${getModeBarInteractions().get('Reset axes')}<br/>`: ''}`

