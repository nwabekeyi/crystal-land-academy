import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useApi from "../../../../../hooks/useApi";
import { endpoints } from "../../../../../utils/constants";
import { setAcademicYears, setCurrentAcademicYear, setError } from "../../../../../reduxStore/slices/adminDataSlice";
import useAdminData from "../../dashboard/admin/useAdminData";

const useAcademicYears = () => {
  const defaultFormValues = {
    id: "",
    name: "",
    fromYear: "",
    toYear: "",
    isCurrent: false,
  };

  const defaultTermFormValues = {
    academicYearId: "",
    terms: [
      { name: "1st Term", description: "", duration: "3 months", startDate: "", endDate: "", createdBy: "", isCurrent: false },
      { name: "2nd Term", description: "", duration: "3 months", startDate: "", endDate: "", createdBy: "", isCurrent: false },
      { name: "3rd Term", description: "", duration: "3 months", startDate: "", endDate: "", createdBy: "", isCurrent: false },
    ],
  };

  const [formValues, setFormValues] = useState(defaultFormValues);
  const [termFormValues, setTermFormValues] = useState(defaultTermFormValues);
  const [error, setError] = useState({
    name: "",
    fromYear: "",
    toYear: "",
    general: "",
  });
  const [termError, setTermError] = useState({
    general: "",
    terms: [
      { description: "", duration: "", startDate: "", endDate: "" },
      { description: "", duration: "", startDate: "", endDate: "" },
      { description: "", duration: "", startDate: "", endDate: "" },
    ],
  });
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loading, callApi } = useApi();
  const dispatch = useDispatch();
  const { academicYears, currentAcademicYear, refetchAcademicYears, refetchCurrentYear } = useAdminData();
  const userId = useSelector((state) => state.users.user?._id);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormValues((prev) => ({
      ...prev,
      [name]: val,
    }));
    setError((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const handleDeleteAcademicYear = async (id) => {
    if (!userId) {
      setError((prev) => ({ ...prev, general: "User not authenticated. Please log in." }));
      return false;
    }
  
    try {
      setIsSubmitting(true);
      setError((prev) => ({ ...prev, general: "" }));
  
      const response = await callApi(`${endpoints.ACADEMIC_YEARS}/${id}`, "DELETE");
      if (!response || response.status !== "success") {
        throw new Error(response?.message || "Failed to delete academic year");
      }
  
      // Remove the deleted academic year from the store
      dispatch(
        setAcademicYears(academicYears.filter((year) => year._id !== id))
      );
  
      // If the deleted year was the current academic year, clear it
      if (currentAcademicYear?._id === id) {
        dispatch(setCurrentAcademicYear(null));
      }
  
      await refetchAcademicYears();
      await refetchCurrentYear();
  
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete academic year";
      setError((prev) => ({ ...prev, general: errorMessage }));
      dispatch(setError(errorMessage));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTermChange = (e, index, isCurrentChange = false) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setTermFormValues((prev) => {
      const updatedTerms = [...prev.terms];
      updatedTerms[index] = { ...updatedTerms[index], [name]: val, createdBy: userId };

      // If isCurrent is being set to true, unset isCurrent for other terms
      if (isCurrentChange && val) {
        updatedTerms.forEach((term, i) => {
          if (i !== index) term.isCurrent = false;
        });
      }

      return { ...prev, terms: updatedTerms };
    });

    setTermError((prev) => ({
      ...prev,
      terms: prev.terms.map((term, i) => (i === index ? { ...term, [name]: "" } : term)),
      general: "",
    }));
  };

  const validateForm = () => {
    const { name, fromYear, toYear } = formValues;
    const errors = {
      name: "",
      fromYear: "",
      toYear: "",
      general: "",
    };

    if (!name.trim()) {
      errors.name = "Academic year name is required";
    } else if (!/^\d{4}\/\d{4}$/.test(name.trim())) {
      errors.name = "Name must be in format YYYY/YYYY (e.g., 2024/2025)";
    }

    if (!fromYear.trim()) {
      errors.fromYear = "From year is required";
    }

    if (!toYear.trim()) {
      errors.toYear = "To year is required";
    }

    setError(errors);
    return !errors.name && !errors.fromYear && !errors.toYear;
  };

  const validateTermForm = () => {
    const { terms } = termFormValues;
    const errors = {
      general: "",
      terms: [
        { description: "", duration: "", startDate: "", endDate: "" },
        { description: "", duration: "", startDate: "", endDate: "" },
        { description: "", duration: "", startDate: "", endDate: "" },
      ],
    };

    // Validate terms array
    if (!terms || terms.length !== 3 || !terms.every((term) => ["1st Term", "2nd Term", "3rd Term"].includes(term.name))) {
      errors.general = "Exactly three terms (1st Term, 2nd Term, 3rd Term) are required";
    }

    // Validate only one term is current
    const currentTerms = terms.filter((term) => term.isCurrent);
    if (currentTerms.length > 1) {
      errors.general = "Only one term can be set as current";
    }

    // Allowed duration values
    const allowedDurations = Array.from({ length: 10 }, (_, i) => `${i + 1} month${i + 1 > 1 ? "s" : ""}`);

    terms.forEach((term, index) => {
      if (!term.description.trim()) errors.terms[index].description = "Description is required";
      if (!term.duration || !allowedDurations.includes(term.duration)) {
        errors.terms[index].duration = "Duration must be between 1 and 10 months";
      }
      if (!term.startDate) errors.terms[index].startDate = "Start date is required";
      if (!term.endDate) errors.terms[index].endDate = "End date is required";
      if (term.startDate && term.endDate && new Date(term.startDate) >= new Date(term.endDate)) {
        errors.terms[index].endDate = "End date must be after start date";
      }
    });

    // Validate unique durations within terms
    const durations = terms.map((term) => term.duration);
    if (new Set(durations).size !== durations.length) {
      errors.general = "All terms must have unique durations";
    }

    // Validate no date intersection within terms
    for (let i = 0; i < terms.length; i++) {
      for (let j = i + 1; j < terms.length; j++) {
        if (terms[i].startDate && terms[i].endDate && terms[j].startDate && terms[j].endDate) {
          if (
            new Date(terms[i].startDate) <= new Date(terms[j].endDate) &&
            new Date(terms[j].startDate) <= new Date(terms[i].endDate)
          ) {
            errors.terms[j].startDate = `Terms ${terms[i].name} and ${terms[j].name} have overlapping dates`;
          }
        }
      }
    }

    setTermError(errors);
    return (
      !errors.general &&
      errors.terms.every((term) => !term.description && !term.duration && !term.startDate && !term.endDate)
    );
  };

  const handleCreateAcademicYear = async () => {
    if (!validateForm()) return false;

    if (!userId) {
      setError((prev) => ({ ...prev, general: "User not authenticated. Please log in." }));
      return false;
    }

    const { name, fromYear, toYear, isCurrent } = formValues;
    const academicYearData = {
      name,
      fromYear: new Date(fromYear).toISOString(),
      toYear: new Date(toYear).toISOString(),
      isCurrent,
      createdBy: userId,
      academicTerms: [],
      students: [],
      teachers: [],
    };

    try {
      setIsSubmitting(true);
      setError((prev) => ({
        ...prev,
        name: "",
        fromYear: "",
        toYear: "",
        general: "",
      }));

      const yearResponse = await callApi(endpoints.ACADEMIC_YEARS, "POST", academicYearData);
      if (!yearResponse || yearResponse.status !== "success") {
        throw new Error(yearResponse?.message || "Failed to create academic year");
      }

      const newYear = yearResponse.data;
      dispatch(setAcademicYears([...academicYears, newYear]));
      if (isCurrent) dispatch(setCurrentAcademicYear(newYear));

      await refetchAcademicYears();
      await refetchCurrentYear();

      setFormValues(defaultFormValues);
      setEditMode(false);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to create academic year";
      setError((prev) => ({ ...prev, general: errorMessage }));
      dispatch(setError(errorMessage));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAcademicTerm = async () => {
    if (!validateTermForm()) return false;

    if (!userId) {
      setTermError((prev) => ({ ...prev, general: "User not authenticated. Please log in." }));
      return false;
    }

    const { terms, academicYearId } = termFormValues;
    const academicTermData = {
      academicYearId,
      terms: terms.map((term) => ({
        ...term,
        startDate: term.startDate ? new Date(term.startDate).toISOString() : undefined,
        endDate: term.endDate ? new Date(term.endDate).toISOString() : undefined,
        createdBy: userId,
      })),
    };

    try {
      setIsSubmitting(true);
      setTermError((prev) => ({
        ...prev,
        general: "",
        terms: prev.terms.map(() => ({ description: "", duration: "", startDate: "", endDate: "" })),
      }));

      const termResponse = await callApi(endpoints.ACADEMIC_TERMS, "POST", academicTermData);
      if (!termResponse || termResponse.status !== "success") {
        throw new Error(termResponse?.message || "Failed to create academic term");
      }

      const newTerm = termResponse.data;
      const updatedAcademicYears = academicYears.map((year) =>
        year._id === academicYearId
          ? { ...year, academicTerms: [...(year.academicTerms || []), newTerm._id] }
          : year
      );
      dispatch(setAcademicYears(updatedAcademicYears));

      await refetchAcademicYears();
      setTermFormValues(defaultTermFormValues);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to create academic term";
      setTermError((prev) => ({ ...prev, general: errorMessage }));
      dispatch(setError(errorMessage));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAcademicYear = async () => {
    if (!validateForm()) return false;

    const { id, name, fromYear, toYear, isCurrent } = formValues;

    if (!userId) {
      setError((prev) => ({ ...prev, general: "User not authenticated. Please log in." }));
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
      setIsSubmitting(true);
      setError((prev) => ({
        ...prev,
        name: "",
        fromYear: "",
        toYear: "",
        general: "",
      }));

      const response = await callApi(`${endpoints.ACADEMIC_YEARS}/${id}`, "PATCH", academicYearData);
      if (!response || response.status !== "success") {
        throw new Error(response?.message || "Failed to update academic year");
      }

      const updatedYear = response.data;
      dispatch(
        setAcademicYears(
          academicYears.map((year) => (year._id === id ? updatedYear : year))
        )
      );
      if (isCurrent) {
        dispatch(setCurrentAcademicYear(updatedYear));
      } else if (currentAcademicYear?._id === id && !isCurrent) {
        dispatch(setCurrentAcademicYear(null));
      }

      await refetchAcademicYears();
      await refetchCurrentYear();

      setFormValues(defaultFormValues);
      setEditMode(false);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update academic year";
      setError((prev) => ({ ...prev, general: errorMessage }));
      dispatch(setError(errorMessage));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    return editMode ? await handleUpdateAcademicYear() : await handleCreateAcademicYear();
  };

  const startEdit = (year) => {
    setFormValues({
      id: year._id,
      name: year.name,
      fromYear: year.fromYear.split("T")[0],
      toYear: year.toYear.split("T")[0],
      isCurrent: year.isCurrent,
    });
    setEditMode(true);
    setError({
      name: "",
      fromYear: "",
      toYear: "",
      general: "",
    });
  };

  const startAddTerm = (academicYearId) => {
    setTermFormValues({
      ...defaultTermFormValues,
      academicYearId,
      terms: defaultTermFormValues.terms.map((term) => ({ ...term, createdBy: userId })),
    });
    setTermError({
      general: "",
      terms: [
        { description: "", duration: "", startDate: "", endDate: "" },
        { description: "", duration: "", startDate: "", endDate: "" },
        { description: "", duration: "", startDate: "", endDate: "" },
      ],
    });
  };

  const resetForm = () => {
    setFormValues(defaultFormValues);
    setError({
      name: "",
      fromYear: "",
      toYear: "",
      general: "",
    });
    setEditMode(false);
  };

  const resetTermForm = () => {
    setTermFormValues(defaultTermFormValues);
    setTermError({
      general: "",
      terms: [
        { description: "", duration: "", startDate: "", endDate: "" },
        { description: "", duration: "", startDate: "", endDate: "" },
        { description: "", duration: "", startDate: "", endDate: "" },
      ],
    });
  };

  return {
    setFormValues,
    formValues,
    handleChange,
    handleTermChange,
    handleSubmit,
    handleCreateAcademicTerm,
    startEdit,
    startAddTerm,
    editMode,
    setEditMode,
    academicYears,
    currentAcademicYear,
    loading,
    error,
    termError,
    isSubmitting,
    resetForm,
    resetTermForm,
    termFormValues,
    handleDeleteAcademicYear
  };
};

export default useAcademicYears;