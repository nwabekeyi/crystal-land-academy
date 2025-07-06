// components/RevenueChart.jsx
import React, { useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useTheme, Box, Typography } from '@mui/material';
import { tokens } from '../../../theme';
import useAdminData from './useAdminData';

const RevenueChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = useMemo(() => tokens(theme.palette.mode), [theme.palette.mode]);
  const { financialData, financialDataLoading, financialDataError } = useAdminData();

  // Generate custom colors based on index
  const generateColor = (index) => {
    const hue = (index * 360) / 2 % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  // Transform financialData into ResponsiveLine format
  const data = useMemo(() => {
    // Handle nested data until backend is fixed
    const sourceData = financialData?.data || financialData || { primary: [], secondary: [] };
    if (!sourceData.primary?.length && !sourceData.secondary?.length) {
      return [];
    }
    const sections = ['primary', 'secondary'];
    return sections
      .filter((section) => sourceData[section]?.length)
      .map((section, index) => ({
        id: section.charAt(0).toUpperCase() + section.slice(1),
        color: isCustomLineColors ? generateColor(index) : undefined,
        data: sourceData[section].map((item) => ({
          x: item.label.split(' ')[0], // e.g., "2024/2025"
          y: item.value || 0,
        })),
      }));
  }, [financialData, isCustomLineColors]);

  // Calculate total revenue
  const totalRevenue = useMemo(() => {
    const sourceData = financialData?.data || financialData || { primary: [], secondary: [] };
    const primaryTotal = sourceData.primary?.reduce((sum, item) => sum + (item.value || 0), 0) || 0;
    const secondaryTotal = sourceData.secondary?.reduce((sum, item) => sum + (item.value || 0), 0) || 0;
    return primaryTotal + secondaryTotal;
  }, [financialData]);

  if (financialDataLoading) {
    return <Box>Loading data...</Box>;
  }

  if (financialDataError) {
    return <Box>Error: {financialDataError.message || 'Failed to load financial data'}</Box>;
  }

  if (!data.length) {
    return <Box>No financial data available.</Box>;
  }

  return (
    <Box width="98%" height={isDashboard ? '300px' : '400px'}>
      <Typography variant="subtitle1" sx={{ mb: 2, color: colors.grey[100] }}>
        Total Revenue: ₦{totalRevenue.toLocaleString('en-NG')}
      </Typography>
      <ResponsiveLine
        data={data}
        animate={true}
        motionConfig="default"
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
          tooltip: {
            container: {
              background: colors.primary[500],
              color: colors.grey[100],
              fontSize: 12,
            },
            format: (value) => `₦${value.toLocaleString('en-NG')}`,
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
        yFormat={(value) => `₦${value.toLocaleString('en-NG')}`}
        curve="catmullRom"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 45, // Rotate for longer academic year names
          legend: isDashboard ? undefined : 'Academic Year',
          legendOffset: 36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          tickValues: 5,
          tickSize: 3,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : 'Revenue (₦)',
          legendOffset: -50,
          legendPosition: 'middle',
          format: (value) => `₦${value.toLocaleString('en-NG')}`,
        }}
        enableGridX={false}
        enableGridY={false}
        pointSize={8}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        enablePoints={true}
        enablePointLabel={true}
        pointLabel="y"
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