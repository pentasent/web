export interface UploadResult {
  url: string;
  publicId?: string;
  bytes?: number;
  format?: string;
  originalFilename?: string;
}

export async function uploadPressAsset(
  file: File,
  folder: 'pentasent/press/banners' | 'pentasent/press/documents'
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to upload file to media storage');
  }

  return json.data;
}

export async function uploadResumeAsset(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'pentasent/jobs/resumes');

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to upload resume to media storage');
  }

  return json.data;
}

export async function uploadProductMedia(
  file: File,
  type: 'logo' | 'screenshot'
): Promise<UploadResult> {
  const folder = type === 'logo' ? 'pentasent/products/logos' : 'pentasent/products/screenshots';
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to upload product media to storage');
  }

  return json.data;
}

export async function deleteProductMedia(
  url: string,
  productId?: string
): Promise<boolean> {
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:5000/api/v1';
    const res = await fetch(`${apiUrl}/products/media`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ url, productId }),
    });

    const json = await res.json();
    return Boolean(res.ok && json.success);
  } catch (err) {
    console.warn('Failed to delete media asset:', err);
    return false;
  }
}

export async function uploadAvatarAsset(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'pentasent/avatars');

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to upload profile picture to media storage');
  }

  return json.data;
}
