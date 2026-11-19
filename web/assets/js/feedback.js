/**
 * Feedback.js
 * Mengirim data saran ke Google Apps Script
 */

// GANTI URL INI dengan URL Web App dari hasil deploy Apps Script kamu
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz2NRZPUNZoLFaggr9zq5LAIkzICxGbzOkXPelwGkG1L3U2A58OetforYp0D7tZ8GM/exec";

export function initFeedbackForm() {
    const form = document.getElementById('feedback-form');
    const statusEl = document.getElementById('form-status');
    const btnSubmit = document.getElementById('btn-submit-feedback');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Ambil data form
        const formData = new FormData(form);
        const data = new URLSearchParams(formData);

        // Update UI state
        btnSubmit.disabled = true;
        btnSubmit.textContent = "Mengirim...";
        statusEl.textContent = "";
        statusEl.style.color = "inherit";

        try {
            // Kirim ke Apps Script (pakai form-urlencoded agar tidak kena CORS preflight)
            const response = await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: data.toString()
            });

            const result = await response.json();

            if (result.status === 'success') {
                statusEl.textContent = "Terima kasih! Saranmu sudah terkirim.";
                statusEl.style.color = "#10B981"; // Hijau
                form.reset();
                document.getElementById('char-count').textContent = "0";
            } else {
                throw new Error(result.message || "Gagal mengirim.");
            }

        } catch (error) {
            console.error("Feedback Error:", error);
            statusEl.textContent = "Gagal mengirim saran. Coba lagi nanti.";
            statusEl.style.color = "red";
        } finally {
            // Kembalikan state tombol
            btnSubmit.disabled = false;
            btnSubmit.textContent = "Kirim Saran";
        }
    });
}