import "./index.css";
import React, { useState, lazy, Suspense, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import { CssBaseline, ThemeProvider, Box, Typography, Button } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { useSelector } from "react-redux";
import { tokens } from "./theme";
import SignIn from "../../components/Signin";
import Loader from "../../utils/loader";
import useAuth from '../../hooks/useAuth'
// Lazy load the components
const Dashboard = lazy(() => import("./scenes/dashboard"));
const Team = lazy(() => import("./scenes/team"));
const FinancialManagement = lazy(() => import("./scenes/financialManagement"));
const Contacts = lazy(() => import("./scenes/contacts"));
const Form = lazy(() => import("./scenes/form"));
const Line = lazy(() => import("./scenes/line"));
const Pie = lazy(() => import("./scenes/pie"));
const Enquiries = lazy(() => import("./scenes/enquiries"));
const UserManagement = lazy(() => import("./scenes/userManagement"));
const CourseManagement = lazy(() => import("./scenes/academicYear"));
const Feedbacks = lazy(() => import("./scenes/feebacks"));
const ClassManagement = lazy(() => import("./scenes/classManagement"));
const TimeTable = lazy(() => import("./scenes/timeTable"));
const Assignment = lazy(() => import("./scenes/assignments"));
const LearningPlan = lazy(() => import("./scenes/learningPlan"));
const StudentProgress = lazy(() => import("./scenes/studentProgess"));
const Curriculum = lazy(() => import("./scenes/curriculum"));
const StudentPayment = lazy(() => import("./scenes/studentPayment"));
const InstructorReviews = lazy(() => import("./scenes/instructorReviews"));
const StudentManagement = lazy(() => import("./scenes/studentManagement/studentManagement"));
const StudentInstructors = lazy(() => import("./scenes/studentInstructors"));
const ChatApp = lazy(() => import("../messaging"));
const AnalyticsAndreporting = lazy(() => import("./scenes/analyticsAndreporting"));
const ClassDetails = lazy(() => import("./scenes/teacherClassManagement"));
const StudentExams = lazy(() => import("./scenes/testAndExams/student"));
const AdminTestsAndExams = lazy(() => import("./scenes/testAndExams/admin"));
const SubjectManagement = lazy(() => import("./scenes/subjectManagement"));
const RegistrationCodes = lazy(() => import("./scenes/registrationCode"));

function DashboardHome() {
  const [theme, colorMode] = useMode();
  const [userData, setUserData] = useState(null);
  const colors = tokens(theme.palette.mode);
  const user = useSelector((state) => state.users.user);
  const userRole = user ? user.role : "not logged in";
  const navigate = useNavigate();
  const {logout} = useAuth();

  const gotoHome = () => {
    logout();
    navigate('/');
  }

  useEffect(() => {
    const referrer = document.referrer;
    const referrerPath = referrer ? referrer.split("/") : [];
    const isFromDashboard = referrerPath.some((part) => part === "dashboard");

    console.log(referrerPath);
    console.log(isFromDashboard);
    console.log(referrer);

    if (!isFromDashboard && referrer === "") {
      sessionStorage.setItem("hasReloaded", "true");
      window.location.reload();
    } else {
      sessionStorage.setItem("hasReloaded", "true");
    }
  }, []);

  const renderRoutesBasedOnRole = (role) => {
    switch (role) {
      case "admin":
        return (
          <>
            <Route path="/messenger" element={<ChatApp />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/financialManagement" element={<FinancialManagement />} />
            <Route path="/form" element={<Form />} />
            <Route path="/pie" element={<Pie />} />
            <Route path="/line" element={<Line />} />
            <Route path="/enquiries" element={<Enquiries />} />
            <Route path="/userManagement" element={<UserManagement />} />
            <Route path="/courseManagement" element={<CourseManagement />} />
            <Route path="/feedbacks" element={<Feedbacks />} />
            <Route path="/classManagement" element={<ClassManagement />} />
            <Route path="/analytics" element={<AnalyticsAndreporting />} />
            <Route path="/adminTestsAndExams" element={<AdminTestsAndExams />} />
            <Route path="/subjectManagement" element={<SubjectManagement />} />
            <Route path="/registrationCode" element={<RegistrationCodes />} />
          </>
        );
      case "student":
        return (
          <>
            <Route path="/messenger" element={<ChatApp />} />
            <Route path="/timeTable" element={<TimeTable />} />
            <Route path="/assignment" element={<Assignment />} />
            <Route path="/learningPlan" element={<LearningPlan />} />
            <Route path="/studentProgress" element={<StudentProgress />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/studentPayment" element={<StudentPayment />} />
            <Route path="/studentInstructors" element={<StudentInstructors />} />
            <Route path="/studentExams" element={<StudentExams />} />
          </>
        );
      case "teacher":
        return (
          <>
            <Route path="/messenger" element={<ChatApp />} />
            <Route path="/timeTable" element={<TimeTable />} />
            <Route path="/assignment" element={<Assignment />} />
            <Route path="/learningPlan" element={<LearningPlan />} />
            <Route path="/studentProgress" element={<StudentProgress />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/instructorReviews" element={<InstructorReviews />} />
            <Route path="/classDetails" element={<ClassDetails />} />
            <Route path="/studentManagement" element={<StudentManagement />} />
          </>
        );
      default:
        return null;
    }
  };

  // Check if user is a withdrawn student
  if (userRole === "student" && user?.isWithdrawn) {
    return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              backgroundColor: theme.palette.mode === "light" ? colors.primary[900] : colors.primary[500],
              gap: 3,
              px: 2,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                color: colors.redAccent[500],
                maxWidth: "600px",
              }}
              aria-live="assertive"
            >
              You have been withdrawn and cannot access school information.
            </Typography>
            <Button
              onClick={gotoHome}
              style={{
                color: colors.blueAccent[500],
                textDecoration: "underline",
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
              aria-label="Return to homepage"
            >
              Return to Homepage
            </Button>
          </Box>
        </ThemeProvider>
      </ColorModeContext.Provider>
    );
  }

  return (
    <>
      {userRole === "not logged in" ? (
        <div>
          <SignIn />
        </div>
      ) : (
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
              sx={{
                display: "flex",
                height: "100%",
                backgroundColor:
                  theme.palette.mode === "light" ? colors.primary[900] : colors.primary[500],
                px: 2,
                gap: 1,
              }}
            >
              {/* Sidebar */}
              <Sidebar />
              {/* Content */}
              <Box
                id="dashboard"
                className="content"
                sx={{
                  marginX: "0",
                  width: "100%",
                  backgroundColor: "transparent",
                  height: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "auto",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: "1%",
                }}
              >
                <Box
                  sx={{
                    height: "auto",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "transparent",
                  }}
                >
                  <Topbar userData={userData} />
                </Box>

                {/* Routes */}
                <Box sx={{ overflowY: "auto", width: "100%", height: "100%" }}>
                  <Suspense fallback={<Loader />}>
                    <Routes>
                      <Route
                        path={userRole === "not logged in" ? "/signin" : "/"}
                        element={<Dashboard userData={userData} />}
                      />
                      {userRole && renderRoutesBasedOnRole(userRole)}
                    </Routes>
                  </Suspense>
                </Box>
              </Box>
            </Box>
          </ThemeProvider>
        </ColorModeContext.Provider>
      )}
    </>
  );
}

export default DashboardHome;