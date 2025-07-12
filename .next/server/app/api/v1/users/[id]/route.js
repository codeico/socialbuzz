(()=>{var e={};e.id=2018,e.ids=[2018],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},5626:(e,r,t)=>{"use strict";t.r(r),t.d(r,{patchFetch:()=>m,routeModule:()=>d,serverHooks:()=>x,workAsyncStorage:()=>c,workUnitAsyncStorage:()=>l});var s={};t.r(s),t.d(s,{GET:()=>p});var i=t(96559),a=t(48088),o=t(37719),u=t(32190),n=t(41506);async function p(e,{params:r}){try{let{id:e}=await r,{data:t,error:s}=await n.E2.from("users").select(`
        id,
        username,
        email,
        full_name,
        avatar_url,
        is_verified,
        is_onboarded,
        role,
        created_at,
        user_profiles (
          bio,
          category,
          social_links,
          bank_account
        ),
        user_stats (
          total_donations,
          total_supporters,
          avg_donation_amount,
          last_donation_at
        )
      `).eq("id",e).single();if(s){if("PGRST116"===s.code)return u.NextResponse.json({error:"User not found"},{status:404});throw s}let i={id:t.id,username:t.username,email:t.email,displayName:t.full_name||t.username,avatar:t.avatar_url||"/default-avatar.png",isVerified:t.is_verified,isOnboarded:t.is_onboarded,role:t.role,profile:t.user_profiles?.[0]||null,stats:t.user_stats?.[0]||{total_donations:0,total_supporters:0,avg_donation_amount:0,last_donation_at:null},joinedAt:t.created_at};return u.NextResponse.json({success:!0,data:i})}catch(e){return console.error("User profile fetch error:",e),u.NextResponse.json({error:"Failed to fetch user profile"},{status:500})}}let d=new i.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/v1/users/[id]/route",pathname:"/api/v1/users/[id]",filename:"route",bundlePath:"app/api/v1/users/[id]/route"},resolvedPagePath:"/Users/erico/socialbuzz/my-socialbuzz-clone/app/api/v1/users/[id]/route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:c,workUnitAsyncStorage:l,serverHooks:x}=d;function m(){return(0,o.patchFetch)({workAsyncStorage:c,workUnitAsyncStorage:l})}},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11997:e=>{"use strict";e.exports=require("punycode")},27910:e=>{"use strict";e.exports=require("stream")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},34631:e=>{"use strict";e.exports=require("tls")},39727:()=>{},41506:(e,r,t)=>{"use strict";t.d(r,{E2:()=>o,ND:()=>a});var s=t(66437);let i="https://swhkbukgkafoqyvljmrd.supabase.co",a=(0,s.UU)(i,"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3aGtidWtna2Fmb3F5dmxqbXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMDU1NzIsImV4cCI6MjA2Nzc4MTU3Mn0.kd0xWVLhcS0Ywog6-6CwmS4PRgz4hkyNibZGUSSRMRE"),o=(0,s.UU)(i,process.env.SUPABASE_SERVICE_ROLE_KEY)},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},47990:()=>{},55511:e=>{"use strict";e.exports=require("crypto")},55591:e=>{"use strict";e.exports=require("https")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},74075:e=>{"use strict";e.exports=require("zlib")},78335:()=>{},79428:e=>{"use strict";e.exports=require("buffer")},79551:e=>{"use strict";e.exports=require("url")},81630:e=>{"use strict";e.exports=require("http")},91645:e=>{"use strict";e.exports=require("net")},94735:e=>{"use strict";e.exports=require("events")},96487:()=>{}};var r=require("../../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[4447,580,6437],()=>t(5626));module.exports=s})();