
export function download(element: string) {
    html2pdf(element, {
        margin: 10,
        filename: 'report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
        jsPDFL: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    });
}