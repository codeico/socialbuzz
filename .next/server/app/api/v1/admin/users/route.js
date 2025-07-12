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
exports.id = "app/api/v1/admin/users/route";
exports.ids = ["app/api/v1/admin/users/route"];
exports.modules = {

/***/ "(rsc)/./app/api/v1/admin/users/route.ts":
/*!*****************************************!*\
  !*** ./app/api/v1/admin/users/route.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n/* harmony import */ var _lib_supabase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/supabase */ \"(rsc)/./lib/supabase.ts\");\n\n\n\nasync function GET(request) {\n    try {\n        const token = request.headers.get('authorization')?.replace('Bearer ', '');\n        if (!token) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Unauthorized'\n            }, {\n                status: 401\n            });\n        }\n        const decoded = (0,_lib_auth__WEBPACK_IMPORTED_MODULE_1__.verifyToken)(token);\n        if (!decoded) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Invalid token'\n            }, {\n                status: 401\n            });\n        }\n        // Check if user is admin\n        const { data: user, error: userError } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabaseAdmin.from('users').select('role').eq('id', decoded.userId).single();\n        if (userError || ![\n            'admin',\n            'super_admin'\n        ].includes(user.role)) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Forbidden'\n            }, {\n                status: 403\n            });\n        }\n        const { searchParams } = new URL(request.url);\n        const page = parseInt(searchParams.get('page') || '1');\n        const limit = parseInt(searchParams.get('limit') || '20');\n        const search = searchParams.get('search');\n        const role = searchParams.get('role');\n        const status = searchParams.get('status');\n        const offset = (page - 1) * limit;\n        let query = _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabaseAdmin.from('users').select('*', {\n            count: 'exact'\n        }).order('created_at', {\n            ascending: false\n        }).range(offset, offset + limit - 1);\n        // Apply filters\n        if (search) {\n            query = query.or(`username.ilike.%${search}%,full_name.ilike.%${search}%,email.ilike.%${search}%`);\n        }\n        if (role && role !== 'all') {\n            query = query.eq('role', role);\n        }\n        if (status && status !== 'all') {\n            if (status === 'verified') {\n                query = query.eq('is_verified', true);\n            } else if (status === 'unverified') {\n                query = query.eq('is_verified', false);\n            }\n        }\n        const { data: users, error, count } = await query;\n        if (error) {\n            throw error;\n        }\n        // Remove password_hash from response\n        const sanitizedUsers = users?.map((user)=>{\n            const { password_hash, ...sanitizedUser } = user;\n            return sanitizedUser;\n        }) || [];\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            data: sanitizedUsers,\n            pagination: {\n                page,\n                limit,\n                total: count || 0,\n                totalPages: Math.ceil((count || 0) / limit)\n            }\n        });\n    } catch (error) {\n        console.error('Admin users fetch error:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to fetch users'\n        }, {\n            status: 500\n        });\n    }\n}\nasync function POST(request) {\n    try {\n        const token = request.headers.get('authorization')?.replace('Bearer ', '');\n        if (!token) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Unauthorized'\n            }, {\n                status: 401\n            });\n        }\n        const decoded = (0,_lib_auth__WEBPACK_IMPORTED_MODULE_1__.verifyToken)(token);\n        if (!decoded) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Invalid token'\n            }, {\n                status: 401\n            });\n        }\n        // Check if user is admin\n        const { data: user, error: userError } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabaseAdmin.from('users').select('role').eq('id', decoded.userId).single();\n        if (userError || ![\n            'admin',\n            'super_admin'\n        ].includes(user.role)) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Forbidden'\n            }, {\n                status: 403\n            });\n        }\n        const body = await request.json();\n        const { email, username, full_name, password_hash, role = 'user' } = body;\n        // Validate required fields\n        if (!email || !username || !full_name || !password_hash) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Email, username, full name, and password are required'\n            }, {\n                status: 400\n            });\n        }\n        // Create new user\n        const { data: newUser, error } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabaseAdmin.from('users').insert({\n            email,\n            username,\n            full_name,\n            password_hash,\n            role,\n            is_verified: false,\n            balance: 0,\n            total_earnings: 0,\n            total_donations: 0\n        }).select().single();\n        if (error) {\n            throw error;\n        }\n        // Remove password_hash from response\n        const { password_hash: _, ...sanitizedUser } = newUser;\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            message: 'User created successfully',\n            data: sanitizedUser\n        });\n    } catch (error) {\n        console.error('Admin user creation error:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to create user'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUk7UUFDakU7UUFFQSxNQUFNdUMsT0FBTyxNQUFNOUMsUUFBUUssSUFBSTtRQUMvQixNQUFNLEVBQUUwQyxLQUFLLEVBQUVDLFFBQVEsRUFBRUMsU0FBUyxFQUFFYixhQUFhLEVBQUVsQixPQUFPLE1BQU0sRUFBRSxHQUFHNEI7UUFFckUsMkJBQTJCO1FBQzNCLElBQUksQ0FBQ0MsU0FBUyxDQUFDQyxZQUFZLENBQUNDLGFBQWEsQ0FBQ2IsZUFBZTtZQUN2RCxPQUFPeEMscURBQVlBLENBQUNTLElBQUksQ0FDdEI7Z0JBQUVDLE9BQU87WUFBd0QsR0FDakU7Z0JBQUVDLFFBQVE7WUFBSTtRQUVsQjtRQUVBLGtCQUFrQjtRQUNsQixNQUFNLEVBQUVFLE1BQU15QyxPQUFPLEVBQUU1QyxLQUFLLEVBQUUsR0FBRyxNQUFNUix3REFBYUEsQ0FDakRjLElBQUksQ0FBQyxTQUNMdUMsTUFBTSxDQUFDO1lBQ05KO1lBQ0FDO1lBQ0FDO1lBQ0FiO1lBQ0FsQjtZQUNBa0MsYUFBYTtZQUNiQyxTQUFTO1lBQ1RDLGdCQUFnQjtZQUNoQkMsaUJBQWlCO1FBQ25CLEdBQ0MxQyxNQUFNLEdBQ05HLE1BQU07UUFFVCxJQUFJVixPQUFPO1lBQ1QsTUFBTUE7UUFDUjtRQUVBLHFDQUFxQztRQUNyQyxNQUFNLEVBQUU4QixlQUFlb0IsQ0FBQyxFQUFFLEdBQUduQixlQUFlLEdBQUdhO1FBRS9DLE9BQU90RCxxREFBWUEsQ0FBQ1MsSUFBSSxDQUFDO1lBQ3ZCaUMsU0FBUztZQUNUbUIsU0FBUztZQUNUaEQsTUFBTTRCO1FBQ1I7SUFDRixFQUFFLE9BQU8vQixPQUFPO1FBQ2RzQyxRQUFRdEMsS0FBSyxDQUFDLDhCQUE4QkE7UUFDNUMsT0FBT1YscURBQVlBLENBQUNTLElBQUksQ0FDdEI7WUFBRUMsT0FBTztRQUF3QixHQUNqQztZQUFFQyxRQUFRO1FBQUk7SUFFbEI7QUFDRiIsInNvdXJjZXMiOlsiL1VzZXJzL2VyaWNvL3NvY2lhbGJ1enovbXktc29jaWFsYnV6ei1jbG9uZS9hcHAvYXBpL3YxL2FkbWluL3VzZXJzL3JvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XG5pbXBvcnQgeyB2ZXJpZnlUb2tlbiB9IGZyb20gJ0AvbGliL2F1dGgnO1xuaW1wb3J0IHsgc3VwYWJhc2VBZG1pbiB9IGZyb20gJ0AvbGliL3N1cGFiYXNlJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVChyZXF1ZXN0OiBOZXh0UmVxdWVzdCkge1xuICB0cnkge1xuICAgIGNvbnN0IHRva2VuID0gcmVxdWVzdC5oZWFkZXJzLmdldCgnYXV0aG9yaXphdGlvbicpPy5yZXBsYWNlKCdCZWFyZXIgJywgJycpO1xuICAgIGlmICghdG9rZW4pIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnVW5hdXRob3JpemVkJyB9LCB7IHN0YXR1czogNDAxIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGRlY29kZWQgPSB2ZXJpZnlUb2tlbih0b2tlbik7XG4gICAgaWYgKCFkZWNvZGVkKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ0ludmFsaWQgdG9rZW4nIH0sIHsgc3RhdHVzOiA0MDEgfSk7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgdXNlciBpcyBhZG1pblxuICAgIGNvbnN0IHsgZGF0YTogdXNlciwgZXJyb3I6IHVzZXJFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VBZG1pblxuICAgICAgLmZyb20oJ3VzZXJzJylcbiAgICAgIC5zZWxlY3QoJ3JvbGUnKVxuICAgICAgLmVxKCdpZCcsIGRlY29kZWQudXNlcklkKVxuICAgICAgLnNpbmdsZSgpO1xuXG4gICAgaWYgKHVzZXJFcnJvciB8fCAhWydhZG1pbicsICdzdXBlcl9hZG1pbiddLmluY2x1ZGVzKHVzZXIucm9sZSkpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnRm9yYmlkZGVuJyB9LCB7IHN0YXR1czogNDAzIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHsgc2VhcmNoUGFyYW1zIH0gPSBuZXcgVVJMKHJlcXVlc3QudXJsKTtcbiAgICBjb25zdCBwYWdlID0gcGFyc2VJbnQoc2VhcmNoUGFyYW1zLmdldCgncGFnZScpIHx8ICcxJyk7XG4gICAgY29uc3QgbGltaXQgPSBwYXJzZUludChzZWFyY2hQYXJhbXMuZ2V0KCdsaW1pdCcpIHx8ICcyMCcpO1xuICAgIGNvbnN0IHNlYXJjaCA9IHNlYXJjaFBhcmFtcy5nZXQoJ3NlYXJjaCcpO1xuICAgIGNvbnN0IHJvbGUgPSBzZWFyY2hQYXJhbXMuZ2V0KCdyb2xlJyk7XG4gICAgY29uc3Qgc3RhdHVzID0gc2VhcmNoUGFyYW1zLmdldCgnc3RhdHVzJyk7XG4gICAgY29uc3Qgb2Zmc2V0ID0gKHBhZ2UgLSAxKSAqIGxpbWl0O1xuXG4gICAgbGV0IHF1ZXJ5ID0gc3VwYWJhc2VBZG1pblxuICAgICAgLmZyb20oJ3VzZXJzJylcbiAgICAgIC5zZWxlY3QoJyonLCB7IGNvdW50OiAnZXhhY3QnIH0pXG4gICAgICAub3JkZXIoJ2NyZWF0ZWRfYXQnLCB7IGFzY2VuZGluZzogZmFsc2UgfSlcbiAgICAgIC5yYW5nZShvZmZzZXQsIG9mZnNldCArIGxpbWl0IC0gMSk7XG5cbiAgICAvLyBBcHBseSBmaWx0ZXJzXG4gICAgaWYgKHNlYXJjaCkge1xuICAgICAgcXVlcnkgPSBxdWVyeS5vcihgdXNlcm5hbWUuaWxpa2UuJSR7c2VhcmNofSUsZnVsbF9uYW1lLmlsaWtlLiUke3NlYXJjaH0lLGVtYWlsLmlsaWtlLiUke3NlYXJjaH0lYCk7XG4gICAgfVxuXG4gICAgaWYgKHJvbGUgJiYgcm9sZSAhPT0gJ2FsbCcpIHtcbiAgICAgIHF1ZXJ5ID0gcXVlcnkuZXEoJ3JvbGUnLCByb2xlKTtcbiAgICB9XG5cbiAgICBpZiAoc3RhdHVzICYmIHN0YXR1cyAhPT0gJ2FsbCcpIHtcbiAgICAgIGlmIChzdGF0dXMgPT09ICd2ZXJpZmllZCcpIHtcbiAgICAgICAgcXVlcnkgPSBxdWVyeS5lcSgnaXNfdmVyaWZpZWQnLCB0cnVlKTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSAndW52ZXJpZmllZCcpIHtcbiAgICAgICAgcXVlcnkgPSBxdWVyeS5lcSgnaXNfdmVyaWZpZWQnLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgeyBkYXRhOiB1c2VycywgZXJyb3IsIGNvdW50IH0gPSBhd2FpdCBxdWVyeTtcblxuICAgIGlmIChlcnJvcikge1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIHBhc3N3b3JkX2hhc2ggZnJvbSByZXNwb25zZVxuICAgIGNvbnN0IHNhbml0aXplZFVzZXJzID0gdXNlcnM/Lm1hcCh1c2VyID0+IHtcbiAgICAgIGNvbnN0IHsgcGFzc3dvcmRfaGFzaCwgLi4uc2FuaXRpemVkVXNlciB9ID0gdXNlcjtcbiAgICAgIHJldHVybiBzYW5pdGl6ZWRVc2VyO1xuICAgIH0pIHx8IFtdO1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICBkYXRhOiBzYW5pdGl6ZWRVc2VycyxcbiAgICAgIHBhZ2luYXRpb246IHtcbiAgICAgICAgcGFnZSxcbiAgICAgICAgbGltaXQsXG4gICAgICAgIHRvdGFsOiBjb3VudCB8fCAwLFxuICAgICAgICB0b3RhbFBhZ2VzOiBNYXRoLmNlaWwoKGNvdW50IHx8IDApIC8gbGltaXQpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdBZG1pbiB1c2VycyBmZXRjaCBlcnJvcjonLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBlcnJvcjogJ0ZhaWxlZCB0byBmZXRjaCB1c2VycycgfSxcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB0b2tlbiA9IHJlcXVlc3QuaGVhZGVycy5nZXQoJ2F1dGhvcml6YXRpb24nKT8ucmVwbGFjZSgnQmVhcmVyICcsICcnKTtcbiAgICBpZiAoIXRva2VuKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ1VuYXV0aG9yaXplZCcgfSwgeyBzdGF0dXM6IDQwMSB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBkZWNvZGVkID0gdmVyaWZ5VG9rZW4odG9rZW4pO1xuICAgIGlmICghZGVjb2RlZCkge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdJbnZhbGlkIHRva2VuJyB9LCB7IHN0YXR1czogNDAxIH0pO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIHVzZXIgaXMgYWRtaW5cbiAgICBjb25zdCB7IGRhdGE6IHVzZXIsIGVycm9yOiB1c2VyRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW5cbiAgICAgIC5mcm9tKCd1c2VycycpXG4gICAgICAuc2VsZWN0KCdyb2xlJylcbiAgICAgIC5lcSgnaWQnLCBkZWNvZGVkLnVzZXJJZClcbiAgICAgIC5zaW5nbGUoKTtcblxuICAgIGlmICh1c2VyRXJyb3IgfHwgIVsnYWRtaW4nLCAnc3VwZXJfYWRtaW4nXS5pbmNsdWRlcyh1c2VyLnJvbGUpKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ0ZvcmJpZGRlbicgfSwgeyBzdGF0dXM6IDQwMyB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBib2R5ID0gYXdhaXQgcmVxdWVzdC5qc29uKCk7XG4gICAgY29uc3QgeyBlbWFpbCwgdXNlcm5hbWUsIGZ1bGxfbmFtZSwgcGFzc3dvcmRfaGFzaCwgcm9sZSA9ICd1c2VyJyB9ID0gYm9keTtcblxuICAgIC8vIFZhbGlkYXRlIHJlcXVpcmVkIGZpZWxkc1xuICAgIGlmICghZW1haWwgfHwgIXVzZXJuYW1lIHx8ICFmdWxsX25hbWUgfHwgIXBhc3N3b3JkX2hhc2gpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogJ0VtYWlsLCB1c2VybmFtZSwgZnVsbCBuYW1lLCBhbmQgcGFzc3dvcmQgYXJlIHJlcXVpcmVkJyB9LFxuICAgICAgICB7IHN0YXR1czogNDAwIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIG5ldyB1c2VyXG4gICAgY29uc3QgeyBkYXRhOiBuZXdVc2VyLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VBZG1pblxuICAgICAgLmZyb20oJ3VzZXJzJylcbiAgICAgIC5pbnNlcnQoe1xuICAgICAgICBlbWFpbCxcbiAgICAgICAgdXNlcm5hbWUsXG4gICAgICAgIGZ1bGxfbmFtZSxcbiAgICAgICAgcGFzc3dvcmRfaGFzaCxcbiAgICAgICAgcm9sZSxcbiAgICAgICAgaXNfdmVyaWZpZWQ6IGZhbHNlLFxuICAgICAgICBiYWxhbmNlOiAwLFxuICAgICAgICB0b3RhbF9lYXJuaW5nczogMCxcbiAgICAgICAgdG90YWxfZG9uYXRpb25zOiAwLFxuICAgICAgfSlcbiAgICAgIC5zZWxlY3QoKVxuICAgICAgLnNpbmdsZSgpO1xuXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgcGFzc3dvcmRfaGFzaCBmcm9tIHJlc3BvbnNlXG4gICAgY29uc3QgeyBwYXNzd29yZF9oYXNoOiBfLCAuLi5zYW5pdGl6ZWRVc2VyIH0gPSBuZXdVc2VyO1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICBtZXNzYWdlOiAnVXNlciBjcmVhdGVkIHN1Y2Nlc3NmdWxseScsXG4gICAgICBkYXRhOiBzYW5pdGl6ZWRVc2VyLFxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0FkbWluIHVzZXIgY3JlYXRpb24gZXJyb3I6JywgZXJyb3IpO1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgIHsgZXJyb3I6ICdGYWlsZWQgdG8gY3JlYXRlIHVzZXInIH0sXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApO1xuICB9XG59Il0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsInZlcmlmeVRva2VuIiwic3VwYWJhc2VBZG1pbiIsIkdFVCIsInJlcXVlc3QiLCJ0b2tlbiIsImhlYWRlcnMiLCJnZXQiLCJyZXBsYWNlIiwianNvbiIsImVycm9yIiwic3RhdHVzIiwiZGVjb2RlZCIsImRhdGEiLCJ1c2VyIiwidXNlckVycm9yIiwiZnJvbSIsInNlbGVjdCIsImVxIiwidXNlcklkIiwic2luZ2xlIiwiaW5jbHVkZXMiLCJyb2xlIiwic2VhcmNoUGFyYW1zIiwiVVJMIiwidXJsIiwicGFnZSIsInBhcnNlSW50IiwibGltaXQiLCJzZWFyY2giLCJvZmZzZXQiLCJxdWVyeSIsImNvdW50Iiwib3JkZXIiLCJhc2NlbmRpbmciLCJyYW5nZSIsIm9yIiwidXNlcnMiLCJzYW5pdGl6ZWRVc2VycyIsIm1hcCIsInBhc3N3b3JkX2hhc2giLCJzYW5pdGl6ZWRVc2VyIiwic3VjY2VzcyIsInBhZ2luYXRpb24iLCJ0b3RhbCIsInRvdGFsUGFnZXMiLCJNYXRoIiwiY2VpbCIsImNvbnNvbGUiLCJQT1NUIiwiYm9keSIsImVtYWlsIiwidXNlcm5hbWUiLCJmdWxsX25hbWUiLCJuZXdVc2VyIiwiaW5zZXJ0IiwiaXNfdmVyaWZpZWQiLCJiYWxhbmNlIiwidG90YWxfZWFybmluZ3MiLCJ0b3RhbF9kb25hdGlvbnMiLCJfIiwibWVzc2FnZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/v1/admin/users/route.ts\n");

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

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fadmin%2Fusers%2Froute&page=%2Fapi%2Fv1%2Fadmin%2Fusers%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fadmin%2Fusers%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fadmin%2Fusers%2Froute&page=%2Fapi%2Fv1%2Fadmin%2Fusers%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fadmin%2Fusers%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_erico_socialbuzz_my_socialbuzz_clone_app_api_v1_admin_users_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/v1/admin/users/route.ts */ \"(rsc)/./app/api/v1/admin/users/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/v1/admin/users/route\",\n        pathname: \"/api/v1/admin/users\",\n        filename: \"route\",\n        bundlePath: \"app/api/v1/admin/users/route\"\n    },\n    resolvedPagePath: \"/Users/erico/socialbuzz/my-socialbuzz-clone/app/api/v1/admin/users/route.ts\",\n    nextConfigOutput,\n    userland: _Users_erico_socialbuzz_my_socialbuzz_clone_app_api_v1_admin_users_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZ2MSUyRmFkbWluJTJGdXNlcnMlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnYxJTJGYWRtaW4lMkZ1c2VycyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnYxJTJGYWRtaW4lMkZ1c2VycyUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmVyaWNvJTJGc29jaWFsYnV6eiUyRm15LXNvY2lhbGJ1enotY2xvbmUlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGZXJpY28lMkZzb2NpYWxidXp6JTJGbXktc29jaWFsYnV6ei1jbG9uZSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDMkI7QUFDeEc7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9lcmljby9zb2NpYWxidXp6L215LXNvY2lhbGJ1enotY2xvbmUvYXBwL2FwaS92MS9hZG1pbi91c2Vycy9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvdjEvYWRtaW4vdXNlcnMvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS92MS9hZG1pbi91c2Vyc1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvdjEvYWRtaW4vdXNlcnMvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvZXJpY28vc29jaWFsYnV6ei9teS1zb2NpYWxidXp6LWNsb25lL2FwcC9hcGkvdjEvYWRtaW4vdXNlcnMvcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fadmin%2Fusers%2Froute&page=%2Fapi%2Fv1%2Fadmin%2Fusers%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fadmin%2Fusers%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/ms","vendor-chunks/@supabase","vendor-chunks/tr46","vendor-chunks/ws","vendor-chunks/semver","vendor-chunks/bcryptjs","vendor-chunks/whatwg-url","vendor-chunks/jsonwebtoken","vendor-chunks/lodash.includes","vendor-chunks/jws","vendor-chunks/lodash.once","vendor-chunks/jwa","vendor-chunks/lodash.isinteger","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/webidl-conversions","vendor-chunks/lodash.isplainobject","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isboolean","vendor-chunks/safe-buffer","vendor-chunks/buffer-equal-constant-time","vendor-chunks/isows"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fadmin%2Fusers%2Froute&page=%2Fapi%2Fv1%2Fadmin%2Fusers%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fadmin%2Fusers%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();