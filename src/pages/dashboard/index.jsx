import "./index.css";
import React, { useState, lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { useSelector } from "react-redux";
import FloatingMessageIcon from "./components/floatingMessageIcon";
import { tokens } from "./theme";
import SignIn from "../../components/Signin";
import Loader from "../../utils/loader";
import useWebSocket from "../../hooks/useWebSocket";

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
const CourseManagement = lazy(() => import("./scenes/courseManagement"));
const Feedbacks = lazy(() => import("./scenes/feebacks"));
const Support = lazy(() => import("./scenes/support"));
const TimeTable = lazy(() => import("./scenes/timeTable"));
const Assignment = lazy(() => import("./scenes/assignments"));
const LearningPlan = lazy(() => import("./scenes/learningPlan"));
const StudentProgress = lazy(() => import("./scenes/studentProgess"));
const Curriculum = lazy(() => import("./scenes/curriculum"));
const StudentPayment = lazy(() => import("./scenes/studentPayment"));
const InstructorReviews = lazy(() => import("./scenes/instructorReviews"));
const StudentManagement = lazy(() => import("./scenes/studentManagement/studentManagement"));
const OfflineStudentTable = lazy(() => import("./scenes/offlineStudent/offlineStudent"));
const StudentInstructors = lazy(() => import("./scenes/studentInstructors"));
const ChatApp = lazy(() => import("../messaging"));

function DashboardHome() {
  const [theme, colorMode] = useMode();
  const [userData, setUserData] = useState(null);
  const colors = tokens(theme.palette.mode);
  const user = useSelector((state) => state.users.user);
  const userRole = user ? user.role : "not logged in";
  const { emit, isConnected, listen } = useWebSocket();
  const location = useLocation();

  useEffect(() => {
    // Check if we've already reloaded in this session to prevent infinite loops
    const hasReloaded = sessionStorage.getItem("hasReloaded");

    if (!hasReloaded) {
      const referrer = document.referrer;
      const referrerPath = referrer ? referrer.split("/") : [];
      const isFromDashboard = referrerPath.some((part) => part === "dashboard");

      console.log("Referrer:", referrer);
      console.log("Referrer Path:", referrerPath);
      console.log("Is from dashboard:", isFromDashboard);

      // Reload if the referrer does NOT contain "dashboard" and is not empty
      if (!isFromDashboard && referrer !== "") {
        sessionStorage.setItem("hasReloaded", "true"); // Mark as reloaded
        window.location.reload();
      } else {
        // Mark as loaded even if no reload is needed to prevent re-checking
        sessionStorage.setItem("hasReloaded", "true");
      }
    }
  }, []); // Runs only once on mount

  const renderRoutesBasedOnRole = (role) => {
    switch (role) {
      case "superadmin":
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
            <Route path="/support" element={<Support />} />
            <Route path="/offlineStudents" element={<OfflineStudentTable />} />
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
          </>
        );
      case "instructor":
        return (
          <>
            <Route path="/messenger" element={<ChatApp />} />
            <Route path="/timeTable" element={<TimeTable />} />
            <Route path="/assignment" element={<Assignment />} />
            <Route path="/learningPlan" element={<LearningPlan />} />
            <Route path="/studentProgress" element={<StudentProgress />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/instructorReviews" element={<InstructorReviews />} />
            <Route path="/courseManagement" element={<CourseManagement />} />
            <Route path="/studentManagement" element={<StudentManagement />} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {userRole === "not logged in" ? (
        <div>
          <SignIn />
        </div>
      ) : (
        <ColorModeContext.Provider value={colorMode}>
          <FloatingMessageIcon />
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