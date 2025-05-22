import { gql } from "@apollo/client";

// Define the GET_CHATROOM query
export const GET_CHATROOM = gql`
  query GetChatroom($name: String!) {
    getChatroom(name: $name) {
      id
      name
      avatarUrl
      participants {
        userId
        firstName
        lastName
        profilePictureUrl
      }
      createdAt
      updatedAt
    }
  }
`;

// Define the GET_CHATROOMS query
export const GET_CHATROOMS = gql`
  query GetChatrooms {
    getChatrooms {
      id
      name
      avatarUrl
      participants {
        userId
        firstName
        lastName
        profilePictureUrl
      }
      createdAt
      updatedAt
    }
  }
`;

// Corrected GET_CHATROOM_MESSAGES query
export const GET_CHATROOM_MESSAGES = gql`
  query GetChatroomMessages($chatroomName: String!) {
    getMessagesByChatroom(chatroomName: $chatroomName) {
      _id
      chatroomName
      messages {
        _id
        sender {
          id
          name
          profilePictureUrl
          role
        }
        message
        timestamp
        messageType
        status
        deliveredTo {
          _id
          firstName
          lastName
          profilePictureUrl
          timestamp
        }
        readBy {
          _id
          firstName
          lastName
          profilePictureUrl
          timestamp
        }
        replyTo {
          id
          message
        }
      }
    }
  }
`;



// Query to get personal messages between two users, including sender details
export const GET_PERSONAL_MESSAGES = gql`
  query getPersonalMessages($userId: String!, $senderId: String!) {
    getPersonalMessages(userId: $userId, senderId: $senderId) {
      senderId
      lastName
      profilePictureUrl
      messages {
        message
        timestamp
        messageType
        status
        replyingTo {
          _id
          message
        }
      }
    }
  }
`;


// Mutation to initiate sender details
export const INITIATE_SENDER_DETAILS = gql`
  mutation initiateSenderDetails(
    $userId: String!
    $firstName: String!
    $lastName: String!
    $profilePictureUrl: String
  ) {
    initiateSenderDetails(
      userId: $userId
      firstName: $firstName
      lastName: $lastName
      profilePictureUrl: $profilePictureUrl
    ) {
      userId
      senders {
        sender {
          userId
          firstName
          lastName
          profilePictureUrl
        }
        messages {
          message
          timestamp
          messageType
          status
        }
      }
    }
  }
`;


// Mutation to send a message to a sender
export const SEND_MESSAGE_TO_SENDER = gql`
  mutation sendMessageToSender(
    $userId: String!
    $senderId: String!
    $message: String!
    $messageType: String
    $status: String
    $replyingTo: MessageReplyInput
  ) {
    sendMessageToSender(
      userId: $userId
      senderId: $senderId
      message: $message
      messageType: $messageType
      status: $status
      replyingTo: $replyingTo
    ) {
      userId
      senders {
        sender {
          userId
          firstName
          lastName
          profilePictureUrl
        }
        messages {
          message
          timestamp
          messageType
          status
          replyingTo {
            _id
            message
          }
        }
      }
    }
  }
`;



