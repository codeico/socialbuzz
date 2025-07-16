import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Create payment_sessions table
    const { error: sessionsError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create payment_sessions table for secure session storage
        CREATE TABLE IF NOT EXISTS payment_sessions (
          id SERIAL PRIMARY KEY,
          session_token UUID UNIQUE NOT NULL,
          session_type VARCHAR(50) NOT NULL,
          session_data JSONB NOT NULL,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create index for faster token lookups
        CREATE INDEX IF NOT EXISTS idx_payment_sessions_token ON payment_sessions(session_token);

        -- Create index for automatic cleanup of expired sessions
        CREATE INDEX IF NOT EXISTS idx_payment_sessions_expires_at ON payment_sessions(expires_at);
      `
    });

    if (sessionsError) {
      console.error('Error creating payment_sessions table:', sessionsError);
    }

    // Create payment_links table
    const { error: linksError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create payment_links table for UUID-based payment links
        CREATE TABLE IF NOT EXISTS payment_links (
          id SERIAL PRIMARY KEY,
          uuid UUID UNIQUE NOT NULL,
          creator_id UUID NOT NULL,
          creator_username VARCHAR(255) NOT NULL,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create index for faster UUID lookups
        CREATE INDEX IF NOT EXISTS idx_payment_links_uuid ON payment_links(uuid);

        -- Create index for creator lookups
        CREATE INDEX IF NOT EXISTS idx_payment_links_creator_id ON payment_links(creator_id);

        -- Create index for automatic cleanup of expired links
        CREATE INDEX IF NOT EXISTS idx_payment_links_expires_at ON payment_links(expires_at);
      `
    });

    if (linksError) {
      console.error('Error creating payment_links table:', linksError);
    }

    // If RPC doesn't work, try direct table creation
    if (sessionsError || linksError) {
      // Try creating tables directly
      const { error: directSessionsError } = await supabase
        .from('payment_sessions')
        .select('id')
        .limit(1);

      const { error: directLinksError } = await supabase
        .from('payment_links')
        .select('id')
        .limit(1);

      return NextResponse.json({
        success: true,
        message: 'Migration attempted',
        errors: {
          sessions: sessionsError?.message || directSessionsError?.message,
          links: linksError?.message || directLinksError?.message
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Tables created successfully'
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { success: false, error: 'Migration failed', details: error },
      { status: 500 }
    );
  }
}