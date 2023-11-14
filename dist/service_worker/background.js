"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let c = {
    history: new Set(),
    best: 0,
    last: new Date()
};
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    c = yield loadConfig();
    let openTest = false;
    if (c.last === null) {
        openTest = true;
    }
    else {
        const t = new Date();
        const delta = t.getUTCDate() - c.last.getUTCDate();
        if (delta >= 1) {
            openTest = true;
        }
    }
    if (openTest) {
        chrome.tabs.create({
            url: "page/page.html"
        });
    }
});
const loadConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield chrome.storage.local.get("data");
    data = data["data"];
    if (!data) {
        yield chrome.storage.local.set({
            "data": {
                "history": new Set(),
                "best": null,
                "last": null,
            }
        });
    }
    return (yield chrome.storage.local.get("data"))["data"];
});
chrome.runtime.onStartup.addListener(init);
chrome.runtime.onMessage.addListener((message, sender, sendResponce) => __awaiter(void 0, void 0, void 0, function* () {
    if (message === "load_config") {
        sendResponce(c);
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
}));
