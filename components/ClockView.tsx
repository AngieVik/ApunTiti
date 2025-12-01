import React, { useState, useMemo } from 'react';
import { Shift, HourType, NotificationType } from '../types';
import { Card, Button, Input, Select } from './UI';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

// --- HELPER FUNCTIONS ---

const toLocalISOString = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().split('T')[0];
};

const monthNamesES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const calculateDuration = (start: string, end: string) => {
    const s = parseInt(start.split(':')[0]) + parseInt(start.split(':')[1])/60;
    const e = parseInt(end.split(':')[0]) + parseInt(end.split(':')[1])/60;
    
    // Handle overnight shifts
    if (e < s) {
        return (24 - s) + e;
    }
    return e - s;
};

// --- COMPONENT ---

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
  
  // State for Summary Card Navigation (defaults to current real time)
  const [statsDate, setStatsDate] = useState(new Date());
  
  // Stats Calculation
  const stats = useMemo(() => {
      const currentMonth = statsDate.getMonth();
      const currentYear = statsDate.getFullYear();

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
          year: currentYear,
          totalHours: totalHours.toFixed(2),
          totalEarnings: totalEarnings,
          shiftCount: monthShifts.length,
          categoryBreakdown: categoryCounts
      };
  }, [shifts, hourTypes, statsDate]);

  // Navigation Handlers
  const handlePrevMonth = () => {
      setStatsDate(prev => {
          const newDate = new Date(prev);
          newDate.setMonth(prev.getMonth() - 1);
          return newDate;
      });
  };

  const handleNextMonth = () => {
      setStatsDate(prev => {
          const newDate = new Date(prev);
          newDate.setMonth(prev.getMonth() + 1);
          return newDate;
      });
  };

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
      {/* Registration Card */}
      <Card className="border-t-2 border-t-yellow-500">
        <div className="flex items-center justify-between mb-2">
             <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
                Registrar <span className="text-yellow-600 dark:text-yellow-500">Turno</span>
             </h2>
        </div>
        
        {error && <div className="bg-red-100 border-l-2 border-red-500 text-red-700 p-1 mb-2 rounded text-xs" role="alert"><p>{error}</p></div>}

        <div className="grid grid-cols-2 gap-2">
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

      {/* Month Summary Card */}
      <Card className="relative overflow-hidden p-3">
          <div className="absolute top-0 left-0 w-1 h-full bg-gray-200 dark:bg-gray-800"></div>
          
          <div className="flex justify-between items-center mb-3 pl-2">
              <div>
                  <h3 className="text-[10px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest mb-0.5">Resumen</h3>
                  {/* Month Selector */}
                  <div className="flex items-center gap-2">
                    <button onClick={handlePrevMonth} className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors"><ChevronLeftIcon className="w-4 h-4"/></button>
                    <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase">{stats.monthName} <span className="text-gray-400 text-xs">{stats.year}</span></h2>
                    <button onClick={handleNextMonth} className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors"><ChevronRightIcon className="w-4 h-4"/></button>
                  </div>
              </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 pl-2">
              {/* Hours Block */}
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

              {/* Shifts Block */}
              <div className="bg-gray-50 dark:bg-[#1a1a1a] p-2 rounded border border-gray-100 dark:border-gray-800 flex flex-col justify-center">
                  <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">Turnos</span>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">{stats.shiftCount}</span>
                  </div>
              </div>

              {/* Category Breakdown */}
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