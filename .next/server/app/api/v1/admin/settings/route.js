/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/v1/admin/settings/route";
exports.ids = ["app/api/v1/admin/settings/route"];
exports.modules = {

/***/ "(rsc)/./app/api/v1/admin/settings/route.ts":
/*!********************************************!*\
  !*** ./app/api/v1/admin/settings/route.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   PUT: () => (/* binding */ PUT)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n/* harmony import */ var _lib_supabase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/supabase */ \"(rsc)/./lib/supabase.ts\");\n\n\n\nasync function GET(request) {\n    try {\n        const token = request.headers.get('authorization')?.replace('Bearer ', '');\n        if (!token) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Unauthorized'\n            }, {\n                status: 401\n            });\n        }\n        const decoded = (0,_lib_auth__WEBPACK_IMPORTED_MODULE_1__.verifyToken)(token);\n        if (!decoded) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Invalid token'\n            }, {\n                status: 401\n            });\n        }\n        // Check if user is admin\n        const { data: user, error: userError } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabaseAdmin.from('users').select('role').eq('id', decoded.userId).single();\n        if (userError || ![\n            'admin',\n            'super_admin'\n        ].includes(user.role)) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Forbidden'\n            }, {\n                status: 403\n            });\n        }\n        // Get settings from database or return defaults\n        const { data: settings, error } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabaseAdmin.from('system_settings').select('*').single();\n        // Default settings if none exist\n        const defaultSettings = {\n            platform: {\n                name: 'SocialBuzz',\n                description: 'Creator donation platform',\n                logo_url: '',\n                primary_color: '#6366f1',\n                secondary_color: '#8b5cf6',\n                maintenance_mode: false,\n                maintenance_message: 'We are currently performing maintenance. Please check back later.'\n            },\n            payment: {\n                duitku_merchant_code: process.env.DUITKU_MERCHANT_CODE || '',\n                duitku_api_key: process.env.DUITKU_API_KEY || '',\n                duitku_sandbox_mode: process.env.DUITKU_SANDBOX === 'true',\n                minimum_donation: 5000,\n                maximum_donation: 10000000,\n                platform_fee_percentage: 5,\n                auto_payout_threshold: 100000\n            },\n            email: {\n                smtp_host: process.env.SMTP_HOST || '',\n                smtp_port: parseInt(process.env.SMTP_PORT || '587'),\n                smtp_username: process.env.SMTP_USERNAME || '',\n                smtp_password: process.env.SMTP_PASSWORD || '',\n                smtp_secure: process.env.SMTP_SECURE === 'true',\n                from_email: process.env.FROM_EMAIL || '',\n                from_name: process.env.FROM_NAME || 'SocialBuzz'\n            },\n            security: {\n                session_timeout: 24,\n                max_login_attempts: 5,\n                password_min_length: 8,\n                require_email_verification: true,\n                enable_2fa: false,\n                jwt_secret_rotation_days: 30\n            },\n            features: {\n                user_registration: true,\n                public_profiles: true,\n                donation_goals: true,\n                obs_integration: true,\n                file_uploads: true,\n                max_file_size_mb: 10\n            },\n            notifications: {\n                email_notifications: true,\n                push_notifications: false,\n                admin_email: process.env.ADMIN_EMAIL || '',\n                webhook_url: process.env.WEBHOOK_URL || ''\n            }\n        };\n        const responseSettings = settings?.settings || defaultSettings;\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            data: responseSettings\n        });\n    } catch (error) {\n        console.error('Admin settings fetch error:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to fetch settings'\n        }, {\n            status: 500\n        });\n    }\n}\nasync function PUT(request) {\n    try {\n        const token = request.headers.get('authorization')?.replace('Bearer ', '');\n        if (!token) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Unauthorized'\n            }, {\n                status: 401\n            });\n        }\n        const decoded = (0,_lib_auth__WEBPACK_IMPORTED_MODULE_1__.verifyToken)(token);\n        if (!decoded) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Invalid token'\n            }, {\n                status: 401\n            });\n        }\n        // Check if user is admin\n        const { data: user, error: userError } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabaseAdmin.from('users').select('role').eq('id', decoded.userId).single();\n        if (userError || ![\n            'admin',\n            'super_admin'\n        ].includes(user.role)) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Forbidden'\n            }, {\n                status: 403\n            });\n        }\n        const settings = await request.json();\n        // Validate settings\n        if (!settings.platform?.name || !settings.payment?.minimum_donation) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Invalid settings data'\n            }, {\n                status: 400\n            });\n        }\n        // Check if settings record exists\n        const { data: existingSettings } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabaseAdmin.from('system_settings').select('id').single();\n        if (existingSettings) {\n            // Update existing settings\n            const { error } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabaseAdmin.from('system_settings').update({\n                settings,\n                updated_at: new Date().toISOString(),\n                updated_by: decoded.userId\n            }).eq('id', existingSettings.id);\n            if (error) {\n                throw error;\n            }\n        } else {\n            // Create new settings\n            const { error } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabaseAdmin.from('system_settings').insert({\n                settings,\n                created_by: decoded.userId,\n                updated_by: decoded.userId\n            });\n            if (error) {\n                throw error;\n            }\n        }\n        // Log the settings change\n        await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabaseAdmin.from('admin_logs').insert({\n            admin_id: decoded.userId,\n            action: 'settings_update',\n            details: {\n                changed_sections: Object.keys(settings),\n                timestamp: new Date().toISOString()\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            message: 'Settings updated successfully'\n        });\n    } catch (error) {\n        console.error('Admin settings update error:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to update settings'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3YxL2FkbWluL3NldHRpbmdzL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQXdEO0FBQ2Y7QUFDTTtBQUV4QyxlQUFlRyxJQUFJQyxPQUFvQjtJQUM1QyxJQUFJO1FBQ0YsTUFBTUMsUUFBUUQsUUFBUUUsT0FBTyxDQUFDQyxHQUFHLENBQUMsa0JBQWtCQyxRQUFRLFdBQVc7UUFDdkUsSUFBSSxDQUFDSCxPQUFPO1lBQ1YsT0FBT0wscURBQVlBLENBQUNTLElBQUksQ0FBQztnQkFBRUMsT0FBTztZQUFlLEdBQUc7Z0JBQUVDLFFBQVE7WUFBSTtRQUNwRTtRQUVBLE1BQU1DLFVBQVVYLHNEQUFXQSxDQUFDSTtRQUM1QixJQUFJLENBQUNPLFNBQVM7WUFDWixPQUFPWixxREFBWUEsQ0FBQ1MsSUFBSSxDQUFDO2dCQUFFQyxPQUFPO1lBQWdCLEdBQUc7Z0JBQUVDLFFBQVE7WUFBSTtRQUNyRTtRQUVBLHlCQUF5QjtRQUN6QixNQUFNLEVBQUVFLE1BQU1DLElBQUksRUFBRUosT0FBT0ssU0FBUyxFQUFFLEdBQUcsTUFBTWIsd0RBQWFBLENBQ3pEYyxJQUFJLENBQUMsU0FDTEMsTUFBTSxDQUFDLFFBQ1BDLEVBQUUsQ0FBQyxNQUFNTixRQUFRTyxNQUFNLEVBQ3ZCQyxNQUFNO1FBRVQsSUFBSUwsYUFBYSxDQUFDO1lBQUM7WUFBUztTQUFjLENBQUNNLFFBQVEsQ0FBQ1AsS0FBS1EsSUFBSSxHQUFHO1lBQzlELE9BQU90QixxREFBWUEsQ0FBQ1MsSUFBSSxDQUFDO2dCQUFFQyxPQUFPO1lBQVksR0FBRztnQkFBRUMsUUFBUTtZQUFJO1FBQ2pFO1FBRUEsZ0RBQWdEO1FBQ2hELE1BQU0sRUFBRUUsTUFBTVUsUUFBUSxFQUFFYixLQUFLLEVBQUUsR0FBRyxNQUFNUix3REFBYUEsQ0FDbERjLElBQUksQ0FBQyxtQkFDTEMsTUFBTSxDQUFDLEtBQ1BHLE1BQU07UUFFVCxpQ0FBaUM7UUFDakMsTUFBTUksa0JBQWtCO1lBQ3RCQyxVQUFV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QVFPLE1BQU07WUFDeEI4RSxRQUFRO1lBQ1JDLFNBQVM7Z0JBQ1BDLGtCQUFrQkMsT0FBT0MsSUFBSSxDQUFDOUU7Z0JBQzlCK0UsV0FBVyxJQUFJWixPQUFPQyxXQUFXO1lBQ25DO1FBQ0Y7UUFFRixPQUFPM0YscURBQVlBLENBQUNTLElBQUksQ0FBQztZQUN2QjJFLFNBQVM7WUFDVG1CLFNBQVM7UUFDWDtJQUNGLEVBQUUsT0FBTzdGLE9BQU87UUFDZDJFLFFBQVEzRSxLQUFLLENBQUMsZ0NBQWdDQTtRQUM5QyxPQUFPVixxREFBWUEsQ0FBQ1MsSUFBSSxDQUN0QjtZQUFFQyxPQUFPO1FBQTRCLEdBQ3JDO1lBQUVDLFFBQVE7UUFBSTtJQUVsQjtBQUNGIiwic291cmNlcyI6WyIvVXNlcnMvZXJpY28vc29jaWFsYnV6ei9teS1zb2NpYWxidXp6LWNsb25lL2FwcC9hcGkvdjEvYWRtaW4vc2V0dGluZ3Mvcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJztcbmltcG9ydCB7IHZlcmlmeVRva2VuIH0gZnJvbSAnQC9saWIvYXV0aCc7XG5pbXBvcnQgeyBzdXBhYmFzZUFkbWluIH0gZnJvbSAnQC9saWIvc3VwYWJhc2UnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKHJlcXVlc3Q6IE5leHRSZXF1ZXN0KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgdG9rZW4gPSByZXF1ZXN0LmhlYWRlcnMuZ2V0KCdhdXRob3JpemF0aW9uJyk/LnJlcGxhY2UoJ0JlYXJlciAnLCAnJyk7XG4gICAgaWYgKCF0b2tlbikge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdVbmF1dGhvcml6ZWQnIH0sIHsgc3RhdHVzOiA0MDEgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgZGVjb2RlZCA9IHZlcmlmeVRva2VuKHRva2VuKTtcbiAgICBpZiAoIWRlY29kZWQpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnSW52YWxpZCB0b2tlbicgfSwgeyBzdGF0dXM6IDQwMSB9KTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiB1c2VyIGlzIGFkbWluXG4gICAgY29uc3QgeyBkYXRhOiB1c2VyLCBlcnJvcjogdXNlckVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluXG4gICAgICAuZnJvbSgndXNlcnMnKVxuICAgICAgLnNlbGVjdCgncm9sZScpXG4gICAgICAuZXEoJ2lkJywgZGVjb2RlZC51c2VySWQpXG4gICAgICAuc2luZ2xlKCk7XG5cbiAgICBpZiAodXNlckVycm9yIHx8ICFbJ2FkbWluJywgJ3N1cGVyX2FkbWluJ10uaW5jbHVkZXModXNlci5yb2xlKSkge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdGb3JiaWRkZW4nIH0sIHsgc3RhdHVzOiA0MDMgfSk7XG4gICAgfVxuXG4gICAgLy8gR2V0IHNldHRpbmdzIGZyb20gZGF0YWJhc2Ugb3IgcmV0dXJuIGRlZmF1bHRzXG4gICAgY29uc3QgeyBkYXRhOiBzZXR0aW5ncywgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW5cbiAgICAgIC5mcm9tKCdzeXN0ZW1fc2V0dGluZ3MnKVxuICAgICAgLnNlbGVjdCgnKicpXG4gICAgICAuc2luZ2xlKCk7XG5cbiAgICAvLyBEZWZhdWx0IHNldHRpbmdzIGlmIG5vbmUgZXhpc3RcbiAgICBjb25zdCBkZWZhdWx0U2V0dGluZ3MgPSB7XG4gICAgICBwbGF0Zm9ybToge1xuICAgICAgICBuYW1lOiAnU29jaWFsQnV6eicsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQ3JlYXRvciBkb25hdGlvbiBwbGF0Zm9ybScsXG4gICAgICAgIGxvZ29fdXJsOiAnJyxcbiAgICAgICAgcHJpbWFyeV9jb2xvcjogJyM2MzY2ZjEnLFxuICAgICAgICBzZWNvbmRhcnlfY29sb3I6ICcjOGI1Y2Y2JyxcbiAgICAgICAgbWFpbnRlbmFuY2VfbW9kZTogZmFsc2UsXG4gICAgICAgIG1haW50ZW5hbmNlX21lc3NhZ2U6ICdXZSBhcmUgY3VycmVudGx5IHBlcmZvcm1pbmcgbWFpbnRlbmFuY2UuIFBsZWFzZSBjaGVjayBiYWNrIGxhdGVyLicsXG4gICAgICB9LFxuICAgICAgcGF5bWVudDoge1xuICAgICAgICBkdWl0a3VfbWVyY2hhbnRfY29kZTogcHJvY2Vzcy5lbnYuRFVJVEtVX01FUkNIQU5UX0NPREUgfHwgJycsXG4gICAgICAgIGR1aXRrdV9hcGlfa2V5OiBwcm9jZXNzLmVudi5EVUlUS1VfQVBJX0tFWSB8fCAnJyxcbiAgICAgICAgZHVpdGt1X3NhbmRib3hfbW9kZTogcHJvY2Vzcy5lbnYuRFVJVEtVX1NBTkRCT1ggPT09ICd0cnVlJyxcbiAgICAgICAgbWluaW11bV9kb25hdGlvbjogNTAwMCxcbiAgICAgICAgbWF4aW11bV9kb25hdGlvbjogMTAwMDAwMDAsXG4gICAgICAgIHBsYXRmb3JtX2ZlZV9wZXJjZW50YWdlOiA1LFxuICAgICAgICBhdXRvX3BheW91dF90aHJlc2hvbGQ6IDEwMDAwMCxcbiAgICAgIH0sXG4gICAgICBlbWFpbDoge1xuICAgICAgICBzbXRwX2hvc3Q6IHByb2Nlc3MuZW52LlNNVFBfSE9TVCB8fCAnJyxcbiAgICAgICAgc210cF9wb3J0OiBwYXJzZUludChwcm9jZXNzLmVudi5TTVRQX1BPUlQgfHwgJzU4NycpLFxuICAgICAgICBzbXRwX3VzZXJuYW1lOiBwcm9jZXNzLmVudi5TTVRQX1VTRVJOQU1FIHx8ICcnLFxuICAgICAgICBzbXRwX3Bhc3N3b3JkOiBwcm9jZXNzLmVudi5TTVRQX1BBU1NXT1JEIHx8ICcnLFxuICAgICAgICBzbXRwX3NlY3VyZTogcHJvY2Vzcy5lbnYuU01UUF9TRUNVUkUgPT09ICd0cnVlJyxcbiAgICAgICAgZnJvbV9lbWFpbDogcHJvY2Vzcy5lbnYuRlJPTV9FTUFJTCB8fCAnJyxcbiAgICAgICAgZnJvbV9uYW1lOiBwcm9jZXNzLmVudi5GUk9NX05BTUUgfHwgJ1NvY2lhbEJ1enonLFxuICAgICAgfSxcbiAgICAgIHNlY3VyaXR5OiB7XG4gICAgICAgIHNlc3Npb25fdGltZW91dDogMjQsXG4gICAgICAgIG1heF9sb2dpbl9hdHRlbXB0czogNSxcbiAgICAgICAgcGFzc3dvcmRfbWluX2xlbmd0aDogOCxcbiAgICAgICAgcmVxdWlyZV9lbWFpbF92ZXJpZmljYXRpb246IHRydWUsXG4gICAgICAgIGVuYWJsZV8yZmE6IGZhbHNlLFxuICAgICAgICBqd3Rfc2VjcmV0X3JvdGF0aW9uX2RheXM6IDMwLFxuICAgICAgfSxcbiAgICAgIGZlYXR1cmVzOiB7XG4gICAgICAgIHVzZXJfcmVnaXN0cmF0aW9uOiB0cnVlLFxuICAgICAgICBwdWJsaWNfcHJvZmlsZXM6IHRydWUsXG4gICAgICAgIGRvbmF0aW9uX2dvYWxzOiB0cnVlLFxuICAgICAgICBvYnNfaW50ZWdyYXRpb246IHRydWUsXG4gICAgICAgIGZpbGVfdXBsb2FkczogdHJ1ZSxcbiAgICAgICAgbWF4X2ZpbGVfc2l6ZV9tYjogMTAsXG4gICAgICB9LFxuICAgICAgbm90aWZpY2F0aW9uczoge1xuICAgICAgICBlbWFpbF9ub3RpZmljYXRpb25zOiB0cnVlLFxuICAgICAgICBwdXNoX25vdGlmaWNhdGlvbnM6IGZhbHNlLFxuICAgICAgICBhZG1pbl9lbWFpbDogcHJvY2Vzcy5lbnYuQURNSU5fRU1BSUwgfHwgJycsXG4gICAgICAgIHdlYmhvb2tfdXJsOiBwcm9jZXNzLmVudi5XRUJIT09LX1VSTCB8fCAnJyxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGNvbnN0IHJlc3BvbnNlU2V0dGluZ3MgPSBzZXR0aW5ncz8uc2V0dGluZ3MgfHwgZGVmYXVsdFNldHRpbmdzO1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICBkYXRhOiByZXNwb25zZVNldHRpbmdzLFxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0FkbWluIHNldHRpbmdzIGZldGNoIGVycm9yOicsIGVycm9yKTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IGVycm9yOiAnRmFpbGVkIHRvIGZldGNoIHNldHRpbmdzJyB9LFxuICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUFVUKHJlcXVlc3Q6IE5leHRSZXF1ZXN0KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgdG9rZW4gPSByZXF1ZXN0LmhlYWRlcnMuZ2V0KCdhdXRob3JpemF0aW9uJyk/LnJlcGxhY2UoJ0JlYXJlciAnLCAnJyk7XG4gICAgaWYgKCF0b2tlbikge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdVbmF1dGhvcml6ZWQnIH0sIHsgc3RhdHVzOiA0MDEgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgZGVjb2RlZCA9IHZlcmlmeVRva2VuKHRva2VuKTtcbiAgICBpZiAoIWRlY29kZWQpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnSW52YWxpZCB0b2tlbicgfSwgeyBzdGF0dXM6IDQwMSB9KTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiB1c2VyIGlzIGFkbWluXG4gICAgY29uc3QgeyBkYXRhOiB1c2VyLCBlcnJvcjogdXNlckVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluXG4gICAgICAuZnJvbSgndXNlcnMnKVxuICAgICAgLnNlbGVjdCgncm9sZScpXG4gICAgICAuZXEoJ2lkJywgZGVjb2RlZC51c2VySWQpXG4gICAgICAuc2luZ2xlKCk7XG5cbiAgICBpZiAodXNlckVycm9yIHx8ICFbJ2FkbWluJywgJ3N1cGVyX2FkbWluJ10uaW5jbHVkZXModXNlci5yb2xlKSkge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdGb3JiaWRkZW4nIH0sIHsgc3RhdHVzOiA0MDMgfSk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2V0dGluZ3MgPSBhd2FpdCByZXF1ZXN0Lmpzb24oKTtcblxuICAgIC8vIFZhbGlkYXRlIHNldHRpbmdzXG4gICAgaWYgKCFzZXR0aW5ncy5wbGF0Zm9ybT8ubmFtZSB8fCAhc2V0dGluZ3MucGF5bWVudD8ubWluaW11bV9kb25hdGlvbikge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IGVycm9yOiAnSW52YWxpZCBzZXR0aW5ncyBkYXRhJyB9LFxuICAgICAgICB7IHN0YXR1czogNDAwIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgc2V0dGluZ3MgcmVjb3JkIGV4aXN0c1xuICAgIGNvbnN0IHsgZGF0YTogZXhpc3RpbmdTZXR0aW5ncyB9ID0gYXdhaXQgc3VwYWJhc2VBZG1pblxuICAgICAgLmZyb20oJ3N5c3RlbV9zZXR0aW5ncycpXG4gICAgICAuc2VsZWN0KCdpZCcpXG4gICAgICAuc2luZ2xlKCk7XG5cbiAgICBpZiAoZXhpc3RpbmdTZXR0aW5ncykge1xuICAgICAgLy8gVXBkYXRlIGV4aXN0aW5nIHNldHRpbmdzXG4gICAgICBjb25zdCB7IGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluXG4gICAgICAgIC5mcm9tKCdzeXN0ZW1fc2V0dGluZ3MnKVxuICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICBzZXR0aW5ncyxcbiAgICAgICAgICB1cGRhdGVkX2F0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgdXBkYXRlZF9ieTogZGVjb2RlZC51c2VySWQsXG4gICAgICAgIH0pXG4gICAgICAgIC5lcSgnaWQnLCBleGlzdGluZ1NldHRpbmdzLmlkKTtcblxuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBDcmVhdGUgbmV3IHNldHRpbmdzXG4gICAgICBjb25zdCB7IGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluXG4gICAgICAgIC5mcm9tKCdzeXN0ZW1fc2V0dGluZ3MnKVxuICAgICAgICAuaW5zZXJ0KHtcbiAgICAgICAgICBzZXR0aW5ncyxcbiAgICAgICAgICBjcmVhdGVkX2J5OiBkZWNvZGVkLnVzZXJJZCxcbiAgICAgICAgICB1cGRhdGVkX2J5OiBkZWNvZGVkLnVzZXJJZCxcbiAgICAgICAgfSk7XG5cbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBMb2cgdGhlIHNldHRpbmdzIGNoYW5nZVxuICAgIGF3YWl0IHN1cGFiYXNlQWRtaW5cbiAgICAgIC5mcm9tKCdhZG1pbl9sb2dzJylcbiAgICAgIC5pbnNlcnQoe1xuICAgICAgICBhZG1pbl9pZDogZGVjb2RlZC51c2VySWQsXG4gICAgICAgIGFjdGlvbjogJ3NldHRpbmdzX3VwZGF0ZScsXG4gICAgICAgIGRldGFpbHM6IHtcbiAgICAgICAgICBjaGFuZ2VkX3NlY3Rpb25zOiBPYmplY3Qua2V5cyhzZXR0aW5ncyksXG4gICAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7XG4gICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgbWVzc2FnZTogJ1NldHRpbmdzIHVwZGF0ZWQgc3VjY2Vzc2Z1bGx5JyxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdBZG1pbiBzZXR0aW5ncyB1cGRhdGUgZXJyb3I6JywgZXJyb3IpO1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgIHsgZXJyb3I6ICdGYWlsZWQgdG8gdXBkYXRlIHNldHRpbmdzJyB9LFxuICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgKTtcbiAgfVxufSJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJ2ZXJpZnlUb2tlbiIsInN1cGFiYXNlQWRtaW4iLCJHRVQiLCJyZXF1ZXN0IiwidG9rZW4iLCJoZWFkZXJzIiwiZ2V0IiwicmVwbGFjZSIsImpzb24iLCJlcnJvciIsInN0YXR1cyIsImRlY29kZWQiLCJkYXRhIiwidXNlciIsInVzZXJFcnJvciIsImZyb20iLCJzZWxlY3QiLCJlcSIsInVzZXJJZCIsInNpbmdsZSIsImluY2x1ZGVzIiwicm9sZSIsInNldHRpbmdzIiwiZGVmYXVsdFNldHRpbmdzIiwicGxhdGZvcm0iLCJuYW1lIiwiZGVzY3JpcHRpb24iLCJsb2dvX3VybCIsInByaW1hcnlfY29sb3IiLCJzZWNvbmRhcnlfY29sb3IiLCJtYWludGVuYW5jZV9tb2RlIiwibWFpbnRlbmFuY2VfbWVzc2FnZSIsInBheW1lbnQiLCJkdWl0a3VfbWVyY2hhbnRfY29kZSIsInByb2Nlc3MiLCJlbnYiLCJEVUlUS1VfTUVSQ0hBTlRfQ09ERSIsImR1aXRrdV9hcGlfa2V5IiwiRFVJVEtVX0FQSV9LRVkiLCJkdWl0a3Vfc2FuZGJveF9tb2RlIiwiRFVJVEtVX1NBTkRCT1giLCJtaW5pbXVtX2RvbmF0aW9uIiwibWF4aW11bV9kb25hdGlvbiIsInBsYXRmb3JtX2ZlZV9wZXJjZW50YWdlIiwiYXV0b19wYXlvdXRfdGhyZXNob2xkIiwiZW1haWwiLCJzbXRwX2hvc3QiLCJTTVRQX0hPU1QiLCJzbXRwX3BvcnQiLCJwYXJzZUludCIsIlNNVFBfUE9SVCIsInNtdHBfdXNlcm5hbWUiLCJTTVRQX1VTRVJOQU1FIiwic210cF9wYXNzd29yZCIsIlNNVFBfUEFTU1dPUkQiLCJzbXRwX3NlY3VyZSIsIlNNVFBfU0VDVVJFIiwiZnJvbV9lbWFpbCIsIkZST01fRU1BSUwiLCJmcm9tX25hbWUiLCJGUk9NX05BTUUiLCJzZWN1cml0eSIsInNlc3Npb25fdGltZW91dCIsIm1heF9sb2dpbl9hdHRlbXB0cyIsInBhc3N3b3JkX21pbl9sZW5ndGgiLCJyZXF1aXJlX2VtYWlsX3ZlcmlmaWNhdGlvbiIsImVuYWJsZV8yZmEiLCJqd3Rfc2VjcmV0X3JvdGF0aW9uX2RheXMiLCJmZWF0dXJlcyIsInVzZXJfcmVnaXN0cmF0aW9uIiwicHVibGljX3Byb2ZpbGVzIiwiZG9uYXRpb25fZ29hbHMiLCJvYnNfaW50ZWdyYXRpb24iLCJmaWxlX3VwbG9hZHMiLCJtYXhfZmlsZV9zaXplX21iIiwibm90aWZpY2F0aW9ucyIsImVtYWlsX25vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiLCJhZG1pbl9lbWFpbCIsIkFETUlOX0VNQUlMIiwid2ViaG9va191cmwiLCJXRUJIT09LX1VSTCIsInJlc3BvbnNlU2V0dGluZ3MiLCJzdWNjZXNzIiwiY29uc29sZSIsIlBVVCIsImV4aXN0aW5nU2V0dGluZ3MiLCJ1cGRhdGUiLCJ1cGRhdGVkX2F0IiwiRGF0ZSIsInRvSVNPU3RyaW5nIiwidXBkYXRlZF9ieSIsImlkIiwiaW5zZXJ0IiwiY3JlYXRlZF9ieSIsImFkbWluX2lkIiwiYWN0aW9uIiwiZGV0YWlscyIsImNoYW5nZWRfc2VjdGlvbnMiLCJPYmplY3QiLCJrZXlzIiwidGltZXN0YW1wIiwibWVzc2FnZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/v1/admin/settings/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   extractTokenFromHeader: () => (/* binding */ extractTokenFromHeader),\n/* harmony export */   generateResetToken: () => (/* binding */ generateResetToken),\n/* harmony export */   generateToken: () => (/* binding */ generateToken),\n/* harmony export */   hashPassword: () => (/* binding */ hashPassword),\n/* harmony export */   isAdmin: () => (/* binding */ isAdmin),\n/* harmony export */   isSuperAdmin: () => (/* binding */ isSuperAdmin),\n/* harmony export */   verifyPassword: () => (/* binding */ verifyPassword),\n/* harmony export */   verifyResetToken: () => (/* binding */ verifyResetToken),\n/* harmony export */   verifyToken: () => (/* binding */ verifyToken)\n/* harmony export */ });\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jsonwebtoken */ \"(rsc)/./node_modules/jsonwebtoken/index.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';\nconst JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';\nconst hashPassword = async (password)=>{\n    const saltRounds = 12;\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_1___default().hash(password, saltRounds);\n};\nconst verifyPassword = async (password, hashedPassword)=>{\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_1___default().compare(password, hashedPassword);\n};\nconst generateToken = (user)=>{\n    return jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__.sign({\n        id: user.id,\n        email: user.email,\n        username: user.username,\n        role: user.role\n    }, JWT_SECRET, {\n        expiresIn: JWT_EXPIRES_IN\n    });\n};\nconst verifyToken = (token)=>{\n    try {\n        const decoded = jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__.verify(token, JWT_SECRET);\n        return {\n            userId: decoded.id,\n            email: decoded.email,\n            username: decoded.username,\n            role: decoded.role\n        };\n    } catch (error) {\n        return null;\n    }\n};\nconst generateResetToken = (email)=>{\n    return jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__.sign({\n        email\n    }, JWT_SECRET, {\n        expiresIn: '1h'\n    });\n};\nconst verifyResetToken = (token)=>{\n    try {\n        const decoded = jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__.verify(token, JWT_SECRET);\n        return decoded.email;\n    } catch (error) {\n        return null;\n    }\n};\nconst extractTokenFromHeader = (authHeader)=>{\n    if (!authHeader) {\n        return null;\n    }\n    const parts = authHeader.split(' ');\n    if (parts.length !== 2 || parts[0] !== 'Bearer') {\n        return null;\n    }\n    return parts[1];\n};\nconst isAdmin = (user)=>{\n    return user.role === 'admin' || user.role === 'super_admin';\n};\nconst isSuperAdmin = (user)=>{\n    return user.role === 'super_admin';\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQW9DO0FBQ047QUFHOUIsTUFBTUUsYUFBYUMsUUFBUUMsR0FBRyxDQUFDRixVQUFVLElBQUk7QUFDN0MsTUFBTUcsaUJBQWlCRixRQUFRQyxHQUFHLENBQUNDLGNBQWMsSUFBSTtBQUU5QyxNQUFNQyxlQUFlLE9BQU9DO0lBQ2pDLE1BQU1DLGFBQWE7SUFDbkIsT0FBT1Asb0RBQVcsQ0FBQ00sVUFBVUM7QUFDL0IsRUFBRTtBQUVLLE1BQU1FLGlCQUFpQixPQUM1QkgsVUFDQUk7SUFFQSxPQUFPVix1REFBYyxDQUFDTSxVQUFVSTtBQUNsQyxFQUFFO0FBRUssTUFBTUUsZ0JBQWdCLENBQUNDO0lBQzVCLE9BQU9kLDhDQUFRLENBQ2I7UUFDRWdCLElBQUlGLEtBQUtFLEVBQUU7UUFDWEMsT0FBT0gsS0FBS0csS0FBSztRQUNqQkMsVUFBVUosS0FBS0ksUUFBUTtRQUN2QkMsTUFBTUwsS0FBS0ssSUFBSTtJQUNqQixHQUNBakIsWUFDQTtRQUFFa0IsV0FBV2Y7SUFBZTtBQUVoQyxFQUFFO0FBRUssTUFBTWdCLGNBQWMsQ0FBQ0M7SUFDMUIsSUFBSTtRQUNGLE1BQU1DLFVBQVV2QixnREFBVSxDQUFDc0IsT0FBT3BCO1FBQ2xDLE9BQU87WUFDTHVCLFFBQVFGLFFBQVFQLEVBQUU7WUFDbEJDLE9BQU9NLFFBQVFOLEtBQUs7WUFDcEJDLFVBQVVLLFFBQVFMLFFBQVE7WUFDMUJDLE1BQU1JLFFBQVFKLElBQUk7UUFDcEI7SUFDRixFQUFFLE9BQU9PLE9BQU87UUFDZCxPQUFPO0lBQ1Q7QUFDRixFQUFFO0FBRUssTUFBTUMscUJBQXFCLENBQUNWO0lBQ2pDLE9BQU9qQiw4Q0FBUSxDQUFDO1FBQUVpQjtJQUFNLEdBQUdmLFlBQVk7UUFBRWtCLFdBQVc7SUFBSztBQUMzRCxFQUFFO0FBRUssTUFBTVEsbUJBQW1CLENBQUNOO0lBQy9CLElBQUk7UUFDRixNQUFNQyxVQUFVdkIsZ0RBQVUsQ0FBQ3NCLE9BQU9wQjtRQUNsQyxPQUFPcUIsUUFBUU4sS0FBSztJQUN0QixFQUFFLE9BQU9TLE9BQU87UUFDZCxPQUFPO0lBQ1Q7QUFDRixFQUFFO0FBRUssTUFBTUcseUJBQXlCLENBQUNDO0lBQ3JDLElBQUksQ0FBQ0EsWUFBWTtRQUNmLE9BQU87SUFDVDtJQUVBLE1BQU1DLFFBQVFELFdBQVdFLEtBQUssQ0FBQztJQUMvQixJQUFJRCxNQUFNRSxNQUFNLEtBQUssS0FBS0YsS0FBSyxDQUFDLEVBQUUsS0FBSyxVQUFVO1FBQy9DLE9BQU87SUFDVDtJQUVBLE9BQU9BLEtBQUssQ0FBQyxFQUFFO0FBQ2pCLEVBQUU7QUFFSyxNQUFNRyxVQUFVLENBQUNwQjtJQUN0QixPQUFPQSxLQUFLSyxJQUFJLEtBQUssV0FBV0wsS0FBS0ssSUFBSSxLQUFLO0FBQ2hELEVBQUU7QUFFSyxNQUFNZ0IsZUFBZSxDQUFDckI7SUFDM0IsT0FBT0EsS0FBS0ssSUFBSSxLQUFLO0FBQ3ZCLEVBQUUiLCJzb3VyY2VzIjpbIi9Vc2Vycy9lcmljby9zb2NpYWxidXp6L215LXNvY2lhbGJ1enotY2xvbmUvbGliL2F1dGgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgand0IGZyb20gJ2pzb253ZWJ0b2tlbic7XG5pbXBvcnQgYmNyeXB0IGZyb20gJ2JjcnlwdGpzJztcbmltcG9ydCB7IEF1dGhVc2VyIH0gZnJvbSAnQC90eXBlcy91c2VyJztcblxuY29uc3QgSldUX1NFQ1JFVCA9IHByb2Nlc3MuZW52LkpXVF9TRUNSRVQgfHwgJ3lvdXItc2VjcmV0LWtleSc7XG5jb25zdCBKV1RfRVhQSVJFU19JTiA9IHByb2Nlc3MuZW52LkpXVF9FWFBJUkVTX0lOIHx8ICc3ZCc7XG5cbmV4cG9ydCBjb25zdCBoYXNoUGFzc3dvcmQgPSBhc3luYyAocGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gIGNvbnN0IHNhbHRSb3VuZHMgPSAxMjtcbiAgcmV0dXJuIGJjcnlwdC5oYXNoKHBhc3N3b3JkLCBzYWx0Um91bmRzKTtcbn07XG5cbmV4cG9ydCBjb25zdCB2ZXJpZnlQYXNzd29yZCA9IGFzeW5jIChcbiAgcGFzc3dvcmQ6IHN0cmluZyxcbiAgaGFzaGVkUGFzc3dvcmQ6IHN0cmluZyxcbik6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuICByZXR1cm4gYmNyeXB0LmNvbXBhcmUocGFzc3dvcmQsIGhhc2hlZFBhc3N3b3JkKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZW5lcmF0ZVRva2VuID0gKHVzZXI6IGFueSk6IHN0cmluZyA9PiB7XG4gIHJldHVybiBqd3Quc2lnbihcbiAgICB7XG4gICAgICBpZDogdXNlci5pZCxcbiAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgdXNlcm5hbWU6IHVzZXIudXNlcm5hbWUsXG4gICAgICByb2xlOiB1c2VyLnJvbGUsXG4gICAgfSxcbiAgICBKV1RfU0VDUkVULFxuICAgIHsgZXhwaXJlc0luOiBKV1RfRVhQSVJFU19JTiB9LFxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IHZlcmlmeVRva2VuID0gKHRva2VuOiBzdHJpbmcpOiB7IHVzZXJJZDogc3RyaW5nOyBlbWFpbDogc3RyaW5nOyB1c2VybmFtZTogc3RyaW5nOyByb2xlOiBzdHJpbmcgfSB8IG51bGwgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGRlY29kZWQgPSBqd3QudmVyaWZ5KHRva2VuLCBKV1RfU0VDUkVUKSBhcyBhbnk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVzZXJJZDogZGVjb2RlZC5pZCxcbiAgICAgIGVtYWlsOiBkZWNvZGVkLmVtYWlsLFxuICAgICAgdXNlcm5hbWU6IGRlY29kZWQudXNlcm5hbWUsXG4gICAgICByb2xlOiBkZWNvZGVkLnJvbGUsXG4gICAgfTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGdlbmVyYXRlUmVzZXRUb2tlbiA9IChlbWFpbDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgcmV0dXJuIGp3dC5zaWduKHsgZW1haWwgfSwgSldUX1NFQ1JFVCwgeyBleHBpcmVzSW46ICcxaCcgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgdmVyaWZ5UmVzZXRUb2tlbiA9ICh0b2tlbjogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgZGVjb2RlZCA9IGp3dC52ZXJpZnkodG9rZW4sIEpXVF9TRUNSRVQpIGFzIGFueTtcbiAgICByZXR1cm4gZGVjb2RlZC5lbWFpbDtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RUb2tlbkZyb21IZWFkZXIgPSAoYXV0aEhlYWRlcjogc3RyaW5nIHwgbnVsbCk6IHN0cmluZyB8IG51bGwgPT4ge1xuICBpZiAoIWF1dGhIZWFkZXIpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IHBhcnRzID0gYXV0aEhlYWRlci5zcGxpdCgnICcpO1xuICBpZiAocGFydHMubGVuZ3RoICE9PSAyIHx8IHBhcnRzWzBdICE9PSAnQmVhcmVyJykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHBhcnRzWzFdO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzQWRtaW4gPSAodXNlcjogQXV0aFVzZXIpOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIHVzZXIucm9sZSA9PT0gJ2FkbWluJyB8fCB1c2VyLnJvbGUgPT09ICdzdXBlcl9hZG1pbic7XG59O1xuXG5leHBvcnQgY29uc3QgaXNTdXBlckFkbWluID0gKHVzZXI6IEF1dGhVc2VyKTogYm9vbGVhbiA9PiB7XG4gIHJldHVybiB1c2VyLnJvbGUgPT09ICdzdXBlcl9hZG1pbic7XG59O1xuIl0sIm5hbWVzIjpbImp3dCIsImJjcnlwdCIsIkpXVF9TRUNSRVQiLCJwcm9jZXNzIiwiZW52IiwiSldUX0VYUElSRVNfSU4iLCJoYXNoUGFzc3dvcmQiLCJwYXNzd29yZCIsInNhbHRSb3VuZHMiLCJoYXNoIiwidmVyaWZ5UGFzc3dvcmQiLCJoYXNoZWRQYXNzd29yZCIsImNvbXBhcmUiLCJnZW5lcmF0ZVRva2VuIiwidXNlciIsInNpZ24iLCJpZCIsImVtYWlsIiwidXNlcm5hbWUiLCJyb2xlIiwiZXhwaXJlc0luIiwidmVyaWZ5VG9rZW4iLCJ0b2tlbiIsImRlY29kZWQiLCJ2ZXJpZnkiLCJ1c2VySWQiLCJlcnJvciIsImdlbmVyYXRlUmVzZXRUb2tlbiIsInZlcmlmeVJlc2V0VG9rZW4iLCJleHRyYWN0VG9rZW5Gcm9tSGVhZGVyIiwiYXV0aEhlYWRlciIsInBhcnRzIiwic3BsaXQiLCJsZW5ndGgiLCJpc0FkbWluIiwiaXNTdXBlckFkbWluIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/supabase.ts":
/*!*************************!*\
  !*** ./lib/supabase.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   STORAGE_BUCKETS: () => (/* binding */ STORAGE_BUCKETS),\n/* harmony export */   createSignedUrl: () => (/* binding */ createSignedUrl),\n/* harmony export */   deleteFile: () => (/* binding */ deleteFile),\n/* harmony export */   getPublicUrl: () => (/* binding */ getPublicUrl),\n/* harmony export */   supabase: () => (/* binding */ supabase),\n/* harmony export */   supabaseAdmin: () => (/* binding */ supabaseAdmin),\n/* harmony export */   uploadFile: () => (/* binding */ uploadFile)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/@supabase/supabase-js/dist/module/index.js\");\n\nconst supabaseUrl = \"https://swhkbukgkafoqyvljmrd.supabase.co\";\nconst supabaseAnonKey = \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3aGtidWtna2Fmb3F5dmxqbXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMDU1NzIsImV4cCI6MjA2Nzc4MTU3Mn0.kd0xWVLhcS0Ywog6-6CwmS4PRgz4hkyNibZGUSSRMRE\";\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseAnonKey);\nconst supabaseAdmin = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);\nconst STORAGE_BUCKETS = {\n    AVATARS: 'avatars',\n    UPLOADS: 'uploads',\n    ASSETS: 'assets'\n};\nconst uploadFile = async (file, bucket, path)=>{\n    const { data, error } = await supabase.storage.from(STORAGE_BUCKETS[bucket]).upload(path, file, {\n        cacheControl: '3600',\n        upsert: false\n    });\n    if (error) {\n        throw new Error(`Upload failed: ${error.message}`);\n    }\n    return data;\n};\nconst getPublicUrl = (bucket, path)=>{\n    const { data } = supabase.storage.from(STORAGE_BUCKETS[bucket]).getPublicUrl(path);\n    return data.publicUrl;\n};\nconst deleteFile = async (bucket, path)=>{\n    const { error } = await supabase.storage.from(STORAGE_BUCKETS[bucket]).remove([\n        path\n    ]);\n    if (error) {\n        throw new Error(`Delete failed: ${error.message}`);\n    }\n};\nconst createSignedUrl = async (bucket, path, expiresIn = 3600)=>{\n    const { data, error } = await supabase.storage.from(STORAGE_BUCKETS[bucket]).createSignedUrl(path, expiresIn);\n    if (error) {\n        throw new Error(`Create signed URL failed: ${error.message}`);\n    }\n    return data;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc3VwYWJhc2UudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBcUQ7QUFHckQsTUFBTUMsY0FBY0MsMENBQW9DO0FBQ3hELE1BQU1HLGtCQUFrQkgsa05BQXlDO0FBRTFELE1BQU1LLFdBQVdQLG1FQUFZQSxDQUFXQyxhQUFhSSxpQkFBaUI7QUFFdEUsTUFBTUcsZ0JBQWdCUixtRUFBWUEsQ0FDdkNDLGFBQ0FDLFFBQVFDLEdBQUcsQ0FBQ00seUJBQXlCLEVBQ3JDO0FBRUssTUFBTUMsa0JBQWtCO0lBQzdCQyxTQUFTO0lBQ1RDLFNBQVM7SUFDVEMsUUFBUTtBQUNWLEVBQVc7QUFFSixNQUFNQyxhQUFhLE9BQ3hCQyxNQUNBQyxRQUNBQztJQUVBLE1BQU0sRUFBRUMsSUFBSSxFQUFFQyxLQUFLLEVBQUUsR0FBRyxNQUFNWixTQUFTYSxPQUFPLENBQzNDQyxJQUFJLENBQUNYLGVBQWUsQ0FBQ00sT0FBTyxFQUM1Qk0sTUFBTSxDQUFDTCxNQUFNRixNQUFNO1FBQ2xCUSxjQUFjO1FBQ2RDLFFBQVE7SUFDVjtJQUVGLElBQUlMLE9BQU87UUFDVCxNQUFNLElBQUlNLE1BQU0sQ0FBQyxlQUFlLEVBQUVOLE1BQU1PLE9BQU8sRUFBRTtJQUNuRDtJQUVBLE9BQU9SO0FBQ1QsRUFBRTtBQUVLLE1BQU1TLGVBQWUsQ0FDMUJYLFFBQ0FDO0lBRUEsTUFBTSxFQUFFQyxJQUFJLEVBQUUsR0FBR1gsU0FBU2EsT0FBTyxDQUM5QkMsSUFBSSxDQUFDWCxlQUFlLENBQUNNLE9BQU8sRUFDNUJXLFlBQVksQ0FBQ1Y7SUFFaEIsT0FBT0MsS0FBS1UsU0FBUztBQUN2QixFQUFFO0FBRUssTUFBTUMsYUFBYSxPQUN4QmIsUUFDQUM7SUFFQSxNQUFNLEVBQUVFLEtBQUssRUFBRSxHQUFHLE1BQU1aLFNBQVNhLE9BQU8sQ0FDckNDLElBQUksQ0FBQ1gsZUFBZSxDQUFDTSxPQUFPLEVBQzVCYyxNQUFNLENBQUM7UUFBQ2I7S0FBSztJQUVoQixJQUFJRSxPQUFPO1FBQ1QsTUFBTSxJQUFJTSxNQUFNLENBQUMsZUFBZSxFQUFFTixNQUFNTyxPQUFPLEVBQUU7SUFDbkQ7QUFDRixFQUFFO0FBRUssTUFBTUssa0JBQWtCLE9BQzdCZixRQUNBQyxNQUNBZSxZQUFvQixJQUFJO0lBRXhCLE1BQU0sRUFBRWQsSUFBSSxFQUFFQyxLQUFLLEVBQUUsR0FBRyxNQUFNWixTQUFTYSxPQUFPLENBQzNDQyxJQUFJLENBQUNYLGVBQWUsQ0FBQ00sT0FBTyxFQUM1QmUsZUFBZSxDQUFDZCxNQUFNZTtJQUV6QixJQUFJYixPQUFPO1FBQ1QsTUFBTSxJQUFJTSxNQUFNLENBQUMsMEJBQTBCLEVBQUVOLE1BQU1PLE9BQU8sRUFBRTtJQUM5RDtJQUVBLE9BQU9SO0FBQ1QsRUFBRSIsInNvdXJjZXMiOlsiL1VzZXJzL2VyaWNvL3NvY2lhbGJ1enovbXktc29jaWFsYnV6ei1jbG9uZS9saWIvc3VwYWJhc2UudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSAnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJztcbmltcG9ydCB7IERhdGFiYXNlIH0gZnJvbSAnQC90eXBlcy9kYXRhYmFzZSc7XG5cbmNvbnN0IHN1cGFiYXNlVXJsID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMITtcbmNvbnN0IHN1cGFiYXNlQW5vbktleSA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZITtcblxuZXhwb3J0IGNvbnN0IHN1cGFiYXNlID0gY3JlYXRlQ2xpZW50PERhdGFiYXNlPihzdXBhYmFzZVVybCwgc3VwYWJhc2VBbm9uS2V5KTtcblxuZXhwb3J0IGNvbnN0IHN1cGFiYXNlQWRtaW4gPSBjcmVhdGVDbGllbnQ8RGF0YWJhc2U+KFxuICBzdXBhYmFzZVVybCxcbiAgcHJvY2Vzcy5lbnYuU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWSEsXG4pO1xuXG5leHBvcnQgY29uc3QgU1RPUkFHRV9CVUNLRVRTID0ge1xuICBBVkFUQVJTOiAnYXZhdGFycycsXG4gIFVQTE9BRFM6ICd1cGxvYWRzJyxcbiAgQVNTRVRTOiAnYXNzZXRzJyxcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCBjb25zdCB1cGxvYWRGaWxlID0gYXN5bmMgKFxuICBmaWxlOiBGaWxlLFxuICBidWNrZXQ6IGtleW9mIHR5cGVvZiBTVE9SQUdFX0JVQ0tFVFMsXG4gIHBhdGg6IHN0cmluZyxcbikgPT4ge1xuICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5zdG9yYWdlXG4gICAgLmZyb20oU1RPUkFHRV9CVUNLRVRTW2J1Y2tldF0pXG4gICAgLnVwbG9hZChwYXRoLCBmaWxlLCB7XG4gICAgICBjYWNoZUNvbnRyb2w6ICczNjAwJyxcbiAgICAgIHVwc2VydDogZmFsc2UsXG4gICAgfSk7XG5cbiAgaWYgKGVycm9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBVcGxvYWQgZmFpbGVkOiAke2Vycm9yLm1lc3NhZ2V9YCk7XG4gIH1cblxuICByZXR1cm4gZGF0YTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRQdWJsaWNVcmwgPSAoXG4gIGJ1Y2tldDoga2V5b2YgdHlwZW9mIFNUT1JBR0VfQlVDS0VUUyxcbiAgcGF0aDogc3RyaW5nLFxuKSA9PiB7XG4gIGNvbnN0IHsgZGF0YSB9ID0gc3VwYWJhc2Uuc3RvcmFnZVxuICAgIC5mcm9tKFNUT1JBR0VfQlVDS0VUU1tidWNrZXRdKVxuICAgIC5nZXRQdWJsaWNVcmwocGF0aCk7XG5cbiAgcmV0dXJuIGRhdGEucHVibGljVXJsO1xufTtcblxuZXhwb3J0IGNvbnN0IGRlbGV0ZUZpbGUgPSBhc3luYyAoXG4gIGJ1Y2tldDoga2V5b2YgdHlwZW9mIFNUT1JBR0VfQlVDS0VUUyxcbiAgcGF0aDogc3RyaW5nLFxuKSA9PiB7XG4gIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLnN0b3JhZ2VcbiAgICAuZnJvbShTVE9SQUdFX0JVQ0tFVFNbYnVja2V0XSlcbiAgICAucmVtb3ZlKFtwYXRoXSk7XG5cbiAgaWYgKGVycm9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBEZWxldGUgZmFpbGVkOiAke2Vycm9yLm1lc3NhZ2V9YCk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVTaWduZWRVcmwgPSBhc3luYyAoXG4gIGJ1Y2tldDoga2V5b2YgdHlwZW9mIFNUT1JBR0VfQlVDS0VUUyxcbiAgcGF0aDogc3RyaW5nLFxuICBleHBpcmVzSW46IG51bWJlciA9IDM2MDAsXG4pID0+IHtcbiAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2Uuc3RvcmFnZVxuICAgIC5mcm9tKFNUT1JBR0VfQlVDS0VUU1tidWNrZXRdKVxuICAgIC5jcmVhdGVTaWduZWRVcmwocGF0aCwgZXhwaXJlc0luKTtcblxuICBpZiAoZXJyb3IpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENyZWF0ZSBzaWduZWQgVVJMIGZhaWxlZDogJHtlcnJvci5tZXNzYWdlfWApO1xuICB9XG5cbiAgcmV0dXJuIGRhdGE7XG59O1xuIl0sIm5hbWVzIjpbImNyZWF0ZUNsaWVudCIsInN1cGFiYXNlVXJsIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCIsInN1cGFiYXNlQW5vbktleSIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZIiwic3VwYWJhc2UiLCJzdXBhYmFzZUFkbWluIiwiU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWSIsIlNUT1JBR0VfQlVDS0VUUyIsIkFWQVRBUlMiLCJVUExPQURTIiwiQVNTRVRTIiwidXBsb2FkRmlsZSIsImZpbGUiLCJidWNrZXQiLCJwYXRoIiwiZGF0YSIsImVycm9yIiwic3RvcmFnZSIsImZyb20iLCJ1cGxvYWQiLCJjYWNoZUNvbnRyb2wiLCJ1cHNlcnQiLCJFcnJvciIsIm1lc3NhZ2UiLCJnZXRQdWJsaWNVcmwiLCJwdWJsaWNVcmwiLCJkZWxldGVGaWxlIiwicmVtb3ZlIiwiY3JlYXRlU2lnbmVkVXJsIiwiZXhwaXJlc0luIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/supabase.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fadmin%2Fsettings%2Froute&page=%2Fapi%2Fv1%2Fadmin%2Fsettings%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fadmin%2Fsettings%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fadmin%2Fsettings%2Froute&page=%2Fapi%2Fv1%2Fadmin%2Fsettings%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fadmin%2Fsettings%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_erico_socialbuzz_my_socialbuzz_clone_app_api_v1_admin_settings_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/v1/admin/settings/route.ts */ \"(rsc)/./app/api/v1/admin/settings/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/v1/admin/settings/route\",\n        pathname: \"/api/v1/admin/settings\",\n        filename: \"route\",\n        bundlePath: \"app/api/v1/admin/settings/route\"\n    },\n    resolvedPagePath: \"/Users/erico/socialbuzz/my-socialbuzz-clone/app/api/v1/admin/settings/route.ts\",\n    nextConfigOutput,\n    userland: _Users_erico_socialbuzz_my_socialbuzz_clone_app_api_v1_admin_settings_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZ2MSUyRmFkbWluJTJGc2V0dGluZ3MlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnYxJTJGYWRtaW4lMkZzZXR0aW5ncyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnYxJTJGYWRtaW4lMkZzZXR0aW5ncyUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmVyaWNvJTJGc29jaWFsYnV6eiUyRm15LXNvY2lhbGJ1enotY2xvbmUlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGZXJpY28lMkZzb2NpYWxidXp6JTJGbXktc29jaWFsYnV6ei1jbG9uZSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDOEI7QUFDM0c7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9lcmljby9zb2NpYWxidXp6L215LXNvY2lhbGJ1enotY2xvbmUvYXBwL2FwaS92MS9hZG1pbi9zZXR0aW5ncy9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvdjEvYWRtaW4vc2V0dGluZ3Mvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS92MS9hZG1pbi9zZXR0aW5nc1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvdjEvYWRtaW4vc2V0dGluZ3Mvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvZXJpY28vc29jaWFsYnV6ei9teS1zb2NpYWxidXp6LWNsb25lL2FwcC9hcGkvdjEvYWRtaW4vc2V0dGluZ3Mvcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fadmin%2Fsettings%2Froute&page=%2Fapi%2Fv1%2Fadmin%2Fsettings%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fadmin%2Fsettings%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "?32c4":
/*!****************************!*\
  !*** bufferutil (ignored) ***!
  \****************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?66e9":
/*!********************************!*\
  !*** utf-8-validate (ignored) ***!
  \********************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("punycode");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/ms","vendor-chunks/@supabase","vendor-chunks/tr46","vendor-chunks/ws","vendor-chunks/semver","vendor-chunks/bcryptjs","vendor-chunks/whatwg-url","vendor-chunks/jsonwebtoken","vendor-chunks/lodash.includes","vendor-chunks/jws","vendor-chunks/lodash.once","vendor-chunks/jwa","vendor-chunks/lodash.isinteger","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/webidl-conversions","vendor-chunks/lodash.isplainobject","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isboolean","vendor-chunks/safe-buffer","vendor-chunks/buffer-equal-constant-time","vendor-chunks/isows"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fadmin%2Fsettings%2Froute&page=%2Fapi%2Fv1%2Fadmin%2Fsettings%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fadmin%2Fsettings%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();