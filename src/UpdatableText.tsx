import React, { ReactElement } from "react";
import { TriggerEvent } from "./types";
import { Ctx } from "./Ctx";
import { get } from "./utils";
import { UseUpdatableTextConfig } from "./useUpdatableText";

type UpdatableTextProps = {
  path: string;
  children?: ReactElement | ((text: string) => ReactElement);
  component?: ReactElement;
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

  if (children && component) {
    throw new Error(
      "Provided both children and component prop to UpdatableText"
    );
  }

  const currentText = get(path, text);

  let elementToRender: ReactElement;

  if (typeof children === "function") {
    elementToRender = children(text as string);
  } else {
    elementToRender = children || component || <span />;
  }

  return {
    ...elementToRender,
    props: {
      ...elementToRender.props,
      ...(innerHtml && {
        dangerouslySetInnerHTML: {
          __html: currentText,
        },
      }),
      ...(returnChildren && {
        children: currentText,
      }),

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
    },
  };
};
