# NusaMart Dashboard

Dashboard produk interaktif untuk Mini Project Front-End PTS Pemrograman Web.

## Identitas mahasiswa
- Nama: Shela Efianti Pamangin
- NPM: 2440304004
- Kelas: A1
- Program Studi: Teknik Komputer, Universitas Borneo Tarakan

## Deskripsi
NusaMart Dashboard menampilkan katalog produk dari REST API DummyJSON. Pengguna dapat mencari produk secara real-time, mengurutkan data, menerapkan rentang harga, melihat statistik hasil perhitungan JavaScript, dan mengganti tema terang/gelap.

## Perhitungan variasi soal
Tiga digit terakhir NIM: `004`
- X = 0 → Dataset Products
- Y = 0 → Search real-time + sorting
- Z = 4 → Dua input yang berkaitan harus divalidasi
- S = X + Y + Z = 0 + 0 + 4 = 4
- C = S mod 4 = 4 mod 4 = 0 → Light/Dark Mode, preferensi disimpan di localStorage

## API
- Endpoint: https://dummyjson.com/products?limit=0
- Sumber API: DummyJSON
- Data diambil menggunakan `fetch()`, `async/await`, dan diubah dari JSON menjadi elemen DOM.

## Fitur
1. Katalog produk berisi gambar, nama, kategori, harga, rating, dan diskon.
2. Pencarian real-time berdasarkan nama atau kategori.
3. Sorting nama A–Z, harga termurah/termahal, dan rating tertinggi.
4. Filter rentang harga dalam rupiah dengan validasi harga minimum dan maksimum. Harga API dikonversi untuk tampilan menggunakan estimasi tetap 1 USD = Rp16.500, bukan kurs real-time.
5. Statistik total produk, rata-rata harga, produk termahal, dan total kategori.
6. Light/dark mode dengan preferensi tema pada localStorage.
7. Loading state, error state, dan tombol retry.
8. Responsive layout untuk desktop, tablet, dan mobile.

## Cara menjalankan
1. Ekstrak ZIP project.
2. Buka folder project di Visual Studio Code.
3. Jalankan `index.html` menggunakan ekstensi Live Server, atau gunakan server lokal lain.
4. Pastikan perangkat terhubung ke internet karena data produk dan gambar diambil dari layanan eksternal.
5. Buka Developer Tools → Network, lalu muat ulang halaman untuk melihat request ke `dummyjson.com`.

## Struktur folder
- `index.html` — struktur halaman.
- `style.css` — desain dan responsive layout.
- `script.js` — Fetch API, DOM, pencarian, sorting, validasi, statistik, dan tema.
- `AI_USAGE_LOG.md` — catatan bantuan AI yang perlu diperbarui sesuai penggunaan sebenarnya.

## Statistik yang dihitung
- Total produk: jumlah objek produk yang diterima.
- Rata-rata harga: total seluruh harga dibagi jumlah produk; nilai ditampilkan dalam rupiah menggunakan estimasi tetap 1 USD = Rp16.500.
- Produk termahal: produk dengan nilai `price` paling tinggi.
- Total kategori: jumlah kategori unik.

## Jawaban pertanyaan penjelasan kode
> Draf awal di bawah perlu kamu cocokkan lagi setelah project diuji dan disesuaikan. Ubah jawaban bug berdasarkan pengalamanmu sendiri; jangan mengaku mengalami bug yang tidak kamu alami.

### 1. Jelaskan alur sejak halaman dibuka sampai data REST API tampil.
Browser membaca `index.html`, lalu memuat `style.css` dan `script.js`. Fungsi `initializeTheme()` membaca preferensi tema dari localStorage. Setelah itu `loadProducts()` menampilkan loading, menjalankan `fetch(API_URL)`, memeriksa `response.ok`, membaca JSON, menyimpan daftar produk ke `allProducts`, memanggil `updateStatistics()`, lalu `renderProducts()` membuat kartu produk ke DOM.

### 2. Mengapa setelah fetch() selesai masih perlu memeriksa response.ok?
`fetch()` dapat tetap menghasilkan objek response ketika server mengirim status HTTP seperti 404 atau 500. `response.ok` diperiksa agar status HTTP yang gagal ditangani sebagai error, lalu ditampilkan melalui bagian `catch`.

### 3. Pilih satu data JSON dari API dan jelaskan bagaimana data tersebut menjadi elemen DOM.
Contohnya, objek produk memiliki properti `title`, `price`, `thumbnail`, dan `category`. Fungsi `createProductCard(product)` membuat elemen HTML dengan `document.createElement()`, lalu mengisi teks dan atribut dari properti tersebut. Kartu dikembalikan dan ditambahkan ke `productGrid` oleh `renderProducts()`.

### 4. Apa yang terjadi jika internet terputus, endpoint salah, atau server mengembalikan HTTP 404/500?
Kegagalan jaringan atau status HTTP yang tidak berhasil ditangani oleh `catch` dalam `loadProducts()`. Loading disembunyikan, pesan error ditampilkan, dan pengguna dapat menekan tombol “Coba lagi” untuk menjalankan `loadProducts()` kembali.

### 5. Jelaskan fitur berdasarkan digit Y.
Digit Y = 0, jadi fitur wajib adalah search real-time dan sorting. Event `input` pada `searchInput` memanggil `renderProducts()` saat pengguna mengetik. Event `change` pada `sortSelect` juga memanggil fungsi tersebut. `getVisibleProducts()` menyaring kata kunci dan mengurutkan data sesuai pilihan.

### 6. Jelaskan validasi berdasarkan digit Z.
Digit Z = 4, sehingga dua input yang berkaitan harus divalidasi. Project ini menggunakan harga minimum dan maksimum. Saat form dikirim, event `submit` memeriksa apakah nilai berupa angka nonnegatif dan apakah harga maksimum lebih besar daripada atau sama dengan harga minimum. Data filter baru diterapkan jika valid.

### 7. Jika project menggunakan localStorage, data apa yang disimpan dan kapan dibaca/diubah?
Project menyimpan pilihan tema pada key `nusamart-theme`. `initializeTheme()` membaca nilai saat halaman dibuka. Ketika tombol tema ditekan, event click mengubah tampilan dan menyimpan tema baru dengan `localStorage.setItem()`.

### 8. Pilih satu fungsi JavaScript penting dan jelaskan input–proses–output.
Fungsi `formatPrice(price)` menerima angka harga, memprosesnya dengan `Intl.NumberFormat` menggunakan format mata uang USD, lalu menghasilkan teks harga yang mudah dibaca.

### 9. Sebutkan bug/error paling sulit, penyebab, cara menemukan, dan memperbaikinya.
Isi bagian ini berdasarkan pengujianmu sendiri. Catat error yang benar-benar kamu temui, pesan error atau gejalanya, cara kamu memeriksa Console/Network, serta perubahan kode yang memperbaikinya.

### 10. Jika diberi satu minggu lagi, sebutkan dua perbaikan teknis.
Contoh rencana: (1) menambahkan pengujian otomatis untuk fungsi penyaringan dan validasi agar regresi lebih mudah ditemukan; (2) menambahkan pagination agar katalog besar lebih nyaman dijelajahi. Sesuaikan jawaban dengan hal yang benar-benar ingin kamu kembangkan.

## Git
Target proses pengerjaan: minimal 8 meaningful commits dan tag `v0.1-PTS`. Buat commit secara bertahap ketika fitur benar-benar selesai, bukan membuat seluruh riwayat sekaligus di akhir.

## Screenshot
Simpan screenshot tampilan desktop dan mobile setelah aplikasi dijalankan dan diuji.

## Video demo
Durasi 6–10 menit. Awali dengan menampilkan wajah dan menyebutkan nama, NIM, dan nama aplikasi. Demonstrasikan aplikasi responsif, fitur search/sorting, validasi, tema, request API di Network, Git history, dan jelaskan satu fungsi JavaScript.

## Repository
[Isi URL repository GitHub/GitLab setelah dibuat]

## Video demo
[Isi URL video setelah diunggah]

## AI Usage Log
Lihat `AI_USAGE_LOG.md`. Perbarui catatan berdasarkan bantuan yang benar-benar digunakan, verifikasi, dan modifikasi yang kamu lakukan.
