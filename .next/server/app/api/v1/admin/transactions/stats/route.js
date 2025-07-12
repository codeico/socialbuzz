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
exports.id = "app/api/v1/admin/transactions/stats/route";
exports.ids = ["app/api/v1/admin/transactions/stats/route"];
exports.modules = {

/***/ "(rsc)/./app/api/v1/admin/transactions/stats/route.ts":
/*!******************************************************!*\
  !*** ./app/api/v1/admin/transactions/stats/route.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n/* harmony import */ var _lib_supabase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/supabase */ \"(rsc)/./lib/supabase.ts\");\n\n\n\nasync function GET(request) {\n    try {\n        const token = request.headers.get('authorization')?.replace('Bearer ', '');\n        if (!token) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Unauthorized'\n            }, {\n                status: 401\n            });\n        }\n        const decoded = (0,_lib_auth__WEBPACK_IMPORTED_MODULE_1__.verifyToken)(token);\n        if (!decoded) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Invalid token'\n            }, {\n                status: 401\n            });\n        }\n        // Check if user is admin\n        const { data: user, error: userError } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabaseAdmin.from('users').select('role').eq('id', decoded.userId).single();\n        if (userError || ![\n            'admin',\n            'super_admin'\n        ].includes(user.role)) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Forbidden'\n            }, {\n                status: 403\n            });\n        }\n        // Get total transactions\n        const { count: totalTransactions } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabaseAdmin.from('transactions').select('*', {\n            count: 'exact',\n            head: true\n        });\n        // Get total amount\n        const { data: totalAmountData } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabaseAdmin.from('transactions').select('amount').eq('status', 'completed');\n        const totalAmount = totalAmountData?.reduce((sum, t)=>sum + t.amount, 0) || 0;\n        // Get pending transactions\n        const { count: pendingTransactions } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabaseAdmin.from('transactions').select('*', {\n            count: 'exact',\n            head: true\n        }).eq('status', 'pending');\n        // Get failed transactions\n        const { count: failedTransactions } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabaseAdmin.from('transactions').select('*', {\n            count: 'exact',\n            head: true\n        }).eq('status', 'failed');\n        // Get completed transactions\n        const { count: completedTransactions } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabaseAdmin.from('transactions').select('*', {\n            count: 'exact',\n            head: true\n        }).eq('status', 'completed');\n        // Get today's amount\n        const today = new Date();\n        today.setHours(0, 0, 0, 0);\n        const { data: todayAmountData } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabaseAdmin.from('transactions').select('amount').eq('status', 'completed').gte('created_at', today.toISOString());\n        const todayAmount = todayAmountData?.reduce((sum, t)=>sum + t.amount, 0) || 0;\n        const stats = {\n            totalTransactions: totalTransactions || 0,\n            totalAmount,\n            pendingTransactions: pendingTransactions || 0,\n            failedTransactions: failedTransactions || 0,\n            completedTransactions: completedTransactions || 0,\n            todayAmount\n        };\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            data: stats\n        });\n    } catch (error) {\n        console.error('Admin transaction stats error:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to fetch transaction stats'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3YxL2FkbWluL3RyYW5zYWN0aW9ucy9zdGF0cy9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQXdEO0FBQ2Y7QUFDTTtBQUV4QyxlQUFlRyxJQUFJQyxPQUFvQjtJQUM1QyxJQUFJO1FBQ0YsTUFBTUMsUUFBUUQsUUFBUUUsT0FBTyxDQUFDQyxHQUFHLENBQUMsa0JBQWtCQyxRQUFRLFdBQVc7UUFDdkUsSUFBSSxDQUFDSCxPQUFPO1lBQ1YsT0FBT0wscURBQVlBLENBQUNTLElBQUksQ0FBQztnQkFBRUMsT0FBTztZQUFlLEdBQUc7Z0JBQUVDLFFBQVE7WUFBSTtRQUNwRTtRQUVBLE1BQU1DLFVBQVVYLHNEQUFXQSxDQUFDSTtRQUM1QixJQUFJLENBQUNPLFNBQVM7WUFDWixPQUFPWixxREFBWUEsQ0FBQ1MsSUFBSSxDQUFDO2dCQUFFQyxPQUFPO1lBQWdCLEdBQUc7Z0JBQUVDLFFBQVE7WUFBSTtRQUNyRTtRQUVBLHlCQUF5QjtRQUN6QixNQUFNLEVBQUVFLE1BQU1DLElBQUksRUFBRUosT0FBT0ssU0FBUyxFQUFFLEdBQUcsTUFBTWIsd0RBQWFBLENBQ3pEYyxJQUFJLENBQUMsU0FDTEMsTUFBTSxDQUFDLFFBQ1BDLEVBQUUsQ0FBQyxNQUFNTixRQUFRTyxNQUFNLEVBQ3ZCQyxNQUFNO1FBRVQsSUFBSUwsYUFBYSxDQUFDO1lBQUM7WUFBUztTQUFjLENBQUNNLFFBQVEsQ0FBQ1AsS0FBS1EsSUFBSSxHQUFHO1lBQzlELE9BQU90QixxREFBWUEsQ0FBQ1MsSUFBSSxDQUFDO2dCQUFFQyxPQUFPO1lBQVksR0FBRztnQkFBRUMsUUFBUTtZQUFJO1FBQ2pFO1FBRUEseUJBQXlCO1FBQ3pCLE1BQU0sRUFBRVksT0FBT0MsaUJBQWlCLEVBQUUsR0FBRyxNQUFNdEIsd0RBQWFBLENBQ3JEYyxJQUFJLENBQUMsZ0JBQ0xDLE1BQU0sQ0FBQyxLQUFLO1lBQUVNLE9BQU87WUFBU0UsTUFBTTtRQUFLO1FBRTVDLG1CQUFtQjtRQUNuQixNQUFNLEVBQUVaLE1BQU1hLGVBQWUsRUFBRSxHQUFHLE1BQU14Qix3REFBYUEsQ0FDbERjLElBQUksQ0FBQyxnQkFDTEMsTUFBTSxDQUFDLFVBQ1BDLEVBQUUsQ0FBQyxVQUFVO1FBRWhCLE1BQU1TLGNBQWNELGlCQUFpQkUsT0FBTyxDQUFDQyxLQUFLQyxJQUFNRCxNQUFNQyxFQUFFQyxNQUFNLEVBQUUsTUFBTTtRQUU5RSwyQkFBMkI7UUFDM0IsTUFBTSxFQUFFUixPQUFPUyxtQkFBbUIsRUFBRSxHQUFHLE1BQU05Qix3REFBYUEsQ0FDdkRjLElBQUksQ0FBQyxnQkFDTEMsTUFBTSxDQUFDLEtBQUs7WUFBRU0sT0FBTztZQUFTRSxNQUFNO1FBQUssR0FDekNQLEVBQUUsQ0FBQyxVQUFVO1FBRWhCLDBCQUEwQjtRQUMxQixNQUFNLEVBQUVLLE9BQU9VLGtCQUFrQixFQUFFLEdBQUcsTUFBTS9CLHdEQUFhQSxDQUN0RGMsSUFBSSxDQUFDLGdCQUNMQyxNQUFNLENBQUMsS0FBSztZQUFFTSxPQUFPO1lBQVNFLE1BQU07UUFBSyxHQUN6Q1AsRUFBRSxDQUFDLFVBQVU7UUFFaEIsNkJBQTZCO1FBQzdCLE1BQU0sRUFBRUssT0FBT1cscUJBQXFCLEVBQUUsR0FBRyxNQUFNaEMsd0RBQWFBLENBQ3pEYyxJQUFJLENBQUMsZ0JBQ0xDLE1BQU0sQ0FBQyxLQUFLO1lBQUVNLE9BQU87WUFBU0UsTUFBTTtRQUFLLEdBQ3pDUCxFQUFFLENBQUMsVUFBVTtRQUVoQixxQkFBcUI7UUFDckIsTUFBTWlCLFFBQVEsSUFBSUM7UUFDbEJELE1BQU1FLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRztRQUN4QixNQUFNLEVBQUV4QixNQUFNeUIsZUFBZSxFQUFFLEdBQUcsTUFBTXBDLHdEQUFhQSxDQUNsRGMsSUFBSSxDQUFDLGdCQUNMQyxNQUFNLENBQUMsVUFDUEMsRUFBRSxDQUFDLFVBQVUsYUFDYnFCLEdBQUcsQ0FBQyxjQUFjSixNQUFNSyxXQUFXO1FBRXRDLE1BQU1DLGNBQWNILGlCQUFpQlYsT0FBTyxDQUFDQyxLQUFLQyxJQUFNRCxNQUFNQyxFQUFFQyxNQUFNLEVBQUUsTUFBTTtRQUU5RSxNQUFNVyxRQUFRO1lBQ1psQixtQkFBbUJBLHFCQUFxQjtZQUN4Q0c7WUFDQUsscUJBQXFCQSx1QkFBdUI7WUFDNUNDLG9CQUFvQkEsc0JBQXNCO1lBQzFDQyx1QkFBdUJBLHlCQUF5QjtZQUNoRE87UUFDRjtRQUVBLE9BQU96QyxxREFBWUEsQ0FBQ1MsSUFBSSxDQUFDO1lBQ3ZCa0MsU0FBUztZQUNUOUIsTUFBTTZCO1FBQ1I7SUFDRixFQUFFLE9BQU9oQyxPQUFPO1FBQ2RrQyxRQUFRbEMsS0FBSyxDQUFDLGtDQUFrQ0E7UUFDaEQsT0FBT1YscURBQVlBLENBQUNTLElBQUksQ0FDdEI7WUFBRUMsT0FBTztRQUFvQyxHQUM3QztZQUFFQyxRQUFRO1FBQUk7SUFFbEI7QUFDRiIsInNvdXJjZXMiOlsiL1VzZXJzL2VyaWNvL3NvY2lhbGJ1enovbXktc29jaWFsYnV6ei1jbG9uZS9hcHAvYXBpL3YxL2FkbWluL3RyYW5zYWN0aW9ucy9zdGF0cy9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVxdWVzdCwgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuaW1wb3J0IHsgdmVyaWZ5VG9rZW4gfSBmcm9tICdAL2xpYi9hdXRoJztcbmltcG9ydCB7IHN1cGFiYXNlQWRtaW4gfSBmcm9tICdAL2xpYi9zdXBhYmFzZSc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB0b2tlbiA9IHJlcXVlc3QuaGVhZGVycy5nZXQoJ2F1dGhvcml6YXRpb24nKT8ucmVwbGFjZSgnQmVhcmVyICcsICcnKTtcbiAgICBpZiAoIXRva2VuKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ1VuYXV0aG9yaXplZCcgfSwgeyBzdGF0dXM6IDQwMSB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBkZWNvZGVkID0gdmVyaWZ5VG9rZW4odG9rZW4pO1xuICAgIGlmICghZGVjb2RlZCkge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdJbnZhbGlkIHRva2VuJyB9LCB7IHN0YXR1czogNDAxIH0pO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIHVzZXIgaXMgYWRtaW5cbiAgICBjb25zdCB7IGRhdGE6IHVzZXIsIGVycm9yOiB1c2VyRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW5cbiAgICAgIC5mcm9tKCd1c2VycycpXG4gICAgICAuc2VsZWN0KCdyb2xlJylcbiAgICAgIC5lcSgnaWQnLCBkZWNvZGVkLnVzZXJJZClcbiAgICAgIC5zaW5nbGUoKTtcblxuICAgIGlmICh1c2VyRXJyb3IgfHwgIVsnYWRtaW4nLCAnc3VwZXJfYWRtaW4nXS5pbmNsdWRlcyh1c2VyLnJvbGUpKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ0ZvcmJpZGRlbicgfSwgeyBzdGF0dXM6IDQwMyB9KTtcbiAgICB9XG5cbiAgICAvLyBHZXQgdG90YWwgdHJhbnNhY3Rpb25zXG4gICAgY29uc3QgeyBjb3VudDogdG90YWxUcmFuc2FjdGlvbnMgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW5cbiAgICAgIC5mcm9tKCd0cmFuc2FjdGlvbnMnKVxuICAgICAgLnNlbGVjdCgnKicsIHsgY291bnQ6ICdleGFjdCcsIGhlYWQ6IHRydWUgfSk7XG5cbiAgICAvLyBHZXQgdG90YWwgYW1vdW50XG4gICAgY29uc3QgeyBkYXRhOiB0b3RhbEFtb3VudERhdGEgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW5cbiAgICAgIC5mcm9tKCd0cmFuc2FjdGlvbnMnKVxuICAgICAgLnNlbGVjdCgnYW1vdW50JylcbiAgICAgIC5lcSgnc3RhdHVzJywgJ2NvbXBsZXRlZCcpO1xuXG4gICAgY29uc3QgdG90YWxBbW91bnQgPSB0b3RhbEFtb3VudERhdGE/LnJlZHVjZSgoc3VtLCB0KSA9PiBzdW0gKyB0LmFtb3VudCwgMCkgfHwgMDtcblxuICAgIC8vIEdldCBwZW5kaW5nIHRyYW5zYWN0aW9uc1xuICAgIGNvbnN0IHsgY291bnQ6IHBlbmRpbmdUcmFuc2FjdGlvbnMgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW5cbiAgICAgIC5mcm9tKCd0cmFuc2FjdGlvbnMnKVxuICAgICAgLnNlbGVjdCgnKicsIHsgY291bnQ6ICdleGFjdCcsIGhlYWQ6IHRydWUgfSlcbiAgICAgIC5lcSgnc3RhdHVzJywgJ3BlbmRpbmcnKTtcblxuICAgIC8vIEdldCBmYWlsZWQgdHJhbnNhY3Rpb25zXG4gICAgY29uc3QgeyBjb3VudDogZmFpbGVkVHJhbnNhY3Rpb25zIH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluXG4gICAgICAuZnJvbSgndHJhbnNhY3Rpb25zJylcbiAgICAgIC5zZWxlY3QoJyonLCB7IGNvdW50OiAnZXhhY3QnLCBoZWFkOiB0cnVlIH0pXG4gICAgICAuZXEoJ3N0YXR1cycsICdmYWlsZWQnKTtcblxuICAgIC8vIEdldCBjb21wbGV0ZWQgdHJhbnNhY3Rpb25zXG4gICAgY29uc3QgeyBjb3VudDogY29tcGxldGVkVHJhbnNhY3Rpb25zIH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluXG4gICAgICAuZnJvbSgndHJhbnNhY3Rpb25zJylcbiAgICAgIC5zZWxlY3QoJyonLCB7IGNvdW50OiAnZXhhY3QnLCBoZWFkOiB0cnVlIH0pXG4gICAgICAuZXEoJ3N0YXR1cycsICdjb21wbGV0ZWQnKTtcblxuICAgIC8vIEdldCB0b2RheSdzIGFtb3VudFxuICAgIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKTtcbiAgICB0b2RheS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICBjb25zdCB7IGRhdGE6IHRvZGF5QW1vdW50RGF0YSB9ID0gYXdhaXQgc3VwYWJhc2VBZG1pblxuICAgICAgLmZyb20oJ3RyYW5zYWN0aW9ucycpXG4gICAgICAuc2VsZWN0KCdhbW91bnQnKVxuICAgICAgLmVxKCdzdGF0dXMnLCAnY29tcGxldGVkJylcbiAgICAgIC5ndGUoJ2NyZWF0ZWRfYXQnLCB0b2RheS50b0lTT1N0cmluZygpKTtcblxuICAgIGNvbnN0IHRvZGF5QW1vdW50ID0gdG9kYXlBbW91bnREYXRhPy5yZWR1Y2UoKHN1bSwgdCkgPT4gc3VtICsgdC5hbW91bnQsIDApIHx8IDA7XG5cbiAgICBjb25zdCBzdGF0cyA9IHtcbiAgICAgIHRvdGFsVHJhbnNhY3Rpb25zOiB0b3RhbFRyYW5zYWN0aW9ucyB8fCAwLFxuICAgICAgdG90YWxBbW91bnQsXG4gICAgICBwZW5kaW5nVHJhbnNhY3Rpb25zOiBwZW5kaW5nVHJhbnNhY3Rpb25zIHx8IDAsXG4gICAgICBmYWlsZWRUcmFuc2FjdGlvbnM6IGZhaWxlZFRyYW5zYWN0aW9ucyB8fCAwLFxuICAgICAgY29tcGxldGVkVHJhbnNhY3Rpb25zOiBjb21wbGV0ZWRUcmFuc2FjdGlvbnMgfHwgMCxcbiAgICAgIHRvZGF5QW1vdW50LFxuICAgIH07XG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oe1xuICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgIGRhdGE6IHN0YXRzLFxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0FkbWluIHRyYW5zYWN0aW9uIHN0YXRzIGVycm9yOicsIGVycm9yKTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IGVycm9yOiAnRmFpbGVkIHRvIGZldGNoIHRyYW5zYWN0aW9uIHN0YXRzJyB9LFxuICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgKTtcbiAgfVxufSJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJ2ZXJpZnlUb2tlbiIsInN1cGFiYXNlQWRtaW4iLCJHRVQiLCJyZXF1ZXN0IiwidG9rZW4iLCJoZWFkZXJzIiwiZ2V0IiwicmVwbGFjZSIsImpzb24iLCJlcnJvciIsInN0YXR1cyIsImRlY29kZWQiLCJkYXRhIiwidXNlciIsInVzZXJFcnJvciIsImZyb20iLCJzZWxlY3QiLCJlcSIsInVzZXJJZCIsInNpbmdsZSIsImluY2x1ZGVzIiwicm9sZSIsImNvdW50IiwidG90YWxUcmFuc2FjdGlvbnMiLCJoZWFkIiwidG90YWxBbW91bnREYXRhIiwidG90YWxBbW91bnQiLCJyZWR1Y2UiLCJzdW0iLCJ0IiwiYW1vdW50IiwicGVuZGluZ1RyYW5zYWN0aW9ucyIsImZhaWxlZFRyYW5zYWN0aW9ucyIsImNvbXBsZXRlZFRyYW5zYWN0aW9ucyIsInRvZGF5IiwiRGF0ZSIsInNldEhvdXJzIiwidG9kYXlBbW91bnREYXRhIiwiZ3RlIiwidG9JU09TdHJpbmciLCJ0b2RheUFtb3VudCIsInN0YXRzIiwic3VjY2VzcyIsImNvbnNvbGUiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/v1/admin/transactions/stats/route.ts\n");

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

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fadmin%2Ftransactions%2Fstats%2Froute&page=%2Fapi%2Fv1%2Fadmin%2Ftransactions%2Fstats%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fadmin%2Ftransactions%2Fstats%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fadmin%2Ftransactions%2Fstats%2Froute&page=%2Fapi%2Fv1%2Fadmin%2Ftransactions%2Fstats%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fadmin%2Ftransactions%2Fstats%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_erico_socialbuzz_my_socialbuzz_clone_app_api_v1_admin_transactions_stats_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/v1/admin/transactions/stats/route.ts */ \"(rsc)/./app/api/v1/admin/transactions/stats/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/v1/admin/transactions/stats/route\",\n        pathname: \"/api/v1/admin/transactions/stats\",\n        filename: \"route\",\n        bundlePath: \"app/api/v1/admin/transactions/stats/route\"\n    },\n    resolvedPagePath: \"/Users/erico/socialbuzz/my-socialbuzz-clone/app/api/v1/admin/transactions/stats/route.ts\",\n    nextConfigOutput,\n    userland: _Users_erico_socialbuzz_my_socialbuzz_clone_app_api_v1_admin_transactions_stats_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZ2MSUyRmFkbWluJTJGdHJhbnNhY3Rpb25zJTJGc3RhdHMlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnYxJTJGYWRtaW4lMkZ0cmFuc2FjdGlvbnMlMkZzdGF0cyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnYxJTJGYWRtaW4lMkZ0cmFuc2FjdGlvbnMlMkZzdGF0cyUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmVyaWNvJTJGc29jaWFsYnV6eiUyRm15LXNvY2lhbGJ1enotY2xvbmUlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGZXJpY28lMkZzb2NpYWxidXp6JTJGbXktc29jaWFsYnV6ei1jbG9uZSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDd0M7QUFDckg7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9lcmljby9zb2NpYWxidXp6L215LXNvY2lhbGJ1enotY2xvbmUvYXBwL2FwaS92MS9hZG1pbi90cmFuc2FjdGlvbnMvc3RhdHMvcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3YxL2FkbWluL3RyYW5zYWN0aW9ucy9zdGF0cy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3YxL2FkbWluL3RyYW5zYWN0aW9ucy9zdGF0c1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvdjEvYWRtaW4vdHJhbnNhY3Rpb25zL3N0YXRzL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL2VyaWNvL3NvY2lhbGJ1enovbXktc29jaWFsYnV6ei1jbG9uZS9hcHAvYXBpL3YxL2FkbWluL3RyYW5zYWN0aW9ucy9zdGF0cy9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fadmin%2Ftransactions%2Fstats%2Froute&page=%2Fapi%2Fv1%2Fadmin%2Ftransactions%2Fstats%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fadmin%2Ftransactions%2Fstats%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_require__ = require("../../../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/ms","vendor-chunks/@supabase","vendor-chunks/tr46","vendor-chunks/ws","vendor-chunks/semver","vendor-chunks/bcryptjs","vendor-chunks/whatwg-url","vendor-chunks/jsonwebtoken","vendor-chunks/lodash.includes","vendor-chunks/jws","vendor-chunks/lodash.once","vendor-chunks/jwa","vendor-chunks/lodash.isinteger","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/webidl-conversions","vendor-chunks/lodash.isplainobject","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isboolean","vendor-chunks/safe-buffer","vendor-chunks/buffer-equal-constant-time","vendor-chunks/isows"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fadmin%2Ftransactions%2Fstats%2Froute&page=%2Fapi%2Fv1%2Fadmin%2Ftransactions%2Fstats%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fadmin%2Ftransactions%2Fstats%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();