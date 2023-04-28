import React, { useState, CSSProperties, useEffect } from "react";
import Input from "./Input";

const dialogStyles: CSSProperties = {
  width: "100%",
  border: "none",
  pointerEvents: "all",
  zIndex: 999999,
  display: "flex",
  justifyContent: "center",
};

const containerStyles: CSSProperties = {
  borderRadius: "8px",
  padding: "9px",
  boxShadow: "0 0 5px black",
  width: "fit-content"
};

type EditMenuProps = {
  path: string;
  text: string;
  onSave: (path: string, text: string) => void;
  closeMenu: () => void;
};

const buttonStyles: CSSProperties = {
  fontSize: 15,
  padding: "5px 10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "white",
  boxShadow: "0 0 3px black",
  margin: "0 5px",
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
    <dialog open style={dialogStyles}>
      <div style={containerStyles}>
        <h3>
          Edit <q>{path}</q>
        </h3>
        <hr />
        <div style={inputWrapperStyles}>
          <Input text={text} onChange={(e) => setUpdated(e.target.value)} />
        </div>
        <hr />
        <div style={buttonsWrapperStyle}>
          <button style={{ ...buttonStyles, color: "red" }} onClick={closeMenu}>
            Cancel
          </button>
          <button
            style={{
              ...buttonStyles,
              color: updated === text ? "grey" : "green",
            }}
            disabled={updated === text}
            onClick={() => onSave(path, updated)}
          >
            Save
          </button>
        </div>
      </div>
    </dialog>
  );
};
