import React, { useState, useEffect } from "react";
import Input from "./Input";
import styled from "styled-components";
import { Button } from "./Button";

const Dialog = styled.dialog`
  width: 100%;
  border: none;
  pointer-events: all;
  z-index: 999999;
  display: flex;
  justify-content: center;
  background-color: transparent;
  top: 25%;
`;

const Container = styled.div`
  border-radius: 8px;
  padding: 9px;
  box-shadow: 0 0 5px black;
  width: fit-content;
  background-color: white;
`;

type EditMenuProps = {
  path: string;
  text: string;
  onSave: (path: string, text: string) => void;
  closeMenu: () => void;
};

const inputWrapperStyles = {
  padding: "15px 10px",
};

const buttonsWrapperStyle = {
  padding: "10px 0 3px 5px",
};

export const EditMenu = ({ path, text, onSave, closeMenu }: EditMenuProps) => {
  const [updated, setUpdated] = useState(text);

  useEffect(() => {
    document.body.style.pointerEvents = "none";

    return () => {
      document.body.style.pointerEvents = "initial";
    };
  }, []);

  return (
    <Dialog open>
      <Container>
        <h3>
          Edit <q>{path}</q>
        </h3>
        <hr />
        <div style={inputWrapperStyles}>
          <Input text={text} onChange={(e) => setUpdated(e.target.value)} />
        </div>
        <hr />
        <div style={buttonsWrapperStyle}>
          <Button color="red" onClick={closeMenu}>
            Cancel
          </Button>
          <Button
            color="green"
            disabled={updated === text}
            onClick={() => onSave(path, updated)}
          >
            Save
          </Button>
        </div>
      </Container>
    </Dialog>
  );
};
