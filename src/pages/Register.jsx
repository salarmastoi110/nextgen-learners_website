import { Link, Navigate } from 'react-router-dom';
import RegisterForm from '../components/forms/RegisterForm';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../utils/constants';

export default function Register() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/portal/dashboard" replace />;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Create your account</h1>
        <p className="auth-card__subtitle">
          Join {APP_NAME} to apply for internships, enrol in courses and earn verifiable
          certificates — it's free.
        </p>
        <RegisterForm />
        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
