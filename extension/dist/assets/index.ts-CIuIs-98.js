console.log("📡 Background service worker initialized");chrome.runtime.onMessage.addListener((e,n,i)=>{e.type==="REQUEST_PATCH"&&i({status:"unimplemented"})});
