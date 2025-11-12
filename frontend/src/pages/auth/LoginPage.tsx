import { useNavigate } from 'react-router-dom';
import LoginSignup from '@/components/customUi/loginsignup';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    // Simulate successful login
    // In a real app, you would verify credentials here
    console.log('Login successful, redirecting to dashboard...');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-[500px]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-300">
            Sign in to access your dashboard
          </p>
        </div>
        
        <div className='flex justify-center'>
            <LoginSignup onLoginSuccess={handleLoginSuccess}/>
        </div>
      </div>
    </div>
  );
}