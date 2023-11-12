'use strict'

const init = async () => {
  console.log("init");
  chrome.tabs.create({
    url: "page/page.html"
  })
}

chrome.runtime.onStartup.addListener(init)
