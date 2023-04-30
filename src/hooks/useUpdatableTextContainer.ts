import { Ctx } from "../Ctx";
import { useContext } from "react";
import {
  UseUpdatableTextConfig,
  UpdatableElementProps,
  defaultUpdatableConfig,
} from "./useUpdatableText";
import get from "lodash/get";

type UseUpdatableTextContainerReturn = {
  getText: (subpath: string) => string;
  getProps: (
    subpath: string,
    config?: UseUpdatableTextConfig
  ) => UpdatableElementProps;
};

export const useUpdatableTextContainer = (
  path: string,
  updatableContainerConfig: UseUpdatableTextConfig = defaultUpdatableConfig
): UseUpdatableTextContainerReturn => {
  const {
    text,
    setState,
    triggerEvent: triggerEventFromCtx,
    active,
  } = useContext(Ctx);

  if (!text) {
    console.error("No text object provided");
    return {
      getText: () => "",
      getProps: () => ({}),
    };
  }

  let current = text;

  const pathArray = path.split(".");
  pathArray.forEach((key) => {
    current = current[key];
  });

  return {
    getText: (subpath: string) => get(subpath, current),
    getProps: (subpath: string, config?: UseUpdatableTextConfig) => {
      const textContent = get(subpath, current);

      const shouldReturnChildren =
        config?.returnChildren ?? updatableContainerConfig.returnChildren;
      const shouldReturnHtml =
        config?.innerHtml ?? updatableContainerConfig.innerHtml;

      return {
        ...(shouldReturnChildren && { children: textContent }),
        ...(shouldReturnHtml && {
          dangerouslySetInnerHTML: {
            __html: textContent,
          },
        }),
        ...(active && {
          [config?.triggerEvent ||
          updatableContainerConfig.triggerEvent ||
          triggerEventFromCtx]: (e: any) => {
            e.preventDefault();
            setState({
              menuOpen: true,
              path: `${path}.${subpath}`,
              text: textContent,
            });
          },
        }),
      };
    },
  };
};
