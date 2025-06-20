import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import useApi from "../../hooks/useApi";
import { endpoints } from "../../utils/constants";
import { updateUser, addUser } from "../../reduxStore/slices/adminDataSlice";

const validateObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const useSignUp = ({ role, selectedUser }) => {
  const [error, setError] = useState("");
  const { data, error: submitError, callApi } = useApi();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Access Redux state
  const users = useSelector((state) => state.adminData?.usersData || { students: [], teachers: [], admins: [] });
  const classLevels = useSelector((state) => state.adminData?.classLevels || []);
  const subjects = useSelector((state) => state.adminData?.subjects || []);

  console.log(classLevels);
  useEffect(() => {
    console.log("Redux state - users:", users, "classLevels:", classLevels, "subjects:", subjects);
  }, [users, classLevels, subjects]);

  const [classLevelOptions, setClassLevelOptions] = useState({
    sections: [],
    classNames: [],
    subclasses: [],
  });

  // Map subjects to { value: _id, label: name } for select options
  const [subjectOptions, setSubjectOptions] = useState([]);

  useEffect(() => {
    setSubjectOptions(subjects.map((s) => ({ value: s._id, label: s.name })));
  }, [subjects]);

  const getClassLevelOptions = (formData = {}, parentKey = "currentClassLevel") => {
    const sections = [...new Set(classLevels.map((cl) => cl.section))];
    const getClassNames = (section) =>
      classLevels
        .filter((cl) => cl.section === section)
        .map((cl) => cl.name);
    const getSubclasses = (section, className) =>
      classLevels
        .find((cl) => cl.section === section && cl.name === className)
        ?.subclasses.map((sc) => sc.letter) || [];

    const selectedSection =
      parentKey === "currentClassLevel"
        ? formData.currentClassLevel?.section || sections[0] || ""
        : formData.teachingAssignments?.[0]?.section || sections[0] || "";
    const selectedClassName =
      parentKey === "currentClassLevel"
        ? formData.currentClassLevel?.className || getClassNames(selectedSection)[0] || ""
        : formData.teachingAssignments?.[0]?.className || getClassNames(selectedSection)[0] || "";

    return {
      sections,
      classNames: getClassNames(selectedSection),
      subclasses: getSubclasses(selectedSection, selectedClassName),
    };
  };

  useEffect(() => {
    console.log("selectedUser:", selectedUser);
    if (selectedUser && !validateObjectId(selectedUser)) {
      console.warn("Invalid selectedUser ID format:", selectedUser);
      setError("Invalid user ID format");
    }
  }, [selectedUser]);

  const [formData, setFormData] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const formRef = useRef(null);

  const getInitialFormData = (role) => {
    const initialData = {};
    if (!roleFields[role]) {
      console.error("Invalid role:", role);
      return initialData;
    }

    roleFields[role].forEach((field) => {
      if (
        field.name.includes("currentClassLevel") ||
        field.name.includes("guardians") ||
        field.name.includes("bankAccountDetails") ||
        field.name.includes("teachingAssignments")
      ) {
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

    if (role === "student") {
      const { sections, classNames, subclasses } = getClassLevelOptions(initialData, "currentClassLevel");
      initialData.currentClassLevel = {
        section: sections[0] || "",
        className: classNames[0] || "",
        subclass: subclasses[0] || "",
      };
      initialData.boardingStatus = "Day Student";
    } else if (role === "teacher") {
      const { sections, classNames, subclasses } = getClassLevelOptions(initialData, "teachingAssignments");
      initialData.teachingAssignments = [
        {
          section: sections[0] || "",
          className: classNames[0] || "",
          subclasses: [subclasses[0]] || [""], // Backend expects an array
          subject: subjects[0]?._id || "", // Initialize with first subject _id
        },
      ];
    }

    if (selectedUser && users && validateObjectId(selectedUser)) {
      const user =
        role === "student"
          ? users.students?.find((u) => u._id === selectedUser)
          : role === "teacher"
          ? users.teachers?.find((u) => u._id === selectedUser)
          : users.admins?.find((u) => u._id === selectedUser);

      if (user) {
        Object.keys(initialData).forEach((key) => {
          if (key === "currentClassLevel" && user[key]) {
            initialData[key] = {
              section: user[key].section || initialData.currentClassLevel.section,
              className: user[key].className || initialData.currentClassLevel.className,
              subclass: user[key].subclass || initialData.currentClassLevel.subclass,
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
                section: user[key][0].section || initialData.teachingAssignments[0].section,
                className: user[key][0].className || initialData.teachingAssignments[0].className,
                subclasses: user[key][0].subclasses || initialData.teachingAssignments[0].subclasses,
                subject: user[key][0].subject?._id || initialData.teachingAssignments[0].subject, // Use subject _id
              },
            ];
          } else {
            initialData[key] = user[key] || initialData[key];
          }
        });
      }
    }

    return initialData;
  };

  useEffect(() => {
    const initialFormData = getInitialFormData(role);
    setFormData(initialFormData);
    setClassLevelOptions(
      role === "student"
        ? getClassLevelOptions(initialFormData, "currentClassLevel")
        : getClassLevelOptions(initialFormData, "teachingAssignments")
    );
  }, [role, selectedUser, classLevels, subjects]);

  useEffect(() => {
    if (formData) {
      setClassLevelOptions(
        role === "student"
          ? getClassLevelOptions(formData, "currentClassLevel")
          : getClassLevelOptions(formData, "teachingAssignments")
      );
    }
  }, [formData]);

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
      {
        label: "Class Section",
        name: "currentClassLevel.section",
        type: "select",
        required: !selectedUser,
        options: classLevelOptions.sections,
      },
      {
        label: "Class Name",
        name: "currentClassLevel.className",
        type: "select",
        required: !selectedUser,
        options: classLevelOptions.classNames,
      },
      {
        label: "Subclass",
        name: "currentClassLevel.subclass",
        type: "select",
        required: !selectedUser,
        options: classLevelOptions.subclasses,
      },
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
      {
        label: "Qualification",
        name: "qualification",
        type: "select",
        required: !selectedUser,
        options: ["SSCE", "OND", "HND", "BSc", "MBA", "BTech", "MSc", "PhD", "Other"],
      },
      { label: "Phone Number", name: "phoneNumber", type: "tel", required: !selectedUser },
      { label: "Tribe", name: "tribe", type: "text", required: !selectedUser },
      {
        label: "Religion",
        name: "religion",
        type: "select",
        required: !selectedUser,
        options: ["Christianity", "Islam", "Hinduism", "Buddhism", "Atheism", "Other"],
      },
      {
        label: "Teaching Section",
        name: "teachingAssignments[0].section",
        type: "select",
        required: !selectedUser,
        options: classLevelOptions.sections,
      },
      {
        label: "Teaching Class Name",
        name: "teachingAssignments[0].className",
        type: "select",
        required: !selectedUser,
        options: classLevelOptions.classNames,
      },
      {
        label: "Teaching Subclasses",
        name: "teachingAssignments[0].subclasses",
        type: "select",
        required: !selectedUser,
        options: classLevelOptions.subclasses,
      },
      {
        label: "Subject",
        name: "teachingAssignments[0].subject",
        type: "select",
        required: !selectedUser,
        options: subjectOptions.map((s) => s.label), // Display names in UI
      },
      { label: "Bank Account Name", name: "bankAccountDetails.accountName", type: "text", required: !selectedUser },
      { label: "Bank Account Number", name: "bankAccountDetails.accountNumber", type: "text", required: !selectedUser },
      { label: "Bank Name", name: "bankAccountDetails.bank", type: "text", required: !selectedUser },
      { label: "LinkedIn Profile", name: "linkedInProfile", type: "text", required: false },
    ].filter(Boolean),
    admin: [
      { label: "First Name", name: "firstName", type: "text", required: !selectedUser },
      { label: "Last Name", name: "lastName", type: "text", required: !selectedUser },
      { label: "Email", name: "email", type: "email", required: !selectedUser },
      { label: "Profile Picture", name: "profilePicture", type: "file", required: !selectedUser },
    ].filter(Boolean),
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePicture") {
      setProfilePicture(files[0]);
    } else if (name.includes("currentClassLevel")) {
      const [, child] = name.split(".");
      setFormData((prevData) => {
        const newClassLevel = { ...prevData.currentClassLevel, [child]: value };
        if (child === "section") {
          const { classNames, subclasses } = getClassLevelOptions({ currentClassLevel: newClassLevel }, "currentClassLevel");
          newClassLevel.className = classNames[0] || "";
          newClassLevel.subclass = subclasses[0] || "";
        } else if (child === "className") {
          const { subclasses } = getClassLevelOptions({ currentClassLevel: newClassLevel }, "currentClassLevel");
          newClassLevel.subclass = subclasses[0] || "";
        }
        return { ...prevData, currentClassLevel: newClassLevel };
      });
    } else if (name.includes("teachingAssignments")) {
      const [, index, child] = name.split(/\.|\[|\]/).filter(Boolean);
      setFormData((prevData) => {
        const updatedAssignments = [...(prevData.teachingAssignments || [{}])];
        if (child === "subclasses") {
          updatedAssignments[0] = { ...updatedAssignments[0], [child]: [value] }; // Store as array
        } else if (child === "subject") {
          const selectedSubject = subjectOptions.find((s) => s.label === value);
          updatedAssignments[0] = { ...updatedAssignments[0], [child]: selectedSubject?.value || "" }; // Store subject _id
        } else {
          updatedAssignments[0] = { ...updatedAssignments[0], [child]: value };
        }
        if (child === "section") {
          const { classNames, subclasses } = getClassLevelOptions(
            { teachingAssignments: [{ ...updatedAssignments[0], section: value }] },
            "teachingAssignments"
          );
          updatedAssignments[0].className = classNames[0] || "";
          updatedAssignments[0].subclasses = [subclasses[0]] || [""];
        } else if (child === "className") {
          const { subclasses } = getClassLevelOptions(
            { teachingAssignments: [{ ...updatedAssignments[0], className: value }] },
            "teachingAssignments"
          );
          updatedAssignments[0].subclasses = [subclasses[0]] || [""];
        }
        return { ...prevData, teachingAssignments: updatedAssignments };
      });
    } else if (name.includes("boardingDetails")) {
      const [, child] = name.split(".");
      setFormData((prevData) => ({
        ...prevData,
        boardingDetails: {
          ...prevData.boardingDetails,
          [child]: value,
        },
      }));
    } else if (name.includes("guardians")) {
      // Fix: Properly handle guardians[0].field
      const [, index, child] = name.split(/\.|\[|\]/).filter(Boolean); // e.g., "guardians[0].name" -> ["guardians", "0", "name"]
      setFormData((prevData) => {
        const updatedGuardians = [...(prevData.guardians || [{}])];
        updatedGuardians[0] = { ...updatedGuardians[0], [child]: value };
        return { ...prevData, guardians: updatedGuardians };
      });
    } else if (name.includes("bankAccountDetails")) {
      const [, child] = name.split(".");
      setFormData((prevData) => ({
        ...prevData,
        bankAccountDetails: {
          ...prevData.bankAccountDetails,
          [child]: value,
        },
      }));
    } else if (name === "boardingStatus") {
      setFormData((prevData) => ({
        ...prevData,
        boardingStatus: value,
        boardingDetails: value === "Boarder" ? prevData.boardingDetails || {} : undefined,
      }));
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

    if (selectedUser && !validateObjectId(selectedUser)) {
      setError("Invalid user ID format");
      setLoading(false);
      return;
    }

    if (selectedUser) {
      formRef.current.querySelectorAll("[required]").forEach((field) => {
        field.removeAttribute("required");
      });
    }

    if (!selectedUser) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.gender) {
        setError("First name, last name, email, and gender are required");
        setLoading(false);
        return;
      }
      if (role === "student") {
        if (!formData.currentClassLevel?.section || !formData.currentClassLevel?.className || !formData.currentClassLevel?.subclass) {
          setError("Class level section, class name, and subclass are required");
          setLoading(false);
          return;
        }
        if (!formData.guardians?.[0]?.name || !formData.guardians?.[0]?.relationship || !formData.guardians?.[0]?.phone) {
          setError("Guardian name, relationship, and phone are required");
          setLoading(false);
          return;
        }
        if (!["Boarder", "Day Student"].includes(formData.boardingStatus)) {
          setError("Boarding status must be 'Boarder' or 'Day Student'");
          setLoading(false);
          return;
        }
        if (formData.boardingStatus === "Boarder" && (!formData.boardingDetails?.hall || !formData.boardingDetails?.roomNumber)) {
          setError("Boarding Hall and Room Number are required for Boarder students");
          setLoading(false);
          return;
        }
      } else if (role === "teacher") {
        if (
          !formData.NIN ||
          !formData.address ||
          !formData.qualification ||
          !formData.phoneNumber ||
          !formData.tribe ||
          !formData.religion ||
          !formData.teachingAssignments?.[0]?.subject ||
          !formData.bankAccountDetails?.accountName ||
          !formData.bankAccountDetails?.accountNumber ||
          !formData.bankAccountDetails?.bank ||
          !formData.teachingAssignments?.[0]?.section ||
          !formData.teachingAssignments?.[0]?.className ||
          !formData.teachingAssignments?.[0]?.subclasses?.length
        ) {
          setError("All required teacher fields must be filled");
          setLoading(false);
          return;
        }
        if (!/^\d{11}$/.test(formData.NIN)) {
          setError("NIN must be 11 digits");
          setLoading(false);
          return;
        }
        if (!/^\d{10}$/.test(formData.bankAccountDetails.accountNumber)) {
          setError("Bank account number must be 10 digits");
          setLoading(false);
          return;
        }
        if (!formData.teachingAssignments[0].subclasses.every((sub) => /^[A-Z]$/.test(sub))) {
          setError("Subclasses must be single uppercase letters");
          setLoading(false);
          return;
        }
        if (!validateObjectId(formData.teachingAssignments[0].subject)) {
          setError("Invalid subject ID");
          setLoading(false);
          return;
        }
      }
      if (!profilePicture) {
        setError("Profile picture is required");
        setLoading(false);
        return;
      }
    }

    try {
      const formDataToSubmit = new FormData();

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
          formDataToSubmit.append("teachingAssignments[0][subclasses]", JSON.stringify(formData[key][0].subclasses || [])); // Send as JSON array
          formDataToSubmit.append("subject", formData[key][0].subject || ""); // Send subject _id directly
        } else if (!selectedUser || (formData[key] && formData[key] !== "" && key !== "boardingDetails")) {
          formDataToSubmit.append(key, formData[key]);
        }
      });

      if (profilePicture) {
        formDataToSubmit.append("profilePicture", profilePicture);
      }

      for (let [key, value] of formDataToSubmit.entries()) {
        console.log(`${key}: ${value}`);
      }

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