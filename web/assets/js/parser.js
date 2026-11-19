/**
 * Parser.js
 * Menggunakan mammoth.js untuk mengekstrak konten dari file .docx
 */
export async function parseDocx(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                const arrayBuffer = e.target.result;
                
                // Konversi docx ke HTML menggunakan mammoth
                // (Pastikan library mammoth sudah di-load di index.html)
                const result = await window.mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
                
                // Kita ubah string HTML menjadi DOM element agar mudah di-looping
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = result.value;
                
                resolve(tempDiv);
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
}