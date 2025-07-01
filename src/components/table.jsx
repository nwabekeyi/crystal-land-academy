// src/components/TableComponent.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, TableSortLabel,
  TablePagination, Box, TextField, Typography, Divider, useTheme, useMediaQuery,
  Tabs, Tab,
} from '@mui/material';
import { tokens } from '../pages/dashboard/theme';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

// Custom TabPanel component for accessibility
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const formatCellData = (data) => {
  if (data instanceof Date) {
    return data.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  if (data && typeof data === 'object' && 'seconds' in data && 'nanoseconds' in data) {
    return new Date(data.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  if (typeof data === 'string' && !isNaN(Date.parse(data))) {
    return new Date(data).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  return data;
};

const TableComponent = ({
  columns,
  tableHeader,
  data,
  classLevels,
  sortBy,
  sortDirection,
  onSortChange,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onRowClick = () => {},
  hiddenColumnsSmallScreen = [],
  hiddenColumnsTabScreen = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [primarySearchQuery, setPrimarySearchQuery] = useState('');
  const [secondarySearchQuery, setSecondarySearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [primaryFilteredData, setPrimaryFilteredData] = useState([]);
  const [secondaryFilteredData, setSecondaryFilteredData] = useState([]);
  const [primarySortBy, setPrimarySortBy] = useState(sortBy);
  const [primarySortDirection, setPrimarySortDirection] = useState(sortDirection);
  const [secondarySortBy, setSecondarySortBy] = useState(sortBy);
  const [secondarySortDirection, setSecondarySortDirection] = useState(sortDirection);
  const [primaryPage, setPrimaryPage] = useState(page);
  const [primaryRowsPerPage, setPrimaryRowsPerPage] = useState(rowsPerPage);
  const [secondaryPage, setSecondaryPage] = useState(page);
  const [secondaryRowsPerPage, setSecondaryRowsPerPage] = useState(rowsPerPage);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isTabScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Memoize primaryData and secondaryData to prevent recomputation
  const primaryData = useMemo(
    () => (classLevels ? classLevels.filter(cls => cls.section === 'Primary') : []),
    [classLevels]
  );
  const secondaryData = useMemo(
    () => (classLevels ? classLevels.filter(cls => cls.section === 'Secondary') : []),
    [classLevels]
  );

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Search and filter data for tabs
  useEffect(() => {
    if (classLevels) {
      setPrimaryFilteredData(
        primaryData.filter(row =>
          columns.some(col =>
            String(row?.[col?.id] || '').toLowerCase().includes(primarySearchQuery.toLowerCase())
          )
        )
      );
      setSecondaryFilteredData(
        secondaryData.filter(row =>
          columns.some(col =>
            String(row?.[col?.id] || '').toLowerCase().includes(secondarySearchQuery.toLowerCase())
          )
        )
      );
    } else if (data) {
      setPrimaryFilteredData(
        data.filter(row =>
          columns.some(col =>
            String(row?.[col?.id] || '').toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
      );
      setSecondaryFilteredData([]); // Clear secondary data when not using tabs
    }
  }, [primarySearchQuery, secondarySearchQuery, searchQuery, classLevels, data, columns, primaryData, secondaryData]);

  // Sorting logic per tab
  const getSortedData = (filteredData, sortByKey, sortDir) => {
    if (!filteredData.length || !sortByKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortByKey] ?? '';
      const bValue = b[sortByKey] ?? '';
      if (aValue < bValue) return sortDir === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Memoize sorted data
  const primarySortedData = useMemo(
    () => getSortedData(primaryFilteredData, primarySortBy, primarySortDirection),
    [primaryFilteredData, primarySortBy, primarySortDirection]
  );
  const secondarySortedData = useMemo(
    () => getSortedData(secondaryFilteredData, secondarySortBy, secondarySortDirection),
    [secondaryFilteredData, secondarySortBy, secondarySortDirection]
  );
  const defaultSortedData = useMemo(
    () => getSortedData(primaryFilteredData, sortBy, sortDirection),
    [primaryFilteredData, sortBy, sortDirection]
  );

  // Pagination logic
  const primaryPaginatedData = useMemo(
    () => primarySortedData.slice(primaryPage * primaryRowsPerPage, primaryPage * primaryRowsPerPage + primaryRowsPerPage),
    [primarySortedData, primaryPage, primaryRowsPerPage]
  );
  const secondaryPaginatedData = useMemo(
    () => secondarySortedData.slice(secondaryPage * secondaryRowsPerPage, secondaryPage * secondaryRowsPerPage + secondaryRowsPerPage),
    [secondarySortedData, secondaryPage, secondaryRowsPerPage]
  );
  const defaultPaginatedData = useMemo(
    () => defaultSortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [defaultSortedData, page, rowsPerPage]
  );

  // Handle sort change per tab
  const handlePrimarySortChange = (columnId) => {
    if (primarySortBy === columnId) {
      setPrimarySortDirection(primarySortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setPrimarySortBy(columnId);
      setPrimarySortDirection('asc');
    }
  };

  const handleSecondarySortChange = (columnId) => {
    if (secondarySortBy === columnId) {
      setSecondarySortDirection(secondarySortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSecondarySortBy(columnId);
      setSecondarySortDirection('asc');
    }
  };

  // Handle pagination change per tab
  const handlePrimaryPageChange = (event, newPage) => {
    setPrimaryPage(newPage);
  };

  const handlePrimaryRowsPerPageChange = (event) => {
    setPrimaryRowsPerPage(parseInt(event.target.value, 10));
    setPrimaryPage(0);
  };

  const handleSecondaryPageChange = (event, newPage) => {
    setSecondaryPage(newPage);
  };

  const handleSecondaryRowsPerPageChange = (event) => {
    setSecondaryRowsPerPage(parseInt(event.target.value, 10));
    setSecondaryPage(0);
  };

  // Render table content with dynamic header
  const renderTable = (
    tableData,
    currentSortBy,
    currentSortDirection,
    onSort,
    currentPage,
    currentRowsPerPage,
    onPage,
    onRowsPerPage,
    searchValue,
    onSearchChange,
    isSmallScreen,
    isTabScreen,
    header
  ) => (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.4)',
        maxHeight: '75vh',
        overflow: 'auto',
        backgroundColor: colors.primary[400],
        marginTop: '10px',
        overflowX: 'auto',
      }}
    >
      <Box
        display="flex"
        flexDirection={isSmallScreen ? 'column' : 'row'}
        justifyContent="space-between"
        alignItems={isSmallScreen ? 'flex-start' : 'center'}
        p={2}
        gap={isSmallScreen ? 2 : 0}
        width={isSmallScreen ? '60%' : 'auto'}
      >
        <Typography variant={isSmallScreen ? 'h6' : 'h2'}>
          {header || 'Table'}
        </Typography>
        <TextField
          variant="outlined"
          placeholder="Search..."
          size={isSmallScreen ? 'small' : 'medium'}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          fullWidth={isSmallScreen}
        />
      </Box>
      <Divider />
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns
              .filter((column) =>
                (!isSmallScreen || !hiddenColumnsSmallScreen.includes(column.id)) &&
                (!isTabScreen || !hiddenColumnsTabScreen.includes(column.id))
              )
              .map((column) => (
                <TableCell
                  key={column.id}
                  sx={{
                    fontWeight: '900',
                    fontSize: isSmallScreen ? '0.7rem' : '1rem',
                    backgroundColor: colors.primary[400],
                    whiteSpace: 'nowrap',
                    padding: isSmallScreen ? '4px 8px' : '16px',
                  }}
                >
                  <TableSortLabel
                    active={currentSortBy === column.id}
                    direction={currentSortBy === column.id ? currentSortDirection : 'asc'}
                    onClick={() => onSort(column.id)}
                    IconComponent={currentSortDirection === 'asc' ? ArrowUpward : ArrowDownward}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow
              key={row._id || index} // Use `_id` or fallback to `index` for the key
              onClick={() => onRowClick(row)}
              style={{ cursor: 'pointer', transition: 'background-color 0.3s' }}
              sx={{
                '&:hover': {
                  backgroundColor: colors.blueAccent[200],
                  '& td': { color: '#fff' },
                },
              }}
            >
              {columns
                .filter((column) =>
                  (!isSmallScreen || !hiddenColumnsSmallScreen.includes(column.id)) &&
                  (!isTabScreen || !hiddenColumnsTabScreen.includes(column.id))
                )
                .map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{
                      fontSize: isSmallScreen ? '0.65rem' : '0.875rem',
                      padding: isSmallScreen ? '4px 8px' : '16px 10px',
                    }}
                  >
                    {column.renderCell ? column.renderCell(row, index) : formatCellData(row[column.id])}
                  </TableCell>
                ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={tableData.length}
        page={currentPage}
        rowsPerPage={currentRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        onPageChange={onPage}
        onRowsPerPageChange={onRowsPerPage}
        sx={{
          '.MuiTablePagination-toolbar': {
            padding: { xs: '0 10px', sm: '0 24px' },
            minHeight: { xs: '40px', sm: '52px' },
          },
          '.MuiTablePagination-selectLabel, .MuiTablePagination-input, .MuiTablePagination-displayedRows': {
            fontSize: { xs: '0.75rem', sm: '1rem' },
          },
          '.MuiTablePagination-actions': {
            fontSize: { xs: '0.75rem', sm: '1rem' },
          },
        }}
      />
    </TableContainer>
  );

  return (
    <Box>
      {classLevels || data ? (
        classLevels ? (
          <>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="class section tabs"
              sx={{
                backgroundColor: colors.primary[400],
                '& .MuiTabs-indicator': {
                  backgroundColor: colors.blueAccent[700],
                },
              }}
            >
              <Tab
                label="Primary"
                sx={{
                  color: 'white !important',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  '&.Mui-selected': {
                    color: 'white !important',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
                    backgroundColor: colors.blueAccent[700],
                  },
                  boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
                  backgroundColor: colors.primary[400],
                }}
              />
              <Tab
                label="Secondary"
                sx={{
                  color: 'white !important',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  '&.Mui-selected': {
                    color: 'white !important',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
                    backgroundColor: colors.blueAccent[700],
                  },
                  boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
                  backgroundColor: colors.primary[400],
                }}
              />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              {renderTable(
                primaryPaginatedData,
                primarySortBy,
                primarySortDirection,
                handlePrimarySortChange,
                primaryPage,
                primaryRowsPerPage,
                handlePrimaryPageChange,
                handlePrimaryRowsPerPageChange,
                primarySearchQuery,
                setPrimarySearchQuery,
                isSmallScreen,
                isTabScreen,
                'Primary Classes'
              )}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              {renderTable(
                secondaryPaginatedData,
                secondarySortBy,
                secondarySortDirection,
                handleSecondarySortChange,
                secondaryPage,
                secondaryRowsPerPage,
                handleSecondaryPageChange,
                handleSecondaryRowsPerPageChange,
                secondarySearchQuery,
                setSecondarySearchQuery,
                isSmallScreen,
                isTabScreen,
                'Secondary Classes'
              )}
            </TabPanel>
          </>
        ) : (
          renderTable(
            defaultPaginatedData,
            sortBy,
            sortDirection,
            onSortChange,
            page,
            rowsPerPage,
            onPageChange,
            onRowsPerPageChange,
            searchQuery,
            setSearchQuery,
            isSmallScreen,
            isTabScreen,
            tableHeader
          )
        )
      ) : (
        <Typography>Data unavailable</Typography>
      )}
    </Box>
  );
};

export default TableComponent;