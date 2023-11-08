'use strict'

chrome.runtime.onInstalled.addListener(({reason}) => {
  console.log(reason)
  if (reason === 'install') {
    chrome.tabs.create({
      url: "https://example.com"
    });
  }
});

// [[block website]]
// load the list or URL to block
// take list of website to block from the user
// store that into the memory
// match if the current tab URL is === to blocked website URL
// block the website

const usage_list= {
  "youtube.com":"1"
}

