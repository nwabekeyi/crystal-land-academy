// src/hooks/useTeacherData.js
export default function useTeacherData() {
  return {
    termProgress: 80,
    studentAttendance: 90,
    assignmentSubmissionRate: { totalAssignmentRate: 85 },
    nextClass: { subject: 'Mathematics', date: '2025-06-23', time: '10:00 AM', location: 'Room 12' },
    topStudents: [
      { firstName: 'John', lastName: 'Doe', profilePicture: '', performanceScore: 95 },
      { firstName: 'Jane', lastName: 'Smith', profilePicture: '', performanceScore: 92 },
      { firstName: 'Alice', lastName: 'Brown', profilePicture: '', performanceScore: 90 },
    ],
    leastActiveStudents: [
      { firstName: 'Mike', lastName: 'Wilson', profilePicture: '', activityRate: 60 },
      { firstName: 'Sarah', lastName: 'Davis', profilePicture: '', activityRate: 65 },
      { firstName: 'Tom', lastName: 'Clark', profilePicture: '', activityRate: 70 },
    ],
    loading: false,
    error: null,
  };
}