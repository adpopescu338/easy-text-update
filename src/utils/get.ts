export const get = (path: string, obj: Record<string, any>): string => {
  let currentText = obj;

  const pathArray = path.split(".");
  pathArray.forEach((key) => {
    currentText = currentText[key];
  });

  if (typeof currentText !== "string")
    throw new Error(`The path ${path} is not a string`);

  return currentText;
};
