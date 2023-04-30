import React from "react";
import { useEditTextPageContext } from "../../hooks/useEditTextPageContext";
import { EditMenu } from "../EditMenu";
import set from "lodash/set";
import cloneDeep from "lodash/cloneDeep";
import styled from "styled-components";
import isEqual from "lodash/isEqual";
import { JSONEditor } from "./JSONEditor";
import { Button } from "../Button";
import { TextObject } from "../../types";

const initialValues = {
  menuOpen: false,
  path: "",
  text: "",
  textObject: {} as TextObject,
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-height: 98vh;
  position: relative;
`;

const ButtonsContainer = styled.div`
  display: flex;
  padding-top: 15px;
  padding-bottom: 15px;
  justify-content: flex-end;
  gap: 15px;
  margin-top: auto;
`;

export type EditTextPageProps = {
  onInactive?: () => void;
  onSave?: (textObject: TextObject) => void | Promise<void>;
  title?: string;
};

export const EditTextPage = ({
  onInactive,
  onSave,
  title,
}: EditTextPageProps) => {
  const { textObject, save, active } = useEditTextPageContext();
  const [values, setValues] = React.useState({
    ...initialValues,
    textObject: cloneDeep(textObject),
  });

  // Update title if provided and active
  // @ts-expect-error - Not all paths return a value. It's fine.
  React.useEffect(() => {
    if (active && title) {
      const initialTitle = document.title;
      document.title = title;

      // Reset title on unmount
      return () => {
        document.title = initialTitle;
      };
    }
  }, []);

  if (!active) {
    if (typeof onInactive === "function") {
      onInactive();
    }
    return null;
  }

  const saveCb = typeof onSave === "function" ? onSave : save;

  const disabled = isEqual(textObject, values.textObject);

  return (
    <>
      <Container>
        <JSONEditor
          node={values.textObject}
          openMenu={(path: string, text: string) => {
            setValues({
              ...values,
              path,
              menuOpen: true,
              text,
            });
          }}
        />

        <ButtonsContainer>
          <Button
            color="red"
            onClick={() =>
              setValues({ ...values, textObject: cloneDeep(textObject) })
            }
            disabled={disabled}
          >
            Cancel
          </Button>
          <Button
            disabled={disabled}
            color="green"
            onClick={() =>
              saveCb(values.textObject, () => {
                console.warn("Cannot revert on Edit Text Page");
              })
            }
          >
            Save
          </Button>
        </ButtonsContainer>
        {values.menuOpen && (
          <EditMenu
            closeMenu={() =>
              setValues({
                ...values,
                menuOpen: false,
              })
            }
            path={values.path}
            text={values.text}
            onSave={(path: string, text: string) => {
              set(values.textObject, path, text);
              setValues({
                ...initialValues,
                textObject: { ...values.textObject },
              });
            }}
          />
        )}
      </Container>
    </>
  );
};
