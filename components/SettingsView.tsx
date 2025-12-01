import React, { useState, useRef } from 'react';
import { Shift, Settings, HourType, BackupData, NotificationType } from '../types';
import { Card, Button, Input, Select } from './UI';
import { ArrowPathIcon, CheckIcon, XMarkIcon, PencilIcon, TrashIcon } from './Icons';

interface SettingsViewProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  shifts: Shift[];
  setShifts: React.Dispatch<React.SetStateAction<Shift[]>>;
  notify: (msg: string, type: NotificationType) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, setSettings, shifts, setShifts, notify }) => {
    const [newCategory, setNewCategory] = useState('');
    const [newHourName, setNewHourName] = useState('');
    const [newHourPrice, setNewHourPrice] = useState('');

    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [tempCategoryName, setTempCategoryName] = useState('');

    const [editingHourId, setEditingHourId] = useState<string | null>(null);
    const [tempHourName, setTempHourName] = useState('');
    const [tempHourPrice, setTempHourPrice] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- CATEGORY HANDLERS ---
    const handleAddCategory = () => {
        if(newCategory && !settings.categories.includes(newCategory)) {
            setSettings(prev => ({...prev, categories: [...prev.categories, newCategory]}));
            setNewCategory('');
            notify('Categoría añadida', 'success');
        }
    }

    const handleRemoveCategory = (catToRemove: string) => {
        setSettings(prev => ({
            ...prev,
            categories: prev.categories.filter(c => c !== catToRemove)
        }));
        notify('Categoría eliminada', 'info');
    }

    const startEditCategory = (cat: string) => {
        setEditingCategory(cat);
        setTempCategoryName(cat);
    }

    const saveEditCategory = () => {
        if (tempCategoryName && tempCategoryName !== editingCategory) {
            setSettings(prev => ({
                ...prev,
                categories: prev.categories.map(c => c === editingCategory ? tempCategoryName : c)
            }));
            notify('Categoría actualizada', 'success');
        }
        setEditingCategory(null);
    }

    const cancelEditCategory = () => {
        setEditingCategory(null);
    }

    // --- HOUR TYPE HANDLERS ---
    const handleAddHourType = () => {
        if(newHourName && newHourPrice) {
            const price = parseFloat(newHourPrice);
            if(isNaN(price)) return;

            const newType: HourType = {
                id: crypto.randomUUID(),
                name: newHourName,
                price: price
            };

            setSettings(prev => ({
                ...prev,
                hourTypes: [...(prev.hourTypes || []), newType]
            }));
            setNewHourName('');
            setNewHourPrice('');
            notify('Tipo de hora añadido', 'success');
        }
    }

    const handleRemoveHourType = (id: string) => {
        if(settings.hourTypes.length <= 1) {
            alert("Debe haber al menos un tipo de hora.");
            return;
        }
        setSettings(prev => ({
            ...prev,
            hourTypes: prev.hourTypes.filter(h => h.id !== id)
        }));
        notify('Tipo de hora eliminado', 'info');
    }

    const startEditHour = (type: HourType) => {
        setEditingHourId(type.id);
        setTempHourName(type.name);
        setTempHourPrice(type.price.toString());
    }

    const saveEditHour = () => {
        const price = parseFloat(tempHourPrice);
        if (tempHourName && !isNaN(price)) {
            setSettings(prev => ({
                ...prev,
                hourTypes: prev.hourTypes.map(h => h.id === editingHourId ? { ...h, name: tempHourName, price: price } : h)
            }));
            notify('Tipo de hora actualizado', 'success');
        }
        setEditingHourId(null);
    }

    const cancelEditHour = () => {
        setEditingHourId(null);
    }

    // --- BACKUP HANDLERS ---
    const handleExport = () => {
        const backupData: BackupData = {
            version: 1,
            date: new Date().toISOString(),
            shifts: shifts,
            settings: settings
        };
        
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_apuntahoras_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        notify('Copia de seguridad descargada', 'success');
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
                notify('Datos restaurados correctamente', 'success');
            } catch (error) {
                console.error(error);
                notify('Error al leer el archivo de copia de seguridad', 'error');
            }
        };
        reader.readAsText(file);
        // Reset input
        event.target.value = '';
    };

    return (
        <div className="max-w-2xl mx-auto space-y-3">
             {/* General Settings Card */}
             <Card>
                <h2 className="text-sm font-black text-gray-900 dark:text-white mb-2 uppercase tracking-wide">General</h2>
                <Select 
                    label="Formato de Guardado" 
                    value={settings.downloadFormat} 
                    onChange={e => {
                        setSettings(prev => ({...prev, downloadFormat: e.target.value as 'txt'|'pdf'}));
                        notify('Formato actualizado', 'info');
                    }}
                >
                    <option value="txt">Texto (.txt)</option>
                    <option value="pdf">Documento (.pdf)</option>
                </Select>
             </Card>

            {/* BACKUP CARD */}
            <Card className="border-l-4 border-l-blue-500">
                 <h2 className="text-sm font-black text-gray-900 dark:text-white mb-2 uppercase tracking-wide">Copia de Seguridad</h2>
                 <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Exporta tus datos para no perderlos si borras la caché o cambias de dispositivo.</p>
                 <div className="flex gap-2">
                     <Button onClick={handleExport} className="flex-1 flex justify-center items-center gap-2">
                         <span className="text-[10px]">Exportar Datos</span>
                     </Button>
                     <Button variant="secondary" onClick={handleImportClick} className="flex-1 flex justify-center items-center gap-2">
                         <ArrowPathIcon />
                         <span className="text-[10px]">Importar Datos</span>
                     </Button>
                     <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImportFile} 
                        accept=".json" 
                        className="hidden" 
                     />
                 </div>
            </Card>

            {/* CATEGORIES CARD */}
            <Card>
                <h2 className="text-sm font-black text-gray-900 dark:text-white mb-2 uppercase tracking-wide">Categorías</h2>
                <div className="flex gap-2 mb-2 items-end">
                    <div className="flex-1">
                         <Input 
                            label="Nueva Categoría" 
                            type="text"
                            value={newCategory}
                            onChange={e => setNewCategory(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleAddCategory()}
                        />
                    </div>
                    <div className="w-auto">
                       <Button onClick={handleAddCategory}>Añadir</Button>
                    </div>
                </div>
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                    {settings.categories.map(cat => (
                        <li key={cat} className="py-1.5 px-1 flex justify-between items-center">
                            {editingCategory === cat ? (
                                <div className="flex items-center gap-2 flex-1 mr-2">
                                    <input 
                                        className="flex-1 px-2 h-7 bg-white dark:bg-black border border-yellow-500 rounded text-xs outline-none"
                                        value={tempCategoryName}
                                        onChange={e => setTempCategoryName(e.target.value)}
                                        autoFocus
                                    />
                                    <button onClick={saveEditCategory} className="text-green-600 hover:bg-green-100 p-1 rounded"><CheckIcon className="w-4 h-4"/></button>
                                    <button onClick={cancelEditCategory} className="text-red-600 hover:bg-red-100 p-1 rounded"><XMarkIcon className="w-4 h-4"/></button>
                                </div>
                            ) : (
                                <>
                                    <span className="font-bold text-xs text-gray-700 dark:text-gray-200">{cat}</span>
                                    <div className="flex gap-1">
                                        <button onClick={() => startEditCategory(cat)} className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"><PencilIcon className="w-4 h-4" /></button>
                                        <button onClick={() => handleRemoveCategory(cat)} className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </Card>

            {/* HOUR TYPES CARD */}
            <Card>
                <h2 className="text-sm font-black text-gray-900 dark:text-white mb-2 uppercase tracking-wide">Tipos de Hora</h2>
                <div className="flex gap-2 mb-2 items-end">
                    <div className="flex-[2]">
                         <Input 
                            label="Nombre" 
                            type="text"
                            value={newHourName}
                            onChange={e => setNewHourName(e.target.value)}
                        />
                    </div>
                    <div className="flex-1">
                        <Input 
                            label="Precio (€)" 
                            type="number"
                            value={newHourPrice}
                            onChange={e => setNewHourPrice(e.target.value)}
                        />
                    </div>
                    <div>
                       <Button onClick={handleAddHourType}>Añadir</Button>
                    </div>
                </div>
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                    {(settings.hourTypes || []).map(type => (
                        <li key={type.id} className="py-1.5 px-1 flex justify-between items-center">
                            {editingHourId === type.id ? (
                                <div className="flex items-center gap-2 flex-1 mr-2">
                                     <input 
                                        className="flex-[2] px-2 h-7 bg-white dark:bg-black border border-yellow-500 rounded text-xs outline-none"
                                        value={tempHourName}
                                        onChange={e => setTempHourName(e.target.value)}
                                        placeholder="Nombre"
                                        autoFocus
                                    />
                                    <input 
                                        className="flex-1 w-16 px-2 h-7 bg-white dark:bg-black border border-yellow-500 rounded text-xs outline-none"
                                        value={tempHourPrice}
                                        onChange={e => setTempHourPrice(e.target.value)}
                                        placeholder="Precio"
                                        type="number"
                                    />
                                    <button onClick={saveEditHour} className="text-green-600 hover:bg-green-100 p-1 rounded"><CheckIcon className="w-4 h-4"/></button>
                                    <button onClick={cancelEditHour} className="text-red-600 hover:bg-red-100 p-1 rounded"><XMarkIcon className="w-4 h-4"/></button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-xs text-gray-700 dark:text-gray-200">{type.name}</span>
                                        <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0 rounded border border-green-200 dark:border-green-800 font-mono">{type.price}€</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => startEditHour(type)} className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"><PencilIcon className="w-4 h-4" /></button>
                                        <button onClick={() => handleRemoveHourType(type.id)} className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
};