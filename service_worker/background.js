'use strict'

const init = async () => {
  const config = await loadConfig()
  let openTest = false
  if (config.last === null) {
    openTest = true
  }else{
    const t = new Date()
    const delta = t.getUTCDate() - config.last.getUTCDate()
    if(delta>=1){
      openTest = true
    }
  }
  if (openTest) {
    chrome.tabs.create({
      url: "page/page.html"
    })
  }
}

const loadConfig = async () => {
  let data = await chrome.storage.local.get("data")
  data = data["data"]
  console.log(data);
  if (!data) {
    await chrome.storage.local.set({
      "data": {
        "history": new Set(),
        "best": null,
        "last": null,
      }
    })
  }
  return (await chrome.storage.local.get("data"))["data"]
}

chrome.runtime.onStartup.addListener(init)
