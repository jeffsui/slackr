import { BACKEND_PORT } from "./config.js";
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from "./helpers.js";

console.log("Let's go!");
/**获取各种页面元素 */
const registerBtn = document.querySelector("#registerBtn");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const mymodelForm = document.querySelector(".mymodelForm");
const channalTitle = document.querySelectorAll(".channel_title");
const publicChannel = document.querySelector("#public_channel ul");
const messageDetail = document.querySelector(".message_detail");
const sendMessageForm = document.querySelector("#sendMessageForm");

let modal = document.getElementById("myModal");
let closeBtn = document.querySelector(".close");
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
  console.log({ email: loginEmail.value, password: loginPass.value });
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
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("userid", data.userId);
          return fetch("http://localhost:5005/user/" + data.userId, {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${data.token}`,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.error) {
                alert(data.error);
              } else {
                console.log("userInfo", data);
                //sessionStorage存储userInfo,JSON.stringify 将对象字符串化,方便处理
                sessionStorage.setItem("userInfo", JSON.stringify(data));
                showPage("chatPage");
              }
            });
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
  const regEmail = document.getElementById("regemail");
  const regName = document.getElementById("regname");
  const regPass = document.getElementById("regpassword");
  const confirmPass = document.getElementById("confirmpassword");

  if (regPass.value !== confirmPass.value) {
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
  apiCall("auth/register", {
    email: regEmail.value,
    password: regPass.value,
    name: regName.value,
  });
});
/**
 * 提交新channel 表单submit事件
 */
mymodelForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(e.target);
  //获取新增表单元素
  let token = sessionStorage.getItem("token");
  const channelId = document.querySelector("#channelId");
  const channalName = document.querySelector("#channelName");
  const channalDescritpion = document.querySelector("#channelDiscription");
  const channelType = document.querySelector("#channelType");

  const apiCall = (path, token, body) => {
    fetch("http://localhost:5005/" + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
          console.log("add channel success:", data);
          showPage("chatPage");
        }
      });
  };
  apiCall("channel", token, {
    name: channalName.value,
    private: channelType.value !== "public",
    description: channalDescritpion.value,
  });
});
/**
 * 提交message表单
 */
sendMessageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("提交message Form");
  const chatMessage = document.querySelector(".chatMessage");
  // 使用 trim 方法去除首尾空格
  const trimmedValue = chatMessage.value.trim();
  // 检查是否为空
  if (trimmedValue === "") {
    alert("输入不能为空");
  }
  // 检查是否全是空格
  else if (trimmedValue.length === 0) {
    alert("输入不能全是空格");
  }
  // 输入有效
  else {
    console.log("输入有效");
    const  token = sessionStorage.getItem('token');
    const apiCall = (path, token, body) => {
      fetch("http://localhost:5005/" + path, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body)
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            // showPage("chatPage");
          }
        });
    };
    apiCall("message/813580",token,{
      "message":chatMessage.value,
      "image":""
    })
  }
});

function closeModal() {
  modal.style.display = "none"; // 隐藏模态框
}

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
function loadChatPage() {
  //获取token值
  const token = sessionStorage.getItem("token");
  console.log(token);
  //请求后台,获取所有的channel列表
  const apiCall = (path, token) => {
    fetch("http://localhost:5005/" + path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          //请求失败,服务器给你返回的数据
          alert(data.error);
        } else {
          //查询chanel
          console.log("2.获取channel data success:", data);
          while (publicChannel.hasChildNodes()) {
            publicChannel.removeChild(publicChannel.firstChild);
          }
          if (data.channels.length > 0) {
            //过滤 private:false的 channel列表
            const publicChannelObj = data.channels.filter(
              (item) => item.private == false
            );
            //修改逻辑 先根据id排序,这样按照创建channelid先后顺序显示
            publicChannelObj
              .sort((a, b) => b.id - a.id)
              .forEach((element) => {
                const li = document.createElement("li");

                const ahref = document.createElement("a");
                //通过绑定自定义 data-xx属性获取channel 属性,方便后面修改 和 点击事件触发查询
                ahref.dataset.channelId = element.id;
                ahref.dataset.channelName = element.name;
                ahref.dataset.channelMembers = element.members;
                const linkText = document.createTextNode(element.name);
                ahref.appendChild(linkText);
                li.appendChild(ahref);
                publicChannel.appendChild(li);
              });
            //渲染 message public channel 基本信息
            const messageChannelInfo = document.querySelector(
              ".message .channel_detail .channel_title_info"
            );
            const channelTitleInfo = document.createElement("span");
            let channelSize = data.channels.length;
            const channelTitleInfoTxt = document.createTextNode(
              "#" + data.channels[channelSize - 1].name
            );
            channelTitleInfo.appendChild(channelTitleInfoTxt);
            messageChannelInfo.appendChild(channelTitleInfo);
            const privateChannel = document.querySelector(
              "#private_channel ul"
            );
            while (privateChannel.hasChildNodes()) {
              privateChannel.removeChild(privateChannel.firstChild);
            }
            //过滤private:true的channel列表
            const privateChannelObj = data.channels.filter(
              (item) => item.private == true
            );

            //如果 私有channel length>0 也用列表形式显示;否则 创建一个按钮 Add Channel
            if (privateChannelObj.length > 0) {
              //修改逻辑 先根据id排序,这样按照创建channelId先后顺序显示
              privateChannelObj
                .sort((a, b) => b.id - a.id)
                .forEach((element) => {
                  const li = document.createElement("li");

                  const ahref = document.createElement("a");
                  //通过绑定自定义 data-xx属性获取channel 属性,方便后面修改 和 点击事件触发查询
                  ahref.dataset.channelId = element.id;
                  ahref.dataset.channelName = element.name;
                  ahref.dataset.channelMembers = element.members;
                  const linkText = document.createTextNode(element.name);
                  ahref.appendChild(linkText);
                  li.appendChild(ahref);
                  privateChannel.appendChild(li);
                });
            } else {
              const addChannelBtn = document.createElement("button");
              addChannelBtn.className = "add_channel_btn";
              const btnTxt = document.createTextNode("Add Channel");
              addChannelBtn.appendChild(btnTxt);
              privateChannel.appendChild(addChannelBtn);
              //没有私有channel,允许添加一个channel
              addChannelBtn.addEventListener(
                "click",
                (e) => {
                  showModelDiv();
                },
                true
              );
              modal = document.getElementById("myModal");
              closeBtn = document.querySelector(".close");
              console.log("closeBtn", closeBtn);
              closeBtn.addEventListener(
                "click",
                (e) => {
                  console.log("关闭窗口", e.target);
                  closeModal();
                },
                true
              );
            }
          }
          //简写 new Promise((resolve,reject)=>{ resolve(data)});
          return Promise.resolve(data);
        }
      })
      .then((data) => {
        console.log(
          "3.渲染聊天界面频道信息(第一次访问chat页面加载的信息)",
          data
        );
        const token = sessionStorage.getItem("token");
        //查询所有频道返回的数据中没有createdAt信息,所以需要用channelId查询详细内容
        const apiCall = (path, token) => {
          fetch("http://localhost:5005/" + path, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.error) {
                //请求失败,服务器给你返回的数据
                alert(data.error);
              } else {
                console.log("channel info", data);
                //存储该频道信息到sessionStorage,JSON.stringify 将对象字符串化,方便修改和显示
                sessionStorage.setItem(
                  "currentChannelInfo",
                  JSON.stringify(data)
                );
                const messageChannelDetailInfo = document.querySelector(
                  ".message .channel_detail .channel_detail_info"
                );
                const channelDetailInfo = document.createElement("span");

                const createdAt = data.createdAt;
                console.log("createdAt", createdAt);
                const channal_date = new Date(createdAt);
                const options = {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                };
                const formattedDate = channal_date.toLocaleDateString(
                  undefined,
                  options
                );
                const channelDetailInfoContent = `You created this channel on ${formattedDate}. This is the very beginning of the #${data.name}.`;
                console.log(channelDetailInfoContent);
                const channelDetailInfoContentTxt = document.createTextNode(
                  channelDetailInfoContent
                );
                channelDetailInfo.appendChild(channelDetailInfoContentTxt);
                messageChannelDetailInfo.appendChild(channelDetailInfo);
                // let firstChannelId = data.cha
                return fetch(
                  "http://localhost:5005/message/813580" + "?start=1",
                  {
                    method: "get",
                    headers: {
                      "Content-type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                )
                  .then((response) => response.json())
                  .then((data) => {
                    if (data.error) {
                      alert(data.error);
                    } else {
                      console.log("message:", data);
                      const nowChanelInfo =
                        sessionStorage.getItem("currentChannelInfo");
                      console.log("nowChannelInfo..", nowChanelInfo);
                      data.messages.forEach((item) => {
                        createMessageCardDiv(nowChanelInfo, item);
                      });
                    }
                  });
              }
            });
        };
        // let channelSize =  data.channels.length;
        apiCall("channel/813580", token);
      })
      .then(() => {
        console.log("5.点击每个频道 更新频道信息和聊天记录");
        const channelItems = document.querySelectorAll("ul li a");
        channelItems.forEach((item) => {
          item.addEventListener("click", (e) => {
            console.log("channel item", e.target);
            //获取message里频道内容更新
            const token = sessionStorage.getItem("token");
            console.log(e.target.dataset.channelId);
            const nowChannelId = e.target.dataset.channelId;
            const apiCall = (path, token) => {
              fetch("http://localhost:5005/" + path, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data.error) {
                    //请求失败,服务器给你返回的数据
                    alert(data.error);
                  } else {
                    //查询channel detail info
                    console.log("channal by id success:", data);
                    sessionStorage.setItem(
                      "currentChannelInfo",
                      JSON.stringify(data)
                    );
                    const changeChannelTitle = document.querySelector(
                      ".message .channel_title_info span"
                    );
                    changeChannelTitle.innerText = "#" + data.name;
                    const changeChannelDetailInfo = document.querySelector(
                      ".message .channel_detail_info span"
                    );
                    const createdAt = data.createdAt;
                    const channal_date = new Date(createdAt);
                    const options = {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    };
                    const updateFormattedDate = channal_date.toLocaleDateString(
                      undefined,
                      options
                    );
                    changeChannelDetailInfo.innerText = `You created this channel on ${updateFormattedDate}. This is the very beginning of the #${data.description}.`;
                    // loadMessage(data.id);
                    return Promise.resolve(data.id);
                  }
                })
                .then((channel_id) => {
                  console.log("6.重新加载聊天信息页面", nowChannelId);
                  const token = sessionStorage.getItem("token");
                });
            };
            apiCall("channel/" + nowChannelId, token);
          });
        });
      });
  };
  apiCall("channel", token);
}

function showModelDiv() {
  openModal();
}
function openModal() {
  modal.style.display = "block"; // 显示模态框
}
/**
 * 已经有channel的情况下,双击public channel 或者 private channel 还可以新增channel
 */
for (const iter of channalTitle) {
  iter.addEventListener(
    "dblclick",
    (e) => {
      showModelDiv();
      modal = document.getElementById("myModal");
      closeBtn = document.querySelector(".close");
      console.log("closeBtn", closeBtn);
      closeBtn.addEventListener(
        "click",
        (e) => {
          console.log("关闭窗口", e.target);
          closeModal();
        },
        true
      );
    },
    true
  );
}
/**创建 聊天界面,传入频道编号 和 聊天数据 */
function createMessageCardDiv(channelObj, messageObj) {
  if (messageObj === undefined) {
    alert("no message data");
  } else {
    const card = document.createElement("div");
    card.className = "card";
    const image = document.createElement("div");
    image.className = "image";
    const img = document.createElement("img");
    img.src =
      "https://secure.meetupstatic.com/photos/event/4/1/0/e/600_440836654.jpeg";
    image.appendChild(img);
    card.appendChild(image);
    const contentDiv = document.createElement("div");
    contentDiv.className = "content";
    const infoDiv = document.createElement("div");
    infoDiv.className = "info";
    const spanUsername = document.createElement("span");
    spanUsername.className = "username";
    const spanUsernameTxt = document.createTextNode(messageObj.sender);
    spanUsername.appendChild(spanUsernameTxt);
    const spanTime = document.createElement("span");
    spanTime.className = "time";
    const spanTimeTxt = document.createTextNode(messageObj.sentAt);
    spanTime.appendChild(spanTimeTxt);
    infoDiv.appendChild(spanUsername);
    infoDiv.appendChild(spanTime);
    contentDiv.appendChild(infoDiv);
    const messageContentDiv = document.createElement("div");
    messageContentDiv.className = "message-content";
    const messageContentTxt = document.createTextNode(messageObj.message);
    messageContentDiv.appendChild(messageContentTxt);
    contentDiv.appendChild(messageContentDiv);
    card.appendChild(contentDiv);
    messageDetail.appendChild(card);
  }
}
