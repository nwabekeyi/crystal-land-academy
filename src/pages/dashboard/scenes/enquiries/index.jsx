import {useState} from 'react';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread';
import { useEnquiries } from './useEnquiries';
import Modal from '../../components/modal';
import TableComponent from '../../../../components/table'; // Assuming your reusable table component is here
import Header from '../../components/Header';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';


const Enquiries = () => {
  const {
    enquiries,
    selectedEnquiry,
    loading,
    error,
    openModal,
    closeModal,
    confirmDeleteModal,
    removeEnquiry,
    markAsRead,
  } = useEnquiries();


  // Define table columns for enquiries
  const columns = [
    { id: 'name', label: 'Name', minWidth: 100 },
    { id: 'phoneNumber', label: 'Phone No.', minWidth: 50 },
    { id: 'status', label: 'Status', minWidth: 50 },
    { id: 'actions', label: 'Actions', minWidth: 150, renderCell: (row) => row.actions },
  ];

  // Create rows from the enquiries data
  const rows = enquiries.map((enquiry) => ({
    ...enquiry,
    status: enquiry.read ? 'Read' : 'Unread',
    actions: (
      <>
      {/* View Icon */}
      <IconButton onClick={() => openModal(enquiry)} aria-label="view" style={{ marginRight: '10px' }}>
        <VisibilityIcon />
      </IconButton>

      {/* Delete Icon */}
      <IconButton onClick={() => removeEnquiry(enquiry._id)} aria-label="delete" color="error">
        <DeleteIcon />
      </IconButton>
    </>
    ),
  }));

  // Table state for sorting and pagination
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sorting logic
  const handleSortChange = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(columnId);
  };

  // Pagination logic
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Header title="Enquiries" subtitle="Enquiries from prospects" />


      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && enquiries.length === 0 && <p>No enquiries found.</p>}

      {/* Reusable TableComponent */}
      {!loading && !error && enquiries.length > 0 && (
        <TableComponent
          columns={columns}
          tableHeader="Enquiries"
          data={rows}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onRowClick={(row) => openModal(row)} // Handle row click for modal
        />
      )}

{confirmDeleteModal && selectedEnquiry && (
  <Modal open={confirmDeleteModal} onClose={closeModal} noConfirm title="Enquiry">
    <div className="modal-content">
      <h2>{selectedEnquiry.name}</h2>
      <p>{selectedEnquiry.message}</p>
      <p>
        <strong>Status: </strong>{selectedEnquiry.read ? 'Read' : 'Unread'}
      </p>
      <div style={{ display: 'flex', justifyContent: 'end', marginTop: '20px' }}>
        
        {/* Delete Button */}
        <IconButton
          onClick={() => {
            removeEnquiry(selectedEnquiry._id);
            closeModal();
          }}
          aria-label="delete"
          color="error"
        >
          <DeleteIcon />
        </IconButton>

        {/* Mark as Read Button */}
        {
          !selectedEnquiry.read &&
          <IconButton
          onClick={() => {
            markAsRead(selectedEnquiry._id);
            closeModal();
          }}
          aria-label="mark as read"
          color="primary"
        >
          <MarkEmailReadIcon />
        </IconButton>
        }
      </div>
    </div>
  </Modal>
)}
    </div>
  );
};

export default Enquiries;
