import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserAuth } from '../store/UserAuthContext';
import { LogIn, UserPlus, Mail, Lock, User, AlertCircle, CheckCircle, ArrowRight, Cpu } from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const { register, login, currentUser } = useUserAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (currentUser) {
      navigate('/portal', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (isLogin) {
      const result = login(formData.email, formData.password);
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setTimeout(() => navigate('/portal', { replace: true }), 1000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } else {
      // Registration
      if (formData.password !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'كلمات المرور غير متطابقة' });
        setIsLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setMessage({ type: 'error', text: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
        setIsLoading(false);
        return;
      }

      const result = register(formData.username, formData.email, formData.password);
      if (result.success) {
        setMessage({ type: 'success', text: result.message + ' - جاري تسجيل الدخول...' });
        setTimeout(() => {
          login(formData.email, formData.password);
          navigate('/portal', { replace: true });
        }, 1500);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#2196F3] rounded-2xl mb-4 shadow-lg shadow-[#2196F3]/20">
            <Cpu className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">MekaMind</h1>
          <p className="text-gray-400">
            {isLogin ? 'تسجيل الدخول لحسابك' : 'إنشاء حساب جديد'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl p-8 shadow-2xl animate-fade-in">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-[#2a2a2a] rounded-lg p-1">
            <button
              onClick={() => { setIsLogin(true); setMessage({ type: '', text: '' }); }}
              className={`flex-1 py-2 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${
                isLogin ? 'bg-[#2196F3] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              تسجيل الدخول
            </button>
            <button
              onClick={() => { setIsLogin(false); setMessage({ type: '', text: '' }); }}
              className={`flex-1 py-2 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${
                !isLogin ? 'bg-[#2196F3] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              حساب جديد
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Message */}
            {message.text && (
              <div className={`rounded-lg p-4 flex items-center gap-3 animate-fade-in ${
                message.type === 'success'
                  ? 'bg-[#4CAF50]/10 border border-[#4CAF50]/30'
                  : 'bg-[#f44336]/10 border border-[#f44336]/30'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-[#4CAF50] flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-[#f44336] flex-shrink-0" />
                )}
                <span className={`text-sm ${
                  message.type === 'success' ? 'text-[#4CAF50]' : 'text-[#f44336]'
                }`}>{message.text}</span>
              </div>
            )}

            {/* Username (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="أحمد محمد"
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg pr-11 pl-4 py-3 text-white placeholder-gray-500 focus:border-[#2196F3] focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg pr-11 pl-4 py-3 text-white placeholder-gray-500 focus:border-[#2196F3] focus:outline-none transition-all"
                  required
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg pr-11 pl-4 py-3 text-white placeholder-gray-500 focus:border-[#2196F3] focus:outline-none transition-all"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Confirm Password (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg pr-11 pl-4 py-3 text-white placeholder-gray-500 focus:border-[#2196F3] focus:outline-none transition-all"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                isLoading
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-[#2196F3] hover:bg-[#1976D2] text-white shadow-lg shadow-[#2196F3]/20'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري المعالجة...</span>
                </>
              ) : isLogin ? (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>تسجيل الدخول</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>إنشاء الحساب</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500 mb-3 text-center">بيانات تجريبية للدخول:</p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between bg-[#2a2a2a] rounded-lg p-2">
                <span className="text-gray-400">ahmed@example.com</span>
                <span className="text-[#2196F3] font-mono">user123</span>
              </div>
              <div className="flex items-center justify-between bg-[#2a2a2a] rounded-lg p-2">
                <span className="text-gray-400">sara@example.com</span>
                <span className="text-[#2196F3] font-mono">user123</span>
              </div>
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

        {/* Guide Link */}
        <div className="text-center mt-4">
          <Link
            to="/guide"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#2196F3] transition-colors"
          >
            📖 دليل الاستخدام الشامل
          </Link>
        </div>
      </div>
    </div>
  );
}
