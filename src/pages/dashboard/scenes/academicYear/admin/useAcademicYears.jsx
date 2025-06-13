import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useApi from '../../../../../hooks/useApi';
import { endpoints } from '../../../../../utils/constants';
import { setError } from '../../../../../reduxStore/slices/adminDataSlice';

const useAcademicYears = () => {
  const [formValues, setFormValues] = useState({
    name: '',
    fromYear: '',
    toYear: '',
    isCurrent: false,
  });
  const [error, setError] = useState('');
  const { loading, callApi } = useApi();
  const dispatch = useDispatch();

  // Get data from Redux
  const academicYears = useSelector((state) => state.adminData.academicYears) || [];
  const currentAcademicYear = useSelector((state) => state.adminData.currentAcademicYear);
  const userId = useSelector((state) => state.users.user?._id);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Create a new academic year
  const handleCreateAcademicYear = async () => {
    const { name, fromYear, toYear, isCurrent } = formValues;

    // Validation
    if (!name.trim() || !fromYear.trim() || !toYear.trim()) {
      setError('Please fill in all required fields.');
      return false;
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(fromYear) || !dateRegex.test(toYear)) {
      setError('Dates must be in YYYY-MM-DD format.');
      return false;
    }

    // Validate userId
    if (!userId) {
      setError('User not authenticated. Please log in.');
      return false;
    }

    const academicYearData = {
      name,
      fromYear: new Date(fromYear).toISOString(),
      toYear: new Date(toYear).toISOString(),
      isCurrent,
      createdBy: userId,
    };

    try {
      setError('');
      const response = await callApi(endpoints.ACADEMIC_YEARS, 'POST', academicYearData);
      if (response) {
        // Reset form
        setFormValues({
          name: '',
          fromYear: '',
          toYear: '',
          isCurrent: false,
        });
        return true;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create academic year.';
      setError(errorMessage);
      dispatch(setError(errorMessage));
      return false;
    }
  };

  return {
    formValues,
    handleChange,
    handleCreateAcademicYear,
    academicYears,
    currentYear: currentAcademicYear,
    loading,
    error,
  };
};

export default useAcademicYears;