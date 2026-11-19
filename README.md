<div align="center">

# 📝 SangMalas

### Rapikan dokumen. Hemat waktu. Fokus pada isinya.

**SangMalas** adalah tool berbasis web untuk membantu merapikan format dokumen Microsoft Word (`.docx`) secara otomatis. Pilih preset yang tersedia atau gunakan dokumen contoh dari guru, dosen, maupun kantor sebagai acuan format.

Gratis • Tanpa akun • Pemrosesan dokumen di browser

[Repository](https://github.com/andisec/SangMalas) · [Laporkan Bug](https://github.com/andisec/SangMalas/issues) · [Ajukan Saran](https://github.com/andisec/SangMalas/issues)

</div>

---

## ✨ Tentang SangMalas

Mengatur margin, jenis huruf, ukuran teks, dan spasi satu per satu bisa menyita waktu—terutama saat dokumen harus mengikuti pedoman tertentu. **SangMalas membantu menyederhanakan pekerjaan tersebut.**

Aplikasi ini ditujukan untuk pelajar, mahasiswa, pengajar, dan pekerja yang ingin membuat dokumen lebih konsisten tanpa harus mengatur seluruh format secara manual.

## 🚀 Fitur

| Fitur | Keterangan |
|---|---|
| 🏫 **Preset format** | Pilihan format untuk kebutuhan SMP, SMA, perkuliahan, dan perkantoran. |
| 🎓 **Format dari dokumen contoh** | Unggah file `.docx` sebagai referensi agar SangMalas dapat membaca aturan format yang tersimpan di dalamnya, seperti margin, font, dan spasi. |
| 🔒 **Pemrosesan di browser** | File dokumen dibaca dan dibuat kembali di sisi browser; file `.docx` tidak perlu diunggah ke server aplikasi. |
| 🔓 **Tanpa login** | Gunakan aplikasi tanpa membuat akun atau memasukkan email. |
| 💚 **Gratis dan open source** | Kode sumber tersedia untuk dipelajari dan dikembangkan bersama. |
| ☕ **Dukungan QRIS** | Pengguna yang ingin mendukung pengembangan dapat menggunakan tombol **Beli Kopi** di aplikasi. |

## 🧭 Alur Penggunaan

1. **Pilih format** — gunakan preset yang tersedia atau siapkan dokumen contoh dari guru/dosen.
2. **Masukkan dokumen** — pilih dokumen `.docx` yang ingin dirapikan.
3. **Proses dokumen** — SangMalas membaca dokumen dan menerapkan pengaturan format yang dipilih di browser.
4. **Unduh hasil** — simpan dokumen `.docx` yang sudah diformat, lalu periksa kembali sebelum digunakan atau dikumpulkan.

> **Catatan:** Hasil akhir tetap sebaiknya diperiksa di Microsoft Word atau aplikasi pengolah dokumen lain. Tampilan dapat sedikit berbeda bergantung pada aplikasi, font yang tersedia, dan isi dokumen.

## 💻 Menjalankan Secara Lokal

SangMalas menggunakan teknologi web tanpa framework frontend yang berat. Kamu tidak perlu memasang Node.js atau menjalankan proses build untuk mencoba versi web. Cukup sediakan Git dan browser modern.

### 1. Clone repository

```bash
git clone https://github.com/andisec/SangMalas.git
cd SangMalas
```

### 2. Jalankan server lokal

**Windows**

Jalankan file berikut dari folder proyek:

```text
run.bat
```

Kamu juga dapat membukanya dengan klik dua kali `run.bat` melalui File Explorer.

**Linux / macOS**

```bash
chmod +x run.sh
./run.sh
```

### 3. Buka aplikasi

Setelah server berjalan, buka browser dan akses:

```text
http://localhost:8000
```

### Alternatif: menggunakan Python

Jika script otomatis tidak dapat dijalankan, gunakan server HTTP sederhana dari folder utama repository:

```bash
python3 -m http.server 8000 --directory web
```

Di Windows, perintahnya dapat dijalankan dengan:

```powershell
py -m http.server 8000 --directory web
```

Kemudian buka `http://localhost:8000`.

> Biarkan terminal tetap terbuka selama aplikasi digunakan. Untuk menghentikan server, tekan `Ctrl + C` pada terminal.

## 🛠️ Teknologi

SangMalas dibangun menggunakan JavaScript murni (*Vanilla JavaScript*) dan beberapa library yang memiliki tugas khusus:

| Teknologi | Peran |
|---|---|
| **HTML, CSS, Vanilla JavaScript** | Struktur, tampilan, dan interaksi aplikasi web. |
| [Mammoth.js](https://github.com/mwilliamson/mammoth.js) | Membantu mengekstrak konten teks dari dokumen `.docx`. |
| [docx](https://github.com/dolanmiu/docx) | Membuat dokumen `.docx` baru dengan pengaturan format yang ditentukan aplikasi. |
| [JSZip](https://stuk.github.io/jszip/) | Membaca struktur arsip `.docx` dan membantu mengakses berkas XML yang menyimpan informasi format. |
| **Google Apps Script** | Menangani pengiriman formulir saran pengguna ke Google Sheets. |
| **Capacitor** *(rencana pengembangan)* | Teknologi yang direncanakan untuk membungkus aplikasi web menjadi aplikasi Android. |

## 🔐 Privasi dan Data

Privasi dokumen merupakan salah satu prinsip utama SangMalas.

- **File `.docx` diproses di browser** sesuai rancangan aplikasi.
- **Dokumen yang diproses tidak dikirim ke server aplikasi** untuk menjalankan fungsi perapian.
- **Tidak memerlukan akun**, sehingga pengguna tidak perlu mendaftar untuk menggunakan fitur utama.
- **Formulir saran merupakan proses terpisah.** Saat formulir digunakan, informasi saran yang dikirim dapat diteruskan melalui Google Apps Script ke Google Sheets.

Keterangan ini membedakan pemrosesan dokumen dari pengiriman formulir saran. Tetap periksa informasi yang kamu masukkan ke dalam formulir dan jangan mengirim data pribadi yang tidak diperlukan.

## 📱 Status Android

Saat ini pengembangan difokuskan pada versi web. Versi Android dalam bentuk APK masih direncanakan/dikembangkan menggunakan Capacitor dan akan diumumkan melalui tab **Releases** setelah siap digunakan.

## 💡 Tips

- Gunakan file **`.docx`** sebagai dokumen masukan.
- Untuk format kustom, pilih dokumen contoh yang memang menggunakan format yang ingin ditiru.
- Pastikan dokumen contoh memiliki pengaturan halaman dan gaya teks yang sesuai dengan pedoman yang diminta.
- Setelah mengunduh hasil, buka kembali di Microsoft Word atau Google Docs dan periksa margin, font, spasi, tabel, serta nomor halaman.
- Jika dokumen memiliki daftar isi otomatis, perbarui daftar isi setelah perubahan halaman agar nomor halamannya sesuai.

## 🐛 Bug, Masukan, dan Kontribusi

Masukan sangat membantu untuk membuat SangMalas lebih baik. Saat menemukan masalah atau memiliki ide pengembangan:

1. Periksa apakah masalah yang sama sudah pernah dilaporkan.
2. Sertakan langkah untuk mereproduksi masalah, browser yang digunakan, dan hasil yang diharapkan.
3. Hindari melampirkan dokumen yang berisi informasi pribadi atau rahasia.

Kamu dapat menyampaikan masukan melalui [Issues di GitHub](https://github.com/andisec/SangMalas/issues). Kontribusi kode, dokumentasi, dan laporan bug yang jelas sangat diapresiasi.

## ☕ Dukung Pengembangan

SangMalas lahir dari ide sederhana: rasa malas mengatur format dokumen bisa diubah menjadi sesuatu yang produktif.

Jika aplikasi ini membantu pekerjaanmu, kamu dapat mendukung pengembang dengan menekan tombol **☕ Beli Kopi** di dalam aplikasi. Dukungan dilakukan secara sukarela melalui QRIS dan membantu pengembangan fitur berikutnya.

## 📄 Lisensi

SangMalas menggunakan **MIT License**. Lihat berkas `LICENSE` di repository untuk ketentuan penggunaan, modifikasi, dan distribusi.

---

<div align="center">

**Dibuat dengan 🍵, JavaScript, dan sedikit rasa malas.**

*Semoga waktumu lebih banyak untuk mengerjakan isi dokumen, bukan berantem dengan formatnya.*

</div>
