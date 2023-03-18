import { useState } from "react";

export const Toggle = ({ value, onClick }: { value: boolean; onClick: () => void }) => {
  return (
    <div
      className={classNames(
        "w-12 h-6 rounded-full transition-all duration-300 relative ",
        value ? "bg-green-500" : "bg-gray-100 "
      )}
      onClick={onClick}
    >
      <span
        className={classNames(
          "w-2/5 h-4/5 bg-gray-300 rounded-full absolute top-0.5 transition-all duration-300",
          value ? "left-6" : "left-1"
        )}
      ></span>
    </div>
  );
};

function classNames(...rest: string[]) {
  return rest.join(" ");
}
