import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, User, Eye, EyeOff, LogIn } from 'lucide-react';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Zod schema for login validation
const loginSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters long'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long'),
});

interface LoginData {
  name: string;
  email: string;
  password: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
}

interface LogingProps {
  onLogin?: (data: LoginData) => void;
}

function loging({ onLogin }: LogingProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginData>({
    name: '',
    email: '',
    password: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data with Zod
    const result = loginSchema.safeParse(formData);
    
    if (!result.success) {
      const validationErrors: ValidationErrors = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof ValidationErrors;
        validationErrors[fieldName] = issue.message;
      });
      setErrors(validationErrors);
      return;
    }
    
    // Clear any existing errors
    setErrors({});
    setIsLoading(true);
    
    try {
      // Call onLogin callback if provided
      if (onLogin) {
        await onLogin(formData);
      }
      
      //  JWT authentication
      await login({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      // Show success message
      toast.success('Login successful!');
      
      // Navigate to dashboard after successful login
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-[500px]">
        {/* Login Form Card */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6 transition-all duration-300 ease-in-out">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-300 text-sm">Sign in to your account to continue</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div className="relative">
              <div className={`flex items-center bg-white/10 rounded-xl px-4 py-4 border transition-all duration-200 ${
                errors.name 
                  ? 'border-red-400 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-400/20 bg-red-500/10' 
                  : 'border-white/30 focus-within:border-white/50 focus-within:ring-2 focus-within:ring-white/20 hover:border-white/40'
              }`}>
                <User className="w-5 h-5 text-white/70 mr-3" />
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
                />
              </div>
              {errors.name && (
                <div className="flex items-center mt-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </div>
              )}
            </div>
            
            {/* Email Input */}
            <div className="relative">
              <div className={`flex items-center bg-white/10 rounded-xl px-4 py-4 border transition-all duration-200 ${
                errors.email 
                  ? 'border-red-400 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-400/20 bg-red-500/10' 
                  : 'border-white/30 focus-within:border-white/50 focus-within:ring-2 focus-within:ring-white/20 hover:border-white/40'
              }`}>
                <Mail className="w-5 h-5 text-white/70 mr-3" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
                />
              </div>
              {errors.email && (
                <div className="flex items-center mt-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className={`flex items-center bg-white/10 rounded-xl px-4 py-4 border transition-all duration-200 ${
                errors.password 
                  ? 'border-red-400 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-400/20 bg-red-500/10' 
                  : 'border-white/30 focus-within:border-white/50 focus-within:ring-2 focus-within:ring-white/20 hover:border-white/40'
              }`}>
                <Lock className="w-5 h-5 text-white/70 mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center mt-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-left">
              <button 
                type="button"
                className="text-white hover:text-gray-300 text-sm font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black font-semibold py-4 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Register Link */}
            <div className="text-center pt-4">
              <span className="text-gray-300 text-sm">Don't have an account? </span>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-white hover:text-gray-300 font-medium text-sm transition-colors"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default loging;
