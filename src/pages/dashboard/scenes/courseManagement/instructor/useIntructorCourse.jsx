import { useState, useEffect } from 'react';
import useApi from '../../../../../hooks/useApi';
import { endpoints } from '../../../../../utils/constants';
import { useSelector } from 'react-redux';

const useInstructorCourse = () => {
  const [courseName, setCourseName] = useState('');
  const [courseDuration, setCourseDuration] = useState('');
  const [curriculum, setCurriculum] = useState([]);
  const user = useSelector((state) => state.users.user);

  const { loading, data, error, callApi } = useApi(); // Fetch the loading state from useApi hook

  useEffect(() => {
    callApi(endpoints.COURSES, 'GET');
  }, []); // Ensure the API is called only once on component mount

  useEffect(() => {
    if (data && data.courses) { // Ensure data and data.courses are valid
      const instructorCourse = data.courses.find(course => course.courseName === user.program);
      if (instructorCourse) {
        setCourseName(instructorCourse.courseName);
        setCourseDuration(instructorCourse.duration);
        setCurriculum(instructorCourse.curriculum || []); // Ensure curriculum is an array
      }
    }
  }, [data]); // Dependency on `data` ensures this runs after the data is fetched

  return {
    courseName,
    courseDuration,
    curriculum,
    loading // Return loading state
  };
};

export default useInstructorCourse;
