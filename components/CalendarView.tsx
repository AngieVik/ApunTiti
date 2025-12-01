import React, { useState, useMemo } from 'react';
import { Shift, Settings, HourType, NotificationType } from '../types';
import { Card, Button, Input, Select, ConfirmDialog } from './UI';
import { ChevronLeftIcon, ChevronRightIcon, PencilIcon, TrashIcon, XMarkIcon } from './Icons';

// --- HELPER FUNCTIONS ---

const toLocalISOString = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().split('T')[0];
};

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay(); // 0=Sun, 6=Sat

const monthNamesES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const dayNamesES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const calculateDuration = (start: string, end: string) => {
    const s = parseInt(start.split(':')[0]) + parseInt(start.split(':')[1])/60;
    const e = parseInt(end.split(':')[0]) + parseInt(end.split(':')[1])/60;
    
    if (e < s) {
        return (24 - s) + e;
    }
    return e - s;
};

// --- COMPONENT ---

type CalendarViewType = 'year' | 'month' | 'week' | 'day';

interface CalendarViewProps {
  shifts: Shift[];
  setShifts: React.Dispatch<React.SetStateAction<Shift[]>>;
  hourTypes: HourType[];
  settings: Settings;
  notify: (msg: string, type: NotificationType) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ shifts, setShifts, hourTypes, settings, notify }) => {
    const [viewType, setViewType] = useState<CalendarViewType>('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    
    const [rangeStart, setRangeStart] = useState('');
    const [rangeEnd, setRangeEnd] = useState('');

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [shiftToDelete, setShiftToDelete] = useState<string | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingShift, setEditingShift] = useState<Shift | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const shiftsByDate = useMemo(() => {
        return shifts.reduce((acc, shift) => {
            (acc[shift.date] = acc[shift.date] || []).push(shift);
            return acc;
        }, {} as Record<string, Shift[]>);
    }, [shifts]);

    const handleViewChange = (type: CalendarViewType) => {
        setViewType(type);
        setRangeStart('');
        setRangeEnd('');
    };

    const handlePrev = () => {
        const newDate = new Date(currentDate);
        if (viewType === 'year') newDate.setFullYear(year - 1);
        if (viewType === 'month') newDate.setMonth(month - 1);
        if (viewType === 'week') newDate.setDate(newDate.getDate() - 7);
        if (viewType === 'day') newDate.setDate(newDate.getDate() - 1);
        setCurrentDate(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(currentDate);
        if (viewType === 'year') newDate.setFullYear(year + 1);
        if (viewType === 'month') newDate.setMonth(month + 1);
        if (viewType === 'week') newDate.setDate(newDate.getDate() + 7);
        if (viewType === 'day') newDate.setDate(newDate.getDate() + 1);
        setCurrentDate(newDate);
    };

    const handleDayClick = (date: Date) => {
        setCurrentDate(date);
        setRangeStart('');
        setRangeEnd('');
        if (viewType !== 'day') setViewType('day');
    };

    const handleRangeStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRangeStart(e.target.value);
    };

    const handleRangeEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRangeEnd(e.target.value);
    };

    const confirmDelete = (id: string) => {
        setShiftToDelete(id);
        setIsConfirmOpen(true);
    }

    const handleDelete = () => {
        if (shiftToDelete) {
            setShifts(prev => prev.filter(s => s.id !== shiftToDelete));
            setShiftToDelete(null);
            setIsConfirmOpen(false);
            notify('Registro eliminado', 'info');
        }
    }

    const openEditModal = (shift: Shift) => {
        setEditingShift(shift);
        setIsEditOpen(true);
    }

    const handleUpdateShift = (updatedShift: Shift) => {
        setShifts(prev => prev.map(s => s.id === updatedShift.id ? updatedShift : s));
        setIsEditOpen(false);
        setEditingShift(null);
        notify('Registro actualizado', 'success');
    }

    // --- RENDERERS ---

    const renderYearView = () => {
        const statsByMonth = Array(12).fill(0).map(() => ({ hours: 0, money: 0 }));
        shifts.forEach(s => {
            const d = new Date(s.date);
            if (d.getFullYear() === year) {
                const duration = calculateDuration(s.startTime, s.endTime);
                statsByMonth[d.getMonth()].hours += duration;
                if (s.hourTypeId) {
                    const hType = hourTypes.find(h => h.id === s.hourTypeId);
                    const price = hType ? hType.price : 0;
                    statsByMonth[d.getMonth()].money += (duration * price);
                }
            }
        });

        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {monthNamesES.map((mName, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => { setCurrentDate(new Date(year, idx, 1)); handleViewChange('month'); }}
                        className={`p-2 border rounded-lg cursor-pointer hover:border-yellow-500/50 transition-all ${idx === month ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10' : 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#1a1a1a]'}`}
                    >
                        <h3 className="font-bold text-xs dark:text-white uppercase tracking-wide">{mName}</h3>
                        <div className="flex justify-between items-end mt-1">
                             <p className="text-xs font-mono text-gray-600 dark:text-gray-300">{statsByMonth[idx].hours.toFixed(0)}h</p>
                             {statsByMonth[idx].money > 0 && <p className="text-[10px] font-bold text-green-600 dark:text-green-500">{statsByMonth[idx].money.toFixed(0)}€</p>}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderMonthView = () => {
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month); 
        const startDay = firstDay === 0 ? 6 : firstDay - 1;
        
        const grid = [];
        for (let i = 0; i < startDay; i++) {
            grid.push(<div key={`empty-${i}`} className="h-16 md:h-20 border border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-[#1a1a1a]/50"></div>);
        }

        let monthlyHours = 0;
        let monthlyMoney = 0;

        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(year, month, day);
            const dateStr = toLocalISOString(dateObj);
            
            const dayShifts = shiftsByDate[dateStr] || [];
            const isToday = toLocalISOString(new Date()) === dateStr;
            
            // Comprobar si está seleccionado en el rango actual
            let isSelected = false;
            if (rangeStart && rangeEnd) {
                const d = dateObj.getTime();
                const s = new Date(rangeStart).getTime();
                const e = new Date(rangeEnd).getTime();
                isSelected = d >= s && d <= e;
            } else {
                 isSelected = toLocalISOString(currentDate) === dateStr && viewType === 'day';
            }

            let hoursToday = 0;
            let moneyToday = 0;

            dayShifts.forEach(s => {
                const duration = calculateDuration(s.startTime, s.endTime);
                hoursToday += duration;
                if (s.hourTypeId) {
                    const hType = hourTypes.find(h => h.id === s.hourTypeId);
                    const price = hType ? hType.price : 0;
                    moneyToday += (duration * price);
                }
            });
            monthlyHours += hoursToday;
            monthlyMoney += moneyToday;

            grid.push(
                <div 
                    key={day} 
                    onClick={() => handleDayClick(new Date(year, month, day))}
                    className={`h-16 md:h-20 p-1 border border-gray-100 dark:border-white/5 cursor-pointer transition-all hover:bg-yellow-50 dark:hover:bg-gray-800/50 relative flex flex-col group ${isSelected ? 'ring-1 ring-inset ring-yellow-500 z-10' : ''}`}
                >
                    <div className="flex justify-between items-start">
                         <div className={`w-5 h-5 text-[10px] flex items-center justify-center rounded-full mb-0.5 font-bold ${isToday ? 'bg-yellow-500 text-black' : 'text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white'}`}>
                            {day}
                        </div>
                        {moneyToday > 0 && <span className="text-[9px] font-bold text-green-600 dark:text-green-500">{moneyToday.toFixed(0)}€</span>}
                    </div>
                   
                    {dayShifts.length > 0 && (
                        <div className="flex-1 overflow-hidden flex flex-col gap-0.5">
                            <div className="text-[9px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded px-1 py-0 font-bold text-center leading-tight">
                                {hoursToday.toFixed(1)}h
                            </div>
                             {dayShifts.map((_, i) => <div key={i} className="h-0.5 rounded-full bg-green-400 dark:bg-green-600 w-full"></div>)}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <>
                <div className="grid grid-cols-7 text-center font-bold bg-gray-50 dark:bg-[#1a1a1a] p-1.5 rounded-t-lg border-b border-gray-100 dark:border-gray-800">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => <div key={d} className="text-[9px] uppercase tracking-widest text-gray-500 dark:text-gray-400">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 bg-white dark:bg-[#111] rounded-b-lg overflow-hidden">
                    {grid}
                </div>
                <div className="mt-2 p-2 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-gray-100 dark:border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">Total Mensual</span>
                    <div className="text-right">
                        <span className="block text-sm font-mono font-bold text-gray-900 dark:text-white">{monthlyHours.toFixed(2)} h</span>
                        {monthlyMoney > 0 && <span className="text-xs font-bold text-green-600 dark:text-green-400">{monthlyMoney.toFixed(2)}€</span>}
                    </div>
                </div>
            </>
        );
    };

    const renderWeekView = () => {
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay(); // 0 Sun
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); 
        startOfWeek.setDate(diff);

        const weekDays = [];
        let weekTotal = 0;
        let weekMoney = 0;

        for(let i=0; i<7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            const dateStr = toLocalISOString(d);
            const dayShifts = shiftsByDate[dateStr] || [];
            
            let hoursToday = 0;
             dayShifts.forEach(s => {
                const duration = calculateDuration(s.startTime, s.endTime);
                hoursToday += duration;
                if (s.hourTypeId) {
                    const hType = hourTypes.find(h => h.id === s.hourTypeId);
                    const price = hType ? hType.price : 0;
                    weekMoney += (duration * price);
                }
            });
            weekTotal += hoursToday;
            const isToday = toLocalISOString(new Date()) === dateStr;

            weekDays.push(
                <div key={i} onClick={() => handleDayClick(d)} className="flex-1 min-h-[140px] border-r border-gray-100 dark:border-white/5 last:border-r-0 p-1.5 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] cursor-pointer transition-colors">
                    <div className="text-center border-b border-gray-100 dark:border-white/5 pb-1 mb-1">
                         <span className="block text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{dayNamesES[d.getDay()]}</span>
                         <span className={`block text-lg font-black ${isToday ? 'text-yellow-500' : 'text-gray-800 dark:text-white'}`}>{d.getDate()}</span>
                    </div>
                    <div className="space-y-0.5">
                        {dayShifts.map(s => (
                            <div key={s.id} className="text-[9px] p-0.5 bg-yellow-100 dark:bg-yellow-900/20 border-l-2 border-yellow-500 rounded mb-0.5">
                                <div className="font-bold dark:text-yellow-200 leading-tight">{s.startTime}</div>
                                <div className="truncate text-gray-700 dark:text-gray-300 leading-tight">{s.category}</div>
                            </div>
                        ))}
                    </div>
                     {hoursToday > 0 && <div className="mt-auto pt-1 text-center font-mono font-bold text-gray-500 dark:text-gray-400 text-[10px]">{hoursToday.toFixed(1)}h</div>}
                </div>
            )
        }

        return (
            <>
                <div className="flex border border-gray-100 dark:border-white/5 rounded-lg overflow-hidden bg-white dark:bg-[#111]">
                    {weekDays}
                </div>
                <div className="mt-2 p-2 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-gray-100 dark:border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">Total Semanal</span>
                     <div className="text-right">
                        <span className="block text-sm font-mono font-bold text-gray-900 dark:text-white">{weekTotal.toFixed(2)} h</span>
                        {weekMoney > 0 && <span className="text-xs font-bold text-green-600 dark:text-green-400">{weekMoney.toFixed(2)}€</span>}
                    </div>
                </div>
            </>
        )
    };

    const renderDayView = () => {
        const dateStr = toLocalISOString(currentDate);
        const dayShifts = shiftsByDate[dateStr] || [];
        let total = 0;
        let money = 0;

        return (
             <div className="space-y-2">
                <div className="flex items-baseline gap-2 border-b border-gray-100 dark:border-white/5 pb-1">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white capitalize leading-tight">
                        {currentDate.toLocaleDateString('es-ES', { weekday: 'long' })}
                    </h3>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{currentDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</span>
                </div>

                {dayShifts.length > 0 ? (
                    <div className="space-y-2">
                        {dayShifts.map(shift => {
                             const duration = calculateDuration(shift.startTime, shift.endTime);
                             total += duration;
                             
                             let typeName = 'Sin tipo';
                             let price = 0;
                             let hasType = false;

                             if (shift.hourTypeId) {
                                 const hType = hourTypes.find(h => h.id === shift.hourTypeId);
                                 typeName = hType ? hType.name : 'Desc.';
                                 price = hType ? hType.price : 0;
                                 money += (duration * price);
                                 hasType = true;
                             }

                             return (
                                <div key={shift.id} className="group flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 border-l-2 border-l-yellow-500 rounded-lg shadow-sm">
                                    <div className="flex-1 w-full">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-sm font-mono font-bold text-gray-900 dark:text-white">{shift.startTime} - {shift.endTime}</span>
                                            <span className="px-1.5 py-0 text-[9px] font-bold bg-gray-100 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300">{duration.toFixed(2)}h</span>
                                            {hasType && (price * duration) > 0 && (
                                                <span className="px-1.5 py-0 text-[9px] font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded border border-green-200 dark:border-green-800">{ (duration * price).toFixed(2) }€</span>
                                            )}
                                        </div>
                                        <div className="flex gap-2 text-xs">
                                            <span className="font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-wide">{shift.category}</span>
                                            <span className="text-gray-300">|</span>
                                            <span className="text-gray-600 dark:text-gray-300 font-medium">{typeName}</span>
                                        </div>
                                        {shift.notes && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic border-t border-gray-100 dark:border-white/5 pt-1 block">"{shift.notes}"</p>}
                                    </div>
                                    <div className="flex gap-2 mt-2 sm:mt-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity self-end sm:self-center">
                                        <button onClick={() => openEditModal(shift)} className="p-1.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"><PencilIcon className="w-4 h-4" /></button>
                                        <button onClick={() => confirmDelete(shift.id)} className="p-1.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                </div>
                             )
                        })}
                         <div className="mt-2 p-2 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-gray-100 dark:border-white/5 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">Total Diario</span>
                             <div className="text-right">
                                <span className="block text-lg font-mono font-bold text-gray-900 dark:text-white">{total.toFixed(2)} h</span>
                                {money > 0 && <span className="text-xs font-bold text-green-600 dark:text-green-400">{money.toFixed(2)}€</span>}
                             </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-8 text-center rounded-lg border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1a1a1a]/50">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">No hay registros.</p>
                    </div>
                )}
            </div>
        )
    }

    // --- RENDER RANGE (GRID MODE) ---
    const renderRangeView = () => {
        const start = new Date(rangeStart).getTime();
        const end = new Date(rangeEnd).getTime();
        const dayMilliseconds = 24 * 60 * 60 * 1000;
        
        const diffDays = Math.ceil(Math.abs((end - start) / dayMilliseconds)) + 1;
        
        const days = [];
        for(let i=0; i<diffDays; i++) {
            const d = new Date(start);
            d.setDate(d.getDate() + i); 
            days.push(d);
        }

        let totalRangeHours = 0;
        let totalRangeMoney = 0;

        const dayCards = days.map(d => {
            const dateStr = toLocalISOString(d);
            const dayShifts = shiftsByDate[dateStr] || [];
            
            let dayHours = 0;
            let dayMoney = 0;

            dayShifts.forEach(s => {
                const duration = calculateDuration(s.startTime, s.endTime);
                dayHours += duration;
                if (s.hourTypeId) {
                    const hType = hourTypes.find(h => h.id === s.hourTypeId);
                    const price = hType ? hType.price : 0;
                    dayMoney += (duration * price);
                }
            });

            totalRangeHours += dayHours;
            totalRangeMoney += dayMoney;

            return (
                <div key={dateStr} onClick={() => handleDayClick(d)} className="min-h-[100px] border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1a1a1a] p-1.5 rounded cursor-pointer hover:border-yellow-500 transition-colors flex flex-col">
                    <div className="text-center border-b border-gray-100 dark:border-white/5 pb-1 mb-1">
                         <span className="block text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{dayNamesES[d.getDay()]}</span>
                         <span className="block text-lg font-black text-gray-900 dark:text-white">{d.getDate()}</span>
                         <span className="block text-[8px] text-gray-400 uppercase">{monthNamesES[d.getMonth()].substring(0,3)}</span>
                    </div>
                    <div className="space-y-0.5 flex-1">
                        {dayShifts.map(s => (
                            <div key={s.id} className="text-[9px] p-0.5 bg-yellow-100 dark:bg-yellow-900/20 border-l-2 border-yellow-500 rounded mb-0.5 truncate">
                                <span className="font-bold dark:text-yellow-200">{s.startTime}</span> <span className="text-gray-700 dark:text-gray-300">{s.category}</span>
                            </div>
                        ))}
                    </div>
                     {dayHours > 0 && (
                        <div className="mt-1 text-right border-t border-gray-50 dark:border-white/5 pt-1">
                            <span className="block font-mono font-bold text-[10px] text-gray-900 dark:text-white">{dayHours.toFixed(1)}h</span>
                            {dayMoney > 0 && <span className="block text-[9px] font-bold text-green-600 dark:text-green-500">{dayMoney.toFixed(2)}€</span>}
                        </div>
                     )}
                </div>
            );
        });

        return (
            <div className="space-y-2">
                <div className="flex justify-between items-baseline border-b border-gray-100 dark:border-white/5 pb-1 mb-2">
                    <div>
                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide">Resumen Rango</h3>
                        <p className="text-[10px] text-gray-500">{new Date(rangeStart).toLocaleDateString()} - {new Date(rangeEnd).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                        <span className="block font-mono font-bold text-lg text-gray-900 dark:text-white leading-none">{totalRangeHours.toFixed(2)}h</span>
                        {totalRangeMoney > 0 && <span className="block font-bold text-xs text-green-600 dark:text-green-500">{totalRangeMoney.toFixed(2)}€</span>}
                    </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-1">
                    {dayCards}
                </div>
            </div>
        );
    };

    const handleSave = () => {
        if (settings.downloadFormat === 'pdf') {
            window.print();
        } else {
            handleDownloadTxt();
        }
    };

    const handleDownloadTxt = () => {
        let filteredShifts = shifts;
        let title = "Todos los registros";

        if (rangeStart && rangeEnd) {
             const start = rangeStart;
             const end = rangeEnd;
             filteredShifts = shifts.filter(s => s.date >= start && s.date <= end);
             title = `Registro Rango ${rangeStart} a ${rangeEnd}`;
        } 
        else if(viewType === 'year') {
             filteredShifts = shifts.filter(s => new Date(s.date).getFullYear() === year);
             title = `Registro Anual ${year}`;
        } else if (viewType === 'month') {
             filteredShifts = shifts.filter(s => {
                 const d = new Date(s.date);
                 return d.getFullYear() === year && d.getMonth() === month;
             });
             title = `Registro Mensual ${monthNamesES[month]} ${year}`;
        } else if (viewType === 'day') {
            filteredShifts = shifts.filter(s => s.date === toLocalISOString(currentDate));
            title = `Registro Diario ${toLocalISOString(currentDate)}`;
        }

        const header = `${title}\nGenerado: ${new Date().toLocaleString()}\n\nFecha       | Hora E. | Hora S. | Cat.        | Tipo      | Valor   | Notas\n------------------------------------------------------------------------------\n`;
        const body = filteredShifts.map(s => {
            let typeName = 'Sin tipo';
            let price = 0;
            if (s.hourTypeId) {
                const hType = hourTypes.find(h => h.id === s.hourTypeId);
                typeName = hType ? hType.name : 'N/A';
                price = hType ? hType.price : 0;
            }
            
            const duration = calculateDuration(s.startTime, s.endTime);
            const total = (duration * price).toFixed(2);
            const valStr = s.hourTypeId ? `${total}€` : 'N/A';
            return `${s.date}  | ${s.startTime}   | ${s.endTime}   | ${s.category.padEnd(11)} | ${typeName.padEnd(9)} | ${valStr.padEnd(6)} | ${s.notes}`;
        }).join('\n');
        
        const element = document.createElement("a");
        const file = new Blob([header + body], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${title.replace(/\s/g, '_')}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div id="calendar-container" className="space-y-2">
            <Card className="print:hidden bg-white dark:bg-[#111]">
                <div className="flex items-center justify-between gap-2">
                    
                    <div className="flex items-center bg-gray-100 dark:bg-[#1a1a1a] rounded p-1 h-8 shrink-0">
                        <button onClick={() => handleViewChange('year')} className={`h-full px-2 rounded text-[10px] font-bold uppercase tracking-wide transition-all flex items-center justify-center ${viewType === 'year' ? 'bg-white dark:bg-[#111] shadow-sm text-yellow-600 dark:text-yellow-500' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'}`}>Año</button>
                        <button onClick={() => handleViewChange('month')} className={`h-full px-2 rounded text-[10px] font-bold uppercase tracking-wide transition-all flex items-center justify-center ${viewType === 'month' ? 'bg-white dark:bg-[#111] shadow-sm text-yellow-600 dark:text-yellow-500' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'}`}>Mes</button>
                        <button onClick={() => handleViewChange('week')} className={`h-full px-2 rounded text-[10px] font-bold uppercase tracking-wide transition-all flex items-center justify-center ${viewType === 'week' ? 'bg-white dark:bg-[#111] shadow-sm text-yellow-600 dark:text-yellow-500' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'}`}>Semana</button>
                        <button onClick={() => handleViewChange('day')} className={`h-full px-2 rounded text-[10px] font-bold uppercase tracking-wide transition-all flex items-center justify-center ${viewType === 'day' ? 'bg-white dark:bg-[#111] shadow-sm text-yellow-600 dark:text-yellow-500' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'}`}>Día</button>
                    </div>

                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1a1a1a] rounded p-1 h-8 flex-1 min-w-0">
                        <input 
                            type="date" 
                            value={rangeStart} 
                            onChange={handleRangeStartChange} 
                            className="w-full h-full min-w-0 bg-transparent border-none p-0 px-1 text-[10px] font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 focus:ring-0 cursor-pointer text-center [&::-webkit-calendar-picker-indicator]:w-3 [&::-webkit-calendar-picker-indicator]:h-3 [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
                        />
                        <span className="text-gray-400 font-bold text-[10px]">-</span>
                        <input 
                            type="date" 
                            value={rangeEnd} 
                            onChange={handleRangeEndChange} 
                            className="w-full h-full min-w-0 bg-transparent border-none p-0 px-1 text-[10px] font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 focus:ring-0 cursor-pointer text-center [&::-webkit-calendar-picker-indicator]:w-3 [&::-webkit-calendar-picker-indicator]:h-3 [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
                        />
                    </div>
                </div>
            </Card>
            
            <div className="hidden print:block mb-4 border-b pb-2">
                <h1 className="text-xl font-bold">Reporte de Turnos</h1>
                <p className="text-sm text-gray-500">Generado el {new Date().toLocaleDateString()}</p>
            </div>

            <Card id="printable-area" className="min-h-[300px] print:shadow-none print:border-none print:p-0">
                {!rangeStart || !rangeEnd ? (
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-white/5">
                        <Button onClick={handlePrev} variant="secondary" className="!px-2 !w-8 h-7"><ChevronLeftIcon /></Button>
                        <h2 className="text-sm font-black text-center text-gray-900 dark:text-white uppercase tracking-wide">
                            {viewType === 'year' && year}
                            {viewType === 'month' && `${monthNamesES[month]} ${year}`}
                            {viewType === 'week' && `Semana ${currentDate.getDate()} - ${monthNamesES[month]}`}
                            {viewType === 'day' && currentDate.toLocaleDateString()}
                        </h2>
                        <Button onClick={handleNext} variant="secondary" className="!px-2 !w-8 h-7"><ChevronRightIcon /></Button>
                    </div>
                ) : null}

                {rangeStart && rangeEnd ? renderRangeView() : (
                    <>
                        {viewType === 'year' && renderYearView()}
                        {viewType === 'month' && renderMonthView()}
                        {viewType === 'week' && renderWeekView()}
                        {viewType === 'day' && renderDayView()}
                    </>
                )}
            </Card>

            <div className="flex justify-end print:hidden">
                <Button onClick={handleSave} className="flex items-center gap-1">
                    Descargar
                </Button>
            </div>

            <ConfirmDialog 
                isOpen={isConfirmOpen}
                title="¿Borrar Registro?"
                message="Esta acción eliminará permanentemente el registro seleccionado. ¿Deseas continuar?"
                onConfirm={handleDelete}
                onCancel={() => setIsConfirmOpen(false)}
            />

            {isEditOpen && editingShift && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#121212] rounded-xl shadow-2xl shadow-black border border-yellow-500/30 max-w-lg w-full p-4">
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide">Editar Registro</h3>
                             <button onClick={() => setIsEditOpen(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white"><XMarkIcon /></button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <Input label="Fecha" type="date" value={editingShift.date} onChange={e => setEditingShift({...editingShift, date: e.target.value})} />
                            <Select label="Categoría" value={editingShift.category} onChange={e => setEditingShift({...editingShift, category: e.target.value})}>
                                <option value={editingShift.category}>{editingShift.category}</option>
                            </Select>

                            <Input label="Hora Entrada" type="time" value={editingShift.startTime} onChange={e => setEditingShift({...editingShift, startTime: e.target.value})} />
                            <Input label="Hora Salida" type="time" value={editingShift.endTime} onChange={e => setEditingShift({...editingShift, endTime: e.target.value})} />
                            
                            <div className="col-span-2">
                                <Select label="Tipo de Hora" value={editingShift.hourTypeId || ''} onChange={e => setEditingShift({...editingShift, hourTypeId: e.target.value || undefined})}>
                                    <option value="">Sin tipo</option>
                                    {hourTypes.map(type => <option key={type.id} value={type.id}>{type.name} ({type.price}€)</option>)}
                                </Select>
                            </div>
                             <div className="col-span-2">
                                <Input label="Notas" type="text" value={editingShift.notes} onChange={e => setEditingShift({...editingShift, notes: e.target.value})} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="secondary" onClick={() => setIsEditOpen(false)}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={() => handleUpdateShift(editingShift)}>
                                Guardar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            
            <style>{`
                @media print {
                    body {
                        background: white;
                        color: black;
                    }
                    header, footer, button, .print\\:hidden, #root > div > div > header {
                        display: none !important;
                    }
                    main {
                        padding: 0;
                        margin: 0;
                    }
                    #calendar-container {
                        margin-top: 20px;
                    }
                    .bg-white, .dark\\:bg-\\[\\#111\\], .bg-gray-50, .dark\\:bg-\\[\\#1a1a1a\\] {
                        background-color: white !important;
                        color: black !important;
                        border-color: #ddd !important;
                    }
                    .overflow-hidden {
                        overflow: visible !important;
                    }
                    * {
                        font-family: sans-serif;
                        font-size: 10pt !important;
                    }
                    h2, h3, h1 {
                        color: black !important;
                    }
                }
            `}</style>
        </div>
    );
};