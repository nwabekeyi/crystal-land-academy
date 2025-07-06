import { Box, Tabs, Tab, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import TableComponent from '../../../../components/table';
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';
import useFinancialManagement from './useFinancialManagement';
import { DeleteModal, EditModal, ViewDetailsModal, PayFeesModal, AddRevenueModal } from './financialModals';
import CustomIconButton from '../../components/customIconButton';
import AddIcon from '@mui/icons-material/Add';

const FinancialManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const {
    columns,
    data,
    header,
    tabIndex,
    handleTabChange,
    sortBy,
    sortDirection,
    page,
    rowsPerPage,
    totalRecords,
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
    handleAddExpenditureOpen,
    handleAddRevenueOpen,
    handlePayFeesOpen,
    handlePayFeesSave,
    handleDeleteConfirm,
    handleEditSave,
    handleAddExpenditureSave,
    handleAddRevenueSave,
    financialDataLoading,
    financialDataError,
    expenditureDataLoading,
    expenditureDataError,
    otherRevenueDataLoading,
    otherRevenueDataError,
  } = useFinancialManagement();

  return (
    <Box>
      <Header title="FINANCIAL MANAGEMENT" subtitle="Financial data for school operations" />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="financial management tabs"
          sx={{
            backgroundColor: colors.primary[400],
            '& .MuiTabs-indicator': {
              backgroundColor: colors.blueAccent[700],
            },
          }}
        >
          <Tab
            label="Primary Fees"
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
            label="Secondary Fees"
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
            label="Expenditures"
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
            label="Other Revenues"
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
        {(tabIndex === 0 || tabIndex === 1) && (
          <CustomIconButton
            onClick={handlePayFeesOpen}
            icon={<AddIcon />}
            title="Pay School Fees"
            sx={{ color: colors.greenAccent[500] }}
          />
        )}
        {tabIndex === 2 && (
          <CustomIconButton
            onClick={handleAddExpenditureOpen}
            icon={<AddIcon />}
            title="Add Expenditure"
            sx={{ color: colors.redAccent[500] }}
          />
        )}
        {tabIndex === 3 && (
          <CustomIconButton
            onClick={handleAddRevenueOpen}
            icon={<AddIcon />}
            title="Add Revenue"
            sx={{ color: colors.blueAccent[500] }}
          />
        )}
      </Box>

      <Box m="40px 0 0 0" height="75vh">
        {(financialDataLoading || expenditureDataLoading || otherRevenueDataLoading) && (
          <Typography>Loading...</Typography>
        )}
        {(financialDataError || expenditureDataError || otherRevenueDataError) && (
          <Typography color="error">
            Error: {financialDataError || expenditureDataError || otherRevenueDataError}
          </Typography>
        )}
        <TableComponent
          columns={columns}
          tableHeader={header}
          data={data}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          page={page}
          rowsPerPage={rowsPerPage}
          totalRecords={totalRecords}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>

      <DeleteModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        record={selectedRecord}
      />
      <EditModal
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleEditSave}
        record={selectedRecord}
      />
      <PayFeesModal
        open={payFeesOpen}
        onClose={() => setPayFeesOpen(false)}
        onSave={handlePayFeesSave}
        record={selectedRecord}
      />
      <EditModal
        open={addExpenditureOpen}
        onClose={() => setAddExpenditureOpen(false)}
        onSave={handleAddExpenditureSave}
        record={selectedRecord}
        title="Add Expenditure"
      />
      <AddRevenueModal
        open={addRevenueOpen}
        onClose={() => setAddRevenueOpen(false)}
        onSave={handleAddRevenueSave}
        record={selectedRecord}
      />
      <ViewDetailsModal
        open={viewDetailsOpen}
        onClose={() => setViewDetailsOpen(false)}
        record={selectedRecord}
      />
    </Box>
  );
};

export default withDashboardWrapper(FinancialManagement);