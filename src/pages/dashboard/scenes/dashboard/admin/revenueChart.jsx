import React, { useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useTheme, Box } from '@mui/material';
import { tokens } from '../../../theme';

const RevenueChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = useMemo(() => tokens(theme.palette.mode), [theme.palette.mode]);

  // Generate custom colors based on index
  const generateColor = (index) => {
    const hue = (index * 360) / 2 % 360; // Divide by 2 to space out colors for two series
    return `hsl(${hue}, 70%, 60%)`;
  };

  // Dummy data for revenue from Primary and Secondary sections (Sep 2024 - Jun 2025)
  const dummyData = [
    {
      id: 'Primary',
      color: isCustomLineColors ? generateColor(0) : colors.primary[500],
      data: [
        { x: 'Sep', y: 50000 }, // Enrollment peak
        { x: 'Oct', y: 52000 },
        { x: 'Nov', y: 48000 },
        { x: 'Dec', y: 45000 }, // Holiday dip
        { x: 'Jan', y: 51000 },
        { x: 'Feb', y: 53000 },
        { x: 'Mar', y: 55000 },
        { x: 'Apr', y: 54000 },
        { x: 'May', y: 52000 },
        { x: 'Jun', y: 50000 },
      ],
    },
    {
      id: 'Secondary',
      color: isCustomLineColors ? generateColor(1) : colors.blueAccent[500],
      data: [
        { x: 'Sep', y: 70000 }, // Enrollment peak
        { x: 'Oct', y: 72000 },
        { x: 'Nov', y: 68000 },
        { x: 'Dec', y: 65000 }, // Holiday dip
        { x: 'Jan', y: 71000 },
        { x: 'Feb', y: 73000 },
        { x: 'Mar', y: 75000 },
        { x: 'Apr', y: 74000 },
        { x: 'May', y: 72000 },
        { x: 'Jun', y: 70000 },
      ],
    },
  ];

  // If no data, show loading message
  if (!dummyData || dummyData.length === 0) {
    return <Box>Loading data...</Box>;
  }

  return (
    <Box width="98%" height={isDashboard ? '300px' : '400px'}> {/* Explicit height */}
      <ResponsiveLine
        data={dummyData}
        animate={true}
        motionConfig="default"
        theme={{
          axis: {
            domain: {
              line: {
                stroke: colors.grey[100],
              },
            },
            legend: {
              text: {
                fill: colors.grey[100],
                fontSize: 8,
              },
            },
            ticks: {
              line: {
                stroke: colors.grey[100],
                strokeWidth: 1,
              },
              text: {
                fill: colors.grey[100],
                fontSize: 8,
              },
            },
          },
          legends: {
            text: {
              fill: colors.grey[100],
              fontSize: 8,
            },
          },
          tooltip: {
            container: {
              color: colors.primary[500],
            },
          },
        }}
        colors={isCustomLineColors ? { datum: 'color' } : { scheme: 'nivo' }}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 0,
          max: 'auto',
          stacked: false,
          reverse: false,
        }}
        yFormat=" >-.2f"
        curve="catmullRom"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : 'Month',
          legendOffset: 36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          tickValues: 5,
          tickSize: 3,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : 'Revenue ($)',
          legendOffset: -40,
          legendPosition: 'middle',
        }}
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
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </Box>
  );
};

export default RevenueChart;