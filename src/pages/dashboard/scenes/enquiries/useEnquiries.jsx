import { useState, useEffect } from 'react';
import useApi from '../../../../hooks/useApi';
import { endpoints } from '../../../../utils/constants'; // Import endpoints

export const useEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [error, setError] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  const { callApi: fetchEnquiriesApi, loading: fetchingEnquiries } = useApi();
  const { callApi: markAsReadApi, loading: markingAsRead } = useApi();
  const { callApi: removeEnquiryApi, loading: removingEnquiry } = useApi();

  // Fetch all enquiries
  const fetchEnquiries = async () => {
    console.log('fetchEnquiries called'); // Debug log
    setError(null);
    try {
      const url = `${endpoints.ENQUIRIES}`;
      console.log('API URL:', url); // Debug log
      const data = await fetchEnquiriesApi(url, 'GET');
      console.log('Fetched enquiries:', data); // Debug log

      // Handle the response format
      if (data && Array.isArray(data.data)) {
        setEnquiries(data.data); // Use `data.data` based on the server response
      } else {
        setEnquiries([]); // Default to an empty array if the response is unexpected
      }
    } catch (err) {
      console.error('Error fetching enquiries:', err);
      setError('Failed to fetch enquiries. Please try again later.');
    }
  };

  // Mark an enquiry as read
  const markAsRead = async (id) => {
    try {
      const url = `${endpoints.ENQUIRIES}/${id}`;
      console.log('Marking as read:', url); // Debug log
      const updatedEnquiry = await markAsReadApi(url, 'PATCH');
      setEnquiries((prev) =>
        prev.map((enquiry) =>
          enquiry._id === id ? { ...enquiry, status: updatedEnquiry.status } : enquiry
        )
      );
    } catch (err) {
      console.error('Error updating enquiry:', err);
      setError('Failed to mark enquiry as read. Please try again later.');
    }
  };

  // Remove an enquiry
  const removeEnquiry = async (id) => {
    try {
      const url = `${endpoints.ENQUIRIES}/${id}`;
      console.log('Removing enquiry:', url); // Debug log
      await removeEnquiryApi(url, 'DELETE');
      setEnquiries((prev) => prev.filter((enquiry) => enquiry._id !== id));
    } catch (err) {
      console.error('Error deleting enquiry:', err);
      setError('Failed to delete enquiry. Please try again later.');
    }
  };

  // Fetch enquiries on component mount
  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Open modal for selected enquiry
  const openModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    if (enquiry.status === 'unread') {
      markAsRead(enquiry._id); // Mark as read only if it's not already read
    }
    setConfirmDeleteModal(true);
  };

  // Close modal
  const closeModal = () => {
    setSelectedEnquiry(null);
    setConfirmDeleteModal(false);
  };
  console.log('Enquiries:', enquiries); // Debug log

  return {
    enquiries,
    selectedEnquiry,
    loading: fetchingEnquiries || markingAsRead || removingEnquiry,
    error,
    fetchEnquiries,
    markAsRead,
    removeEnquiry,
    openModal,
    closeModal,
    confirmDeleteModal,
  };
}