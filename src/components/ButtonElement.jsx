import styled from 'styled-components'
import { Link } from 'react-scroll'
import { Link as LinkN } from 'react-router-dom';

export const Button = styled(Link)`
  border-radius: ${({ otp }) => (otp ? "none" : "50px")};
  background: ${({ primary }) => (primary ? "rgb(87,65,217)" : "#010606")};
  white-space: nowrap;
  padding: ${({ big }) => (big ? "14px 48px" : "12px 30px")};
  color: ${({ dark }) => (dark ? "#fff" : "#fff")};
  font-size: ${({ fontBig }) => (fontBig ? "20px" : "16px")};
  outline: none;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease-in-out;
  font-weight: bold;
  width: ${({ otp }) => (otp ? "100%" : "initial")};
  &:hover {
    transition: all 0.2s ease-in-out;
    background: ${({ primary }) => (primary ? "#fff" : "#fff")};
    color: ${({ primary }) => (primary ? "black" : "black")};
  }
`;
export const ButtonNavigate = styled(LinkN)`
    border-radius: 50px;
    background: ${({ primary }) => (primary ? 'rgb(87,65,217)' : '#010606')};
    white-space: nowrap;
    padding: ${({ big }) => (big ? '14px 48px' : '12px 30px')};
    color: ${({ dark }) => (dark ? '#fff' : '#fff')};
    font-size: ${({ fontBig }) => (fontBig ? '20px' : '16px')};
    outline: none;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s ease-in-out;
    font-weight: bold;

    &:hover {
        transition: all 0.2s ease-in-out;
        background: ${({ primary }) => (primary ? '#fff' : '#fff')};
        color: ${({ primary }) => (primary ? 'black' : 'black')};
    }
`