import React, { useState } from "react";
import { Ctx } from "./Ctx";
import { EditMenu } from "./EditMenu";
import { TriggerEvent } from "./types";

const initialValues = {
  menuOpen: false,
  path: "",
  text: "",
};

type TextUpdateProviderProps = {
  children: React.ReactNode;
  text?: Record<string, any>;
  triggerEvent?: TriggerEvent;
  save: (text: Record<string, any>) => any;
  active: boolean;
};

export const TextUpdateProvider = ({
  children,
  text,
  triggerEvent = TriggerEvent.onContextMenu,
  save = () => {},
  active = false,
}: TextUpdateProviderProps) => {
  const [state, setState] = useState(initialValues);

  return (
    <Ctx.Provider value={{ text, setState, triggerEvent, active }}>
      {children}
      {active && state.menuOpen && (
        <EditMenu
          path={state.path}
          text={state.text}
          onSave={(path, updatedText) => {
            setState(initialValues);
            set(path, updatedText, text);
            save(text);
          }}
          closeMenu={() => setState(initialValues)}
        />
      )}
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

  if (pathArray.length === 1) {
    if (typeof obj[currentProperty] === "undefined") {
      console.error("Unable to find path");
    }

    obj[currentProperty] = value;
    return;
  }

  set(pathArray.slice(1).join("."), value, obj[currentProperty]);
};
