import { z } from "zod";

/**
 * Schema de validación para un Shift (turno)
 */
export const ShiftSchema = z
  .object({
    id: z.string().uuid().optional(), // Optional porque se genera automáticamente
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "La fecha debe estar en formato YYYY-MM-DD",
    }),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, {
      message: "La hora de inicio debe estar en formato HH:MM",
    }),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, {
      message: "La hora de fin debe estar en formato HH:MM",
    }),
    category: z.string().min(1, {
      message: "La categoría es requerida",
    }),
    notes: z.string().optional(),
    hourTypeId: z.string().optional(),
  })
  .refine(
    (data) => {
      // Validar que endTime > startTime (considerando turnos overnight)
      const [startH, startM] = data.startTime.split(":").map(Number);
      const [endH, endM] = data.endTime.split(":").map(Number);
      const startMins = startH * 60 + startM;
      const endMins = endH * 60 + endM;

      // Permitir turnos overnight (endMins < startMins está ok)
      // Solo rechazar si son exactamente iguales
      return startMins !== endMins;
    },
    {
      message: "La hora de inicio y fin no pueden ser iguales",
      path: ["endTime"],
    }
  );

/**
 * Schema para crear un nuevo shift (sin ID)
 */
export const CreateShiftSchema = ShiftSchema.omit({ id: true });

/**
 * Schema de validación para un HourType
 */
export const HourTypeSchema = z.object({
  id: z.string().min(1, {
    message: "El ID es requerido",
  }),
  name: z
    .string()
    .min(1, {
      message: "El nombre es requerido",
    })
    .max(50, {
      message: "El nombre no puede exceder 50 caracteres",
    }),
  price: z
    .number()
    .nonnegative({
      message: "El precio debe ser positivo",
    })
    .max(1000, {
      message: "El precio no puede exceder 1000",
    }),
});

/**
 * Schema de validación para Settings
 */
export const SettingsSchema = z.object({
  categories: z
    .array(
      z
        .string()
        .min(1, {
          message: "El nombre de categoría no puede estar vacío",
        })
        .max(30, {
          message: "El nombre de categoría no puede exceder 30 caracteres",
        })
    )
    .min(1, {
      message: "Debe haber al menos una categoría",
    })
    .max(20, {
      message: "No pueden haber más de 20 categorías",
    }),
  hourTypes: z
    .array(HourTypeSchema)
    .min(1, {
      message: "Debe haber al menos un tipo de hora",
    })
    .max(10, {
      message: "No pueden haber más de 10 tipos de hora",
    }),
  downloadFormat: z.enum(["txt", "pdf"], {
    message: "El formato debe ser txt o pdf",
  }),
  pushEnabled: z.boolean(),
});

/**
 * Schema para validar datos de backup
 */
export const BackupDataSchema = z.object({
  version: z.number().int().positive().optional(),
  date: z.string().optional(),
  shifts: z.array(ShiftSchema).optional(),
  settings: SettingsSchema.optional(),
});

// Type inference para usar en TypeScript
export type ShiftInput = z.infer<typeof CreateShiftSchema>;
export type HourTypeInput = z.infer<typeof HourTypeSchema>;
export type SettingsInput = z.infer<typeof SettingsSchema>;
export type BackupDataInput = z.infer<typeof BackupDataSchema>;
