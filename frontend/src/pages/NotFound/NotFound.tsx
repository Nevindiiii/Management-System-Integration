import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-sky-100 to-indigo-200 p-6 overflow-hidden relative">
    
 

      
        {/* Icon */}
        <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-black flex items-center justify-center shadow-lg">
          <AlertTriangle className="w-12 h-12 text-white drop-shadow-lg" />
        </div>

        {/* 404 Number */}
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-black mb-3">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-slate-800 mb-2 flex items-center justify-center gap-2">
          
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-slate-600 mb-6 leading-relaxed">
          Uh-oh! Looks like you’ve wandered off the map. 
          The page you’re looking for might have been moved or doesn’t exist.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate('/')}
            className="flex-1 bg-black text-white shadow-md hover:opacity-90 transition-all"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="flex-1 border-black text-black hover:bg-blue-50 transition-all"
          >
            Try Again
          </Button>
        </div>
      </div>
   
  );
}
