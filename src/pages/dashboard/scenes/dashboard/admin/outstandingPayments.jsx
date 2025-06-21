// src/components/dashboard/OutstandingPayments.jsx
import { ResponsiveBar } from '@nivo/bar';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';

const OutstandingPayments = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dummyData = [
    { class: 'Kindergarten', amount: 5000 },
    { class: 'Nursery', amount: 7000 },
    { class: 'Primary', amount: 12000 },
    { class: 'JSS', amount: 10000 },
    { class: 'SS', amount: 8000 },
  ];

  return (
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
        axisTop={null}
        axisRight={null}
        axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Class Level', legendPosition: 'middle', legendOffset: 32 }}
        axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Outstanding Amount ($)', legendPosition: 'middle', legendOffset: -40 }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      />
    </div>
  );
};

export default OutstandingPayments;