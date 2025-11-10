"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FileList({ initialBlobs }) {
  const router = useRouter();
  // State to track which blob is currently being deleted
  const [deletingUrl, setDeletingUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleDelete = async (url) => {
    setDeletingUrl(url); // Set loading state for this specific item
    setError(null);

    try {
      const response = await fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete file.');
      }

      // **CRITICAL STEP:** Refresh the page to update the list
      router.refresh();

    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setDeletingUrl(null); // Clear loading state
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold text-gray-800">
        Uploaded Files
      </h3>
      {error && (
        <p className="text-sm font-medium text-red-600">
          Error: {error}
        </p>
      )}

      {/* Handle empty state */}
      {initialBlobs.length === 0 ? (
        <p className="text-gray-500 text-sm">No files uploaded yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {initialBlobs.map((blob) => {
            const isDeleting = deletingUrl === blob.url;
            return (
              <li 
                key={blob.pathname} 
                className="py-3 flex justify-between items-center"
              >
                {/* File link */}
                <a 
                  href={blob.downloadUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 hover:underline truncate"
                  title={blob.pathname}
                >
                  {blob.pathname}
                </a>
                
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(blob.url)}
                  disabled={isDeleting}
                  className={`ml-4 px-3 py-1 text-xs font-medium text-white rounded-md transition-colors cursor-pointer
                              ${isDeleting 
                                ? 'bg-gray-400 animate-pulse' 
                                : 'bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500'}
                            `}
                >
                  {isDeleting ? '...' : 'Delete'}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}