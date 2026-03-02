import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ExportService {

    /** Export an array of objects to a CSV file and trigger download */
    toCSV(data: any[], filename: string, columns?: { key: string; header: string }[]): void {
        if (!data?.length) return;

        const cols = columns || Object.keys(data[0]).map(k => ({ key: k, header: k }));
        const header = cols.map(c => `"${c.header}"`).join(',');
        const rows = data.map(row =>
            cols.map(c => {
                const val = this.getNestedValue(row, c.key);
                return `"${String(val ?? '').replace(/"/g, '""')}"`;
            }).join(',')
        );

        const csv = [header, ...rows].join('\r\n');
        this.download(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
    }

    private getNestedValue(obj: any, path: string): any {
        return path.split('.').reduce((acc, part) => acc?.[part], obj);
    }

    private download(content: string, filename: string, mimeType: string): void {
        const blob = new Blob(['\uFEFF' + content], { type: mimeType }); // BOM for Excel compatibility
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    /** Print specific element by ID */
    printElement(elementId: string): void {
        const el = document.getElementById(elementId);
        if (!el) return;
        const content = el.innerHTML;
        const win = window.open('', '_blank', 'width=900,height=700');
        if (!win) return;
        win.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            thead { background: #f4f4f4; }
            .no-print { display: none !important; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
        win.document.close();
        win.focus();
        win.print();
        win.close();
    }
}
