// Button.stories.js|jsx

import dayjs from "dayjs";
import { useState } from "react";
import { DatePicker } from "./";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "DatePicker",
  component: DatePicker,
};

export const Default = () => {
  const [date, setDate] = useState(dayjs().toISOString());
  return (
    <DatePicker
      onChange={(e) => setDate(e)}
      onBlur={() => console.log("blurred")}
      value={date}
      name="storybook-calendar"
    />
  );
};
