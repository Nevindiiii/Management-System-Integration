import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle, Eye, EyeOff, UserPlus } from 'lucide-react';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Zod schema for registration validation
const registerSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be less than 100 characters'),
  confirmPassword: z.string()
    .min(1, 'Password confirmation is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface SignupProps {
  onRegister?: (data: RegisterData) => void;
}

function signup({ onRegister }: SignupProps) {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    const result = registerSchema.safeParse(formData);
    
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
      if (onRegister) {
        await onRegister(formData);
      }
      
      //  JWT authentication for registration
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      
      if (result.success) {
        // Save user data to localStorage for profile initialization
        try {
          const profileData = {
            userInfo: {
              name: formData.name,
              email: formData.email,
              phone: ''
            },
            profileImage: null
          }
          const encryptedData = btoa(JSON.stringify(profileData))
          localStorage.setItem('userProfile', encryptedData)
        } catch (error) {
          console.error('Error saving initial profile data:', error)
        }
        
        // Show success message
        toast.success('Account created successfully! Please login with your credentials.');
        
        // Navigate to login after successful registration
        navigate('/');
      } else {
        toast.error(result.message || 'Registration failed. Please try again.');
      }
      
    } catch (error) {
      console.error('Register error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-[500px]">
        {/* Register Form Card */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6 transition-all duration-300 ease-in-out">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-300 text-sm">Join us today and get started</p>
          </div>

          {/* Register Form */}
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

            {/* Confirm Password Input */}
            <div className="relative">
              <div className={`flex items-center bg-white/10 rounded-xl px-4 py-4 border transition-all duration-200 ${
                errors.confirmPassword 
                  ? 'border-red-400 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-400/20 bg-red-500/10' 
                  : 'border-white/30 focus-within:border-white/50 focus-within:ring-2 focus-within:ring-white/20 hover:border-white/40'
              }`}>
                <Lock className="w-5 h-5 text-white/70 mr-3" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="flex items-center mt-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-left">
              <button 
                type="button"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black font-semibold py-4 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Login Link */}
            <div className="text-center pt-4">
              <span className="text-gray-300 text-sm">Already have an account? </span>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-white hover:text-gray-300 font-medium text-sm transition-colors"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default signup;
