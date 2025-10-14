import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await forgotPassword(email);
      
      if (result.success) {
        toast.success(result.message);
        setIsSubmitted(true);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-neutral-800 mb-2">Email Terkirim!</h2>
            <p className="text-neutral-600 mb-6">
              Kami telah mengirimkan link reset password ke email <strong>{email}</strong>. 
              Silakan cek inbox Anda dan ikuti instruksi untuk reset password.
            </p>
            <p className="text-sm text-neutral-500 mb-6">
              Tidak menerima email? Cek folder spam atau 
              <button 
                onClick={() => setIsSubmitted(false)}
                className="text-primary-600 hover:text-primary-700 ml-1"
              >
                kirim ulang
              </button>
            </p>
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-2">Lupa Password?</h2>
          <p className="text-neutral-600">
            Masukkan email Anda dan kami akan mengirimkan link untuk reset password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none relative block w-full px-3 py-3 border border-neutral-300 placeholder-neutral-500 text-neutral-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10"
              placeholder="Masukkan email Anda"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                isLoading
                  ? 'bg-neutral-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengirim...
                </>
              ) : (
                'Kirim Reset Password'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Kembali ke halaman login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;