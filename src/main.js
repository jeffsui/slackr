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
  const loginEmail = document.querySelector("#login_email");
  const loginPass = document.querySelector("#login_password");
  console.log({ email: loginEmail.value,
    password: loginPass.value});
  //后台发送Post请求,邮箱/密码 验证是否正确 fetch /auth/login
  /**
   * 定义请求登录API进行验证(异步请求)
   * @param {请求路径} path
   * @param {发送json格式的数} body
   */
  const apiCall = (path, body) => {
    fetch("http://localhost:5005/" + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          //请求失败,服务器给你返回的数据
          alert(data.error);
        } else {
          //验证通过
          console.log("success:", data);
          //tocken save sessionStorage
          sessionStorage.setItem("token",data.token);

          showPage("chatPage");
        }
      });
  };
  //调用封装登录请求
  apiCall("auth/login", {
    email: loginEmail.value,
    password: loginPass.value,
  });
});

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();
  //获取表单元素
  const regEmail  = document.getElementById("regemail");
  const regName  = document.getElementById("regname");
  const regPass = document.getElementById("regpassword");
  const confirmPass = document.getElementById("confirmpassword");

  if(regPass.value !== confirmPass.value){
    alert("Confirm password not match!");
  }
  const apiCall = (path, body) => {
    fetch("http://localhost:5005/" + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          //请求失败,服务器给你返回的数据
          alert(data.error);
        } else {
          //注册通过
          console.log("success:", data);
          showPage("loginPage");
        }
      });
  };
  apiCall("auth/register",{
    "email": regEmail.value,
    "password": regPass.value,
    "name": regName.value
  })

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
    loadChatPage();
  } else if (pageId === "registerPage") {
    chatPage.classList.remove("logged-in");
    registerPage.classList.add("registered");
  } else {
    chatPage.classList.remove("logged-in");
    registerPage.classList.remove("registered");
  }
}
/**
 * 加载chatPage
 */
function loadChatPage(){
    //获取token值
    const token = sessionStorage.getItem("token");
    console.log(token);
    //请求后台,获取所有的channel列表
    const apiCall = (path,token) => {
      fetch("http://localhost:5005/" + path, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            //请求失败,服务器给你返回的数据
            alert(data.error);
          } else {
            //查询chanel
            console.log("success:", data);
            if(data.channels.length>0){
              //过滤 private:false的 channel列表
              const publicChannelObj = data.channels.filter((item)=>item.private == false);
              console.log(publicChannelObj);
              publicChannelObj.forEach((element)=>{
                const li = document.createElement('li');
                const publicChannel = document.querySelector("#public_channel ul");
                const ahref = document.createElement("a");
                const linkText = document.createTextNode(element.name);
                ahref.appendChild(linkText);
                li.appendChild(ahref);
                publicChannel.appendChild(li);
              })
              //过滤private:true的channel列表
              const privateChannelObj = data.channels.filter((item)=>item.private==true);
              const privateChannel = document.querySelector("#private_channel ul");
              //如果 私有channel length>0 也用列表形式显示;否则 创建一个按钮 Add Channel
              if(privateChannelObj>0){
                privateChannelObj.forEach((element)=>{
                  const li = document.createElement('li');

                  const ahref = document.createElement("a");
                  const linkText = document.createTextNode(element.name);
                  ahref.appendChild(linkText);
                  li.appendChild(ahref);
                  privateChannel.appendChild(li);
                })
              }else{
                  const addChannelBtn = document.createElement("button");
                  addChannelBtn.className= "add_channel_btn";
                  const btnTxt = document.createTextNode("Add Channel");
                  addChannelBtn.appendChild(btnTxt);
                  privateChannel.appendChild(addChannelBtn);
                  //没有私有channel,允许添加一个channel
                  addChannelBtn.onclick = function(){
                    alert("添加channel");
                  }

              }
            }
          }
        });
    };
    apiCall('channel',token);

}
