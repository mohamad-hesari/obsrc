import React from "react";

export function createGenericContext<T>(name?: string) {
  // Create a context with a generic parameter or undefined
  const genericContext = React.createContext<T | undefined>(undefined);

  // Check if the value provided to the context is defined or throw an error
  const useGenericContext = () => {
    const contextIsDefined = React.useContext(genericContext);
    if (!contextIsDefined) {
      throw new Error(
        `${name}:: useGenericContext must be used within a Provider`,
      );
    }
    return contextIsDefined;
  };

  return [useGenericContext, genericContext.Provider] as const;
}

export function uuid(prefix?: string) {
  try {
    let crypto: Crypto | undefined;
    if ("crypto" in window) crypto = window.crypto;
    if (crypto) {
      if (crypto.randomUUID) return `${prefix ?? ""}${crypto.randomUUID()}`;
      else if (crypto.getRandomValues) {
        const getRandomValues = crypto.getRandomValues;
        const id = "10000000-1000-4000-8000-100000000000".replace(
          /[018]/g,
          (char) => {
            const c = Number(char);
            return (
              c ^
              (getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
            ).toString(16);
          },
        );
        return `${prefix ?? ""}${id}`;
      }
    }
  } catch {
    // do nothing
    // there is bug in ios webkit for this
  }
  return `${prefix ?? ""}${simpleRandomId()}`;
}

function simpleRandomId() {
  return (
    new Date().getTime().toString(16) + Math.random().toString(16).substring(2)
  );
}
