/**
 * Formatter.js
 * Menggunakan docx.js untuk membuat file baru yang sudah diformat
 */
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "https://esm.sh/docx@8.5.0";
import { SMP_RULES } from './rules/smp.js';
import { SMA_RULES } from './rules/sma.js';
import { KULIAH_RULES } from './rules/kuliah.js';
import { KANTOR_RULES } from './rules/kantor.js';

const RULES_MAP = {
    smp: SMP_RULES,
    sma: SMA_RULES,
    kuliah: KULIAH_RULES,
    kantor: KANTOR_RULES
};

export async function formatDocument(parsedHtmlDiv, level, customRules = null) {
    // Tentukan aturan mana yang dipakai
    let rules;
    if (level === 'custom' && customRules) {
        rules = customRules;
    } else {
        rules = RULES_MAP[level];
    }

    const paragraphs = [];
    const elements = parsedHtmlDiv.children;

    for (let el of elements) {
        let text = el.textContent.trim();
        if (!text) continue;

        let isHeading = el.tagName.match(/^H[1-6]$/);

        if (isHeading) {
            paragraphs.push(
                new Paragraph({
                    alignment: rules.heading1.align === "center" ? AlignmentType.CENTER : AlignmentType.LEFT,
                    spacing: rules.heading1.spacing,
                    children: [
                        new TextRun({
                            text: text,
                            bold: rules.heading1.bold,
                            font: rules.font,
                            size: rules.heading1.size,
                        }),
                    ],
                })
            );
        } else {
            paragraphs.push(
                new Paragraph({
                    alignment: rules.paragraph.align === "both" ? AlignmentType.JUSTIFIED : AlignmentType.LEFT,
                    spacing: { line: rules.spacing },
                    indent: { firstLine: rules.paragraph.indent },
                    children: [
                        new TextRun({
                            text: text,
                            font: rules.font,
                            size: rules.fontSize,
                        }),
                    ],
                })
            );
        }
    }

    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: rules.margins.top,
                        right: rules.margins.right,
                        bottom: rules.margins.bottom,
                        left: rules.margins.left,
                    },
                },
            },
            children: paragraphs,
        }],
    });

    return await Packer.toBlob(doc);
}