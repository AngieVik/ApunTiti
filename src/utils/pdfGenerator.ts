import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Shift, HourType } from "../types";

// Helper to calculate duration (duplicated from CalendarView, could be centralized)
const calculateDuration = (start: string, end: string) => {
  const s = parseInt(start.split(":")[0]) + parseInt(start.split(":")[1]) / 60;
  const e = parseInt(end.split(":")[0]) + parseInt(end.split(":")[1]) / 60;
  if (e < s) return 24 - s + e;
  return e - s;
};

export const generatePDF = (
  shifts: Shift[],
  title: string,
  hourTypes: HourType[]
) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(40, 40, 40);
  doc.text("ApunTiti - Reporte de Turnos", 14, 20);

  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text(title, 14, 30);

  doc.setFontSize(10);
  doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 38);

  // Totals Calculation
  let totalHours = 0;
  let totalMoney = 0;
  const categorySummary: Record<string, number> = {};

  const tableData = shifts.map((shift) => {
    const duration = calculateDuration(shift.startTime, shift.endTime);
    totalHours += duration;

    let typeName = "-";
    let price = 0;

    if (shift.hourTypeId) {
      const hType = hourTypes.find((h) => h.id === shift.hourTypeId);
      if (hType) {
        typeName = hType.name;
        price = hType.price;
        totalMoney += duration * price;
      }
    }

    categorySummary[shift.category] =
      (categorySummary[shift.category] || 0) + duration;

    const earnings = price > 0 ? `${(duration * price).toFixed(2)}€` : "-";

    return [
      shift.date,
      shift.startTime,
      shift.endTime,
      duration.toFixed(2) + "h",
      shift.category,
      typeName,
      earnings,
      shift.notes || "",
    ];
  });

  // Table
  autoTable(doc, {
    startY: 45,
    head: [
      [
        "Fecha",
        "Inicio",
        "Fin",
        "Duración",
        "Categoría",
        "Tipo",
        "Valor",
        "Notas",
      ],
    ],
    body: tableData,
    headStyles: { fillColor: [234, 179, 8], textColor: 255 }, // Yellow-500 equivalent
    alternateRowStyles: { fillColor: [245, 245, 245] },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 15 },
      2: { cellWidth: 15 },
      3: { cellWidth: 18, halign: "right" },
      6: { cellWidth: 20, halign: "right" },
      7: { cellWidth: "auto" }, // Notes expand
    },
  });

  // Summary Section
  const finalY = (doc as any).lastAutoTable.finalY + 15;

  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text("Resumen", 14, finalY);

  doc.setFontSize(11);
  doc.text(`Total Horas: ${totalHours.toFixed(2)}h`, 14, finalY + 8);
  if (totalMoney > 0) {
    doc.text(`Total Ganancias: ${totalMoney.toFixed(2)}€`, 14, finalY + 15);
  }

  // Category Breakdown
  // Only show if there's enough space, simple check
  if (finalY + 30 < 280) {
    doc.text("Por Categoría:", 100, finalY + 8);
    let catY = finalY + 15;
    Object.entries(categorySummary).forEach(([cat, hours]) => {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`${cat}: ${hours.toFixed(2)}h`, 100, catY);
      catY += 5;
    });
  }

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
};
