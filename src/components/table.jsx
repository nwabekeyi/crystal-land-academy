import React, { useState, useEffect } from 'react';
import {
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, TableSortLabel,
  TablePagination, Box, TextField, Typography, Divider, useTheme, useMediaQuery,
} from '@mui/material';
import { tokens } from "../pages/dashboard/theme";
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

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
  sortBy,
  sortDirection,
  onSortChange,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onRowClick,
  hiddenColumnsSmallScreen = [],
  hiddenColumnsTabScreen = [], // New prop for hiding columns on tab screens
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Detect small screens
  const isTabScreen = useMediaQuery(theme.breakpoints.between('sm', 'md')); // Detect tab screens

  useEffect(() => {
    if (data) {
      setFilteredData(data.filter((row) =>
        columns.some((column) =>
          String(row[column.id]).toLowerCase().includes(searchQuery.toLowerCase())
        )
      ));
    }
  }, [searchQuery, data, columns]);

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      {data ? (
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
            <Typography variant={isSmallScreen ? 'h6' : 'h2'}>{tableHeader}</Typography>
            <TextField
              variant="outlined"
              placeholder="Search..."
              size={isSmallScreen ? 'small' : 'medium'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth={isSmallScreen}
            />
          </Box>
          <Divider />
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns
                  .filter((column) =>
                    (!isSmallScreen || !hiddenColumnsSmallScreen.includes(column.id)) && // Hide columns on small screens
                    (!isTabScreen || !hiddenColumnsTabScreen.includes(column.id)) // Hide columns on tab screens
                  )
                  .map((column) => (
                    <TableCell
                      key={column.id}
                      sx={{
                        fontWeight: '900',
                        fontSize: isSmallScreen ? '0.7rem' : '1rem',
                        backgroundColor: colors.primary[400],
                        whiteSpace: 'nowrap',
                        padding: isSmallScreen ? '4px 8px' : '16px', // Adjust cell padding
                      }}
                    >
                      <TableSortLabel
                        active={sortBy === column.id}
                        direction={sortBy === column.id ? sortDirection : 'asc'}
                        onClick={() => onSortChange(column.id)}
                        IconComponent={sortDirection === 'asc' ? ArrowUpward : ArrowDownward}
                      >
                        {column.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow
                  key={row.id}
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
                          fontSize: isSmallScreen ? '0.65rem' : '0.875rem', // Adjust font size
                          padding: isSmallScreen ? '4px 8px' : '16px 10px', // Adjust cell padding
                        }}
                      >
                        {column.renderCell ? column.renderCell(row) : formatCellData(row[column.id])}
                      </TableCell>
                    ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            sx={{
              '.MuiTablePagination-toolbar': {
                padding: { xs: '0 10px', sm: '0 24px' }, // Reduce padding on small screens
                minHeight: { xs: '40px', sm: '52px' }, // Reduce height on small screens
              },
              '.MuiTablePagination-selectLabel, .MuiTablePagination-input, .MuiTablePagination-displayedRows': {
                fontSize: { xs: '0.75rem', sm: '1rem' }, // Smaller font on small screens
              },
              '.MuiTablePagination-actions': {
                fontSize: { xs: '0.75rem', sm: '1rem' }, // Adjust the size of pagination actions
              },
            }}
          />

        </TableContainer>
      ) : (
        <Typography>Data unavailable</Typography>
      )}
    </Box>
  );
};

export default TableComponent;
