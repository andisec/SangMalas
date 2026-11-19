/**
 * SangMalas - Main Script
 * Menangani navigasi, modal, upload, parsing (mammoth), formatting (docx), dan feedback.
 */

import { parseDocx } from './parser.js';
import { formatDocument } from './formatter.js';
import { initFeedbackForm } from './feedback.js';
import { extractCustomRules } from './template-parser.js'; // Import parser custom

document.addEventListener('DOMContentLoaded', () => {
    
    // ============ 1. SETUP TAHUN OTOMATIS ============
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ============ 2. NAVIGASI ANTAR LAYAR (SPA) ============
    const screens = document.querySelectorAll('.screen');
    const navButtons = document.querySelectorAll('[data-nav]');

    function showScreen(screenName) {
        screens.forEach(screen => screen.classList.remove('screen--active'));
        const targetScreen = document.getElementById(`screen-${screenName}`);
        if (targetScreen) {
            targetScreen.classList.add('screen--active');
            window.scrollTo(0, 0);
        }
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-nav') === screenName) {
                btn.classList.add('active');
            }
        });
    }

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.getAttribute('data-nav');
            showScreen(target);
        });
    });

    // ============ 3. LOGIKA MODAL QRIS ============
    const btnDonate = document.getElementById('btn-donate');
    const qrisModal = document.getElementById('qris-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');

    function openModal() { if (qrisModal) qrisModal.removeAttribute('hidden'); }
    function closeModal() { if (qrisModal) qrisModal.setAttribute('hidden', 'true'); }

    if (btnDonate) btnDonate.addEventListener('click', openModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && qrisModal && !qrisModal.hasAttribute('hidden')) closeModal();
    });

    // ============ 4. LOGIKA UPLOAD & PILIH TINGKAT ============
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    const btnBrowse = document.getElementById('btn-browse');
    const fileInfo = document.getElementById('file-info');
    const fileNameEl = document.getElementById('file-name');
    const fileSizeEl = document.getElementById('file-size');
    const btnRemoveFile = document.getElementById('btn-remove-file');
    const btnProcess = document.getElementById('btn-process');
    const levelCards = document.querySelectorAll('.level-card');

    let selectedFile = null;
    let selectedLevel = null;
    let generatedBlob = null; 
    
    // State untuk Custom Template
    let customTemplateFile = null;
    let customRulesData = null;

    // --- Upload Dokumen Utama ---
    btnBrowse.addEventListener('click', () => fileInput.click());

    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('upload-zone--drag');
    });
    uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('upload-zone--drag'));
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('upload-zone--drag');
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });

    function handleFile(file) {
        if (!file.name.endsWith('.docx')) {
            alert('Hanya file .docx yang didukung untuk saat ini.');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            alert('File terlalu besar! Maksimal 10 MB.');
            return;
        }
        selectedFile = file;
        fileNameEl.textContent = file.name;
        fileSizeEl.textContent = (file.size / 1024 / 1024).toFixed(2) + ' MB';
        fileInfo.removeAttribute('hidden');
        uploadZone.style.display = 'none';
        checkReadyToProcess();
    }

    btnRemoveFile.addEventListener('click', () => {
        selectedFile = null;
        generatedBlob = null;
        fileInput.value = ''; 
        fileInfo.setAttribute('hidden', 'true');
        uploadZone.style.display = 'block';
        checkReadyToProcess();
    });

    // --- Pilih Tingkatan & Custom Template ---
    const customArea = document.getElementById('custom-template-area');
    const btnBrowseTemplate = document.getElementById('btn-browse-template');
    const templateInput = document.getElementById('template-input');
    const templateStatus = document.getElementById('template-status');

    levelCards.forEach(card => {
        card.addEventListener('click', () => {
            levelCards.forEach(c => {
                c.classList.remove('level-card--selected');
                c.setAttribute('aria-checked', 'false');
            });
            card.classList.add('level-card--selected');
            card.setAttribute('aria-checked', 'true');
            selectedLevel = card.getAttribute('data-level');
            
            // Tampilkan/sembunyikan area upload template
            if (selectedLevel === 'custom') {
                customArea.style.display = 'block';
            } else {
                customArea.style.display = 'none';
            }
            checkReadyToProcess();
        });
    });

    btnBrowseTemplate.addEventListener('click', () => templateInput.click());

    templateInput.addEventListener('change', async (e) => {
        if (e.target.files.length) {
            customTemplateFile = e.target.files[0];
            templateStatus.textContent = "⏳ Membaca format...";
            templateStatus.style.color = "#D97706";
            
            try {
                customRulesData = await extractCustomRules(customTemplateFile);
                templateStatus.textContent = "✅ Format berhasil dibaca!";
                templateStatus.style.color = "#10B981";
                checkReadyToProcess();
            } catch (error) {
                templateStatus.textContent = "❌ Gagal membaca format file.";
                templateStatus.style.color = "red";
                customTemplateFile = null;
                customRulesData = null;
                checkReadyToProcess();
            }
        }
    });

    function checkReadyToProcess() {
        let isReady = selectedFile && selectedLevel;
        if (selectedLevel === 'custom') {
            isReady = isReady && customRulesData !== null;
        }

        if (isReady) {
            btnProcess.removeAttribute('disabled');
        } else {
            btnProcess.setAttribute('disabled', 'true');
        }
    }

    // ============ 5. PROSES DOKUMEN (PARSING & FORMATTING) ============
    btnProcess.addEventListener('click', async () => {
        if (!selectedFile || !selectedLevel) return;

        generatedBlob = null;
        showScreen('loading');
        
        const statusText = document.getElementById('loading-status');
        const progressFill = document.getElementById('progress-fill');
        
        try {
            // Step 1: Parsing
            statusText.textContent = 'Membaca struktur file dokumen...';
            progressFill.style.width = '30%';
            const parsedContent = await parseDocx(selectedFile);

            // Step 2: Formatting
            statusText.textContent = `Menerapkan format ${selectedLevel.toUpperCase()}...`;
            progressFill.style.width = '70%';
            generatedBlob = await formatDocument(parsedContent, selectedLevel, customRulesData);

            // Step 3: Selesai
            statusText.textContent = 'Menyelesaikan dokumen...';
            progressFill.style.width = '100%';

            setTimeout(() => {
                const summaryList = document.getElementById('summary-list');
                let targetName = selectedLevel === 'custom' ? 'Kustom (Dosen/Guru)' : selectedLevel.toUpperCase();
                summaryList.innerHTML = `
                    <li>✅ File berhasil dibaca dan di-ekstrak.</li>
                    <li>✅ Format ${targetName} berhasil diterapkan.</li>
                    <li>✅ Margin, font, dan spasi telah disesuaikan.</li>
                `;
                showScreen('preview');
            }, 500);

        } catch (error) {
            console.error("Error Processing Document:", error);
            alert('Gagal memproses dokumen. Pastikan format file .docx valid dan tidak corrupt.');
            showScreen('upload');
            progressFill.style.width = '0%';
        }
    });

    // ============ 6. DOWNLOAD FILE DOCX ============
    const btnDownloadDocx = document.getElementById('btn-download-docx');
    
    btnDownloadDocx.addEventListener('click', () => {
        if (!generatedBlob) {
            alert("File belum siap.");
            return;
        }
        
        const originalName = selectedFile.name.replace('.docx', '');
        const newFileName = `SangMalas_${selectedLevel.toUpperCase()}_${originalName}.docx`;

        const url = window.URL.createObjectURL(generatedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = newFileName;
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    });

    // ============ 7. INISIALISASI FITUR LAIN ============
    initFeedbackForm();
    showScreen('home');
});