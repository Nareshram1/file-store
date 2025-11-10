"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error('Invalid password');
      }

      // On success, redirect to the main page (which is now protected)
      router.push('/'); 
      router.refresh(); // Ensure we get a fresh page load from the server

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Access Required
        </h2>
        
        <div className="mb-4">
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="block w-full text-gray-900 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {error && (
          <p className="text-sm font-medium text-red-600 mb-4">
            {error}
          </p>
        )}

        <button 
          type="submit"
          disabled={loading || !password}
          className="w-full px-4 py-2 text-white font-medium rounded-md transition-colors bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Verifying..." : "Unlock"}
        </button>
      </form>
    </div>
  );
}