import React from "react";

type InputProps = {
  text: string;
  onChange: (event: any) => void;
};

const inputStyles = {
  padding: 9,
  fontSize: 16,
  borderRadius: 3,
  width: "100%",
};

const Input = ({ text, onChange }: InputProps) => {
  if (typeof text === "number")
    return (
      <input
        autoFocus
        style={inputStyles}
        type="number"
        defaultValue={text}
        onChange={onChange}
      />
    );

  return (
    <textarea
      autoFocus
      style={inputStyles}
      onChange={onChange}
      defaultValue={text}
    />
  );
};

export default Input;
