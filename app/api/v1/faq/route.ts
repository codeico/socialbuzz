import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query = supabaseAdmin.from('faqs').select('*').eq('is_active', true).order('sort_order', { ascending: true });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`question.ilike.%${search}%,answer.ilike.%${search}%`);
    }

    const { data: faqs, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: faqs || [],
    });
  } catch (error) {
    console.error('FAQ fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, answer, category } = body;

    // Validate required fields
    if (!question || !answer || !category) {
      return NextResponse.json({ error: 'Question, answer, and category are required' }, { status: 400 });
    }

    const { data: faq, error } = await supabaseAdmin
      .from('faqs')
      .insert({
        question,
        answer,
        category,
        is_active: true,
        sort_order: 999,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'FAQ created successfully',
      data: faq,
    });
  } catch (error) {
    console.error('FAQ creation error:', error);
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
  }
}
