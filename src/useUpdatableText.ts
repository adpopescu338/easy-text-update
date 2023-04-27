import { TriggerEvent } from "./types";
import { Ctx } from "./Ctx";
import { useContext } from "react";
import { get } from "./utils";

export type UseUpdatableTextConfig = {
  triggerEvent?: TriggerEvent;
  returnChildren?: boolean;
  innerHtml?: boolean;
};

export type OpenEditMenuEventHandler = {
  [key in TriggerEvent]?: (e: any) => void;
};

export type UpdatableElementProps = {
  children?: string;
  dangerouslySetInnerHTML?: {
    __html: string;
  };
} & OpenEditMenuEventHandler;

export const defaultUpdatableConfig: UseUpdatableTextConfig = {
  triggerEvent: TriggerEvent.onContextMenu,
  returnChildren: true,
  innerHtml: false,
};

export const useUpdatableText = (
  path: string,
  updatableConfig: UseUpdatableTextConfig = defaultUpdatableConfig
): {
  text: string;
  props: UpdatableElementProps;
} => {
  const {
    text,
    setState,
    triggerEvent: triggerEventFromCtx,
    active,
  } = useContext(Ctx);

  if (!text) {
    console.error("No text object provided to useUpdatableText");
    return {
      text: "",
      props: {},
    };
  }

  const currentText = get(path, text);

  return {
    text: currentText,
    props: {
      ...(updatableConfig.returnChildren && { children: currentText }),
      ...(updatableConfig.innerHtml && {
        dangerouslySetInnerHTML: {
          __html: currentText,
        },
      }),
      ...(active && {
        [updatableConfig.triggerEvent || triggerEventFromCtx]: (e: any) => {
          e.preventDefault();
          setState({
            menuOpen: true,
            path,
            text: currentText,
          });
        },
      }),
    },
  };
};
