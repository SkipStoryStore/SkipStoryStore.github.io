window.addEventListener("load", () => {
  const loading = document.getElementById("loading");
  loading.classList.add("hide");
  setTimeout(() => {
    loading.remove();
  }, 400);
});

function showPage(page) {
  document.querySelectorAll(".page").forEach((p) => (p.style.display = "none"));
  document.getElementById(page).style.display = "block";
}
showPage("accounts");

let currentItem = null;
let images = [];
let currentIndex = 0;
let interval;

fetch("accounts.json")
  .then((res) => res.json())
  .then((data) => {
    function createCard(item) {
      const img =
        item.images && item.images.length > 0
          ? item.images[0]
          : "img/logo final.webp";

      return `
    <div class="card" onclick='openOverlay(${JSON.stringify(item)})'>
      <div class="image-acc">
        <img src="${img}">
      </div>
      <div class="info-acc">
        <div class="card-title">${item.title}</div>
        <div class="card-price">${item.price}</div>
      </div>
    </div>
  `;
    }

    // ZZZ
    const zzzContainer = document.getElementById("zzz-container");
    data.zzz.forEach((item) => {
      zzzContainer.innerHTML += createCard(item);
    });

    // HSR
    const hsrContainer = document.getElementById("hsr-container");
    data.hsr.forEach((item) => {
      hsrContainer.innerHTML += createCard(item);
    });
  });

// buka overlay
function openOverlay(item) {
  document.getElementById("overlay").style.display = "flex";
  currentItem = item;
  images = Array.isArray(item.images) && item.images.length > 0
    ? item.images
    : ["img/logo final.webp"];
  currentIndex = 0;
  updateImage();
  clearInterval(interval);
  interval = setInterval(nextImage, 4000);
  document.getElementById("overlay-title").innerText = item.title;
  document.getElementById("overlay-price").innerText = "Price : \n" + item.price;
  document.getElementById("overlay-desc").innerText = item.description;
}
function orderWA() {
  if (!currentItem) return;

  const text = `Hello, I’m interested in the ${currentItem.title} account. Is it still available?`;
  const url = `https://wa.me/6285117045962?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
}
// update gambar
function updateImage() {
  document.getElementById("overlay-img").src = images[currentIndex];
}

// next
function nextImage() {
  if (images.length <= 1) return;
  currentIndex = (currentIndex + 1) % images.length;
  updateImage();
}

// prev
function prevImage() {
  if (images.length <= 1) return;
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateImage();
}

// klik kiri kanan
document.addEventListener("click", function (e) {
  if (e.target.closest(".wa-btn")) return;

  const slider = e.target.closest(".image-slider");
  if (!slider) return;

  if (e.target.closest(".arrow")) {
    e.stopPropagation();
    return;
  }

  const rect = slider.getBoundingClientRect();
  const x = e.clientX - rect.left;

  if (x < rect.width / 2) {
    prevImage();
  } else {
    nextImage();
  }
});

// close overlay
function closeOverlay() {
  document.getElementById("overlay").style.display = "none";
  clearInterval(interval);
}

document.querySelectorAll(".arrow").forEach((arrow) => {
  arrow.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});

setTimeout(() => {
  document.querySelectorAll(".card").forEach((el, i) => {
    setTimeout(() => {
      el.classList.add("show");
    }, i * 100);
  });
}, 100);
async function loadData() {
  const res = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vR9wCzduAuhztWNNSoICvnKDW-cAwv2HaMwpdQqUGkOWcnbEWLWstz6-N-8pS5clwhlDXQml8k_WR9O/pub?output=csv&t=" + new Date().getTime());
  const text = await res.text();

  const rows = text.split("\n").slice(1);
  const list = document.getElementById("list");
  list.innerHTML = "";

  rows.forEach(row => {
    const cols = row.split(",");

    const data = {
      title: cols[0],
      game: cols[1],
      level: cols[2],
      poly: cols[3],
      encrypt: cols[4],
      master: cols[5],
      boopon: cols[6],
      daily: cols[7],
      weekly: cols[8],
      event: cols[9],
      story: cols[10],
      link: cols[12]
    };

    const check = (val) => val === "TRUE" ? "✔" : "✖";

    const sheet = `
      <div class="acc-box">
        <h2>${data.title}</h2>
        <p>${data.game} • Lv ${data.level}</p>

        <div class="currency">
          💎 ${data.poly} | 🎟 ${data.encrypt} | 🎫 ${data.master} | 🐾 ${data.boopon}
        </div>

        <div class="status">
          Daily: ${check(data.daily)} |
          Weekly: ${check(data.weekly)} |
          Event: ${check(data.event)} |
          Story: ${check(data.story)}
        </div>
      </div>
    `;

    list.innerHTML += sheet;
  });
}

loadData();
setInterval(loadData, 30000);