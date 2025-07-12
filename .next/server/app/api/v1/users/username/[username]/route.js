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
exports.id = "app/api/v1/users/username/[username]/route";
exports.ids = ["app/api/v1/users/username/[username]/route"];
exports.modules = {

/***/ "(rsc)/./app/api/v1/users/username/[username]/route.ts":
/*!*******************************************************!*\
  !*** ./app/api/v1/users/username/[username]/route.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_supabase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/supabase */ \"(rsc)/./lib/supabase.ts\");\n\n\nasync function GET(request, { params }) {\n    try {\n        const { username } = params;\n        // Get user profile by username with all related data\n        const { data: user, error } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from('users').select(`\n        id,\n        username,\n        email,\n        full_name,\n        avatar,\n        is_verified,\n        role,\n        balance,\n        total_earnings,\n        total_donations,\n        created_at\n      `).eq('username', username).single();\n        if (error) {\n            if (error.code === 'PGRST116') {\n                return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                    error: 'User not found'\n                }, {\n                    status: 404\n                });\n            }\n            throw error;\n        }\n        // Get user profile data separately\n        const { data: profile } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from('user_profiles').select('bio, website, location, social_links, bank_account').eq('user_id', user.id).single();\n        // Get supporter count from donations\n        const { count: supporterCount } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from('donations').select('donor_id', {\n            count: 'exact',\n            head: true\n        }).eq('recipient_id', user.id).neq('donor_id', user.id); // Exclude self-donations\n        // Transform data to match expected format\n        const transformedUser = {\n            id: user.id,\n            username: user.username,\n            email: user.email,\n            displayName: user.full_name || user.username,\n            avatar: user.avatar || '/default-avatar.png',\n            isVerified: user.is_verified,\n            isOnboarded: !!profile,\n            role: user.role,\n            profile: profile ? {\n                bio: profile.bio || '',\n                category: 'general',\n                social_links: profile.social_links || {},\n                bank_account: profile.bank_account || {}\n            } : null,\n            stats: {\n                total_donations: user.total_donations || 0,\n                total_supporters: supporterCount || 0,\n                avg_donation_amount: supporterCount > 0 ? (user.total_donations || 0) / supporterCount : 0,\n                last_donation_at: null\n            },\n            joinedAt: user.created_at\n        };\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            data: transformedUser\n        });\n    } catch (error) {\n        console.error('User profile fetch error:', error);\n        console.error('Error details:', {\n            message: error.message,\n            code: error.code,\n            details: error.details,\n            hint: error.hint\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to fetch user profile',\n            details:  true ? error.message : 0\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3YxL3VzZXJzL3VzZXJuYW1lL1t1c2VybmFtZV0vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQXdEO0FBQ1Q7QUFFeEMsZUFBZUUsSUFDcEJDLE9BQW9CLEVBQ3BCLEVBQUVDLE1BQU0sRUFBb0M7SUFFNUMsSUFBSTtRQUNGLE1BQU0sRUFBRUMsUUFBUSxFQUFFLEdBQUdEO1FBRXJCLHFEQUFxRDtRQUNyRCxNQUFNLEVBQUVFLE1BQU1DLElBQUksRUFBRUMsS0FBSyxFQUFFLEdBQUcsTUFBTVAsd0RBQWFBLENBQzlDUSxJQUFJLENBQUMsU0FDTEMsTUFBTSxDQUFDLENBQUM7Ozs7Ozs7Ozs7OztNQVlULENBQUMsRUFDQUMsRUFBRSxDQUFDLFlBQVlOLFVBQ2ZPLE1BQU07UUFFVCxJQUFJSixPQUFPO1lBQ1QsSUFBSUEsTUFBTUssSUFBSSxLQUFLLFlBQVk7Z0JBQzdCLE9BQU9iLHFEQUFZQSxDQUFDYyxJQUFJLENBQ3RCO29CQUFFTixPQUFPO2dCQUFpQixHQUMxQjtvQkFBRU8sUUFBUTtnQkFBSTtZQUVsQjtZQUNBLE1BQU1QO1FBQ1I7UUFFQSxtQ0FBbUM7UUFDbkMsTUFBTSxFQUFFRixNQUFNVSxPQUFPLEVBQUUsR0FBRyxNQUFNZix3REFBYUEsQ0FDMUNRLElBQUksQ0FBQyxpQkFDTEMsTUFBTSxDQUFDLHNEQUNQQyxFQUFFLENBQUMsV0FBV0osS0FBS1UsRUFBRSxFQUNyQkwsTUFBTTtRQUVULHFDQUFxQztRQUNyQyxNQUFNLEVBQUVNLE9BQU9DLGNBQWMsRUFBRSxHQUFHLE1BQU1sQix3REFBYUEsQ0FDbERRLElBQUksQ0FBQyxhQUNMQyxNQUFNLENBQUMsWUFBWTtZQUFFUSxPQUFPO1lBQVNFLE1BQU07UUFBSyxHQUNoRFQsRUFBRSxDQUFDLGdCQUFnQkosS0FBS1UsRUFBRSxFQUMxQkksR0FBRyxDQUFDLFlBQVlkLEtBQUtVLEVBQUUsR0FBRyx5QkFBeUI7UUFFdEQsMENBQTBDO1FBQzFDLE1BQU1LLGtCQUFrQjtZQUN0QkwsSUFBSVYsS0FBS1UsRUFBRTtZQUNYWixVQUFVRSxLQUFLRixRQUFRO1lBQ3ZCa0IsT0FBT2hCLEtBQUtnQixLQUFLO1lBQ2pCQyxhQUFhakIsS0FBS2tCLFNBQVMsSUFBSWxCLEtBQUtGLFFBQVE7WUFDNUNxQixRQUFRbkIsS0FBS21CLE1BQU0sSUFBSTtZQUN2QkMsWUFBWXBCLEtBQUtxQixXQUFXO1lBQzVCQyxhQUFhLENBQUMsQ0FBQ2I7WUFDZmMsTUFBTXZCLEtBQUt1QixJQUFJO1lBQ2ZkLFNBQVNBLFVBQVU7Z0JBQ2pCZSxLQUFLZixRQUFRZSxHQUFHLElBQUk7Z0JBQ3BCQyxVQUFVO2dCQUNWQyxjQUFjakIsUUFBUWlCLFlBQVksSUFBSSxDQUFDO2dCQUN2Q0MsY0FBY2xCLFFBQVFrQixZQUFZLElBQUksQ0FBQztZQUN6QyxJQUFJO1lBQ0pDLE9BQU87Z0JBQ0xDLGlCQUFpQjdCLEtBQUs2QixlQUFlLElBQUk7Z0JBQ3pDQyxrQkFBa0JsQixrQkFBa0I7Z0JBQ3BDbUIscUJBQXFCbkIsaUJBQWlCLElBQUksQ0FBQ1osS0FBSzZCLGVBQWUsSUFBSSxLQUFLakIsaUJBQWlCO2dCQUN6Rm9CLGtCQUFrQjtZQUNwQjtZQUNBQyxVQUFVakMsS0FBS2tDLFVBQVU7UUFDM0I7UUFFQSxPQUFPekMscURBQVlBLENBQUNjLElBQUksQ0FBQztZQUN2QjRCLFNBQVM7WUFDVHBDLE1BQU1nQjtRQUNSO0lBQ0YsRUFBRSxPQUFPZCxPQUFPO1FBQ2RtQyxRQUFRbkMsS0FBSyxDQUFDLDZCQUE2QkE7UUFDM0NtQyxRQUFRbkMsS0FBSyxDQUFDLGtCQUFrQjtZQUM5Qm9DLFNBQVNwQyxNQUFNb0MsT0FBTztZQUN0Qi9CLE1BQU1MLE1BQU1LLElBQUk7WUFDaEJnQyxTQUFTckMsTUFBTXFDLE9BQU87WUFDdEJDLE1BQU10QyxNQUFNc0MsSUFBSTtRQUNsQjtRQUNBLE9BQU85QyxxREFBWUEsQ0FBQ2MsSUFBSSxDQUN0QjtZQUNFTixPQUFPO1lBQ1BxQyxTQUFTRSxLQUFzQyxHQUFHdkMsTUFBTW9DLE9BQU8sR0FBR0ksQ0FBU0E7UUFDN0UsR0FDQTtZQUFFakMsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIi9Vc2Vycy9lcmljby9zb2NpYWxidXp6L215LXNvY2lhbGJ1enotY2xvbmUvYXBwL2FwaS92MS91c2Vycy91c2VybmFtZS9bdXNlcm5hbWVdL3JvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XG5pbXBvcnQgeyBzdXBhYmFzZUFkbWluIH0gZnJvbSAnQC9saWIvc3VwYWJhc2UnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKFxuICByZXF1ZXN0OiBOZXh0UmVxdWVzdCxcbiAgeyBwYXJhbXMgfTogeyBwYXJhbXM6IHsgdXNlcm5hbWU6IHN0cmluZyB9IH1cbikge1xuICB0cnkge1xuICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IHBhcmFtcztcblxuICAgIC8vIEdldCB1c2VyIHByb2ZpbGUgYnkgdXNlcm5hbWUgd2l0aCBhbGwgcmVsYXRlZCBkYXRhXG4gICAgY29uc3QgeyBkYXRhOiB1c2VyLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VBZG1pblxuICAgICAgLmZyb20oJ3VzZXJzJylcbiAgICAgIC5zZWxlY3QoYFxuICAgICAgICBpZCxcbiAgICAgICAgdXNlcm5hbWUsXG4gICAgICAgIGVtYWlsLFxuICAgICAgICBmdWxsX25hbWUsXG4gICAgICAgIGF2YXRhcixcbiAgICAgICAgaXNfdmVyaWZpZWQsXG4gICAgICAgIHJvbGUsXG4gICAgICAgIGJhbGFuY2UsXG4gICAgICAgIHRvdGFsX2Vhcm5pbmdzLFxuICAgICAgICB0b3RhbF9kb25hdGlvbnMsXG4gICAgICAgIGNyZWF0ZWRfYXRcbiAgICAgIGApXG4gICAgICAuZXEoJ3VzZXJuYW1lJywgdXNlcm5hbWUpXG4gICAgICAuc2luZ2xlKCk7XG5cbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIGlmIChlcnJvci5jb2RlID09PSAnUEdSU1QxMTYnKSB7XG4gICAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgICB7IGVycm9yOiAnVXNlciBub3QgZm91bmQnIH0sXG4gICAgICAgICAgeyBzdGF0dXM6IDQwNCB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG5cbiAgICAvLyBHZXQgdXNlciBwcm9maWxlIGRhdGEgc2VwYXJhdGVseVxuICAgIGNvbnN0IHsgZGF0YTogcHJvZmlsZSB9ID0gYXdhaXQgc3VwYWJhc2VBZG1pblxuICAgICAgLmZyb20oJ3VzZXJfcHJvZmlsZXMnKVxuICAgICAgLnNlbGVjdCgnYmlvLCB3ZWJzaXRlLCBsb2NhdGlvbiwgc29jaWFsX2xpbmtzLCBiYW5rX2FjY291bnQnKVxuICAgICAgLmVxKCd1c2VyX2lkJywgdXNlci5pZClcbiAgICAgIC5zaW5nbGUoKTtcblxuICAgIC8vIEdldCBzdXBwb3J0ZXIgY291bnQgZnJvbSBkb25hdGlvbnNcbiAgICBjb25zdCB7IGNvdW50OiBzdXBwb3J0ZXJDb3VudCB9ID0gYXdhaXQgc3VwYWJhc2VBZG1pblxuICAgICAgLmZyb20oJ2RvbmF0aW9ucycpXG4gICAgICAuc2VsZWN0KCdkb25vcl9pZCcsIHsgY291bnQ6ICdleGFjdCcsIGhlYWQ6IHRydWUgfSlcbiAgICAgIC5lcSgncmVjaXBpZW50X2lkJywgdXNlci5pZClcbiAgICAgIC5uZXEoJ2Rvbm9yX2lkJywgdXNlci5pZCk7IC8vIEV4Y2x1ZGUgc2VsZi1kb25hdGlvbnNcblxuICAgIC8vIFRyYW5zZm9ybSBkYXRhIHRvIG1hdGNoIGV4cGVjdGVkIGZvcm1hdFxuICAgIGNvbnN0IHRyYW5zZm9ybWVkVXNlciA9IHtcbiAgICAgIGlkOiB1c2VyLmlkLFxuICAgICAgdXNlcm5hbWU6IHVzZXIudXNlcm5hbWUsXG4gICAgICBlbWFpbDogdXNlci5lbWFpbCxcbiAgICAgIGRpc3BsYXlOYW1lOiB1c2VyLmZ1bGxfbmFtZSB8fCB1c2VyLnVzZXJuYW1lLFxuICAgICAgYXZhdGFyOiB1c2VyLmF2YXRhciB8fCAnL2RlZmF1bHQtYXZhdGFyLnBuZycsXG4gICAgICBpc1ZlcmlmaWVkOiB1c2VyLmlzX3ZlcmlmaWVkLFxuICAgICAgaXNPbmJvYXJkZWQ6ICEhcHJvZmlsZSwgLy8gVXNlciBpcyBvbmJvYXJkZWQgaWYgdGhleSBoYXZlIGEgcHJvZmlsZVxuICAgICAgcm9sZTogdXNlci5yb2xlLFxuICAgICAgcHJvZmlsZTogcHJvZmlsZSA/IHtcbiAgICAgICAgYmlvOiBwcm9maWxlLmJpbyB8fCAnJyxcbiAgICAgICAgY2F0ZWdvcnk6ICdnZW5lcmFsJywgLy8gRGVmYXVsdCBjYXRlZ29yeSBzaW5jZSBpdCdzIG5vdCBpbiB0aGUgc2NoZW1hXG4gICAgICAgIHNvY2lhbF9saW5rczogcHJvZmlsZS5zb2NpYWxfbGlua3MgfHwge30sXG4gICAgICAgIGJhbmtfYWNjb3VudDogcHJvZmlsZS5iYW5rX2FjY291bnQgfHwge30sXG4gICAgICB9IDogbnVsbCxcbiAgICAgIHN0YXRzOiB7XG4gICAgICAgIHRvdGFsX2RvbmF0aW9uczogdXNlci50b3RhbF9kb25hdGlvbnMgfHwgMCxcbiAgICAgICAgdG90YWxfc3VwcG9ydGVyczogc3VwcG9ydGVyQ291bnQgfHwgMCxcbiAgICAgICAgYXZnX2RvbmF0aW9uX2Ftb3VudDogc3VwcG9ydGVyQ291bnQgPiAwID8gKHVzZXIudG90YWxfZG9uYXRpb25zIHx8IDApIC8gc3VwcG9ydGVyQ291bnQgOiAwLFxuICAgICAgICBsYXN0X2RvbmF0aW9uX2F0OiBudWxsLCAvLyBXZSB3b3VsZCBuZWVkIHRvIHF1ZXJ5IHRoaXMgZnJvbSBkb25hdGlvbnMgdGFibGVcbiAgICAgIH0sXG4gICAgICBqb2luZWRBdDogdXNlci5jcmVhdGVkX2F0LFxuICAgIH07XG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oe1xuICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgIGRhdGE6IHRyYW5zZm9ybWVkVXNlcixcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdVc2VyIHByb2ZpbGUgZmV0Y2ggZXJyb3I6JywgZXJyb3IpO1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGRldGFpbHM6Jywge1xuICAgICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZSxcbiAgICAgIGNvZGU6IGVycm9yLmNvZGUsXG4gICAgICBkZXRhaWxzOiBlcnJvci5kZXRhaWxzLFxuICAgICAgaGludDogZXJyb3IuaGludCxcbiAgICB9KTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IFxuICAgICAgICBlcnJvcjogJ0ZhaWxlZCB0byBmZXRjaCB1c2VyIHByb2ZpbGUnLFxuICAgICAgICBkZXRhaWxzOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyA/IGVycm9yLm1lc3NhZ2UgOiB1bmRlZmluZWRcbiAgICAgIH0sXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApO1xuICB9XG59Il0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsInN1cGFiYXNlQWRtaW4iLCJHRVQiLCJyZXF1ZXN0IiwicGFyYW1zIiwidXNlcm5hbWUiLCJkYXRhIiwidXNlciIsImVycm9yIiwiZnJvbSIsInNlbGVjdCIsImVxIiwic2luZ2xlIiwiY29kZSIsImpzb24iLCJzdGF0dXMiLCJwcm9maWxlIiwiaWQiLCJjb3VudCIsInN1cHBvcnRlckNvdW50IiwiaGVhZCIsIm5lcSIsInRyYW5zZm9ybWVkVXNlciIsImVtYWlsIiwiZGlzcGxheU5hbWUiLCJmdWxsX25hbWUiLCJhdmF0YXIiLCJpc1ZlcmlmaWVkIiwiaXNfdmVyaWZpZWQiLCJpc09uYm9hcmRlZCIsInJvbGUiLCJiaW8iLCJjYXRlZ29yeSIsInNvY2lhbF9saW5rcyIsImJhbmtfYWNjb3VudCIsInN0YXRzIiwidG90YWxfZG9uYXRpb25zIiwidG90YWxfc3VwcG9ydGVycyIsImF2Z19kb25hdGlvbl9hbW91bnQiLCJsYXN0X2RvbmF0aW9uX2F0Iiwiam9pbmVkQXQiLCJjcmVhdGVkX2F0Iiwic3VjY2VzcyIsImNvbnNvbGUiLCJtZXNzYWdlIiwiZGV0YWlscyIsImhpbnQiLCJwcm9jZXNzIiwidW5kZWZpbmVkIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/v1/users/username/[username]/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/supabase.ts":
/*!*************************!*\
  !*** ./lib/supabase.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   STORAGE_BUCKETS: () => (/* binding */ STORAGE_BUCKETS),\n/* harmony export */   createSignedUrl: () => (/* binding */ createSignedUrl),\n/* harmony export */   deleteFile: () => (/* binding */ deleteFile),\n/* harmony export */   getPublicUrl: () => (/* binding */ getPublicUrl),\n/* harmony export */   supabase: () => (/* binding */ supabase),\n/* harmony export */   supabaseAdmin: () => (/* binding */ supabaseAdmin),\n/* harmony export */   uploadFile: () => (/* binding */ uploadFile)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/@supabase/supabase-js/dist/module/index.js\");\n\nconst supabaseUrl = \"https://swhkbukgkafoqyvljmrd.supabase.co\";\nconst supabaseAnonKey = \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3aGtidWtna2Fmb3F5dmxqbXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMDU1NzIsImV4cCI6MjA2Nzc4MTU3Mn0.kd0xWVLhcS0Ywog6-6CwmS4PRgz4hkyNibZGUSSRMRE\";\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseAnonKey);\nconst supabaseAdmin = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);\nconst STORAGE_BUCKETS = {\n    AVATARS: 'avatars',\n    UPLOADS: 'uploads',\n    ASSETS: 'assets'\n};\nconst uploadFile = async (file, bucket, path)=>{\n    const { data, error } = await supabase.storage.from(STORAGE_BUCKETS[bucket]).upload(path, file, {\n        cacheControl: '3600',\n        upsert: false\n    });\n    if (error) {\n        throw new Error(`Upload failed: ${error.message}`);\n    }\n    return data;\n};\nconst getPublicUrl = (bucket, path)=>{\n    const { data } = supabase.storage.from(STORAGE_BUCKETS[bucket]).getPublicUrl(path);\n    return data.publicUrl;\n};\nconst deleteFile = async (bucket, path)=>{\n    const { error } = await supabase.storage.from(STORAGE_BUCKETS[bucket]).remove([\n        path\n    ]);\n    if (error) {\n        throw new Error(`Delete failed: ${error.message}`);\n    }\n};\nconst createSignedUrl = async (bucket, path, expiresIn = 3600)=>{\n    const { data, error } = await supabase.storage.from(STORAGE_BUCKETS[bucket]).createSignedUrl(path, expiresIn);\n    if (error) {\n        throw new Error(`Create signed URL failed: ${error.message}`);\n    }\n    return data;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc3VwYWJhc2UudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBcUQ7QUFHckQsTUFBTUMsY0FBY0MsMENBQW9DO0FBQ3hELE1BQU1HLGtCQUFrQkgsa05BQXlDO0FBRTFELE1BQU1LLFdBQVdQLG1FQUFZQSxDQUFXQyxhQUFhSSxpQkFBaUI7QUFFdEUsTUFBTUcsZ0JBQWdCUixtRUFBWUEsQ0FDdkNDLGFBQ0FDLFFBQVFDLEdBQUcsQ0FBQ00seUJBQXlCLEVBQ3JDO0FBRUssTUFBTUMsa0JBQWtCO0lBQzdCQyxTQUFTO0lBQ1RDLFNBQVM7SUFDVEMsUUFBUTtBQUNWLEVBQVc7QUFFSixNQUFNQyxhQUFhLE9BQ3hCQyxNQUNBQyxRQUNBQztJQUVBLE1BQU0sRUFBRUMsSUFBSSxFQUFFQyxLQUFLLEVBQUUsR0FBRyxNQUFNWixTQUFTYSxPQUFPLENBQzNDQyxJQUFJLENBQUNYLGVBQWUsQ0FBQ00sT0FBTyxFQUM1Qk0sTUFBTSxDQUFDTCxNQUFNRixNQUFNO1FBQ2xCUSxjQUFjO1FBQ2RDLFFBQVE7SUFDVjtJQUVGLElBQUlMLE9BQU87UUFDVCxNQUFNLElBQUlNLE1BQU0sQ0FBQyxlQUFlLEVBQUVOLE1BQU1PLE9BQU8sRUFBRTtJQUNuRDtJQUVBLE9BQU9SO0FBQ1QsRUFBRTtBQUVLLE1BQU1TLGVBQWUsQ0FDMUJYLFFBQ0FDO0lBRUEsTUFBTSxFQUFFQyxJQUFJLEVBQUUsR0FBR1gsU0FBU2EsT0FBTyxDQUM5QkMsSUFBSSxDQUFDWCxlQUFlLENBQUNNLE9BQU8sRUFDNUJXLFlBQVksQ0FBQ1Y7SUFFaEIsT0FBT0MsS0FBS1UsU0FBUztBQUN2QixFQUFFO0FBRUssTUFBTUMsYUFBYSxPQUN4QmIsUUFDQUM7SUFFQSxNQUFNLEVBQUVFLEtBQUssRUFBRSxHQUFHLE1BQU1aLFNBQVNhLE9BQU8sQ0FDckNDLElBQUksQ0FBQ1gsZUFBZSxDQUFDTSxPQUFPLEVBQzVCYyxNQUFNLENBQUM7UUFBQ2I7S0FBSztJQUVoQixJQUFJRSxPQUFPO1FBQ1QsTUFBTSxJQUFJTSxNQUFNLENBQUMsZUFBZSxFQUFFTixNQUFNTyxPQUFPLEVBQUU7SUFDbkQ7QUFDRixFQUFFO0FBRUssTUFBTUssa0JBQWtCLE9BQzdCZixRQUNBQyxNQUNBZSxZQUFvQixJQUFJO0lBRXhCLE1BQU0sRUFBRWQsSUFBSSxFQUFFQyxLQUFLLEVBQUUsR0FBRyxNQUFNWixTQUFTYSxPQUFPLENBQzNDQyxJQUFJLENBQUNYLGVBQWUsQ0FBQ00sT0FBTyxFQUM1QmUsZUFBZSxDQUFDZCxNQUFNZTtJQUV6QixJQUFJYixPQUFPO1FBQ1QsTUFBTSxJQUFJTSxNQUFNLENBQUMsMEJBQTBCLEVBQUVOLE1BQU1PLE9BQU8sRUFBRTtJQUM5RDtJQUVBLE9BQU9SO0FBQ1QsRUFBRSIsInNvdXJjZXMiOlsiL1VzZXJzL2VyaWNvL3NvY2lhbGJ1enovbXktc29jaWFsYnV6ei1jbG9uZS9saWIvc3VwYWJhc2UudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSAnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJztcbmltcG9ydCB7IERhdGFiYXNlIH0gZnJvbSAnQC90eXBlcy9kYXRhYmFzZSc7XG5cbmNvbnN0IHN1cGFiYXNlVXJsID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMITtcbmNvbnN0IHN1cGFiYXNlQW5vbktleSA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZITtcblxuZXhwb3J0IGNvbnN0IHN1cGFiYXNlID0gY3JlYXRlQ2xpZW50PERhdGFiYXNlPihzdXBhYmFzZVVybCwgc3VwYWJhc2VBbm9uS2V5KTtcblxuZXhwb3J0IGNvbnN0IHN1cGFiYXNlQWRtaW4gPSBjcmVhdGVDbGllbnQ8RGF0YWJhc2U+KFxuICBzdXBhYmFzZVVybCxcbiAgcHJvY2Vzcy5lbnYuU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWSEsXG4pO1xuXG5leHBvcnQgY29uc3QgU1RPUkFHRV9CVUNLRVRTID0ge1xuICBBVkFUQVJTOiAnYXZhdGFycycsXG4gIFVQTE9BRFM6ICd1cGxvYWRzJyxcbiAgQVNTRVRTOiAnYXNzZXRzJyxcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCBjb25zdCB1cGxvYWRGaWxlID0gYXN5bmMgKFxuICBmaWxlOiBGaWxlLFxuICBidWNrZXQ6IGtleW9mIHR5cGVvZiBTVE9SQUdFX0JVQ0tFVFMsXG4gIHBhdGg6IHN0cmluZyxcbikgPT4ge1xuICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5zdG9yYWdlXG4gICAgLmZyb20oU1RPUkFHRV9CVUNLRVRTW2J1Y2tldF0pXG4gICAgLnVwbG9hZChwYXRoLCBmaWxlLCB7XG4gICAgICBjYWNoZUNvbnRyb2w6ICczNjAwJyxcbiAgICAgIHVwc2VydDogZmFsc2UsXG4gICAgfSk7XG5cbiAgaWYgKGVycm9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBVcGxvYWQgZmFpbGVkOiAke2Vycm9yLm1lc3NhZ2V9YCk7XG4gIH1cblxuICByZXR1cm4gZGF0YTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRQdWJsaWNVcmwgPSAoXG4gIGJ1Y2tldDoga2V5b2YgdHlwZW9mIFNUT1JBR0VfQlVDS0VUUyxcbiAgcGF0aDogc3RyaW5nLFxuKSA9PiB7XG4gIGNvbnN0IHsgZGF0YSB9ID0gc3VwYWJhc2Uuc3RvcmFnZVxuICAgIC5mcm9tKFNUT1JBR0VfQlVDS0VUU1tidWNrZXRdKVxuICAgIC5nZXRQdWJsaWNVcmwocGF0aCk7XG5cbiAgcmV0dXJuIGRhdGEucHVibGljVXJsO1xufTtcblxuZXhwb3J0IGNvbnN0IGRlbGV0ZUZpbGUgPSBhc3luYyAoXG4gIGJ1Y2tldDoga2V5b2YgdHlwZW9mIFNUT1JBR0VfQlVDS0VUUyxcbiAgcGF0aDogc3RyaW5nLFxuKSA9PiB7XG4gIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLnN0b3JhZ2VcbiAgICAuZnJvbShTVE9SQUdFX0JVQ0tFVFNbYnVja2V0XSlcbiAgICAucmVtb3ZlKFtwYXRoXSk7XG5cbiAgaWYgKGVycm9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBEZWxldGUgZmFpbGVkOiAke2Vycm9yLm1lc3NhZ2V9YCk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVTaWduZWRVcmwgPSBhc3luYyAoXG4gIGJ1Y2tldDoga2V5b2YgdHlwZW9mIFNUT1JBR0VfQlVDS0VUUyxcbiAgcGF0aDogc3RyaW5nLFxuICBleHBpcmVzSW46IG51bWJlciA9IDM2MDAsXG4pID0+IHtcbiAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2Uuc3RvcmFnZVxuICAgIC5mcm9tKFNUT1JBR0VfQlVDS0VUU1tidWNrZXRdKVxuICAgIC5jcmVhdGVTaWduZWRVcmwocGF0aCwgZXhwaXJlc0luKTtcblxuICBpZiAoZXJyb3IpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENyZWF0ZSBzaWduZWQgVVJMIGZhaWxlZDogJHtlcnJvci5tZXNzYWdlfWApO1xuICB9XG5cbiAgcmV0dXJuIGRhdGE7XG59O1xuIl0sIm5hbWVzIjpbImNyZWF0ZUNsaWVudCIsInN1cGFiYXNlVXJsIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCIsInN1cGFiYXNlQW5vbktleSIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZIiwic3VwYWJhc2UiLCJzdXBhYmFzZUFkbWluIiwiU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWSIsIlNUT1JBR0VfQlVDS0VUUyIsIkFWQVRBUlMiLCJVUExPQURTIiwiQVNTRVRTIiwidXBsb2FkRmlsZSIsImZpbGUiLCJidWNrZXQiLCJwYXRoIiwiZGF0YSIsImVycm9yIiwic3RvcmFnZSIsImZyb20iLCJ1cGxvYWQiLCJjYWNoZUNvbnRyb2wiLCJ1cHNlcnQiLCJFcnJvciIsIm1lc3NhZ2UiLCJnZXRQdWJsaWNVcmwiLCJwdWJsaWNVcmwiLCJkZWxldGVGaWxlIiwicmVtb3ZlIiwiY3JlYXRlU2lnbmVkVXJsIiwiZXhwaXJlc0luIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/supabase.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fusers%2Fusername%2F%5Busername%5D%2Froute&page=%2Fapi%2Fv1%2Fusers%2Fusername%2F%5Busername%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fusers%2Fusername%2F%5Busername%5D%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fusers%2Fusername%2F%5Busername%5D%2Froute&page=%2Fapi%2Fv1%2Fusers%2Fusername%2F%5Busername%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fusers%2Fusername%2F%5Busername%5D%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_erico_socialbuzz_my_socialbuzz_clone_app_api_v1_users_username_username_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/v1/users/username/[username]/route.ts */ \"(rsc)/./app/api/v1/users/username/[username]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/v1/users/username/[username]/route\",\n        pathname: \"/api/v1/users/username/[username]\",\n        filename: \"route\",\n        bundlePath: \"app/api/v1/users/username/[username]/route\"\n    },\n    resolvedPagePath: \"/Users/erico/socialbuzz/my-socialbuzz-clone/app/api/v1/users/username/[username]/route.ts\",\n    nextConfigOutput,\n    userland: _Users_erico_socialbuzz_my_socialbuzz_clone_app_api_v1_users_username_username_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZ2MSUyRnVzZXJzJTJGdXNlcm5hbWUlMkYlNUJ1c2VybmFtZSU1RCUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGdjElMkZ1c2VycyUyRnVzZXJuYW1lJTJGJTVCdXNlcm5hbWUlNUQlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZ2MSUyRnVzZXJzJTJGdXNlcm5hbWUlMkYlNUJ1c2VybmFtZSU1RCUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmVyaWNvJTJGc29jaWFsYnV6eiUyRm15LXNvY2lhbGJ1enotY2xvbmUlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGZXJpY28lMkZzb2NpYWxidXp6JTJGbXktc29jaWFsYnV6ei1jbG9uZSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDeUM7QUFDdEg7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9lcmljby9zb2NpYWxidXp6L215LXNvY2lhbGJ1enotY2xvbmUvYXBwL2FwaS92MS91c2Vycy91c2VybmFtZS9bdXNlcm5hbWVdL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS92MS91c2Vycy91c2VybmFtZS9bdXNlcm5hbWVdL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvdjEvdXNlcnMvdXNlcm5hbWUvW3VzZXJuYW1lXVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvdjEvdXNlcnMvdXNlcm5hbWUvW3VzZXJuYW1lXS9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9Vc2Vycy9lcmljby9zb2NpYWxidXp6L215LXNvY2lhbGJ1enotY2xvbmUvYXBwL2FwaS92MS91c2Vycy91c2VybmFtZS9bdXNlcm5hbWVdL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fusers%2Fusername%2F%5Busername%5D%2Froute&page=%2Fapi%2Fv1%2Fusers%2Fusername%2F%5Busername%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fusers%2Fusername%2F%5Busername%5D%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_require__ = require("../../../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@supabase","vendor-chunks/tr46","vendor-chunks/ws","vendor-chunks/whatwg-url","vendor-chunks/webidl-conversions","vendor-chunks/isows"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fusers%2Fusername%2F%5Busername%5D%2Froute&page=%2Fapi%2Fv1%2Fusers%2Fusername%2F%5Busername%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fusers%2Fusername%2F%5Busername%5D%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();