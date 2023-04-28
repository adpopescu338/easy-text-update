import { TextObject } from "../types";

export const get = (path: string, obj: TextObject): string => {
  let currentText: TextObject | string = obj;

  const pathArray = path.split(".");
  pathArray.forEach((key) => {
    currentText = currentText[key];
  });

  if (typeof currentText !== "string") {
    throw new Error(`The path ${path} is not a string`);
  }

  return currentText as string;
};
