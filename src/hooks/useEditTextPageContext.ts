import { useContext } from "react";
import { Ctx } from "../Ctx";

export const useEditTextPageContext = () => {
  const { text, save, active } = useContext(Ctx);

  return { textObject: text, save, active };
};
