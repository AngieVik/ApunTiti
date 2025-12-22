/**
 * ApunTiti - Centralized Style System
 * All Tailwind CSS classes consolidated here
 * Using semantic tokens for aggressive theming
 */

export const APP_STYLES = {
  /**
   * HEADER - Top navigation bar and controls
   */
  HEADER: {
    // Main header container
    container:
      "bg-surface-elevated/90 backdrop-blur-md p-2 shadow-xl sticky top-0 z-50 border-b border-accent/20",
    innerContainer: "container mx-auto flex justify-between items-center",

    // Date/Time display
    dateTimeWrapper: "flex flex-col justify-center items-start mr-4",
    dateText:
      "text-[10px] sm:text-[12px] md:text-[14px] font-medium text-accent uppercase tracking-widest leading-tight",
    timeText:
      "text-[12px] sm:text-[14px] md:text-[16px] font-mono font-black text-text-primary leading-tight",

    // Navigation
    navContainer: "flex-1 flex justify-center items-center gap-2",
    navButtonsWrapper: "flex items-center gap-1",
    navButtonBase:
      "flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 px-2 py-2 rounded-lg transition-all duration-200 w-full sm:w-auto",
    navButtonActive: "bg-accent text-accent-on shadow-inner font-bold",
    navButtonInactive: "text-text-secondary hover:bg-surface-interactive",
    navButtonIcon: "flex items-center justify-center",
    navButtonLabel: "hidden sm:inline",

    // Theme toggle button
    themeButton:
      "p-2 rounded-full text-text-secondary hover:text-accent hover:bg-surface-interactive transition-colors duration-200 border border-transparent hover:border-accent/50 flex items-center justify-center",
  },

  /**
   * REGISTRO - Time registration form and summaries (ClockView)
   */
  REGISTRO: {
    // Main container
    container: "space-y-2",

    // REGISTRAR TURNO //
    card: "",
    cardHeader: "flex items-center justify-between mb-2",
    cardTitle:
      "text-sm font-black text-text-primary uppercase tracking-widest leading-none",
    cardTitleAccent: "text-accent",

    // Error alert
    errorAlert:
      "bg-error-bg border-l-2 border-error text-error p-1 mb-2 rounded text-xs",

    // Form grid
    formGrid: "grid grid-cols-2 gap-2",
    formColSpan1: "col-span-1",

    // Input field specific classes (picker filter stays for dark mode icon visibility)
    dateInput:
      "[&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:cursor-pointer dark:[&::-webkit-calendar-picker-indicator]:invert",
    timeInput:
      "font-mono tracking-widest text-center [&::-webkit-calendar-picker-indicator]:w-6 [&::-webkit-calendar-picker-indicator]:h-6 [&::-webkit-calendar-picker-indicator]:cursor-pointer dark:[&::-webkit-calendar-picker-indicator]:invert",

    // Save button container
    buttonContainer: "flex justify-end pt-2",
    saveButton: "px-6",

    // Summary Card
    summaryCard: "relative overflow-hidden p-3",
    summaryBorder: "absolute top-0 left-0 w-1 h-full bg-border",
    summaryHeader: "flex justify-between items-center mb-3 pl-2",
    summaryTitleSmall:
      "text-sm font-black text-text-primary uppercase tracking-widest mb-0.5",

    // Month selector
    monthSelector: "flex items-center gap-1",
    monthNavButton:
      "p-0.5 rounded hover:bg-surface-interactive text-text-muted transition-colors",
    monthTitle: "text-[10px] font-black text-text-primary uppercase",
    monthYearSmall: "text-text-muted text-[10px]",

    // Summary stats grid
    statsGrid: "grid grid-cols-2 gap-2 pl-2",
    statsBlock: "bg-surface-subtle p-2 rounded border border-border-subtle",
    statsBlockFlex:
      "bg-surface-subtle p-2 rounded border border-border-subtle flex flex-col justify-center",
    statsRow: "flex justify-between items-center mb-1",
    statsRowNoMargin: "flex justify-between items-center",
    statsLabel: "text-xs font-bold text-text-primary uppercase",
    statsValueHours: "text-xs font-bold text-success",
    statsValueEarnings: "text-xs font-bold text-success",
    statsValueCount: "text-xs font-bold text-text-primary",

    // Category breakdown
    categoryGrid:
      "col-span-2 bg-surface-subtle p-2 rounded border border-border-subtle",
    categoryWrapper: "flex flex-wrap gap-2",
    categoryBadge:
      "flex items-center gap-1 text-xs bg-surface-elevated px-1.5 py-0.5 rounded border border-border-subtle",
    categoryName: "text-text-primary",
    categoryCount: "font-bold text-text-primary",
    categoryEmpty: "text-xs text-text-secondary italic",
  },

  /**
   * CALENDARIO - Calendar grid, cells and date controls
   */
  CALENDARIO: {
    // Main container
    container: "space-y-2",

    // Controls card
    controlsCard: "print:hidden bg-surface-elevated",
    controlsInner: "flex items-center justify-between gap-2 py-1",

    // View buttons group
    viewButtonsGroup: "flex grow items-center gap-1 min-w-0",
    viewButton: "px-1 h-8 uppercase rounded-lg",
    viewButtonActive:
      "h-8 text-xs text-accent-on bg-accent font-bold border border-accent shadow-sm focus:outline-none focus:ring-1 focus:ring-accent/50 hover:bg-accent-hover transition-all cursor-pointer",
    viewButtonInactive:
      "h-8 text-xs text-text-primary bg-surface-subtle font-mono border border-border shadow-sm focus:outline-none focus:ring-1 focus:ring-accent/50 hover:border-accent transition-all cursor-pointer",

    // Date range selectors
    dateSelectorsGroup: "flex grow items-center min-w-0 justify-end gap-1",
    dateInput:
      "uppercase px-1 h-8 text-xs text-text-primary bg-surface-subtle rounded-lg font-mono border border-border shadow-sm focus:outline-none focus:ring-1 focus:ring-accent/50 hover:border-accent transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:-ml-2 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5 dark:[&::-webkit-calendar-picker-indicator]:invert",

    // Print header
    printHeader: "hidden print:block mb-4 border-b pb-2",
    printTitle: "text-xl font-bold",
    printSubtitle: "text-sm text-text-muted",

    // Printable area card
    printableCard:
      "min-h-[300px] print:shadow-none print:border-none print:p-0",
    navigationHeader:
      "flex items-center justify-between mb-4 pb-2 border-b border-border-subtle",
    navButton: "!px-2 !w-8 h-7",
    navTitle:
      "text-xs font-black text-center text-text-primary uppercase tracking-wide",

    // Calendar grids
    weekdayHeader:
      "grid grid-cols-7 text-center font-bold bg-surface-subtle p-1.5 rounded-t-lg border-b border-border-subtle",
    weekdayLabel: "text-xs uppercase tracking-widest text-text-primary",
    monthGrid:
      "grid grid-cols-7 bg-surface-elevated rounded-b-lg overflow-hidden",

    // Month view cells
    emptyCell: "h-16 md:h-20 border border-border-subtle bg-surface-subtle/50",
    dayCell:
      "h-16 md:h-20 p-1 border border-border-subtle cursor-pointer transition-all hover:bg-accent-subtle relative flex flex-col group",
    dayCellSelected: "ring-1 ring-inset ring-accent z-10",
    dayCellHeader: "flex justify-between items-start",
    dayNumber:
      "w-5 h-5 text-xs flex items-center justify-center rounded-full mb-0.5 font-bold",
    dayNumberToday: "bg-accent text-accent-on",
    dayNumberDefault: "text-text-secondary group-hover:text-text-primary",
    dayEarnings: "text-[9px] font-bold text-success",
    dayShiftsContainer: "flex-1 overflow-hidden flex flex-col gap-0.5",
    dayHoursBadge:
      "text-[9px] bg-info-bg text-info rounded px-1 py-0 font-bold text-center leading-tight",
    dayShiftIndicator: "h-0.5 rounded-full bg-success w-full",

    // Month total summary
    monthTotal:
      "mt-2 p-2 bg-surface-subtle rounded-lg border border-border-subtle flex justify-between items-center",
    monthTotalLabel: "text-xs font-bold text-text-secondary uppercase",
    monthTotalValue: "block text-sm font-mono font-bold text-text-primary",
    monthTotalEarnings: "text-xs font-bold text-success",

    // Year view
    yearGrid: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2",
    yearMonthCard:
      "p-2 border rounded-lg cursor-pointer hover:border-accent/50 transition-all",
    yearMonthCardActive: "border-accent bg-accent-subtle",
    yearMonthCardInactive: "border-border-subtle bg-surface-subtle",
    yearMonthTitle:
      "font-bold text-xs text-text-primary uppercase tracking-wide",
    yearMonthStats: "flex justify-between items-end mt-1",
    yearMonthHours: "text-xs font-mono text-text-secondary",
    yearMonthMoney: "text-xs font-bold text-success",

    // Week view
    weekContainer:
      "flex border border-border-subtle rounded-lg overflow-x-auto overflow-y-hidden bg-surface-elevated min-w-full",
    weekDayColumn:
      "flex-1 min-w-12 sm:min-w-20 md:min-w-24 min-h-28 sm:min-h-36 border-r border-border-subtle last:border-r-0 p-1 sm:p-1.5 hover:bg-surface-interactive cursor-pointer transition-colors",
    weekDayHeader:
      "text-center border-b border-border-subtle pb-0.5 sm:pb-1 mb-0.5 sm:mb-1",
    weekDayName:
      "block text-[8px] sm:text-[9px] md:text-xs font-bold text-text-muted uppercase tracking-widest",
    weekDayNumber: "block text-sm sm:text-base md:text-lg font-black",
    weekDayNumberToday: "text-accent",
    weekDayNumberDefault: "text-text-primary",
    weekShiftsList: "space-y-0.5",
    weekShiftBadge:
      "text-[9px] sm:text-[10px] md:text-xs p-0.5 bg-accent-subtle border-l-2 border-accent rounded mb-0.5",
    weekShiftTime: "font-bold text-accent leading-tight truncate",
    weekShiftCategory: "truncate text-text-secondary leading-tight",
    weekDayTotal:
      "mt-auto pt-0.5 sm:pt-1 text-center font-mono font-bold text-text-muted text-[9px] sm:text-[10px] md:text-xs",
    weekTotal:
      "mt-2 p-2 bg-surface-subtle rounded-lg border border-border-subtle flex justify-between items-center",

    // Day view
    dayViewContainer: "space-y-2",
    dayViewTitle:
      "flex items-baseline gap-2 border-b border-border-subtle pb-1",
    dayViewTitleText:
      "text-lg font-black text-text-primary capitalize leading-tight",
    dayViewSubtitle: "text-sm text-text-secondary",
    dayViewShiftsList: "space-y-2",
    dayViewShiftCard:
      "group flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-surface-elevated border border-border-subtle border-l-2 border-l-accent rounded-lg shadow-sm",
    dayViewShiftContent: "flex-1 w-full",
    dayViewShiftHeader: "flex items-center gap-2 mb-0.5",
    dayViewShiftTime: "text-sm font-mono font-bold text-text-primary",
    dayViewShiftDuration:
      "px-1.5 py-0 text-xs font-bold bg-surface-subtle rounded text-text-secondary",
    dayViewShiftEarnings:
      "px-1.5 py-0 text-xs font-bold bg-success-bg text-success rounded border border-success/20",
    dayViewShiftMeta: "flex gap-2 text-xs",
    dayViewShiftCategory: "font-bold text-accent uppercase tracking-wide",
    dayViewShiftSeparator: "text-border",
    dayViewShiftType: "text-text-secondary font-medium",
    dayViewShiftNotes:
      "text-xs text-text-muted mt-1 italic border-t border-border-subtle pt-1 block",
    dayViewShiftActions:
      "flex gap-2 mt-2 sm:mt-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity self-end sm:self-center",
    dayViewEditButton:
      "p-1.5 rounded bg-surface-subtle text-text-muted hover:text-info hover:bg-info-bg transition-colors",
    dayViewDeleteButton:
      "p-1.5 rounded bg-surface-subtle text-text-muted hover:text-error hover:bg-error-bg transition-colors",
    dayViewNoShifts:
      "py-8 text-center rounded-lg border border-dashed border-border bg-surface-subtle/50",
    dayViewNoShiftsText: "text-xs text-text-muted font-medium",
    dayViewTotal:
      "mt-2 p-2 bg-surface-subtle rounded-lg border border-border-subtle flex justify-between items-center",
    dayViewTotalLabel: "text-xs font-bold text-text-secondary uppercase",
    dayViewTotalValue: "block text-lg font-mono font-bold text-text-primary",
    dayViewTotalEarnings: "text-xs font-bold text-success",

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
      "min-h-9 border border-border-subtle bg-surface-elevated p-0.5 rounded cursor-pointer hover:border-accent transition-colors flex flex-col",
    rangeDayHeader:
      "text-center border-b border-border-subtle pb-0.5 mb-0.5 flex justify-between items-center px-0.5",
    rangeDayName:
      "block text-[7px] font-bold text-text-muted uppercase tracking-widest",
    rangeDayNumber: "block text-xs font-black text-text-primary leading-tight",
    rangeShiftsList: "space-y-0.5 flex-1",
    rangeShiftBadge:
      "text-[7px] p-0.5 bg-accent-subtle border-l-2 border-accent rounded mb-0.5 truncate leading-tight",
    rangeShiftTime: "font-bold text-accent",
    rangeDayTotal: "mt-0.5 text-right border-t border-border-subtle pt-0.5",
    rangeDayTotalValue:
      "block font-mono font-bold text-[8px] text-text-primary leading-none",

    // Summary cards (for totals display)
    summaryCardsContainer: "flex gap-2 items-center print:hidden",
    summaryCard:
      "bg-surface-elevated border border-border rounded-lg p-2 min-w-24",
    summaryCardTitle:
      "text-[9px] font-bold uppercase text-text-muted tracking-wide mb-1",
    summaryCardValue: "text-sm font-mono font-black text-text-primary",
    summaryCardEarnings: "text-xs font-bold text-success",

    // Filter dropdowns
    filtersContainer: "flex flex-wrap gap-2 items-center print:hidden",
    filterDropdown: "min-w-24",

    // Controls bar layout
    controlsBarContainer:
      "grid grid-cols-3 md:flex md:flex-row md:items-start items-start gap-2 print:hidden mb-2",

    // Filters section
    controlsBarFiltersSection:
      "col-span-1 flex flex-col md:flex-row gap-2 w-full md:w-auto",
    controlsBarFilterWrapper: "w-full md:w-auto min-w-28",

    // Totals section
    controlsBarTotalsSection: "col-span-1 w-full md:w-auto min-w-24",
    controlsBarTotalsCard: "p-2",
    controlsBarTotalItem:
      "mb-2 pb-2 border-b-2 border-border last:mb-0 last:pb-0 last:border-b-0",
    controlsBarTotalTitle:
      "text-[9px] font-bold uppercase text-text-muted tracking-wide mb-1",
    controlsBarTotalHours:
      "text-sm font-mono font-black text-text-primary leading-none mb-0.5",
    controlsBarTotalMoney: "text-xs font-bold text-success leading-none",

    // Buttons section
    controlsBarButtonsSection:
      "col-span-1 flex flex-col md:flex-row gap-2 w-full md:w-auto",
    controlsBarButton: "h-8 text-xs px-3 w-full md:w-auto",

    // Day grid for range mode
    dayGridContainer: "grid grid-cols-7 gap-2",
    dayGridCard:
      "border border-border rounded-lg p-2 cursor-pointer hover:border-accent transition-colors bg-surface-elevated",
    dayGridDate: "text-xs font-bold text-text-primary mb-1",
    dayGridHours: "text-[10px] font-mono text-text-secondary",
    dayGridEarnings: "text-[10px] font-bold text-success",

    // Month carousel for range mode
    monthCarouselContainer: "space-y-2 mt-4",
    monthCarouselItem: "border border-border rounded-lg p-2 bg-surface-subtle",
    monthCarouselTitle: "text-xs font-bold text-text-primary mb-2",

    // Download button
    downloadContainer: "flex justify-end print:hidden",
    downloadButton: "flex items-center gap-1",

    // Edit modal
    editModal:
      "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-base/80 backdrop-blur-sm animate-in fade-in duration-200",
    editModalContent:
      "bg-surface-elevated rounded-xl shadow-2xl border border-accent/30 max-w-lg w-full p-4",
    editModalHeader: "flex justify-between items-center mb-4",
    editModalTitle:
      "text-sm font-black text-text-primary uppercase tracking-wide",
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
      "text-sm font-black text-text-primary mb-1 uppercase tracking-wide",
    sectionDesc: "text-xs text-text-muted mb-1",

    // General settings
    generalCard: "",

    // Backup card
    backupCard: "",
    backupGrid: "grid grid-cols-2 gap-2",
    backupButtonText: "text-[10px]",
    backupButtonContainer: "flex justify-center items-center gap-2",
    fileInputHidden: "hidden",

    // Categories section
    categoriesCard: "",
    categoriesFormGrid: "grid grid-cols-[1fr_auto] gap-2 mb-3 items-end",
    categoriesList:
      "divide-y divide-border-subtle border border-border-subtle rounded-lg overflow-hidden",
    categoryItem:
      "p-1 flex justify-between items-center bg-surface-subtle/50 hover:bg-surface-interactive transition-colors",
    categoryEditContainer:
      "flex items-center gap-2 flex-1 mr-2 animate-in fade-in",
    categoryEditInput:
      "flex-1 px-2 h-7 bg-surface-elevated border border-accent rounded text-xs outline-none",
    categoryEditSave: "text-success hover:bg-success-bg transition-colors",
    categoryEditCancel: "text-error hover:bg-error-bg transition-colors",
    categoryName: "font-bold text-xs text-text-primary pl-1",
    categoryActions: "flex gap-1",
    categoryEditButton:
      "p-1 text-text-muted hover:text-info hover:bg-info-bg rounded transition-colors",
    categoryDeleteButton:
      "p-1 text-text-muted hover:text-error hover:bg-error-bg rounded transition-colors",

    // Hour types section
    hourTypesCard: "",
    hourTypesFormGrid: "grid grid-cols-[2fr_1fr_auto] gap-2 mb-3 items-end",
    hourTypesList:
      "divide-y divide-border-subtle border border-border-subtle rounded-lg overflow-hidden",
    hourTypeItem:
      "p-1 flex justify-between items-center bg-surface-subtle/50 hover:bg-surface-interactive transition-colors",
    hourTypeEditContainer:
      "flex items-center gap-2 flex-1 mr-2 animate-in fade-in",
    hourTypeEditNameInput:
      "flex-[2] px-2 h-7 bg-surface-elevated border border-accent rounded text-xs outline-none",
    hourTypeEditPriceInput:
      "flex-1 w-16 px-2 h-7 bg-surface-elevated border border-accent rounded text-xs outline-none",
    hourTypeEditSave:
      "text-success hover:bg-success-bg rounded transition-colors",
    hourTypeEditCancel:
      "text-error hover:bg-error-bg p-1 rounded transition-colors",
    hourTypeDisplay: "flex items-center gap-2 pl-1",
    hourTypeName: "font-bold text-xs text-text-primary",
    hourTypePrice:
      "text-[10px] bg-success-bg text-success px-1.5 py-0 rounded border border-success/20 font-mono",
    hourTypeActions: "flex gap-1",
    hourTypeEditButton:
      "p-1 text-text-muted hover:text-info hover:bg-info-bg rounded transition-colors",
    hourTypeDeleteButton:
      "p-1 text-text-muted hover:text-error hover:bg-error-bg rounded transition-colors",
  },

  /**
   * MODOS - Global layout modes and UI components
   */
  MODOS: {
    // App root container
    appRoot:
      "min-h-screen bg-surface-base text-text-primary font-sans transition-colors duration-300",

    // Main content container
    mainContainer: "container mx-auto p-2 sm:p-4 lg:p-6 pb-20 max-w-4xl",

    // UI Components - Card
    uiCard:
      "bg-surface-elevated p-3 rounded-lg shadow-sm border border-border-subtle",

    // UI Components - Button base (legacy - use BUTTON_VARIANTS from components.ts)
    uiButtonBase:
      "relative h-8 px-4 rounded flex items-center justify-center font-bold uppercase tracking-wider text-[10px] transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed",
    uiButtonPrimary:
      "bg-accent hover:bg-accent-hover text-accent-on shadow-md shadow-accent/10 active:translate-y-0.5",
    uiButtonSecondary:
      "bg-surface-elevated hover:bg-surface-interactive text-text-secondary border border-border shadow-sm active:translate-y-0.5",
    uiButtonDanger:
      "bg-error-bg hover:bg-error/10 text-error border border-error/20 active:translate-y-0.5",

    // UI Components - Input (legacy - use INPUT_VARIANTS from components.ts)
    uiInputWrapper: "w-full group",
    uiInputLabel:
      "block text-[9px] font-bold text-text-secondary mb-0.5 uppercase tracking-wider group-focus-within:text-accent transition-colors",
    uiInputField:
      "w-full px-2 h-8 bg-surface-subtle border border-border rounded focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent text-text-primary text-xs font-medium transition-all",

    // UI Components - Select (legacy - use SELECT_VARIANTS from components.ts)
    uiSelectWrapper: "w-full group",
    uiSelectLabel:
      "block text-[9px] font-bold text-text-secondary mb-0.5 uppercase tracking-wider group-focus-within:text-accent transition-colors",
    uiSelectContainer: "relative",
    uiSelectField:
      "w-full pl-2 pr-6 h-8 bg-surface-subtle border border-border rounded focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent text-text-primary text-xs font-medium transition-all appearance-none cursor-pointer",
    uiSelectArrow:
      "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-muted",

    // UI Components - Confirm Dialog
    confirmDialogOverlay:
      "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-base/80 backdrop-blur-sm animate-in fade-in duration-200",
    confirmDialogContent:
      "bg-surface-elevated rounded-xl border border-border-subtle max-w-sm w-full p-5 shadow-2xl",
    confirmDialogTitle:
      "text-sm font-black text-text-primary mb-2 uppercase tracking-wide",
    confirmDialogMessage: "text-text-secondary mb-6 text-xs leading-relaxed",
    confirmDialogActions: "flex justify-end gap-2",

    // UI Components - Toast
    toastContainer:
      "fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-3 rounded shadow-xl animate-in slide-in-from-bottom-5 fade-in duration-300 min-w-[300px] justify-center",
    toastSuccess: "bg-success text-white",
    toastError: "bg-error text-white",
    toastInfo: "bg-info text-white",
    toastText: "text-[10px] font-bold uppercase tracking-wide",

    // Icons
    iconSmall: "w-4 h-4",
    iconMedium: "w-6 h-6",
    iconContent: "w-4 h-4 text-text-secondary",
    iconGreyBlue:
      "w-4 h-4 text-text-muted hover:text-info rounded transition-colors",

    // Utilities
    animateSpin: "animate-spin",
    textAccent: "text-accent",
    textSuccess: "text-success",
    textError: "text-error",
  },
} as const;

export type AppStyles = typeof APP_STYLES;
