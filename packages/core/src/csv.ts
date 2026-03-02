export function arrayToCSV(data: any[], headers?: string[]): string {
  if (data.length === 0) {
    return '';
  }

  let csv = '';

  if (headers && headers.length) {
    csv += headers.join(',') + '\n';
  } else {
    const first = data[0];
    if (typeof first === 'object' && first !== null) {
      csv += Object.keys(first).join(',') + '\n';
    }
  }

  data.forEach((row) => {
    if (typeof row === 'object' && row !== null) {
      const values = Object.values(row).map((v) => {
        const str = String(v).replace(/"/g, '""');
        if (str.search(/\,|\n|\"/) >= 0) {
          return `"${str}"`;
        }
        return str;
      });
      csv += values.join(',') + '\n';
    } else {
      csv += `${row}\n`;
    }
  });

  return csv;
}

export function downloadCSV(csv: string, filename = 'export.csv') {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
