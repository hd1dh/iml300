// script.js
document.addEventListener("DOMContentLoaded", () => {
  const fonts = [
    "Bitcount Prop Double Ink",
    "Festive",
    "Fontdiner Swanky",
    "Henny Penny",
    "Knewave",
    "Lavishly Yours",
    "Passions Conflict"
  ];

  const targets = document.querySelectorAll("[data-random-font]");

  targets.forEach((el) => {
    const text = el.textContent;
    el.textContent = "";

    for (const char of text) {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.fontFamily = fonts[Math.floor(Math.random() * fonts.length)];
      el.appendChild(span);
    }
  });
});
