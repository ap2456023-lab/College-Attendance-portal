import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TeacherDashboard from "./pages/TeacherDashboard";
import SelectCourse from "./pages/SelectCourse";
import AttendanceForm from "./pages/AttendanceForm";
import AddStudent from "./pages/AddStudent";
import StudentData from "./pages/StudentData";
import ViewStudents from "./pages/ViewStudents";
import ViewReports from "./pages/ViewReports";
import SelectStudent from "./pages/SelectStudent";
import AttendanceHistory from "./pages/AttendanceHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/teacher-login" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/select-course" element={<SelectCourse />} />
        <Route path="/attendance-form" element={<AttendanceForm />} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/student-data" element={<StudentData />} />
        <Route path="/view-students" element={<ViewStudents />} />
        <Route path="/view-reports" element={<ViewReports />} />
        <Route path="/select-student" element={<SelectStudent />} />
        <Route path="/attendance-history" element={<AttendanceHistory/>} />
        


      </Routes>
    </BrowserRouter>
  );
}

export default App;
