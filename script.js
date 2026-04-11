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

fetch("accounts.json")
  .then((res) => res.json())
  .then((data) => {
    function createCard(item) {
      const img =
        item.images && item.images.length > 0
          ? item.images[0]
          : "img/logo final.webp"; // fallback

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
function openOverlay(item) {
  document.getElementById("overlay").style.display = "flex";
  document.getElementById("overlay-img").src = item.image;
  document.getElementById("overlay-title").innerText = item.title;
  document.getElementById("overlay-price").innerText = item.price;
}
function closeOverlay() {
  document.getElementById("overlay").style.display = "none";
}

let images = [];
let currentIndex = 0;
let interval;

// buka overlay
function openOverlay(item) {
  document.getElementById("overlay").style.display = "flex";

  images = item.images; // array gambar
  currentIndex = 0;

  updateImage();

  // auto slide
  clearInterval(interval);
  interval = setInterval(nextImage, 4000);

  document.getElementById("overlay-title").innerText = item.title;
  document.getElementById("overlay-price").innerText = "Price : \n" + item.price;
  document.getElementById("overlay-desc").innerText = item.description;
}

// update gambar
function updateImage() {
  document.getElementById("overlay-img").src = images[currentIndex];
}

// next
function nextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  updateImage();
}

// prev
function prevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateImage();
}

// klik kiri kanan
const slider = document.querySelector(".image-slider");

slider.addEventListener("click", function (e) {
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
setTimeout(() => {
  document.querySelectorAll(".card").forEach((el, i) => {
    setTimeout(() => {
      el.classList.add("show");
    }, i * 100);
  });
}, 100);
