import { NextRequest, NextResponse } from 'next/server';
import { runPipeline } from '@/lib/pipeline/orchestrator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Valid "prompt" string is required' },
        { status: 400 }
      );
    }

    const planResult = runPipeline(prompt);
    return NextResponse.json(planResult, { status: 200 });
  } catch (err: any) {
    console.error('API /api/plan error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
