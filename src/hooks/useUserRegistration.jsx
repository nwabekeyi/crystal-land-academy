import { useEffect, useState, useCallback } from 'react';
import { doc, getDoc, getDocs, onSnapshot, collection, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import useSessionStoarge from './useSessionStorage';

// Function to generate a unique ID
const generateUniqueId = () => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomPart}`;
};

const useUserRegistration = () => {
  const [userNotifications, setUserNotifications] = useState([]);
 
  const userId = useSessionStoarge().memoizedUserDetails;
  console.log(userId);

  // Function to fetch notifications for the logged-in user
  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      console.error('User ID not found or is null.');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const notifications = userData.notifications || [];
        setUserNotifications(notifications);
        console.log(notifications)
      } else {
        console.log('User document does not exist.');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, []);

  // Listen for new user registrations and notify admin/superadmin
  useEffect(() => {
    const unsubscribeFromCollection = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          // Only handle 'added' type changes (new users)
          if (change.type === 'added') {
            const newUser = change.doc.data();

            // Skip notification if the user was already notified (add a flag to user)
            if (newUser.notificationSent) return;

            const newNotificationMessage = `New user registered: ${newUser.firstName} ${newUser.lastName}, Role: ${newUser.role}, Program: ${newUser.program || 'N/A'}`;

            // Create a new notification object with a unique ID and timestamp
            const newNotification = {
              id: generateUniqueId(),
              message: newNotificationMessage,
              userId: newUser.id || '',
              createdAt: new Date().toISOString(),
              read: false,
            };

            // Query admins and superadmins
            const adminQuery = query(collection(db, 'users'), where('role', 'in', ['admin', 'superadmin']));
            const adminSnapshot = await getDocs(adminQuery);

            // Update each admin/superadmin with the new notification
            adminSnapshot.forEach(async (adminDoc) => {
              const adminData = adminDoc.data();
              const adminNotifications = adminData.notifications || [];

              // Avoid posting duplicate notifications
              const alreadyNotified = adminNotifications.some(notification => notification.userId === newUser.id);
              if (!alreadyNotified) {
                adminNotifications.push(newNotification);

                // Get the document reference for the admin/superadmin user
                const adminDocRef = doc(db, 'users', adminDoc.id);

                // Update admin/superadmin document with the new notification
                await updateDoc(adminDocRef, { notifications: adminNotifications });
              }
            });

            // Mark the new user as having sent a notification
            const newUserDocRef = doc(db, 'users', change.doc.id);
            await updateDoc(newUserDocRef, { notificationSent: true });
          }
        });
      }
    );

    // Fetch notifications for the current user
    fetchNotifications();

    return () => unsubscribeFromCollection();
  }, [fetchNotifications]);

  console.log(userNotifications);

  return { userNotifications }; // Return the notifications

};

export default useUserRegistration;
