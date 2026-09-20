import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { Shield, Lock, User, AlertCircle, ArrowRight, Cpu } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAdminAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAdminAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const success = login(username, password);
    
    if (success) {
      navigate('/admin', { replace: true });
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#2196F3] rounded-2xl mb-4 shadow-lg shadow-[#2196F3]/20">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">لوحة الإدارة</h1>
          <p className="text-gray-400">تسجيل دخول مسؤول النظام</p>
        </div>

        {/* Login Form */}
        <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl p-8 shadow-2xl animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-[#f44336]/10 border border-[#f44336]/30 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 text-[#f44336] flex-shrink-0" />
                <span className="text-[#f44336] text-sm">{error}</span>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                اسم المستخدم
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg pr-11 pl-4 py-3 text-white placeholder-gray-500 focus:border-[#2196F3] focus:outline-none transition-all"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg pr-11 pl-4 py-3 text-white placeholder-gray-500 focus:border-[#2196F3] focus:outline-none transition-all"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                isLoading
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-[#2196F3] hover:bg-[#1976D2] text-white shadow-lg shadow-[#2196F3]/20 hover:shadow-[#2196F3]/30'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري التحقق...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>تسجيل الدخول</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex items-start gap-3 text-sm text-gray-500">
              <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                هذه المنطقة محمية ومخصصة لمسؤولي النظام فقط. جميع محاولات الدخول غير المصرح بها يتم تسجيلها.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#2196F3] transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للصفحة الرئيسية</span>
          </Link>
        </div>

        {/* Demo Credentials Hint */}
        <div className="mt-8 bg-[#1e1e1e] border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-2">بيانات تجريبية للدخول:</p>
          <div className="flex items-center justify-center gap-4 text-xs font-mono">
            <span className="text-gray-400">
              المستخدم: <span className="text-[#2196F3]">admin</span>
            </span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400">
              كلمة المرور: <span className="text-[#2196F3]">mekamind2024</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
