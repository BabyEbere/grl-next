import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { PHP_API_URL } from '@/lib/config';

export async function POST(request: Request) {
  try {
    await requireAuth();
    
    // We grab the exact FormData stream coming from the front end
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string || 'general';

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    // Since Vercel is a Cloud Edge network, saving files to the local disk (fs.writeFile) will fail and delete the image.
    // Instead, we proxy the exact file payload to the cPanel PHP script, which physically saves it!
    const phpUploadTarget = PHP_API_URL.replace('handler.php', 'upload.php');
    
    // Create a fresh FormData envelope to send securely to PHP
    const proxyData = new FormData();
    proxyData.append('file', file);
    proxyData.append('type', type);

    const backendResp = await fetch(phpUploadTarget, {
      method: 'POST',
      body: proxyData
    });

    const result = await backendResp.json();
    
    if (result.success) {
      // Re-add the absolute URL based on the cPanel Backend Domain
      const apiOrigin = new URL(PHP_API_URL).origin;
      result.url = `${apiOrigin}/${result.path}`;
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 500 });
    }

  } catch (e: any) {
    console.error('Vercel API Upload Error:', e);
    return NextResponse.json({ success: false, message: e.message || 'Server error' }, { status: 500 });
  }
}
