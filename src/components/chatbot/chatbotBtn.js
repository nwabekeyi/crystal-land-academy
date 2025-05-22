import styled from 'styled-components';

const ChatbotBtn = styled.button`
  padding: 10px 20px;
  font-size:12px;
  border: none;
  border-radius: 5px;
  background-color: #0D6EFD;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: auto;
  width: 80%;
  font-weight: bold;
  margin-bottom: 5px;

  &:hover {
    background-color: white;;
    border: blue solid 1px;
    color: blue;
  }
`;

export default ChatbotBtn