// FormContext.js
import React, { createContext, useState } from "react";

const initialState = {
  observations: {
    date: new Date(),
    name: "",
    age: "",
    goalObservations: "",
    descriptions: "",
  },
  dailyReport: {
    date: new Date(),
    activities: "",
  },
  goals: {
    date: null,
    name: "",
    age: "",
    goals: "",
  },
  criticalReflection: {
    date: null,
    description: "",
  },
  weeklyReflection: {
    date: null,
    description_reflection: "",
  },
  weeklyPlanning: {
    date: null,
    rangeAge: "",
    descriptionPlanning: "",
  },
  followUp: {
    date: null,
    name: "",
    age: "",
    goalFollowUp: "",
    descriptionsFollowUp: "",
  },
};

export const FormContext = createContext({
    formData: initialState,
    setFormData: () => {},
    updateFormData: () => {},
  });

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState(initialState);
  const updateFormData = (updatedData) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ...updatedData,
    }));
  };
  console.log("FormProvider formData:", formData);
  return (
    <FormContext.Provider value={{ formData, setFormData, updateFormData }}>
    {children}
  </FormContext.Provider>
  );
};
