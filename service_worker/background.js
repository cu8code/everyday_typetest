'use strict'

chrome.runtime.onStartup.addListener(async ()=>{
  const today = (await chrome.storage.local.get([""]))
  if(today){
    return
  }
  chrome.tabs.create({
    url: "tab.html"
  })
})
