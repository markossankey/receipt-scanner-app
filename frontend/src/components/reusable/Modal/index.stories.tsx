// Button.stories.js|jsx

import { Modal } from "./";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Modal",
  component: Modal,
};

export const Primary = () => (
  <Modal isVisible={true} onCancel={console.log}>
    Modal
  </Modal>
);
