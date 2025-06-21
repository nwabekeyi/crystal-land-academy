// src/pages/useClassManagement.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { endpoints } from '../../../../utils/constants';
import { setClassLevels, selectAdminDataState } from '../../../../reduxStore/slices/adminDataSlice';
import useApi from '../../../../hooks/useApi';
import CustomIconButton from '../../components/customIconButton';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const useClassManagement = () => {
  const dispatch = useDispatch();
  const { classLevels, academicYears } = useSelector(selectAdminDataState);
  const [sortBy, setSortBy] = useState('section');
  const [sortDirection, setSortDirection] = useState('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({
    section: 'Primary',
    name: '',
    feesPerTerm: [{ termName: '1st Term', amount: 0, description: '' }],
    description: '',
    academicYear: '',
    subclasses: [{ letter: 'A', feesPerTerm: [{ termName: '1st Term', amount: 0, description: '' }], timetables: [] }],
  });
  const [error, setError] = useState('');

  const {
    data: classData,
    loading: loadingClasses,
    error: errorClasses,
    callApi: fetchClasses,
  } = useApi();

  const { callApi: submitClass, loading: loadingSubmit, error: errorSubmit } = useApi();

  // Fetch class levels on mount
  useEffect(() => {
    fetchClasses(endpoints.CLASS_LEVEL, 'GET');
  }, [fetchClasses]);

  // Update Redux store when class data is fetched
  useEffect(() => {
    if (classData && Array.isArray(classData.data)) {
      console.log('Fetched classLevels:', classData.data); // Debug log
      dispatch(setClassLevels(classData.data));
    }
  }, [classData, dispatch]);

  // Handle sorting (global fallback)
  const handleSortChange = useCallback((columnId) => {
    if (sortBy === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnId);
      setSortDirection('asc');
    }
  }, [sortBy, sortDirection]);

  // Handle modal open
  const openModal = useCallback((mode, classItem = null) => {
    setModalMode(mode);
    setSelectedClass(classItem);
    if (mode === 'create') {
      setFormData({
        section: 'Primary',
        name: '',
        feesPerTerm: [{ termName: '1st Term', amount: 0, description: '' }],
        description: '',
        academicYear: academicYears.find(year => year.isCurrent)?._id || '',
        subclasses: [{ letter: 'A', feesPerTerm: [{ termName: '1st Term', amount: 0, description: '' }], timetables: [] }],
      });
    } else if (classItem) {
      setFormData({
        section: classItem.section || 'Primary',
        name: classItem.name || '',
        feesPerTerm: classItem.feesPerTerm || [{ termName: '1st Term', amount: 0, description: '' }],
        description: classItem.description || '',
        academicYear: classItem.academicYear?._id || '',
        subclasses: classItem.subclasses || [{ letter: 'A', feesPerTerm: classItem.feesPerTerm || [{ termName: '1st Term', amount: 0, description: '' }], timetables: [] }],
      });
    }
    setModalOpen(true);
  }, [academicYears]);

  // Handle form input changes
  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // Handle fees per term changes (class level)
  const handleFeesChange = useCallback((index, field, value) => {
    setFormData(prev => {
      const updatedFees = [...prev.feesPerTerm];
      updatedFees[index] = { ...updatedFees[index], [field]: value };
      return { ...prev, feesPerTerm: updatedFees };
    });
  }, []);

  // Handle subclass fees per term changes
  const handleSubclassFeesChange = useCallback((subIndex, feeIndex, field, value) => {
    setFormData(prev => {
      const updatedSubclasses = [...prev.subclasses];
      const updatedFees = [...updatedSubclasses[subIndex].feesPerTerm];
      updatedFees[feeIndex] = { ...updatedFees[feeIndex], [field]: value };
      updatedSubclasses[subIndex] = { ...updatedSubclasses[subIndex], feesPerTerm: updatedFees };
      return { ...prev, subclasses: updatedSubclasses };
    });
  }, []);

  // Add a new term fee (class level)
  const addTermFee = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      feesPerTerm: [
        ...prev.feesPerTerm,
        { termName: `${prev.feesPerTerm.length + 1} Term`, amount: 0, description: '' },
      ],
    }));
  }, []);

  // Remove a term fee (class level)
  const removeTermFee = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      feesPerTerm: prev.feesPerTerm.filter((_, i) => i !== index),
    }));
  }, []);

  // Add a new term fee (subclass level)
  const addSubclassTermFee = useCallback((subIndex) => {
    setFormData(prev => {
      const updatedSubclasses = [...prev.subclasses];
      updatedSubclasses[subIndex] = {
        ...updatedSubclasses[subIndex],
        feesPerTerm: [
          ...updatedSubclasses[subIndex].feesPerTerm,
          { termName: `${updatedSubclasses[subIndex].feesPerTerm.length + 1} Term`, amount: 0, description: '' },
        ],
      };
      return { ...prev, subclasses: updatedSubclasses };
    });
  }, []);

  // Remove a term fee (subclass level)
  const removeSubclassTermFee = useCallback((subIndex, feeIndex) => {
    setFormData(prev => {
      const updatedSubclasses = [...prev.subclasses];
      updatedSubclasses[subIndex] = {
        ...updatedSubclasses[subIndex],
        feesPerTerm: updatedSubclasses[subIndex].feesPerTerm.filter((_, i) => i !== feeIndex),
      };
      return { ...prev, subclasses: updatedSubclasses };
    });
  }, []);

  // Handle timetable changes
  const handleTimetableChange = useCallback((index, field, value, subclassLetter) => {
    setFormData(prev => {
      const updatedSubclasses = [...prev.subclasses];
      const subclassIndex = updatedSubclasses.findIndex(sub => sub.letter === subclassLetter);
      if (subclassIndex === -1) return prev;
      const updatedTimetables = [...updatedSubclasses[subclassIndex].timetables];
      updatedTimetables[index] = { ...updatedTimetables[index], [field]: value };
      updatedSubclasses[subclassIndex] = { ...updatedSubclasses[subclassIndex], timetables: updatedTimetables };
      return { ...prev, subclasses: updatedSubclasses };
    });
  }, []);

  // Add a new timetable entry
  const addTimetableEntry = useCallback((subclassLetter) => {
    setFormData(prev => {
      const updatedSubclasses = [...prev.subclasses];
      const subclassIndex = updatedSubclasses.findIndex(sub => sub.letter === subclassLetter);
      if (subclassIndex === -1) return prev;
      updatedSubclasses[subclassIndex] = {
        ...updatedSubclasses[subIndex],
        timetables: [
          ...updatedSubclasses[subIndex].timetables,
          { day: 'Monday', startTime: '08:00', endTime: '09:00', subject: '' },
        ],
      };
      return { ...prev, subclasses: updatedSubclasses };
    });
  }, []);

  // Remove a timetable entry
  const removeTimetableEntry = useCallback((index, subclassLetter) => {
    setFormData(prev => {
      const updatedSubclasses = [...prev.subclasses];
      const subclassIndex = updatedSubclasses.findIndex(sub => sub.letter === subclassLetter);
      if (subclassIndex === -1) return prev;
      updatedSubclasses[subclassIndex] = {
        ...updatedSubclasses[subIndex],
        timetables: updatedSubclasses[subIndex].timetables.filter((_, i) => i !== index),
      };
      return { ...prev, subclasses: updatedSubclasses };
    });
  }, []);

  // Validate form data
  const validateForm = useCallback(() => {
    if (!formData.section) return 'Section is required';
    if (!formData.name) return 'Class name is required';
    if (!formData.academicYear) return 'Academic year is required';
    if (!formData.feesPerTerm.every(fee => fee.termName && fee.amount >= 0)) return 'All class fees must have a term name and a valid amount';
    if (!formData.subclasses.every(sub => sub.feesPerTerm.every(fee => fee.termName && fee.amount >= 0))) return 'All subclass fees must have a term name and a valid amount';
    if (formData.subclasses.some(sub => sub.timetables.some(t => !t.day || !t.startTime || !t.endTime || !t.subject))) return 'All timetable entries must have valid fields';
    return '';
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      section: formData.section,
      name: formData.name,
      description: formData.description,
      academicYear: formData.academicYear,
      feesPerTerm: formData.feesPerTerm,
      subclasses: formData.subclasses.map(sub => ({
        letter: sub.letter,
        feesPerTerm: sub.feesPerTerm,
        timetables: sub.timetables,
      })),
    };

    try {
      if (modalMode === 'create') {
        await submitClass(endpoints.CLASS_LEVEL, 'POST', payload);
      } else if (modalMode === 'edit') {
        await submitClass(`${endpoints.CLASS_LEVEL}/${selectedClass._id}`, 'PATCH', payload);
      } else if (modalMode === 'delete') {
        await submitClass(`${endpoints.CLASS_LEVEL}/${selectedClass._id}`, 'DELETE');
      }
      fetchClasses(endpoints.CLASS_LEVEL, 'GET');
      setModalOpen(false);
      setError('');
    } catch (err) {
      setError(errorSubmit || 'Failed to process request');
    }
  }, [modalMode, formData, selectedClass, submitClass, fetchClasses, errorSubmit, validateForm]);

  // Format class name for display
  const formatClassName = (name) => {
    const date = new Date(name);
    if (!isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(name)) {
      return date.toLocaleDateString(navigator.language || 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return name;
  };

  // Memoized table data with displayName
  const tableData = useMemo(
    () =>
      Array.isArray(classLevels)
        ? classLevels.map(row => ({
            ...row,
            displayName: formatClassName(row.name),
          }))
        : [],
    [classLevels]
  );

  // Group classes by academic year and section
  const groupedByAcademicYearAndSection = useMemo(() => {
    const grouped = {};
    academicYears.forEach(year => {
      grouped[year._id] = {
        Primary: tableData.filter(cls => 
          cls.academicYear?._id === year._id && 
          (cls.section?.toLowerCase() === 'primary' || cls.section?.toLowerCase() === 'Primary')
        ),
        Secondary: tableData.filter(cls => 
          cls.academicYear?._id === year._id && 
          (cls.section?.toLowerCase() === 'secondary' || cls.section?.toLowerCase() === 'Secondary')
        ),
      };
      console.log(`Grouped data for year ${year._id}:`, grouped[year._id]); // Debug log
    });
    return grouped;
  }, [tableData, academicYears]);

  // Table columns
  const columns = useMemo(
    () => [
      { id: 'sn', label: 'S/N', width: 90 },
      { id: 'section', label: 'Section', flex: 1 },
      {
        id: 'displayName',
        label: 'Class Name',
        flex: 1,
        renderCell: row => row.displayName,
      },
      {
        id: 'studentsCount',
        label: 'Students',
        flex: 1,
        renderCell: row => row.students?.length || 0,
      },
      {
        id: 'academicYear',
        label: 'Academic Year',
        flex: 1,
        renderCell: row => row.academicYear?.name || 'N/A',
      },
      {
        id: 'actions',
        label: 'Actions',
        flex: 1,
        renderCell: row => (
          <>
            <CustomIconButton
              icon={<FaEye />}
              title="View Class"
              onClick={() => openModal('view', row)}
              sx={{ mx: 0.5 }}
            />
            <CustomIconButton
              icon={<FaEdit />}
              title="Edit Class"
              onClick={() => openModal('edit', row)}
              sx={{ mx: 0.5 }}
            />
            <CustomIconButton
              icon={<FaTrash />}
              title="Delete Class"
              onClick={() => openModal('delete', row)}
              sx={{ mx: 0.5 }}
            />
          </>
        ),
      },
    ],
    [openModal]
  );

  // Table props
  const tableProps = {
    columns,
    tableHeader: 'Class Management',
    data: tableData,
    classLevels: groupedByAcademicYearAndSection,
    sortBy,
    sortDirection,
    onSortChange: handleSortChange,
    onRowClick: row => openModal('view', row),
    hiddenColumnsSmallScreen: ['description'],
    hiddenColumnsTabScreen: [],
    academicYears,
  };

  return {
    tableProps,
    modalOpen,
    setModalOpen,
    modalMode,
    setModalMode,
    formData,
    setFormData,
    handleFormChange,
    handleFeesChange,
    handleSubclassFeesChange,
    addTermFee,
    removeTermFee,
    addSubclassTermFee,
    removeSubclassTermFee,
    handleTimetableChange,
    addTimetableEntry,
    removeTimetableEntry,
    handleSubmit,
    error,
    loadingClasses,
    loadingSubmit,
    openModal,
    academicYears,
    selectedClass,
  };
};

export default useClassManagement;