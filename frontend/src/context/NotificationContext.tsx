import { createContext, ReactNode, useEffect, useState } from "react";

const defaultContext = {
  content: null,
};

export const NotificationContext = createContext(
  defaultContext as unknown as NotificationContextType
);

export const NotificationContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ReactNode>("");

  useEffect(() => {
    if (!!content) {
      const timer = setTimeout(() => setContent(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [content]);

  const props = {
    setContent,
  };

  return (
    <NotificationContext.Provider value={props}>
      {children}
      <>
        {!!content ? (
          <div className="fixed bottom-6 right-6 w-80 h-20 rounded bg-malibu-100 bg-opacity-80 backdrop-blur-sm">
            {content}
          </div>
        ) : null}
      </>
    </NotificationContext.Provider>
  );
};

export type NotificationContextType = {
  setContent: React.Dispatch<React.SetStateAction<ReactNode>>;
};
