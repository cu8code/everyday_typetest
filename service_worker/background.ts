type config = {
  history: Set<{ date: Date, score: number}>,
  best:number,
  last:Date
}

let c : config = {
  history: new Set(),
  best:0,
  last: new Date()
}

const init = async () => {
  c = await loadConfig()
  let openTest = false
  if (c.last === null) {
    openTest = true
  }else{
    const t = new Date()
    const delta = t.getUTCDate() - c.last.getUTCDate()
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
chrome.runtime.onMessage.addListener(async(message,sender,sendResponce) => {
  if(message === "load_config"){
    sendResponce(c)
  }
  // if(message === "set_config"){
  //   chrome.storage.local.set({"data" : sender})
  // }
  // if(message === "set_best"){
  //   c.best = sender.
  //   chrome.storage.local.set("data",config)
  // }
  // if(message === "add_history"){
  //   c.history.add(sender)
  //   chrome.storage.local.set("data",config)
  // }
  // if(message === "set_last"){
  //   c.last = sender
  //   chrome.storage.local.set("data",config)
  // }
})
