import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const MAX_BANNER_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_DOC_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_PRODUCT_LOGO_SIZE = 3 * 1024 * 1024; // 3 MB
const MAX_PRODUCT_SCREENSHOT_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(req: NextRequest) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'tzx0lw2c';
    const apiKey = process.env.CLOUDINARY_API_KEY || '621861736419132';
    const apiSecret = process.env.CLOUDINARY_API_SECRET || 'tlOmGS0EG7zkG-bJ7mLjGr3QifE';

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'pentasent/press/documents';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate avatar / profile image uploads
    if (folder.includes('avatar') || folder.includes('profile')) {
      if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid file format. Only JPEG, PNG, WEBP, and GIF images are supported.',
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_AVATAR_SIZE) {
        return NextResponse.json(
          { success: false, error: 'Profile image exceeds 5MB size limit' },
          { status: 400 }
        );
      }
    }

    // Validate upload size limit
    if (folder.includes('banner') && file.size > MAX_BANNER_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Banner image exceeds 5MB limit' },
        { status: 400 }
      );
    }

    if ((folder.includes('document') || folder.includes('resume')) && file.size > MAX_DOC_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Document or resume exceeds 10MB limit' },
        { status: 400 }
      );
    }

    if (folder.includes('logo') && file.size > MAX_PRODUCT_LOGO_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Product logo exceeds 3MB limit' },
        { status: 400 }
      );
    }

    if (folder.includes('screenshot') && file.size > MAX_PRODUCT_SCREENSHOT_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Product screenshot exceeds 5MB limit' },
        { status: 400 }
      );
    }

    const timestamp = Math.round(new Date().getTime() / 1000);

    // Compute Cloudinary signature: folder=...&timestamp=... + secret
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash('sha1')
      .update(paramsToSign + apiSecret)
      .digest('hex');

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('folder', folder);
    uploadFormData.append('timestamp', timestamp.toString());
    uploadFormData.append('api_key', apiKey);
    uploadFormData.append('signature', signature);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: 'POST',
        body: uploadFormData,
      }
    );

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error('Cloudinary upload failure:', errText);
      return NextResponse.json(
        { success: false, error: 'Failed to upload asset to media storage' },
        { status: 502 }
      );
    }

    const cloudinaryData = await uploadRes.json();

    return NextResponse.json({
      success: true,
      data: {
        url: cloudinaryData.secure_url || cloudinaryData.url,
        publicId: cloudinaryData.public_id,
        bytes: cloudinaryData.bytes,
        format: cloudinaryData.format,
        originalFilename: file.name,
      },
    });
  } catch (error: unknown) {
    console.error('Upload route error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal upload error',
      },
      { status: 500 }
    );
  }
}
