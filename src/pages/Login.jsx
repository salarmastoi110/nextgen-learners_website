import { Link, Navigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/forms/LoginForm';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../utils/constants';

export default function Login() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const from = location.state?.from || (user?.role === 'admin' ? '/admin' : '/portal/dashboard');

  if (isAuthenticated) return <Navigate to={from} replace />;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Welcome back 👋</h1>
        <p className="auth-card__subtitle">
          Sign in to manage your applications, courses and certificates at {APP_NAME}.
        </p>
        <LoginForm />
        <p className="auth-card__footer">
          New here? <Link to="/register">Create a free account</Link>
        </p>
      </div>
    </div>
  );
}
