import { list } from '@vercel/blob';
import FileUploadForm from '../components/FileUploadForm';
import FileList from '../components/FileList';

export default async function Page() {
  // 1. Fetch the list of blobs on the server
  const { blobs } = await list();

  return (
    <main className="w-full max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-4xl font-bold text-center text-gray-400 mb-8">
        Echo File Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 2. The Upload Form (Client Component) 
          We'll add `revalidate` so it can refresh the file list after upload.
        */}
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <FileUploadForm />
        </div>

        {/* 3. The File List (Client Component)
          We pass the server-fetched 'blobs' as the initial list.
        */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
          <FileList initialBlobs={blobs} />
        </div>
        
      </div>
    </main>
  );
}