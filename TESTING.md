# NusaMart Dashboard — Hasil Pengujian

## 1. Pengujian Tampilan
- Tampilan desktop: perlu diperiksa secara langsung.
- Tampilan mobile: rapi berdasarkan pemeriksaan melalui browser.

## 2. Pengujian Fitur
- Pencarian produk: berfungsi.
- Pengurutan produk: tersedia dan berfungsi.
- Filter harga Rupiah: berfungsi.
- Validasi rentang harga: berfungsi.
- Pergantian tema: berfungsi.
- Penyimpanan tema setelah halaman dimuat ulang: berfungsi.

## 3. Pengujian API
- Sumber data produk: DummyJSON API.
- Status koneksi API: perlu dicatat setelah pengujian langsung.

## 4. Catatan
Hasil pengujian didasarkan pada pemeriksaan fitur yang dilakukan selama pengembangan. Pengujian tambahan diperlukan untuk memastikan seluruh fitur berjalan dalam berbagai kondisi.

## Pengujian Validasi Harga Rupiah

Pengujian tambahan untuk validasi input harga:

- Input angka bulat positif: diterima jika rentang harga valid.
- Input notasi seperti `1e3`: ditolak.
- Input negatif seperti `-100`: ditolak.
- Harga maksimum lebih kecil daripada minimum: ditolak.
- Kedua input harga kosong: semua produk ditampilkan kembali.

Catatan: hasil setiap skenario dicatat setelah pengujian langsung di browser.
