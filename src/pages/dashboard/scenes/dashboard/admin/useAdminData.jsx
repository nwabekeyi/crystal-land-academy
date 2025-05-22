import { useDispatch, useSelector } from 'react-redux';
import useWebSocket from '../../../../../hooks/useWebSocket';
import useApi from '../../../../../hooks/useApi';
import { setUsersData, setAllCourses } from '../../../../../reduxStore/slices/adminDataSlice';
import { useEffect, useMemo, useState } from 'react';
import { setFetchedUsers } from '../../../../../reduxStore/slices/apiCallCheck';
import { endpoints } from '../../../../../utils/constants';
import { useEnquiries } from '../../enquiries/useEnquiries';

const useAdminData = () => {
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [programStats, setProgramStats] = useState({});
  const [outstandingPayments, setOutstandingPayments] = useState({});
  const [mockCohorts, setMockCohorts] = useState([
    { name: 'Cohort 1', courseName: 'Backend Web Development', numStudents: 30, progress: 85 },
    { name: 'Cohort 2', courseName: 'Frontend Web Development', numStudents: 25, progress: 70 },
    { name: 'Cohort 3', courseName: 'Data Science', numStudents: 40, progress: 50 },
    { name: 'Cohort 4', courseName: 'Machine Learning', numStudents: 35, progress: 60 },
    { name: 'Cohort 5', courseName: 'AI and Robotics', numStudents: 45, progress: 90 },
  ]);
  const [unreadEnquiries, setUnreadEnquiries] = useState([0]);

  const {fetchEnquiries} = useEnquiries();
  const fetchedUsers = useSelector((state) => state.apiCallCheck.fetchedUsers);
  const dispatch = useDispatch();

  // Get the useApi hook results
  const { loading, data, error, callApi } = useApi();
  const { loading: userLoading, data: usersData, error: usersError, callApi: getUsers } = useApi();

  // Fetch the courses when component mounts
  useEffect(() => {
    callApi(endpoints.COURSES, 'GET');
  }, [callApi]);

  // Fetch enquiries count
  useEffect(async() => {
    const count = await fetchEnquiries();
    if(count){
      setUnreadEnquiries(count);
    }
  }, []);


  // Handle course data
  useEffect(() => {
    if (!loading && data) {
      console.log('Courses Data received:', data);
      dispatch(setAllCourses(data.courses));  // Assuming data contains a 'courses' array
    }
  }, [loading, data, dispatch]);

  // Check for fetchedUsers and trigger API call if not fetched
  useEffect(() => {
    console.log('Fetching users from API...');
    getUsers(endpoints.GET_USERS, 'GET'); // Trigger the API call
  }, [getUsers]);

  // Handle users data after API call resolves
  useEffect(() => {
    if (usersData) {
      console.log('Users Data received:', usersData);
      setStudents(usersData.students || []);
      setInstructors(usersData.instructors || []);
      dispatch(setUsersData(usersData));
      dispatch(setFetchedUsers());
    }
  }, [usersData, dispatch]);

  // Aggregate data for each program
  useEffect(() => {
    if (students.length > 0) {
      const programAggregation = students.reduce((acc, student) => {
        const { program, amountPaid } = student;
        if (!acc[program]) {
          acc[program] = { totalAmount: 0, studentCount: 0 };
        }
        acc[program].totalAmount += amountPaid || 0;
        acc[program].studentCount += 1;
        return acc;
      }, {});
      
      setProgramStats(programAggregation);
      console.log('Program Stats:', programAggregation);
    }
  }, [students]);

  // Define the action to trigger WebSocket server to fetch users
  const actionToSend = { action: 'watch users' };

  // Use the centralized useWebSocket hook, passing both URL and actionToSend
  // useWebSocket(actionToSend);

  // Calculate total revenue using the reduce method
  const totalRevenue = useMemo(() => {
    return students.reduce((total, student) => total + (student.amountPaid || 0), 0);
  }, [students]);

  console.log('Total Revenue:', totalRevenue);

  // Get the top 5 instructors sorted by rating
  const topInstructors = useMemo(() => {
    if (!instructors || instructors.length === 0) return [];

    // Filter instructors to ensure they have a valid rating (a non-null, non-undefined rating)
    const instructorsWithValidRatings = instructors.filter(instructor => instructor.rating != null);

    // If no instructors have valid ratings, return an empty array or handle as needed
    if (instructorsWithValidRatings.length === 0) return [];

    // Create a shallow copy of the filtered instructors array before sorting
    const instructorsCopy = [...instructorsWithValidRatings];

    // Sort by rating in descending order
    return instructorsCopy
      .sort((a, b) => b.rating - a.rating) // Sort instructors by rating
      .slice(0, 5) // Select the top 5
      .map((instructor) => ({
        profilePictureUrl: instructor.profilePictureUrl,
        firstName: instructor.firstName,
        lastName: instructor.lastName,
        rating: instructor.rating,
        program: instructor.program,
      }));
  }, [instructors]);

  // Log the top instructors for debugging
  console.log("Top Instructors:", topInstructors);

  // Calculate outstanding payments and their percentage for each course
  useEffect(() => {
    // Check if 'data.courses' is an array and 'students' array is populated
    if (Array.isArray(data?.courses) && students.length > 0) {
      let totalOutstanding = 0;

      // Iterate over the courses inside data.courses
      const courseOutstandingDetails = data.courses.map((course) => {
        // Filter students based on course's program (assuming 'courseName' matches student's 'program')
        const courseStudents = students.filter((student) => student.program === course.courseName);

        // Calculate the total amount paid for this course
        const totalAmountPaidForCourse = courseStudents.reduce((sum, student) => sum + student.amountPaid, 0);

        // Calculate the outstanding amount for this course
        const outstandingAmount = course.cost - totalAmountPaidForCourse;

        // Accumulate the total outstanding amount
        totalOutstanding += outstandingAmount;

        return {
          courseName: course.courseName,
          outstandingAmount,
          totalAmountPaid: totalAmountPaidForCourse,
          courseCost: course.cost,
        };
      });

      // Calculate the percentage of total outstanding for each course
      const courseOutstandingWithPercentage = courseOutstandingDetails.map((courseDetail) => ({
        ...courseDetail,
        outstandingPercentage: ((courseDetail.outstandingAmount / totalOutstanding) * 100).toFixed(2),
      }));

      // Update the state with outstanding payments
      setOutstandingPayments({ totalOutstanding, courseOutstandingWithPercentage });

      // Log the outstanding payments for debugging
      console.log('Outstanding Payments:', { totalOutstanding, courseOutstandingWithPercentage });
    }
  }, [data, students]);

  return {
    data,
    loading,
    error,
    usersData,
    totalRevenue,
    programStats,
    topInstructors,
    outstandingPayments,
    mockCohorts,
    unreadEnquiries
  };
};

export default useAdminData;
