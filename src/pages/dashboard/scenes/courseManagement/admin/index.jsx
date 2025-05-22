import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  useTheme,
} from '@mui/material';
import { tokens } from '../../../theme';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Import the eye icon
import Header from "../../../components/Header";
import Modal from "../../../components/modal";
import useCourses from './useCourses';
import { AddCurriculumModal, AddCourseModal, AddCohortModal, COurseDetailsModal} from './courseModals';
import { useSelector } from 'react-redux';
import TableComponent from "../../../../../components/table"; // Import your custom TableComponent
import CustomIconButton from '../../../components/customIconButton';
import ActionButton from '../../../components/actionButton';

const Admin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    addCurriculumOpen,
    courses,
    addCourseModalOpen,
    deleteCourseModal,
    selectedCourse,
    handleDeleteCourse,
    openAddCourseModal,
    closeAddCourseModal,
    openCourseDetailsModal,
    closeCourseDetailsModal,
    openCohortAddModal,
    closeCohortAddModal,
    openAddCurriculumModal,
    closeAddCurriculumModal,
    cohortAddModalOpen,
    openCurriculumList,
    closeCurriculum,
    openCourseDetails,
    closeDeleteCourseModal,
    openDeleteCourseModal,
  } = useCourses();

  const userRole = useSelector((state) => state.users.user.role);

  // Sorting and pagination state
  const [sortBy, setSortBy] = useState('courseName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdating, setIsUpdating] = useState('');
  const [courseId, setCourseId] = useState('');



  // Prefill the form if updating a course
  useEffect(() =>{
    const modalType = JSON.parse(sessionStorage.getItem('modalType')) ;
    const courseid = JSON.parse(sessionStorage.getItem('selectedCourseId')) ;
      setCourseId(courseid);
      setIsUpdating(modalType);
  }, [isUpdating]);

  // Columns for the Table
  const columns = [
    { id: 'sn', label: 'S/N' }, // Adding serial number column
    { id: 'courseName', label: 'Course Name' },
    { id: 'description', label: 'Description' },
    { id: 'duration', label: 'Duration' },
    { id: 'startDate', label: 'Start Date' },
    { id: 'cost', label: 'Cost' },
    {
      id: 'actions',
      label: 'Actions',
      renderCell: (row) => (
        <div className="action-buttons" style={{ display: 'flex' }}>
            < CustomIconButton
              onClick={() => {
                openCourseDetailsModal(row);
                sessionStorage.setItem('selectedCourse', JSON.stringify(row));
              }}
              icon= {<VisibilityIcon />}
              />
            < CustomIconButton
                onClick={() => {
                  console.log(row)
                  sessionStorage.setItem('selectedCourseId', JSON.stringify(row.id));
                  openAddCourseModal('update'); // Open the course modal for editing
                }}
                icon= {<EditIcon />}
                />

          < CustomIconButton
                onClick={() => {openDeleteCourseModal(row)}}
                icon= {<DeleteIcon />}
                />
        </div>
      ),
    },
  ];


  const rows = courses? courses.map((course, index) => ({
    sn: index + 1, // Adding serial number (S/N)
    id: course.courseId,
    courseName: course.courseName,
    description: course.description,
    duration: course.duration,
    startDate: course.startDate,
    cost: course.cost,
  })) : [];

  // Handle sorting changes
  const handleSortChange = (columnId) => {
    const isAscending = sortBy === columnId && sortDirection === 'asc';
    setSortBy(columnId);
    setSortDirection(isAscending ? 'desc' : 'asc');
  };

  // Handle pagination changes
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when rows per page change
  };

  // Handle row click to open course details
  const handleRowClick = (row) => {
    console.log('clicked')
  };

  // Filter data based on search query
  const filteredRows = rows.filter((row) => {
    return row.courseName.toLowerCase().includes(searchQuery.toLowerCase());
  });


  return (
    <Grid container>
      <Grid item xs={12}>
        <Header
          title='Course Management'
          subtitle= 'Manage Courses'
        />
      </Grid>

      {userRole === 'admin' || userRole === 'superadmin' && (
          <Grid item xs={12}>

              <Box sx={{display: 'flex', justifyContent:"end"}}>
              <ActionButton
                  content="Add course"
                  onClick={() => {openAddCourseModal('add')}}
                  />
            </Box>

              {/* Display courses using TableComponent */}
              <TableComponent
                columns={columns}
                tableHeader="Course Management"
                data={filteredRows}
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={handleSortChange}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onRowClick={handleRowClick}
                hiddenColumnsSmallScreen={[ 'description', 'duration', 'cost', 'startDate']}
                hiddenColumnsTabScreen={[ 'description',  'duration']}
              />

          </Grid>
      )}

      {/* Course Details Modal */}
      <Modal open={openCourseDetails} onClose={closeCourseDetailsModal} title={selectedCourse?.courseName}>
        {selectedCourse && (
          <COurseDetailsModal
            userRole={userRole}
            selectedCourse={selectedCourse}
            openAddCurriculumModal={openAddCurriculumModal}
            openCohortAddModal={openCohortAddModal}
          />
        )}
      </Modal>

      {/* Modals for Adding Course, Cohort, and Curriculum */}
      <Modal open={addCourseModalOpen} onClose={closeAddCourseModal} title='New Course' noConfirm> 
        <AddCourseModal
          course={selectedCourse} // Pass the selected course for editing
        />
      </Modal>

      <Modal open={cohortAddModalOpen} onClose={closeCohortAddModal} title="Add Cohort" noConfirm>
        <AddCohortModal courseId={selectedCourse?.id} />
      </Modal>

      {/* Add Curriculum Modal */}
      <Modal open={addCurriculumOpen} onClose={closeAddCurriculumModal} title="Add Curriculum" noConfirm>
        <AddCurriculumModal courseId={selectedCourse?.id} />
      </Modal>

      {/* delet course modal */}
      <Modal open={deleteCourseModal} onClose={closeDeleteCourseModal} title="Delete Course" onConfirm={() => {handleDeleteCourse(courseId)}}>
        <p>Deleting this course means that you will delete all Cohorts and Chat rooms attached to this course. Kindly click on confirm to continue </p>
      </Modal>
    </Grid>
  );
};

export default Admin;
