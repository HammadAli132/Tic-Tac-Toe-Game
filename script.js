const date = document.getElementById("date");
date.innerText = new Date().getFullYear();
const header = document.querySelector("header");
const main = document.querySelector("main");
const footer = document.querySelector("footer");
const mainHeight = header.offsetHeight + footer.offsetHeight;
main.style.cssText = `height: calc(100vh - ${mainHeight}px);`;