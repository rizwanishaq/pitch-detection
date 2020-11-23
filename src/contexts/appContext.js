import React, { createContext, useContext, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

const AppContext = createContext();

export const GlobalContext = () => {
  return useContext(AppContext);
};

const AppContextProvider = ({ children }) => {
  //   Constant for APP
  const MODEL_URL = "https://tfhub.dev/google/tfjs-model/spice/2/default/1";

  const [model, setModel] = useState(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      const model = await tf.loadGraphModel(MODEL_URL, {
        fromTFHub: true,
      });
      setModel(model);
    };
    loadModel();
  }, []);

  return (
    <AppContext.Provider
      value={{
        model,
        start,
        setStart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export default AppContextProvider;
