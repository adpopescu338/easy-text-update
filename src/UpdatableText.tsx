import React, { ReactElement } from "react";
import { TriggerEvent } from "./types";
import { Ctx } from "./Ctx";
import { get } from "./utils";
import {
  UseUpdatableTextConfig,
  OpenEditMenuEventHandler,
} from "./useUpdatableText";

type ElementOrFunction =
  | ReactElement
  | ((text: string, editProps: OpenEditMenuEventHandler) => ReactElement);

type UpdatableTextProps = {
  path: string;
  children?: ElementOrFunction;
  component?: ElementOrFunction;
} & UseUpdatableTextConfig;

export const UpdatableText = ({
  path,
  children,
  component,
  triggerEvent = TriggerEvent.onContextMenu,
  innerHtml = false,
  returnChildren = true,
}: UpdatableTextProps) => {
  const {
    text,
    setState,
    triggerEvent: triggerEventFromCtx,
    active,
  } = React.useContext(Ctx);

  if (!text) {
    console.error("No text provided to UpdatableText");
    return null;
  }

  if (children && component) {
    throw new Error(
      "Provided both children and component prop to UpdatableText"
    );
  }

  const currentText = get(path, text);

  const editProps = {
    ...(active && {
      [triggerEvent || triggerEventFromCtx]: (e: any) => {
        e.preventDefault();
        setState({
          menuOpen: true,
          path,
          text: currentText,
        });
      },
    }),
  };

  if (typeof children === "function") {
    return children(text as string, editProps);
  }

  if (typeof component === "function") {
    return component(text as string, editProps);
  }

  const elementToRender: ReactElement = children || component || <span />;

  const canHaveChildren = !["input", "textarea"].includes(
    elementToRender.type as string
  );

  return {
    ...elementToRender,
    props: {
      ...elementToRender.props,
      ...(canHaveChildren &&
        innerHtml && {
          dangerouslySetInnerHTML: {
            __html: currentText,
          },
        }),
      ...(canHaveChildren &&
        returnChildren && {
          children: currentText,
        }),
      ...editProps,
    },
  };
};
