import { useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { endpoints } from '../../../../../utils/constants';
import useApi from "../../../../../hooks/useApi";
import { setAssignments, setTimetable } from '../../../../../reduxStore/slices/studentdataSlice';
const useInstructorData = () => {
  const [courses, setCourses] = useState([]);
  const [nextClass, setNextClass] = useState(null);
  const [topStudents, setTopStudents] = useState([]);
  const [leastStudents, setLeastStudents] = useState([]);
  const [cohort, setCohort] = useState(null);
  const [announcements, setAnnouncements] = useState(null);
  const { data, loading, callApi } = useApi();

  //get announcements
  useEffect(async() => {
    const response = await callApi(endpoints.ANNOUNCEMENT, "GET");
    if(response){
      console.log(response)
      setAnnouncements(response);
    }
  }, []);


  const instructorData = useSelector((state) => state.users.user);
  const dispatch = useDispatch();

  const { data: cohortData, callApi: cohortFetch, loading: cohortLoading } = useApi();
  const { data: courseData, callApi: courseFetch, loading: courseLoading } = useApi();
  const { data: assignmentData, callApi: assignementFetch, loading: assignmentLoading } = useApi();
  const { data: studentData, callApi: studentFetch, loading: studentLoading } = useApi(); // Fetch student details

  // Fetch cohort data when instructorData or courseData changes
  useEffect(async () => {
    if (instructorData && instructorData.cohort && courseData) {
      const instructorCourse = courseData.courses.find(course => instructorData.program === course.courseName);

      if (instructorCourse) {
        const response = await cohortFetch(`${endpoints.COHORT}/${instructorCourse.courseId}/${instructorData.cohort}`, 'GET');
        if(response && response?.cohort){
          setCohort(response);
        }
      }
    }
  }, [instructorData, courseData, cohortFetch]);

  // Fetch assignment data when instructorData or cohortData changes
  useEffect(() => {
    if (instructorData && instructorData.cohort) {
      assignementFetch(`${endpoints.ASSIGNMENT}/${instructorData.cohort}`, 'GET');
    }
  }, [instructorData, assignementFetch]);

  // Dispatch assignments when assignmentData changes
  useEffect(() => {
    if (assignmentData) {
      dispatch(setAssignments(assignmentData));
    }
  }, [assignmentData, dispatch]);

  // Fetch cohort student data
  useEffect(() => {
    if (instructorData && instructorData.cohort) {
      studentFetch(`${endpoints.COHORT}/students/${instructorData.cohort}`, 'GET');
    };
  }, [instructorData, studentFetch]);

  // Fetch courses only once when the component mounts
  useEffect(() => {
    if (!courseData) {
      courseFetch(`${endpoints.COURSES}`, 'GET');
    }
  }, [courseData, courseFetch]);

  // Set courses state when courseData changes
  useEffect(() => {
    if (courseData) {
      setCourses(courseData.courses);
    }
  }, [courseData]);

  // Format date for display
  const formatDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Next class logic
  useEffect(() => {
    if (cohortData && cohortData.cohort && cohortData.cohort.timetable) {
      const currentDateTime = new Date();
      let closestClass = null;

      cohortData.cohort.timetable.forEach(timetable => {
        const timetableDateTime = new Date(`${timetable.date.split('T')[0]}T${timetable.time}`);

        if (timetableDateTime > currentDateTime) {
          if (!closestClass || timetableDateTime < new Date(`${closestClass.date.split('T')[0]}T${closestClass.time}`)) {
            closestClass = timetable;
          }
        }
      });

      if (closestClass) {
        const formattedClass = {
          ...closestClass,
          formattedDate: formatDateToDDMMYYYY(closestClass.date),
        };
        setNextClass(formattedClass);
      }
    }
  }, [cohortData]);

  // Calculate course progress
  const courseProgress = useMemo(() => {

    if (cohort){

      const totalClasses = cohort?.cohort?.timetable.length;
      const completedClasses = cohort.cohort?.timetable.filter(timetable => timetable.done === true).length;
  
      return Math.round((completedClasses / totalClasses) * 100);
    }else{
      return 0
    }

  }, [cohort]);

  // Calculate attendance rate
  const attendanceRate = useMemo(() => {
    if (cohort){
      const totalStudents = cohort.cohort?.students.length;
    const totalAttendance = cohort.cohort?.timetable.reduce((total, classSession) => {
      return total + (classSession.attendance ? classSession.attendance.length : 0);
    }, 0);

    const totalPossibleAttendance = totalStudents * cohort.cohort?.timetable.length;
    return Math.round((totalAttendance / totalPossibleAttendance) * 100);

    }else{
      return 0
    }

    


  }, [cohort]);

  // Calculate assignment submission rate
  const assignmentSubmissionRate = useMemo(() => {

    if (cohort && cohort.cohort?.assignments){
      const totalStudents = cohort.cohort?.students.length;
      const assignmentRate = cohort.cohort.assignments.map(assignment => {
        const submissionsCount = assignment.submissions.length;
        const submissionRate = (submissionsCount / totalStudents) * 100;
        const rate = {
          title: assignment.title,
          submissionRate: Math.round(submissionRate)
        };
        return rate;
      });
       const totalRate = assignmentRate.reduce((sum, assignment) => sum + assignment.submissionRate, 0);
       const totalAssignmentRate = totalRate/assignmentRate.length;



      return {assignmentRate, totalAssignmentRate};
    }else{
      return 0
    }

  }, [cohort]);

  // Finding the top 5 students with highest and lowest activity rate
  useEffect(() => {
    if (studentData && studentData.students) {
      const students = studentData.students;

      // Sort students by activity rate (highest to lowest)
      const sortedStudentsByActivity = students.sort((a, b) => parseFloat(b.activityRate) - parseFloat(a.activityRate));

      // Get the top 5 highest activity students (return all if less than 5)
      const top5Students = sortedStudentsByActivity.length > 5 ? sortedStudentsByActivity.slice(0, 5) : sortedStudentsByActivity;

      // Get the top 5 lowest activity students (return all if less than 5)
      const least5Students = sortedStudentsByActivity.length > 5 ? sortedStudentsByActivity.slice(-5) : sortedStudentsByActivity;

      setTopStudents(top5Students);
      setLeastStudents(least5Students);
    }
  }, [studentData]);

  return {
    instructorData,
    courses,
    nextClass,
    loading: cohortLoading || courseLoading || assignmentLoading || studentLoading,
    formatDateToDDMMYYYY,
    courseProgress,
    attendanceRate,
    assignmentSubmissionRate,
    studentData,
    announcements,
    topStudents, // Now this contains the top 5 students with highest activity
    leastStudents // Now this contains the top 5 students with lowest activity
  };
};

export default useInstructorData;
