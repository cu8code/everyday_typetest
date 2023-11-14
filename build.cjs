const fs = require("fs")
fs.copyFile("manifest.json","./dist/manifest.json",()=>{})
fs.copyFile("./page/page.html","./dist/page/page.html",()=>{})
fs.copyFile("./action/popup.html","./dist/action/popup.html",()=>{})