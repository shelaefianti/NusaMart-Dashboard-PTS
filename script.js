// NusaMart Dashboard — logika utama menggunakan Vanilla JavaScript.
const API_URL = "https://dummyjson.com/products?limit=0";

// State aplikasi: data asli dari API dan rentang harga yang sedang digunakan.
let allProducts = [];
let appliedMinPrice = null;
let appliedMaxPrice = null;

const productGrid = document.querySelector("#productGrid");
const loadingState = document.querySelector("#loadingState");
const errorState = document.querySelector("#errorState");
const emptyState = document.querySelector("#emptyState");
const errorMessage = document.querySelector("#errorMessage");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const resultCount = document.querySelector("#resultCount");
const priceForm = document.querySelector("#priceForm");
const minPriceInput = document.querySelector("#minPrice");
const maxPriceInput = document.querySelector("#maxPrice");
const priceMessage = document.querySelector("#priceMessage");
const themeToggle = document.querySelector("#themeToggle");

// DummyJSON menyediakan harga angka; untuk tampilan lokal kita pakai estimasi konversi tetap.
// Catatan: 1 USD = Rp16.500 hanya estimasi tampilan, bukan kurs real-time.
const IDR_PER_USD = 16500;

function formatPrice(price) {
  const priceInRupiah = price * IDR_PER_USD;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(priceInRupiah);
}

// Mengubah status tampilan saat data sedang dimuat.
function showLoading() {
  loadingState.hidden = false;
  errorState.hidden = true;
  emptyState.hidden = true;
  productGrid.replaceChildren();
  resultCount.textContent = "Memuat produk…";
}

// Mengambil data produk dari REST API.
async function loadProducts() {
  showLoading();

  try {
    const response = await fetch(API_URL);

    // fetch tidak otomatis gagal hanya karena server mengirim HTTP 404/500.
    if (!response.ok) {
      throw new Error(`Server merespons dengan HTTP ${response.status}.`);
    }

    const data = await response.json();

    // Pastikan respons memiliki daftar produk sebelum diproses.
    if (!Array.isArray(data.products)) {
      throw new Error("Format data produk dari API tidak sesuai.");
    }

    allProducts = data.products;
    loadingState.hidden = true;
    updateStatistics();
    renderProducts();
  } catch (error) {
    loadingState.hidden = true;
    productGrid.replaceChildren();
    errorState.hidden = false;
    errorMessage.textContent =
      `${error.message} Periksa internet, lalu tekan tombol coba lagi.`;
    resultCount.textContent = "Data gagal dimuat";
  }
}

// Menghitung statistik dari seluruh data yang berhasil diambil.
function updateStatistics() {
  const total = allProducts.length;
  const totalPrice = allProducts.reduce((sum, product) => sum + product.price, 0);
  const average = total > 0 ? totalPrice / total : 0;
  const mostExpensive = allProducts.reduce(
    (highest, product) => product.price > highest.price ? product : highest,
    allProducts[0]
  );
  const categories = new Set(allProducts.map(product => product.category));

  document.querySelector("#totalProducts").textContent = total;
  document.querySelector("#averagePrice").textContent = formatPrice(average);
  document.querySelector("#highestPrice").textContent =
    mostExpensive ? formatPrice(mostExpensive.price) : "—";
  document.querySelector("#highestName").textContent =
    mostExpensive ? mostExpensive.title : "Tidak ada data";
  document.querySelector("#totalCategories").textContent = categories.size;
}

// Mengolah data sesuai kata kunci, rentang harga, dan pilihan sorting.
function getVisibleProducts() {
  const keyword = searchInput.value.trim().toLowerCase();

  let visibleProducts = allProducts.filter(product => {
    const matchesKeyword =
      product.title.toLowerCase().includes(keyword) ||
      product.category.toLowerCase().includes(keyword);
    const matchesMin = appliedMinPrice === null || product.price >= appliedMinPrice;
    const matchesMax = appliedMaxPrice === null || product.price <= appliedMaxPrice;
    return matchesKeyword && matchesMin && matchesMax;
  });

  const sortMode = sortSelect.value;
  visibleProducts = [...visibleProducts];

  if (sortMode === "name-asc") {
    visibleProducts.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortMode === "price-asc") {
    visibleProducts.sort((a, b) => a.price - b.price);
  } else if (sortMode === "price-desc") {
    visibleProducts.sort((a, b) => b.price - a.price);
  } else if (sortMode === "rating-desc") {
    visibleProducts.sort((a, b) => b.rating - a.rating);
  }

  return visibleProducts;
}

// Membuat elemen kartu produk berdasarkan data JSON.
function createProductCard(product) {
  const article = document.createElement("article");
  article.className = "product-card";

  const imageWrap = document.createElement("div");
  imageWrap.className = "product-image-wrap";

  const image = document.createElement("img");
  image.className = "product-image";
  image.src = product.thumbnail;
  image.alt = product.title;
  image.loading = "lazy";
  image.onerror = () => {
    image.alt = `Gambar untuk ${product.title} tidak tersedia`;
    image.removeAttribute("src");
  };

  const category = document.createElement("span");
  category.className = "category-pill";
  category.textContent = product.category;

  const content = document.createElement("div");
  content.className = "product-content";

  const rating = document.createElement("p");
  rating.className = "product-rating";
  rating.textContent = `★ ${Number(product.rating).toFixed(1)} `;
  const ratingNote = document.createElement("span");
  ratingNote.textContent = "rating";
  rating.append(ratingNote);

  const title = document.createElement("h3");
  title.className = "product-title";
  title.textContent = product.title;

  const bottom = document.createElement("div");
  bottom.className = "product-bottom";

  const price = document.createElement("span");
  price.className = "product-price";
  price.textContent = formatPrice(product.price);

  const discount = document.createElement("span");
  discount.className = "product-discount";
  discount.textContent = `${Math.round(product.discountPercentage)}% diskon`;

  imageWrap.append(image, category);
  bottom.append(price, discount);
  content.append(rating, title, bottom);
  article.append(imageWrap, content);

  return article;
}

// Memperbarui kartu produk di halaman.
function renderProducts() {
  const visibleProducts = getVisibleProducts();
  productGrid.replaceChildren();

  visibleProducts.forEach(product => {
    productGrid.append(createProductCard(product));
  });

  resultCount.textContent =
    `Menampilkan ${visibleProducts.length} dari ${allProducts.length} produk`;
  emptyState.hidden = visibleProducts.length !== 0;
  loadingState.hidden = true;
}

// Validasi dua input yang berkaitan: harga maksimum tidak boleh di bawah minimum.
priceForm.addEventListener("submit", event => {
  event.preventDefault();

const minText = minPriceInput.value.trim();
const maxText = maxPriceInput.value.trim();

// Memeriksa agar input hanya berisi angka bulat.
const minValid = minText === "" || /^\d+$/.test(minText);
const maxValid = maxText === "" || /^\d+$/.test(maxText);

const minRupiah = minText === "" || !minValid
  ? null
  : Number(minText);

const maxRupiah = maxText === "" || !maxValid
  ? null
  : Number(maxText);

const min = minRupiah === null ? null : minRupiah / IDR_PER_USD;
const max = maxRupiah === null ? null : maxRupiah / IDR_PER_USD;

minPriceInput.setAttribute("aria-invalid", "false");
maxPriceInput.setAttribute("aria-invalid", "false");
priceMessage.className = "form-message";

if (!minValid || !maxValid ||
    (minRupiah !== null && !Number.isSafeInteger(minRupiah)) ||
    (maxRupiah !== null && !Number.isSafeInteger(maxRupiah))) {
  priceMessage.textContent =
    "Masukkan harga berupa angka bulat Rupiah nol atau lebih.";
  priceMessage.classList.add("error");

  if (!minValid ||
      (minRupiah !== null && !Number.isSafeInteger(minRupiah))) {
    minPriceInput.setAttribute("aria-invalid", "true");
  }

  if (!maxValid ||
      (maxRupiah !== null && !Number.isSafeInteger(maxRupiah))) {
    maxPriceInput.setAttribute("aria-invalid", "true");
  }

  return;
}

  if (minRupiah !== null && maxRupiah !== null && maxRupiah < minRupiah) {
    priceMessage.textContent = "Harga maksimum harus sama dengan atau lebih besar dari harga minimum.";
    priceMessage.classList.add("error");
    minPriceInput.setAttribute("aria-invalid", "true");
    maxPriceInput.setAttribute("aria-invalid", "true");
    maxPriceInput.focus();
    return;
  }

  appliedMinPrice = min;
  appliedMaxPrice = max;
  priceMessage.textContent = "Rentang harga berhasil diterapkan.";
  priceMessage.classList.add("success");
  renderProducts();
});

// Pencarian langsung diperbarui setiap kali pengguna mengetik.
searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);

document.querySelector("#resetPrice").addEventListener("click", () => {
  priceForm.reset();
  appliedMinPrice = null;
  appliedMaxPrice = null;
  minPriceInput.setAttribute("aria-invalid", "false");
  maxPriceInput.setAttribute("aria-invalid", "false");
  priceMessage.textContent = "";
  priceMessage.className = "form-message";
  renderProducts();
});

document.querySelector("#clearSearch").addEventListener("click", () => {
  searchInput.value = "";
  priceForm.reset();
  appliedMinPrice = null;
  appliedMaxPrice = null;
  priceMessage.textContent = "";
  priceMessage.className = "form-message";
  renderProducts();
});

document.querySelector("#retryButton").addEventListener("click", loadProducts);

// Challenge C = 0: simpan preferensi tema ke localStorage.
function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-theme", isDark);
  document.querySelector("#themeIcon").textContent = isDark ? "☀" : "☾";
  document.querySelector("#themeText").textContent = isDark ? "Mode terang" : "Mode gelap";
  themeToggle.setAttribute("aria-pressed", String(isDark));
}

function initializeTheme() {
  let savedTheme = "light";
  try {
    savedTheme = localStorage.getItem("nusamart-theme") || "light";
  } catch (error) {
    // Aplikasi tetap bisa dipakai jika penyimpanan browser tidak tersedia.
  }
  applyTheme(savedTheme);
}

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
  applyTheme(nextTheme);
  try {
    localStorage.setItem("nusamart-theme", nextTheme);
  } catch (error) {
    // Tema berubah untuk sesi ini meskipun tidak bisa disimpan.
  }
});

// Jalankan saat halaman siap.
initializeTheme();
loadProducts();
