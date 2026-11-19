/**
 * SangMalas - Backend Saran Pengguna
 */
function doPost(e) {
  try {
    const params = e.parameter;
    
    // 1. Cek Honeypot (Anti-Bot)
    if (params.website && params.website.trim() !== "") {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Bot detected" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Validasi input
    const pesan = params.pesan ? params.pesan.trim() : "";
    if (pesan.length < 5 || pesan.length > 1000) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Pesan tidak valid" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 3. Siapkan data
    const timestamp = new Date();
    const nama = params.nama ? params.nama.trim() : "Anonim";
    const jenis = params.jenis || "saran";
    
    // 4. GANTI DENGAN SPREADSHEET ID KAMU (dari Langkah 1)
    const SPREADSHEET_ID = "MASUKKAN_ID_SPREADSHEET_KAMU_DI_SINI"; 
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    
    // 5. Tulis ke Google Spreadsheet
    sheet.appendRow([timestamp, nama, jenis, pesan]);

    // 6. Kembalikan respons sukses
    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Saran diterima" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}