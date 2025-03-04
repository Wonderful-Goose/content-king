import { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account | ContentCanvas',
  description: 'Create a new ContentCanvas account',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">ContentCanvas</h1>
          <p className="mt-2 text-gray-600">Your content planning and management hub</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
} 