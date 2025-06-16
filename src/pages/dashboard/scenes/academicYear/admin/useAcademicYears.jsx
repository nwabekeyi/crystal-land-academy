// components/useAcademicYears.js
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useApi from "../../../../../hooks/useApi";
import { endpoints } from "../../../../../utils/constants";
import { setError, setAcademicYears, setCurrentAcademicYear } from "../../../../../reduxStore/slices/adminDataSlice";
import useAdminData from "../../dashboard/admin/useAdminData";

const useAcademicYears = () => {
  const [formValues, setFormValues] = useState({
    id: "",
    name: "",
    fromYear: "",
    toYear: "",
    isCurrent: false,
    addAcademicTerm: false,
    academicTerm: {
      name: "",
      description: "",
      duration: "3 months",
      startDate: "",
      endDate: "",
      terms: [
        { name: "1st Term", description: "", duration: "3 months", startDate: "", endDate: "", isCurrent: false, createdBy: "" },
        { name: "2nd Term", description: "", duration: "3 months", startDate: "", endDate: "", isCurrent: false, createdBy: "" },
        { name: "3rd Term", description: "", duration: "3 months", startDate: "", endDate: "", isCurrent: false, createdBy: "" },
      ],
    },
  });
  const [error, setError] = useState({
    name: "",
    fromYear: "",
    toYear: "",
    general: "",
    academicTerm: {
      name: "",
      description: "",
      duration: "",
      startDate: "",
      endDate: "",
      terms: [{ description: "", duration: "", startDate: "", endDate: "" }, {}, {}],
    },
  });
  const [editMode, setEditMode] = useState(false);
  const { loading, callApi } = useApi();
  const dispatch = useDispatch();

  // Get data and refetch functions from useAdminData
  const { academicYears, currentYear, refetchAcademicYears, refetchCurrentYear } = useAdminData();
  const userId = useSelector((state) => state.users.user?._id);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle nested fields
    if (name.includes(".")) {
      const keys = name.split(".");
      setFormValues((prev) => {
        let current = { ...prev };
        let ref = current;
        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i].match(/\[(\d+)\]/) ? Number(keys[i].match(/\[(\d+)\]/)[1]) : keys[i];
          ref[key] = Array.isArray(ref[key]) ? [...ref[key]] : { ...ref[key] };
          ref = ref[key];
        }
        const lastKey = keys[keys.length - 1].match(/\[(\d+)\]/)
          ? Number(keys[keys.length - 1].match(/\[(\d+)\]/)[1])
          : keys[keys.length - 1];
        ref[lastKey] = type === "checkbox" ? checked : value;
        return current;
      });
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    // Clear field-specific error
    setError((prev) => {
      let currentError = { ...prev };
      let ref = currentError;
      const errorKeys = name.split(".");
      for (let i = 0; i < errorKeys.length - 1; i++) {
        const key = errorKeys[i].match(/\[(\d+)\]/) ? Number(errorKeys[i].match(/\[(\d+)\]/)[1]) : errorKeys[i];
        ref[key] = ref[key] || (Array.isArray(ref[key]) ? [] : {});
        ref = ref[key];
      }
      const lastKey = errorKeys[errorKeys.length - 1].match(/\[(\d+)\]/)
        ? Number(errorKeys[errorKeys.length - 1].match(/\[(\d+)\]/)[1])
        : errorKeys[errorKeys.length - 1];
      ref[lastKey] = "";
      currentError.general = "";
      return currentError;
    });
  };

  // Validate form inputs
  const validateForm = () => {
    const { name, fromYear, toYear, addAcademicTerm, academicTerm } = formValues;
    const errors = {
      name: "",
      fromYear: "",
      toYear: "",
      general: "",
      academicTerm: {
        name: "",
        description: "",
        duration: "",
        startDate: "",
        endDate: "",
        terms: [{ description: "", duration: "", startDate: "", endDate: "" }, {}, {}],
      },
    };

    // Validate Academic Year
    if (!name.trim()) {
      errors.name = "Academic year name is required";
    } else if (!/^\d{4}\/\d{4}$/.test(name)) {
      errors.name = "Name must be in format YYYY/YYYY (e.g., 2024/2025)";
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fromYear.trim()) {
      errors.fromYear = "From year is required";
    } else if (!dateRegex.test(fromYear)) {
      errors.fromYear = "From year must be in YYYY-MM-DD format";
    }

    if (!toYear.trim()) {
      errors.toYear = "To year is required";
    } else if (!dateRegex.test(toYear)) {
      errors.toYear = "To year must be in YYYY-MM-DD format";
    } else if (new Date(toYear) <= new Date(fromYear)) {
      errors.toYear = "To year must be after from year";
    }

    // Validate Academic Term if enabled
    if (addAcademicTerm) {
      if (!academicTerm.name.trim()) {
        errors.academicTerm.name = "Academic term name is required";
      }
      if (!academicTerm.description.trim()) {
        errors.academicTerm.description = "Description is required";
      }
      if (!academicTerm.duration.trim()) {
        errors.academicTerm.duration = "Duration is required";
      }
      if (!academicTerm.startDate) {
        errors.academicTerm.startDate = "Start date is required";
      } else if (!dateRegex.test(academicTerm.startDate)) {
        errors.academicTerm.startDate = "Start date must be in YYYY-MM-DD format";
      }
      if (!academicTerm.endDate) {
        errors.academicTerm.endDate = "End date is required";
      } else if (!dateRegex.test(academicTerm.endDate)) {
        errors.academicTerm.endDate = "End date must be in YYYY-MM-DD format";
      } else if (new Date(academicTerm.endDate) <= new Date(academicTerm.startDate)) {
        errors.academicTerm.endDate = "End date must be after start date";
      }

      // Validate Sub-Terms
      academicTerm.terms.forEach((term, index) => {
        if (!term.description.trim()) {
          errors.academicTerm.terms[index].description = "Description is required";
        }
        if (!term.duration.trim()) {
          errors.academicTerm.terms[index].duration = "Duration is required";
        }
        if (!term.startDate) {
          errors.academicTerm.terms[index].startDate = "Start date is required";
        } else if (!dateRegex.test(term.startDate)) {
          errors.academicTerm.terms[index].startDate = "Start date must be in YYYY-MM-DD format";
        }
        if (!term.endDate) {
          errors.academicTerm.terms[index].endDate = "End date is required";
        } else if (!dateRegex.test(term.endDate)) {
          errors.academicTerm.terms[index].endDate = "End date must be in YYYY-MM-DD format";
        } else if (new Date(term.endDate) <= new Date(term.startDate)) {
          errors.academicTerm.terms[index].endDate = "End date must be after start date";
        }
      });
    }

    setError(errors);
    return (
      !errors.name &&
      !errors.fromYear &&
      !errors.toYear &&
      (!addAcademicTerm ||
        (!errors.academicTerm.name &&
          !errors.academicTerm.description &&
          !errors.academicTerm.duration &&
          !errors.academicTerm.startDate &&
          !errors.academicTerm.endDate &&
          errors.academicTerm.terms.every((term) =>
            Object.values(term).every((val) => !val)
          )))
    );
  };

  // Create a new academic year
  const handleCreateAcademicYear = async () => {
    if (!validateForm()) {
      return false;
    }

    if (!userId) {
      setError((prev) => ({ ...prev, general: "User not authenticated. Please log in." }));
      return false;
    }

    const { name, fromYear, toYear, isCurrent, addAcademicTerm, academicTerm } = formValues;

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
      setError((prev) => ({
        ...prev,
        name: "",
        fromYear: "",
        toYear: "",
        general: "",
        academicTerm: {
          name: "",
          description: "",
          duration: "",
          startDate: "",
          endDate: "",
          terms: [{ description: "", duration: "", startDate: "", endDate: "" }, {}, {}],
        },
      }));

      // Create Academic Year
      const yearResponse = await callApi(endpoints.ACADEMIC_YEARS, "POST", academicYearData);
      if (!yearResponse) {
        throw new Error("Failed to create academic year");
      }

      // Create Academic Term if enabled
      if (addAcademicTerm) {
        const academicTermData = {
          name: academicTerm.name,
          description: academicTerm.description,
          duration: academicTerm.duration,
          startDate: new Date(academicTerm.startDate).toISOString(),
          endDate: new Date(academicTerm.endDate).toISOString(),
          academicYearId: yearResponse.data._id,
          terms: academicTerm.terms.map((term) => ({
            ...term,
            startDate: new Date(term.startDate).toISOString(),
            endDate: new Date(term.endDate).toISOString(),
            createdBy: userId,
          })),
        };

        const termResponse = await callApi(endpoints.ACADEMIC_TERM, "POST", academicTermData);
        if (!termResponse) {
          throw new Error("Failed to create academic term");
        }
      }

      // Refetch data
      await refetchAcademicYears();
      await refetchCurrentYear();

      // Reset form
      setFormValues({
        id: "",
        name: "",
        fromYear: "",
        toYear: "",
        isCurrent: false,
        addAcademicTerm: false,
        academicTerm: {
          name: "",
          description: "",
          duration: "3 months",
          startDate: "",
          endDate: "",
          terms: [
            { name: "1st Term", description: "", duration: "3 months", startDate: "", endDate: "", isCurrent: false, createdBy: "" },
            { name: "2nd Term", description: "", duration: "3 months", startDate: "", endDate: "", isCurrent: false, createdBy: "" },
            { name: "3rd Term", description: "", duration: "3 months", startDate: "", endDate: "", isCurrent: false, createdBy: "" },
          ],
        },
      });
      setEditMode(false);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to create academic year";
      setError((prev) => ({ ...prev, general: errorMessage }));
      dispatch(setError(errorMessage));
      return false;
    }
  };

  // Update an existing academic year
  const handleUpdateAcademicYear = async () => {
    if (!validateForm()) {
      return false;
    }

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
    };

    try {
      setError((prev) => ({
        ...prev,
        name: "",
        fromYear: "",
        toYear: "",
        general: "",
        academicTerm: {
          name: "",
          description: "",
          duration: "",
          startDate: "",
          endDate: "",
          terms: [{ description: "", duration: "", startDate: "", endDate: "" }, {}, {}],
        },
      }));
      const response = await callApi(`${endpoints.ACADEMIC_YEARS}/${id}`, "PATCH", academicYearData);
      if (response) {
        await refetchAcademicYears();
        await refetchCurrentYear();
        setFormValues({
          id: "",
          name: "",
          fromYear: "",
          toYear: "",
          isCurrent: false,
          addAcademicTerm: false,
          academicTerm: {
            name: "",
            description: "",
            duration: "3 months",
            startDate: "",
            endDate: "",
            terms: [
              { name: "1st Term", description: "", duration: "3 months", startDate: "", endDate: "", isCurrent: false, createdBy: "" },
              { name: "2nd Term", description: "", duration: "3 months", startDate: "", endDate: "", isCurrent: false, createdBy: "" },
              { name: "3rd Term", description: "", duration: "3 months", startDate: "", endDate: "", isCurrent: false, createdBy: "" },
            ],
          },
        });
        setEditMode(false);
        return true;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update academic year";
      setError((prev) => ({ ...prev, general: errorMessage }));
      dispatch(setError(errorMessage));
      return false;
    }
  };

  // Handle form submission (create or update)
  const handleSubmit = () => {
    return editMode ? handleUpdateAcademicYear() : handleCreateAcademicYear();
  };

  // Populate form for editing
  const startEdit = (year) => {
    setFormValues({
      id: year._id,
      name: year.name,
      fromYear: year.fromYear.split("T")[0],
      toYear: year.toYear.split("T")[0],
      isCurrent: year.isCurrent,
      addAcademicTerm: false,
      academicTerm: {
        name: "",
        description: "",
        duration: "3 months",
        startDate: "",
        endDate: "",
        terms: [
          { name: "1st Term", description: "", duration: "3 months", startDate: "", endDate: "", isCurrent: false, createdBy: "" },
          { name: "2nd Term", description: "", duration: "3 months", startDate: "", endDate: "", isCurrent: false, createdBy: "" },
          { name: "3rd Term", description: "", duration: "3 months", startDate: "", endDate: "", isCurrent: false, createdBy: "" },
        ],
      },
    });
    setEditMode(true);
    setError({
      name: "",
      fromYear: "",
      toYear: "",
      general: "",
      academicTerm: {
        name: "",
        description: "",
        duration: "",
        startDate: "",
        endDate: "",
        terms: [{ description: "", duration: "", startDate: "", endDate: "" }, {}, {}],
      },
    });
  };

  return {
    setFormValues,
    formValues,
    handleChange,
    handleSubmit,
    startEdit,
    editMode,
    setEditMode,
    academicYears,
    currentYear,
    loading,
    error,
  };
};

export default useAcademicYears;