// src/components/studentDashboard/SubjectPerformance.jsx
import { ResponsiveLine } from '@nivo/line';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import useStudentData from './useStudentData';
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

const SubjectPerformance = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { fetchStudentData, loading, error } = useStudentData();
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const result = await fetchStudentData();
      setData(result);
    };
    getData();
  }, [fetchStudentData]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;
  if (!data || !data.subjectPerformance) return <Typography>No performance data available</Typography>;

  const { subjectPerformance } = data;

  return (
    <div style={{ height: '350px' }}>
      <ResponsiveLine
        data={subjectPerformance}
        animate={true}
        motionConfig="default"
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