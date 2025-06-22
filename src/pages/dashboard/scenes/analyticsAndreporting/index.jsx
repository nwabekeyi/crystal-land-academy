import { useState } from 'react';
import { Box, Tabs, Tab, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import TableComponent from '../../../../components/table';
import PieChart from '../../components/PieChart';
import CustomAccordion from '../../components/accordion';
import CustomIconButton from '../../components/actionButton';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import DownloadIcon from '@mui/icons-material/Download';
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';

// Mock data (as defined above)
const mockClassPerformance = [
  { id: 1, class: 'Primary 1', avgGrade: 85, passRate: 95, mathAvg: 88, englishAvg: 82, attendanceRate: 92, date: '2025-06-01' },
  { id: 2, class: 'Primary 2', avgGrade: 80, passRate: 90, mathAvg: 85, englishAvg: 78, attendanceRate: 90, date: '2025-06-01' },
  { id: 3, class: 'JSS 1', avgGrade: 75, passRate: 85, mathAvg: 80, englishAvg: 70, attendanceRate: 88, date: '2025-06-01' },
  { id: 4, class: 'SSS 1', avgGrade: 70, passRate: 80, mathAvg: 75, englishAvg: 65, attendanceRate: 85, date: '2025-06-01' },
];

const mockTeacherPerformance = [
  { id: 1, name: 'John Doe', subject: 'Math', attendanceRate: 98, rating: 4.5, classesTaught: ['Primary 1', 'JSS 1'], studentFeedback: 'Excellent', date: '2025-06-01' },
  { id: 2, name: 'Jane Smith', subject: 'English', attendanceRate: 95, rating: 4.0, classesTaught: ['Primary 2', 'SSS 1'], studentFeedback: 'Good', date: '2025-06-01' },
  { id: 3, name: 'Alice Brown', subject: 'Science', attendanceRate: 90, rating: 3.8, classesTaught: ['JSS 1', 'SSS 1'], studentFeedback: 'Needs improvement', date: '2025-06-01' },
];

const mockAttendanceTrends = [
  { week: '2025-05-05', 'Primary 1': 92, 'Primary 2': 90, 'JSS 1': 88, 'SSS 1': 85 },
  { week: '2025-05-12', 'Primary 1': 93, 'Primary 2': 91, 'JSS 1': 87, 'SSS 1': 86 },
  { week: '2025-05-19', 'Primary 1': 91, 'Primary 2': 89, 'JSS 1': 86, 'SSS 1': 84 },
];

const mockOtherKPIs = {
  studentToTeacherRatio: 20,
  facultyRetentionRate: 85,
  techUsageClasses: 90,
  facultyAdvancedCertifications: 60,
};

const useAnalyticsDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tabIndex, setTabIndex] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const handleSortChange = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(columnId);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
    setPage(0);
  };

  const handleExportReport = () => {
    // Placeholder for report export logic
    console.log('Exporting report for tab:', tabIndex);
  };

  // Columns for Class Performance
  const classColumns = [
    { id: 'sn', label: 'S/N', width: 90 },
    { id: 'id', label: 'ID', width: 100 },
    {
      id: 'class',
      label: 'Class',
      flex: 1,
      renderCell: (row) => <Typography>{String(row.class || 'N/A')}</Typography>,
    },
    {
      id: 'avgGrade',
      label: 'Avg Grade (%)',
      flex: 1,
      renderCell: (row) => <Typography>{row.avgGrade || 'N/A'}</Typography>,
    },
    {
      id: 'passRate',
      label: 'Pass Rate (%)',
      flex: 1,
      renderCell: (row) => <Typography color={colors.greenAccent[500]}>{row.passRate || 'N/A'}</Typography>,
    },
    {
      id: 'mathAvg',
      label: 'Math Avg (%)',
      flex: 1,
      renderCell: (row) => <Typography>{row.mathAvg || 'N/A'}</Typography>,
    },
    {
      id: 'englishAvg',
      label: 'English Avg (%)',
      flex: 1,
      renderCell: (row) => <Typography>{row.englishAvg || 'N/A'}</Typography>,
    },
    {
      id: 'attendanceRate',
      label: 'Attendance Rate (%)',
      flex: 1,
      renderCell: (row) => <Typography color={colors.blueAccent[500]}>{row.attendanceRate || 'N/A'}</Typography>,
    },
    { id: 'date', label: 'Date', flex: 1 },
  ];

  // Columns for Teacher Performance
  const teacherColumns = [
    { id: 'sn', label: 'S/N', width: 90 },
    { id: 'id', label: 'ID', width: 100 },
    {
      id: 'name',
      label: 'Name',
      flex: 1,
      renderCell: (row) => <Typography>{String(row.name || 'N/A')}</Typography>,
    },
    {
      id: 'subject',
      label: 'Subject',
      flex: 1,
      renderCell: (row) => <Typography>{String(row.subject || 'N/A')}</Typography>,
    },
    {
      id: 'attendanceRate',
      label: 'Attendance Rate (%)',
      flex: 1,
      renderCell: (row) => <Typography color={colors.blueAccent[500]}>{row.attendanceRate || 'N/A'}</Typography>,
    },
    {
      id: 'rating',
      label: 'Rating (1-5)',
      flex: 1,
      renderCell: (row) => <Typography color={colors.greenAccent[500]}>{row.rating || 'N/A'}</Typography>,
    },
    {
      id: 'classesTaught',
      label: 'Classes Taught',
      flex: 1,
      renderCell: (row) => <Typography>{row.classesTaught.join(', ') || 'N/A'}</Typography>,
    },
    {
      id: 'studentFeedback',
      label: 'Feedback',
      flex: 1,
      renderCell: (row) => <Typography>{String(row.studentFeedback || 'N/A')}</Typography>,
    },
    { id: 'date', label: 'Date', flex: 1 },
  ];

  // Data preparation
  const classData = mockClassPerformance.map((record, index) => ({
    id: record.id,
    sn: index + 1,
    class: record.class,
    avgGrade: record.avgGrade,
    passRate: record.passRate,
    mathAvg: record.mathAvg,
    englishAvg: record.englishAvg,
    attendanceRate: record.attendanceRate,
    date: record.date ? new Date(record.date).toLocaleDateString() : 'N/A',
  }));

  const teacherData = mockTeacherPerformance.map((record, index) => ({
    id: record.id,
    sn: index + 1,
    name: record.name,
    subject: record.subject,
    attendanceRate: record.attendanceRate,
    rating: record.rating,
    classesTaught: record.classesTaught,
    studentFeedback: record.studentFeedback,
    date: record.date ? new Date(record.date).toLocaleDateString() : 'N/A',
  }));

  // Pie chart data for pass rates
  const passRatePieData = mockClassPerformance.map((record) => ({
    id: record.class,
    label: record.class,
    value: record.passRate,
    color: colors.blueAccent[Math.floor(Math.random() * 4) + 1],
  }));

  // Bar chart data for subject performance
  const subjectBarData = mockClassPerformance.map((record) => ({
    class: record.class,
    Math: record.mathAvg,
    English: record.englishAvg,
  }));

  // Get table props based on tab
  const getTableProps = () => {
    switch (tabIndex) {
      case 0: // Overview
        return { columns: [], data: [], header: 'School Analytics Overview' };
      case 1: // Class Performance
        return { columns: classColumns, data: classData, header: 'Class Performance' };
      case 2: // Teacher Performance
        return { columns: teacherColumns, data: teacherData, header: 'Teacher Performance' };
      case 3: // Attendance
        return { columns: classColumns, data: classData, header: 'Class Attendance Rates' };
      case 4: // Other KPIs
        return { columns: [], data: [], header: 'Other Key Performance Indicators' };
      default:
        return { columns: [], data: [], header: 'School Analytics Overview' };
    }
  };

  const { columns, data, header } = getTableProps();

  return {
    tabIndex,
    handleTabChange,
    columns,
    data,
    header,
    sortBy,
    sortDirection,
    page,
    rowsPerPage,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleExportReport,
    passRatePieData,
    subjectBarData,
    attendanceTrends: mockAttendanceTrends,
    otherKPIs: mockOtherKPIs,
  };
};

const AnalyticsDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    tabIndex,
    handleTabChange,
    columns,
    data,
    header,
    sortBy,
    sortDirection,
    page,
    rowsPerPage,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleExportReport,
    passRatePieData,
    subjectBarData,
    attendanceTrends,
    otherKPIs,
  } = useAnalyticsDashboard();

  const tableProps = {
    columns,
    tableHeader: header,
    data,
    sortBy,
    sortDirection,
    onSortChange: handleSortChange,
    page,
    rowsPerPage,
    onPageChange: handlePageChange,
    onRowsPerPageChange: handleRowsPerPageChange,
  };

  return (
    <Box>
      <Header title="SCHOOL ANALYTICS & REPORTING" subtitle="Performance metrics for classes, teachers, and attendance" />

      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="analytics dashboard tabs"
        sx={{
          backgroundColor: colors.primary[400],
          '& .MuiTabs-indicator': {
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <Tab
          label="Overview"
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
          label="Class Performance"
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
          label="Teacher Performance"
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
          label="Attendance"
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
          label="Other KPIs"
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

      <Box m="40px 0 0 0" height="75vh">
        {tabIndex === 0 && (
          <Box>
            <CustomAccordion
              title="School Overview"
              details={
                <Box>
                  <Typography variant="h6">Key Metrics</Typography>
                  <Box height="300px" mt={2}>
                    <PieChart data={passRatePieData} />
                  </Box>
                  <Typography mt={2}>
                    Average Attendance Rate: {mockClassPerformance.reduce((sum, rec) => sum + rec.attendanceRate, 0) / mockClassPerformance.length}%
                  </Typography>
                  <Typography>
                    Student-to-Teacher Ratio: {otherKPIs.studentToTeacherRatio}:1
                  </Typography>
                  <CustomIconButton
                    onClick={handleExportReport}
                    icon={<DownloadIcon />}
                    title="Export Overview Report"
                    sx={{ mt: 2 }}
                  />
                </Box>
              }
              defaultExpanded
            />
          </Box>
        )}
        {tabIndex === 1 && (
          <Box>
            <CustomAccordion
              title="Class Performance Insights"
              details={
                <Box>
                  <Box height="300px" mb={2}>
                    <ResponsiveBar
                      data={subjectBarData}
                      keys={['Math', 'English']}
                      indexBy="class"
                      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                      padding={0.3}
                      colors={{ scheme: 'nivo' }}
                      theme={{
                        axis: {
                          ticks: { text: { fill: colors.grey[100] } },
                          legend: { text: { fill: colors.grey[100] } },
                        },
                        legends: { text: { fill: colors.grey[100] } },
                      }}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Class',
                        legendPosition: 'middle',
                        legendOffset: 32,
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Average Score (%)',
                        legendPosition: 'middle',
                        legendOffset: -40,
                      }}
                      legends={[
                        {
                          dataFrom: 'keys',
                          anchor: 'bottom-right',
                          direction: 'column',
                          justify: false,
                          translateX: 120,
                          translateY: 0,
                          itemsSpacing: 2,
                          itemWidth: 100,
                          itemHeight: 20,
                        },
                      ]}
                    />
                  </Box>
                  <TableComponent {...tableProps} />
                  <CustomIconButton
                    onClick={handleExportReport}
                    icon={<DownloadIcon />}
                    title="Export Class Performance Report"
                    sx={{ mt: 2 }}
                  />
                </Box>
              }
              defaultExpanded
            />
          </Box>
        )}
        {tabIndex === 2 && (
          <Box>
            <CustomAccordion
              title="Teacher Performance Insights"
              details={
                <Box>
                  <TableComponent {...tableProps} />
                  <CustomIconButton
                    onClick={handleExportReport}
                    icon={<DownloadIcon />}
                    title="Export Teacher Performance Report"
                    sx={{ mt: 2 }}
                  />
                </Box>
              }
              defaultExpanded
            />
          </Box>
        )}
        {tabIndex === 3 && (
          <Box>
            <CustomAccordion
              title="Attendance Trends"
              details={
                <Box>
                  <Box height="300px" mb={2}>
                    <ResponsiveLine
                      data={attendanceTrends.map((trend) => ({
                        id: trend.week,
                        data: Object.keys(trend)
                          .filter((key) => key !== 'week')
                          .map((className) => ({ x: trend.week, y: trend[className] })),
                      }))}
                      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                      xScale={{ type: 'point' }}
                      yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 45,
                        legend: 'Week',
                        legendOffset: 36,
                        legendPosition: 'middle',
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Attendance Rate (%)',
                        legendOffset: -40,
                        legendPosition: 'middle',
                      }}
                      colors={{ scheme: 'nivo' }}
                      theme={{
                        axis: {
                          ticks: { text: { fill: colors.grey[100] } },
                          legend: { text: { fill: colors.grey[100] } },
                        },
                        legends: { text: { fill: colors.grey[100] } },
                      }}
                      legends={[
                        {
                          anchor: 'bottom-right',
                          direction: 'column',
                          justify: false,
                          translateX: 100,
                          translateY: 0,
                          itemsSpacing: 0,
                          itemWidth: 80,
                          itemHeight: 20,
                        },
                      ]}
                    />
                  </Box>
                  <TableComponent {...tableProps} />
                  <CustomIconButton
                    onClick={handleExportReport}
                    icon={<DownloadIcon />}
                    title="Export Attendance Report"
                    sx={{ mt: 2 }}
                  />
                </Box>
              }
              defaultExpanded
            />
          </Box>
        )}
        {tabIndex === 4 && (
          <Box>
            <CustomAccordion
              title="Other KPIs"
              details={
                <Box>
                  <Typography>Student-to-Teacher Ratio: {otherKPIs.studentToTeacherRatio}:1</Typography>
                  <Typography>Faculty Retention Rate: {otherKPIs.facultyRetentionRate}%</Typography>
                  <Typography>Classes Using Technology: {otherKPIs.techUsageClasses}%</Typography>
                  <Typography>Faculty with Advanced Certifications: {otherKPIs.facultyAdvancedCertifications}%</Typography>
                  <CustomIconButton
                    onClick={handleExportReport}
                    icon={<DownloadIcon />}
                    title="Export KPI Report"
                    sx={{ mt: 2 }}
                  />
                </Box>
              }
              defaultExpanded
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default withDashboardWrapper(AnalyticsDashboard);