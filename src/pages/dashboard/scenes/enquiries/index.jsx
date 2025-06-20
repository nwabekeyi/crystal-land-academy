import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEnquiries } from '../../../../reduxStore/slices/enquiriesSlice'; 
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import Modal from '../../components/modal';
import TableComponent from '../../../../components/table';
import Header from '../../components/Header';
import useApi from '../../../../hooks/useApi'; 
import { endpoints } from '../../../../utils/constants'; 

const Enquiries = () => {
  const dispatch = useDispatch();
  const { enquiries, loading, error } = useSelector((state) => state.enquiries); 
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(10); 

  const { callApi: markAsReadApi } = useApi(); 
  const { callApi: removeEnquiryApi } = useApi();

  // Fetch enquiries when the component mounts
  useEffect(() => {
    dispatch(fetchEnquiries());
  }, [dispatch]);

  console.log('Redux Enquiries:', enquiries); // Debug log

  // Define table columns for enquiries
  const columns = [
    { id: 'sn', label: 'S/N', minWidth: 50 }, // Added S/N column
    { id: 'name', label: 'Name', minWidth: 100 },
    { id: 'phone', label: 'Phone No.', minWidth: 50 },
    { id: 'email', label: 'Email', minWidth: 100 }, // Added email column
    { id: 'status', label: 'Status', minWidth: 50 },
    { id: 'actions', label: 'Actions', minWidth: 150, renderCell: (row) => row.actions },
  ];

  // Create rows from the enquiries data
  const rows = enquiries.map((enquiry, index) => ({
    sn: index + 1, // Generate serial number based on index
    _id: enquiry._id, // Ensure unique key for each row
    name: enquiry.name,
    phone: enquiry.phone,
    email: enquiry.email, // Include email in rows
    status: enquiry.status === 'read' ? 'Read' : 'Unread',
    actions: (
      <>
        {/* View Icon */}
        <IconButton
          onClick={() => openModal(enquiry)} 
          aria-label="view"
          style={{ marginRight: '10px' }}
        >
          <VisibilityIcon />
        </IconButton>

        {/* Delete Icon */}
        <IconButton
          onClick={() => openDeleteModal(enquiry)} 
          aria-label="delete"
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </>
    ),
  }));
  console.log('Table Rows:', rows); // Debug log

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Update rowsPerPage
    setPage(0); // Reset to the first page
  };

  // Open modal for selected enquiry
  const openModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setConfirmDeleteModal(false); // Ensure delete modal is closed
  };

  // Open delete confirmation modal
  const openDeleteModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setConfirmDeleteModal(true); // Open delete modal
  };

  // Close modal
  const closeModal = () => {
    setSelectedEnquiry(null);
    setConfirmDeleteModal(false);
  };

  // Handle marking an enquiry as read
  const handleMarkAsRead = async (id) => {
    try {
      const url = `${endpoints.ENQUIRIES}/${id}`;
      console.log('Marking as read:', url); // Debug log
      const updatedEnquiry = await markAsReadApi(url, 'PATCH', { status: 'read' }); // Include payload
      dispatch(fetchEnquiries()); // Refresh enquiries after marking as read
    } catch (err) {
      console.error('Error marking enquiry as read:', err);
    }
  };

  // Handle deleting an enquiry
  const handleDeleteEnquiry = async (id) => {
    try {
      const url = `${endpoints.ENQUIRIES}/${id}`;
      console.log('Deleting enquiry:', url); // Debug log
      await removeEnquiryApi(url, 'DELETE');
      dispatch(fetchEnquiries()); // Refresh enquiries after deletion
      closeModal(); // Close modal after deletion
    } catch (err) {
      console.error('Error deleting enquiry:', err);
    }
  };

  return (
    <div>
      <Header title="Enquiries" subtitle="Enquiries from prospects" />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && enquiries.length === 0 && <p>No enquiries found.</p>}

      {!loading && !error && enquiries.length > 0 && (
        <TableComponent
          columns={columns}
          tableHeader="Enquiries"
          data={rows}
          page={page}
          rowsPerPage={rowsPerPage} // Pass rowsPerPage
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      )}

      {selectedEnquiry && !confirmDeleteModal && (
        <Modal open={!!selectedEnquiry} onClose={closeModal} noConfirm title="Enquiry Details">
          <div className="modal-content">
            <h2><strong>Name: </strong>{selectedEnquiry.name}</h2>
            <p><strong>Number: </strong>{selectedEnquiry.phone}</p>
            <p>
              <strong>E-mail: </strong>
              <a href={`mailto:${selectedEnquiry.email}`} style={{textDecoration: 'underline' }}>
                {selectedEnquiry.email}
              </a>
            </p> {/* Display email as mailto link */}
            <p><strong>Message: </strong>{selectedEnquiry.message}</p>
            <p>
              <strong>Status: </strong>
              {selectedEnquiry.status === 'read' ? 'Read' : 'Unread'}
            </p>
            {selectedEnquiry.status === 'unread' && (
              <IconButton
                onClick={() => {
                  handleMarkAsRead(selectedEnquiry._id); // Trigger mark as read API call
                  closeModal(); // Close modal after marking as read
                }}
                aria-label="mark as read"
                color="primary"
              >
                <MarkEmailReadIcon />
              </IconButton>
            )}
          </div>
        </Modal>
      )}

      {confirmDeleteModal && selectedEnquiry && (
        <Modal open={confirmDeleteModal} onClose={closeModal} noConfirm title="Confirm Delete">
          <div className="modal-content">
            <h2>Are you sure you want to delete this enquiry?</h2>
            <p>
              <strong>Name: </strong>
              {selectedEnquiry.name}
            </p>
            <p>
              <strong>Phone: </strong>
              {selectedEnquiry.phone}
            </p>
            <p>
              <strong>Email: </strong>
              <a href={`mailto:${selectedEnquiry.email}`} style={{ color: 'blue', textDecoration: 'underline' }}>
                {selectedEnquiry.email}
              </a>
            </p> {/* Display email as mailto link */}
            <p>
              <strong>Message: </strong>
              {selectedEnquiry.message}
            </p>
            <div style={{ display: 'flex', justifyContent: 'end', marginTop: '20px' }}>
              <IconButton
                onClick={() => handleDeleteEnquiry(selectedEnquiry._id)} 
                aria-label="delete"
                color="error"
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                onClick={closeModal} // Cancel deletion
                aria-label="cancel"
                color="primary"
              >
                Cancel
              </IconButton>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Enquiries;