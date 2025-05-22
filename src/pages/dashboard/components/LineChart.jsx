import React, { useEffect, useState, useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useTheme, Box } from '@mui/material';
import { tokens } from '../theme';
import { useSelector } from 'react-redux';


const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const [lineData, setLineData] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const theme = useTheme();
  const colors = useMemo(() => tokens(theme.palette.mode), [theme.palette.mode]);
  const students = useSelector((state) => state.adminData.usersData.students);
console.log(students)

  const generateColor = (index) => {
    const hue = (index * 360) / 10 % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  useEffect(() => {
    const fetchData = () => {
      try {

        if (students && students.length > 0) {
          const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];

          // Determine the current year dynamically based on the data
          const years = Array.from(new Set(students.map(user => new Date(user.createdAt).getFullYear())));
          const selectedYear = years.includes(currentYear) ? currentYear : Math.max(...years);

          setCurrentYear(selectedYear); // Update currentYear if needed

          const aggregatedData = {};

          students.forEach(user => {
            const program = user.program;
            const createdAt = user.createdAt ? new Date(user.createdAt) : new Date();
            const createdYear = createdAt.getFullYear();
            const createdMonth = createdAt.getMonth();
            const monthName = months[createdMonth];
            console.log(user)

            if (createdYear !== selectedYear) {
              return; // Skip data if it's not from the selected year
            }

            if (!aggregatedData[program]) {
              aggregatedData[program] = months.map((_, index) => ({
                x: months[index],
                y: 0
              }));
            }

            if (aggregatedData[program][createdMonth]) {
              aggregatedData[program][createdMonth].y += user.amountPaid;
            } else {
              console.warn(`Data point with month index ${createdMonth} is undefined for program ${program}.`);
            }
          });
          console.log(aggregatedData);

          const processedData = Object.keys(aggregatedData).map((program, index) => {
            const seriesData = aggregatedData[program].map(point => ({
              x: point.x || "Unknown",
              y: point.y || 0
            }));

            return {
              id: program,
              color: isCustomLineColors ? generateColor(index) : colors.primary[500],
              data: seriesData
            };
          });

          setLineData(processedData);
        } else {
          console.warn("No data available or data array is empty.");
        }

      } catch (error) {
        console.error("Error fetching data from sessionStorage: ", error);
      }
    };

    fetchData(); // Fetch data on component mount or when currentYear changes

  }, [isCustomLineColors, colors.primary, currentYear]);

  if (lineData.length === 0) {
    return <Box>Loading data...</Box>;
  }

  return (
    <Box width="98%" height="100%">
      <ResponsiveLine
        data={lineData}
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
          orient: 'bottom',
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : 'Month',
          legendOffset: 36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          orient: 'left',
          tickValues: 5,
          tickSize: 3,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : 'Amount Paid',
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

export default LineChart;
