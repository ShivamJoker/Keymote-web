// if('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices){
//   console.log("Let's get this party started")
//   return false;
// }

import QrScanner from "./qr-scanner.min.js"; // if using plain es6 import
QrScanner.WORKER_PATH = "./qr-scanner-worker.min.js";

const qrVideo = document.querySelector("#qrVideo");
const loginCode = document.querySelector("#loginCode");

const qrScanner = new QrScanner(qrVideo, result => {
  console.log("decoded qr code:", result);
  loginCode.value = result;
});

QrScanner.hasCamera().then(console.log("camera yes"));

qrScanner.start();
