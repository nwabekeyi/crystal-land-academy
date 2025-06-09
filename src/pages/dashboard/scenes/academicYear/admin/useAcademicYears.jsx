// src/hooks/useAcademicYears.js
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useApi from "../../../../../hooks/useApi";
import { endpoints } from "../../../../../utils/constants";
import { setAcademicYears, setCurrentAcademicYear } from "../../../../../reduxStore/slices/adminDataSlice";

const useAcademicYears = () => {
  const [formValues, setFormValues] = useState({
    name: "",
    fromYear: "",
    toYear: "",
  });
  const [error, setError] = useState("");
  const { loading, data, error: apiError, callApi } = useApi();
  const academicYears = useSelector((state) => state.adminData.academicYears) || [];
  const currentAcademicYear = useSelector((state) => state.adminData.currentAcademicYear);
  const dispatch = useDispatch();

  // Fetch all academic years and current year on mount
  useEffect(() => {
    callApi(endpoints.ACADEMIC_YEARS, "GET");
    callApi(endpoints.CURRENT_ACADEMIC_YEAR, "GET");
  }, []);

  // Handle API responses
  useEffect(() => {
    if (!loading && data) {
      if (data.academicYears) {
        // Response from GET /api/academic-years
        dispatch(setAcademicYears(data.academicYears));
      } else if (data._id && data.isCurrent !== undefined) {
        // Response from GET /api/academic-years/current
        dispatch(setCurrentAcademicYear(data));
      }
    }
    if (apiError) {
      setError(apiError.message || "An error occurred");
    }
  }, [loading, data, apiError, dispatch]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create a new academic year
  const handleCreateAcademicYear = async () => {
    const { name, fromYear, toYear } = formValues;

    // Validation
    if (!name.trim() || !fromYear.trim() || !toYear.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(fromYear) || !dateRegex.test(toYear)) {
      setError("Dates must be in YYYY-MM-DD format.");
      return;
    }

    const academicYearData = {
      name,
      fromYear: new Date(fromYear).toISOString(),
      toYear: new Date(toYear).toISOString(),
    };

    try {
      setError("");
      const response = await callApi(endpoints.ACADEMIC_YEARS, "POST", academicYearData);
      if (response) {
        // Update local state and Redux
        const updatedYears = [...academicYears, response.data];
        dispatch(setAcademicYears(updatedYears));
        // Reset form
        setFormValues({
          name: "",
          fromYear: "",
          toYear: "",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create academic year.");
    }
  };

  return {
    formValues,
    handleChange,
    handleCreateAcademicYear,
    academicYears,
    currentYear: currentAcademicYear, // Alias for compatibility
    loading,
    error,
  };
};

export default useAcademicYears;