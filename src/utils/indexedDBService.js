
// Function to get messages from IndexedDB
export const getMessagesFromIndexedDB = async (dbName, storeName, chatroomName) => {
  let messages = [];
  let error = null;

  try {
    // Call openIndexedDB to open the database before retrieving messages
    const db = await openIndexedDB(dbName);
    
    // Access the object store with a read-only transaction
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    
    // Get all conversations from the store
    const request = store.getAll();

    // Await the request to complete before accessing the result
    const conversation = await new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);  // Request completed, return the result
      };
      request.onerror = () => {
        reject(request.error);  // If an error occurs, reject the promise
      };
    });

    console.log('Conversation from IndexedDB:', conversation);  // Log the conversation

    // conversation is now the array containing chatroomName and messages
    if (conversation) {
      // Loop over the result array to find the matching chatroom
      for (const conv of conversation) {
        if (conv.chatroomName === chatroomName) {
          messages = conv.messages || [];  // If the chatroom is found, return its messages
          break;  // No need to continue once we find the matching chatroom
        }
      }
    } else {
      console.log('No conversations found in the result.');
    }

  } catch (err) {
    console.error('Failed to retrieve messages from IndexedDB:', err);
    error = err.message || 'Failed to retrieve messages';
  }

  return messages;
};

// Function to open the IndexedDB (unchanged from before)
const openIndexedDB = (dbName) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 2); // Version 2 for possible upgrade

    request.onerror = (event) => {
      console.error('Error opening IndexedDB:', event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      console.log(`IndexedDB opened successfully for database: ${dbName}`);
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create 'ChatroomMessages' object store if it doesn't exist
      if (!db.objectStoreNames.contains('ChatroomMessages')) {
        db.createObjectStore('ChatroomMessages', { keyPath: 'chatroomName' });
        console.log('Object store "ChatroomMessages" created.');
      }

      // Create 'PrivateMessages' object store if it doesn't exist
      if (!db.objectStoreNames.contains('PrivateMessages')) {
        db.createObjectStore('PrivateMessages', { keyPath: 'messageId', autoIncrement: true });
        console.log('Object store "PrivateMessages" created.');
      }
    };
  });
};



// Function to save a message into IndexedDB
const saveMessage = async (chatroomName, message) => {
  const dbName = 'Messages'; // Database name
  const storeName = 'ChatroomMessages';
  console.log(`Attempting to save messages for chatroom ${chatroomName} in store ${storeName}: ${JSON.stringify(message)}`);

  // Open the IndexedDB database
  const db = await openIndexedDB(dbName);
  const transaction = db.transaction([storeName], 'readwrite');
  const store = transaction.objectStore(storeName);

  if (!chatroomName) {
    throw new Error("chatroomName is required to retrieve data from IndexedDB");
  }

  // Retrieve the existing conversation (if any)
  const request = store.get(chatroomName);  // Use chatroomName as the key

  request.onsuccess = async () => {
    let conversation = request.result;

    if (!conversation) {
      console.log(`Conversation ${chatroomName} does not exist. Creating new conversation.`);
      conversation = {
        chatroomName,  
        messages: []
      };

      if (Array.isArray(message)) {
        message.forEach(msg => {
          if (msg && msg._id) {
            conversation.messages.push(msg);
          } else {
            console.warn("Message missing _id, skipping:", msg);
          }
        });
      } else {
        if (message && message._id) {
          conversation.messages.push(message);
        } else {
          console.warn("Message missing _id, skipping:", message);
        }
      }

      const putRequest = store.put(conversation);
      putRequest.onsuccess = () => {
        console.log(`New conversation created and messages added to ${chatroomName}`);
      };
      putRequest.onerror = (event) => {
        console.error('Error creating new conversation:', event.target.error);
      };
    } else {
      console.log(`Conversation ${chatroomName} exists. Checking for duplicate messages.`);

      const existingMessageIds = conversation.messages.map(msg => msg._id);

      if (Array.isArray(message)) {
        message.forEach(msg => {
          if (msg && msg._id && !existingMessageIds.includes(msg._id)) {
            conversation.messages.push(msg);
          } else if (msg && msg._id) {
            console.warn("Duplicate message found, skipping:", msg);
          } else {
            console.warn("Message missing _id, skipping:", msg);
          }
        });
      } else {
        // Single message case
        if (message && message._id && !existingMessageIds.includes(message._id)) {
          conversation.messages.push(message);
        } else if (message && message._id) {
          console.warn("Duplicate message found, skipping:", message);
        } else {
          console.warn("Message missing _id, skipping:", message);
        }
      }

      const putRequest = store.put(conversation);
      putRequest.onsuccess = () => {
        console.log(`Messages added to existing conversation: ${chatroomName}`);
      };
      putRequest.onerror = (event) => {
        console.error('Error updating conversation:', event.target.error);
      };
    }
  };

  request.onerror = (event) => {
    console.error('Error retrieving conversation from store:', event.target.error);
  };

  transaction.oncomplete = () => {
    console.log('Transaction complete for saving messages.');
  };

  transaction.onerror = (event) => {
    console.error('Transaction failed while saving messages:', event.target.error);
  };
};



// Check if the IndexedDB is full (for example, if there are 100 conversations)
// Function to check if IndexedDB is full based on storage usage percentage
const isDBFull = async () => {
  const dbName = 'Messages'; // Set dbName statically here
  console.log(`Checking if the ${dbName} database is full...`);

  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      // Estimate storage usage and available space
      const estimate = await navigator.storage.estimate();

      const usedBytes = estimate.usage || 0;  // Bytes used
      const totalBytes = estimate.quota || 1; // Total available storage (to avoid division by 0)

      const percentUsed = (usedBytes / totalBytes) * 100;
      console.log(`Used: ${usedBytes} bytes`);
      console.log(`Total: ${totalBytes} bytes`);
      console.log(`You've used ${percentUsed.toFixed(2)}% of available storage.`);

      // Check if the usage exceeds 95% of the available storage
      if (percentUsed > 95) {
        console.warn('IndexedDB is full or almost full (over 95% of storage used).');
        return true; // Database is considered full
      } else {
        return false; // Database is not full
      }
    } catch (error) {
      console.error('Error estimating storage usage:', error);
      return false; // Assume not full if estimate fails
    }
  } else {
    console.warn('Storage estimation API not supported in this browser.');
    return false; // Cannot determine if the database is full
  }
};


// Remove the oldest message from IndexedDB if needed
const removeOldestMessage = async () => {
  const dbName = 'Messages';
  console.log(`Removing oldest message from ${dbName} database...`);
  const db = await openIndexedDB(dbName);
  const transaction = db.transaction(['ChatroomMessages', 'PrivateMessages'], 'readwrite');
  const store = transaction.objectStore('ChatroomMessages');
  const allConversations = await store.getAll();

  if (allConversations.length > 0) {
    const oldestConversation = allConversations[0];
    console.log(`Oldest conversation found: ${JSON.stringify(oldestConversation)}. Deleting it...`);
    store.delete(oldestConversation.chatroomName);
  } else {
    console.log('No conversations to delete.');
  }

  transaction.oncomplete = () => {
    console.log('Transaction complete for removing the oldest message.');
  };

  transaction.onerror = (event) => {
    console.error('Transaction failed while removing the oldest message:', event.target.error);
  };
};

//update deliveredto 
// Function to add recipient details to a message's deliveredTo array
const updateDeliveredToIndexedDB = async (chatroomName, messageId, recipientDetails) => {
  const dbName = 'Messages'; // Database name
  const storeName = 'ChatroomMessages';

  try {
    // Open the IndexedDB database
    const db = await openIndexedDB(dbName);
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    // Retrieve the conversation by chatroomName
    const request = store.get(chatroomName);

    request.onsuccess = () => {
      const conversation = request.result;

      if (!conversation || !conversation.messages) {
        console.error(`Chatroom ${chatroomName} not found or has no messages.`);
        return;
      }

      // Find the message by messageId
      const message = conversation.messages.find(msg => msg._id === messageId);

      if (!message) {
        console.error(`Message with ID ${messageId} not found in chatroom ${chatroomName}.`);
        return;
      }

      // Add recipientDetails to the deliveredTo array if it doesn't already exist
      if (!message.deliveredTo) {
        message.deliveredTo = [];
      }

      const isRecipientAdded = message.deliveredTo.some(recipient => recipient.id === recipientDetails.id);
      if (!isRecipientAdded) {
        message.deliveredTo.push(recipientDetails);
        console.log(`Recipient details added to message ${messageId} in chatroom ${chatroomName}.`);

        // Update the conversation with the modified message
        const putRequest = store.put(conversation);
        putRequest.onsuccess = () => {
          console.log('Message deliveredTo array updated successfully.');
        };
        putRequest.onerror = (event) => {
          console.error('Error updating deliveredTo array:', event.target.error);
        };
      } else {
        console.log('Recipient already exists in the deliveredTo array.');
      }
    };

    request.onerror = (event) => {
      console.error('Error retrieving conversation from store:', event.target.error);
    };

    transaction.oncomplete = () => {
      console.log('Transaction complete for updating deliveredTo.');
    };

    transaction.onerror = (event) => {
      console.error('Transaction failed while updating deliveredTo:', event.target.error);
    };
  } catch (error) {
    console.error('Failed to update deliveredTo array:', error);
  }
};


// Function to update the readBy array for a specific message in IndexedDB
const updateChatroomReadby = async (chatroomName, messageId, readBy) => {
  const dbName = 'Messages'; // Database name
  const storeName = 'ChatroomMessages';

  try {
    // Open the IndexedDB database
    const db = await openIndexedDB(dbName);
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    // Retrieve the chatroom by chatroomName
    const request = store.get(chatroomName);

    request.onsuccess = () => {
      const chatroom = request.result;

      if (!chatroom || !chatroom.messages) {
        console.error(`Chatroom ${chatroomName} not found or has no messages.`);
        return;
      }

      // Find the message by messageId and senderId
      const message = chatroom.messages.find(msg => msg._id === messageId);

      if (!message) {
        console.error(`Message with ID ${messageId} and senderId ${senderId} not found in chatroom ${chatroomName}.`);
        return;
      }

      // Check if readBy is already in the array
      if (!message.readBy.includes(readBy)) {
        // Add readBy to the message's readBy array
        message.readBy.push(readBy);

        // Update the chatroom with the modified message
        const updateRequest = store.put(chatroom);
        updateRequest.onsuccess = () => {
          console.log(`Message readBy updated successfully in chatroom ${chatroomName}`);
        };
        updateRequest.onerror = (event) => {
          console.error('Error updating readBy array:', event.target.error);
        };
      } else {
        console.log('User already exists in the readBy array.');
      }
    };

    request.onerror = (event) => {
      console.error('Error retrieving chatroom from store:', event.target.error);
    };

    transaction.oncomplete = () => {
      console.log('Transaction complete for updating readBy array.');
    };

    transaction.onerror = (event) => {
      console.error('Transaction failed while updating readBy array:', event.target.error);
    };
  } catch (error) {
    console.error('Failed to update readBy in IndexedDB:', error);
  }
};

// Function to update the deliveredTo array in a message
const updateChatroomDeliveredTo = async (chatroomName, messageId, recipientDetails) => {
  const dbName = 'Messages'; // Database name
  const storeName = 'ChatroomMessages';

  try {
    // Open the IndexedDB database
    const db = await openIndexedDB(dbName);
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    // Retrieve the conversation by chatroomName
    const request = store.get(chatroomName);

    request.onsuccess = () => {
      const conversation = request.result;

      if (!conversation || !conversation.messages) {
        console.error(`Chatroom ${chatroomName} not found or has no messages.`);
        return;
      }

      // Find the message by messageId
      const message = conversation.messages.find(msg => msg._id === messageId);

      if (!message) {
        console.error(`Message with ID ${messageId} not found in chatroom ${chatroomName}.`);
        return;
      }

      // Add recipientDetails to the deliveredTo array if it doesn't already exist
      const isRecipientAlreadyAdded = message.deliveredTo.some(recipient => recipient.id === recipientDetails.id);

      if (!isRecipientAlreadyAdded) {
        message.deliveredTo.push(recipientDetails);

        // Update the conversation back in the store
        const putRequest = store.put(conversation);
        putRequest.onsuccess = () => {
          console.log(`Recipient details added to message ID ${messageId} in chatroom ${chatroomName}.`);
        };
        putRequest.onerror = (event) => {
          console.error('Error updating conversation:', event.target.error);
        };
      } else {
        console.log(`Recipient with ID ${recipientDetails.id} is already in the deliveredTo array for message ID ${messageId}.`);
      }
    };

    request.onerror = (event) => {
      console.error('Error retrieving conversation from store:', event.target.error);
    };

    transaction.oncomplete = () => {
      console.log('Transaction complete for updating deliveredTo array.');
    };

    transaction.onerror = (event) => {
      console.error('Transaction failed while updating deliveredTo array:', event.target.error);
    };
  } catch (err) {
    console.error('Failed to update deliveredTo array in IndexedDB:', err);
  }
};



// Function to delete all stores from IndexedDB
const deleteAllStores = async (dbName) => {
  try {
    const db = await openIndexedDB(dbName);

    // Open a transaction for deleting object stores
    const transaction = db.transaction([], 'readwrite');
    const objectStoreNames = Array.from(db.objectStoreNames);

    // Delete each object store
    objectStoreNames.forEach((storeName) => {
      db.deleteObjectStore(storeName);
      console.log(`Object store "${storeName}" deleted.`);
    });

    transaction.oncomplete = () => {
      console.log('All object stores deleted successfully.');
    };

    transaction.onerror = (event) => {
      console.error('Transaction failed while deleting object stores:', event.target.error);
    };

  } catch (err) {
    console.error('Failed to delete object stores:', err);
  }
};


export {
  saveMessage,
  isDBFull,
  removeOldestMessage,
  openIndexedDB,
  updateDeliveredToIndexedDB,
  updateChatroomReadby,
  updateChatroomDeliveredTo,
  deleteAllStores
};
