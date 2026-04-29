// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCywtkCOa9IoMQHFuMt0HYQCblON92dfcg",
    authDomain: "iml300-firebase-demo-2046d.firebaseapp.com",
    databaseURL: "https://iml300-firebase-demo-2046d-default-rtdb.firebaseio.com",
    projectId: "iml300-firebase-demo-2046d",
    storageBucket: "iml300-firebase-demo-2046d.firebasestorage.app",
    messagingSenderId: "114164794723",
    appId: "1:114164794723:web:4ba8370bf83e05a808ff56"
};

// 初始化
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 👉 和 demo 一样：一个路径
let dbRef = db.ref("text");

// 👉 获取元素
const input = document.getElementById("input-yi");
const submitBtn = document.getElementById("submit-btn");
const grid = document.getElementById("background-grid");

// 👉 点击提交（和 demo 一样）
submitBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const text = input.value;

    if (!text.trim()) return;

    // 👉 demo 核心写法
    const newKey = dbRef.push().key;

    const updates = {};
    updates[newKey] = text;

    dbRef.update(updates);

    // 清空输入
    input.value = "";
});

// 👉 监听数据（demo核心）
dbRef.on("child_added", function (snapshot) {
    const value = snapshot.val();

    createCard(value);
});

function createCard(text) {
    console.log("creating card:", text); // 👈 调试

    const card = document.createElement("div");
    card.className = "gridcard";

    card.innerHTML = `
        <div class="inputtop">
            <div class="inputfield">February 18 2026</div>
        </div>

        <div class="inputnumber">
            <div class="inputbignumber">18</div>
        </div>

        <div class="inputsection">
            <div class="inputlabel">Do's</div>
            <div class="inputfield">${text}</div>
        </div>

        <div class="inputsubmitwrap"></div>
    `;

    const grid = document.getElementById("background-grid");
    grid.appendChild(card);
}
