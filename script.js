window.addEventListener("load", () => {
  const loading = document.getElementById("loading");

  if (!loading) {
    return;
  }

  loading.classList.add("hide");
  setTimeout(() => {
    loading.remove();
  }, 400);
});

function showPage(page) {
  document.querySelectorAll(".page").forEach((section) => {
    section.style.display = "none";
  });

  const activePage = document.getElementById(page);
  if (activePage) {
    activePage.style.display = "block";
  }

  if (page === "dashboard") {
    loadData();
  }
}

showPage("accounts");

let currentItem = null;
let images = [];
let currentIndex = 0;
let interval;
let dashboardInterval;

function animateCards() {
  document.querySelectorAll(".card").forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("show");
    }, index * 100);
  });
}

function createCard(item) {
  const imageSource =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images[0]
      : "img/logo final.webp";

  const card = document.createElement("div");
  card.className = "card";
  card.addEventListener("click", () => openOverlay(item));
  card.innerHTML = `
    <div class="image-acc">
      <img src="${imageSource}" alt="${item.title}" />
    </div>
    <div class="info-acc">
      <div class="card-title">${item.title}</div>
      <div class="card-price">${item.price}</div>
    </div>
  `;

  return card;
}

async function loadAccounts() {
  try {
    const response = await fetch("accounts.json");
    if (!response.ok) {
      throw new Error(`Failed to load accounts: ${response.status}`);
    }

    const data = await response.json();
    const zzzContainer = document.getElementById("zzz-container");
    const hsrContainer = document.getElementById("hsr-container");

    zzzContainer.innerHTML = "";
    hsrContainer.innerHTML = "";

    (data.zzz || []).forEach((item) => {
      zzzContainer.appendChild(createCard(item));
    });

    (data.hsr || []).forEach((item) => {
      hsrContainer.appendChild(createCard(item));
    });

    animateCards();
  } catch (error) {
    console.error(error);
  }
}

function openOverlay(item) {
  const overlay = document.getElementById("overlay");
  if (!overlay) {
    return;
  }

  overlay.classList.add("show");
  currentItem = item;
  images =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : ["img/logo final.webp"];
  currentIndex = 0;
  updateImage();

  clearInterval(interval);
  interval = setInterval(nextImage, 4000);

  document.getElementById("overlay-title").innerText = item.title;
  document.getElementById("overlay-price").innerText = `Price:\n${item.price}`;
  document.getElementById("overlay-desc").innerText = item.description;
}

function orderWA() {
  if (!currentItem) {
    return;
  }

  const text = `Hello, I'm interested in the ${currentItem.title} account. Is it still available?`;
  const url = `https://wa.me/6285117045962?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
}

function updateImage() {
  const image = document.getElementById("overlay-img");
  if (image) {
    image.src = images[currentIndex];
  }
}

function nextImage() {
  if (images.length <= 1) {
    return;
  }

  currentIndex = (currentIndex + 1) % images.length;
  updateImage();
}

function prevImage() {
  if (images.length <= 1) {
    return;
  }

  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateImage();
}

document.addEventListener("click", (event) => {
  if (event.target.closest(".wa-btn")) {
    return;
  }

  const slider = event.target.closest(".image-slider");
  if (!slider) {
    return;
  }

  if (event.target.closest(".arrow")) {
    event.stopPropagation();
    return;
  }

  const rect = slider.getBoundingClientRect();
  const x = event.clientX - rect.left;

  if (x < rect.width / 2) {
    prevImage();
  } else {
    nextImage();
  }
});

function closeOverlay() {
  const overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.classList.remove("show");
  }
  clearInterval(interval);
}

document.querySelectorAll(".arrow").forEach((arrow) => {
  arrow.addEventListener("click", (event) => {
    event.stopPropagation();
  });
});

function parseCsvRow(row) {
  const values = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < row.length; index += 1) {
    const char = row[index];
    const nextChar = row[index + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === "," && !insideQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function checkStatus(value) {
  return value === "TRUE" ? "\u25CF" : "\u25CB";
}

async function loadData() {
  try {
    const list = document.getElementById("list");
    if (!list) {
      return;
    }

    const response = await fetch(
      `https://docs.google.com/spreadsheets/d/e/2PACX-1vR9wCzduAuhztWNNSoICvnKDW-cAwv2HaMwpdQqUGkOWcnbEWLWstz6-N-8pS5clwhlDXQml8k_WR9O/pub?output=csv&t=${Date.now()}`
    );

    if (!response.ok) {
      throw new Error(`Failed to load dashboard: ${response.status}`);
    }

    const text = await response.text();
    const rows = text
      .split(/\r?\n/)
      .slice(1)
      .filter((row) => row.trim() !== "");

    list.innerHTML = "";

    rows.forEach((row) => {
      const cols = parseCsvRow(row);
      const data = {
        title: cols[0] || "",
        game: cols[1] || "",
        level: cols[2] || "",
        poly: cols[3] || "",
        encrypt: cols[4] || "",
        master: cols[5] || "",
        boopon: cols[6] || "",
        daily: cols[7] || "",
        weekly: cols[8] || "",
        event: cols[9] || "",
        story: cols[10] || "",
      };

      if (!data.title.trim()) {
        return;
      }

      const sheet = document.createElement("div");
      sheet.className = "acc-box";
      sheet.innerHTML = `
        <div class="inpo-acc">
          <div style="line-height: 1;">
            <h2>${data.title}</h2>
            <p>${data.game} \u2022 Lv ${data.level}</p>
          </div>
          <div class="currency">
            <img src="img/Item/Poly.webp" alt="Poly" class="item-icon" /> ${data.poly} |
            <img src="img/Item/Encrypt.webp" alt="Encrypt" class="item-icon" /> ${data.encrypt} |
            <img src="img/Item/Master.webp" alt="Master" class="item-icon" /> ${data.master} |
            <img src="img/Item/Boopon.webp" alt="Boopon" class="item-icon" /> ${data.boopon}
          </div>
        </div>
        <div class="status">
          Daily: ${checkStatus(data.daily)} |
          Weekly: ${checkStatus(data.weekly)} |
          Event: ${checkStatus(data.event)} |
          Story: ${checkStatus(data.story)}
        </div>
      `;

      list.appendChild(sheet);
    });
  } catch (error) {
    console.error(error);
    const list = document.getElementById("list");
    if (list && list.innerHTML.trim() === "") {
      list.innerHTML =
        '<div class="acc-box"><div class="status">Dashboard failed to load. Please try again.</div></div>';
    }
  }
}

loadAccounts();
loadData();
dashboardInterval = setInterval(() => {
  const dashboardPage = document.getElementById("dashboard");
  if (dashboardPage && dashboardPage.style.display === "block") {
    loadData();
  }
}, 60000);
