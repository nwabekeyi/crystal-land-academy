import React, { useEffect, useState, useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useTheme, Box } from '@mui/material';
import { tokens } from '../../../theme';
import { useSelector } from 'react-redux';

const PerformanceLineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const [lineData, setLineData] = useState([]);
  const [performance, setPerformance] = useState("");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  const theme = useTheme();
  const colors = useMemo(() => tokens(theme.palette.mode), [theme.palette.mode]);
  const assignmentData = useSelector((state) => state.student.assignments);
  const timeTableData = useSelector((state) => state.student.timetable);
  const userId = useSelector((state) => state.users.user.userId);
  const studentId = useSelector((state) => state.users.user.studentId);

  const generateColor = (index) => {
    const hue = (index * 360) / 10 % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  const processMonthlyData = useMemo(() => (data, studentId, type, earliestDate, latestDate) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    const aggregatedData = months.reduce((acc, month) => ({
      ...acc,
      [month]: { total: 0, attended: 0 }
    }), {});

    // Track if current month has timetable data (for attendance only)
    let hasCurrentMonthTimetable = false;
    
    data.forEach(item => {
      const date = new Date(type === 'assignment' ? item.dueDate : item.date);
      const monthIndex = date.getMonth();
      
      if (date < earliestDate || 
          date > latestDate || 
          date.getFullYear() !== currentYear || 
          monthIndex > currentMonth) {
        return;
      }

      const monthName = months[monthIndex];
      
      if (type === 'attendance' && item.done) {
        aggregatedData[monthName].total += 1;
        if (item.attendance?.includes(userId)) {
          aggregatedData[monthName].attended += 1;
        }
        if (monthIndex === currentMonth) {
          hasCurrentMonthTimetable = true;
        }
      } else if (type === 'assignment') {
        aggregatedData[monthName].total += 1;
        if (item.submissions?.some(sub => sub.studentId === studentId)) {
          aggregatedData[monthName].attended += 1;
        }
      }
    });

    return months.map((month, index) => {
      const { total, attended } = aggregatedData[month];
      const rate = total > 0 ? (attended / total) * 100 : 0;
      // For attendance, exclude current month if no timetable exists
      if (type === 'attendance' && index === currentMonth && !hasCurrentMonthTimetable) {
        return { x: month, y: 0 };
      }
      return { 
        x: month, 
        y: index <= currentMonth && total > 0 ? rate : 0 
      };
    });
  }, [currentYear, currentMonth, userId, studentId]);

  const calculatePerformance = (attendanceRate, assignmentRate) => {
    if (attendanceRate === 0 && assignmentRate === 0) return "Yet to start classes";
    const combinedRate = (attendanceRate + assignmentRate) / 2;
    return combinedRate >= 90 ? "A" :
           combinedRate >= 80 ? "B" :
           combinedRate >= 70 ? "C" :
           combinedRate >= 60 ? "D" : "E";
  };

  useEffect(() => {
    const fetchData = () => {
      if (!assignmentData?.length || !timeTableData?.length) {
        setLineData([]);
        return;
      }

      try {
        const firstTimeTableDate = new Date(Math.min(...timeTableData.map(item => new Date(item.date))));
        const firstAssignmentDate = new Date(Math.min(...assignmentData.map(item => new Date(item.dueDate))));
        const earliestDate = new Date(Math.min(firstTimeTableDate, firstAssignmentDate));

        const lastTimeTableDate = new Date(Math.max(...timeTableData.map(item => new Date(item.date))));
        const lastAssignmentDate = new Date(Math.max(...assignmentData.map(item => new Date(item.dueDate))));
        const latestDate = new Date(Math.max(lastTimeTableDate, lastAssignmentDate));

        const assignmentMonthlyData = processMonthlyData(
          assignmentData, 
          studentId, 
          'assignment', 
          earliestDate, 
          latestDate
        );
        const attendanceMonthlyData = processMonthlyData(
          timeTableData, 
          studentId, 
          'attendance', 
          earliestDate, 
          latestDate
        );
        
        // Filter valid months excluding current month if no timetable exists for attendance
        const validAssignmentMonths = assignmentMonthlyData.filter(d => d.y > 0).length;
        const validAttendanceMonths = attendanceMonthlyData.filter((d, i) => 
          d.y > 0 && (i !== currentMonth || timeTableData.some(t => 
            new Date(t.date).getMonth() === currentMonth))
        ).length;

        const assignmentRate = validAssignmentMonths > 0 
          ? assignmentMonthlyData.reduce((acc, curr) => acc + curr.y, 0) / validAssignmentMonths 
          : 0;
        const attendanceRate = validAttendanceMonths > 0 
          ? attendanceMonthlyData.reduce((acc, curr, i) => 
              acc + (i === currentMonth && !timeTableData.some(t => 
                new Date(t.date).getMonth() === currentMonth) ? 0 : curr.y), 
              0) / validAttendanceMonths 
          : 0;

        setPerformance(calculatePerformance(attendanceRate, assignmentRate));
        setLineData([
          {
            id: "Assignments Submitted",
            color: isCustomLineColors ? generateColor(0) : colors.primary[500],
            data: assignmentMonthlyData
          },
          {
            id: "Classes Attended",
            color: isCustomLineColors ? generateColor(1) : colors.primary[600],
            data: attendanceMonthlyData
          }
        ]);
      } catch (error) {
        console.error("Error processing data:", error);
      }
    };

    fetchData();
  }, [assignmentData, timeTableData, studentId, isCustomLineColors, colors.primary, processMonthlyData]);

  if (lineData.length === 0) {
    return <Box sx={{ display: 'grid', placeContent: 'center' }}><p>Your cohort is yet to get a time-table</p></Box>;
  }

  return (
    <Box width="98%" height="100%">
      {performance !== "Yet to start classes" && (
        <Box>
          <h2>Student Performance: {performance}</h2>
        </Box>
      )}
      {performance === "Yet to start classes" && (
        <Box>
          <h2>Yet to start classes</h2>
        </Box>
      )}
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
          legend: isDashboard ? undefined : 'Percentage',
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

export default PerformanceLineChart;