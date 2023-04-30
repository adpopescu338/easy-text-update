import styled from "styled-components";

export const Button = styled.button<{ color: "green" | "red" }>`
  font-size: 15px;
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  background-color: white;
  box-shadow: 0 0 3px black;
  margin: 0 5px;
  color: ${(props) => (props.disabled ? "grey" : props.color)};
  transition: box-shadow 0.2s ease-in-out;
  :hover {
    box-shadow: ${(props) =>
      props.disabled ? "0 0 3px black" : "0 0 5px black"};
  }
`;
