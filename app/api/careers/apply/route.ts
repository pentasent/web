import { NextResponse } from 'next/server';
import { jobApplicationSchema } from '@/lib/validations/careers';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the request payload with Zod
    const result = jobApplicationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: result.error.format() },
        { status: 400 }
      );
    }

    const data = result.data;
    const applicationId = `PNT-${Math.floor(100000 + Math.random() * 900000)}`;

    console.log('Pentasent Job Application received:', {
      applicationId,
      ...data,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully!',
        applicationId,
        jobTitle: data.jobTitle,
        candidateName: data.fullName,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Job Application API error:', error);
    return NextResponse.json(
      { error: 'Failed to process application' },
      { status: 500 }
    );
  }
}
