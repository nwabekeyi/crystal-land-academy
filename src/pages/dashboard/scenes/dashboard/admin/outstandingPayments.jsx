import { ResponsivePie } from '@nivo/pie';
import { useTheme, Box, Typography } from '@mui/material';
import { tokens } from '../../../theme';

const OutstandingPayments = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dummyData = [
    { id: 'Kindergarten', label: 'Kindergarten', value: 5000 },
    { id: 'Nursery 1', label: 'Nursery 1', value: 4500 },
    { id: 'Nursery 2', label: 'Nursery 2', value: 4700 },
    { id: 'Primary 1', label: 'Primary 1', value: 6000 },
    { id: 'Primary 2', label: 'Primary 2', value: 5800 },
    { id: 'Primary 3', label: 'Primary 3', value: 5600 },
    { id: 'Primary 4', label: 'Primary 4', value: 5500 },
    { id: 'Primary 5', label: 'Primary 5', value: 5400 },
    { id: 'Primary 6', label: 'Primary 6', value: 5300 },
    { id: 'JSS 1', label: 'JSS 1', value: 7000 },
    { id: 'JSS 2', label: 'JSS 2', value: 6800 },
    { id: 'JSS 3', label: 'JSS 3', value: 6600 },
    { id: 'SS 1', label: 'SS 1', value: 7500 },
    { id: 'SS 2', label: 'SS 2', value: 7300 },
    { id: 'SS 3', label: 'SS 3', value: 7200 },
  ];

  return (
<<<<<<< HEAD
    <div style={{ height: '350px' }}>
      <ResponsiveBar
        data={dummyData}
        keys={['amount']}
        indexBy="class"
        theme={{
          axis: { domain: { line: { stroke: colors.grey[100] } }, legend: { text: { fill: colors.grey[100], fontSize: 8 } }, ticks: { line: { stroke: colors.grey[100], strokeWidth: 1 }, text: { fill: colors.grey[100], fontSize: 8 } } },
          legends: { text: { fill: colors.grey[100], fontSize: 8 } },
        }}
        margin={{ top: 50, right: 20, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ scheme: 'nivo' }}
        animate={true}
        motionConfig="default"
        axisTop={null}
        axisRight={null}
        axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Class Level', legendPosition: 'middle', legendOffset: 32 }}
        axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Outstanding Amount ($)', legendPosition: 'middle', legendOffset: -40 }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      />
    </div>
=======
    <Box>
      <div style={{ height: '350px' }}>
        <ResponsivePie
          data={dummyData}
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
              data: dummyData.map(item => ({
                id: item.id,
                label: item.label, // Only class name, no amount
              })),
            },
          ]}
        />
      </div>
      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
        {dummyData.map((item) => (
          <Typography
            key={item.id}
            sx={{
              color: colors.grey[100],
              fontSize: 12,
              minWidth: 120, // Ensure consistent spacing
            }}
          >
            {item.label}: ${item.value.toLocaleString()}
          </Typography>
        ))}
      </Box>
    </Box>
>>>>>>> 4c1b2d1ea04f4d5d3a696ac8201f845966cdfb82
  );
};

export default OutstandingPayments;