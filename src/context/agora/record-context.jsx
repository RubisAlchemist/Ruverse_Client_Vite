import { createContext } from "react";

export const RecordContext = createContext(null);

export const RecordProvider = ({ children, client }) => (
  <RecordContext.Provider value={{ ...client }}>
    {children}
  </RecordContext.Provider>
);
