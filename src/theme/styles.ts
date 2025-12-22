/**
 * ApunTiti - Centralized Style System
 * All Tailwind CSS classes consolidated here
 * Following architecture defined in rules.md
 */

export const APP_STYLES = {
  /**
   * HEADER - Top navigation bar and controls
   */
  HEADER: {
    // Main header container
    container:
      "bg-white/90 dark:bg-black/90 backdrop-blur-md p-2 shadow-xl sticky top-0 z-50 border-b border-yellow-500/20",
    innerContainer: "container mx-auto flex justify-between items-center",

    // Date/Time display
    dateTimeWrapper: "flex flex-col justify-center items-start mr-4",
    dateText:
      "text-[10px] sm:text-[12px] md:text-[14px] font-medium text-yellow-600 dark:text-yellow-500 uppercase tracking-widest leading-tight",
    timeText:
      "text-[12px] sm:text-[14px] md:text-[16px] font-mono font-black text-gray-900 dark:text-white leading-tight",

    // Navigation
    navContainer: "flex-1 flex justify-center items-center gap-2",
    navButtonsWrapper: "flex items-center gap-1",
    navButtonBase:
      "flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 px-2 py-2 rounded-lg transition-all duration-200 w-full sm:w-auto",
    navButtonActive: "bg-yellow-500 text-black shadow-inner font-bold",
    navButtonInactive:
      "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800",
    navButtonIcon: "flex items-center justify-center",
    navButtonLabel: "hidden sm:inline",

    // Theme toggle button
    themeButton:
      "p-2 rounded-full text-gray-600 dark:text-yellow-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200 border border-transparent dark:border-yellow-500/50 flex items-center justify-center",
  },

  /**
   * REGISTRO - Time registration form and summaries (ClockView)
   */
  REGISTRO: {
    // Main container
    container: "space-y-2",

    // REGISTRAR TURNO //
    card: "border-t-2 border-t-yellow-500",
    cardHeader: "flex items-center justify-between mb-2",
    cardTitle:
      "text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none",
    cardTitleAccent: "text-yellow-600 dark:text-yellow-500",

    // Error alert
    errorAlert:
      "bg-red-100 border-l-2 border-red-500 text-red-700 p-1 mb-2 rounded text-xs",

    // Form grid
    formGrid: "grid grid-cols-2 gap-2",
    formColSpan1: "col-span-1",

    // Input field specific classes
    dateInput:
      "[&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:cursor-pointer dark:[&::-webkit-calendar-picker-indicator]:[filter:invert(69%)_sepia(58%)_saturate(543%)_hue-rotate(2deg)_brightness(96%)_contrast(90%)]",
    timeInput:
      "font-mono tracking-widest text-center [&::-webkit-calendar-picker-indicator]:w-6 [&::-webkit-calendar-picker-indicator]:h-6 [&::-webkit-calendar-picker-indicator]:cursor-pointer dark:[&::-webkit-calendar-picker-indicator]:[filter:invert(69%)_sepia(58%)_saturate(543%)_hue-rotate(2deg)_brightness(96%)_contrast(90%)]",

    // Save button container
    buttonContainer: "flex justify-end pt-2",
    saveButton: "px-6",

    // Summary Card
    summaryCard: "relative overflow-hidden p-3",
    summaryBorder:
      "absolute top-0 left-0 w-1 h-full bg-gray-200 dark:bg-gray-800",
    summaryHeader: "flex justify-between items-center mb-3 pl-2",
    summaryTitleSmall:
      "text-sm font-black text-gray-900 dark:text-gray-300 uppercase tracking-widest mb-0.5",

    // Month selector
    monthSelector: "flex items-center gap-1",
    monthNavButton:
      "p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors",
    monthTitle:
      "text-[10px] font-black text-gray-900 dark:text-white uppercase",
    monthYearSmall: "text-gray-400 text-[10px]",

    // Summary stats grid
    statsGrid: "grid grid-cols-2 gap-2 pl-2",
    statsBlock:
      "bg-gray-50 dark:bg-[#1a1a1a] p-2 rounded border border-gray-100 dark:border-gray-800",
    statsBlockFlex:
      "bg-gray-50 dark:bg-[#1a1a1a] p-2 rounded border border-gray-100 dark:border-gray-800 flex flex-col justify-center",
    statsRow: "flex justify-between items-center mb-1",
    statsRowNoMargin: "flex justify-between items-center",
    statsLabel: "text-xs font-bold text-gray-900 dark:text-gray-200 uppercase",
    statsValueHours: "text-xs font-bold text-green-600 dark:text-green-500",
    statsValueEarnings: "text-xs font-bold text-green-600 dark:text-green-500",
    statsValueCount: "text-xs font-bold text-gray-900 dark:text-gray-200",

    // Category breakdown
    categoryGrid:
      "col-span-2 bg-gray-50 dark:bg-[#1a1a1a] p-2 rounded border border-gray-100 dark:border-gray-800",
    categoryWrapper: "flex flex-wrap gap-2",
    categoryBadge:
      "flex items-center gap-1 text-xs bg-white dark:bg-black px-1.5 py-0.5 rounded border border-gray-100 dark:border-gray-800",
    categoryName: "text-gray-900 dark:text-gray-200",
    categoryCount: "font-bold text-gray-900 dark:text-gray-200",
    categoryEmpty: "text-xs text-gray-900 dark:text-gray-200 italic",
  },

  /**
   * CALENDARIO - Calendar grid, cells and date controls
   */
  CALENDARIO: {
    // Main container
    container: "space-y-2",

    // Controls card
    controlsCard: "print:hidden bg-white dark:bg-[#111]",
    // CORRECCIÓN: flex, justify-between (izquierda/derecha), sin wrap, sin overflow
    controlsInner: "flex items-center justify-between gap-2 py-1",

    // BOTONES SELECTORES // AÑO MES SEM DÍA //
    // View buttons group
    viewButtonsGroup: "flex grow items-center gap-1 min-w-0",
    viewButton: "px-1 h-8 uppercase rounded-lg",
    viewButtonActive:
      "h-8 text-xs text-gray-900 dark:text-gray-900 bg-yellow-500 font-bold border border-yellow-500 shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500/50 focus:border-yellow-500 hover:border-yellow-500 transition-all cursor-pointer",
    viewButtonInactive:
      "h-8 text-xs text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-[#1a1a1a] font-mono border border-gray-200 dark:border dark:border-gray-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500/50 focus:border-yellow-500 hover:border-yellow-500 dark:hover:border-yellow-500 transition-all cursor-pointer",

    // Date range selectors
    dateSelectorsGroup: "flex grow items-center min-w-0 justify-end gap-1 ",
    dateInput:
      "uppercase px-1 h-8 text-xs text-gray-900 dark:text-gray-100 bg-gray-200 rounded-lg dark:bg-[#1a1a1a] font-mono border border-gray-200 dark:border dark:border-gray-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500/50 focus:border-yellow-500 hover:border-yellow-500 dark:hover:border-yellow-500 transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:-ml-2 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:[filter:invert(69%)_sepia(58%)_saturate(543%)_hue-rotate(2deg)_brightness(96%)_contrast(90%)]",
    // Print header
    printHeader: "hidden print:block mb-4 border-b pb-2",
    printTitle: "text-xl font-bold",
    printSubtitle: "text-sm text-gray-500",

    // Printable area card
    printableCard:
      "min-h-[300px] print:shadow-none print:border-none print:p-0",
    navigationHeader:
      "flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-white/5",
    navButton: "!px-2 !w-8 h-7",
    navTitle:
      "text-xs font-black text-center text-gray-900 dark:text-white uppercase tracking-wide",

    // Calendar grids
    weekdayHeader:
      "grid grid-cols-7 text-center font-bold bg-gray-50 dark:bg-[#1a1a1a] p-1.5 rounded-t-lg border-b border-gray-100 dark:border-gray-800",
    weekdayLabel:
      "text-xs uppercase tracking-widest text-gray-900 dark:text-gray-200",
    monthGrid:
      "grid grid-cols-7 bg-white dark:bg-[#111] rounded-b-lg overflow-hidden",

    // Month view cells
    emptyCell:
      "h-16 md:h-20 border border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-[#1a1a1a]/50",
    dayCell:
      "h-16 md:h-20 p-1 border border-gray-100 dark:border-white/5 cursor-pointer transition-all hover:bg-yellow-50 dark:hover:bg-gray-800/50 relative flex flex-col group",
    dayCellSelected: "ring-1 ring-inset ring-yellow-500 z-10",
    dayCellHeader: "flex justify-between items-start",
    dayNumber:
      "w-5 h-5 text-xs flex items-center justify-center rounded-full mb-0.5 font-bold",
    dayNumberToday: "bg-yellow-500 text-black",
    dayNumberDefault:
      "text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white",
    dayEarnings: "text-[9px] font-bold text-green-600 dark:text-green-500",
    dayShiftsContainer: "flex-1 overflow-hidden flex flex-col gap-0.5",
    dayHoursBadge:
      "text-[9px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded px-1 py-0 font-bold text-center leading-tight",
    dayShiftIndicator:
      "h-0.5 rounded-full bg-green-400 dark:bg-green-600 w-full",

    // Month total summary
    monthTotal:
      "mt-2 p-2 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-gray-100 dark:border-white/5 flex justify-between items-center",
    monthTotalLabel:
      "text-xs font-bold text-gray-700 dark:text-gray-300 uppercase",
    monthTotalValue:
      "block text-sm font-mono font-bold text-gray-900 dark:text-white",
    monthTotalEarnings: "text-xs font-bold text-green-600 dark:text-green-400",

    // Year view
    yearGrid: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2",
    yearMonthCard:
      "p-2 border rounded-lg cursor-pointer hover:border-yellow-500/50 transition-all",
    yearMonthCardActive: "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10",
    yearMonthCardInactive:
      "border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#1a1a1a]",
    yearMonthTitle: "font-bold text-xs dark:text-white uppercase tracking-wide",
    yearMonthStats: "flex justify-between items-end mt-1",
    yearMonthHours: "text-xs font-mono text-gray-600 dark:text-gray-300",
    yearMonthMoney: "text-xs font-bold text-green-600 dark:text-green-500",

    // Week view - Responsive: compact on mobile, spacious on desktop
    weekContainer:
      "flex border border-gray-100 dark:border-white/5 rounded-lg overflow-x-auto overflow-y-hidden bg-white dark:bg-[#111] min-w-full",
    weekDayColumn:
      "flex-1 min-w-12 sm:min-w-20 md:min-w-24 min-h-28 sm:min-h-36 border-r border-gray-100 dark:border-white/5 last:border-r-0 p-1 sm:p-1.5 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] cursor-pointer transition-colors",
    weekDayHeader:
      "text-center border-b border-gray-100 dark:border-white/5 pb-0.5 sm:pb-1 mb-0.5 sm:mb-1",
    weekDayName:
      "block text-[8px] sm:text-[9px] md:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest",
    weekDayNumber: "block text-sm sm:text-base md:text-lg font-black",
    weekDayNumberToday: "text-yellow-500",
    weekDayNumberDefault: "text-gray-900 dark:text-white",
    weekShiftsList: "space-y-0.5",
    weekShiftBadge:
      "text-[9px] sm:text-[10px] md:text-xs p-0.5 bg-yellow-100 dark:bg-yellow-900/20 border-l-2 border-yellow-500 rounded mb-0.5",
    weekShiftTime: "font-bold dark:text-yellow-200 leading-tight truncate",
    weekShiftCategory:
      "truncate text-gray-700 dark:text-gray-300 leading-tight",
    weekDayTotal:
      "mt-auto pt-0.5 sm:pt-1 text-center font-mono font-bold text-gray-500 dark:text-gray-400 text-[9px] sm:text-[10px] md:text-xs",
    weekTotal:
      "mt-2 p-2 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-gray-100 dark:border-white/5 flex justify-between items-center",

    // Day view
    dayViewContainer: "space-y-2",
    dayViewTitle:
      "flex items-baseline gap-2 border-b border-gray-100 dark:border-white/5 pb-1",
    dayViewTitleText:
      "text-lg font-black text-gray-900 dark:text-white capitalize leading-tight",
    dayViewSubtitle: "text-sm text-gray-600 dark:text-gray-300",
    dayViewShiftsList: "space-y-2",
    dayViewShiftCard:
      "group flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 border-l-2 border-l-yellow-500 rounded-lg shadow-sm",
    dayViewShiftContent: "flex-1 w-full",
    dayViewShiftHeader: "flex items-center gap-2 mb-0.5",
    dayViewShiftTime:
      "text-sm font-mono font-bold text-gray-900 dark:text-white",
    dayViewShiftDuration:
      "px-1.5 py-0 text-xs font-bold bg-gray-100 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300",
    dayViewShiftEarnings:
      "px-1.5 py-0 text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded border border-green-200 dark:border-green-800",
    dayViewShiftMeta: "flex gap-2 text-xs",
    dayViewShiftCategory:
      "font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-wide",
    dayViewShiftSeparator: "text-gray-300",
    dayViewShiftType: "text-gray-600 dark:text-gray-300 font-medium",
    dayViewShiftNotes:
      "text-xs text-gray-500 dark:text-gray-400 mt-1 italic border-t border-gray-100 dark:border-white/5 pt-1 block",
    dayViewShiftActions:
      "flex gap-2 mt-2 sm:mt-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity self-end sm:self-center",
    dayViewEditButton:
      "p-1.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors",
    dayViewDeleteButton:
      "p-1.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors",
    dayViewNoShifts:
      "py-8 text-center rounded-lg border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1a1a1a]/50",
    dayViewNoShiftsText: "text-xs text-gray-500 dark:text-gray-400 font-medium",
    dayViewTotal:
      "mt-2 p-2 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-gray-100 dark:border-white/5 flex justify-between items-center",
    dayViewTotalLabel:
      "text-xs font-bold text-gray-700 dark:text-gray-300 uppercase",
    dayViewTotalValue:
      "block text-lg font-mono font-bold text-gray-900 dark:text-white",
    dayViewTotalEarnings:
      "text-xs font-bold text-green-600 dark:text-green-400",

    // Range view
    rangeContainer: "space-y-2",
    rangeHeader:
      "flex justify-between items-baseline border-b border-gray-100 dark:border-white/5 pb-1 mb-2",
    rangeTitle:
      "text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide",
    rangeSubtitle: "text-xs text-gray-500",
    rangeTotalValue:
      "block font-mono font-bold text-lg text-gray-900 dark:text-white leading-none",
    rangeTotalEarnings:
      "block font-bold text-xs text-green-600 dark:text-green-500",
    rangeGrid: "grid grid-cols-7 gap-1",
    rangeDayCard:
      "min-h-9 border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1a1a1a] p-0.5 rounded cursor-pointer hover:border-yellow-500 transition-colors flex flex-col",
    rangeDayHeader:
      "text-center border-b border-gray-100 dark:border-white/5 pb-0.5 mb-0.5 flex justify-between items-center px-0.5",
    rangeDayName:
      "block text-[7px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest",
    rangeDayNumber:
      "block text-xs font-black text-gray-900 dark:text-white leading-tight",
    rangeShiftsList: "space-y-0.5 flex-1",
    rangeShiftBadge:
      "text-[7px] p-0.5 bg-yellow-100 dark:bg-yellow-900/20 border-l-2 border-yellow-500 rounded mb-0.5 truncate leading-tight",
    rangeShiftTime: "font-bold dark:text-yellow-200",
    rangeDayTotal:
      "mt-0.5 text-right border-t border-gray-50 dark:border-white/5 pt-0.5",
    rangeDayTotalValue:
      "block font-mono font-bold text-[8px] text-gray-900 dark:text-white leading-none",

    // Summary cards (for totals display)
    summaryCardsContainer: "flex gap-2 items-center print:hidden",
    summaryCard:
      "bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-lg p-2 min-w-24",
    summaryCardTitle:
      "text-[9px] font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wide mb-1",
    summaryCardValue:
      "text-sm font-mono font-black text-gray-900 dark:text-white",
    summaryCardEarnings: "text-xs font-bold text-green-600 dark:text-green-400",

    // Filter dropdowns
    filtersContainer: "flex flex-wrap gap-2 items-center print:hidden",
    filterDropdown: "min-w-24",

    // Controls bar layout - Responsive: Grid 3 cols (Móvil) / Flex (PC)
    controlsBarContainer:
      "grid grid-cols-3 md:flex md:flex-row md:items-start items-start gap-2 print:hidden mb-2",

    // Sección Filtros: Vertical en móvil, Horizontal en PC
    controlsBarFiltersSection:
      "col-span-1 flex flex-col md:flex-row gap-2 w-full md:w-auto",
    controlsBarFilterWrapper: "w-full md:w-auto min-w-28",

    // Sección Totales
    controlsBarTotalsSection: "col-span-1 w-full md:w-auto min-w-24",
    controlsBarTotalsCard: "p-2",
    controlsBarTotalItem:
      "mb-2 pb-2 border-b-2 border-gray-200 dark:border-gray-700 last:mb-0 last:pb-0 last:border-b-0",
    controlsBarTotalTitle:
      "text-[9px] font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wide mb-1",
    controlsBarTotalHours:
      "text-sm font-mono font-black text-gray-900 dark:text-white leading-none mb-0.5",
    controlsBarTotalMoney:
      "text-xs font-bold text-green-600 dark:text-green-400 leading-none",

    // Sección Botones: Vertical en móvil, Horizontal en PC (CORREGIDO AQUI)
    controlsBarButtonsSection:
      "col-span-1 flex flex-col md:flex-row gap-2 w-full md:w-auto",
    controlsBarButton: "h-8 text-xs px-3 w-full md:w-auto",

    // Day grid for range mode
    dayGridContainer: "grid grid-cols-7 gap-2",
    dayGridCard:
      "border border-gray-200 dark:border-white/5 rounded-lg p-2 cursor-pointer hover:border-yellow-500 transition-colors bg-white dark:bg-[#1a1a1a]",
    dayGridDate: "text-xs font-bold text-gray-900 dark:text-white mb-1",
    dayGridHours: "text-[10px] font-mono text-gray-600 dark:text-gray-300",
    dayGridEarnings: "text-[10px] font-bold text-green-600 dark:text-green-400",

    // Month carousel for range mode
    monthCarouselContainer: "space-y-2 mt-4",
    monthCarouselItem:
      "border border-gray-200 dark:border-white/5 rounded-lg p-2 bg-gray-50 dark:bg-[#1a1a1a]/50",
    monthCarouselTitle: "text-xs font-bold text-gray-900 dark:text-white mb-2",

    // Download button
    downloadContainer: "flex justify-end print:hidden",
    downloadButton: "flex items-center gap-1",

    // Edit modal
    editModal:
      "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200",
    editModalContent:
      "bg-white dark:bg-[#121212] rounded-xl shadow-2xl shadow-black border border-yellow-500/30 max-w-lg w-full p-4",
    editModalHeader: "flex justify-between items-center mb-4",
    editModalTitle:
      "text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide",
    editModalGrid: "grid grid-cols-2 gap-3 mb-4",
    editModalColSpan: "col-span-2",
    editModalActions: "flex justify-end gap-2",
  },

  /**
   * CONFIGURACIÓN - Settings panels, toggles, and management
   */
  CONFIGURACIÓN: {
    // Main container
    container: "space-y-3",

    // Card sections
    sectionTitle:
      "text-sm font-black text-gray-900 dark:text-white mb-1 uppercase tracking-wide",
    sectionDesc: "text-xs text-gray-500 dark:text-gray-400 mb-1",

    // General settings
    generalCard: "",

    // Backup card
    backupCard: "border-l-4 border-l-blue-500",
    backupGrid: "grid grid-cols-2 gap-2",
    backupButtonText: "text-[10px]",
    backupButtonContainer: "flex justify-center items-center gap-2",
    fileInputHidden: "hidden",

    // Categories section
    categoriesCard: "",
    categoriesFormGrid: "grid grid-cols-[1fr_auto] gap-2 mb-3 items-end",
    categoriesList:
      "divide-y divide-gray-100 dark:divide-gray-800 border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden",
    categoryItem:
      "p-1 flex justify-between items-center bg-gray-50/50 dark:bg-[#1a1a1a]/50 hover:bg-gray-100 dark:hover:bg-[#222] transition-colors",
    categoryEditContainer:
      "flex items-center gap-2 flex-1 mr-2 animate-in fade-in",
    categoryEditInput:
      "flex-1 px-2 h-7 bg-white dark:bg-black border border-yellow-500 rounded text-xs outline-none",
    categoryEditSave:
      "text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors",
    categoryEditCancel:
      "text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors",
    categoryName: "font-bold text-xs text-gray-700 dark:text-gray-200 pl-1",
    categoryActions: "flex gap-1",
    categoryEditButton:
      "p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors",
    categoryDeleteButton:
      "p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors",

    // Hour types section
    hourTypesCard: "",
    hourTypesFormGrid: "grid grid-cols-[2fr_1fr_auto] gap-2 mb-3 items-end",
    hourTypesList:
      "divide-y divide-gray-100 dark:divide-gray-800 border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden",
    hourTypeItem:
      "p-1 flex justify-between items-center bg-gray-50/50 dark:bg-[#1a1a1a]/50 hover:bg-gray-100 dark:hover:bg-[#222] transition-colors",
    hourTypeEditContainer:
      "flex items-center gap-2 flex-1 mr-2 animate-in fade-in",
    hourTypeEditNameInput:
      "flex-[2] px-2 h-7 bg-white dark:bg-black border border-yellow-500 rounded text-xs outline-none",
    hourTypeEditPriceInput:
      "flex-1 w-16 px-2 h-7 bg-white dark:bg-black border border-yellow-500 rounded text-xs outline-none",
    hourTypeEditSave:
      "text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors",
    hourTypeEditCancel:
      "text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 p-1 rounded transition-colors",
    hourTypeDisplay: "flex items-center gap-2 pl-1",
    hourTypeName: "font-bold text-xs text-gray-700 dark:text-gray-200",
    hourTypePrice:
      "text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0 rounded border border-green-200 dark:border-green-800 font-mono",
    hourTypeActions: "flex gap-1",
    hourTypeEditButton:
      "p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors",
    hourTypeDeleteButton:
      "p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors",
  },

  /**
   * MODOS - Global layout modes and UI components
   */
  MODOS: {
    // App root container
    appRoot:
      "min-h-screen bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300 selection:bg-yellow-500 selection:text-black",

    // Main content container
    mainContainer: "container mx-auto p-2 sm:p-4 lg:p-6 pb-20 max-w-4xl",

    // UI Components - Card
    uiCard:
      "bg-white dark:bg-[#111] p-3 rounded-lg shadow-sm border border-gray-100 dark:border-white/10",

    // UI Components - Button base
    uiButtonBase:
      "relative h-8 px-4 rounded flex items-center justify-center font-bold uppercase tracking-wider text-[10px] transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 dark:focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed",
    uiButtonPrimary:
      "bg-yellow-500 hover:bg-yellow-400 text-black shadow-md shadow-yellow-500/10 active:translate-y-0.5",
    uiButtonSecondary:
      "bg-white dark:bg-[#222] hover:bg-gray-50 dark:hover:bg-[#333] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm active:translate-y-0.5",
    uiButtonDanger:
      "bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/10 dark:text-red-400 border border-red-200 dark:border-red-900/30 active:translate-y-0.5",

    // UI Components - Input
    uiInputWrapper: "w-full group",
    uiInputLabel:
      "block text-[9px] font-bold text-gray-700 dark:text-gray-200 mb-0.5 uppercase tracking-wider group-focus-within:text-yellow-600 dark:group-focus-within:text-yellow-500 transition-colors",
    uiInputField:
      "w-full px-2 h-8 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded focus:outline-none focus:ring-1 focus:ring-yellow-500/50 focus:border-yellow-500 text-gray-900 dark:text-gray-100 text-xs font-medium transition-all",

    // UI Components - Select
    uiSelectWrapper: "w-full group",
    uiSelectLabel:
      "block text-[9px] font-bold text-gray-700 dark:text-gray-200 mb-0.5 uppercase tracking-wider group-focus-within:text-yellow-600 dark:group-focus-within:text-yellow-500 transition-colors",
    uiSelectContainer: "relative",
    uiSelectField:
      "w-full pl-2 pr-6 h-8 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded focus:outline-none focus:ring-1 focus:ring-yellow-500/50 focus:border-yellow-500 text-gray-900 dark:text-gray-100 text-xs font-medium transition-all appearance-none cursor-pointer",
    uiSelectArrow:
      "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400",

    // UI Components - Confirm Dialog
    confirmDialogOverlay:
      "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200",
    confirmDialogContent:
      "bg-white dark:bg-[#111] rounded-xl border border-white/10 max-w-sm w-full p-5 shadow-2xl",
    confirmDialogTitle:
      "text-sm font-black text-gray-900 dark:text-white mb-2 uppercase tracking-wide",
    confirmDialogMessage:
      "text-gray-600 dark:text-gray-300 mb-6 text-xs leading-relaxed",
    confirmDialogActions: "flex justify-end gap-2",

    // UI Components - Toast
    toastContainer:
      "fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-3 rounded shadow-xl animate-in slide-in-from-bottom-5 fade-in duration-300 min-w-[300px] justify-center",
    toastSuccess: "bg-green-500 text-white",
    toastError: "bg-red-500 text-white",
    toastInfo: "bg-blue-500 text-white",
    toastText: "text-[10px] font-bold uppercase tracking-wide",

    // Icons
    iconSmall: "w-4 h-4",
    iconMedium: "w-6 h-6",
    // Icono genérico para contenido (no header/nav) que asegura visibilidad en dark mode (amarillo)
    iconContent: "w-4 h-4 text-gray-700 dark:text-yellow-500",
    // Icono con hover interactivo para acciones de edición/eliminación (gris → azul)
    iconGreyBlue:
      "w-4 h-4 text-gray-400 hover:text-blue-600/80 rounded transition-colors",
    // Utilities
    animateSpin: "animate-spin",
    textYellow: "text-yellow-500",
    textGreen: "text-green-500",
    textRed: "text-red-500",
  },
} as const;

export type AppStyles = typeof APP_STYLES;
