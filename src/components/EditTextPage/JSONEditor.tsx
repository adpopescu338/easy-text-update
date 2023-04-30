import React from "react";
import styled from "styled-components";
import { TextObject } from "../../types";

const colors = {
  bg: "#f5f5f5",
  hover: "#e3e1e1",
};

const Details = styled.details`
  margin-left: 5px;
  background-color: ${colors.bg};
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 20px;
`;

const EditText = styled.div`
  margin-left: 5px;
  background-color: ${colors.bg};
  position: relative;
  padding: 3px;
  border-radius: 3px;
  font-size: 16px;
  transition: background-color 0.2s ease-in-out;
  :hover {
    background-color: ${colors.hover};
    ::after {
      content: "✎";
      position: absolute;
      font-size: 22px;
      left: calc(50% - 11px);
      top: calc(50% - 13px);
    }
  }
`;

type Props = {
  node: TextObject;
  path?: string;
  openMenu: (path: string, text: string) => void;
};

export const JSONEditor = ({ node, path, openMenu }: Props): any => {
  if (typeof node === "string") {
    return <EditText onClick={() => openMenu(path, node)}>{node}</EditText>;
  }

  if (!Array.isArray(node) && typeof node === "object") {
    return Object.entries(node).map(([key, value]) => {
      return (
        <Details key={key}>
          <summary>{key}</summary>
          <JSONEditor
            node={value as TextObject}
            path={path ? `${path}.${key}` : key}
            openMenu={openMenu}
          />
        </Details>
      );
    });
  }

  return null;
};
