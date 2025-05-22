import { useState, useMemo } from 'react';

const useSessionStorage = () => {
  const [userDetails, setUserDetails] = useState(() => {
    const userKey = 'btech_user';
    const storedUserDetails = sessionStorage.getItem(userKey);
    return storedUserDetails ? JSON.parse(storedUserDetails) : null;
  });

  const [allUserDetails, setAllUserDetails] = useState(() => {
    const userKey = 'btech_users';
    const storedUserDetails = sessionStorage.getItem(userKey);
    return storedUserDetails ? JSON.parse(storedUserDetails) : null;
  });

  const [timeTable, setTimeTable] = useState(() => {
    const userKey = 'btech_timetables';
    const storedUserDetails = sessionStorage.getItem(userKey);
    return storedUserDetails ? JSON.parse(storedUserDetails) : null;
  });

  // Fetch functions
  const fetchUserDetails = () => {
    const userKey = 'btech_user';
    const storedUserDetails = sessionStorage.getItem(userKey);
    if (storedUserDetails) {
      setUserDetails(JSON.parse(storedUserDetails));
    }
  };

  const fetchAllUserDetails = () => {
    const userKey = 'btech_users';
    const storedUserDetails = sessionStorage.getItem(userKey);
    if (storedUserDetails) {
      setAllUserDetails(JSON.parse(storedUserDetails));
    }
  };

  const fetchTimeTable = () => {
    const userKey = 'btech_timetables';
    const storedUserDetails = sessionStorage.getItem(userKey);
    if (storedUserDetails) {
      setTimeTable(JSON.parse(storedUserDetails));
    }
  };

  // Call fetch functions if state is null
  if (!userDetails) fetchUserDetails();
  if (!allUserDetails) fetchAllUserDetails();
  if (!timeTable) fetchTimeTable();

  // Memoizing the user details, all user details, and timetable
  const memoizedUserDetails = useMemo(() => userDetails, [userDetails]);
  const memoizedAllUserDetails = useMemo(() => allUserDetails, [allUserDetails]);
  const memoizedTimeTable = useMemo(() => timeTable, [timeTable]);

  // Return the memoized data
  return { memoizedUserDetails, memoizedAllUserDetails, memoizedTimeTable };
};

export default useSessionStorage;
