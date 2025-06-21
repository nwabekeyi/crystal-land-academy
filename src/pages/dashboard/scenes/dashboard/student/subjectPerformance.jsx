// src/components/studentDashboard/SubjectPerformance.jsx
import { ResponsiveLine } from '@nivo/line';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import  useStudentData  from './useStudentData';

const SubjectPerformance = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { subjectPerformance } = useStudentData(); // Assumed to return performance data

  // Dummy data: Performance in Math, English, Science over months
  const dummyData = [
    {
      id: 'Mathematics',
      color: colors.blueAccent[500],
      data: [
        { x: 'Sep', y: 85 }, { x: 'Oct', y: 88 }, { x: 'Nov', y: 90 }, { x: 'Dec', y: 87 },
        { x: 'Jan', y: 92 }, { x: 'Feb', y: 89 }, { x: 'Mar', y: 94 }, { x: 'Apr', y: 91 },
        { x: 'May', y: 93 }, { x: 'Jun', y: 90 },
      ],
    },
    {
      id: 'English',
      color: colors.greenAccent[500],
      data: [
        { x: 'Sep', y: 78 }, { x: 'Oct', y: 80 }, { x: 'Nov', y: 82 }, { x: 'Dec', y: 79 },
        { x: 'Jan', y: 85 }, { x: 'Feb', y: 83 }, { x: 'Mar', y: 87 }, { x: 'Apr', y: 84 },
        { x: 'May', y: 86 }, { x: 'Jun', y: 85 },
      ],
    },
    {
      id: 'Science',
      color: colors.redAccent[500],
      data: [
        { x: 'Sep', y: 80 }, { x: 'Oct', y: 83 }, { x: 'Nov', y: 85 }, { x: 'Dec', y: 82 },
        { x: 'Jan', y: 88 }, { x: 'Feb', y: 86 }, { x: 'Mar', y: 90 }, { x: 'Apr', y: 87 },
        { x: 'May', y: 89 }, { x: 'Jun', y: 88 },
      ],
    },
  ];

  const data = subjectPerformance || dummyData;

  return (
    <div style={{ height: '350px' }}>
      <ResponsiveLine
        data={data}
        theme={{
          axis: { domain: { line: { stroke: colors.grey[100] } }, legend: { text: { fill: colors.grey[100], fontSize: 8 } }, ticks: { line: { stroke: colors.grey[100], strokeWidth: 1 }, text: { fill: colors.grey[100], fontSize: 8 } } },
          legends: { text: { fill: colors.grey[100], fontSize: 8 } },
          tooltip: { container: { color: colors.primary[500] } },
        }}
        colors={{ datum: 'color' }}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 0, max: 100, stacked: false, reverse: false }}
        yFormat=" >-.2f"
        curve="catmullRom"
        axisTop={null}
        axisRight={null}
        axisBottom={{ tickSize: 0, tickPadding: 5, tickRotation: 0, legend: 'Month', legendOffset: 36, legendPosition: 'middle' }}
        axisLeft={{ tickValues: 5, tickSize: 3, tickPadding: 5, tickRotation: 0, legend: 'Score (%)', legendOffset: -40, legendPosition: 'middle' }}
        enableGridX={false}
        enableGridY={false}
        pointSize={8}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={1}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [{ on: 'hover', style: { itemBackground: 'rgba(0, 0, 0, .03)', itemOpacity: 1 } }],
          },
        ]}
      />
    </div>
  );
};

export default SubjectPerformance;