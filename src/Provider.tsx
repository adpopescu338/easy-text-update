import React, { useState } from "react";
import { Ctx } from "./Ctx";
import { EditMenu } from "./components/EditMenu";
import { TextUpdateProviderProps, TriggerEvent } from "./types";
import set from "lodash/set";

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
    set(textObject, path, updatedText); // update the text object
    setTextObject({ ...textObject }); // save the updated text object in the state
    save(text, () => {
      // if the save fails, revert the text object to its previous state
      set(textObject, path, currentText);
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
    <Ctx.Provider
      value={{ text: textObject, setState, triggerEvent, active, save }}
    >
      {children}
      <Menu />
    </Ctx.Provider>
  );
};
