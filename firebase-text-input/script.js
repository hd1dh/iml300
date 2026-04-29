const firebaseConfig = {
  apiKey: "AIzaSyDGuH4-UOvAnC5f6Uv4IbUGtALPvRr1WXs",
  authDomain: "almanac-3009b.firebaseapp.com",
  databaseURL: "https://almanac-3009b-default-rtdb.firebaseio.com",
  projectId: "almanac-3009b",
  storageBucket: "almanac-3009b.firebasestorage.app",
  messagingSenderId: "722402130204",
  appId: "1:722402130204:web:9be8c59393f1b75f0f22d9"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.database();

// 两个不同路径（关键）
const leftRef = db.ref("leftData");
const rightRef = db.ref("rightData");

const inputLeft = document.getElementById("input-left");
const inputRight = document.getElementById("input-right");

const btnLeft = document.getElementById("submit-left");
const btnRight = document.getElementById("submit-right");

const grid = document.getElementById("grid");

// 👉 左侧提交
btnLeft.addEventListener("click", function () {
    const value = inputLeft.value;
    if (!value) return;

    const newKey = leftRef.push().key;
    const updates = {};
    updates[newKey] = value;

    leftRef.update(updates);
});

// 👉 右侧提交
btnRight.addEventListener("click", function () {
    const value = inputRight.value;
    if (!value) return;

    const newKey = rightRef.push().key;
    const updates = {};
    updates[newKey] = value;

    rightRef.update(updates);
});