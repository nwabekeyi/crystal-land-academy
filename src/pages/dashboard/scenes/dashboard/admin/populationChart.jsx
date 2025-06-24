// src/components/dashboard/PopulationChart.jsx
import { ResponsivePie } from '@nivo/pie';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';

const PopulationChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dummyData = [
    { id: 'Kindergarten', label: 'Kindergarten', value: 30 },
    { id: 'Nursery 1', label: 'Nursery 1', value: 28 },
    { id: 'Nursery 2', label: 'Nursery 2', value: 27 },
    { id: 'Primary 1', label: 'Primary 1', value: 35 },
    { id: 'Primary 2', label: 'Primary 2', value: 34 },
    { id: 'Primary 3', label: 'Primary 3', value: 33 },
    { id: 'Primary 4', label: 'Primary 4', value: 32 },
    { id: 'Primary 5', label: 'Primary 5', value: 31 },
    { id: 'Primary 6', label: 'Primary 6', value: 30 },
    { id: 'JSS 1', label: 'JSS 1', value: 36 },
    { id: 'JSS 2', label: 'JSS 2', value: 35 },
    { id: 'JSS 3', label: 'JSS 3', value: 34 },
    { id: 'SS 1', label: 'SS 1', value: 33 },
    { id: 'SS 2', label: 'SS 2', value: 32 },
    { id: 'SS 3', label: 'SS 3', value: 31 },
  ];

  return (
    <div style={{ height: '350px' }}>
      <ResponsivePie
        data={dummyData}
        animate={true}
        motionConfig="default"
        theme={{
          axis: { domain: { line: { stroke: colors.grey[100] } }, legend: { text: { fill: colors.grey[100] } }, ticks: { line: { stroke: colors.grey[100], strokeWidth: 1 }, text: { fill: colors.grey[100] } } },
          legends: { text: { fill: colors.grey[100] } },
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
          },
        ]}
      />
    </div>
  );
};

export default PopulationChart;