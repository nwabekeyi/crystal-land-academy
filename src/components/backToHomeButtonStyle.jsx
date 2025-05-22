import { Link } from "react-router-dom";
import styled from 'styled-components'


export const ContainerBack = styled.div`
  position: absolute;
  top: 20px; /* Adjust top position as needed */
  left: 20px; /* Adjust left position as needed */
  z-index: 1000; /* Ensure it's above other content */
`;

export const BackToHomeButton = styled(Link)`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: #333; /* Change color as needed */
`;

