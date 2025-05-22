import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch} from "react-redux";
import {setAllCourses} from '../../reduxStore/slices/adminDataSlice'
import useApi from "../../hooks/useApi";
import { endpoints } from "../../utils/constants";
import { updateUser, addUser} from '../../reduxStore/slices/adminDataSlice'; 

const useSignUp = ({ offline, role, selectedUser }) => {

    const [assignedInstructor, setAssignedInstructor] = useState('');
    const [courseSelected, setCourseSelected] = useState(null);
    const [cohortsOptions, setCohortsOptions] = useState([]); // State to store cohort options
    const [loadingCohorts, setLoadingCohorts] = useState(false); // Loading state for cohorts
    const [error, setError] = useState('');
    const { data, error: submitError, callApi } = useApi();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const { data: courseData, loading: courseLoading, error: courseError, callApi: courseApi } = useApi();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    //get courses

    
      useEffect(async () => {
        const getCourses = await courseApi(endpoints.COURSES, 'GET');

        if (getCourses && getCourses.courses) {
          console.log('Data received:', data);
          dispatch(setAllCourses(getCourses.courses));
          setCourses(getCourses.courses)
        }
      }, []); 


    const users = useSelector((state) => state.adminData.usersData);

    const instructors = users.instructors || [];
    const programs = Array.isArray(courses) ? courses.map(course => course.courseName) : [];
    const roleFields = {
        student: [
            { label: 'First Name', name: 'firstName', type: 'text', required: selectedUser ? false : true },
            { label: 'Last Name', name: 'lastName', type: 'text', required: selectedUser ? false : true },
            { label: 'Email', name: 'email', type: 'email', required: selectedUser ? false : true },
            { label: 'Phone Number', name: 'phoneNumber', type: 'tel', required: selectedUser ? false : true },
            !selectedUser && { label: 'Password', name: 'password', type: 'password', required: selectedUser ? false : true },
            !selectedUser && { label: 'Confirm Password', name: 'confirmPassword', type: 'password', required: selectedUser ? false : true },
            { label: 'Profile Picture', name: 'profilePictureUrl', type: 'file', required: selectedUser ? false : true },
            { label: 'Program', name: 'program', type: 'select', required: selectedUser ? false : true, options: programs },
            { label: 'Cohort', name: 'cohort', type: 'select', required: selectedUser || offline ? false : true, options: cohortsOptions },
            { label: 'Emergency Contact Name', name: 'emergencyContactName', type: 'text', required: selectedUser ? false : true },
            { label: 'Emergency Contact Relationship', name: 'emergencyContactRelationship', type: 'text', required: selectedUser ? false : true },
            { label: 'Emergency Contact Phone', name: 'emergencyContactPhone', type: 'tel', required: selectedUser ? false : true },
            !selectedUser && { label: 'Amount Paid', name: 'amountPaid', type: 'number', required: selectedUser ? false : true },
        ].filter(Boolean),
    
        instructor: [
            { label: 'First Name', name: 'firstName', type: 'text', required: selectedUser ? false : true },
            { label: 'Last Name', name: 'lastName', type: 'text', required: selectedUser ? false : true },
            { label: 'Email', name: 'email', type: 'email', required: selectedUser ? false : true },
            { label: 'Phone Number', name: 'phoneNumber', type: 'tel', required: selectedUser ? false : true },
            !selectedUser && { label: 'Password', name: 'password', type: 'password', required: selectedUser ? false : true },
            !selectedUser && { label: 'Confirm Password', name: 'confirmPassword', type: 'password', required: selectedUser ? false : true },
            { label: 'Profile Picture', name: 'profilePictureUrl', type: 'file', required: selectedUser ? false : true },
            { label: 'Program', name: 'program', type: 'select', required: selectedUser ? false : true, options: programs },
            { label: 'Cohort', name: 'cohort', type: 'select', required: selectedUser || offline ? false : true, options: cohortsOptions },
        ].filter(Boolean),
    
        admin: [
            { label: 'First Name', name: 'firstName', type: 'text', required: selectedUser ? false : true },
            { label: 'Last Name', name: 'lastName', type: 'text', required: selectedUser ? false : true },
            { label: 'Email', name: 'email', type: 'email', required: selectedUser ? false : true },
            { label: 'Phone Number', name: 'phoneNumber', type: 'tel', required: selectedUser ? false : true },
            !selectedUser && { label: 'Password', name: 'password', type: 'password', required: selectedUser ? false : true },
            !selectedUser && { label: 'Confirm Password', name: 'confirmPassword', type: 'password', required: selectedUser ? false : true },
            { label: 'Profile Picture', name: 'profilePictureUrl', type: 'file', required: selectedUser ? false : true },
        ].filter(Boolean)
    };
    

    

    const getInitialFormData = (role) => {
        const initialData = {};

        if (roleFields[role]) {
            roleFields[role].forEach((field) => {
                initialData[field.name] = (field.name === 'program') ? '' : (field.type === 'number' ? 0 : '');
            });

            if (role === 'student') {
                initialData.amountPaid = 0;
            }
        }

        if (selectedUser && users) {
            const user =
                role === 'student'
                    ? users.students.find((u) => u.userId === selectedUser)
                    : role === 'instructor'
                    ? users.instructors.find((u) => u.userId === selectedUser)
                    : role === 'admin'
                    ? users.admins.find((u) => u._id === selectedUser)
                    : users.superAdmins.find((u) => u._userId === selectedUser);

            if (user) {
                Object.keys(initialData).forEach((key) => {
                    if (role !== 'student' || key !== 'amountPaid') {
                        initialData[key] = user[key] || initialData[key];
                    }
                });
            }
        }

        return initialData;
    };
    

    const [formData, setFormData] = useState(getInitialFormData(role));
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);
    const formRef = useRef(null);

    // Fetch cohorts based on the selected program (course)
    const fetchCohorts = async (courseId) => {
        try {
            setLoadingCohorts(true);
            const response = await fetch(`${endpoints.COHORT}/${courseId}`);
            const cohorts = await response.json();
            setCohortsOptions(cohorts.cohorts.map((cohort) => cohort.cohortName)); // Store cohort names as strings
        } catch (error) {
            console.error("Error fetching cohorts:", error);
        } finally {
            setLoadingCohorts(false);
        }
    }

    // Set assigned instructor based on the cohort's instructorId, only for students
    const setInstructor = (cohorts) => {
        if (role === 'student') {
            // Find the instructor based on cohort and assign
            cohorts.forEach(cohort => {
                const instructor = instructors.find(instructor => instructor._id === cohort.instructor);
                if (instructor) {
                    setAssignedInstructor(`${instructor.firstName} ${instructor.lastName}`);
                }
            });
        }
    };

    useEffect(() => {
        setFormData(getInitialFormData(role));
    }, [role, selectedUser]);

    useEffect(() => {
        // Fetch cohorts if selectedUser exists and program is set
        if (selectedUser && formData.program) {
            const selectedCourse = courses.find(course => course.courseName === formData.program);
            if (selectedCourse) {
                fetchCohorts(selectedCourse.courseId); // Fetch cohorts based on selected course
            }
        }
    }, [formData.program]); // Only re-run when program changes
    

    const handleProgramChange = (e) => {
        const { value } = e.target;
        const selectedCourse = courses.find(course => course.courseName === value);
    
        if (selectedCourse) {
            setCourseSelected(selectedCourse);
            setFormData(prevData => ({
                ...prevData,
                program: value
            }));
    
            fetchCohorts(selectedCourse.courseId); // Fetch cohorts for the selected course
        }
    };
    
    const handleCohortChange = (e) => {
        const { value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            cohort: value  // Ensure cohort is a string, not an array
        }));

        console.log(typeof value)
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
    
        if (name === 'profilePictureUrl') {
            const selectedFile = files[0]; // Store the selected file
            setProfilePictureUrl(selectedFile);
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };
    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();    
        // If updating an existing user, remove required fields for all inputs
        if (selectedUser) {
            formRef.current.querySelectorAll('[required]').forEach(field => {
                field.removeAttribute('required');
            });
        };
    
        setError('');
        
        // Skip password validation if updating an existing user (i.e., when selectedUser exists)
        if (!selectedUser && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        // Ensure a profile picture is selected when creating a new user
        if (!selectedUser && !profilePictureUrl) {
            setError('Profile Picture is required');
            return;
        }
        
        try {
            // Prepare FormData to handle both text and file data
            const formDataToSubmit = new FormData();
    
            // Add all form fields to FormData, except confirmPassword and profilePicture
            Object.keys(formData).forEach((key) => {
                if (key !== 'confirmPassword' && key !== 'profilePictureUrl') {
                    // Only append non-empty fields if selectedUser is true
                    if (!selectedUser || (formData[key] && formData[key] !== "")) {
                        formDataToSubmit.append(key, formData[key]);
                    }
                }
            });
    
            // Check if profilePictureUrl is not null before appending it
            if (profilePictureUrl) {
                formDataToSubmit.append('profilePictureUrl', profilePictureUrl);
            }
    
            // Append role and assignedInstructor (conditionally for students)
            formDataToSubmit.append('role', role);
    
            // Split the API request based on selectedUser
            let response;
            if (selectedUser) {
                // PATCH request for updating an existing user
                response = await callApi(
                    `${endpoints.USER}/${selectedUser}`,
                    'PATCH',
                    formDataToSubmit,
                    {
                        'Content-Type': 'multipart/form-data', // FormData automatically sets the boundary
                    }
                );

                 // Check if the response contains user data, and handle success/failure
                if (response && response?.user) {
                    setLoading(false);
                    dispatch(updateUser(response.user.userId, response.user, response.user.role));
                    console.log(response)
                    setModalMessage(`${response.user.firstName} ${response.user.lastName} has been successfully Update`);
                    setFormData(getInitialFormData(role));  // Clear form on success

                } else {
                    setLoading(false);
                    setModalMessage(`${response?.message}`);
                };
            } else {
                // POST request for creating a new user
                response = await callApi(
                    endpoints.USER,
                    'POST',
                    formDataToSubmit,
                    {
                        'Content-Type': 'multipart/form-data', // FormData automatically sets the boundary
                    }
                );

                 // Check if the response contains user data, and handle success/failure
                if (response && response?.user) {
                    setLoading(false);
                    console.log(response);
                    dispatch(addUser(response?.user));
                    setModalMessage(`${response.user.firstName} ${response.user.lastName} has been successfully registered as ${response.user.role}`);
                    setFormData(getInitialFormData(role));  // Clear form on success
                } else {
                    setLoading(false);
                    setModalMessage(`${response?.message}`);
                }
            }
    
            setModalOpen(true); // Show success/error modal
    
        } catch (error) {
            console.error('Error submitting the form:', error);
            setError('An error occurred while submitting the form. Please try again.');
        }
    };
    

    return {
        formRef,
        formData,
        error,
        loading,
        handleChange,
        handleSubmit,
        handleProgramChange,
        handleCohortChange,
        roleFields,
        profilePictureUrl,
        assignedInstructor,
        cohortsOptions, // Add cohortsOptions to return
        modalOpen,
        modalMessage,
        setModalOpen,
    };
};

export default useSignUp;
