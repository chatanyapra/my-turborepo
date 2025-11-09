import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login, Signup, Dashboard, ProblemDetail, ProblemSubmissionPage, ProblemEditPage } from './pages';
import { useAuthContext } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { authUser } = useAuthContext();
  return (
    <Router>
      <Routes>
        {
          !authUser ? (
            <>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/problems/:id" element={<ProblemDetail />} />
              <Route path="/problems/:id/edit" element={<ProblemEditPage />} />
              <Route path="/submit-problem" element={<ProblemSubmissionPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </>
          )
        }
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
