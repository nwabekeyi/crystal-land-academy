import { useState, useCallback, useEffect } from 'react';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import useApi from '../../../../hooks/useApi';
import { endpoints } from '../../../../utils/constants';
import { Typography } from '@mui/material';
import { ActionButtons } from './financialModals';

const useFinancialManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tabIndex, setTabIndex] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [addExpenditureOpen, setAddExpenditureOpen] = useState(false);
  const [addRevenueOpen, setAddRevenueOpen] = useState(false);
  const [payFeesOpen, setPayFeesOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [classLevels, setClassLevels] = useState([]);
  const [terms, setTerms] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  // API hooks for fetching data
  const {
    loading: financialDataLoading,
    data: financialData,
    error: financialDataError,
    callApi: getFinancialData,
  } = useApi();

  const {
    loading: expenditureDataLoading,
    data: expenditureData,
    error: expenditureDataError,
    callApi: getExpenditureData,
  } = useApi();

  const {
    loading: otherRevenueDataLoading,
    data: otherRevenueData,
    error: otherRevenueDataError,
    callApi: getOtherRevenueData,
  } = useApi();

  const {
    loading: studentsLoading,
    data: studentsData,
    error: studentsError,
    callApi: getStudentsData,
  } = useApi();

  const {
    loading: classLevelsLoading,
    data: classLevelsData,
    error: classLevelsError,
    callApi: getClassLevelsData,
  } = useApi();

  const {
    loading: termsLoading,
    data: termsData,
    error: termsError,
    callApi: getTermsData,
  } = useApi();

  const {
    loading: academicYearsLoading,
    data: academicYearsData,
    error: academicYearsError,
    callApi: getAcademicYearsData,
  } = useApi();

  // Fetch data with pagination
  const fetchData = useCallback(async () => {
    try {
      const section = tabIndex === 0 ? 'Primary' : tabIndex === 1 ? 'Secondary' : null;
      const params = new URLSearchParams({
        page: (page + 1).toString(), // Backend expects 1-based page index
        limit: rowsPerPage.toString(),
        sortBy,
        sortDirection,
        ...(section && { section }),
      });

      if (tabIndex === 0 || tabIndex === 1) {
        const response = await getFinancialData(`${endpoints.PAYMENT}?${params.toString()}`);
        setTotalRecords(response?.data?.pagination?.totalRecords || 0);
      } else if (tabIndex === 2) {
        const response = await getExpenditureData(`${endpoints.EXPENDITURES}?${params.toString()}`);
        setTotalRecords(response?.data?.pagination?.totalRecords || 0);
      } else if (tabIndex === 3) {
        const response = await getOtherRevenueData(`${endpoints.OTHER_REVENUES}?${params.toString()}`);
        setTotalRecords(response?.data?.pagination?.totalRecords || 0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [getFinancialData, getExpenditureData, getOtherRevenueData, page, rowsPerPage, sortBy, sortDirection, tabIndex]);

  // Fetch dropdown data
  const fetchDropdownData = useCallback(async () => {
    try {
      const [studentsRes, classLevelsRes, termsRes, academicYearsRes] = await Promise.all([
        getStudentsData(endpoints.STUDENTS),
        getClassLevelsData(endpoints.CLASS_LEVELS),
        getTermsData(endpoints.TERMS),
        getAcademicYearsData(endpoints.ACADEMIC_YEARS),
      ]);
      setStudents(studentsRes?.data?.data || []);
      setClassLevels(classLevelsRes?.data?.data || []);
      setTerms(termsRes?.data?.data || []);
      setAcademicYears(academicYearsRes?.data?.data || []);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  }, [getStudentsData, getClassLevelsData, getTermsData, getAcademicYearsData]);

  useEffect(() => {
    fetchData();
    fetchDropdownData();
  }, [fetchData, fetchDropdownData]);

  // Process API data for Fees
  const processFeesData = (data) => {
    const paymentRecords = Array.isArray(data) ? data : [];
    return paymentRecords.flatMap((record, recordIndex) =>
      (record.termPayments || []).flatMap((term) =>
        (term.payments || []).map((payment, paymentIndex) => ({
          id: record.id,
          sn: (page * rowsPerPage) + (recordIndex * term.payments.length) + paymentIndex + 1,
          studentName: record.studentId ? `${record.studentId.firstName} ${record.studentId.lastName}` : 'N/A',
          studentId: record.studentId?._id || 'N/A',
          class: `${record.classLevelId?.name || record.classLevelId || ''} ${term.subclassLetter || ''}`,
          classLevelId: record.classLevelId?._id || 'N/A',
          termName: term.termName,
          termId: term._id || 'N/A',
          feesPaid: payment.amountPaid,
          date: payment.datePaid ? new Date(payment.datePaid).toLocaleDateString() : 'N/A',
          academicYear: record.academicYear?.name || 'N/A',
          academicYearId: record.academicYear?._id || 'N/A',
          method: payment.method,
          reference: payment.reference,
        }))
      )
    );
  };

  // Process API data for Expenditures
  const processExpenditureData = (data) => {
    const records = Array.isArray(data) ? data : [];
    return records.map((record, index) => ({
      id: record.id,
      sn: (page * rowsPerPage) + index + 1,
      category: record.category,
      amount: record.amount,
      date: record.date ? new Date(record.date).toLocaleDateString() : 'N/A',
    })).sort((a, b) => a.sn - b.sn);
  };

  // Process API data for Other Revenues
  const processOtherRevenueData = (data) => {
    const records = Array.isArray(data) ? data : [];
    return records.map((record, index) => ({
      id: record.id,
      sn: (page * rowsPerPage) + index + 1,
      source: record.source,
      amount: record.amount,
      date: record.date ? new Date(record.date).toLocaleDateString() : 'N/A',
      description: record.description || 'N/A',
    })).sort((a, b) => a.sn - b.sn);
  };

  const feesDataFormatted = processFeesData(financialData?.data?.data || []);
  const expenditureDataFormatted = processExpenditureData(expenditureData?.data?.data || []);
  const otherRevenueDataFormatted = processOtherRevenueData(otherRevenueData?.data?.data || []);

  // Sort table columns
  const handleSortChange = useCallback((columnId) => {
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(columnId);
    setPage(0);
  }, [sortBy, sortDirection]);

  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleTabChange = useCallback((event, newTabIndex) => {
    setTabIndex(newTabIndex);
    setPage(0);
  }, []);

  // Handle edit action (for Expenditures and Other Revenues)
  const handleEdit = useCallback((record) => {
    setSelectedRecord(record);
    setEditDialogOpen(true);
  }, []);

  // Handle delete action (for Expenditures and Other Revenues)
  const handleDeleteOpen = useCallback((record) => {
    setSelectedRecord(record);
    setOpenDeleteModal(true);
  }, []);

  // Handle view details
  const handleViewDetails = useCallback((record) => {
    setSelectedRecord(record);
    setViewDetailsOpen(true);
  }, []);

  // Handle pay fees (for top-level button)
  const handlePayFeesOpen = useCallback((record = null) => {
    setSelectedRecord(record || { studentName: '', class: '', termName: '' });
    setPayFeesOpen(true);
  }, []);

  // Handle add expenditure
  const handleAddExpenditureOpen = useCallback(() => {
    setSelectedRecord({ category: '', amount: '', date: '' });
    setAddExpenditureOpen(true);
  }, []);

  // Handle add revenue
  const handleAddRevenueOpen = useCallback(() => {
    setSelectedRecord({ source: '', amount: '', date: '', description: '' });
    setAddRevenueOpen(true);
  }, []);

  // Handle delete confirmation
  const handleDeleteConfirm = useCallback(async () => {
    try {
      if (tabIndex === 2) {
        await getExpenditureData(`${endpoints.EXPENDITURES}/${selectedRecord.id}`, 'DELETE');
      } else if (tabIndex === 3) {
        await getOtherRevenueData(`${endpoints.OTHER_REVENUES}/${selectedRecord.id}`, 'DELETE');
      }
      fetchData();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
    setOpenDeleteModal(false);
    setSelectedRecord(null);
  }, [selectedRecord, tabIndex, getExpenditureData, getOtherRevenueData, fetchData]);

  // Handle edit save
  const handleEditSave = useCallback(
    async (updatedRecord) => {
      try {
        if (tabIndex === 2) {
          await getExpenditureData(`${endpoints.EXPENDITURES}/${selectedRecord.id}`, 'PUT', updatedRecord);
        } else if (tabIndex === 3) {
          await getOtherRevenueData(`${endpoints.OTHER_REVENUES}/${selectedRecord.id}`, 'PUT', {
            ...updatedRecord,
            source: updatedRecord.source || updatedRecord.category,
          });
        }
        fetchData();
      } catch (error) {
        console.error('Error updating record:', error);
      }
      setEditDialogOpen(false);
      setSelectedRecord(null);
    },
    [selectedRecord, tabIndex, getExpenditureData, getOtherRevenueData, fetchData]
  );

  // Handle add expenditure save
  const handleAddExpenditureSave = useCallback(
    async (newRecord) => {
      try {
        await getExpenditureData(endpoints.EXPENDITURES, 'POST', newRecord);
        fetchData();
      } catch (error) {
        console.error('Error adding expenditure:', error);
      }
      setAddExpenditureOpen(false);
      setSelectedRecord(null);
    },
    [getExpenditureData, fetchData]
  );

  // Handle add revenue save
  const handleAddRevenueSave = useCallback(
    async (newRecord) => {
      try {
        await getOtherRevenueData(endpoints.OTHER_REVENUES, 'POST', newRecord);
        fetchData();
      } catch (error) {
        console.error('Error adding revenue:', error);
      }
      setAddRevenueOpen(false);
      setSelectedRecord(null);
    },
    [getOtherRevenueData, fetchData]
  );

  // Handle pay fees save
  const handlePayFeesSave = useCallback(
    async (newPayment) => {
      try {
        const endpoint = endpoints.PAYMENT;
        const payload = {
          studentId: newPayment.studentId,
          classLevelId: newPayment.classLevelId,
          termId: newPayment.termId,
          academicYearId: newPayment.academicYearId,
          amountPaid: parseFloat(newPayment.amountPaid),
          datePaid: newPayment.datePaid,
          method: newPayment.method,
          reference: newPayment.reference,
          section: tabIndex === 0 ? 'Primary' : 'Secondary',
        };
        await getFinancialData(endpoint, 'POST', payload);
        fetchData();
      } catch (error) {
        console.error('Error processing payment:', error);
      }
      setPayFeesOpen(false);
      setSelectedRecord(null);
    },
    [getFinancialData, fetchData, tabIndex]
  );

  // Columns for Fees Paid (Primary and Secondary)
  const feesColumns = [
    { id: 'sn', label: 'S/N', width: 90 },
    {
      id: 'studentName',
      label: 'Student Name',
      flex: 1,
      renderCell: (row) => <Typography>{String(row.studentName || 'N/A')}</Typography>,
    },
    {
      id: 'class',
      label: 'Class',
      flex: 1,
      renderCell: (row) => <Typography>{String(row.class || 'N/A')}</Typography>,
    },
    {
      id: 'termName',
      label: 'Term',
      flex: 1,
      renderCell: (row) => <Typography>{String(row.termName || 'N/A')}</Typography>,
    },
    {
      id: 'feesPaid',
      label: 'Fees Paid',
      flex: 1,
      renderCell: (row) => (
        <Typography color={colors.greenAccent[500]}>
          {typeof row.feesPaid === 'number' ? `₦${row.feesPaid.toLocaleString()}` : 'N/A'}
        </Typography>
      ),
    },
    {
      id: 'date',
      label: 'Date',
      flex: 1,
      renderCell: (row) => <Typography>{String(row.date || 'N/A')}</Typography>,
    },
    {
      id: 'academicYear',
      label: 'Academic Year',
      flex: 1,
      renderCell: (row) => <Typography>{String(row.academicYear || 'N/A')}</Typography>,
    },
    {
      id: 'method',
      label: 'Method',
      flex: 1,
      renderCell: (row) => <Typography>{String(row.method || 'N/A')}</Typography>,
    },
    {
      id: 'reference',
      label: 'Reference',
      flex: 1,
      renderCell: (row) => <Typography>{String(row.reference || 'N/A')}</Typography>,
    },
  ];

  // Columns for Expenditures
  const expenditureColumns = [
    { id: 'sn', label: 'S/N', width: 90 },
    { id: 'id', label: 'ID', width: 100 },
    {
      id: 'category',
      label: 'Category',
      flex: 1,
      renderCell: (row) => <Typography>{String(row.category || 'N/A')}</Typography>,
    },
    {
      id: 'amount',
      label: 'Amount',
      flex: 1,
      renderCell: (row) => (
        <Typography color={colors.redAccent[500]}>
          {typeof row.amount === 'number' ? `₦${row.amount.toLocaleString()}` : 'N/A'}
        </Typography>
      ),
    },
    {
      id: 'date',
      label: 'Date',
      flex: 1,
      renderCell: (row) => <Typography>{String(row.date || 'N/A')}</Typography>,
    },
    {
      id: 'actions',
      label: 'Actions',
      width: 200,
      renderCell: (row) => (
        <ActionButtons
          onEdit={handleEdit}
          onDelete={handleDeleteOpen}
          onView={handleViewDetails}
          record={row}
          isPayment={false}
        />
      ),
    },
  ];

  // Columns for Other Revenues
  const revenueColumns = [
    { id: 'sn', label: 'S/N', width: 90 },
    { id: 'id', label: 'ID', width: 100 },
    {
      id: 'source',
      label: 'Source',
      flex: 1,
      renderCell: (row) => <Typography>{String(row.source || 'N/A')}</Typography>,
    },
    {
      id: 'amount',
      label: 'Amount',
      flex: 1,
      renderCell: (row) => (
        <Typography color={colors.blueAccent[500]}>
          {typeof row.amount === 'number' ? `₦${row.amount.toLocaleString()}` : 'N/A'}
        </Typography>
      ),
    },
    {
      id: 'date',
      label: 'Date',
      flex: 1,
      renderCell: (row) => <Typography>{String(row.date || 'N/A')}</Typography>,
    },
    {
      id: 'description',
      label: 'Description',
      flex: 1,
      renderCell: (row) => <Typography>{String(row.description || 'N/A')}</Typography>,
    },
    {
      id: 'actions',
      label: 'Actions',
      width: 200,
      renderCell: (row) => (
        <ActionButtons
          onEdit={handleEdit}
          onDelete={handleDeleteOpen}
          onView={handleViewDetails}
          record={row}
          isPayment={false}
        />
      ),
    },
  ];

  // Determine columns and data based on tabIndex
  const getTableProps = () => {
    switch (tabIndex) {
      case 0: // Primary Fees
        return { columns: feesColumns, data: feesDataFormatted, header: 'Primary Section Fees', totalRecords };
      case 1: // Secondary Fees
        return { columns: feesColumns, data: feesDataFormatted, header: 'Secondary Section Fees', totalRecords };
      case 2: // Expenditures
        return { columns: expenditureColumns, data: expenditureDataFormatted, header: 'School Expenditures', totalRecords };
      case 3: // Other Revenues
        return { columns: revenueColumns, data: otherRevenueDataFormatted, header: 'Other Revenues', totalRecords };
      default:
        return { columns: feesColumns, data: feesDataFormatted, header: 'Primary Section Fees', totalRecords };
    }
  };

  const { columns, data, header, totalRecords: tableTotalRecords } = getTableProps();

  return {
    columns,
    data,
    header,
    tabIndex,
    handleTabChange,
    sortBy,
    sortDirection,
    page,
    rowsPerPage,
    totalRecords: tableTotalRecords,
    selectedRecord,
    setSelectedRecord,
    openDeleteModal,
    setOpenDeleteModal,
    editDialogOpen,
    setEditDialogOpen,
    viewDetailsOpen,
    setViewDetailsOpen,
    addExpenditureOpen,
    setAddExpenditureOpen,
    addRevenueOpen,
    setAddRevenueOpen,
    payFeesOpen,
    setPayFeesOpen,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleEdit,
    handleDeleteOpen,
    handleViewDetails,
    handlePayFeesOpen,
    handleAddExpenditureOpen,
    handleAddRevenueOpen,
    handleDeleteConfirm,
    handleEditSave,
    handlePayFeesSave,
    handleAddExpenditureSave,
    handleAddRevenueSave,
    financialDataLoading,
    financialDataError,
    expenditureDataLoading,
    expenditureDataError,
    otherRevenueDataLoading,
    otherRevenueDataError,
    students,
    classLevels,
    terms,
    academicYears,
    studentsLoading,
    classLevelsLoading,
    termsLoading,
    academicYearsLoading,
    studentsError,
    classLevelsError,
    termsError,
    academicYearsError,
  };
};

export default useFinancialManagement;