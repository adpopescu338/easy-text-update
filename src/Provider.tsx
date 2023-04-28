import React, { useState } from "react";
import { Ctx } from "./Ctx";
import { EditMenu } from "./EditMenu";
import { TextUpdateProviderProps, TriggerEvent } from "./types";

const initialValues = {
  menuOpen: false,
  path: "",
  text: "",
};

export const TextUpdateProvider = ({
  children,
  text,
  triggerEvent = TriggerEvent.onContextMenu,
  save = () => {},
  active = false,
  editMenuComponent,
}: TextUpdateProviderProps) => {
  const [state, setState] = useState(initialValues);
  const [textObject, setTextObject] = useState(text);

  const onSave = (path: string, updatedText: string) => {
    const currentText = state.text;
    setState(initialValues);
    set(path, updatedText, textObject); // update the text object
    setTextObject({ ...textObject }); // save the updated text object in the state
    save(text, () => {
      // if the save fails, revert the text object to its previous state
      set(path, currentText, textObject);
      setTextObject({ ...textObject });
    });
  };

  const Menu = () => {
    if (!active || !state.menuOpen) {
      return null;
    }

    if (typeof editMenuComponent === "function") {
      try {
        return editMenuComponent({
          initialText: state.text,
          closeMenu: () => setState(initialValues),
          save: (updatedText: string) => onSave(state.path, updatedText),
        });
      } catch (e) {
        console.error(e);
        throw new Error("editMenuComponent must return a React component");
      }
    }

    return (
      <EditMenu
        path={state.path}
        text={state.text}
        onSave={onSave}
        closeMenu={() => setState(initialValues)}
      />
    );
  };

  return (
    <Ctx.Provider value={{ text: textObject, setState, triggerEvent, active }}>
      {children}
      <Menu />
    </Ctx.Provider>
  );
};

const set = (
  path: string,
  value: string,
  obj: TextUpdateProviderProps["text"]
) => {
  const pathArray = path.split(".");

  const [currentProperty] = pathArray;

  const currentValue = obj[currentProperty];

  if (pathArray.length === 1) {
    if (currentValue === "undefined") {
      throw new Error(
        `The path "${path}" does not exist on the object passed to TextUpdateProvider`
      );
    }

    if (typeof currentValue !== "string") {
      throw new Error(
        `The path "${path}" does not point to a string on the object passed to TextUpdateProvider`
      );
    }

    obj[currentProperty] = value;
    return;
  }

  const pathWithoutCurrentProperty = pathArray.slice(1).join(".");

  if (typeof currentValue === "string") {
    throw new Error(
      `The path "${path}" does not point to an object on the object passed to TextUpdateProvider`
    );
  }

  set(
    pathWithoutCurrentProperty,
    value,
    obj[currentProperty] as TextUpdateProviderProps["text"]
  );
};
