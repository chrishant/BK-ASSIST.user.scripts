fetch('https://raw.githubusercontent.com/chrishant/BK-ASSIST.user.scripts/main/BK/ANY-BK.user.js').then(r=>r.text()).then(c=>new Function(c)())
