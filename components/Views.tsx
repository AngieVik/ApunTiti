import React, { useState, useMemo, useRef } from 'react';
import { Shift, Settings, HourType, BackupData, NotificationType } from '../types';
import { Card, Button, Input, Select, ConfirmDialog } from './UI';
import { ChevronLeftIcon, ChevronRightIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon, ArrowPathIcon } from './Icons';

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

// --- CLOCK VIEW ---

interface ClockViewProps {
  shifts: Shift[];
  setShifts: React.Dispatch<React.SetStateAction<Shift[]>>;
  categories: string[];
  hourTypes: HourType[];
  notify: (msg: string, type: NotificationType) => void;
}

export const ClockView: React.FC<ClockViewProps> = ({ shifts, setShifts, categories, hourTypes, notify }) => {
  const [date, setDate] = useState(toLocalISOString(new Date()));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState(categories[0] || '');
  const [selectedHourType, setSelectedHourType] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const stats = useMemo(() => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const monthShifts = shifts.filter(s => {
          const d = new Date(s.date);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });

      let totalHours = 0;
      let totalEarnings = 0;
      const categoryCounts: Record<string, number> = {};

      monthShifts.forEach(s => {
          const duration = calculateDuration(s.startTime, s.endTime);
          totalHours += duration;
          
          if (s.hourTypeId) {
              const hType = hourTypes.find(h => h.id === s.hourTypeId);
              const price = hType ? hType.price : 0;
              totalEarnings += (duration * price);
          }

          categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
      });

      return {
          monthName: monthNamesES[currentMonth],
          totalHours: totalHours.toFixed(2),
          totalEarnings: totalEarnings,
          shiftCount: monthShifts.length,
          categoryBreakdown: categoryCounts
      };
  }, [shifts, hourTypes]);

  const handleSaveShift = () => {
    setError(null);
    if (!date || !startTime || !endTime) {
      setError('Por favor, completa todos los campos.');
      notify('Faltan campos por completar', 'error');
      return;
    }
    
    const newShiftStart = new Date(`${date}T${startTime}`).getTime();
    const hasOverlap = shifts.some(shift => {
      if(shift.date !== date) return false;
      const existingStart = new Date(`${shift.date}T${shift.startTime}`).getTime();
      const existingEnd = new Date(`${shift.date}T${shift.endTime}`).getTime();
      const currentEnd = new Date(`${date}T${endTime}`).getTime();
      
      if (currentEnd < newShiftStart) {
          return (newShiftStart >= existingStart && newShiftStart < existingEnd);
      }
      return (newShiftStart < existingEnd && currentEnd > existingStart);
    });

    if (hasOverlap) {
      setError('Solapamiento detectado.');
      notify('El horario se solapa con otro registro', 'error');
      return;
    }

    const newShift: Shift = {
      id: crypto.randomUUID(),
      date,
      startTime,
      endTime,
      notes,
      category,
      hourTypeId: selectedHourType || undefined
    };
    
    setShifts(prev => [...prev, newShift].sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime()));
    setNotes('');
    notify('Turno registrado correctamente', 'success');
  };

  return (
    <div className="space-y-2 max-w-3xl mx-auto">
      <Card className="border-t-2 border-t-yellow-500">
        <div className="flex items-center justify-between mb-2">
             <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
                Registrar <span className="text-yellow-600 dark:text-yellow-500">Turno</span>
             </h2>
        </div>
        
        {error && <div className="bg-red-100 border-l-2 border-red-500 text-red-700 p-1 mb-2 rounded text-xs" role="alert"><p>{error}</p></div>}

        <div className="grid grid-cols-2 gap-2">
          {/* Layout Fijo: 1 columna cada uno siempre */}
          <div className="col-span-1">
             <Input 
                label="Fecha" 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)} 
                className="[&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
             />
          </div>
          <div className="col-span-1">
            <Select 
                label="Categoría" 
                value={category} 
                onChange={e => setCategory(e.target.value)}
            >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </Select>
          </div>

          <div>
             <Select label="Tipo de Hora" value={selectedHourType} onChange={e => setSelectedHourType(e.target.value)}>
                 <option value="">Sin tipo</option>
                 {hourTypes.map(type => <option key={type.id} value={type.id}>{type.name} ({type.price}€)</option>)}
             </Select>
          </div>
          <div>
            <Input label="Notas" type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Opcional..." />
          </div>

          <div>
            <Input 
                label="Entrada" 
                type="time" 
                value={startTime} 
                onChange={e => setStartTime(e.target.value)} 
                className="font-mono tracking-widest text-center [&::-webkit-calendar-picker-indicator]:w-6 [&::-webkit-calendar-picker-indicator]:h-6 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
          </div>
          <div>
            <Input 
                label="Salida" 
                type="time" 
                value={endTime} 
                onChange={e => setEndTime(e.target.value)} 
                className="font-mono tracking-widest text-center [&::-webkit-calendar-picker-indicator]:w-6 [&::-webkit-calendar-picker-indicator]:h-6 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSaveShift} className="px-6">Guardar</Button>
        </div>
      </Card>

      <Card className="relative overflow-hidden p-3">
          <div className="absolute top-0 left-0 w-1 h-full bg-gray-200 dark:bg-gray-800"></div>
          
          <div className="flex justify-between items-start mb-3 pl-2">
              <div>
                  <h3 className="text-[10px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest">Resumen</h3>
                  <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase">{stats.monthName}</h2>
              </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 pl-2">
              <div className="bg-gray-50 dark:bg-[#1a1a1a] p-2 rounded border border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">Horas</span>
                      <span className="text-xs font-mono font-bold text-yellow-600 dark:text-yellow-500">{stats.totalHours}h</span>
                  </div>
                  {stats.totalEarnings > 0 && (
                       <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">Ganancia</span>
                            <span className="text-xs font-mono font-bold text-green-600 dark:text-green-500">{stats.totalEarnings.toFixed(2)}€</span>
                        </div>
                   )}
              </div>

              <div className="bg-gray-50 dark:bg-[#1a1a1a] p-2 rounded border border-gray-100 dark:border-gray-800 flex flex-col justify-center">
                  <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">Turnos</span>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">{stats.shiftCount}</span>
                  </div>
              </div>

              <div className="col-span-2 bg-gray-50 dark:bg-[#1a1a1a] p-2 rounded border border-gray-100 dark:border-gray-800">
                   <div className="flex flex-wrap gap-2">
                    {Object.keys(stats.categoryBreakdown).length > 0 ? (
                        Object.entries(stats.categoryBreakdown).slice(0, 4).map(([cat, count]) => (
                            <div key={cat} className="flex items-center gap-1 text-[10px] bg-white dark:bg-black px-1.5 py-0.5 rounded border border-gray-100 dark:border-gray-800">
                                <span className="text-gray-700 dark:text-gray-300">{cat}</span>
                                <span className="font-bold text-gray-900 dark:text-white">{count}</span>
                            </div>
                        ))
                    ) : (
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 italic">Sin datos</span>
                    )}
                   </div>
              </div>
          </div>
      </Card>
    </div>
  );
};

// --- CALENDAR VIEW ---

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
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    
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
        setSelectedDate(date);
        setCurrentDate(date);
        setRangeStart('');
        setRangeEnd('');
        if (viewType !== 'day') setViewType('day');
    };

    const handleRangeStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRangeStart(e.target.value);
        if (e.target.value) setSelectedDate(null);
    };

    const handleRangeEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRangeEnd(e.target.value);
        if (e.target.value) setSelectedDate(null);
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
            const isSelected = selectedDate && toLocalISOString(selectedDate) === dateStr;

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
        
        // Calcular diferencia de días para el bucle
        const diffDays = Math.ceil(Math.abs((end - start) / dayMilliseconds)) + 1;
        
        const days = [];
        // Generar array de fechas
        for(let i=0; i<diffDays; i++) {
            const d = new Date(start);
            d.setDate(d.getDate() + i); // Usar d.getDate() + i es más seguro
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

            // Renderizar carta de día (estilo semanal pero en grid)
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
                
                {/* GRID RESPONSIVE: 2 cols en móvil, 3 en sm, 4 en md, 7 en lg */}
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
            <Card className="print:hidden bg-white dark:bg-[#111] overflow-hidden">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    {/* View Switcher Group */}
                    <div className="flex items-center bg-gray-100 dark:bg-[#1a1a1a] rounded p-1 shrink-0">
                        <button onClick={() => handleViewChange('year')} className={`h-6 px-2 rounded text-[10px] font-bold uppercase tracking-wide transition-all ${viewType === 'year' ? 'bg-white dark:bg-[#111] shadow-sm text-yellow-600 dark:text-yellow-500' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'}`}>Año</button>
                        <button onClick={() => handleViewChange('month')} className={`h-6 px-2 rounded text-[10px] font-bold uppercase tracking-wide transition-all ${viewType === 'month' ? 'bg-white dark:bg-[#111] shadow-sm text-yellow-600 dark:text-yellow-500' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'}`}>Mes</button>
                        <button onClick={() => handleViewChange('week')} className={`h-6 px-2 rounded text-[10px] font-bold uppercase tracking-wide transition-all ${viewType === 'week' ? 'bg-white dark:bg-[#111] shadow-sm text-yellow-600 dark:text-yellow-500' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'}`}>Semana</button>
                        <button onClick={() => handleViewChange('day')} className={`h-6 px-2 rounded text-[10px] font-bold uppercase tracking-wide transition-all ${viewType === 'day' ? 'bg-white dark:bg-[#111] shadow-sm text-yellow-600 dark:text-yellow-500' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'}`}>Día</button>
                    </div>

                    {/* Range Inputs Group - Now forcing flex row and no wrap */}
                    <div className="flex items-center gap-1 shrink-0 bg-gray-50 dark:bg-[#1a1a1a] p-1 rounded border border-gray-100 dark:border-white/5">
                         <Input 
                            label="" 
                            type="date" 
                            value={rangeStart} 
                            onChange={handleRangeStartChange} 
                            className="w-24 h-6 text-[10px] p-0 px-1 border-none bg-transparent focus:ring-0 [&::-webkit-calendar-picker-indicator]:w-3 [&::-webkit-calendar-picker-indicator]:h-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        />
                        <span className="text-gray-400 font-bold text-[10px]">-</span>
                        <Input 
                            label="" 
                            type="date" 
                            value={rangeEnd} 
                            onChange={handleRangeEndChange} 
                            className="w-24 h-6 text-[10px] p-0 px-1 border-none bg-transparent focus:ring-0 [&::-webkit-calendar-picker-indicator]:w-3 [&::-webkit-calendar-picker-indicator]:h-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
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


// --- SETTINGS VIEW ---
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