import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../scemas/auth';
import { Link, useNavigate } from 'react-router-dom';
import getErrorMessage from '../utils/getErrorMessages.js';
import api from '../api.js';

function Login() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  async function onSubmit(formData) {
    setServerError('');

    try {
      const response = await api.post('/login', formData);

      console.log('Login successful:', response.data);

      navigate('/', { replace: true });
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);

      setServerError(getErrorMessage(error));
    }
  }
  const [showPassword, setShowPassword] = useState(false);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-black px-4 py-10 text-black"
      onMouseMove={(e) =>
        setPointer({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        })
      }
      style={{
        background: `radial-gradient(200px circle at ${pointer.x}% ${pointer.y}%, rgba(245, 239, 239, 0.1), transparent 80%), #1e1c1c`,
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-white p-8 shadow-xl sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-black">
          Welcome Back
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Sign in to continue to your Study Planner.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-black"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              {...register('email')}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-gray-200"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-black"
              >
                Password
              </label>

              <a
                href="/forgot-password"
                className="text-sm font-medium text-gray-600 hover:text-black hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                {...register('password')}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-16 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-gray-200"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-black hover:text-gray-600"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>
          {serverError && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {serverError}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-3.5 font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
            <span>→</span>
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold text-black underline underline-offset-4 hover:text-gray-600"
          >
            Sign up
          </Link>
        </p>

        <div className="mt-8 border-t border-gray-200 pt-5 text-center text-xs text-gray-500">
          Stay focused. Keep learning. Achieve your goals.
        </div>
      </div>
    </div>
  );
}

export default Login;
