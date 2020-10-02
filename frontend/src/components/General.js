import styled from "styled-components";

const Card = styled.div`
  width: ${(props) => (props.width ? props.width : "50%")};
  margin: auto auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => (props.color ? props.color : "none")};
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Logo = styled.img`
  width: 30%;
  margin-bottom: 1rem;
`;

const Error = styled.div`
  color: red;
`;

export { Form, Logo, Card, Error };
