import React, { useState, useRef } from "react";
import { HourType, BackupData } from "../types";
import { Card, Button, Input, Select } from "./UI";
import {
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
} from "./Icons";
import { APP_STYLES } from "../theme/styles";
import {
  requestNotificationPermission,
  sendLocalNotification,
} from "../utils/notifications";

import { useAppStore } from "../store/useAppStore";

export const SettingsView: React.FC = () => {
  // Store
  const settings = useAppStore((state) => state.settings);
  const { updateSettings, notify, sync, syncStatus } = useAppStore(); // mapped to setSettings name
  const shifts = useAppStore((state) => state.shifts);
  const setShifts = useAppStore((state) => state.setShifts);

  // Alias for compatibility with existing code
  const setSettings = updateSettings;
  const [newCategory, setNewCategory] = useState("");
  const [newHourName, setNewHourName] = useState("");
  const [newHourPrice, setNewHourPrice] = useState("");

  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [tempCategoryName, setTempCategoryName] = useState("");

  const [editingHourId, setEditingHourId] = useState<string | null>(null);
  const [tempHourName, setTempHourName] = useState("");
  const [tempHourPrice, setTempHourPrice] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- CATEGORY HANDLERS ---
  const handleAddCategory = () => {
    if (newCategory && !settings.categories.includes(newCategory)) {
      setSettings((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory],
      }));
      setNewCategory("");
      notify("Categoría añadida", "success");
    }
  };

  const handleRemoveCategory = (catToRemove: string) => {
    setSettings((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== catToRemove),
    }));
    notify("Categoría eliminada", "info");
  };

  const startEditCategory = (cat: string) => {
    setEditingCategory(cat);
    setTempCategoryName(cat);
  };

  const saveEditCategory = () => {
    if (tempCategoryName && tempCategoryName !== editingCategory) {
      setSettings((prev) => ({
        ...prev,
        categories: prev.categories.map((c) =>
          c === editingCategory ? tempCategoryName : c
        ),
      }));
      notify("Categoría actualizada", "success");
    }
    setEditingCategory(null);
  };

  const cancelEditCategory = () => {
    setEditingCategory(null);
  };

  // --- HOUR TYPE HANDLERS ---
  const handleAddHourType = () => {
    if (newHourName && newHourPrice) {
      const price = parseFloat(newHourPrice);
      if (isNaN(price)) return;

      const newType: HourType = {
        id: crypto.randomUUID(),
        name: newHourName,
        price: price,
      };

      setSettings((prev) => ({
        ...prev,
        hourTypes: [...(prev.hourTypes || []), newType],
      }));
      setNewHourName("");
      setNewHourPrice("");
      notify("Tipo de hora añadido", "success");
    }
  };

  const handleRemoveHourType = (id: string) => {
    // if (settings.hourTypes.length <= 1) {
    //   alert("Debe haber al menos un tipo de hora.");
    //   return;
    // }
    setSettings((prev) => ({
      ...prev,
      hourTypes: prev.hourTypes.filter((h) => h.id !== id),
    }));
    notify("Tipo de hora eliminado", "info");
  };

  const startEditHour = (type: HourType) => {
    setEditingHourId(type.id);
    setTempHourName(type.name);
    setTempHourPrice(type.price.toString());
  };

  const saveEditHour = () => {
    const price = parseFloat(tempHourPrice);
    if (tempHourName && !isNaN(price)) {
      setSettings((prev) => ({
        ...prev,
        hourTypes: prev.hourTypes.map((h) =>
          h.id === editingHourId
            ? { ...h, name: tempHourName, price: price }
            : h
        ),
      }));
      notify("Tipo de hora actualizado", "success");
    }
    setEditingHourId(null);
  };

  const cancelEditHour = () => {
    setEditingHourId(null);
  };

  // --- BACKUP HANDLERS ---
  const handleExport = () => {
    const backupData: BackupData = {
      version: 1,
      date: new Date().toISOString(),
      shifts: shifts,
      settings: settings,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup_apuntahoras_${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    notify("Copia de seguridad descargada", "success");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as BackupData;

        if (data.shifts && Array.isArray(data.shifts)) {
          setShifts(data.shifts);
        }
        if (data.settings && data.settings.categories) {
          setSettings(data.settings);
        }
        notify("Datos restaurados correctamente", "success");
      } catch (error) {
        console.error(error);
        notify("Error al leer el archivo de copia de seguridad", "error");
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = "";
  };

  return (
    <div className={APP_STYLES.CONFIGURACIÓN.container}>
      {/* General Settings Card */}
      <Card className={APP_STYLES.CONFIGURACIÓN.generalCard}>
        <h2 className={APP_STYLES.CONFIGURACIÓN.sectionTitle}>General</h2>
        <Select
          label="Formato de Guardado"
          value={settings.downloadFormat}
          onChange={(e) => {
            setSettings((prev) => ({
              ...prev,
              downloadFormat: e.target.value as "txt" | "pdf",
            }));
            notify("Formato actualizado", "info");
          }}
        >
          <option value="txt">Texto (.txt)</option>
          <option value="pdf">Documento (.pdf)</option>
        </Select>

        <div className="mt-2">
          <Select
            label="Notificaciones"
            value={settings.pushEnabled ? "enabled" : "disabled"}
            onChange={async (e) => {
              const value = e.target.value === "enabled";
              if (value) {
                const granted = await requestNotificationPermission();
                if (granted) {
                  updateSettings((prev) => ({ ...prev, pushEnabled: true }));
                  notify("Notificaciones activadas", "success");
                  sendLocalNotification("ApunTiti", "Notificaciones activadas");
                } else {
                  notify("Permiso denegado por el navegador", "error");
                }
              } else {
                updateSettings((prev) => ({ ...prev, pushEnabled: false }));
                notify("Notificaciones desactivadas", "info");
              }
            }}
          >
            <option value="disabled">Desactivadas</option>
            <option value="enabled">Activadas</option>
          </Select>
        </div>
      </Card>

      {/* CATEGORIES CARD */}
      <Card className={APP_STYLES.CONFIGURACIÓN.categoriesCard}>
        <h2 className={APP_STYLES.CONFIGURACIÓN.sectionTitle}>Categorías</h2>

        {/* Formulario unificado con Grid */}
        <div className={APP_STYLES.CONFIGURACIÓN.categoriesFormGrid}>
          <Input
            label="Nueva Categoría"
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
            placeholder="Ej: Vacaciones"
          />
          <Button onClick={handleAddCategory}>Añadir</Button>
        </div>

        <ul className={APP_STYLES.CONFIGURACIÓN.categoriesList}>
          {settings.categories.map((cat) => (
            <li key={cat} className={APP_STYLES.CONFIGURACIÓN.categoryItem}>
              {editingCategory === cat ? (
                <div className={APP_STYLES.CONFIGURACIÓN.categoryEditContainer}>
                  <input
                    className={APP_STYLES.CONFIGURACIÓN.categoryEditInput}
                    value={tempCategoryName}
                    onChange={(e) => setTempCategoryName(e.target.value)}
                    autoFocus
                  />
                  <button
                    onClick={saveEditCategory}
                    className={APP_STYLES.CONFIGURACIÓN.categoryEditSave}
                  >
                    <CheckIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={cancelEditCategory}
                    className={APP_STYLES.CONFIGURACIÓN.categoryEditCancel}
                  >
                    <XMarkIcon className={APP_STYLES.MODOS.iconSmall} />
                  </button>
                </div>
              ) : (
                <>
                  <span className={APP_STYLES.CONFIGURACIÓN.categoryName}>
                    {cat}
                  </span>
                  <div className={APP_STYLES.CONFIGURACIÓN.categoryActions}>
                    <button
                      onClick={() => startEditCategory(cat)}
                      className={APP_STYLES.CONFIGURACIÓN.categoryEditButton}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveCategory(cat)}
                      className={APP_STYLES.CONFIGURACIÓN.categoryDeleteButton}
                    >
                      <TrashIcon className={APP_STYLES.MODOS.iconContent} />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </Card>

      {/* HOUR TYPES CARD */}
      <Card className={APP_STYLES.CONFIGURACIÓN.hourTypesCard}>
        <h2 className={APP_STYLES.CONFIGURACIÓN.sectionTitle}>Tipos de Hora</h2>

        {/* Formulario unificado con Grid - Responsive: Stack en móvil, fila en desktop */}
        <div className={APP_STYLES.CONFIGURACIÓN.hourTypesFormGrid}>
          <Input
            label="Nombre"
            type="text"
            value={newHourName}
            onChange={(e) => setNewHourName(e.target.value)}
            placeholder="Ej: Festivo"
          />
          <Input
            label="Precio (€)"
            type="number"
            value={newHourPrice}
            onChange={(e) => setNewHourPrice(e.target.value)}
            placeholder="0.00"
          />
          <Button onClick={handleAddHourType}>Añadir</Button>
        </div>

        <ul className={APP_STYLES.CONFIGURACIÓN.hourTypesList}>
          {(settings.hourTypes || []).map((type) => (
            <li key={type.id} className={APP_STYLES.CONFIGURACIÓN.hourTypeItem}>
              {editingHourId === type.id ? (
                <div className={APP_STYLES.CONFIGURACIÓN.hourTypeEditContainer}>
                  <input
                    className={APP_STYLES.CONFIGURACIÓN.hourTypeEditNameInput}
                    value={tempHourName}
                    onChange={(e) => setTempHourName(e.target.value)}
                    placeholder="Nombre"
                    autoFocus
                  />
                  <input
                    className={APP_STYLES.CONFIGURACIÓN.hourTypeEditPriceInput}
                    value={tempHourPrice}
                    onChange={(e) => setTempHourPrice(e.target.value)}
                    placeholder="Precio"
                    type="number"
                  />
                  <button
                    onClick={saveEditHour}
                    className={APP_STYLES.CONFIGURACIÓN.hourTypeEditSave}
                  >
                    <CheckIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={cancelEditHour}
                    className={APP_STYLES.CONFIGURACIÓN.hourTypeEditCancel}
                  >
                    <XMarkIcon className={APP_STYLES.MODOS.iconSmall} />
                  </button>
                </div>
              ) : (
                <>
                  <div className={APP_STYLES.CONFIGURACIÓN.hourTypeDisplay}>
                    <span className={APP_STYLES.CONFIGURACIÓN.hourTypeName}>
                      {type.name}
                    </span>
                    <span className={APP_STYLES.CONFIGURACIÓN.hourTypePrice}>
                      {type.price}€
                    </span>
                  </div>
                  <div className={APP_STYLES.CONFIGURACIÓN.hourTypeActions}>
                    <button
                      onClick={() => startEditHour(type)}
                      className={APP_STYLES.CONFIGURACIÓN.hourTypeEditButton}
                    >
                      <PencilIcon className={APP_STYLES.MODOS.iconContent} />
                    </button>
                    <button
                      onClick={() => handleRemoveHourType(type.id)}
                      className={APP_STYLES.CONFIGURACIÓN.hourTypeDeleteButton}
                    >
                      <TrashIcon className={APP_STYLES.MODOS.iconContent} />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </Card>
      {/* BACKUP CARD */}
      <Card className={APP_STYLES.CONFIGURACIÓN.backupCard}>
        <h2 className={APP_STYLES.CONFIGURACIÓN.sectionTitle}>
          Copia de Seguridad
        </h2>
        <p className={APP_STYLES.CONFIGURACIÓN.sectionDesc}>
          Exporta tus datos para no perderlos si borras la caché o cambias de
          dispositivo.
        </p>
        <div className={APP_STYLES.CONFIGURACIÓN.backupGrid}>
          <Button
            onClick={handleExport}
            className={APP_STYLES.CONFIGURACIÓN.backupButtonContainer}
          >
            <span className={APP_STYLES.CONFIGURACIÓN.backupButtonText}>
              Exportar Datos
            </span>
          </Button>
          <Button
            variant="secondary"
            onClick={handleImportClick}
            className={APP_STYLES.CONFIGURACIÓN.backupButtonContainer}
          >
            <ArrowPathIcon className={APP_STYLES.MODOS.iconSmall} />
            <span className={APP_STYLES.CONFIGURACIÓN.backupButtonText}>
              Importar Datos
            </span>
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json"
            className={APP_STYLES.CONFIGURACIÓN.fileInputHidden}
          />
        </div>
      </Card>

      {/* SYNC CARD */}
      <Card className={APP_STYLES.CONFIGURACIÓN.backupCard}>
        <div className="flex justify-between items-center mb-2">
          <h2 className={APP_STYLES.CONFIGURACIÓN.sectionTitle}>
            Sincronización Nube
          </h2>
          {syncStatus === "syncing" && (
            <span
              className={`${APP_STYLES.MODOS.textYellow} text-sm ${APP_STYLES.MODOS.animateSpin}`}
            >
              Sincronizando...
            </span>
          )}
          {syncStatus === "success" && (
            <span className={`${APP_STYLES.MODOS.textGreen} text-sm`}>
              Sincronizado
            </span>
          )}
          {syncStatus === "error" && (
            <span className={`${APP_STYLES.MODOS.textRed} text-sm`}>Error</span>
          )}
        </div>

        <p className={APP_STYLES.CONFIGURACIÓN.sectionDesc}>
          Simula la sincronización de tus datos con un servidor remoto.
        </p>
        <div className={APP_STYLES.CONFIGURACIÓN.backupGrid}>
          <Button
            onClick={() => sync()}
            disabled={syncStatus === "syncing"}
            className={APP_STYLES.CONFIGURACIÓN.backupButtonContainer}
          >
            <ArrowPathIcon
              className={
                syncStatus === "syncing"
                  ? `${APP_STYLES.MODOS.animateSpin} ${APP_STYLES.MODOS.iconSmall}`
                  : APP_STYLES.MODOS.iconSmall
              }
            />
            <span className={APP_STYLES.CONFIGURACIÓN.backupButtonText}>
              {syncStatus === "syncing"
                ? "Sincronizando..."
                : "Sincronizar Ahora"}
            </span>
          </Button>
        </div>
      </Card>
    </div>
  );
};
