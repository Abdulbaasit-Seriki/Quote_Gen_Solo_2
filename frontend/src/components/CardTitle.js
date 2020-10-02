import React from "react";
import styled from "styled-components";

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width:${props => props.width};
  margin: auto;
  margin-top: auto;
  min-height: 200px;
  margin-top: 20px;
  background-color: #fff;
  padding-top: 20px;
  border-radius: 7px;
  max-width: 750px;
`;

const Title = styled.div`
  font-weight: bold;
`;
const Body = styled.div`
padding: 20px;
margin: auto;
display: flex;
flex-direction: column;
align-items: center;
`;
const CardTitle = ({ title = "", body = "body" , width="80%" , style ={} }) => {
  return (
    <Card width={width} style={{...style}}>
      <Title>{title}</Title>
     <Body >{body}</Body> 
    </Card>
  );
};

export default CardTitle;
