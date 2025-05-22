import { useState, useEffect } from 'react';
import useApi from '../../../../hooks/useApi';

export const useEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [error, setError] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  // Create separate instances of useApi for each API operation
  const { callApi: fetchEnquiriesApi, loading: fetchingEnquiries } = useApi();
  const { callApi: markAsReadApi, loading: markingAsRead } = useApi();
  const { callApi: removeEnquiryApi, loading: removingEnquiry } = useApi();

  // Fetch all enquiries
  const fetchEnquiries = async () => {
    setError(null);
    try {
      const data = await fetchEnquiriesApi(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_ENQUIRY_ENDPOINT}`,
        'GET'
      );
      if (data) {
        setEnquiries(Array.isArray(data) ? data : []);

        const unreadEnquiries = data.filter(enquiry => !enquiry.read)
        return unreadEnquiries.length
      };

    } catch (err) {
      console.error('Error fetching enquiries:', err);
      setError('Failed to fetch enquiries');
    }
  };

  // Mark an enquiry as read
  const markAsRead = async (id) => {
    try {
      const updatedEnquiry = await markAsReadApi(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_ENQUIRY_ENDPOINT}/${id}`,
        'PATCH'
      );
      setEnquiries((prev) =>
        prev.map((enquiry) =>
          enquiry._id === id ? { ...enquiry, read: updatedEnquiry.read } : enquiry
        )
      );
    } catch (err) {
      console.error('Error updating enquiry:', err);
      setError('Failed to update enquiry');
    }
  };

  // Remove an enquiry
  const removeEnquiry = async (id) => {
    try {
      await removeEnquiryApi(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_ENQUIRY_ENDPOINT}/${id}`,
        'DELETE'
      );
      setEnquiries((prev) => prev.filter((enquiry) => enquiry._id !== id));
    } catch (err) {
      console.error('Error deleting enquiry:', err);
      setError('Failed to delete enquiry');
    }
  };

  // Fetch enquiries on component mount
  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Open modal for selected enquiry
  const openModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    if (enquiry.read !== true) {
      markAsRead(enquiry._id); // Mark as read only if it's not already read
    }
    setConfirmDeleteModal(true);
  };

  const closeModal = () => {
    setSelectedEnquiry(null);
    setConfirmDeleteModal(false);
  };

  return {
    enquiries,
    selectedEnquiry,
    loading: fetchingEnquiries || markingAsRead || removingEnquiry, // Combine all loading states
    error,
    fetchEnquiries,
    markAsRead,
    removeEnquiry,
    openModal,
    closeModal,
    confirmDeleteModal,
  };
};
