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
exports.id = "app/api/v1/users/donations/route";
exports.ids = ["app/api/v1/users/donations/route"];
exports.modules = {

/***/ "(rsc)/./app/api/v1/users/donations/route.ts":
/*!*********************************************!*\
  !*** ./app/api/v1/users/donations/route.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   OPTIONS: () => (/* binding */ OPTIONS)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_supabase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/supabase */ \"(rsc)/./lib/supabase.ts\");\n/* harmony import */ var _lib_middleware__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/middleware */ \"(rsc)/./lib/middleware.ts\");\n\n\n\n\nasync function OPTIONS(req) {\n    return (0,_lib_middleware__WEBPACK_IMPORTED_MODULE_2__.handleCors)(req) || new next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse(null, {\n        status: 200\n    });\n}\nconst GET = (0,_lib_middleware__WEBPACK_IMPORTED_MODULE_2__.withAuth)(async (req)=>{\n    try {\n        const { searchParams } = new URL(req.url);\n        const page = parseInt(searchParams.get('page') || '1');\n        const limit = parseInt(searchParams.get('limit') || '10');\n        const sortBy = searchParams.get('sortBy') || 'created_at';\n        const sortOrder = searchParams.get('sortOrder') || 'desc';\n        const offset = (page - 1) * limit;\n        const { data, error, count } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_1__.supabase.from('donations').select(`\n        *,\n        donor:users!donations_donor_id_fkey(\n          id,\n          username,\n          full_name,\n          avatar\n        ),\n        recipient:users!donations_recipient_id_fkey(\n          id,\n          username,\n          full_name,\n          avatar\n        )\n      `, {\n            count: 'exact'\n        }).eq('recipient_id', req.user.id).order(sortBy, {\n            ascending: sortOrder === 'asc'\n        }).range(offset, offset + limit - 1);\n        if (error) {\n            console.error('Error fetching donations:', error);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                success: false,\n                error: 'Failed to fetch donations'\n            }, {\n                status: 500\n            });\n        }\n        const total = count || 0;\n        const totalPages = Math.ceil(total / limit);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            data: {\n                data: data || [],\n                pagination: {\n                    page,\n                    limit,\n                    total,\n                    totalPages,\n                    hasNext: page < totalPages,\n                    hasPrev: page > 1\n                }\n            }\n        });\n    } catch (error) {\n        console.error('Get donations error:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: false,\n            error: 'Internal server error'\n        }, {\n            status: 500\n        });\n    }\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3YxL3VzZXJzL2RvbmF0aW9ucy9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUF3RDtBQUNkO0FBQ0U7QUFDRTtBQUV2QyxlQUFlSSxRQUFRQyxHQUFnQjtJQUM1QyxPQUFPRiwyREFBVUEsQ0FBQ0UsUUFBUSxJQUFJTCxxREFBWUEsQ0FBQyxNQUFNO1FBQUVNLFFBQVE7SUFBSTtBQUNqRTtBQUVPLE1BQU1DLE1BQU1MLHlEQUFRQSxDQUFDLE9BQU9HO0lBQ2pDLElBQUk7UUFDRixNQUFNLEVBQUVHLFlBQVksRUFBRSxHQUFHLElBQUlDLElBQUlKLElBQUlLLEdBQUc7UUFDeEMsTUFBTUMsT0FBT0MsU0FBU0osYUFBYUssR0FBRyxDQUFDLFdBQVc7UUFDbEQsTUFBTUMsUUFBUUYsU0FBU0osYUFBYUssR0FBRyxDQUFDLFlBQVk7UUFDcEQsTUFBTUUsU0FBU1AsYUFBYUssR0FBRyxDQUFDLGFBQWE7UUFDN0MsTUFBTUcsWUFBWVIsYUFBYUssR0FBRyxDQUFDLGdCQUFnQjtRQUVuRCxNQUFNSSxTQUFTLENBQUNOLE9BQU8sS0FBS0c7UUFFNUIsTUFBTSxFQUFFSSxJQUFJLEVBQUVDLEtBQUssRUFBRUMsS0FBSyxFQUFFLEdBQUcsTUFBTW5CLG1EQUFRQSxDQUMxQ29CLElBQUksQ0FBQyxhQUNMQyxNQUFNLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7TUFjVCxDQUFDLEVBQUU7WUFBRUYsT0FBTztRQUFRLEdBQ25CRyxFQUFFLENBQUMsZ0JBQWdCbEIsSUFBSW1CLElBQUksQ0FBQ0MsRUFBRSxFQUM5QkMsS0FBSyxDQUFDWCxRQUFRO1lBQUVZLFdBQVdYLGNBQWM7UUFBTSxHQUMvQ1ksS0FBSyxDQUFDWCxRQUFRQSxTQUFTSCxRQUFRO1FBRWxDLElBQUlLLE9BQU87WUFDVFUsUUFBUVYsS0FBSyxDQUFDLDZCQUE2QkE7WUFDM0MsT0FBT25CLHFEQUFZQSxDQUFDOEIsSUFBSSxDQUN0QjtnQkFBRUMsU0FBUztnQkFBT1osT0FBTztZQUE0QixHQUNyRDtnQkFBRWIsUUFBUTtZQUFJO1FBRWxCO1FBRUEsTUFBTTBCLFFBQVFaLFNBQVM7UUFDdkIsTUFBTWEsYUFBYUMsS0FBS0MsSUFBSSxDQUFDSCxRQUFRbEI7UUFFckMsT0FBT2QscURBQVlBLENBQUM4QixJQUFJLENBQUM7WUFDdkJDLFNBQVM7WUFDVGIsTUFBTTtnQkFDSkEsTUFBTUEsUUFBUSxFQUFFO2dCQUNoQmtCLFlBQVk7b0JBQ1Z6QjtvQkFDQUc7b0JBQ0FrQjtvQkFDQUM7b0JBQ0FJLFNBQVMxQixPQUFPc0I7b0JBQ2hCSyxTQUFTM0IsT0FBTztnQkFDbEI7WUFDRjtRQUNGO0lBQ0YsRUFBRSxPQUFPUSxPQUFPO1FBQ2RVLFFBQVFWLEtBQUssQ0FBQyx3QkFBd0JBO1FBQ3RDLE9BQU9uQixxREFBWUEsQ0FBQzhCLElBQUksQ0FDdEI7WUFBRUMsU0FBUztZQUFPWixPQUFPO1FBQXdCLEdBQ2pEO1lBQUViLFFBQVE7UUFBSTtJQUVsQjtBQUNGLEdBQUciLCJzb3VyY2VzIjpbIi9Vc2Vycy9lcmljby9zb2NpYWxidXp6L215LXNvY2lhbGJ1enotY2xvbmUvYXBwL2FwaS92MS91c2Vycy9kb25hdGlvbnMvcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJztcbmltcG9ydCB7IHN1cGFiYXNlIH0gZnJvbSAnQC9saWIvc3VwYWJhc2UnO1xuaW1wb3J0IHsgd2l0aEF1dGggfSBmcm9tICdAL2xpYi9taWRkbGV3YXJlJztcbmltcG9ydCB7IGhhbmRsZUNvcnMgfSBmcm9tICdAL2xpYi9taWRkbGV3YXJlJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIE9QVElPTlMocmVxOiBOZXh0UmVxdWVzdCkge1xuICByZXR1cm4gaGFuZGxlQ29ycyhyZXEpIHx8IG5ldyBOZXh0UmVzcG9uc2UobnVsbCwgeyBzdGF0dXM6IDIwMCB9KTtcbn1cblxuZXhwb3J0IGNvbnN0IEdFVCA9IHdpdGhBdXRoKGFzeW5jIChyZXEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IHNlYXJjaFBhcmFtcyB9ID0gbmV3IFVSTChyZXEudXJsKTtcbiAgICBjb25zdCBwYWdlID0gcGFyc2VJbnQoc2VhcmNoUGFyYW1zLmdldCgncGFnZScpIHx8ICcxJyk7XG4gICAgY29uc3QgbGltaXQgPSBwYXJzZUludChzZWFyY2hQYXJhbXMuZ2V0KCdsaW1pdCcpIHx8ICcxMCcpO1xuICAgIGNvbnN0IHNvcnRCeSA9IHNlYXJjaFBhcmFtcy5nZXQoJ3NvcnRCeScpIHx8ICdjcmVhdGVkX2F0JztcbiAgICBjb25zdCBzb3J0T3JkZXIgPSBzZWFyY2hQYXJhbXMuZ2V0KCdzb3J0T3JkZXInKSB8fCAnZGVzYyc7XG5cbiAgICBjb25zdCBvZmZzZXQgPSAocGFnZSAtIDEpICogbGltaXQ7XG5cbiAgICBjb25zdCB7IGRhdGEsIGVycm9yLCBjb3VudCB9ID0gYXdhaXQgc3VwYWJhc2VcbiAgICAgIC5mcm9tKCdkb25hdGlvbnMnKVxuICAgICAgLnNlbGVjdChgXG4gICAgICAgICosXG4gICAgICAgIGRvbm9yOnVzZXJzIWRvbmF0aW9uc19kb25vcl9pZF9ma2V5KFxuICAgICAgICAgIGlkLFxuICAgICAgICAgIHVzZXJuYW1lLFxuICAgICAgICAgIGZ1bGxfbmFtZSxcbiAgICAgICAgICBhdmF0YXJcbiAgICAgICAgKSxcbiAgICAgICAgcmVjaXBpZW50OnVzZXJzIWRvbmF0aW9uc19yZWNpcGllbnRfaWRfZmtleShcbiAgICAgICAgICBpZCxcbiAgICAgICAgICB1c2VybmFtZSxcbiAgICAgICAgICBmdWxsX25hbWUsXG4gICAgICAgICAgYXZhdGFyXG4gICAgICAgIClcbiAgICAgIGAsIHsgY291bnQ6ICdleGFjdCcgfSlcbiAgICAgIC5lcSgncmVjaXBpZW50X2lkJywgcmVxLnVzZXIuaWQpXG4gICAgICAub3JkZXIoc29ydEJ5LCB7IGFzY2VuZGluZzogc29ydE9yZGVyID09PSAnYXNjJyB9KVxuICAgICAgLnJhbmdlKG9mZnNldCwgb2Zmc2V0ICsgbGltaXQgLSAxKTtcblxuICAgIGlmIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgZG9uYXRpb25zOicsIGVycm9yKTtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdGYWlsZWQgdG8gZmV0Y2ggZG9uYXRpb25zJyB9LFxuICAgICAgICB7IHN0YXR1czogNTAwIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgdG90YWwgPSBjb3VudCB8fCAwO1xuICAgIGNvbnN0IHRvdGFsUGFnZXMgPSBNYXRoLmNlaWwodG90YWwgLyBsaW1pdCk7XG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oe1xuICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgZGF0YTogZGF0YSB8fCBbXSxcbiAgICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgbGltaXQsXG4gICAgICAgICAgdG90YWwsXG4gICAgICAgICAgdG90YWxQYWdlcyxcbiAgICAgICAgICBoYXNOZXh0OiBwYWdlIDwgdG90YWxQYWdlcyxcbiAgICAgICAgICBoYXNQcmV2OiBwYWdlID4gMSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignR2V0IGRvbmF0aW9ucyBlcnJvcjonLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdJbnRlcm5hbCBzZXJ2ZXIgZXJyb3InIH0sXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApO1xuICB9XG59KTsiXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwic3VwYWJhc2UiLCJ3aXRoQXV0aCIsImhhbmRsZUNvcnMiLCJPUFRJT05TIiwicmVxIiwic3RhdHVzIiwiR0VUIiwic2VhcmNoUGFyYW1zIiwiVVJMIiwidXJsIiwicGFnZSIsInBhcnNlSW50IiwiZ2V0IiwibGltaXQiLCJzb3J0QnkiLCJzb3J0T3JkZXIiLCJvZmZzZXQiLCJkYXRhIiwiZXJyb3IiLCJjb3VudCIsImZyb20iLCJzZWxlY3QiLCJlcSIsInVzZXIiLCJpZCIsIm9yZGVyIiwiYXNjZW5kaW5nIiwicmFuZ2UiLCJjb25zb2xlIiwianNvbiIsInN1Y2Nlc3MiLCJ0b3RhbCIsInRvdGFsUGFnZXMiLCJNYXRoIiwiY2VpbCIsInBhZ2luYXRpb24iLCJoYXNOZXh0IiwiaGFzUHJldiJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/v1/users/donations/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   extractTokenFromHeader: () => (/* binding */ extractTokenFromHeader),\n/* harmony export */   generateResetToken: () => (/* binding */ generateResetToken),\n/* harmony export */   generateToken: () => (/* binding */ generateToken),\n/* harmony export */   hashPassword: () => (/* binding */ hashPassword),\n/* harmony export */   isAdmin: () => (/* binding */ isAdmin),\n/* harmony export */   isSuperAdmin: () => (/* binding */ isSuperAdmin),\n/* harmony export */   verifyPassword: () => (/* binding */ verifyPassword),\n/* harmony export */   verifyResetToken: () => (/* binding */ verifyResetToken),\n/* harmony export */   verifyToken: () => (/* binding */ verifyToken)\n/* harmony export */ });\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jsonwebtoken */ \"(rsc)/./node_modules/jsonwebtoken/index.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';\nconst JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';\nconst hashPassword = async (password)=>{\n    const saltRounds = 12;\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_1___default().hash(password, saltRounds);\n};\nconst verifyPassword = async (password, hashedPassword)=>{\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_1___default().compare(password, hashedPassword);\n};\nconst generateToken = (user)=>{\n    return jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__.sign({\n        id: user.id,\n        email: user.email,\n        username: user.username,\n        role: user.role\n    }, JWT_SECRET, {\n        expiresIn: JWT_EXPIRES_IN\n    });\n};\nconst verifyToken = (token)=>{\n    try {\n        const decoded = jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__.verify(token, JWT_SECRET);\n        return {\n            userId: decoded.id,\n            email: decoded.email,\n            username: decoded.username,\n            role: decoded.role\n        };\n    } catch (error) {\n        return null;\n    }\n};\nconst generateResetToken = (email)=>{\n    return jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__.sign({\n        email\n    }, JWT_SECRET, {\n        expiresIn: '1h'\n    });\n};\nconst verifyResetToken = (token)=>{\n    try {\n        const decoded = jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__.verify(token, JWT_SECRET);\n        return decoded.email;\n    } catch (error) {\n        return null;\n    }\n};\nconst extractTokenFromHeader = (authHeader)=>{\n    if (!authHeader) {\n        return null;\n    }\n    const parts = authHeader.split(' ');\n    if (parts.length !== 2 || parts[0] !== 'Bearer') {\n        return null;\n    }\n    return parts[1];\n};\nconst isAdmin = (user)=>{\n    return user.role === 'admin' || user.role === 'super_admin';\n};\nconst isSuperAdmin = (user)=>{\n    return user.role === 'super_admin';\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQW9DO0FBQ047QUFHOUIsTUFBTUUsYUFBYUMsUUFBUUMsR0FBRyxDQUFDRixVQUFVLElBQUk7QUFDN0MsTUFBTUcsaUJBQWlCRixRQUFRQyxHQUFHLENBQUNDLGNBQWMsSUFBSTtBQUU5QyxNQUFNQyxlQUFlLE9BQU9DO0lBQ2pDLE1BQU1DLGFBQWE7SUFDbkIsT0FBT1Asb0RBQVcsQ0FBQ00sVUFBVUM7QUFDL0IsRUFBRTtBQUVLLE1BQU1FLGlCQUFpQixPQUM1QkgsVUFDQUk7SUFFQSxPQUFPVix1REFBYyxDQUFDTSxVQUFVSTtBQUNsQyxFQUFFO0FBRUssTUFBTUUsZ0JBQWdCLENBQUNDO0lBQzVCLE9BQU9kLDhDQUFRLENBQ2I7UUFDRWdCLElBQUlGLEtBQUtFLEVBQUU7UUFDWEMsT0FBT0gsS0FBS0csS0FBSztRQUNqQkMsVUFBVUosS0FBS0ksUUFBUTtRQUN2QkMsTUFBTUwsS0FBS0ssSUFBSTtJQUNqQixHQUNBakIsWUFDQTtRQUFFa0IsV0FBV2Y7SUFBZTtBQUVoQyxFQUFFO0FBRUssTUFBTWdCLGNBQWMsQ0FBQ0M7SUFDMUIsSUFBSTtRQUNGLE1BQU1DLFVBQVV2QixnREFBVSxDQUFDc0IsT0FBT3BCO1FBQ2xDLE9BQU87WUFDTHVCLFFBQVFGLFFBQVFQLEVBQUU7WUFDbEJDLE9BQU9NLFFBQVFOLEtBQUs7WUFDcEJDLFVBQVVLLFFBQVFMLFFBQVE7WUFDMUJDLE1BQU1JLFFBQVFKLElBQUk7UUFDcEI7SUFDRixFQUFFLE9BQU9PLE9BQU87UUFDZCxPQUFPO0lBQ1Q7QUFDRixFQUFFO0FBRUssTUFBTUMscUJBQXFCLENBQUNWO0lBQ2pDLE9BQU9qQiw4Q0FBUSxDQUFDO1FBQUVpQjtJQUFNLEdBQUdmLFlBQVk7UUFBRWtCLFdBQVc7SUFBSztBQUMzRCxFQUFFO0FBRUssTUFBTVEsbUJBQW1CLENBQUNOO0lBQy9CLElBQUk7UUFDRixNQUFNQyxVQUFVdkIsZ0RBQVUsQ0FBQ3NCLE9BQU9wQjtRQUNsQyxPQUFPcUIsUUFBUU4sS0FBSztJQUN0QixFQUFFLE9BQU9TLE9BQU87UUFDZCxPQUFPO0lBQ1Q7QUFDRixFQUFFO0FBRUssTUFBTUcseUJBQXlCLENBQUNDO0lBQ3JDLElBQUksQ0FBQ0EsWUFBWTtRQUNmLE9BQU87SUFDVDtJQUVBLE1BQU1DLFFBQVFELFdBQVdFLEtBQUssQ0FBQztJQUMvQixJQUFJRCxNQUFNRSxNQUFNLEtBQUssS0FBS0YsS0FBSyxDQUFDLEVBQUUsS0FBSyxVQUFVO1FBQy9DLE9BQU87SUFDVDtJQUVBLE9BQU9BLEtBQUssQ0FBQyxFQUFFO0FBQ2pCLEVBQUU7QUFFSyxNQUFNRyxVQUFVLENBQUNwQjtJQUN0QixPQUFPQSxLQUFLSyxJQUFJLEtBQUssV0FBV0wsS0FBS0ssSUFBSSxLQUFLO0FBQ2hELEVBQUU7QUFFSyxNQUFNZ0IsZUFBZSxDQUFDckI7SUFDM0IsT0FBT0EsS0FBS0ssSUFBSSxLQUFLO0FBQ3ZCLEVBQUUiLCJzb3VyY2VzIjpbIi9Vc2Vycy9lcmljby9zb2NpYWxidXp6L215LXNvY2lhbGJ1enotY2xvbmUvbGliL2F1dGgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgand0IGZyb20gJ2pzb253ZWJ0b2tlbic7XG5pbXBvcnQgYmNyeXB0IGZyb20gJ2JjcnlwdGpzJztcbmltcG9ydCB7IEF1dGhVc2VyIH0gZnJvbSAnQC90eXBlcy91c2VyJztcblxuY29uc3QgSldUX1NFQ1JFVCA9IHByb2Nlc3MuZW52LkpXVF9TRUNSRVQgfHwgJ3lvdXItc2VjcmV0LWtleSc7XG5jb25zdCBKV1RfRVhQSVJFU19JTiA9IHByb2Nlc3MuZW52LkpXVF9FWFBJUkVTX0lOIHx8ICc3ZCc7XG5cbmV4cG9ydCBjb25zdCBoYXNoUGFzc3dvcmQgPSBhc3luYyAocGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gIGNvbnN0IHNhbHRSb3VuZHMgPSAxMjtcbiAgcmV0dXJuIGJjcnlwdC5oYXNoKHBhc3N3b3JkLCBzYWx0Um91bmRzKTtcbn07XG5cbmV4cG9ydCBjb25zdCB2ZXJpZnlQYXNzd29yZCA9IGFzeW5jIChcbiAgcGFzc3dvcmQ6IHN0cmluZyxcbiAgaGFzaGVkUGFzc3dvcmQ6IHN0cmluZyxcbik6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuICByZXR1cm4gYmNyeXB0LmNvbXBhcmUocGFzc3dvcmQsIGhhc2hlZFBhc3N3b3JkKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZW5lcmF0ZVRva2VuID0gKHVzZXI6IGFueSk6IHN0cmluZyA9PiB7XG4gIHJldHVybiBqd3Quc2lnbihcbiAgICB7XG4gICAgICBpZDogdXNlci5pZCxcbiAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgdXNlcm5hbWU6IHVzZXIudXNlcm5hbWUsXG4gICAgICByb2xlOiB1c2VyLnJvbGUsXG4gICAgfSxcbiAgICBKV1RfU0VDUkVULFxuICAgIHsgZXhwaXJlc0luOiBKV1RfRVhQSVJFU19JTiB9LFxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IHZlcmlmeVRva2VuID0gKHRva2VuOiBzdHJpbmcpOiB7IHVzZXJJZDogc3RyaW5nOyBlbWFpbDogc3RyaW5nOyB1c2VybmFtZTogc3RyaW5nOyByb2xlOiBzdHJpbmcgfSB8IG51bGwgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGRlY29kZWQgPSBqd3QudmVyaWZ5KHRva2VuLCBKV1RfU0VDUkVUKSBhcyBhbnk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVzZXJJZDogZGVjb2RlZC5pZCxcbiAgICAgIGVtYWlsOiBkZWNvZGVkLmVtYWlsLFxuICAgICAgdXNlcm5hbWU6IGRlY29kZWQudXNlcm5hbWUsXG4gICAgICByb2xlOiBkZWNvZGVkLnJvbGUsXG4gICAgfTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGdlbmVyYXRlUmVzZXRUb2tlbiA9IChlbWFpbDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgcmV0dXJuIGp3dC5zaWduKHsgZW1haWwgfSwgSldUX1NFQ1JFVCwgeyBleHBpcmVzSW46ICcxaCcgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgdmVyaWZ5UmVzZXRUb2tlbiA9ICh0b2tlbjogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgZGVjb2RlZCA9IGp3dC52ZXJpZnkodG9rZW4sIEpXVF9TRUNSRVQpIGFzIGFueTtcbiAgICByZXR1cm4gZGVjb2RlZC5lbWFpbDtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RUb2tlbkZyb21IZWFkZXIgPSAoYXV0aEhlYWRlcjogc3RyaW5nIHwgbnVsbCk6IHN0cmluZyB8IG51bGwgPT4ge1xuICBpZiAoIWF1dGhIZWFkZXIpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IHBhcnRzID0gYXV0aEhlYWRlci5zcGxpdCgnICcpO1xuICBpZiAocGFydHMubGVuZ3RoICE9PSAyIHx8IHBhcnRzWzBdICE9PSAnQmVhcmVyJykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHBhcnRzWzFdO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzQWRtaW4gPSAodXNlcjogQXV0aFVzZXIpOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIHVzZXIucm9sZSA9PT0gJ2FkbWluJyB8fCB1c2VyLnJvbGUgPT09ICdzdXBlcl9hZG1pbic7XG59O1xuXG5leHBvcnQgY29uc3QgaXNTdXBlckFkbWluID0gKHVzZXI6IEF1dGhVc2VyKTogYm9vbGVhbiA9PiB7XG4gIHJldHVybiB1c2VyLnJvbGUgPT09ICdzdXBlcl9hZG1pbic7XG59O1xuIl0sIm5hbWVzIjpbImp3dCIsImJjcnlwdCIsIkpXVF9TRUNSRVQiLCJwcm9jZXNzIiwiZW52IiwiSldUX0VYUElSRVNfSU4iLCJoYXNoUGFzc3dvcmQiLCJwYXNzd29yZCIsInNhbHRSb3VuZHMiLCJoYXNoIiwidmVyaWZ5UGFzc3dvcmQiLCJoYXNoZWRQYXNzd29yZCIsImNvbXBhcmUiLCJnZW5lcmF0ZVRva2VuIiwidXNlciIsInNpZ24iLCJpZCIsImVtYWlsIiwidXNlcm5hbWUiLCJyb2xlIiwiZXhwaXJlc0luIiwidmVyaWZ5VG9rZW4iLCJ0b2tlbiIsImRlY29kZWQiLCJ2ZXJpZnkiLCJ1c2VySWQiLCJlcnJvciIsImdlbmVyYXRlUmVzZXRUb2tlbiIsInZlcmlmeVJlc2V0VG9rZW4iLCJleHRyYWN0VG9rZW5Gcm9tSGVhZGVyIiwiYXV0aEhlYWRlciIsInBhcnRzIiwic3BsaXQiLCJsZW5ndGgiLCJpc0FkbWluIiwiaXNTdXBlckFkbWluIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/middleware.ts":
/*!***************************!*\
  !*** ./lib/middleware.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   corsHeaders: () => (/* binding */ corsHeaders),\n/* harmony export */   handleCors: () => (/* binding */ handleCors),\n/* harmony export */   withAdminAuth: () => (/* binding */ withAdminAuth),\n/* harmony export */   withAuth: () => (/* binding */ withAuth),\n/* harmony export */   withSuperAdminAuth: () => (/* binding */ withSuperAdminAuth)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./auth */ \"(rsc)/./lib/auth.ts\");\n\n\nconst withAuth = (handler)=>{\n    return async (req)=>{\n        try {\n            const authHeader = req.headers.get('authorization');\n            const token = (0,_auth__WEBPACK_IMPORTED_MODULE_1__.extractTokenFromHeader)(authHeader);\n            if (!token) {\n                return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                    success: false,\n                    error: 'Authentication required'\n                }, {\n                    status: 401\n                });\n            }\n            const user = (0,_auth__WEBPACK_IMPORTED_MODULE_1__.verifyToken)(token);\n            if (!user) {\n                return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                    success: false,\n                    error: 'Invalid or expired token'\n                }, {\n                    status: 401\n                });\n            }\n            req.user = user;\n            return handler(req);\n        } catch (error) {\n            console.error('Auth middleware error:', error);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                success: false,\n                error: 'Authentication failed'\n            }, {\n                status: 401\n            });\n        }\n    };\n};\nconst withAdminAuth = (handler)=>{\n    return withAuth(async (req)=>{\n        if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                success: false,\n                error: 'Admin access required'\n            }, {\n                status: 403\n            });\n        }\n        return handler(req);\n    });\n};\nconst withSuperAdminAuth = (handler)=>{\n    return withAuth(async (req)=>{\n        if (req.user.role !== 'super_admin') {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                success: false,\n                error: 'Super admin access required'\n            }, {\n                status: 403\n            });\n        }\n        return handler(req);\n    });\n};\nconst corsHeaders = {\n    'Access-Control-Allow-Origin': '*',\n    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',\n    'Access-Control-Allow-Headers': 'Content-Type, Authorization'\n};\nconst handleCors = (req)=>{\n    if (req.method === 'OPTIONS') {\n        return new next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse(null, {\n            status: 200,\n            headers: corsHeaders\n        });\n    }\n    return null;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvbWlkZGxld2FyZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQXdEO0FBQ0s7QUFPdEQsTUFBTUcsV0FBVyxDQUN0QkM7SUFFQSxPQUFPLE9BQU9DO1FBQ1osSUFBSTtZQUNGLE1BQU1DLGFBQWFELElBQUlFLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDO1lBQ25DLE1BQU1DLFFBQVFQLDZEQUFzQkEsQ0FBQ0k7WUFFckMsSUFBSSxDQUFDRyxPQUFPO2dCQUNWLE9BQU9ULHFEQUFZQSxDQUFDVSxJQUFJLENBQ3RCO29CQUFFQyxTQUFTO29CQUFPQyxPQUFPO2dCQUEwQixHQUNuRDtvQkFBRUMsUUFBUTtnQkFBSTtZQUVsQjtZQUVBLE1BQU1DLE9BQU9iLGtEQUFXQSxDQUFDUTtZQUN6QixJQUFJLENBQUNLLE1BQU07Z0JBQ1QsT0FBT2QscURBQVlBLENBQUNVLElBQUksQ0FDdEI7b0JBQUVDLFNBQVM7b0JBQU9DLE9BQU87Z0JBQTJCLEdBQ3BEO29CQUFFQyxRQUFRO2dCQUFJO1lBRWxCO1lBRUNSLElBQTZCUyxJQUFJLEdBQUdBO1lBQ3JDLE9BQU9WLFFBQVFDO1FBQ2pCLEVBQUUsT0FBT08sT0FBTztZQUNkRyxRQUFRSCxLQUFLLENBQUMsMEJBQTBCQTtZQUN4QyxPQUFPWixxREFBWUEsQ0FBQ1UsSUFBSSxDQUN0QjtnQkFBRUMsU0FBUztnQkFBT0MsT0FBTztZQUF3QixHQUNqRDtnQkFBRUMsUUFBUTtZQUFJO1FBRWxCO0lBQ0Y7QUFDRixFQUFFO0FBRUssTUFBTUcsZ0JBQWdCLENBQzNCWjtJQUVBLE9BQU9ELFNBQVMsT0FBT0U7UUFDckIsSUFBSUEsSUFBSVMsSUFBSSxDQUFDRyxJQUFJLEtBQUssV0FBV1osSUFBSVMsSUFBSSxDQUFDRyxJQUFJLEtBQUssZUFBZTtZQUNoRSxPQUFPakIscURBQVlBLENBQUNVLElBQUksQ0FDdEI7Z0JBQUVDLFNBQVM7Z0JBQU9DLE9BQU87WUFBd0IsR0FDakQ7Z0JBQUVDLFFBQVE7WUFBSTtRQUVsQjtRQUNBLE9BQU9ULFFBQVFDO0lBQ2pCO0FBQ0YsRUFBRTtBQUVLLE1BQU1hLHFCQUFxQixDQUNoQ2Q7SUFFQSxPQUFPRCxTQUFTLE9BQU9FO1FBQ3JCLElBQUlBLElBQUlTLElBQUksQ0FBQ0csSUFBSSxLQUFLLGVBQWU7WUFDbkMsT0FBT2pCLHFEQUFZQSxDQUFDVSxJQUFJLENBQ3RCO2dCQUFFQyxTQUFTO2dCQUFPQyxPQUFPO1lBQThCLEdBQ3ZEO2dCQUFFQyxRQUFRO1lBQUk7UUFFbEI7UUFDQSxPQUFPVCxRQUFRQztJQUNqQjtBQUNGLEVBQUU7QUFFSyxNQUFNYyxjQUFjO0lBQ3pCLCtCQUErQjtJQUMvQixnQ0FBZ0M7SUFDaEMsZ0NBQWdDO0FBQ2xDLEVBQUU7QUFFSyxNQUFNQyxhQUFhLENBQUNmO0lBQ3pCLElBQUlBLElBQUlnQixNQUFNLEtBQUssV0FBVztRQUM1QixPQUFPLElBQUlyQixxREFBWUEsQ0FBQyxNQUFNO1lBQUVhLFFBQVE7WUFBS04sU0FBU1k7UUFBWTtJQUNwRTtJQUNBLE9BQU87QUFDVCxFQUFFIiwic291cmNlcyI6WyIvVXNlcnMvZXJpY28vc29jaWFsYnV6ei9teS1zb2NpYWxidXp6LWNsb25lL2xpYi9taWRkbGV3YXJlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XG5pbXBvcnQgeyB2ZXJpZnlUb2tlbiwgZXh0cmFjdFRva2VuRnJvbUhlYWRlciB9IGZyb20gJy4vYXV0aCc7XG5pbXBvcnQgeyBBdXRoVXNlciB9IGZyb20gJ0AvdHlwZXMvdXNlcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXV0aGVudGljYXRlZFJlcXVlc3QgZXh0ZW5kcyBOZXh0UmVxdWVzdCB7XG4gIHVzZXI6IEF1dGhVc2VyO1xufVxuXG5leHBvcnQgY29uc3Qgd2l0aEF1dGggPSAoXG4gIGhhbmRsZXI6IChyZXE6IEF1dGhlbnRpY2F0ZWRSZXF1ZXN0KSA9PiBQcm9taXNlPE5leHRSZXNwb25zZT4sXG4pID0+IHtcbiAgcmV0dXJuIGFzeW5jIChyZXE6IE5leHRSZXF1ZXN0KTogUHJvbWlzZTxOZXh0UmVzcG9uc2U+ID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgYXV0aEhlYWRlciA9IHJlcS5oZWFkZXJzLmdldCgnYXV0aG9yaXphdGlvbicpO1xuICAgICAgY29uc3QgdG9rZW4gPSBleHRyYWN0VG9rZW5Gcm9tSGVhZGVyKGF1dGhIZWFkZXIpO1xuXG4gICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgICB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ0F1dGhlbnRpY2F0aW9uIHJlcXVpcmVkJyB9LFxuICAgICAgICAgIHsgc3RhdHVzOiA0MDEgfSxcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdXNlciA9IHZlcmlmeVRva2VuKHRva2VuKTtcbiAgICAgIGlmICghdXNlcikge1xuICAgICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgICAgeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdJbnZhbGlkIG9yIGV4cGlyZWQgdG9rZW4nIH0sXG4gICAgICAgICAgeyBzdGF0dXM6IDQwMSB9LFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAocmVxIGFzIEF1dGhlbnRpY2F0ZWRSZXF1ZXN0KS51c2VyID0gdXNlcjtcbiAgICAgIHJldHVybiBoYW5kbGVyKHJlcSBhcyBBdXRoZW50aWNhdGVkUmVxdWVzdCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0F1dGggbWlkZGxld2FyZSBlcnJvcjonLCBlcnJvcik7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnQXV0aGVudGljYXRpb24gZmFpbGVkJyB9LFxuICAgICAgICB7IHN0YXR1czogNDAxIH0sXG4gICAgICApO1xuICAgIH1cbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCB3aXRoQWRtaW5BdXRoID0gKFxuICBoYW5kbGVyOiAocmVxOiBBdXRoZW50aWNhdGVkUmVxdWVzdCkgPT4gUHJvbWlzZTxOZXh0UmVzcG9uc2U+LFxuKSA9PiB7XG4gIHJldHVybiB3aXRoQXV0aChhc3luYyAocmVxOiBBdXRoZW50aWNhdGVkUmVxdWVzdCkgPT4ge1xuICAgIGlmIChyZXEudXNlci5yb2xlICE9PSAnYWRtaW4nICYmIHJlcS51c2VyLnJvbGUgIT09ICdzdXBlcl9hZG1pbicpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdBZG1pbiBhY2Nlc3MgcmVxdWlyZWQnIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDMgfSxcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBoYW5kbGVyKHJlcSk7XG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IHdpdGhTdXBlckFkbWluQXV0aCA9IChcbiAgaGFuZGxlcjogKHJlcTogQXV0aGVudGljYXRlZFJlcXVlc3QpID0+IFByb21pc2U8TmV4dFJlc3BvbnNlPixcbikgPT4ge1xuICByZXR1cm4gd2l0aEF1dGgoYXN5bmMgKHJlcTogQXV0aGVudGljYXRlZFJlcXVlc3QpID0+IHtcbiAgICBpZiAocmVxLnVzZXIucm9sZSAhPT0gJ3N1cGVyX2FkbWluJykge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ1N1cGVyIGFkbWluIGFjY2VzcyByZXF1aXJlZCcgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwMyB9LFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIGhhbmRsZXIocmVxKTtcbiAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgY29yc0hlYWRlcnMgPSB7XG4gICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKicsXG4gICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogJ0dFVCwgUE9TVCwgUFVULCBERUxFVEUsIE9QVElPTlMnLFxuICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdDb250ZW50LVR5cGUsIEF1dGhvcml6YXRpb24nLFxufTtcblxuZXhwb3J0IGNvbnN0IGhhbmRsZUNvcnMgPSAocmVxOiBOZXh0UmVxdWVzdCkgPT4ge1xuICBpZiAocmVxLm1ldGhvZCA9PT0gJ09QVElPTlMnKSB7XG4gICAgcmV0dXJuIG5ldyBOZXh0UmVzcG9uc2UobnVsbCwgeyBzdGF0dXM6IDIwMCwgaGVhZGVyczogY29yc0hlYWRlcnMgfSk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59O1xuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsInZlcmlmeVRva2VuIiwiZXh0cmFjdFRva2VuRnJvbUhlYWRlciIsIndpdGhBdXRoIiwiaGFuZGxlciIsInJlcSIsImF1dGhIZWFkZXIiLCJoZWFkZXJzIiwiZ2V0IiwidG9rZW4iLCJqc29uIiwic3VjY2VzcyIsImVycm9yIiwic3RhdHVzIiwidXNlciIsImNvbnNvbGUiLCJ3aXRoQWRtaW5BdXRoIiwicm9sZSIsIndpdGhTdXBlckFkbWluQXV0aCIsImNvcnNIZWFkZXJzIiwiaGFuZGxlQ29ycyIsIm1ldGhvZCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/middleware.ts\n");

/***/ }),

/***/ "(rsc)/./lib/supabase.ts":
/*!*************************!*\
  !*** ./lib/supabase.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   STORAGE_BUCKETS: () => (/* binding */ STORAGE_BUCKETS),\n/* harmony export */   createSignedUrl: () => (/* binding */ createSignedUrl),\n/* harmony export */   deleteFile: () => (/* binding */ deleteFile),\n/* harmony export */   getPublicUrl: () => (/* binding */ getPublicUrl),\n/* harmony export */   supabase: () => (/* binding */ supabase),\n/* harmony export */   supabaseAdmin: () => (/* binding */ supabaseAdmin),\n/* harmony export */   uploadFile: () => (/* binding */ uploadFile)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/@supabase/supabase-js/dist/module/index.js\");\n\nconst supabaseUrl = \"https://swhkbukgkafoqyvljmrd.supabase.co\";\nconst supabaseAnonKey = \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3aGtidWtna2Fmb3F5dmxqbXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMDU1NzIsImV4cCI6MjA2Nzc4MTU3Mn0.kd0xWVLhcS0Ywog6-6CwmS4PRgz4hkyNibZGUSSRMRE\";\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseAnonKey);\nconst supabaseAdmin = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);\nconst STORAGE_BUCKETS = {\n    AVATARS: 'avatars',\n    UPLOADS: 'uploads',\n    ASSETS: 'assets'\n};\nconst uploadFile = async (file, bucket, path)=>{\n    const { data, error } = await supabase.storage.from(STORAGE_BUCKETS[bucket]).upload(path, file, {\n        cacheControl: '3600',\n        upsert: false\n    });\n    if (error) {\n        throw new Error(`Upload failed: ${error.message}`);\n    }\n    return data;\n};\nconst getPublicUrl = (bucket, path)=>{\n    const { data } = supabase.storage.from(STORAGE_BUCKETS[bucket]).getPublicUrl(path);\n    return data.publicUrl;\n};\nconst deleteFile = async (bucket, path)=>{\n    const { error } = await supabase.storage.from(STORAGE_BUCKETS[bucket]).remove([\n        path\n    ]);\n    if (error) {\n        throw new Error(`Delete failed: ${error.message}`);\n    }\n};\nconst createSignedUrl = async (bucket, path, expiresIn = 3600)=>{\n    const { data, error } = await supabase.storage.from(STORAGE_BUCKETS[bucket]).createSignedUrl(path, expiresIn);\n    if (error) {\n        throw new Error(`Create signed URL failed: ${error.message}`);\n    }\n    return data;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc3VwYWJhc2UudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBcUQ7QUFHckQsTUFBTUMsY0FBY0MsMENBQW9DO0FBQ3hELE1BQU1HLGtCQUFrQkgsa05BQXlDO0FBRTFELE1BQU1LLFdBQVdQLG1FQUFZQSxDQUFXQyxhQUFhSSxpQkFBaUI7QUFFdEUsTUFBTUcsZ0JBQWdCUixtRUFBWUEsQ0FDdkNDLGFBQ0FDLFFBQVFDLEdBQUcsQ0FBQ00seUJBQXlCLEVBQ3JDO0FBRUssTUFBTUMsa0JBQWtCO0lBQzdCQyxTQUFTO0lBQ1RDLFNBQVM7SUFDVEMsUUFBUTtBQUNWLEVBQVc7QUFFSixNQUFNQyxhQUFhLE9BQ3hCQyxNQUNBQyxRQUNBQztJQUVBLE1BQU0sRUFBRUMsSUFBSSxFQUFFQyxLQUFLLEVBQUUsR0FBRyxNQUFNWixTQUFTYSxPQUFPLENBQzNDQyxJQUFJLENBQUNYLGVBQWUsQ0FBQ00sT0FBTyxFQUM1Qk0sTUFBTSxDQUFDTCxNQUFNRixNQUFNO1FBQ2xCUSxjQUFjO1FBQ2RDLFFBQVE7SUFDVjtJQUVGLElBQUlMLE9BQU87UUFDVCxNQUFNLElBQUlNLE1BQU0sQ0FBQyxlQUFlLEVBQUVOLE1BQU1PLE9BQU8sRUFBRTtJQUNuRDtJQUVBLE9BQU9SO0FBQ1QsRUFBRTtBQUVLLE1BQU1TLGVBQWUsQ0FDMUJYLFFBQ0FDO0lBRUEsTUFBTSxFQUFFQyxJQUFJLEVBQUUsR0FBR1gsU0FBU2EsT0FBTyxDQUM5QkMsSUFBSSxDQUFDWCxlQUFlLENBQUNNLE9BQU8sRUFDNUJXLFlBQVksQ0FBQ1Y7SUFFaEIsT0FBT0MsS0FBS1UsU0FBUztBQUN2QixFQUFFO0FBRUssTUFBTUMsYUFBYSxPQUN4QmIsUUFDQUM7SUFFQSxNQUFNLEVBQUVFLEtBQUssRUFBRSxHQUFHLE1BQU1aLFNBQVNhLE9BQU8sQ0FDckNDLElBQUksQ0FBQ1gsZUFBZSxDQUFDTSxPQUFPLEVBQzVCYyxNQUFNLENBQUM7UUFBQ2I7S0FBSztJQUVoQixJQUFJRSxPQUFPO1FBQ1QsTUFBTSxJQUFJTSxNQUFNLENBQUMsZUFBZSxFQUFFTixNQUFNTyxPQUFPLEVBQUU7SUFDbkQ7QUFDRixFQUFFO0FBRUssTUFBTUssa0JBQWtCLE9BQzdCZixRQUNBQyxNQUNBZSxZQUFvQixJQUFJO0lBRXhCLE1BQU0sRUFBRWQsSUFBSSxFQUFFQyxLQUFLLEVBQUUsR0FBRyxNQUFNWixTQUFTYSxPQUFPLENBQzNDQyxJQUFJLENBQUNYLGVBQWUsQ0FBQ00sT0FBTyxFQUM1QmUsZUFBZSxDQUFDZCxNQUFNZTtJQUV6QixJQUFJYixPQUFPO1FBQ1QsTUFBTSxJQUFJTSxNQUFNLENBQUMsMEJBQTBCLEVBQUVOLE1BQU1PLE9BQU8sRUFBRTtJQUM5RDtJQUVBLE9BQU9SO0FBQ1QsRUFBRSIsInNvdXJjZXMiOlsiL1VzZXJzL2VyaWNvL3NvY2lhbGJ1enovbXktc29jaWFsYnV6ei1jbG9uZS9saWIvc3VwYWJhc2UudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSAnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJztcbmltcG9ydCB7IERhdGFiYXNlIH0gZnJvbSAnQC90eXBlcy9kYXRhYmFzZSc7XG5cbmNvbnN0IHN1cGFiYXNlVXJsID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMITtcbmNvbnN0IHN1cGFiYXNlQW5vbktleSA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZITtcblxuZXhwb3J0IGNvbnN0IHN1cGFiYXNlID0gY3JlYXRlQ2xpZW50PERhdGFiYXNlPihzdXBhYmFzZVVybCwgc3VwYWJhc2VBbm9uS2V5KTtcblxuZXhwb3J0IGNvbnN0IHN1cGFiYXNlQWRtaW4gPSBjcmVhdGVDbGllbnQ8RGF0YWJhc2U+KFxuICBzdXBhYmFzZVVybCxcbiAgcHJvY2Vzcy5lbnYuU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWSEsXG4pO1xuXG5leHBvcnQgY29uc3QgU1RPUkFHRV9CVUNLRVRTID0ge1xuICBBVkFUQVJTOiAnYXZhdGFycycsXG4gIFVQTE9BRFM6ICd1cGxvYWRzJyxcbiAgQVNTRVRTOiAnYXNzZXRzJyxcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCBjb25zdCB1cGxvYWRGaWxlID0gYXN5bmMgKFxuICBmaWxlOiBGaWxlLFxuICBidWNrZXQ6IGtleW9mIHR5cGVvZiBTVE9SQUdFX0JVQ0tFVFMsXG4gIHBhdGg6IHN0cmluZyxcbikgPT4ge1xuICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5zdG9yYWdlXG4gICAgLmZyb20oU1RPUkFHRV9CVUNLRVRTW2J1Y2tldF0pXG4gICAgLnVwbG9hZChwYXRoLCBmaWxlLCB7XG4gICAgICBjYWNoZUNvbnRyb2w6ICczNjAwJyxcbiAgICAgIHVwc2VydDogZmFsc2UsXG4gICAgfSk7XG5cbiAgaWYgKGVycm9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBVcGxvYWQgZmFpbGVkOiAke2Vycm9yLm1lc3NhZ2V9YCk7XG4gIH1cblxuICByZXR1cm4gZGF0YTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRQdWJsaWNVcmwgPSAoXG4gIGJ1Y2tldDoga2V5b2YgdHlwZW9mIFNUT1JBR0VfQlVDS0VUUyxcbiAgcGF0aDogc3RyaW5nLFxuKSA9PiB7XG4gIGNvbnN0IHsgZGF0YSB9ID0gc3VwYWJhc2Uuc3RvcmFnZVxuICAgIC5mcm9tKFNUT1JBR0VfQlVDS0VUU1tidWNrZXRdKVxuICAgIC5nZXRQdWJsaWNVcmwocGF0aCk7XG5cbiAgcmV0dXJuIGRhdGEucHVibGljVXJsO1xufTtcblxuZXhwb3J0IGNvbnN0IGRlbGV0ZUZpbGUgPSBhc3luYyAoXG4gIGJ1Y2tldDoga2V5b2YgdHlwZW9mIFNUT1JBR0VfQlVDS0VUUyxcbiAgcGF0aDogc3RyaW5nLFxuKSA9PiB7XG4gIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLnN0b3JhZ2VcbiAgICAuZnJvbShTVE9SQUdFX0JVQ0tFVFNbYnVja2V0XSlcbiAgICAucmVtb3ZlKFtwYXRoXSk7XG5cbiAgaWYgKGVycm9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBEZWxldGUgZmFpbGVkOiAke2Vycm9yLm1lc3NhZ2V9YCk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVTaWduZWRVcmwgPSBhc3luYyAoXG4gIGJ1Y2tldDoga2V5b2YgdHlwZW9mIFNUT1JBR0VfQlVDS0VUUyxcbiAgcGF0aDogc3RyaW5nLFxuICBleHBpcmVzSW46IG51bWJlciA9IDM2MDAsXG4pID0+IHtcbiAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2Uuc3RvcmFnZVxuICAgIC5mcm9tKFNUT1JBR0VfQlVDS0VUU1tidWNrZXRdKVxuICAgIC5jcmVhdGVTaWduZWRVcmwocGF0aCwgZXhwaXJlc0luKTtcblxuICBpZiAoZXJyb3IpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENyZWF0ZSBzaWduZWQgVVJMIGZhaWxlZDogJHtlcnJvci5tZXNzYWdlfWApO1xuICB9XG5cbiAgcmV0dXJuIGRhdGE7XG59O1xuIl0sIm5hbWVzIjpbImNyZWF0ZUNsaWVudCIsInN1cGFiYXNlVXJsIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCIsInN1cGFiYXNlQW5vbktleSIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZIiwic3VwYWJhc2UiLCJzdXBhYmFzZUFkbWluIiwiU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWSIsIlNUT1JBR0VfQlVDS0VUUyIsIkFWQVRBUlMiLCJVUExPQURTIiwiQVNTRVRTIiwidXBsb2FkRmlsZSIsImZpbGUiLCJidWNrZXQiLCJwYXRoIiwiZGF0YSIsImVycm9yIiwic3RvcmFnZSIsImZyb20iLCJ1cGxvYWQiLCJjYWNoZUNvbnRyb2wiLCJ1cHNlcnQiLCJFcnJvciIsIm1lc3NhZ2UiLCJnZXRQdWJsaWNVcmwiLCJwdWJsaWNVcmwiLCJkZWxldGVGaWxlIiwicmVtb3ZlIiwiY3JlYXRlU2lnbmVkVXJsIiwiZXhwaXJlc0luIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/supabase.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fusers%2Fdonations%2Froute&page=%2Fapi%2Fv1%2Fusers%2Fdonations%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fusers%2Fdonations%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fusers%2Fdonations%2Froute&page=%2Fapi%2Fv1%2Fusers%2Fdonations%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fusers%2Fdonations%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_erico_socialbuzz_my_socialbuzz_clone_app_api_v1_users_donations_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/v1/users/donations/route.ts */ \"(rsc)/./app/api/v1/users/donations/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/v1/users/donations/route\",\n        pathname: \"/api/v1/users/donations\",\n        filename: \"route\",\n        bundlePath: \"app/api/v1/users/donations/route\"\n    },\n    resolvedPagePath: \"/Users/erico/socialbuzz/my-socialbuzz-clone/app/api/v1/users/donations/route.ts\",\n    nextConfigOutput,\n    userland: _Users_erico_socialbuzz_my_socialbuzz_clone_app_api_v1_users_donations_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZ2MSUyRnVzZXJzJTJGZG9uYXRpb25zJTJGcm91dGUmcGFnZT0lMkZhcGklMkZ2MSUyRnVzZXJzJTJGZG9uYXRpb25zJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGdjElMkZ1c2VycyUyRmRvbmF0aW9ucyUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmVyaWNvJTJGc29jaWFsYnV6eiUyRm15LXNvY2lhbGJ1enotY2xvbmUlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGZXJpY28lMkZzb2NpYWxidXp6JTJGbXktc29jaWFsYnV6ei1jbG9uZSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDK0I7QUFDNUc7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9lcmljby9zb2NpYWxidXp6L215LXNvY2lhbGJ1enotY2xvbmUvYXBwL2FwaS92MS91c2Vycy9kb25hdGlvbnMvcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3YxL3VzZXJzL2RvbmF0aW9ucy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3YxL3VzZXJzL2RvbmF0aW9uc1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvdjEvdXNlcnMvZG9uYXRpb25zL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL2VyaWNvL3NvY2lhbGJ1enovbXktc29jaWFsYnV6ei1jbG9uZS9hcHAvYXBpL3YxL3VzZXJzL2RvbmF0aW9ucy9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fusers%2Fdonations%2Froute&page=%2Fapi%2Fv1%2Fusers%2Fdonations%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fusers%2Fdonations%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/ms","vendor-chunks/@supabase","vendor-chunks/tr46","vendor-chunks/ws","vendor-chunks/semver","vendor-chunks/bcryptjs","vendor-chunks/whatwg-url","vendor-chunks/jsonwebtoken","vendor-chunks/lodash.includes","vendor-chunks/jws","vendor-chunks/lodash.once","vendor-chunks/jwa","vendor-chunks/lodash.isinteger","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/webidl-conversions","vendor-chunks/lodash.isplainobject","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isboolean","vendor-chunks/safe-buffer","vendor-chunks/buffer-equal-constant-time","vendor-chunks/isows"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fusers%2Fdonations%2Froute&page=%2Fapi%2Fv1%2Fusers%2Fdonations%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fusers%2Fdonations%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();