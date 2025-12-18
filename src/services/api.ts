import { BackupData } from "../types";

export interface SyncResult {
  success: boolean;
  message: string;
  timestamp?: string;
}

export const MockSyncService = {
  sync: async (data: BackupData): Promise<SyncResult> => {
    // Simulate network delay
    return new Promise((resolve) => {
      console.log("Initiating sync...", data);

      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate

        if (success) {
          console.log("Sync successful");
          resolve({
            success: true,
            message: "Sincronización completada correctamente",
            timestamp: new Date().toISOString(),
          });
        } else {
          console.error("Sync failed");
          resolve({
            success: false,
            message: "Error de conexión con el servidor",
          });
        }
      }, 2000);
    });
  },
};
