// Button.stories.js|jsx

import { Toggle } from "./";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Toggle",
  component: Toggle,
};

export const Primary = () => <Toggle />;
