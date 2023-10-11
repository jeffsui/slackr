import { BACKEND_PORT } from "./config.js";
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from "./helpers.js";

console.log("Let's go!");
/**获取各种页面元素 */
const registerBtn = document.querySelector("#registerBtn");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

console.log(registerBtn);

//第一次访问页面 显示的是loginPage
showPage("loginPage");
// 点击注册按钮 事件处理
registerBtn.addEventListener("click", function (e) {
  console.log("点击注册按钮");
  showPage("registerPage");
});

// 提交登录表单 跳转到chatPage
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  showPage("chatPage");
});

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();
  showPage("loginPage");
});

//实现spa 页面逻辑
function showPage(pageId) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => {
    if (page.id === pageId) {
      page.style.display = "flex";
    } else {
      page.style.display = "none";
    }
  });
  console.log("pageId=", pageId);
  // 处理页面切换后的逻辑
  if (pageId === "chatPage") {
    chatPage.classList.add("logged-in");
    registerPage.classList.remove("registered");
  } else if (pageId === "registerPage") {
    chatPage.classList.remove("logged-in");
    registerPage.classList.add("registered");
  } else {
    chatPage.classList.remove("logged-in");
    registerPage.classList.remove("registered");
  }
}
