import { useSubscription, gql } from '@apollo/client';

export const MESSAGE_ADDED_SUBSCRIPTION = gql`
subscription messageAdded($chatroomName: String!) {
  messageAdded(chatroomName: $chatroomName) {
    _id
    chatroomName
    message
    sender {
      id
      name
    }
    timestamp
    status
  }
}


`;