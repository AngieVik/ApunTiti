import React, { useState, useRef, useEffect } from "react";
import { HourType, BackupData, COLOR_THEMES } from "../types";
import { Card, Button, Input, Select, ConfirmDialog } from "./UI";
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
import { HourTypeSchema, BackupDataSchema } from "../utils/validationSchemas";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../i18n";

import { useAppStore } from "../store/useAppStore";

export const SettingsView: React.FC = () => {
  // i18n
  const { t, i18n } = useTranslation();

  // Store
  const settings = useAppStore((state) => state.settings);
  const { updateSettings, notify, sync, syncStatus } = useAppStore();
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

  // Confirmation dialogs
  const [confirmCategoryDelete, setConfirmCategoryDelete] = useState<
    string | null
  >(null);
  const [confirmHourDelete, setConfirmHourDelete] = useState<string | null>(
    null
  );
  const [confirmClearAll, setConfirmClearAll] = useState<1 | 2 | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Apply color theme to document
  useEffect(() => {
    const theme = settings.colorTheme || "basico";
    if (theme === "basico") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [settings.colorTheme]);

  // Constants
  const MAX_CATEGORIES = 10;
  const MAX_HOUR_TYPES = 10;
  const SPECIAL_CATEGORY = "Sin especificar";

  // --- CATEGORY HANDLERS ---
  const handleAddCategory = () => {
    if (!newCategory.trim()) return;

    if (settings.categories.includes(newCategory)) {
      notify("Esta categoría ya existe", "error");
      return;
    }

    if (settings.categories.length >= MAX_CATEGORIES) {
      notify(`Máximo ${MAX_CATEGORIES} categorías permitidas`, "error");
      return;
    }

    setSettings((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
    setNewCategory("");
    notify("Categoría añadida", "success");
  };

  const confirmRemoveCategory = (cat: string) => {
    setConfirmCategoryDelete(cat);
  };

  const handleRemoveCategory = () => {
    if (!confirmCategoryDelete) return;

    const catToRemove = confirmCategoryDelete;
    setSettings((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== catToRemove),
    }));

    setConfirmCategoryDelete(null);
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
    if (!newHourName.trim() || newHourPrice === "") {
      notify("Por favor completa nombre y precio", "error");
      return;
    }

    if (settings.hourTypes.length >= MAX_HOUR_TYPES) {
      notify(`Máximo ${MAX_HOUR_TYPES} tipos de hora permitidos`, "error");
      return;
    }

    const price = parseFloat(newHourPrice);

    // Validar con Zod
    const hourTypeData = {
      id: crypto.randomUUID(),
      name: newHourName.trim(),
      price: price,
    };

    const validation = HourTypeSchema.safeParse(hourTypeData);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      notify(firstError.message, "error");

      if (import.meta.env.DEV) {
        console.error("HourType validation errors:", validation.error.issues);
      }
      return;
    }

    const newTypes = [...(settings.hourTypes || []), validation.data];
    setSettings((prev) => ({ ...prev, hourTypes: newTypes }));
    setNewHourName("");
    setNewHourPrice("");
    notify("Tipo de hora añadido correctamente", "success");
  };
  const confirmRemoveHourType = (id: string) => {
    setConfirmHourDelete(id);
  };

  const handleRemoveHourType = () => {
    if (!confirmHourDelete) return;

    const idToRemove = confirmHourDelete;
    setSettings((prev) => ({
      ...prev,
      hourTypes: prev.hourTypes.filter((h) => h.id !== idToRemove),
    }));

    setConfirmHourDelete(null);
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

    // Validar extensión
    if (!file.name.endsWith(".json")) {
      notify("El archivo debe tener extensión .json", "error");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;

        // Validar contenido no vacío
        if (!content || content.trim() === "") {
          notify("El archivo está vacío", "error");
          return;
        }

        const data = JSON.parse(content) as BackupData;

        // Validar con Zod
        const validation = BackupDataSchema.safeParse(data);

        if (!validation.success) {
          const firstError = validation.error.issues[0];
          notify(`Formato inválido: ${firstError.message}`, "error");

          if (import.meta.env.DEV) {
            console.error("Backup validation errors:", validation.error.issues);
          }
          return;
        }

        const validData = validation.data;
        let hasChanges = false;

        if (
          validData.shifts &&
          Array.isArray(validData.shifts) &&
          validData.shifts.length > 0
        ) {
          // Type assertion porque Zod validó la estructura
          setShifts(validData.shifts as any);
          hasChanges = true;
        }

        if (validData.settings) {
          setSettings(data.settings);
          hasChanges = true;
        }

        if (hasChanges) {
          notify("Datos restaurados correctamente", "success");
        } else {
          notify("No se encontraron datos válidos para restaurar", "error");
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Import error:", error);
        }

        let errorMessage = "Error al leer el archivo de copia de seguridad";

        if (error instanceof SyntaxError) {
          errorMessage = "El archivo JSON está corrupto o mal formado";
        } else if (error instanceof Error) {
          errorMessage = `Error al procesar: ${error.message}`;
        }

        notify(errorMessage, "error");
      }
    };

    reader.onerror = () => {
      if (import.meta.env.DEV) {
        console.error("File read error:", reader.error);
      }
      notify("Error al leer el archivo. Intenta de nuevo.", "error");
    };

    reader.readAsText(file);
    // Reset input
    event.target.value = "";
  };

  // --- DELETE ALL DATA ---
  const handleClearAllData = () => {
    // Clear all data
    setShifts([]);
    setSettings({
      categories: [SPECIAL_CATEGORY],
      hourTypes: [],
      downloadFormat: "txt",
      pushEnabled: false,
    });
    setConfirmClearAll(null);
    notify("Todos los datos han sido eliminados", "info");
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
              downloadFormat: e.target.value as "txt" | "pdf" | "xlsx",
            }));
            notify("Formato actualizado", "info");
          }}
        >
          <option value="txt">Texto (.txt)</option>
          <option value="pdf">Documento (.pdf)</option>
          <option value="xlsx">Excel (.xlsx)</option>
        </Select>

        <div className={APP_STYLES.CONFIGURACIÓN.themeSelectWrapper}>
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

        {/* Theme Selector */}
        <div className={APP_STYLES.CONFIGURACIÓN.themeSelectWrapper}>
          <label className={APP_STYLES.CONFIGURACIÓN.themeSelectLabel}>
            Tema de Color
          </label>
          <div className={APP_STYLES.CONFIGURACIÓN.themeSelectGrid}>
            {COLOR_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  updateSettings((prev) => ({ ...prev, colorTheme: theme.id }));
                  notify(`Tema "${theme.name}" aplicado`, "success");
                }}
                className={`${APP_STYLES.CONFIGURACIÓN.themeButton} ${
                  (settings.colorTheme || "basico") === theme.id
                    ? APP_STYLES.CONFIGURACIÓN.themeButtonActive
                    : APP_STYLES.CONFIGURACIÓN.themeButtonInactive
                }`}
                style={{
                  borderColor:
                    (settings.colorTheme || "basico") === theme.id
                      ? theme.preview
                      : undefined,
                }}
              >
                <span
                  className={APP_STYLES.CONFIGURACIÓN.themePreview}
                  style={{ backgroundColor: theme.preview }}
                />
                <span className={APP_STYLES.CONFIGURACIÓN.themeButtonLabel}>
                  {theme.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Language Selector */}
        <div className={APP_STYLES.CONFIGURACIÓN.themeSelectWrapper}>
          <label className={APP_STYLES.CONFIGURACIÓN.themeSelectLabel}>
            {t("settings.language")}
          </label>
          <div className={APP_STYLES.CONFIGURACIÓN.themeSelectGrid}>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  i18n.changeLanguage(lang.code);
                  notify(t("toast.languageChanged"), "success");
                }}
                className={`${APP_STYLES.CONFIGURACIÓN.themeButton} ${
                  i18n.language === lang.code
                    ? APP_STYLES.CONFIGURACIÓN.themeButtonActive
                    : APP_STYLES.CONFIGURACIÓN.themeButtonInactive
                }`}
              >
                <span className={APP_STYLES.CONFIGURACIÓN.themeButtonLabel}>
                  {lang.name}
                </span>
              </button>
            ))}
          </div>
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
          {settings.categories
            .filter((cat) => cat !== SPECIAL_CATEGORY)
            .map((cat) => (
              <li key={cat} className={APP_STYLES.CONFIGURACIÓN.categoryItem}>
                {editingCategory === cat ? (
                  <div
                    className={APP_STYLES.CONFIGURACIÓN.categoryEditContainer}
                  >
                    <input
                      className={APP_STYLES.CONFIGURACIÓN.categoryEditInput}
                      value={tempCategoryName}
                      onChange={(e) => setTempCategoryName(e.target.value)}
                      autoFocus
                    />
                    <button
                      onClick={saveEditCategory}
                      className={APP_STYLES.CONFIGURACIÓN.categoryEditSave}
                      aria-label="Guardar categoría"
                    >
                      <CheckIcon className={APP_STYLES.MODOS.iconSmall} />
                    </button>
                    <button
                      onClick={cancelEditCategory}
                      className={APP_STYLES.CONFIGURACIÓN.categoryEditCancel}
                      aria-label="Cancelar edición"
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
                        aria-label="Editar"
                      >
                        <PencilIcon className={APP_STYLES.MODOS.iconGreyBlue} />
                      </button>
                      <button
                        onClick={() => confirmRemoveCategory(cat)}
                        className={
                          APP_STYLES.CONFIGURACIÓN.categoryDeleteButton
                        }
                        aria-label="Eliminar"
                      >
                        <TrashIcon className={APP_STYLES.MODOS.iconGreyBlue} />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          {settings.categories.length === 0 ||
          (settings.categories.length === 1 &&
            settings.categories[0] === SPECIAL_CATEGORY) ? (
            <li className={APP_STYLES.CONFIGURACIÓN.categoryItem}>
              <span className={APP_STYLES.CONFIGURACIÓN.emptyStateText}>
                No hay categorías personalizadas
              </span>
            </li>
          ) : null}
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
                    aria-label="Guardar tipo de hora"
                  >
                    <CheckIcon className={APP_STYLES.MODOS.iconSmall} />
                  </button>
                  <button
                    onClick={cancelEditHour}
                    className={APP_STYLES.CONFIGURACIÓN.hourTypeEditCancel}
                    aria-label="Cancelar edición"
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
                      aria-label="Editar"
                    >
                      <PencilIcon className={APP_STYLES.MODOS.iconGreyBlue} />
                    </button>
                    <button
                      onClick={() => confirmRemoveHourType(type.id)}
                      className={APP_STYLES.CONFIGURACIÓN.hourTypeDeleteButton}
                      aria-label="Eliminar"
                    >
                      <TrashIcon className={APP_STYLES.MODOS.iconGreyBlue} />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
          {(settings.hourTypes || []).length === 0 ? (
            <li className={APP_STYLES.CONFIGURACIÓN.hourTypeItem}>
              <span className={APP_STYLES.CONFIGURACIÓN.emptyStateText}>
                No hay tipos de hora personalizados
              </span>
            </li>
          ) : null}
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
        <div className={APP_STYLES.CONFIGURACIÓN.syncHeader}>
          <h2 className={APP_STYLES.CONFIGURACIÓN.sectionTitle}>
            Sincronización Nube
          </h2>
          {syncStatus === "syncing" && (
            <span
              className={`${APP_STYLES.MODOS.textAccent} text-sm ${APP_STYLES.MODOS.animateSpin}`}
            >
              Sincronizando...
            </span>
          )}
          {syncStatus === "success" && (
            <span className={`${APP_STYLES.MODOS.textSuccess} text-sm`}>
              Sincronizado
            </span>
          )}
          {syncStatus === "error" && (
            <span className={`${APP_STYLES.MODOS.textError} text-sm`}>
              Error
            </span>
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

      {/* DELETE ALL DATA CARD */}
      <Card className={APP_STYLES.CONFIGURACIÓN.backupCard}>
        <h2 className={APP_STYLES.CONFIGURACIÓN.sectionTitle}>
          Zona de Peligro
        </h2>
        <p className={APP_STYLES.CONFIGURACIÓN.sectionDesc}>
          Elimina permanentemente todos los registros y configuración.
        </p>
        <div className={APP_STYLES.CONFIGURACIÓN.backupGrid}>
          <Button
            variant="danger"
            onClick={() => setConfirmClearAll(1)}
            className={APP_STYLES.CONFIGURACIÓN.backupButtonContainer}
          >
            <TrashIcon className={APP_STYLES.MODOS.iconSmall} />
            <span className={APP_STYLES.CONFIGURACIÓN.backupButtonText}>
              Borrar Todos los Datos
            </span>
          </Button>
        </div>
      </Card>

      {/* CONFIRMATION DIALOGS */}
      <ConfirmDialog
        isOpen={confirmCategoryDelete !== null}
        title="¿Eliminar Categoría?"
        message="Esta acción eliminará permanentemente esta categoría. ¿Deseas continuar?"
        onConfirm={handleRemoveCategory}
        onCancel={() => setConfirmCategoryDelete(null)}
      />

      <ConfirmDialog
        isOpen={confirmHourDelete !== null}
        title="¿Eliminar Tipo de Hora?"
        message="Esta acción eliminará permanentemente este tipo de hora. ¿Deseas continuar?"
        onConfirm={handleRemoveHourType}
        onCancel={() => setConfirmHourDelete(null)}
      />

      <ConfirmDialog
        isOpen={confirmClearAll === 1}
        title="⚠️ Borrar Todos los Datos"
        message="Esta acción eliminará permanentemente todos los registros y configuración. Recomendamos hacer una copia de seguridad primero. ¿Continuar?"
        onConfirm={() => setConfirmClearAll(2)}
        onCancel={() => setConfirmClearAll(null)}
      />

      <ConfirmDialog
        isOpen={confirmClearAll === 2}
        title="⚠️ Última Advertencia"
        message="Esta es la última advertencia. ¿Confirmas que deseas borrar TODOS los datos de la aplicación?"
        onConfirm={handleClearAllData}
        onCancel={() => setConfirmClearAll(null)}
      />
    </div>
  );
};
