/**
 * template-parser.js
 * Membaca format (margin, font, spasi) dari file docx contoh.
 */
export async function extractCustomRules(file) {
    const zip = await JSZip.loadAsync(file);
    
    // 1. Ambil document.xml untuk baca margin halaman (sectPr)
    const docXml = await zip.file("word/document.xml").async("string");
    
    // Default rules (jika gagal deteksi)
    let rules = {
        name: "Custom",
        font: "Times New Roman",
        fontSize: 24, // 12pt
        spacing: 360, // 1.5
        margins: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // Default 1 inch
        heading1: { size: 28, bold: true, align: "center", spacing: { before: 240, after: 240 } },
        paragraph: { align: "both", indent: 720 }
    };

    try {
        // Regex untuk mencari margin di XML (w:pgMar)
        const pgMarMatch = docXml.match(/<w:pgMar[^>]*w:top="(\d+)"[^>]*w:right="(\d+)"[^>]*w:bottom="(\d+)"[^>]*w:left="(\d+)"/);
        if (pgMarMatch) {
            rules.margins = {
                top: parseInt(pgMarMatch[1]),
                right: parseInt(pgMarMatch[2]),
                bottom: parseInt(pgMarMatch[3]),
                left: parseInt(pgMarMatch[4])
            };
        }

        // Regex untuk mencari default font size (w:sz)
        const szMatch = docXml.match(/<w:sz w:val="(\d+)"\/>/);
        if (szMatch) rules.fontSize = parseInt(szMatch[1]);

        // Regex untuk mencari font family (w:rFonts)
        const fontMatch = docXml.match(/<w:rFonts[^>]*w:ascii="([^"]+)"/);
        if (fontMatch) rules.font = fontMatch[1];

        // Cari spasi baris (w:spacing line)
        const spacingMatch = docXml.match(/<w:spacing[^>]*w:line="(\d+)"/);
        if (spacingMatch) rules.spacing = parseInt(spacingMatch[1]);

    } catch (e) {
        console.warn("Gagal mendeteksi format spesifik, pakai default.");
    }

    return rules;
}