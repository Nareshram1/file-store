"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation'; // Import for refreshing the page

export default function FileUploadForm() {
  const [files, setFiles] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fileTag, setFileTag] = useState('');
  const router = useRouter(); // Get the router instance

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(e.target.files);
      setError(null);
      setSuccess(false);
    }
  };

  // Helper to determine button disabled state
  const isButtonDisabled = uploading || !files || files.length === 0 || !fileTag.trim();

  const handleUpload = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    if (isButtonDisabled) return; // Extra check

    setUploading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('fileTag', fileTag);
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      setSuccess(true);
      // **CRITICAL STEP:** Refresh the page.
      // This tells Next.js to re-run the server component (Page.js)
      // and fetch the new file list.
      router.refresh();

    } catch (e) {
      console.error("Error uploading files:", e);
      setError(`Upload failed: ${e.message}`);
    } finally {
      setUploading(false);
      // Reset the form on success
      if (success) {
        setFiles(null);
        setFileTag('');
        document.getElementById('file-input').value = null;
      }
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800">
        Upload New Files
      </h3>

      {/* File Tag Input */}
      <div>
        <label 
          htmlFor="file-tag" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          File Tag
        </label>
        <input 
          id="file-tag"
          type="text"
          className="block w-full text-gray-900 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter a unique tag..."
          value={fileTag}
          onChange={(e) => setFileTag(e.target.value)}
          disabled={uploading}
        />
      </div>

      {/* File Input */}
      <div>
        <label 
          htmlFor="file-input" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Select Files
        </label>
        <input 
          id="file-input"
          type="file" 
          multiple 
          onChange={handleFileChange} 
          disabled={uploading}
          className="block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
        />
      </div>
      
      {/* Upload Button */}
      <button 
        type="submit"
        disabled={isButtonDisabled}
        className={`w-full px-4 py-2 text-white font-medium rounded-md transition-colors
                    ${isButtonDisabled 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'}
                    ${uploading ? 'animate-pulse' : ''}`}
      >
        {uploading ? `Uploading ${files.length} file(s)...` : "Upload"}
      </button>

      {/* Status Messages */}
      {error && (
        <p className="mt-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-2 text-sm font-medium text-green-600">
          Upload successful! List is refreshing...
        </p>
      )}
    </form>
  );
}