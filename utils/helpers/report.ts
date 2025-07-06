export function exportToCsv(filename: string, rows: any[], headers: string[], headerLabels?: string[]) {
  if (!rows.length) return
  const csvContent =
    (headerLabels ? headerLabels : headers).join(",") +
    "\n" +
    rows
      .map(row =>
        headers.map(field => {
          let val = row[field]
          if (typeof val === "string" && (val.includes(",") || val.includes('"'))) {
            val = `"${val.replace(/"/g, '""')}"`
          }
          return val
        }).join(",")
      )
      .join("\n")
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}