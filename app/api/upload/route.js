import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { v4 } from 'uuid';
export async function POST(request) {
  try {
    const formData = await request.formData();
    const fileTag = formData.get('fileTag');
    const files = formData.getAll('files'); // 'files' must match the key in FormData

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided." }, { status: 400 });
    }

    // Process all file uploads concurrently
    const uploadPromises = files.map(file => {

      // Use the file's name for the blob
      return put(`${fileTag}/${v4().slice(0, 8)}-${file.name}`, file, {
        access: 'public', 
      });
    });

    const blobs = await Promise.all(uploadPromises);

    // Return the array of blob objects (which include the URL)
    return NextResponse.json({ blobs });

  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json({ error: "File upload failed." }, { status: 500 });
  }
}