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
exports.id = "app/api/v1/creators/route";
exports.ids = ["app/api/v1/creators/route"];
exports.modules = {

/***/ "(rsc)/./app/api/v1/creators/route.ts":
/*!**************************************!*\
  !*** ./app/api/v1/creators/route.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_supabase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/supabase */ \"(rsc)/./lib/supabase.ts\");\n\n\nasync function GET(request) {\n    try {\n        const { searchParams } = new URL(request.url);\n        const category = searchParams.get('category');\n        const search = searchParams.get('search');\n        const sortBy = searchParams.get('sort') || 'popular';\n        const page = parseInt(searchParams.get('page') || '1');\n        const limit = parseInt(searchParams.get('limit') || '12');\n        const offset = (page - 1) * limit;\n        let query = _lib_supabase__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from('users').select(`\n        id,\n        username,\n        full_name,\n        avatar,\n        is_verified,\n        role,\n        total_earnings,\n        total_donations,\n        created_at\n      `).eq('role', 'user') // Change from 'creator' to 'user' since that's the default role\n        .range(offset, offset + limit - 1);\n        // Search by username or full name if specified\n        if (search) {\n            query = query.or(`username.ilike.%${search}%,full_name.ilike.%${search}%`);\n        }\n        // Sort creators\n        switch(sortBy){\n            case 'popular':\n                query = query.order('total_donations', {\n                    ascending: false\n                });\n                break;\n            case 'newest':\n                query = query.order('created_at', {\n                    ascending: false\n                });\n                break;\n            case 'earnings':\n                query = query.order('total_earnings', {\n                    ascending: false\n                });\n                break;\n            default:\n                query = query.order('created_at', {\n                    ascending: false\n                });\n        }\n        const { data: creators, error, count } = await query;\n        if (error) {\n            throw error;\n        }\n        // Transform data to match expected format  \n        const transformedCreators = await Promise.all(creators?.map(async (creator)=>{\n            // Get supporter count for each creator\n            const { count: supporterCount } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from('donations').select('donor_id', {\n                count: 'exact',\n                head: true\n            }).eq('recipient_id', creator.id);\n            // Get profile data\n            const { data: profile } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from('user_profiles').select('bio, social_links').eq('user_id', creator.id).single();\n            return {\n                id: creator.id,\n                username: creator.username,\n                displayName: creator.full_name || creator.username,\n                avatar: creator.avatar || '/default-avatar.png',\n                bio: profile?.bio || '',\n                category: 'general',\n                isVerified: creator.is_verified,\n                stats: {\n                    totalDonations: creator.total_donations || 0,\n                    totalSupporters: supporterCount || 0,\n                    avgDonationAmount: supporterCount > 0 ? (creator.total_donations || 0) / supporterCount : 0,\n                    lastDonationAt: null\n                },\n                socialLinks: profile?.social_links || {},\n                joinedAt: creator.created_at\n            };\n        }) || []);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            data: transformedCreators,\n            pagination: {\n                page,\n                limit,\n                total: count || 0,\n                totalPages: Math.ceil((count || 0) / limit)\n            }\n        });\n    } catch (error) {\n        console.error('Creators fetch error:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to fetch creators'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3YxL2NyZWF0b3JzL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUF3RDtBQUNUO0FBRXhDLGVBQWVFLElBQUlDLE9BQW9CO0lBQzVDLElBQUk7UUFDRixNQUFNLEVBQUVDLFlBQVksRUFBRSxHQUFHLElBQUlDLElBQUlGLFFBQVFHLEdBQUc7UUFDNUMsTUFBTUMsV0FBV0gsYUFBYUksR0FBRyxDQUFDO1FBQ2xDLE1BQU1DLFNBQVNMLGFBQWFJLEdBQUcsQ0FBQztRQUNoQyxNQUFNRSxTQUFTTixhQUFhSSxHQUFHLENBQUMsV0FBVztRQUMzQyxNQUFNRyxPQUFPQyxTQUFTUixhQUFhSSxHQUFHLENBQUMsV0FBVztRQUNsRCxNQUFNSyxRQUFRRCxTQUFTUixhQUFhSSxHQUFHLENBQUMsWUFBWTtRQUNwRCxNQUFNTSxTQUFTLENBQUNILE9BQU8sS0FBS0U7UUFFNUIsSUFBSUUsUUFBUWQsd0RBQWFBLENBQ3RCZSxJQUFJLENBQUMsU0FDTEMsTUFBTSxDQUFDLENBQUM7Ozs7Ozs7Ozs7TUFVVCxDQUFDLEVBQ0FDLEVBQUUsQ0FBQyxRQUFRLFFBQVEsZ0VBQWdFO1NBQ25GQyxLQUFLLENBQUNMLFFBQVFBLFNBQVNELFFBQVE7UUFFbEMsK0NBQStDO1FBQy9DLElBQUlKLFFBQVE7WUFDVk0sUUFBUUEsTUFBTUssRUFBRSxDQUFDLENBQUMsZ0JBQWdCLEVBQUVYLE9BQU8sbUJBQW1CLEVBQUVBLE9BQU8sQ0FBQyxDQUFDO1FBQzNFO1FBRUEsZ0JBQWdCO1FBQ2hCLE9BQVFDO1lBQ04sS0FBSztnQkFDSEssUUFBUUEsTUFBTU0sS0FBSyxDQUFDLG1CQUFtQjtvQkFBRUMsV0FBVztnQkFBTTtnQkFDMUQ7WUFDRixLQUFLO2dCQUNIUCxRQUFRQSxNQUFNTSxLQUFLLENBQUMsY0FBYztvQkFBRUMsV0FBVztnQkFBTTtnQkFDckQ7WUFDRixLQUFLO2dCQUNIUCxRQUFRQSxNQUFNTSxLQUFLLENBQUMsa0JBQWtCO29CQUFFQyxXQUFXO2dCQUFNO2dCQUN6RDtZQUNGO2dCQUNFUCxRQUFRQSxNQUFNTSxLQUFLLENBQUMsY0FBYztvQkFBRUMsV0FBVztnQkFBTTtRQUN6RDtRQUVBLE1BQU0sRUFBRUMsTUFBTUMsUUFBUSxFQUFFQyxLQUFLLEVBQUVDLEtBQUssRUFBRSxHQUFHLE1BQU1YO1FBRS9DLElBQUlVLE9BQU87WUFDVCxNQUFNQTtRQUNSO1FBRUEsNENBQTRDO1FBQzVDLE1BQU1FLHNCQUFzQixNQUFNQyxRQUFRQyxHQUFHLENBQUNMLFVBQVVNLElBQUksT0FBTUM7WUFDaEUsdUNBQXVDO1lBQ3ZDLE1BQU0sRUFBRUwsT0FBT00sY0FBYyxFQUFFLEdBQUcsTUFBTS9CLHdEQUFhQSxDQUNsRGUsSUFBSSxDQUFDLGFBQ0xDLE1BQU0sQ0FBQyxZQUFZO2dCQUFFUyxPQUFPO2dCQUFTTyxNQUFNO1lBQUssR0FDaERmLEVBQUUsQ0FBQyxnQkFBZ0JhLFFBQVFHLEVBQUU7WUFFaEMsbUJBQW1CO1lBQ25CLE1BQU0sRUFBRVgsTUFBTVksT0FBTyxFQUFFLEdBQUcsTUFBTWxDLHdEQUFhQSxDQUMxQ2UsSUFBSSxDQUFDLGlCQUNMQyxNQUFNLENBQUMscUJBQ1BDLEVBQUUsQ0FBQyxXQUFXYSxRQUFRRyxFQUFFLEVBQ3hCRSxNQUFNO1lBRVQsT0FBTztnQkFDTEYsSUFBSUgsUUFBUUcsRUFBRTtnQkFDZEcsVUFBVU4sUUFBUU0sUUFBUTtnQkFDMUJDLGFBQWFQLFFBQVFRLFNBQVMsSUFBSVIsUUFBUU0sUUFBUTtnQkFDbERHLFFBQVFULFFBQVFTLE1BQU0sSUFBSTtnQkFDMUJDLEtBQUtOLFNBQVNNLE9BQU87Z0JBQ3JCbEMsVUFBVTtnQkFDVm1DLFlBQVlYLFFBQVFZLFdBQVc7Z0JBQy9CQyxPQUFPO29CQUNMQyxnQkFBZ0JkLFFBQVFlLGVBQWUsSUFBSTtvQkFDM0NDLGlCQUFpQmYsa0JBQWtCO29CQUNuQ2dCLG1CQUFtQmhCLGlCQUFpQixJQUFJLENBQUNELFFBQVFlLGVBQWUsSUFBSSxLQUFLZCxpQkFBaUI7b0JBQzFGaUIsZ0JBQWdCO2dCQUNsQjtnQkFDQUMsYUFBYWYsU0FBU2dCLGdCQUFnQixDQUFDO2dCQUN2Q0MsVUFBVXJCLFFBQVFzQixVQUFVO1lBQzlCO1FBQ0YsTUFBTSxFQUFFO1FBRVIsT0FBT3JELHFEQUFZQSxDQUFDc0QsSUFBSSxDQUFDO1lBQ3ZCQyxTQUFTO1lBQ1RoQyxNQUFNSTtZQUNONkIsWUFBWTtnQkFDVjdDO2dCQUNBRTtnQkFDQTRDLE9BQU8vQixTQUFTO2dCQUNoQmdDLFlBQVlDLEtBQUtDLElBQUksQ0FBQyxDQUFDbEMsU0FBUyxLQUFLYjtZQUN2QztRQUNGO0lBQ0YsRUFBRSxPQUFPWSxPQUFPO1FBQ2RvQyxRQUFRcEMsS0FBSyxDQUFDLHlCQUF5QkE7UUFDdkMsT0FBT3pCLHFEQUFZQSxDQUFDc0QsSUFBSSxDQUN0QjtZQUFFN0IsT0FBTztRQUEyQixHQUNwQztZQUFFcUMsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIi9Vc2Vycy9lcmljby9zb2NpYWxidXp6L215LXNvY2lhbGJ1enotY2xvbmUvYXBwL2FwaS92MS9jcmVhdG9ycy9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVxdWVzdCwgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuaW1wb3J0IHsgc3VwYWJhc2VBZG1pbiB9IGZyb20gJ0AvbGliL3N1cGFiYXNlJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVChyZXF1ZXN0OiBOZXh0UmVxdWVzdCkge1xuICB0cnkge1xuICAgIGNvbnN0IHsgc2VhcmNoUGFyYW1zIH0gPSBuZXcgVVJMKHJlcXVlc3QudXJsKTtcbiAgICBjb25zdCBjYXRlZ29yeSA9IHNlYXJjaFBhcmFtcy5nZXQoJ2NhdGVnb3J5Jyk7XG4gICAgY29uc3Qgc2VhcmNoID0gc2VhcmNoUGFyYW1zLmdldCgnc2VhcmNoJyk7XG4gICAgY29uc3Qgc29ydEJ5ID0gc2VhcmNoUGFyYW1zLmdldCgnc29ydCcpIHx8ICdwb3B1bGFyJztcbiAgICBjb25zdCBwYWdlID0gcGFyc2VJbnQoc2VhcmNoUGFyYW1zLmdldCgncGFnZScpIHx8ICcxJyk7XG4gICAgY29uc3QgbGltaXQgPSBwYXJzZUludChzZWFyY2hQYXJhbXMuZ2V0KCdsaW1pdCcpIHx8ICcxMicpO1xuICAgIGNvbnN0IG9mZnNldCA9IChwYWdlIC0gMSkgKiBsaW1pdDtcblxuICAgIGxldCBxdWVyeSA9IHN1cGFiYXNlQWRtaW5cbiAgICAgIC5mcm9tKCd1c2VycycpXG4gICAgICAuc2VsZWN0KGBcbiAgICAgICAgaWQsXG4gICAgICAgIHVzZXJuYW1lLFxuICAgICAgICBmdWxsX25hbWUsXG4gICAgICAgIGF2YXRhcixcbiAgICAgICAgaXNfdmVyaWZpZWQsXG4gICAgICAgIHJvbGUsXG4gICAgICAgIHRvdGFsX2Vhcm5pbmdzLFxuICAgICAgICB0b3RhbF9kb25hdGlvbnMsXG4gICAgICAgIGNyZWF0ZWRfYXRcbiAgICAgIGApXG4gICAgICAuZXEoJ3JvbGUnLCAndXNlcicpIC8vIENoYW5nZSBmcm9tICdjcmVhdG9yJyB0byAndXNlcicgc2luY2UgdGhhdCdzIHRoZSBkZWZhdWx0IHJvbGVcbiAgICAgIC5yYW5nZShvZmZzZXQsIG9mZnNldCArIGxpbWl0IC0gMSk7XG5cbiAgICAvLyBTZWFyY2ggYnkgdXNlcm5hbWUgb3IgZnVsbCBuYW1lIGlmIHNwZWNpZmllZFxuICAgIGlmIChzZWFyY2gpIHtcbiAgICAgIHF1ZXJ5ID0gcXVlcnkub3IoYHVzZXJuYW1lLmlsaWtlLiUke3NlYXJjaH0lLGZ1bGxfbmFtZS5pbGlrZS4lJHtzZWFyY2h9JWApO1xuICAgIH1cblxuICAgIC8vIFNvcnQgY3JlYXRvcnNcbiAgICBzd2l0Y2ggKHNvcnRCeSkge1xuICAgICAgY2FzZSAncG9wdWxhcic6XG4gICAgICAgIHF1ZXJ5ID0gcXVlcnkub3JkZXIoJ3RvdGFsX2RvbmF0aW9ucycsIHsgYXNjZW5kaW5nOiBmYWxzZSB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICduZXdlc3QnOlxuICAgICAgICBxdWVyeSA9IHF1ZXJ5Lm9yZGVyKCdjcmVhdGVkX2F0JywgeyBhc2NlbmRpbmc6IGZhbHNlIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Vhcm5pbmdzJzpcbiAgICAgICAgcXVlcnkgPSBxdWVyeS5vcmRlcigndG90YWxfZWFybmluZ3MnLCB7IGFzY2VuZGluZzogZmFsc2UgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcXVlcnkgPSBxdWVyeS5vcmRlcignY3JlYXRlZF9hdCcsIHsgYXNjZW5kaW5nOiBmYWxzZSB9KTtcbiAgICB9XG5cbiAgICBjb25zdCB7IGRhdGE6IGNyZWF0b3JzLCBlcnJvciwgY291bnQgfSA9IGF3YWl0IHF1ZXJ5O1xuXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG5cbiAgICAvLyBUcmFuc2Zvcm0gZGF0YSB0byBtYXRjaCBleHBlY3RlZCBmb3JtYXQgIFxuICAgIGNvbnN0IHRyYW5zZm9ybWVkQ3JlYXRvcnMgPSBhd2FpdCBQcm9taXNlLmFsbChjcmVhdG9ycz8ubWFwKGFzeW5jIGNyZWF0b3IgPT4ge1xuICAgICAgLy8gR2V0IHN1cHBvcnRlciBjb3VudCBmb3IgZWFjaCBjcmVhdG9yXG4gICAgICBjb25zdCB7IGNvdW50OiBzdXBwb3J0ZXJDb3VudCB9ID0gYXdhaXQgc3VwYWJhc2VBZG1pblxuICAgICAgICAuZnJvbSgnZG9uYXRpb25zJylcbiAgICAgICAgLnNlbGVjdCgnZG9ub3JfaWQnLCB7IGNvdW50OiAnZXhhY3QnLCBoZWFkOiB0cnVlIH0pXG4gICAgICAgIC5lcSgncmVjaXBpZW50X2lkJywgY3JlYXRvci5pZCk7XG5cbiAgICAgIC8vIEdldCBwcm9maWxlIGRhdGFcbiAgICAgIGNvbnN0IHsgZGF0YTogcHJvZmlsZSB9ID0gYXdhaXQgc3VwYWJhc2VBZG1pblxuICAgICAgICAuZnJvbSgndXNlcl9wcm9maWxlcycpXG4gICAgICAgIC5zZWxlY3QoJ2Jpbywgc29jaWFsX2xpbmtzJylcbiAgICAgICAgLmVxKCd1c2VyX2lkJywgY3JlYXRvci5pZClcbiAgICAgICAgLnNpbmdsZSgpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogY3JlYXRvci5pZCxcbiAgICAgICAgdXNlcm5hbWU6IGNyZWF0b3IudXNlcm5hbWUsXG4gICAgICAgIGRpc3BsYXlOYW1lOiBjcmVhdG9yLmZ1bGxfbmFtZSB8fCBjcmVhdG9yLnVzZXJuYW1lLFxuICAgICAgICBhdmF0YXI6IGNyZWF0b3IuYXZhdGFyIHx8ICcvZGVmYXVsdC1hdmF0YXIucG5nJyxcbiAgICAgICAgYmlvOiBwcm9maWxlPy5iaW8gfHwgJycsXG4gICAgICAgIGNhdGVnb3J5OiAnZ2VuZXJhbCcsIC8vIERlZmF1bHQgY2F0ZWdvcnlcbiAgICAgICAgaXNWZXJpZmllZDogY3JlYXRvci5pc192ZXJpZmllZCxcbiAgICAgICAgc3RhdHM6IHtcbiAgICAgICAgICB0b3RhbERvbmF0aW9uczogY3JlYXRvci50b3RhbF9kb25hdGlvbnMgfHwgMCxcbiAgICAgICAgICB0b3RhbFN1cHBvcnRlcnM6IHN1cHBvcnRlckNvdW50IHx8IDAsXG4gICAgICAgICAgYXZnRG9uYXRpb25BbW91bnQ6IHN1cHBvcnRlckNvdW50ID4gMCA/IChjcmVhdG9yLnRvdGFsX2RvbmF0aW9ucyB8fCAwKSAvIHN1cHBvcnRlckNvdW50IDogMCxcbiAgICAgICAgICBsYXN0RG9uYXRpb25BdDogbnVsbCxcbiAgICAgICAgfSxcbiAgICAgICAgc29jaWFsTGlua3M6IHByb2ZpbGU/LnNvY2lhbF9saW5rcyB8fCB7fSxcbiAgICAgICAgam9pbmVkQXQ6IGNyZWF0b3IuY3JlYXRlZF9hdCxcbiAgICAgIH07XG4gICAgfSkgfHwgW10pO1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICBkYXRhOiB0cmFuc2Zvcm1lZENyZWF0b3JzLFxuICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICBwYWdlLFxuICAgICAgICBsaW1pdCxcbiAgICAgICAgdG90YWw6IGNvdW50IHx8IDAsXG4gICAgICAgIHRvdGFsUGFnZXM6IE1hdGguY2VpbCgoY291bnQgfHwgMCkgLyBsaW1pdCksXG4gICAgICB9LFxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0NyZWF0b3JzIGZldGNoIGVycm9yOicsIGVycm9yKTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IGVycm9yOiAnRmFpbGVkIHRvIGZldGNoIGNyZWF0b3JzJyB9LFxuICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgKTtcbiAgfVxufSJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJzdXBhYmFzZUFkbWluIiwiR0VUIiwicmVxdWVzdCIsInNlYXJjaFBhcmFtcyIsIlVSTCIsInVybCIsImNhdGVnb3J5IiwiZ2V0Iiwic2VhcmNoIiwic29ydEJ5IiwicGFnZSIsInBhcnNlSW50IiwibGltaXQiLCJvZmZzZXQiLCJxdWVyeSIsImZyb20iLCJzZWxlY3QiLCJlcSIsInJhbmdlIiwib3IiLCJvcmRlciIsImFzY2VuZGluZyIsImRhdGEiLCJjcmVhdG9ycyIsImVycm9yIiwiY291bnQiLCJ0cmFuc2Zvcm1lZENyZWF0b3JzIiwiUHJvbWlzZSIsImFsbCIsIm1hcCIsImNyZWF0b3IiLCJzdXBwb3J0ZXJDb3VudCIsImhlYWQiLCJpZCIsInByb2ZpbGUiLCJzaW5nbGUiLCJ1c2VybmFtZSIsImRpc3BsYXlOYW1lIiwiZnVsbF9uYW1lIiwiYXZhdGFyIiwiYmlvIiwiaXNWZXJpZmllZCIsImlzX3ZlcmlmaWVkIiwic3RhdHMiLCJ0b3RhbERvbmF0aW9ucyIsInRvdGFsX2RvbmF0aW9ucyIsInRvdGFsU3VwcG9ydGVycyIsImF2Z0RvbmF0aW9uQW1vdW50IiwibGFzdERvbmF0aW9uQXQiLCJzb2NpYWxMaW5rcyIsInNvY2lhbF9saW5rcyIsImpvaW5lZEF0IiwiY3JlYXRlZF9hdCIsImpzb24iLCJzdWNjZXNzIiwicGFnaW5hdGlvbiIsInRvdGFsIiwidG90YWxQYWdlcyIsIk1hdGgiLCJjZWlsIiwiY29uc29sZSIsInN0YXR1cyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/v1/creators/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/supabase.ts":
/*!*************************!*\
  !*** ./lib/supabase.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   STORAGE_BUCKETS: () => (/* binding */ STORAGE_BUCKETS),\n/* harmony export */   createSignedUrl: () => (/* binding */ createSignedUrl),\n/* harmony export */   deleteFile: () => (/* binding */ deleteFile),\n/* harmony export */   getPublicUrl: () => (/* binding */ getPublicUrl),\n/* harmony export */   supabase: () => (/* binding */ supabase),\n/* harmony export */   supabaseAdmin: () => (/* binding */ supabaseAdmin),\n/* harmony export */   uploadFile: () => (/* binding */ uploadFile)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/@supabase/supabase-js/dist/module/index.js\");\n\nconst supabaseUrl = \"https://swhkbukgkafoqyvljmrd.supabase.co\";\nconst supabaseAnonKey = \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3aGtidWtna2Fmb3F5dmxqbXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMDU1NzIsImV4cCI6MjA2Nzc4MTU3Mn0.kd0xWVLhcS0Ywog6-6CwmS4PRgz4hkyNibZGUSSRMRE\";\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseAnonKey);\nconst supabaseAdmin = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);\nconst STORAGE_BUCKETS = {\n    AVATARS: 'avatars',\n    UPLOADS: 'uploads',\n    ASSETS: 'assets'\n};\nconst uploadFile = async (file, bucket, path)=>{\n    const { data, error } = await supabase.storage.from(STORAGE_BUCKETS[bucket]).upload(path, file, {\n        cacheControl: '3600',\n        upsert: false\n    });\n    if (error) {\n        throw new Error(`Upload failed: ${error.message}`);\n    }\n    return data;\n};\nconst getPublicUrl = (bucket, path)=>{\n    const { data } = supabase.storage.from(STORAGE_BUCKETS[bucket]).getPublicUrl(path);\n    return data.publicUrl;\n};\nconst deleteFile = async (bucket, path)=>{\n    const { error } = await supabase.storage.from(STORAGE_BUCKETS[bucket]).remove([\n        path\n    ]);\n    if (error) {\n        throw new Error(`Delete failed: ${error.message}`);\n    }\n};\nconst createSignedUrl = async (bucket, path, expiresIn = 3600)=>{\n    const { data, error } = await supabase.storage.from(STORAGE_BUCKETS[bucket]).createSignedUrl(path, expiresIn);\n    if (error) {\n        throw new Error(`Create signed URL failed: ${error.message}`);\n    }\n    return data;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc3VwYWJhc2UudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBcUQ7QUFHckQsTUFBTUMsY0FBY0MsMENBQW9DO0FBQ3hELE1BQU1HLGtCQUFrQkgsa05BQXlDO0FBRTFELE1BQU1LLFdBQVdQLG1FQUFZQSxDQUFXQyxhQUFhSSxpQkFBaUI7QUFFdEUsTUFBTUcsZ0JBQWdCUixtRUFBWUEsQ0FDdkNDLGFBQ0FDLFFBQVFDLEdBQUcsQ0FBQ00seUJBQXlCLEVBQ3JDO0FBRUssTUFBTUMsa0JBQWtCO0lBQzdCQyxTQUFTO0lBQ1RDLFNBQVM7SUFDVEMsUUFBUTtBQUNWLEVBQVc7QUFFSixNQUFNQyxhQUFhLE9BQ3hCQyxNQUNBQyxRQUNBQztJQUVBLE1BQU0sRUFBRUMsSUFBSSxFQUFFQyxLQUFLLEVBQUUsR0FBRyxNQUFNWixTQUFTYSxPQUFPLENBQzNDQyxJQUFJLENBQUNYLGVBQWUsQ0FBQ00sT0FBTyxFQUM1Qk0sTUFBTSxDQUFDTCxNQUFNRixNQUFNO1FBQ2xCUSxjQUFjO1FBQ2RDLFFBQVE7SUFDVjtJQUVGLElBQUlMLE9BQU87UUFDVCxNQUFNLElBQUlNLE1BQU0sQ0FBQyxlQUFlLEVBQUVOLE1BQU1PLE9BQU8sRUFBRTtJQUNuRDtJQUVBLE9BQU9SO0FBQ1QsRUFBRTtBQUVLLE1BQU1TLGVBQWUsQ0FDMUJYLFFBQ0FDO0lBRUEsTUFBTSxFQUFFQyxJQUFJLEVBQUUsR0FBR1gsU0FBU2EsT0FBTyxDQUM5QkMsSUFBSSxDQUFDWCxlQUFlLENBQUNNLE9BQU8sRUFDNUJXLFlBQVksQ0FBQ1Y7SUFFaEIsT0FBT0MsS0FBS1UsU0FBUztBQUN2QixFQUFFO0FBRUssTUFBTUMsYUFBYSxPQUN4QmIsUUFDQUM7SUFFQSxNQUFNLEVBQUVFLEtBQUssRUFBRSxHQUFHLE1BQU1aLFNBQVNhLE9BQU8sQ0FDckNDLElBQUksQ0FBQ1gsZUFBZSxDQUFDTSxPQUFPLEVBQzVCYyxNQUFNLENBQUM7UUFBQ2I7S0FBSztJQUVoQixJQUFJRSxPQUFPO1FBQ1QsTUFBTSxJQUFJTSxNQUFNLENBQUMsZUFBZSxFQUFFTixNQUFNTyxPQUFPLEVBQUU7SUFDbkQ7QUFDRixFQUFFO0FBRUssTUFBTUssa0JBQWtCLE9BQzdCZixRQUNBQyxNQUNBZSxZQUFvQixJQUFJO0lBRXhCLE1BQU0sRUFBRWQsSUFBSSxFQUFFQyxLQUFLLEVBQUUsR0FBRyxNQUFNWixTQUFTYSxPQUFPLENBQzNDQyxJQUFJLENBQUNYLGVBQWUsQ0FBQ00sT0FBTyxFQUM1QmUsZUFBZSxDQUFDZCxNQUFNZTtJQUV6QixJQUFJYixPQUFPO1FBQ1QsTUFBTSxJQUFJTSxNQUFNLENBQUMsMEJBQTBCLEVBQUVOLE1BQU1PLE9BQU8sRUFBRTtJQUM5RDtJQUVBLE9BQU9SO0FBQ1QsRUFBRSIsInNvdXJjZXMiOlsiL1VzZXJzL2VyaWNvL3NvY2lhbGJ1enovbXktc29jaWFsYnV6ei1jbG9uZS9saWIvc3VwYWJhc2UudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSAnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJztcbmltcG9ydCB7IERhdGFiYXNlIH0gZnJvbSAnQC90eXBlcy9kYXRhYmFzZSc7XG5cbmNvbnN0IHN1cGFiYXNlVXJsID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMITtcbmNvbnN0IHN1cGFiYXNlQW5vbktleSA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZITtcblxuZXhwb3J0IGNvbnN0IHN1cGFiYXNlID0gY3JlYXRlQ2xpZW50PERhdGFiYXNlPihzdXBhYmFzZVVybCwgc3VwYWJhc2VBbm9uS2V5KTtcblxuZXhwb3J0IGNvbnN0IHN1cGFiYXNlQWRtaW4gPSBjcmVhdGVDbGllbnQ8RGF0YWJhc2U+KFxuICBzdXBhYmFzZVVybCxcbiAgcHJvY2Vzcy5lbnYuU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWSEsXG4pO1xuXG5leHBvcnQgY29uc3QgU1RPUkFHRV9CVUNLRVRTID0ge1xuICBBVkFUQVJTOiAnYXZhdGFycycsXG4gIFVQTE9BRFM6ICd1cGxvYWRzJyxcbiAgQVNTRVRTOiAnYXNzZXRzJyxcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCBjb25zdCB1cGxvYWRGaWxlID0gYXN5bmMgKFxuICBmaWxlOiBGaWxlLFxuICBidWNrZXQ6IGtleW9mIHR5cGVvZiBTVE9SQUdFX0JVQ0tFVFMsXG4gIHBhdGg6IHN0cmluZyxcbikgPT4ge1xuICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5zdG9yYWdlXG4gICAgLmZyb20oU1RPUkFHRV9CVUNLRVRTW2J1Y2tldF0pXG4gICAgLnVwbG9hZChwYXRoLCBmaWxlLCB7XG4gICAgICBjYWNoZUNvbnRyb2w6ICczNjAwJyxcbiAgICAgIHVwc2VydDogZmFsc2UsXG4gICAgfSk7XG5cbiAgaWYgKGVycm9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBVcGxvYWQgZmFpbGVkOiAke2Vycm9yLm1lc3NhZ2V9YCk7XG4gIH1cblxuICByZXR1cm4gZGF0YTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRQdWJsaWNVcmwgPSAoXG4gIGJ1Y2tldDoga2V5b2YgdHlwZW9mIFNUT1JBR0VfQlVDS0VUUyxcbiAgcGF0aDogc3RyaW5nLFxuKSA9PiB7XG4gIGNvbnN0IHsgZGF0YSB9ID0gc3VwYWJhc2Uuc3RvcmFnZVxuICAgIC5mcm9tKFNUT1JBR0VfQlVDS0VUU1tidWNrZXRdKVxuICAgIC5nZXRQdWJsaWNVcmwocGF0aCk7XG5cbiAgcmV0dXJuIGRhdGEucHVibGljVXJsO1xufTtcblxuZXhwb3J0IGNvbnN0IGRlbGV0ZUZpbGUgPSBhc3luYyAoXG4gIGJ1Y2tldDoga2V5b2YgdHlwZW9mIFNUT1JBR0VfQlVDS0VUUyxcbiAgcGF0aDogc3RyaW5nLFxuKSA9PiB7XG4gIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLnN0b3JhZ2VcbiAgICAuZnJvbShTVE9SQUdFX0JVQ0tFVFNbYnVja2V0XSlcbiAgICAucmVtb3ZlKFtwYXRoXSk7XG5cbiAgaWYgKGVycm9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBEZWxldGUgZmFpbGVkOiAke2Vycm9yLm1lc3NhZ2V9YCk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVTaWduZWRVcmwgPSBhc3luYyAoXG4gIGJ1Y2tldDoga2V5b2YgdHlwZW9mIFNUT1JBR0VfQlVDS0VUUyxcbiAgcGF0aDogc3RyaW5nLFxuICBleHBpcmVzSW46IG51bWJlciA9IDM2MDAsXG4pID0+IHtcbiAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2Uuc3RvcmFnZVxuICAgIC5mcm9tKFNUT1JBR0VfQlVDS0VUU1tidWNrZXRdKVxuICAgIC5jcmVhdGVTaWduZWRVcmwocGF0aCwgZXhwaXJlc0luKTtcblxuICBpZiAoZXJyb3IpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENyZWF0ZSBzaWduZWQgVVJMIGZhaWxlZDogJHtlcnJvci5tZXNzYWdlfWApO1xuICB9XG5cbiAgcmV0dXJuIGRhdGE7XG59O1xuIl0sIm5hbWVzIjpbImNyZWF0ZUNsaWVudCIsInN1cGFiYXNlVXJsIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCIsInN1cGFiYXNlQW5vbktleSIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZIiwic3VwYWJhc2UiLCJzdXBhYmFzZUFkbWluIiwiU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWSIsIlNUT1JBR0VfQlVDS0VUUyIsIkFWQVRBUlMiLCJVUExPQURTIiwiQVNTRVRTIiwidXBsb2FkRmlsZSIsImZpbGUiLCJidWNrZXQiLCJwYXRoIiwiZGF0YSIsImVycm9yIiwic3RvcmFnZSIsImZyb20iLCJ1cGxvYWQiLCJjYWNoZUNvbnRyb2wiLCJ1cHNlcnQiLCJFcnJvciIsIm1lc3NhZ2UiLCJnZXRQdWJsaWNVcmwiLCJwdWJsaWNVcmwiLCJkZWxldGVGaWxlIiwicmVtb3ZlIiwiY3JlYXRlU2lnbmVkVXJsIiwiZXhwaXJlc0luIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/supabase.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fcreators%2Froute&page=%2Fapi%2Fv1%2Fcreators%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fcreators%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fcreators%2Froute&page=%2Fapi%2Fv1%2Fcreators%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fcreators%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_erico_socialbuzz_my_socialbuzz_clone_app_api_v1_creators_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/v1/creators/route.ts */ \"(rsc)/./app/api/v1/creators/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/v1/creators/route\",\n        pathname: \"/api/v1/creators\",\n        filename: \"route\",\n        bundlePath: \"app/api/v1/creators/route\"\n    },\n    resolvedPagePath: \"/Users/erico/socialbuzz/my-socialbuzz-clone/app/api/v1/creators/route.ts\",\n    nextConfigOutput,\n    userland: _Users_erico_socialbuzz_my_socialbuzz_clone_app_api_v1_creators_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZ2MSUyRmNyZWF0b3JzJTJGcm91dGUmcGFnZT0lMkZhcGklMkZ2MSUyRmNyZWF0b3JzJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGdjElMkZjcmVhdG9ycyUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmVyaWNvJTJGc29jaWFsYnV6eiUyRm15LXNvY2lhbGJ1enotY2xvbmUlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGZXJpY28lMkZzb2NpYWxidXp6JTJGbXktc29jaWFsYnV6ei1jbG9uZSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDd0I7QUFDckc7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9lcmljby9zb2NpYWxidXp6L215LXNvY2lhbGJ1enotY2xvbmUvYXBwL2FwaS92MS9jcmVhdG9ycy9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvdjEvY3JlYXRvcnMvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS92MS9jcmVhdG9yc1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvdjEvY3JlYXRvcnMvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvZXJpY28vc29jaWFsYnV6ei9teS1zb2NpYWxidXp6LWNsb25lL2FwcC9hcGkvdjEvY3JlYXRvcnMvcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fcreators%2Froute&page=%2Fapi%2Fv1%2Fcreators%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fcreators%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@supabase","vendor-chunks/tr46","vendor-chunks/ws","vendor-chunks/whatwg-url","vendor-chunks/webidl-conversions","vendor-chunks/isows"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fcreators%2Froute&page=%2Fapi%2Fv1%2Fcreators%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fcreators%2Froute.ts&appDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ferico%2Fsocialbuzz%2Fmy-socialbuzz-clone&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();