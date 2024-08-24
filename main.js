const titleH1 = document.querySelector(".title h1");

titleH1.addEventListener("animationend", () => {
  setTimeout(() => {
    titleH1.style.animation = "blink-caret 0.5s step-end infinite 0s";
  }, 3500);
});
