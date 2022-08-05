import * as echarts from 'echarts';
// import {
//   generateBasicAnnotations,
//   ahoi,
//   EVisualizationType,
// } from '@visahoi/plotly';
import debounce from 'lodash.debounce';

let chart = null;
let showOnboarding = false;
let onboardingUI = null;

// const debouncedResize = debounce((event) => {
//   onboardingUI?.updateOnboarding(getAhoiConfig());
// }, 250);

const render = () => {
  chart = createPlot();
  window.addEventListener('resize', debouncedResize);
};

const createPlot = () => {
  const day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const dayTime = ['Morning', 'Afternoon', 'Evening'];
  const data = [
    {
      z: [
        [0, 0, 1],
        [0, 1, 0],
        [0, 2, 30],
        [0, 3, 50],
        [0, 4, 1],
        [1, 0, 20],
        [1, 1, 1],
        [1, 2, 60],
        [1, 3, 80],
        [1, 4, 30],
        [2, 0, 30],
        [2, 1, 60],
        [2, 2, 1],
        [2, 3, -10],
        [2, 4, 20],
      ].map(function (item) {
        return [item[1], item[0], item[2] || '-'];
      }),
    },
  ];

  const options = {
    tooltip: {
      position: 'top',
    },
    grid: {
      height: '50%',
      top: '10%',
    },
    xAxis: {
      type: 'category',
      data: dayTime,
      splitArea: {
        show: true,
      },
    },
    yAxis: {
      type: 'category',
      data: day,
      splitArea: {
        show: true,
      },
    },
    visualMap: {
      min: 0,
      max: 10,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%',
    },
    series: [
      {
        name: 'Punch Card',
        type: 'heatmap',
        data: data,
        label: {
          show: true,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  const config = {
    responsive: true,
  };

  chart.setOption(options);
  return chart;
};

// const getAhoiConfig = () => {
//   const defaultOnboardingMessages = generateBasicAnnotations(
//     EVisualizationType.HEATMAP,
//     chart,
//   );
//   const extendedOnboardingMessages = defaultOnboardingMessages.map((d) => ({
//     ...d,
//     text: 'test123',
//   }));
//   const ahoiConfig = {
//     onboardingMessages: defaultOnboardingMessages,
//   };
//   return ahoiConfig;
// };

const registerEventListener = () => {
  showOnboarding = !showOnboarding;
  const helpIcon = document.getElementById('show-onboarding');
  if (!helpIcon) {
    return;
  }
  helpIcon.addEventListener('click', async () => {
    showOnboarding = !showOnboarding;
    if (showOnboarding) {
      onboardingUI = await ahoi(
        EVisualizationType.HEATMAP,
        chart,
        getAhoiConfig(),
      );
    } else {
      onboardingUI?.removeOnboarding();
    }
  });
};

const createChart = (renderer = 'svg') => {
  const vis = document.getElementById('vis');
  chart = echarts.init(vis, null, { renderer });
  window.addEventListener('resize', () => chart.resize());
  // registerEventListener();
  render();
};

export default createChart;
