import React from "react";

type InputProps = {
  text: string;
  onChange: (event: any) => void;
};

const inputStyles = {
  padding: 9,
  fontSize: 16,
  borderRadius: 3,

};

const Input = ({ text, onChange }: InputProps) => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!ref.current) return;
    ref.current.selectionStart = text.length;
    ref.current.selectionEnd = text.length;
  }, []);

  const baseProps = {
    ref,
    style: inputStyles,
    onChange,
    defaultValue: text,
    autoFocus: true,
  };

  if (typeof text === "number") return <input {...baseProps} type="number" />;

  return <textarea {...baseProps} />;
};

export default Input;
