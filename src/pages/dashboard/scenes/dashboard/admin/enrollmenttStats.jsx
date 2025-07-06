// src/components/dashboard/EnrollmentStats.jsx
import { ResponsiveBar } from '@nivo/bar';
import { useTheme, Box, Typography } from '@mui/material';
import { tokens } from '../../../theme';
import useAdminData from './useAdminData';

const EnrollmentStats = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { enrollmentData, enrollmentDataLoading, enrollmentDataError } = useAdminData();

  if (enrollmentDataLoading) {
    return <Box>Loading...</Box>;
  }

  if (enrollmentDataError) {
    return <Box>Error: {enrollmentDataError.message || 'Failed to load data'}</Box>;
  }

  if (!enrollmentData || !enrollmentData.total?.length) {
    return <Box>No enrollment data available.</Box>;
  }

  const chartData = enrollmentData.total.map((item) => ({
    academicYear: item.academicYear,
    Total: item.value,
  }));

  console.log('Enrollment Chart Data:', chartData);

  return (
    <Box height="300px">
      <Typography variant="h6" sx={{ mb: 1, color: colors.grey[100], fontSize: '14px' }}>
        Enrollment
      </Typography>
      <ResponsiveBar
        data={chartData}
        keys={['Total']}
        indexBy="academicYear"
        theme={{
          axis: {
            domain: { line: { stroke: colors.grey[100] } },
            legend: { text: { fill: colors.grey[100], fontSize: 8 } },
            ticks: {
              line: { stroke: colors.grey[100], strokeWidth: 1 },
              text: { fill: colors.grey[100], fontSize: 8 },
            },
          },
          legends: { text: { fill: colors.grey[100], fontSize: 8 } },
          tooltip: { container: { background: colors.primary[400], color: colors.grey[100], fontSize: 8 } },
        }}
        margin={{ top: 20, right: 60, bottom: 40, left: 40 }}
        padding={0.4}
        colors={{ scheme: 'nivo' }}
        animate={true}
        motionConfig="default"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 3,
          tickPadding: 3,
          tickRotation: 45,
          legend: 'Academic Year',
          legendPosition: 'middle',
          legendOffset: 30,
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 3,
          tickPadding: 3,
          tickRotation: 0,
          legend: 'Students',
          legendPosition: 'middle',
          legendOffset: -30,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 50,
            translateY: 0,
            itemsSpacing: 1,
            itemWidth: 50,
            itemHeight: 15,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 12,
            effects: [{ on: 'hover', style: { itemOpacity: 1 } }],
          },
        ]}
      />
    </Box>
  );
};

export default EnrollmentStats;