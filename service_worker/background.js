'use strict'

const init = async () => {
  const today = (await chrome.storage.local.get([""]))
  if(today){
    return
  }
  chrome.tabs.create({
    url: "tab.html"
  })
}

chrome.runtime.onStartup.addListener(init)
