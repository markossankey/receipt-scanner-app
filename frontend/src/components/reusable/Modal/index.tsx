import { ReactNode } from "react";

/**
 * - Recommend padding is px-4 py-2
 *
 **/
export const Modal = ({ isVisible, children, onCancel, title, bodyClassName = "" }: ModalProps) => {
  return !isVisible ? null : (
    <div
      className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-10 flex justify-center items-center"
      onClick={onCancel}
    >
      <div
        className={`bg-malibu-900 border border-malibu-700 rounded-lg w-[40rem] h-[50rem] shadow-2xl p-4 overflow-hidden ${bodyClassName} flex flex-grow-0 justify-center`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-center p-4 text-2xl">{title}</h3>
        <div className="content px-4 py-2 ">{children}</div>
      </div>
    </div>
  );
};

type ModalProps = {
  isVisible: boolean;
  children: ReactNode;
  onCancel: () => void;
  title?: ReactNode;
  titleClassName?: string;
  bodyClassName?: string;
};
