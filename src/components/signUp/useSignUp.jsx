import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import useApi from "../../hooks/useApi";
import { endpoints } from "../../utils/constants";
import { updateUser, addUser } from "../../reduxStore/slices/adminDataSlice";

const validateObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id); // Simple regex for ObjectId validation

const useSignUp = ({ role, selectedUser }) => {
  const [error, setError] = useState("");
  const { data, error: submitError, callApi } = useApi();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const dispatch = useDispatch();

  const users = useSelector((state) => state.adminData.usersData);
  const currentUser = users.user || {};
  const teachers = users.teachers || [];

  // Log selectedUser for debugging
  useEffect(() => {
    console.log("selectedUser:", selectedUser);
    if (selectedUser && !validateObjectId(selectedUser)) {
      console.warn("Invalid selectedUser ID format:", selectedUser);
      setError("Invalid user ID format");
    }
  }, [selectedUser]);

  // Fetch subjects and academic years for dropdowns
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [subjectsRes, yearsRes] = await Promise.all([
          callApi("/api/subjects", "GET"),
          callApi("/api/academic-years", "GET"),
        ]);
        setSubjects(subjectsRes.data?.map((s) => ({ id: s._id, name: s.data.name })) || []);
        setAcademicYears(yearsRes.data?.map((y) => ({ id: y._id, name: y.name })) || []);
      } catch (err) {
        console.error("Error fetching options:", err);
        setError("Failed to load dropdown options");
      }
    };
    fetchOptions();
  }, []);

  const roleFields = {
    student: [
      { label: "First Name", name: "firstName", type: "text", required: !selectedUser },
      { label: "Last Name", name: "lastName", type: "text", required: !selectedUser },
      { label: "Middle Name", name: "middleName", type: "text", required: false },
      { label: "Email", name: "email", type: "email", required: !selectedUser },
      { label: "Profile Picture", name: "profilePicture", type: "file", required: !selectedUser },
      { label: "Gender", name: "gender", type: "select", required: !selectedUser, options: ["Male", "Female", "Other"] },
      { label: "NIN", name: "NIN", type: "text", required: false },
      { label: "Tribe", name: "tribe", type: "text", required: false },
      { label: "Religion", name: "religion", type: "text", required: false },
      { label: "Formal School", name: "formalSchool", type: "text", required: false },
      { label: "Class Section", name: "currentClassLevel.section", type: "select", required: !selectedUser, options: ["Primary", "Secondary"] },
      { label: "Class Name", name: "currentClassLevel.className", type: "text", required: !selectedUser },
      { label: "Subclass", name: "currentClassLevel.subclass", type: "text", required: !selectedUser },
      { label: "Boarding Status", name: "boardingStatus", type: "select", required: !selectedUser, options: ["Boarder", "Day Student"] },
      { label: "Boarding Hall", name: "boardingDetails.hall", type: "text", required: false },
      { label: "Room Number", name: "boardingDetails.roomNumber", type: "text", required: false },
      { label: "Bed Number", name: "boardingDetails.bedNumber", type: "text", required: false },
      { label: "House Master", name: "boardingDetails.houseMaster", type: "text", required: false },
      { label: "Guardian Name", name: "guardians[0].name", type: "text", required: !selectedUser },
      { label: "Guardian Relationship", name: "guardians[0].relationship", type: "text", required: !selectedUser },
      { label: "Guardian Phone", name: "guardians[0].phone", type: "text", required: !selectedUser },
      { label: "Guardian Email", name: "guardians[0].email", type: "email", required: false },
      { label: "Guardian Address", name: "guardians[0].address", type: "text", required: false },
    ].filter(Boolean),

    teacher: [
      { label: "First Name", name: "firstName", type: "text", required: !selectedUser },
      { label: "Last Name", name: "lastName", type: "text", required: !selectedUser },
      { label: "Middle Name", name: "middleName", type: "text", required: false },
      { label: "Email", name: "email", type: "email", required: !selectedUser },
      { label: "Profile Picture", name: "profilePicture", type: "file", required: !selectedUser },
      { label: "Gender", name: "gender", type: "select", required: !selectedUser, options: ["Male", "Female", "Other"] },
      { label: "NIN", name: "NIN", type: "text", required: !selectedUser },
      { label: "Address", name: "address", type: "text", required: !selectedUser },
      { label: "Qualification", name: "qualification", type: "select", required: !selectedUser, options: ["SSCE", "OND", "HND", "BSc", "MBA", "BTech", "MSc", "PhD", "Other"] },
      { label: "Phone Number", name: "phoneNumber", type: "tel", required: !selectedUser },
      { label: "Tribe", name: "tribe", type: "text", required: !selectedUser },
      { label: "Religion", name: "religion", type: "select", required: !selectedUser, options: ["Christianity", "Islam", "Hinduism", "Buddhism", "Atheism", "Other"] },
      { label: "Subject", name: "subject", type: "select", required: !selectedUser, options: subjects.map((s) => s.name) },
      { label: "Bank Account Name", name: "bankAccountDetails.accountName", type: "text", required: !selectedUser },
      { label: "Bank Account Number", name: "bankAccountDetails.accountNumber", type: "text", required: !selectedUser },
      { label: "Bank Name", name: "bankAccountDetails.bank", type: "text", required: !selectedUser },
      { label: "Teaching Section", name: "teachingAssignments[0].section", type: "select", required: false, options: ["Primary", "Secondary"] },
      { label: "Teaching Class Name", name: "teachingAssignments[0].className", type: "text", required: false },
      { label: "Teaching Subclasses", name: "teachingAssignments[0].subclasses", type: "text", required: false },
      { label: "Teaching Academic Year", name: "teachingAssignments[0].academicYear", type: "select", required: false, options: academicYears.map((y) => y.name) },
      { label: "LinkedIn Profile", name: "linkedInProfile", type: "text", required: false },
    ].filter(Boolean),

    admin: [
      { label: "First Name", name: "firstName", type: "text", required: !selectedUser },
      { label: "Last Name", name: "lastName", type: "text", required: !selectedUser },
      { label: "Email", name: "email", type: "email", required: !selectedUser },
      { label: "Profile Picture", name: "profilePicture", type: "file", required: !selectedUser },
    ].filter(Boolean),
  };

  const getInitialFormData = (role) => {
    const initialData = {};
    roleFields[role].forEach((field) => {
      if (field.name.includes("currentClassLevel") || field.name.includes("boardingDetails") || field.name.includes("guardians") || field.name.includes("bankAccountDetails") || field.name.includes("teachingAssignments")) {
        const [parent, child, index] = field.name.split(/\.|\[|\]/).filter(Boolean);
        if (parent === "guardians" || parent === "teachingAssignments") {
          initialData[parent] = initialData[parent] || [{}];
          initialData[parent][0][child] = "";
        } else {
          initialData[parent] = initialData[parent] || {};
          initialData[parent][child] = "";
        }
      } else {
        initialData[field.name] = field.type === "select" ? "" : "";
      }
    });

    if (selectedUser && users && validateObjectId(selectedUser)) {
      console.log("Fetching user data for:", selectedUser);
      const user =
        role === "student"
          ? users.students?.find((u) => u._id === selectedUser)
          : role === "teacher"
          ? users.teachers?.find((u) => u._id === selectedUser)
          : users.admins?.find((u) => u._id === selectedUser);

      console.log("Found user:", user);

      if (user) {
        Object.keys(initialData).forEach((key) => {
          if (key === "currentClassLevel" && user[key]) {
            initialData[key] = {
              section: user[key].section || "",
              className: user[key].className || "",
              subclass: user[key].subclass || "",
            };
          } else if (key === "boardingDetails" && user[key]) {
            initialData[key] = {
              hall: user[key].hall || "",
              roomNumber: user[key].roomNumber || "",
              bedNumber: user[key].bedNumber || "",
              houseMaster: user[key].houseMaster || "",
            };
          } else if (key === "guardians" && user[key]?.length) {
            initialData[key] = [
              {
                name: user[key][0].name || "",
                relationship: user[key][0].relationship || "",
                phone: user[key][0].phone || "",
                email: user[key][0].email || "",
                address: user[key][0].address || "",
              },
            ];
          } else if (key === "bankAccountDetails" && user[key]) {
            initialData[key] = {
              accountName: user[key].accountName || "",
              accountNumber: user[key].accountNumber || "",
              bank: user[key].bank || "",
            };
          } else if (key === "teachingAssignments" && user[key]?.length) {
            initialData[key] = [
              {
                section: user[key][0].section || "",
                className: user[key][0].className || "",
                subclasses: user[key][0].subclasses?.join(",") || "",
                academicYear: user[key][0].academicYear || "",
              },
            ];
          } else {
            initialData[key] = user[key] || initialData[key];
          }
        });
      } else {
        console.warn("User not found for ID:", selectedUser);
      }
    }

    return initialData;
  };

  const [formData, setFormData] = useState(getInitialFormData(role));
  const [profilePicture, setProfilePicture] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    setFormData(getInitialFormData(role));
  }, [role, selectedUser]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePicture") {
      setProfilePicture(files[0]);
    } else if (name.includes("currentClassLevel") || name.includes("boardingDetails") || name.includes("bankAccountDetails")) {
      const [parent, child] = name.split(".");
      setFormData((prevData) => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: value,
        },
      }));
    } else if (name.includes("guardians") || name.includes("teachingAssignments")) {
      const [parent, index, child] = name.split(/\.|\[|\]/).filter(Boolean);
      setFormData((prevData) => {
        const updatedArray = [...(prevData[parent] || [{}])];
        updatedArray[0] = { ...updatedArray[0], [child]: value };
        return { ...prevData, [parent]: updatedArray };
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate selectedUser for updates
    if (selectedUser && !validateObjectId(selectedUser)) {
      setError("Invalid user ID format");
      setLoading(false);
      return;
    }

    // Remove required attributes for updates
    if (selectedUser) {
      formRef.current.querySelectorAll("[required]").forEach((field) => {
        field.removeAttribute("required");
      });
    }

    // Validate profile picture for new users
    if (!selectedUser && !profilePicture) {
      setError("Profile picture is required");
      setLoading(false);
      return;
    }

    // Validate boardingDetails for Boarder students
    if (role === "student" && formData.boardingStatus === "Boarder" && (!formData.boardingDetails?.hall || !formData.boardingDetails?.roomNumber)) {
      setError("Boarding Hall and Room Number are required for Boarder students");
      setLoading(false);
      return;
    }

    try {
      const formDataToSubmit = new FormData();

      // Append form fields
      Object.keys(formData).forEach((key) => {
        if (key === "currentClassLevel" && formData[key]) {
          formDataToSubmit.append("currentClassLevel[section]", formData[key].section || "");
          formDataToSubmit.append("currentClassLevel[className]", formData[key].className || "");
          formDataToSubmit.append("currentClassLevel[subclass]", formData[key].subclass || "");
        } else if (key === "boardingDetails" && formData[key] && formData.boardingStatus === "Boarder") {
          formDataToSubmit.append("boardingDetails[hall]", formData[key].hall || "");
          formDataToSubmit.append("boardingDetails[roomNumber]", formData[key].roomNumber || "");
          formDataToSubmit.append("boardingDetails[bedNumber]", formData[key].bedNumber || "");
          formDataToSubmit.append("boardingDetails[houseMaster]", formData[key].houseMaster || "");
        } else if (key === "guardians" && formData[key]?.length) {
          formDataToSubmit.append("guardians[0][name]", formData[key][0].name || "");
          formDataToSubmit.append("guardians[0][relationship]", formData[key][0].relationship || "");
          formDataToSubmit.append("guardians[0][phone]", formData[key][0].phone || "");
          formDataToSubmit.append("guardians[0][email]", formData[key][0].email || "");
          formDataToSubmit.append("guardians[0][address]", formData[key][0].address || "");
        } else if (key === "bankAccountDetails" && formData[key]) {
          formDataToSubmit.append("bankAccountDetails[accountName]", formData[key].accountName || "");
          formDataToSubmit.append("bankAccountDetails[accountNumber]", formData[key].accountNumber || "");
          formDataToSubmit.append("bankAccountDetails[bank]", formData[key].bank || "");
        } else if (key === "teachingAssignments" && formData[key]?.length && formData[key][0].section) {
          formDataToSubmit.append("teachingAssignments[0][section]", formData[key][0].section || "");
          formDataToSubmit.append("teachingAssignments[0][className]", formData[key][0].className || "");
          formDataToSubmit.append("teachingAssignments[0][subclasses]", formData[key][0].subclasses || "");
          formDataToSubmit.append("teachingAssignments[0][academicYear]", formData[key][0].academicYear || "");
        } else if (!selectedUser || (formData[key] && formData[key] !== "")) {
          formDataToSubmit.append(key, formData[key]);
        }
      });

      // Append profile picture
      if (profilePicture) {
        formDataToSubmit.append("profilePicture", profilePicture);
      }

      // Determine endpoint
      let endpoint;
      if (selectedUser && validateObjectId(selectedUser)) {
        endpoint = role === "student" ? `/api/students/${selectedUser}/update/admin` : `/api/teachers/teacher/${selectedUser}/update`;
      } else {
        endpoint = role === "student" ? endpoints.CREATE_STUDENT : role === "teacher" ? endpoints.CREATE_TEACHER : endpoints.CREATE_ADMIN;
      }

      const response = await callApi(endpoint, selectedUser ? "PATCH" : "POST", formDataToSubmit, {
        "Content-Type": "multipart/form-data",
      });

      if (response && response.data) {
        dispatch(selectedUser ? updateUser({ id: selectedUser, user: response.data, role }) : addUser({ user: response.data, role }));
        setModalMessage(`${response.data.firstName} ${response.data.lastName} has been successfully ${selectedUser ? "updated" : "registered"}`);
        setFormData(getInitialFormData(role));
        setProfilePicture(null);
      } else {
        setModalMessage(response?.data?.message || "An error occurred");
      }

      setModalOpen(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.response?.data?.message || "Failed to submit the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    formRef,
    formData,
    error,
    loading,
    handleChange,
    handleSubmit,
    roleFields,
    profilePicture,
    modalOpen,
    modalMessage,
    setModalOpen,
  };
};

export default useSignUp;