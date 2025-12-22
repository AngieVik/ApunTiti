import * as XLSX from "xlsx";
import { Shift, HourType } from "../types";
import { calculateDuration } from "./time";

/**
 * Genera y descarga un archivo Excel (.xlsx) con los turnos
 * @param shifts - Array de turnos a exportar
 * @param title - Título del reporte
 * @param hourTypes - Tipos de hora para calcular ganancias
 */
export const generateExcel = (
  shifts: Shift[],
  title: string,
  hourTypes: HourType[]
): void => {
  // Preparar datos para Excel
  const data = shifts.map((shift) => {
    const duration = calculateDuration(shift.startTime, shift.endTime);
    const hourType = hourTypes.find((ht) => ht.id === shift.hourTypeId);
    const earnings = hourType ? duration * hourType.price : 0;

    return {
      Fecha: shift.date,
      "Hora Inicio": shift.startTime,
      "Hora Fin": shift.endTime,
      Duración: `${duration.toFixed(2)}h`,
      Categoría: shift.category,
      "Tipo de Hora": hourType?.name || "Sin tipo",
      "Precio/Hora": hourType ? `${hourType.price}€` : "-",
      Ganancias: `${earnings.toFixed(2)}€`,
      Notas: shift.notes || "",
    };
  });

  // Crear hoja de cálculo
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Ajustar anchos de columna
  const columnWidths = [
    { wch: 12 }, // Fecha
    { wch: 10 }, // Hora Inicio
    { wch: 10 }, // Hora Fin
    { wch: 10 }, // Duración
    { wch: 15 }, // Categoría
    { wch: 15 }, // Tipo de Hora
    { wch: 12 }, // Precio/Hora
    { wch: 12 }, // Ganancias
    { wch: 30 }, // Notas
  ];
  worksheet["!cols"] = columnWidths;

  // Crear libro
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Turnos");

  // Añadir hoja de resumen
  const totalHours = shifts.reduce(
    (sum, shift) => sum + calculateDuration(shift.startTime, shift.endTime),
    0
  );
  const totalEarnings = shifts.reduce((sum, shift) => {
    const duration = calculateDuration(shift.startTime, shift.endTime);
    const hourType = hourTypes.find((ht) => ht.id === shift.hourTypeId);
    return sum + (hourType ? duration * hourType.price : 0);
  }, 0);

  const summaryData = [
    { Concepto: "Total Turnos", Valor: shifts.length },
    { Concepto: "Total Horas", Valor: `${totalHours.toFixed(2)}h` },
    { Concepto: "Total Ganancias", Valor: `${totalEarnings.toFixed(2)}€` },
  ];

  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  summarySheet["!cols"] = [{ wch: 20 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Resumen");

  // Generar nombre de archivo
  const fileName = `${title.replace(/\s+/g, "_")}_${
    new Date().toISOString().split("T")[0]
  }.xlsx`;

  // Descargar
  XLSX.writeFile(workbook, fileName);
};
