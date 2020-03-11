import QrScanner from "./libs/qr-scanner.min.js"; // if using plain es6 import
import './libs/hammer.min.js'
QrScanner.WORKER_PATH = "./libs/qr-scanner-worker.min.js";

const qrVideo = document.querySelector("#qrVideo");
const loginCode = document.querySelector("#loginCode");
const controllerPage = document.querySelector("#controllerPage");
const loginPage = document.querySelector("#loginPage");
const animatedScanner = document.querySelector(".animated-scanner-container");
const container = document.querySelector(".container");
const keyBtns = document.querySelectorAll(".key");

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register("/sw.js").then(function() {
//     console.log("Service Worker Registered");
//   });
// }

window.oncontextmenu = function(event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
};

let ws;
let wasSocketConnected = false;
let loginInfo;

const connectToServer = () => {
  console.log(loginInfo);

  ws = new WebSocket(`wss://keymote.creativeshi.com/ws/${loginInfo.code}`);

  ws.onopen = e => {
    wasSocketConnected = true;
    controllerPage.style.display = "block";
    loginPage.style.display = "none";
  };

  ws.onclose = e => {
    console.log(
      "Socket is closed. Reconnect will be attempted in 1 second.",
      e.reason
    );

    if (wasSocketConnected) {
      setTimeout(() => {
        connectToServer();
      }, 1000);
    }
  };

  ws.onerror = err => {
    console.error("Socket encountered error: ", err.message, "Closing socket");
    ws.close();
  };
};

const qrScanner = new QrScanner(qrVideo, result => {
  console.log("decoded qr code:", result);
  const info = JSON.parse(result);
  loginInfo = info;
  connectToServer();
  qrScanner.stop();
});

QrScanner.hasCamera().then(() => {
  qrScanner.start();
  animatedScanner.style.display = "block";
  //also show the animated scanner
});

loginCode.addEventListener("click", () => {
  //stop the scan
  qrScanner.stop();
  animatedScanner.style.display = "none";

});

loginCode.addEventListener("keypress", e => {
  //stop the scan
  //if user presses enter then login
  if (e.key === "Enter") {
    loginInfo = { code: loginCode.value };
    connectToServer();
  }
});

// Create a manager to manager the element
const hammertime = new Hammer.Manager(container);
const Swipe = new Hammer.Swipe();

hammertime.add(Swipe);

//add swiping gestures to click on button

hammertime.on("swipeleft", e => {
  keyBtns[1].click();
});
hammertime.on("swiperight", e => {
  keyBtns[3].click();
});
hammertime.on("swipeup", e => {
  keyBtns[0].click();
});
hammertime.on("swipedown", e => {
  keyBtns[4].click();
});

const onlongtouch = msg => {
  console.log("long touch");

  const sendMsgRepeatedly = () => {
    ws.send(JSON.stringify(msg));
    msgTimer = setTimeout(sendMsgRepeatedly, 100);
  };
  sendMsgRepeatedly();
};

let timer;
let msgTimer;
const touchduration = 500; //length of time we want the user to touch before we do something

const touchstart = msg => {
  timer = setTimeout(() => onlongtouch(msg), touchduration);
};

const touchend = () => {
  //stops short touches from firing the event
  clearTimeout(msgTimer);

  if (timer) clearTimeout(timer); // clearTimeout, not cleartimeout..
};

keyBtns.forEach(el => {
  el.addEventListener("click", () => {
    //send the id of element up,down,left right
    let keyInfo = { key: el.id, event: "down" };
    ws.send(JSON.stringify(keyInfo));
    keyInfo = { key: el.id, event: "up" };
    ws.send(JSON.stringify(keyInfo));
  });
});
