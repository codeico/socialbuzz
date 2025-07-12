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
exports.id = "app/api/v1/users/profile/route";
exports.ids = ["app/api/v1/users/profile/route"];
exports.modules = {

/***/ "(rsc)/./app/api/v1/users/profile/route.ts":
/*!*******************************************!*\
  !*** ./app/api/v1/users/profile/route.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   PUT: () => (/* binding */ PUT)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n/* harmony import */ var _lib_supabase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/supabase */ \"(rsc)/./lib/supabase.ts\");\n\n\n\nasync function GET(request) {\n    try {\n        const token = request.headers.get('authorization')?.replace('Bearer ', '');\n        if (!token) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Unauthorized'\n            }, {\n                status: 401\n            });\n        }\n        const decoded = (0,_lib_auth__WEBPACK_IMPORTED_MODULE_1__.verifyToken)(token);\n        if (!decoded) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Invalid token'\n            }, {\n                status: 401\n            });\n        }\n        // Get user data with profile information\n        const { data: user, error: userError } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabaseAdmin.from('users').select(`\n        id,\n        email,\n        username,\n        full_name,\n        avatar,\n        role,\n        is_verified,\n        balance,\n        total_earnings,\n        total_donations,\n        created_at,\n        updated_at\n      `).eq('id', decoded.userId).single();\n        if (userError) {\n            console.error('User fetch error:', userError);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                success: false,\n                error: 'User not found'\n            }, {\n                status: 404\n            });\n        }\n        // Get user profile data (bio, social links, etc.)\n        const { data: profile, error: profileError } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabaseAdmin.from('user_profiles').select(`\n        bio,\n        website,\n        location,\n        social_links,\n        privacy_settings,\n        notification_settings,\n        bank_account\n      `).eq('user_id', decoded.userId).single();\n        // Combine user and profile data\n        const fullProfile = {\n            ...user,\n            bio: profile?.bio || '',\n            website: profile?.website || '',\n            location: profile?.location || '',\n            socialLinks: profile?.social_links || {\n                twitter: '',\n                instagram: '',\n                youtube: '',\n                tiktok: ''\n            },\n            privacySettings: profile?.privacy_settings || {\n                profileVisible: true,\n                showEarnings: true,\n                showDonations: true\n            },\n            notificationSettings: profile?.notification_settings || {\n                email: true,\n                push: true,\n                donations: true,\n                payouts: true,\n                marketing: false\n            },\n            bankAccount: profile?.bank_account || {\n                bankName: '',\n                accountNumber: '',\n                accountHolderName: ''\n            }\n        };\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            data: fullProfile\n        });\n    } catch (error) {\n        console.error('Profile fetch error:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: false,\n            error: 'Internal server error'\n        }, {\n            status: 500\n        });\n    }\n}\nasync function PUT(request) {\n    try {\n        const token = request.headers.get('authorization')?.replace('Bearer ', '');\n        if (!token) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Unauthorized'\n            }, {\n                status: 401\n            });\n        }\n        const decoded = (0,_lib_auth__WEBPACK_IMPORTED_MODULE_1__.verifyToken)(token);\n        if (!decoded) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Invalid token'\n            }, {\n                status: 401\n            });\n        }\n        const body = await request.json();\n        const { fullName, avatar, bio, website, location, socialLinks, privacySettings, notificationSettings, bankAccount } = body;\n        // Update basic user info\n        if (fullName !== undefined || avatar !== undefined) {\n            const updateData = {\n                updated_at: new Date().toISOString()\n            };\n            if (fullName !== undefined) updateData.full_name = fullName;\n            if (avatar !== undefined) updateData.avatar = avatar;\n            const { error: userError } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabaseAdmin.from('users').update(updateData).eq('id', decoded.userId);\n            if (userError) {\n                throw userError;\n            }\n        }\n        // Update profile data\n        if (bio !== undefined || website !== undefined || location !== undefined || socialLinks !== undefined || privacySettings !== undefined || notificationSettings !== undefined || bankAccount !== undefined) {\n            const profileUpdateData = {\n                updated_at: new Date().toISOString()\n            };\n            if (bio !== undefined) profileUpdateData.bio = bio;\n            if (website !== undefined) profileUpdateData.website = website;\n            if (location !== undefined) profileUpdateData.location = location;\n            if (socialLinks !== undefined) profileUpdateData.social_links = socialLinks;\n            if (privacySettings !== undefined) profileUpdateData.privacy_settings = privacySettings;\n            if (notificationSettings !== undefined) profileUpdateData.notification_settings = notificationSettings;\n            if (bankAccount !== undefined) profileUpdateData.bank_account = bankAccount;\n            // Check if profile exists\n            const { data: existingProfile } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabaseAdmin.from('user_profiles').select('user_id').eq('user_id', decoded.userId).single();\n            if (existingProfile) {\n                // Update existing profile\n                const { error: profileError } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabaseAdmin.from('user_profiles').update(profileUpdateData).eq('user_id', decoded.userId);\n                if (profileError) {\n                    throw profileError;\n                }\n            } else {\n                // Create new profile\n                const { error: profileError } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabaseAdmin.from('user_profiles').insert({\n                    user_id: decoded.userId,\n                    ...profileUpdateData,\n                    created_at: new Date().toISOString()\n                });\n                if (profileError) {\n                    throw profileError;\n                }\n            }\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            message: 'Profile updated successfully'\n        });\n    } catch (error) {\n        console.error('Profile update error:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: false,\n            error: 'Failed to update profile'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3YxL3VzZXJzL3Byb2ZpbGUvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBd0Q7QUFDZjtBQUNNO0FBRXhDLGVBQWVHLElBQUlDLE9BQW9CO0lBQzVDLElBQUk7UUFDRixNQUFNQyxRQUFRRCxRQUFRRSxPQUFPLENBQUNDLEdBQUcsQ0FBQyxrQkFBa0JDLFFBQVEsV0FBVztRQUN2RSxJQUFJLENBQUNILE9BQU87WUFDVixPQUFPTCxxREFBWUEsQ0FBQ1MsSUFBSSxDQUFDO2dCQUFFQyxPQUFPO1lBQWUsR0FBRztnQkFBRUMsUUFBUTtZQUFJO1FBQ3BFO1FBRUEsTUFBTUMsVUFBVVgsc0RBQVdBLENBQUNJO1FBQzVCLElBQUksQ0FBQ08sU0FBUztZQUNaLE9BQU9aLHFEQUFZQSxDQUFDUyxJQUFJLENBQUM7Z0JBQUVDLE9BQU87WUFBZ0IsR0FBRztnQkFBRUMsUUFBUTtZQUFJO1FBQ3JFO1FBRUEseUNBQXlDO1FBQ3pDLE1BQU0sRUFBRUUsTUFBTUMsSUFBSSxFQUFFSixPQUFPSyxTQUFTLEVBQUUsR0FBRyxNQUFNYix3REFBYUEsQ0FDekRjLElBQUksQ0FBQyxTQUNMQyxNQUFNLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7OztNQWFULENBQUMsRUFDQUMsRUFBRSxDQUFDLE1BQU1OLFFBQVFPLE1BQU0sRUFDdkJDLE1BQU07UUFFVCxJQUFJTCxXQUFXO1lBQ2JNLFFBQVFYLEtBQUssQ0FBQyxxQkFBcUJLO1lBQ25DLE9BQU9mLHFEQUFZQSxDQUFDUyxJQUFJLENBQ3RCO2dCQUFFYSxTQUFTO2dCQUFPWixPQUFPO1lBQWlCLEdBQzFDO2dCQUFFQyxRQUFRO1lBQUk7UUFFbEI7UUFFQSxrREFBa0Q7UUFDbEQsTUFBTSxFQUFFRSxNQUFNVSxPQUFPLEVBQUViLE9BQU9jLFlBQVksRUFBRSxHQUFHLE1BQU10Qix3REFBYUEsQ0FDL0RjLElBQUksQ0FBQyxpQkFDTEMsTUFBTSxDQUFDLENBQUM7Ozs7Ozs7O01BUVQsQ0FBQyxFQUNBQyxF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TztRQUNkVyxRQUFRWCxLQUFLLENBQUMseUJBQXlCQTtRQUN2QyxPQUFPVixxREFBWUEsQ0FBQ1MsSUFBSSxDQUN0QjtZQUFFYSxTQUFTO1lBQU9aLE9BQU87UUFBMkIsR0FDcEQ7WUFBRUMsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIi9Vc2Vycy9lcmljby9zb2NpYWxidXp6L215LXNvY2lhbGJ1enotY2xvbmUvYXBwL2FwaS92MS91c2Vycy9wcm9maWxlL3JvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XG5pbXBvcnQgeyB2ZXJpZnlUb2tlbiB9IGZyb20gJ0AvbGliL2F1dGgnO1xuaW1wb3J0IHsgc3VwYWJhc2VBZG1pbiB9IGZyb20gJ0AvbGliL3N1cGFiYXNlJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVChyZXF1ZXN0OiBOZXh0UmVxdWVzdCkge1xuICB0cnkge1xuICAgIGNvbnN0IHRva2VuID0gcmVxdWVzdC5oZWFkZXJzLmdldCgnYXV0aG9yaXphdGlvbicpPy5yZXBsYWNlKCdCZWFyZXIgJywgJycpO1xuICAgIGlmICghdG9rZW4pIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnVW5hdXRob3JpemVkJyB9LCB7IHN0YXR1czogNDAxIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGRlY29kZWQgPSB2ZXJpZnlUb2tlbih0b2tlbik7XG4gICAgaWYgKCFkZWNvZGVkKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ0ludmFsaWQgdG9rZW4nIH0sIHsgc3RhdHVzOiA0MDEgfSk7XG4gICAgfVxuXG4gICAgLy8gR2V0IHVzZXIgZGF0YSB3aXRoIHByb2ZpbGUgaW5mb3JtYXRpb25cbiAgICBjb25zdCB7IGRhdGE6IHVzZXIsIGVycm9yOiB1c2VyRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW5cbiAgICAgIC5mcm9tKCd1c2VycycpXG4gICAgICAuc2VsZWN0KGBcbiAgICAgICAgaWQsXG4gICAgICAgIGVtYWlsLFxuICAgICAgICB1c2VybmFtZSxcbiAgICAgICAgZnVsbF9uYW1lLFxuICAgICAgICBhdmF0YXIsXG4gICAgICAgIHJvbGUsXG4gICAgICAgIGlzX3ZlcmlmaWVkLFxuICAgICAgICBiYWxhbmNlLFxuICAgICAgICB0b3RhbF9lYXJuaW5ncyxcbiAgICAgICAgdG90YWxfZG9uYXRpb25zLFxuICAgICAgICBjcmVhdGVkX2F0LFxuICAgICAgICB1cGRhdGVkX2F0XG4gICAgICBgKVxuICAgICAgLmVxKCdpZCcsIGRlY29kZWQudXNlcklkKVxuICAgICAgLnNpbmdsZSgpO1xuXG4gICAgaWYgKHVzZXJFcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignVXNlciBmZXRjaCBlcnJvcjonLCB1c2VyRXJyb3IpO1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ1VzZXIgbm90IGZvdW5kJyB9LFxuICAgICAgICB7IHN0YXR1czogNDA0IH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gR2V0IHVzZXIgcHJvZmlsZSBkYXRhIChiaW8sIHNvY2lhbCBsaW5rcywgZXRjLilcbiAgICBjb25zdCB7IGRhdGE6IHByb2ZpbGUsIGVycm9yOiBwcm9maWxlRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW5cbiAgICAgIC5mcm9tKCd1c2VyX3Byb2ZpbGVzJylcbiAgICAgIC5zZWxlY3QoYFxuICAgICAgICBiaW8sXG4gICAgICAgIHdlYnNpdGUsXG4gICAgICAgIGxvY2F0aW9uLFxuICAgICAgICBzb2NpYWxfbGlua3MsXG4gICAgICAgIHByaXZhY3lfc2V0dGluZ3MsXG4gICAgICAgIG5vdGlmaWNhdGlvbl9zZXR0aW5ncyxcbiAgICAgICAgYmFua19hY2NvdW50XG4gICAgICBgKVxuICAgICAgLmVxKCd1c2VyX2lkJywgZGVjb2RlZC51c2VySWQpXG4gICAgICAuc2luZ2xlKCk7XG5cbiAgICAvLyBDb21iaW5lIHVzZXIgYW5kIHByb2ZpbGUgZGF0YVxuICAgIGNvbnN0IGZ1bGxQcm9maWxlID0ge1xuICAgICAgLi4udXNlcixcbiAgICAgIGJpbzogcHJvZmlsZT8uYmlvIHx8ICcnLFxuICAgICAgd2Vic2l0ZTogcHJvZmlsZT8ud2Vic2l0ZSB8fCAnJyxcbiAgICAgIGxvY2F0aW9uOiBwcm9maWxlPy5sb2NhdGlvbiB8fCAnJyxcbiAgICAgIHNvY2lhbExpbmtzOiBwcm9maWxlPy5zb2NpYWxfbGlua3MgfHwge1xuICAgICAgICB0d2l0dGVyOiAnJyxcbiAgICAgICAgaW5zdGFncmFtOiAnJyxcbiAgICAgICAgeW91dHViZTogJycsXG4gICAgICAgIHRpa3RvazogJycsXG4gICAgICB9LFxuICAgICAgcHJpdmFjeVNldHRpbmdzOiBwcm9maWxlPy5wcml2YWN5X3NldHRpbmdzIHx8IHtcbiAgICAgICAgcHJvZmlsZVZpc2libGU6IHRydWUsXG4gICAgICAgIHNob3dFYXJuaW5nczogdHJ1ZSxcbiAgICAgICAgc2hvd0RvbmF0aW9uczogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICBub3RpZmljYXRpb25TZXR0aW5nczogcHJvZmlsZT8ubm90aWZpY2F0aW9uX3NldHRpbmdzIHx8IHtcbiAgICAgICAgZW1haWw6IHRydWUsXG4gICAgICAgIHB1c2g6IHRydWUsXG4gICAgICAgIGRvbmF0aW9uczogdHJ1ZSxcbiAgICAgICAgcGF5b3V0czogdHJ1ZSxcbiAgICAgICAgbWFya2V0aW5nOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgICBiYW5rQWNjb3VudDogcHJvZmlsZT8uYmFua19hY2NvdW50IHx8IHtcbiAgICAgICAgYmFua05hbWU6ICcnLFxuICAgICAgICBhY2NvdW50TnVtYmVyOiAnJyxcbiAgICAgICAgYWNjb3VudEhvbGRlck5hbWU6ICcnLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICBkYXRhOiBmdWxsUHJvZmlsZSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdQcm9maWxlIGZldGNoIGVycm9yOicsIGVycm9yKTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ0ludGVybmFsIHNlcnZlciBlcnJvcicgfSxcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBVVChyZXF1ZXN0OiBOZXh0UmVxdWVzdCkge1xuICB0cnkge1xuICAgIGNvbnN0IHRva2VuID0gcmVxdWVzdC5oZWFkZXJzLmdldCgnYXV0aG9yaXphdGlvbicpPy5yZXBsYWNlKCdCZWFyZXIgJywgJycpO1xuICAgIGlmICghdG9rZW4pIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnVW5hdXRob3JpemVkJyB9LCB7IHN0YXR1czogNDAxIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGRlY29kZWQgPSB2ZXJpZnlUb2tlbih0b2tlbik7XG4gICAgaWYgKCFkZWNvZGVkKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ0ludmFsaWQgdG9rZW4nIH0sIHsgc3RhdHVzOiA0MDEgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgYm9keSA9IGF3YWl0IHJlcXVlc3QuanNvbigpO1xuICAgIGNvbnN0IHsgXG4gICAgICBmdWxsTmFtZSwgXG4gICAgICBhdmF0YXIsIFxuICAgICAgYmlvLCBcbiAgICAgIHdlYnNpdGUsIFxuICAgICAgbG9jYXRpb24sIFxuICAgICAgc29jaWFsTGlua3MsXG4gICAgICBwcml2YWN5U2V0dGluZ3MsXG4gICAgICBub3RpZmljYXRpb25TZXR0aW5ncyxcbiAgICAgIGJhbmtBY2NvdW50IFxuICAgIH0gPSBib2R5O1xuXG4gICAgLy8gVXBkYXRlIGJhc2ljIHVzZXIgaW5mb1xuICAgIGlmIChmdWxsTmFtZSAhPT0gdW5kZWZpbmVkIHx8IGF2YXRhciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCB1cGRhdGVEYXRhOiBhbnkgPSB7XG4gICAgICAgIHVwZGF0ZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIH07XG4gICAgICBcbiAgICAgIGlmIChmdWxsTmFtZSAhPT0gdW5kZWZpbmVkKSB1cGRhdGVEYXRhLmZ1bGxfbmFtZSA9IGZ1bGxOYW1lO1xuICAgICAgaWYgKGF2YXRhciAhPT0gdW5kZWZpbmVkKSB1cGRhdGVEYXRhLmF2YXRhciA9IGF2YXRhcjtcblxuICAgICAgY29uc3QgeyBlcnJvcjogdXNlckVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluXG4gICAgICAgIC5mcm9tKCd1c2VycycpXG4gICAgICAgIC51cGRhdGUodXBkYXRlRGF0YSlcbiAgICAgICAgLmVxKCdpZCcsIGRlY29kZWQudXNlcklkKTtcblxuICAgICAgaWYgKHVzZXJFcnJvcikge1xuICAgICAgICB0aHJvdyB1c2VyRXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIHByb2ZpbGUgZGF0YVxuICAgIGlmIChiaW8gIT09IHVuZGVmaW5lZCB8fCB3ZWJzaXRlICE9PSB1bmRlZmluZWQgfHwgbG9jYXRpb24gIT09IHVuZGVmaW5lZCB8fCBcbiAgICAgICAgc29jaWFsTGlua3MgIT09IHVuZGVmaW5lZCB8fCBwcml2YWN5U2V0dGluZ3MgIT09IHVuZGVmaW5lZCB8fCBcbiAgICAgICAgbm90aWZpY2F0aW9uU2V0dGluZ3MgIT09IHVuZGVmaW5lZCB8fCBiYW5rQWNjb3VudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBcbiAgICAgIGNvbnN0IHByb2ZpbGVVcGRhdGVEYXRhOiBhbnkgPSB7XG4gICAgICAgIHVwZGF0ZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIH07XG5cbiAgICAgIGlmIChiaW8gIT09IHVuZGVmaW5lZCkgcHJvZmlsZVVwZGF0ZURhdGEuYmlvID0gYmlvO1xuICAgICAgaWYgKHdlYnNpdGUgIT09IHVuZGVmaW5lZCkgcHJvZmlsZVVwZGF0ZURhdGEud2Vic2l0ZSA9IHdlYnNpdGU7XG4gICAgICBpZiAobG9jYXRpb24gIT09IHVuZGVmaW5lZCkgcHJvZmlsZVVwZGF0ZURhdGEubG9jYXRpb24gPSBsb2NhdGlvbjtcbiAgICAgIGlmIChzb2NpYWxMaW5rcyAhPT0gdW5kZWZpbmVkKSBwcm9maWxlVXBkYXRlRGF0YS5zb2NpYWxfbGlua3MgPSBzb2NpYWxMaW5rcztcbiAgICAgIGlmIChwcml2YWN5U2V0dGluZ3MgIT09IHVuZGVmaW5lZCkgcHJvZmlsZVVwZGF0ZURhdGEucHJpdmFjeV9zZXR0aW5ncyA9IHByaXZhY3lTZXR0aW5ncztcbiAgICAgIGlmIChub3RpZmljYXRpb25TZXR0aW5ncyAhPT0gdW5kZWZpbmVkKSBwcm9maWxlVXBkYXRlRGF0YS5ub3RpZmljYXRpb25fc2V0dGluZ3MgPSBub3RpZmljYXRpb25TZXR0aW5ncztcbiAgICAgIGlmIChiYW5rQWNjb3VudCAhPT0gdW5kZWZpbmVkKSBwcm9maWxlVXBkYXRlRGF0YS5iYW5rX2FjY291bnQgPSBiYW5rQWNjb3VudDtcblxuICAgICAgLy8gQ2hlY2sgaWYgcHJvZmlsZSBleGlzdHNcbiAgICAgIGNvbnN0IHsgZGF0YTogZXhpc3RpbmdQcm9maWxlIH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluXG4gICAgICAgIC5mcm9tKCd1c2VyX3Byb2ZpbGVzJylcbiAgICAgICAgLnNlbGVjdCgndXNlcl9pZCcpXG4gICAgICAgIC5lcSgndXNlcl9pZCcsIGRlY29kZWQudXNlcklkKVxuICAgICAgICAuc2luZ2xlKCk7XG5cbiAgICAgIGlmIChleGlzdGluZ1Byb2ZpbGUpIHtcbiAgICAgICAgLy8gVXBkYXRlIGV4aXN0aW5nIHByb2ZpbGVcbiAgICAgICAgY29uc3QgeyBlcnJvcjogcHJvZmlsZUVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluXG4gICAgICAgICAgLmZyb20oJ3VzZXJfcHJvZmlsZXMnKVxuICAgICAgICAgIC51cGRhdGUocHJvZmlsZVVwZGF0ZURhdGEpXG4gICAgICAgICAgLmVxKCd1c2VyX2lkJywgZGVjb2RlZC51c2VySWQpO1xuXG4gICAgICAgIGlmIChwcm9maWxlRXJyb3IpIHtcbiAgICAgICAgICB0aHJvdyBwcm9maWxlRXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIENyZWF0ZSBuZXcgcHJvZmlsZVxuICAgICAgICBjb25zdCB7IGVycm9yOiBwcm9maWxlRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW5cbiAgICAgICAgICAuZnJvbSgndXNlcl9wcm9maWxlcycpXG4gICAgICAgICAgLmluc2VydCh7XG4gICAgICAgICAgICB1c2VyX2lkOiBkZWNvZGVkLnVzZXJJZCxcbiAgICAgICAgICAgIC4uLnByb2ZpbGVVcGRhdGVEYXRhLFxuICAgICAgICAgICAgY3JlYXRlZF9hdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChwcm9maWxlRXJyb3IpIHtcbiAgICAgICAgICB0aHJvdyBwcm9maWxlRXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oe1xuICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgIG1lc3NhZ2U6ICdQcm9maWxlIHVwZGF0ZWQgc3VjY2Vzc2Z1bGx5JyxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdQcm9maWxlIHVwZGF0ZSBlcnJvcjonLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdGYWlsZWQgdG8gdXBkYXRlIHByb2ZpbGUnIH0sXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApO1xuICB9XG59Il0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsInZlcmlmeVRva2VuIiwic3VwYWJhc2VBZG1pbiIsIkdFVCIsInJlcXVlc3QiLCJ0b2tlbiIsImhlYWRlcnMiLCJnZXQiLCJyZXBsYWNlIiwianNvbiIsImVycm9yIiwic3RhdHVzIiwiZGVjb2RlZCIsImRhdGEiLCJ1c2VyIiwidXNlckVycm9yIiwiZnJvbSIsInNlbGVjdCIsImVxIiwidXNlcklkIiwic2luZ2xlIiwiY29uc29sZSIsInN1Y2Nlc3MiLCJwcm9maWxlIiwicHJvZmlsZUVycm9yIiwiZnVsbFByb2ZpbGUiLCJiaW8iLCJ3ZWJzaXRlIiwibG9jYXRpb24iLCJzb2NpYWxMaW5rcyIsInNvY2lhbF9saW5rcyIsInR3aXR0ZXIiLCJpbnN0YWdyYW0iLCJ5b3V0dWJlIiwidGlrdG9rIiwicHJpdmFjeVNldHRpbmdzIiwicHJpdmFjeV9zZXR0aW5ncyIsInByb2ZpbGVWaXNpYmxlIiwic2hvd0Vhcm5pbmdzIiwic2hvd0RvbmF0aW9ucyIsIm5vdGlmaWNhdGlvblNldHRpbmdzIiwibm90aWZpY2F0aW9uX3NldHRpbmdzIiwiZW1haWwiLCJwdXNoIiwiZG9uYXRpb25zIiwicGF5b3V0cyIsIm1hcmtldGluZyIsImJhbmtBY2NvdW50IiwiYmFua19hY2NvdW50IiwiYmFua05hbWUiLCJhY2NvdW50TnVtYmVyIiwiYWNjb3VudEhvbGRlck5hbWUiLCJQVVQiLCJib2R5IiwiZnVsbE5hbWUiLCJhdmF0YXIiLCJ1bmRlZmluZWQiLCJ1cGRhdGVEYXRhIiwidXBkYXRlZF9hdCIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsImZ1bGxfbmFtZSIsInVwZGF0ZSIsInByb2ZpbGVVcGRhdGVEYXRhIiwiZXhpc3RpbmdQcm9maWxlIiwiaW5zZXJ0IiwidXNlcl9pZCIsImNyZWF0ZWRfYXQiLCJtZXNzYWdlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/v1/users/profile/route.ts\n");

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

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fusers%2Fprofile%2Froute&page=%2Fapi%2Fv1%2Fusers%2Fprofile%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fusers%2Fprofile%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fusers%2Fprofile%2Froute&page=%2Fapi%2Fv1%2Fusers%2Fprofile%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fusers%2Fprofile%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_erico_socialbuzz_my_socialbuzz_clone_app_api_v1_users_profile_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/v1/users/profile/route.ts */ \"(rsc)/./app/api/v1/users/profile/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/v1/users/profile/route\",\n        pathname: \"/api/v1/users/profile\",\n        filename: \"route\",\n        bundlePath: \"app/api/v1/users/profile/route\"\n    },\n    resolvedPagePath: \"/Users/erico/socialbuzz/my-socialbuzz-clone/app/api/v1/users/profile/route.ts\",\n    nextConfigOutput,\n    userland: _Users_erico_socialbuzz_my_socialbuzz_clone_app_api_v1_users_profile_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZ2MSUyRnVzZXJzJTJGcHJvZmlsZSUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGdjElMkZ1c2VycyUyRnByb2ZpbGUlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZ2MSUyRnVzZXJzJTJGcHJvZmlsZSUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmVyaWNvJTJGc29jaWFsYnV6eiUyRm15LXNvY2lhbGJ1enotY2xvbmUlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGZXJpY28lMkZzb2NpYWxidXp6JTJGbXktc29jaWFsYnV6ei1jbG9uZSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDNkI7QUFDMUc7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9lcmljby9zb2NpYWxidXp6L215LXNvY2lhbGJ1enotY2xvbmUvYXBwL2FwaS92MS91c2Vycy9wcm9maWxlL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS92MS91c2Vycy9wcm9maWxlL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvdjEvdXNlcnMvcHJvZmlsZVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvdjEvdXNlcnMvcHJvZmlsZS9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9Vc2Vycy9lcmljby9zb2NpYWxidXp6L215LXNvY2lhbGJ1enotY2xvbmUvYXBwL2FwaS92MS91c2Vycy9wcm9maWxlL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fusers%2Fprofile%2Froute&page=%2Fapi%2Fv1%2Fusers%2Fprofile%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fusers%2Fprofile%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/ms","vendor-chunks/@supabase","vendor-chunks/tr46","vendor-chunks/ws","vendor-chunks/semver","vendor-chunks/bcryptjs","vendor-chunks/whatwg-url","vendor-chunks/jsonwebtoken","vendor-chunks/lodash.includes","vendor-chunks/jws","vendor-chunks/lodash.once","vendor-chunks/jwa","vendor-chunks/lodash.isinteger","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/webidl-conversions","vendor-chunks/lodash.isplainobject","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isboolean","vendor-chunks/safe-buffer","vendor-chunks/buffer-equal-constant-time","vendor-chunks/isows"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fusers%2Fprofile%2Froute&page=%2Fapi%2Fv1%2Fusers%2Fprofile%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fusers%2Fprofile%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();