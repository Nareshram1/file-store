import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';

// This API route handles deleting a blob
export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "No URL provided." }, { status: 400 });
    }

    // 'del' takes the blob's URL and deletes it
    await del(url);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "File deletion failed." }, { status: 500 });
  }
}