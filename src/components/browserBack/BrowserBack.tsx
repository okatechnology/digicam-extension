import React from 'react';
import styled from 'styled-components';

export const BrowserBack = () => {
  return (
    <Wrapper>
      <BackButton href="#">←</BackButton>
      <BackButton href="#">→</BackButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  position: fixed;
  left: 180px;
  top: 5px;
`;

export const BackButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background-color: #fff;
  text-decoration: none;
  border-radius: 999px;
  border: 1px solid #000;
  font-weight: bold;
  font-size: 30px;

  & + & {
    margin-left: 10px;
  }
`;
