import Button from './Button.svelte';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
// More on argTypes: https://storybook.js.org/docs/svelte/api/argtypes
export default {
  title: 'Plotly/Test',
  component: Button,
  argTypes: {
    name: { control: 'text' },
  },
};

// More on component templates: https://storybook.js.org/docs/svelte/writing-stories/introduction#using-args
const Template = (args) => ({
  Component: Button,
  props: args
});

// More on args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Test2 = Template.bind({});
Test2.args = {
  name: 'Button',
};