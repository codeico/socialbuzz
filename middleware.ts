import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for certain paths
  const skipPaths = [
    '/api/v1/admin/settings', // Allow settings API
    '/admin/settings', // Allow admin settings page
    '/admin/login', // Allow admin login
    '/api/v1/auth/login', // Allow login API
    '/_next', // Next.js internal
    '/favicon.ico', // Static assets
    '/images', // Static images
    '/fonts', // Static fonts
  ];

  const shouldSkip = skipPaths.some(path => pathname.startsWith(path));
  
  if (shouldSkip) {
    return NextResponse.next();
  }

  try {
    // Get maintenance mode status from database
    const { data: settings, error } = await supabaseAdmin
      .from('system_settings')
      .select('key, value, data_type')
      .in('key', ['maintenance_mode', 'maintenance_message', 'name'])
      .eq('category', 'platform');

    if (!error && settings && settings.length > 0) {
      const settingsMap: any = {};
      
      settings.forEach((setting) => {
        let value = setting.value;
        
        // Parse value based on data_type
        if (setting.data_type === 'boolean') {
          value = value === 'true';
        }
        
        settingsMap[setting.key] = value;
      });

      if (settingsMap.maintenance_mode) {
        const maintenanceMessage = settingsMap.maintenance_message || 
          'We are currently performing maintenance. Please check back later.';
        const platformName = settingsMap.name || 'SocialBuzz';

        // If user is accessing admin routes, allow access
        if (pathname.startsWith('/admin')) {
          return NextResponse.next();
        }

        // Return maintenance page for all other routes
      const maintenanceHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Maintenance Mode - ${platformName}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
            }
            
            .container {
              text-align: center;
              max-width: 600px;
              padding: 2rem;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 20px;
              backdrop-filter: blur(10px);
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }
            
            .icon {
              font-size: 4rem;
              margin-bottom: 1rem;
              display: block;
            }
            
            h1 {
              font-size: 2.5rem;
              font-weight: 700;
              margin-bottom: 1rem;
              color: white;
            }
            
            p {
              font-size: 1.1rem;
              line-height: 1.6;
              opacity: 0.9;
              margin-bottom: 2rem;
            }
            
            .spinner {
              border: 3px solid rgba(255, 255, 255, 0.3);
              border-radius: 50%;
              border-top: 3px solid white;
              width: 40px;
              height: 40px;
              animation: spin 1s linear infinite;
              margin: 0 auto;
            }
            
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            .refresh-info {
              margin-top: 2rem;
              font-size: 0.9rem;
              opacity: 0.8;
            }
            
            @media (max-width: 640px) {
              .container {
                margin: 1rem;
                padding: 1.5rem;
              }
              
              h1 {
                font-size: 2rem;
              }
              
              .icon {
                font-size: 3rem;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <span class="icon">🔧</span>
            <h1>Under Maintenance</h1>
            <p>${maintenanceMessage}</p>
            <div class="spinner"></div>
            <div class="refresh-info">
              <p>We'll be back online shortly. Thank you for your patience!</p>
            </div>
          </div>
          
          <script>
            // Auto refresh every 30 seconds
            setTimeout(() => {
              window.location.reload();
            }, 30000);
          </script>
        </body>
        </html>
      `;

      return new Response(maintenanceHtml, {
        status: 503,
        headers: {
          'Content-Type': 'text/html',
          'Retry-After': '30',
        },
      });
      }
    }
  } catch (error) {
    console.error('Middleware error:', error);
    // If there's an error checking maintenance mode, continue normally
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};