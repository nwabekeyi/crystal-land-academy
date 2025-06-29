import { ResponsivePie } from '@nivo/pie';
import { useTheme, Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { tokens } from '../../../theme';
import { selectAdminDataState } from '../../../../../reduxStore/slices/adminDataSlice';

const PopulationChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { classLevels } = useSelector(selectAdminDataState);

  // Transform classLevels data for pie chart
  const chartData = classLevels && classLevels.length > 0
    ? classLevels.map((classLevel) => ({
        id: classLevel._id, // Unique ID for pie chart
        label: classLevel.name, // Class name for display
        value: classLevel.students?.length || 0,
      }))
    : [];

  return (
    <Box>
      <div style={{ height: '350px' }}>
        {chartData.length > 0 ? (
          <ResponsivePie
            data={chartData}
            arcLinkLabel="label" // Explicitly use label (class name) for arc link labels
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
            enableArcLabels={false}
            arcLabelsRadiusOffset={0.4}
            arcLabelsSkipAngle={7}
            arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
            tooltip={({ datum }) => (
              <div
                style={{
                  background: colors.primary[400],
                  color: colors.grey[100],
                  padding: '5px 9px',
                  borderRadius: '3px',
                  fontSize: 12,
                }}
              >
                {datum.label}: {datum.value}
              </div>
            )}
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
                  label: item.label, // Use class name in legend
                })),
              },
            ]}
          />
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography color={colors.grey[100]}>No class data available</Typography>
          </Box>
        )}
      </div>
    </Box>
  );
};

export default PopulationChart;