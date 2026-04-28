import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JointPage from './pages/JointPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import ErrorBoundary from './components/ErrorBoundary';
import CursorGlow from './components/CursorGlow';

export default function App() {
  return (
    <ErrorBoundary>
      <CursorGlow />
      <Routes>
        <Route path="/"              element={<HomePage />} />
        <Route path="/joint/:jointId" element={<JointPage />} />
        <Route path="/register"      element={<RegisterPage />} />
        <Route path="/admin"         element={<AdminPage />} />
      </Routes>
    </ErrorBoundary>
  );
}
