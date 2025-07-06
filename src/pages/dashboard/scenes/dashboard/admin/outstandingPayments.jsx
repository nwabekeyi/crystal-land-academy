// components/OutstandingPayments.js
import { ResponsivePie } from '@nivo/pie';
import { useTheme, Box, Typography } from '@mui/material';
import { tokens } from '../../../theme';
import useAdminData from './useAdminData';

const OutstandingPayments = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { outstandingFeesData, outstandingFeesLoading, outstandingFeesError } = useAdminData();

  if (outstandingFeesLoading) {
    return <Box>Loading data...</Box>;
  }

  if (outstandingFeesError) {
    return <Box>Error: {outstandingFeesError.message || 'Failed to load outstanding fees data'}</Box>;
  }

  if (!outstandingFeesData || !Array.isArray(outstandingFeesData) || outstandingFeesData.length === 0) {
    return <Box>No outstanding fees data available.</Box>;
  }

  // Filter out entries with zero values to avoid empty chart, or add a small default value
  const chartData = outstandingFeesData.map(item => ({
    ...item,
    value: item.value === 0 ? 0.01 : item.value, // Small value to ensure chart renders
  }));

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, color: colors.grey[100] }}>
        Outstanding Fees by Class (₦)
      </Typography>
      <div style={{ height: '350px' }}>
        <ResponsivePie
          data={chartData}
          theme={{
            axis: {
              domain: { line: { stroke: colors.grey[100] } },
              legend: { text: { fill: colors.grey[100] } },
              ticks: { line: { stroke: colors.grey[100], strokeWidth: 1 }, text: { fill: colors.grey[100] } },
            },
            legends: { text: { fill: colors.grey[100] } },
            tooltip: {
              container: {
                background: colors.primary[400],
                color: colors.grey[100],
                fontSize: 12,
              },
              format: value => `₦${value.toLocaleString('en-NG')}`, // Format tooltip in Naira
            },
          }}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor={colors.grey[100]}
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          enableArcLabels={true}
          arcLabelsRadiusOffset={0.4}
          arcLabelsSkipAngle={7}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          arcLabelsText={value => `₦${value.toLocaleString('en-NG')}`} // Format labels in Naira
          defs={[
            { id: 'dots', type: 'patternDots', background: 'inherit', color: 'rgba(255, 255, 255, 0.3)', size: 4, padding: 1, stagger: true },
            { id: 'lines', type: 'patternLines', background: 'inherit', color: 'rgba(255, 255, 255, 0.3)', rotation: -45, lineWidth: 6, spacing: 10 },
          ]}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#999',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
              effects: [{ on: 'hover', style: { itemTextColor: '#000' } }],
              data: chartData.map(item => ({
                id: item.id,
                label: item.label,
              })),
            },
          ]}
        />
      </div>
      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
        {outstandingFeesData.map((item) => (
          <Typography
            key={item.id}
            sx={{
              color: colors.grey[100],
              fontSize: 12,
              minWidth: 120,
            }}
          >
            {item.label}: ₦{item.value.toLocaleString('en-NG')}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default OutstandingPayments;