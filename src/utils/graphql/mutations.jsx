import { gql } from '@apollo/client';  // Import gql from Apollo Client

export const SEND_MESSAGE = gql`
  mutation sendMessage(
    $chatroomName: String!
    $sender: SenderInput!
    $message: String!
    $messageType: String!
    $status: String!
    $deliveredTo: [DeliveredReadUserInput!]
    $readBy: [DeliveredReadUserInput!]
    $replyTo: ReplyToMessageInput  # Change to ReplyToMessageInput instead of ID
  ) {
    sendMessage(
      chatroomName: $chatroomName   # Using chatroomName instead of chatroomId
      sender: $sender
      message: $message
      messageType: $messageType
      status: $status
      deliveredTo: $deliveredTo
      readBy: $readBy
      replyTo: $replyTo  # Include replyTo as an object with id and message
    ) {
      _id
      chatroomName   # Returning chatroomName instead of chatroomId
      message
      sender {
        id
        name
        profilePictureUrl
        role
      }
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
        id  # Return the ID of the message being replied to
        message  # Return the content of the replied message
      }
    }
  }
`;

export const MARK_AS_READ = gql`
  mutation markAsRead(
    $messageId: ID!
    $userId: ID!
  ) {
    markAsRead(
      messageId: $messageId
      userId: $userId
    ) {
      _id
      chatroomName
      message
      sender {
        id
        name
        profilePictureUrl
        role
      }
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
`;

export const MARK_AS_DELIVERED = gql`
  mutation markAsDelivered(
    $messageId: ID!
    $userId: ID!
  ) {
    markAsDelivered(
      messageId: $messageId
      userId: $userId
    ) {
      _id
      chatroomName
      message
      sender {
        id
        name
        profilePictureUrl
        role
      }
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
`;
