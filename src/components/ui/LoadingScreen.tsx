import React from 'react';

interface LoadingScreenProps {
  message?: string;
  showForceLogin?: boolean;
  onForceLogin?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "กำลังตรวจสอบสถานะการเข้าสู่ระบบ...",
  showForceLogin = false,
  onForceLogin
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="h-20 w-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white font-sarabun">ทุน</span>
          </div>
          <h1 className="text-xl font-bold text-secondary-900 font-sarabun">
            ระบบจัดการทุนการศึกษา
          </h1>
        </div>

        {/* Loading Animation */}
        <div className="mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 mx-auto"></div>
        </div>

        {/* Message */}
        <p className="text-secondary-600 font-sarabun mb-6">
          {message}
        </p>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2 mb-8">
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>

        {/* Force Login Button (shows after delay) */}
        {showForceLogin && (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-secondary-200">
            <p className="text-sm text-secondary-600 font-sarabun mb-3">
              การเชื่อมต่อใช้เวลานานกว่าปกติ
            </p>
            <button
              onClick={onForceLogin}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-sarabun transition-colors"
            >
              ไปหน้าเข้าสู่ระบบ
            </button>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-8 text-xs text-secondary-500 font-sarabun">
          <p>หากมีปัญหา กรุณาติดต่อ: scholarship@mahidol.ac.th</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 