import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login, Signup, Dashboard, ProblemDetail } from './pages';
import { useAuthContext } from './context/AuthContext';

function App() {
  const { authUser } = useAuthContext();
  return (
    <Router>
      <Routes>
        {
          authUser ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/problem/:id" element={<ProblemDetail />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )
        }
      </Routes>
    </Router>
  );
}

export default App;
