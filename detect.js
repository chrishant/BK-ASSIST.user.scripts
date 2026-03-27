(async _=>{
  const u="https://raw.githubusercontent.com/chrishant/BK-ASSIST.user.scripts/new/main/DTECT/detector.js?"+Date.now();
  const f=await fetch(u).then(r=>r.text());
  return (new Function(f+";return detectTechStack"))()();
})()
// (async()=>{let u="https://raw.githubusercontent.com/chrishant/BK-ASSIST.user.scripts/new/main/DTECT/detector.js?"+Date.now(),t=await(await fetch(u)).text();return(Function(t+";return detectTechStack"))()()})()
