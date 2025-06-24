import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { endpoints } from '../../../../utils/constants';
import { selectAdminDataState, setSubjects } from '../../../../reduxStore/slices/adminDataSlice';
import useApi from '../../../../hooks/useApi';
import CustomIconButton from '../../components/customIconButton';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const useSubjectManagement = () => {
  const dispatch = useDispatch();
  const { subjects, academicYears, classLevels, usersData } = useSelector(selectAdminDataState);
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    academicYear: '',
    classLevels: [], // Array of { classLevel: string, teachers: string[] }
  });
  const [error, setError] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [classLevelsModalOpen, setClassLevelsModalOpen] = useState(false);

  const {
    data: subjectData,
    loading: loadingSubjects,
    error: errorSubjects,
    callApi: fetchSubjects,
  } = useApi();

  const { callApi: submitSubject, loading: loadingSubmit, error: errorSubmit } = useApi();

  // Fetch subjects on mount
  useEffect(() => {
    fetchSubjects(endpoints.SUBJECT, 'GET');
  }, [fetchSubjects]);

  // Update Redux store when subject data is fetched
  useEffect(() => {
    if (subjectData && Array.isArray(subjectData.data)) {
      dispatch(setSubjects(subjectData.data));
    }
  }, [subjectData, dispatch]);

  // Handle sorting
  const handleSortChange = useCallback((columnId) => {
    if (sortBy === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnId);
      setSortDirection('asc');
    }
  }, [sortBy, sortDirection]);

  // Handle modal open
  const openModal = useCallback((mode, subjectItem = null) => {
    setModalMode(mode);
    setSelectedSubject(subjectItem);
    if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        academicYear: academicYears.find(year => year.isCurrent)?._id || '',
        classLevels: [],
      });
    } else if (subjectItem) {
      setFormData({
        name: subjectItem.name || '',
        description: subjectItem.description || '',
        academicYear: subjectItem.academicYear?._id || '',
        classLevels: subjectItem.classLevels?.map(cl => ({
          classLevel: cl.classLevel?._id || cl.classLevel,
          teachers: cl.teachers?.map(t => t._id) || [],
        })) || [],
      });
    }
    setModalOpen(true);
  }, [academicYears]);

  // Open delete confirmation dialog
  const openDeleteConfirm = useCallback((subjectItem) => {
    setSubjectToDelete(subjectItem);
    setDeleteConfirmOpen(true);
  }, []);

  // Close delete confirmation dialog
  const closeDeleteConfirm = useCallback(() => {
    setSubjectToDelete(null);
    setDeleteConfirmOpen(false);
  }, []);

  // Handle delete after confirmation
  const handleDelete = useCallback(async () => {
    if (!subjectToDelete) return;
    try {
      await submitSubject(`${endpoints.SUBJECT}/${subjectToDelete._id}`, 'DELETE');
      fetchSubjects(endpoints.SUBJECT, 'GET');
      setError('');
    } catch (err) {
      setError(errorSubmit || 'Failed to delete subject');
    } finally {
      closeDeleteConfirm();
    }
  }, [subjectToDelete, submitSubject, fetchSubjects, errorSubmit, closeDeleteConfirm]);

  // Handle form input changes
  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // Handle classLevels and teachers change
  const handleClassLevelChange = useCallback((index, field, value) => {
    setFormData(prev => {
      const newClassLevels = [...prev.classLevels];
      newClassLevels[index] = { ...newClassLevels[index], [field]: value };
      return { ...prev, classLevels: newClassLevels };
    });
  }, []);

  // Add a new class level entry
  const addClassLevel = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      classLevels: [...prev.classLevels, { classLevel: '', teachers: [] }],
    }));
  }, []);

  // Remove a class level entry
  const removeClassLevel = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      classLevels: prev.classLevels.filter((_, i) => i !== index),
    }));
  }, []);

  // Validate form data
  const validateForm = useCallback(() => {
    if (!formData.name) return 'Subject name is required';
    if (!formData.description) return 'Description is required';
    if (!formData.academicYear) return 'Academic year is required';
    if (formData.classLevels.length === 0) return 'At least one class level is required';
    for (const cl of formData.classLevels) {
      if (!cl.classLevel) return 'Class level is required for all entries';
    }
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
      name: formData.name,
      description: formData.description,
      academicYear: formData.academicYear,
      classLevels: formData.classLevels,
    };

    try {
      if (modalMode === 'create') {
        await submitSubject(`${endpoints.SUBJECT}/create`, 'POST', payload);
      } else if (modalMode === 'edit') {
        await submitSubject(`${endpoints.SUBJECT}/${selectedSubject._id}`, 'PATCH', payload);
      }
      fetchSubjects(endpoints.SUBJECT, 'GET');
      setModalOpen(false);
      setError('');
    } catch (err) {
      setError(errorSubmit || 'Failed to process request');
    }
  }, [modalMode, formData, selectedSubject, submitSubject, fetchSubjects, errorSubmit, validateForm]);

  // Memoized table data
  const tableData = useMemo(
    () =>
      Array.isArray(subjects)
        ? subjects.map(row => ({
            ...row,
            displayName: row.name,
          }))
        : [],
    [subjects]
  );

  // Group subjects by academic year
  const groupedByAcademicYear = useMemo(() => {
    const grouped = {};
    academicYears.forEach(year => {
      grouped[year._id] = tableData.filter(subject => subject.academicYear?._id === year._id);
    });
    return grouped;
  }, [tableData, academicYears]);

  // Table columns
  const columns = useMemo(
    () => [
      { id: 'sn', label: 'S/N', width: 90 },
      { id: 'displayName', label: 'Subject Name', flex: 1, renderCell: row => row.displayName },
      { id: 'description', label: 'Description', flex: 1 },
      {
        id: 'actions',
        label: 'Actions',
        flex: 1,
        renderCell: row => (
          <>
            <CustomIconButton
              icon={<FaEye />}
              title="View Subject"
              onClick={() => openModal('view', row)}
              sx={{ mx: 0.5 }}
            />
            <CustomIconButton
              icon={<FaEdit />}
              title="Edit Subject"
              onClick={() => openModal('edit', row)}
              sx={{ mx: 0.5 }}
            />
            <CustomIconButton
              icon={<FaTrash />}
              title="Delete Subject"
              onClick={() => openDeleteConfirm(row)}
              sx={{ mx: 0.5 }}
            />
          </>
        ),
      },
    ],
    [openModal, openDeleteConfirm]
  );

  // Table props
  const tableProps = {
    columns,
    tableHeader: 'Subject Management',
    data: tableData,
    subjects: groupedByAcademicYear,
    sortBy,
    sortDirection,
    onSortChange: handleSortChange,
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
    handleClassLevelChange,
    addClassLevel,
    removeClassLevel,
    handleSubmit,
    error,
    loadingSubjects,
    loadingSubmit,
    openModal,
    academicYears,
    classLevels,
    teachers: usersData.teachers || [],
    selectedSubject,
    deleteConfirmOpen,
    subjectToDelete,
    handleDelete,
    closeDeleteConfirm,
    classLevelsModalOpen,
    setClassLevelsModalOpen,
  };
};

export default useSubjectManagement;