import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login, Signup, Dashboard, ProblemDetail } from './pages';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/problem/:id" element={<ProblemDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
