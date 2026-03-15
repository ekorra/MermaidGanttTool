export type Locale = 'en' | 'no' | 'es' | 'de'

export interface Translations {
  // Toolbar
  projectTitlePlaceholder: string
  settingsLabel: string
  infoLabel: string
  switchToLight: string
  switchToDark: string
  pasteMermaid: string
  hidePreview: string
  showPreview: string
  downloadPng: string
  copyMermaid: string

  // Settings panel
  settingsTitle: string
  dateFormatLabel: string
  axisFormatLabel: string
  axisFormatHint: string
  tickIntervalLabel: string
  tickIntervalHint: string
  excludesLabel: string
  excludesHint: string
  weekdayLabel: string
  weekdayDefault: string
  todayMarkerLabel: string
  languageLabel: string
  closeButton: string

  // Info panel
  infoTitle: string
  infoDescription: string
  infoFeaturesHeading: string
  infoFeatures: string[]
  infoLimitationsHeading: string
  infoLimitations: string[]
  infoWhyHeading: string
  infoWhy: string[]
  infoSupportText: string
  infoLinksHeading: string
  infoLinkMermaidSpec: string
  infoLinkMermaidHome: string
  infoLinkGitHub: string
  infoLinkBugs: string

  // Export PNG modal
  exportPngTitle: string
  exportPngTodayMarkerLabel: string
  exportPngHint: string
  exportPngLoading: string
  exportPngDownload: string
  exportPngCanvasNotFound: string
  exportPngFailed: (msg: string) => string

  // Task list
  sectionNamePlaceholder: string
  deleteSectionTitle: string
  deleteSectionAriaLabel: (title: string) => string
  deleteUngroupedTitle: string
  deleteUngroupedAriaLabel: string
  ungroupedSectionLabel: string
  doubleClickToRename: string
  addTask: string
  addSection: string
  addUngroupedTask: string

  // Task detail panel
  editTaskTitle: string
  closeDetailPanel: string
  taskNameLabel: string
  taskStatusLabel: string
  taskStatusNormal: string
  taskStatusActive: string
  taskStatusDone: string
  taskStatusCrit: string
  taskStatusCritActive: string
  taskStatusCritDone: string
  taskStatusMilestone: string
  taskAfterLabel: string
  taskStartLabel: string
  taskEndLabel: string
  taskDurationLabel: string
  taskDurationPlaceholder: string
  taskLinkLabel: string
  taskColorLabel: string
  taskDurationDays: (days: number) => string
  deleteTaskButton: string
  deleteTaskAriaLabel: (label: string) => string

  // Canvas
  taskWouldBeZero: (label: string) => string
  todayLabel: string

  // Preview
  previewTabSyntax: string
  previewTabPreview: string

  // Syntax pane
  syntaxPaneTitle: string
  copyButton: string
  copiedButton: string

  // EditableLabel
  doubleClickToEdit: string

  // Import
  clipboardReadError: string
  noMermaidInClipboard: string
  mermaidParseError: string
  importConfirm: string

  // Share
  shareButton: string
  shareModalTitle: string
  shareModalCreating: string
  shareModalUrlLabel: string
  shareCopyLink: string
  shareLinkCopied: string
  shareModalLimitations: string[]
  shareModalError: (error: string) => string
  sharedBannerInfo: string
  sharedBannerExpiry: string
  sharedBannerSave: string
  sharedBannerSaving: string
  sharedBannerSaved: string
  sharedBannerSaveError: (error: string) => string
  shareLoadNotFound: string
  shareLoadError: string
}

const en: Translations = {
  // Toolbar
  projectTitlePlaceholder: 'Project title',
  settingsLabel: 'Diagram settings',
  infoLabel: 'About the app',
  switchToLight: 'Switch to light theme',
  switchToDark: 'Switch to dark theme',
  pasteMermaid: 'Paste Mermaid',
  hidePreview: 'Hide preview',
  showPreview: 'Show preview',
  downloadPng: 'Download PNG',
  copyMermaid: 'Copy Mermaid',

  // Settings panel
  settingsTitle: 'Diagram settings',
  dateFormatLabel: 'Date format',
  axisFormatLabel: 'Axis format',
  axisFormatHint: 'strftime format, e.g. %b %d, %Y-%m-%d',
  tickIntervalLabel: 'Tick interval',
  tickIntervalHint: 'e.g. 1day, 1week, 1month',
  excludesLabel: 'Excludes',
  excludesHint: 'e.g. weekends, monday, 2025-12-25',
  weekdayLabel: 'Week start',
  weekdayDefault: '— default (Sunday) —',
  todayMarkerLabel: 'Show "Today" line',
  languageLabel: 'Language',
  closeButton: 'Close',

  // Info panel
  infoTitle: 'About GanttMaker',
  infoDescription: 'A visual tool for creating Mermaid Gantt diagrams. Draw the timeline visually and export valid Mermaid syntax ready to paste into GitHub, Confluence, or other Markdown-based documentation.',
  infoFeaturesHeading: 'Features',
  infoFeatures: [
    'Visual editing — add sections and tasks via a form panel',
    'Drag to move tasks, drag edge to change duration',
    'Dependencies — link tasks with "starts after" and see arrows in the timeline',
    'Milestones — displayed as diamonds',
    'Status types: active, done, crit, crit+active, crit+done, milestone',
    'Click links — opens URL from canvas when you click a task',
    'Tasks without a section (ungrouped)',
    'Settings: date format, week start, excludes, today marker',
    'Export Mermaid syntax with one click',
    'Import Mermaid Gantt from clipboard with "Paste Mermaid"',
    'Diagram saved automatically in the browser (localStorage)',
    'Dark and light theme',
  ],
  infoLimitationsHeading: 'Limitations',
  infoLimitations: [
    'Colors are visual only — not exported to Mermaid syntax',
    'Saved locally in the browser only — not synced across devices',
  ],
  infoWhyHeading: 'Why Mermaid.js?',
  infoWhy: [
    'Diagram-as-text — version-control friendly, diffable',
    'Built-in support in GitHub, GitLab, Notion, Confluence and more',
    'No image files to keep updated',
    'Open source and actively maintained',
  ],
  infoSupportText: 'Like the tool? You can support further development:',
  infoLinksHeading: 'Links',
  infoLinkMermaidSpec: 'Mermaid Gantt specification',
  infoLinkMermaidHome: 'Mermaid.js homepage',
  infoLinkGitHub: 'GanttMaker on GitHub',
  infoLinkBugs: 'Report a bug or suggestion',

  // Export PNG modal
  exportPngTitle: 'Export as PNG',
  exportPngTodayMarkerLabel: 'Include today marker',
  exportPngHint: 'Exports at 2× resolution. Background is transparent.',
  exportPngLoading: 'Exporting…',
  exportPngDownload: 'Download PNG',
  exportPngCanvasNotFound: 'Canvas not found — make sure the diagram is visible.',
  exportPngFailed: (msg) => `PNG export failed: ${msg}`,

  // Task list
  sectionNamePlaceholder: 'Section name',
  deleteSectionTitle: 'Delete section',
  deleteSectionAriaLabel: (title) => `Delete section ${title}`,
  deleteUngroupedTitle: 'Delete ungrouped section',
  deleteUngroupedAriaLabel: 'Delete ungrouped section',
  ungroupedSectionLabel: 'No section',
  doubleClickToRename: 'Double-click to rename',
  addTask: '+ New task',
  addSection: '+ New section',
  addUngroupedTask: '+ Task without section',

  // Task detail panel
  editTaskTitle: 'Edit task',
  closeDetailPanel: 'Close detail panel',
  taskNameLabel: 'Name',
  taskStatusLabel: 'Status',
  taskStatusNormal: 'Normal',
  taskStatusActive: 'Active',
  taskStatusDone: 'Done',
  taskStatusCrit: 'Critical',
  taskStatusCritActive: 'Critical + Active',
  taskStatusCritDone: 'Critical + Done',
  taskStatusMilestone: 'Milestone',
  taskAfterLabel: 'Starts after',
  taskStartLabel: 'Start',
  taskEndLabel: 'End',
  taskDurationLabel: 'Duration',
  taskDurationPlaceholder: 'e.g. 3d, 1w',
  taskLinkLabel: 'Link (URL)',
  taskColorLabel: 'Color',
  taskDurationDays: (days) => `${days} day${days === 1 ? '' : 's'}`,
  deleteTaskButton: 'Delete task',
  deleteTaskAriaLabel: (label) => `Delete task ${label}`,

  // Canvas
  taskWouldBeZero: (label) => `"${label}" would be 0 days or shorter. Delete the task?`,
  todayLabel: 'Today',

  // Preview
  previewTabSyntax: 'Syntax',
  previewTabPreview: 'Preview',

  // Syntax pane
  syntaxPaneTitle: 'Mermaid Syntax',
  copyButton: 'Copy',
  copiedButton: 'Copied!',

  // EditableLabel
  doubleClickToEdit: 'Double-click to edit',

  // Import
  clipboardReadError: 'Could not read clipboard. Make sure the browser has clipboard permission.',
  noMermaidInClipboard: 'No Mermaid Gantt diagram found in clipboard.',
  mermaidParseError: 'Could not parse the Mermaid Gantt diagram in clipboard.',
  importConfirm: 'Import Mermaid Gantt from clipboard? This will replace the current diagram.',

  // Share
  shareButton: 'Share',
  shareModalTitle: 'Share diagram',
  shareModalCreating: 'Creating link…',
  shareModalUrlLabel: 'Share link',
  shareCopyLink: 'Copy link',
  shareLinkCopied: 'Copied!',
  shareModalLimitations: [
    'Anyone with the link can view and edit the diagram',
    'Last save wins — simultaneous edits may overwrite each other',
    'Link expires 30 days after the last save',
    'No version history — saving overwrites the previous state',
  ],
  shareModalError: (error) => `Could not create share link: ${error}`,
  sharedBannerInfo: 'Shared diagram — anyone with this link can edit',
  sharedBannerExpiry: 'Expires 30 days after last save',
  sharedBannerSave: 'Save changes',
  sharedBannerSaving: 'Saving…',
  sharedBannerSaved: 'Saved!',
  sharedBannerSaveError: (error) => `Save failed: ${error}`,
  shareLoadNotFound: 'This share link has expired or does not exist.',
  shareLoadError: 'Could not load the shared diagram.',
}

const no: Translations = {
  // Toolbar
  projectTitlePlaceholder: 'Prosjekttittel',
  settingsLabel: 'Diagraminnstillinger',
  infoLabel: 'Om appen',
  switchToLight: 'Bytt til lyst tema',
  switchToDark: 'Bytt til mørkt tema',
  pasteMermaid: 'Lim inn Mermaid',
  hidePreview: 'Skjul forhåndsvisning',
  showPreview: 'Vis forhåndsvisning',
  downloadPng: 'Last ned PNG',
  copyMermaid: 'Kopier Mermaid',

  // Settings panel
  settingsTitle: 'Diagraminnstillinger',
  dateFormatLabel: 'Datoformat',
  axisFormatLabel: 'Akseformat',
  axisFormatHint: 'strftime-format, f.eks. %b %d, %Y-%m-%d',
  tickIntervalLabel: 'Tikkintervall',
  tickIntervalHint: 'f.eks. 1day, 1week, 1month',
  excludesLabel: 'Ekskluder',
  excludesHint: 'f.eks. weekends, monday, 2025-12-25',
  weekdayLabel: 'Ukestart',
  weekdayDefault: '— standard (søndag) —',
  todayMarkerLabel: 'Vis «Today»-linje',
  languageLabel: 'Språk',
  closeButton: 'Lukk',

  // Info panel
  infoTitle: 'Om GanttMaker',
  infoDescription: 'Et visuelt verktøy for å lage Mermaid Gantt-diagrammer. Tegn tidslinjen visuelt, og eksporter gyldig Mermaid-syntaks klar til å lime inn i GitHub, Confluence eller annen Markdown-basert dokumentasjon.',
  infoFeaturesHeading: 'Funksjoner',
  infoFeatures: [
    'Visuell redigering — legg til seksjoner og oppgaver med et skjemapanel',
    'Dra for å flytte oppgaver, dra kant for å endre varighet',
    'Avhengigheter — koble oppgaver med «starter etter» og se piler i tidslinjen',
    'Milepæler — vises som diamanter',
    'Statustyper: active, done, crit, crit+active, crit+done, milestone',
    'Klikk-lenker — åpner URL fra canvas når du klikker en oppgave',
    'Oppgaver uten seksjon (ungrouped)',
    'Innstillinger: datoformat, ukestart, ekskluderinger, today marker',
    'Eksporter Mermaid-syntaks med ett klikk',
    'Importer Mermaid Gantt fra utklippstavlen med «Lim inn Mermaid»',
    'Diagrammet lagres automatisk i nettleseren (localStorage)',
    'Mørkt og lyst tema',
  ],
  infoLimitationsHeading: 'Begrensninger',
  infoLimitations: [
    'Farger er kun visuelle — de eksporteres ikke til Mermaid-syntaksen',
    'Lagring kun lokalt i nettleseren — ikke synkronisert mellom enheter',
  ],
  infoWhyHeading: 'Hvorfor Mermaid.js?',
  infoWhy: [
    'Diagram-som-tekst — versjonskontrollvennlig, diff-bart',
    'Innebygd støtte i GitHub, GitLab, Notion, Confluence og flere',
    'Ingen bildefiler å holde oppdatert',
    'Åpen kildekode og aktivt vedlikeholdt',
  ],
  infoSupportText: 'Liker du verktøyet? Du kan støtte videre utvikling:',
  infoLinksHeading: 'Lenker',
  infoLinkMermaidSpec: 'Mermaid Gantt-spesifikasjon',
  infoLinkMermaidHome: 'Mermaid.js hjemmeside',
  infoLinkGitHub: 'GanttMaker på GitHub',
  infoLinkBugs: 'Rapporter en feil eller forslag',

  // Export PNG modal
  exportPngTitle: 'Eksporter som PNG',
  exportPngTodayMarkerLabel: 'Inkluder «today»-markør',
  exportPngHint: 'Eksporteres i 2× oppløsning. Bakgrunnen er gjennomsiktig.',
  exportPngLoading: 'Eksporterer…',
  exportPngDownload: 'Last ned PNG',
  exportPngCanvasNotFound: 'Canvas ikke funnet — kontroller at diagrammet er synlig.',
  exportPngFailed: (msg) => `PNG-eksport feilet: ${msg}`,

  // Task list
  sectionNamePlaceholder: 'Seksjonsnavn',
  deleteSectionTitle: 'Slett seksjon',
  deleteSectionAriaLabel: (title) => `Slett seksjon ${title}`,
  deleteUngroupedTitle: 'Slett seksjon uten navn',
  deleteUngroupedAriaLabel: 'Slett seksjon uten navn',
  ungroupedSectionLabel: 'Ingen seksjon',
  doubleClickToRename: 'Dobbeltklikk for å gi nytt navn',
  addTask: '+ Ny oppgave',
  addSection: '+ Ny seksjon',
  addUngroupedTask: '+ Oppgave uten seksjon',

  // Task detail panel
  editTaskTitle: 'Rediger oppgave',
  closeDetailPanel: 'Lukk detaljpanel',
  taskNameLabel: 'Navn',
  taskStatusLabel: 'Status',
  taskStatusNormal: 'Normal',
  taskStatusActive: 'Aktiv',
  taskStatusDone: 'Ferdig',
  taskStatusCrit: 'Kritisk',
  taskStatusCritActive: 'Kritisk + Aktiv',
  taskStatusCritDone: 'Kritisk + Ferdig',
  taskStatusMilestone: 'Milepæl',
  taskAfterLabel: 'Starter etter',
  taskStartLabel: 'Start',
  taskEndLabel: 'Slutt',
  taskDurationLabel: 'Varighet',
  taskDurationPlaceholder: 'f.eks. 3d, 1w',
  taskLinkLabel: 'Lenke (URL)',
  taskColorLabel: 'Farge',
  taskDurationDays: (days) => `${days} dag${days === 1 ? '' : 'er'}`,
  deleteTaskButton: 'Slett oppgave',
  deleteTaskAriaLabel: (label) => `Slett oppgave ${label}`,

  // Canvas
  taskWouldBeZero: (label) => `«${label}» ville bli 0 dager eller kortere. Vil du slette oppgaven?`,
  todayLabel: 'I dag',

  // Preview
  previewTabSyntax: 'Syntaks',
  previewTabPreview: 'Forhåndsvisning',

  // Syntax pane
  syntaxPaneTitle: 'Mermaid-syntaks',
  copyButton: 'Kopier',
  copiedButton: 'Kopiert!',

  // EditableLabel
  doubleClickToEdit: 'Dobbeltklikk for å redigere',

  // Import
  clipboardReadError: 'Kunne ikke lese utklippstavlen. Kontroller at nettleseren har tilgang.',
  noMermaidInClipboard: 'Ingen Mermaid Gantt-diagram funnet i utklippstavlen.',
  mermaidParseError: 'Kunne ikke tolke Mermaid Gantt-diagrammet i utklippstavlen.',
  importConfirm: 'Importer Mermaid Gantt fra utklippstavlen? Dette erstatter gjeldende diagram.',

  // Share
  shareButton: 'Del',
  shareModalTitle: 'Del diagram',
  shareModalCreating: 'Oppretter lenke…',
  shareModalUrlLabel: 'Delingslenke',
  shareCopyLink: 'Kopier lenke',
  shareLinkCopied: 'Kopiert!',
  shareModalLimitations: [
    'Alle med lenken kan se og redigere diagrammet',
    'Siste lagring vinner — samtidige endringer kan overskrives',
    'Lenken utløper 30 dager etter siste lagring',
    'Ingen versjonshistorikk — lagring overskriver forrige tilstand',
  ],
  shareModalError: (error) => `Kunne ikke opprette delingslenke: ${error}`,
  sharedBannerInfo: 'Delt diagram — alle med lenken kan redigere',
  sharedBannerExpiry: 'Utløper 30 dager etter siste lagring',
  sharedBannerSave: 'Lagre endringer',
  sharedBannerSaving: 'Lagrer…',
  sharedBannerSaved: 'Lagret!',
  sharedBannerSaveError: (error) => `Lagring feilet: ${error}`,
  shareLoadNotFound: 'Denne delingslenken har utløpt eller eksisterer ikke.',
  shareLoadError: 'Kunne ikke laste det delte diagrammet.',
}

const es: Translations = {
  // Toolbar
  projectTitlePlaceholder: 'Título del proyecto',
  settingsLabel: 'Configuración del diagrama',
  infoLabel: 'Acerca de la app',
  switchToLight: 'Cambiar a tema claro',
  switchToDark: 'Cambiar a tema oscuro',
  pasteMermaid: 'Pegar Mermaid',
  hidePreview: 'Ocultar vista previa',
  showPreview: 'Mostrar vista previa',
  downloadPng: 'Descargar PNG',
  copyMermaid: 'Copiar Mermaid',

  // Settings panel
  settingsTitle: 'Configuración del diagrama',
  dateFormatLabel: 'Formato de fecha',
  axisFormatLabel: 'Formato de eje',
  axisFormatHint: 'Formato strftime, p. ej. %b %d, %Y-%m-%d',
  tickIntervalLabel: 'Intervalo de marcas',
  tickIntervalHint: 'p. ej. 1day, 1week, 1month',
  excludesLabel: 'Excluir',
  excludesHint: 'p. ej. weekends, monday, 2025-12-25',
  weekdayLabel: 'Inicio de semana',
  weekdayDefault: '— predeterminado (domingo) —',
  todayMarkerLabel: 'Mostrar línea «Hoy»',
  languageLabel: 'Idioma',
  closeButton: 'Cerrar',

  // Info panel
  infoTitle: 'Acerca de GanttMaker',
  infoDescription: 'Una herramienta visual para crear diagramas de Gantt en Mermaid. Dibuja la línea de tiempo visualmente y exporta sintaxis Mermaid válida lista para pegar en GitHub, Confluence u otra documentación basada en Markdown.',
  infoFeaturesHeading: 'Características',
  infoFeatures: [
    'Edición visual — añade secciones y tareas mediante un panel de formulario',
    'Arrastra para mover tareas, arrastra el borde para cambiar la duración',
    'Dependencias — vincula tareas con «comienza después» y ve flechas en la línea de tiempo',
    'Hitos — se muestran como diamantes',
    'Tipos de estado: active, done, crit, crit+active, crit+done, milestone',
    'Enlaces de clic — abre URL desde el canvas al hacer clic en una tarea',
    'Tareas sin sección (sin agrupar)',
    'Configuración: formato de fecha, inicio de semana, exclusiones, marcador de hoy',
    'Exporta sintaxis Mermaid con un clic',
    'Importa Mermaid Gantt desde el portapapeles con «Pegar Mermaid»',
    'El diagrama se guarda automáticamente en el navegador (localStorage)',
    'Tema oscuro y claro',
  ],
  infoLimitationsHeading: 'Limitaciones',
  infoLimitations: [
    'Los colores son solo visuales — no se exportan a la sintaxis Mermaid',
    'Guardado solo localmente en el navegador — no sincronizado entre dispositivos',
  ],
  infoWhyHeading: '¿Por qué Mermaid.js?',
  infoWhy: [
    'Diagrama como texto — compatible con control de versiones, se puede comparar (diff)',
    'Soporte integrado en GitHub, GitLab, Notion, Confluence y más',
    'Sin archivos de imagen que mantener actualizados',
    'Código abierto y mantenido activamente',
  ],
  infoSupportText: '¿Te gusta la herramienta? Puedes apoyar el desarrollo:',
  infoLinksHeading: 'Enlaces',
  infoLinkMermaidSpec: 'Especificación Mermaid Gantt',
  infoLinkMermaidHome: 'Página web de Mermaid.js',
  infoLinkGitHub: 'GanttMaker en GitHub',
  infoLinkBugs: 'Reportar un error o sugerencia',

  // Export PNG modal
  exportPngTitle: 'Exportar como PNG',
  exportPngTodayMarkerLabel: 'Incluir marcador de hoy',
  exportPngHint: 'Se exporta a resolución 2×. El fondo es transparente.',
  exportPngLoading: 'Exportando…',
  exportPngDownload: 'Descargar PNG',
  exportPngCanvasNotFound: 'Canvas no encontrado — asegúrate de que el diagrama sea visible.',
  exportPngFailed: (msg) => `Error al exportar PNG: ${msg}`,

  // Task list
  sectionNamePlaceholder: 'Nombre de sección',
  deleteSectionTitle: 'Eliminar sección',
  deleteSectionAriaLabel: (title) => `Eliminar sección ${title}`,
  deleteUngroupedTitle: 'Eliminar sección sin agrupar',
  deleteUngroupedAriaLabel: 'Eliminar sección sin agrupar',
  ungroupedSectionLabel: 'Sin sección',
  doubleClickToRename: 'Doble clic para renombrar',
  addTask: '+ Nueva tarea',
  addSection: '+ Nueva sección',
  addUngroupedTask: '+ Tarea sin sección',

  // Task detail panel
  editTaskTitle: 'Editar tarea',
  closeDetailPanel: 'Cerrar panel de detalles',
  taskNameLabel: 'Nombre',
  taskStatusLabel: 'Estado',
  taskStatusNormal: 'Normal',
  taskStatusActive: 'Activo',
  taskStatusDone: 'Completado',
  taskStatusCrit: 'Crítico',
  taskStatusCritActive: 'Crítico + Activo',
  taskStatusCritDone: 'Crítico + Completado',
  taskStatusMilestone: 'Hito',
  taskAfterLabel: 'Comienza después de',
  taskStartLabel: 'Inicio',
  taskEndLabel: 'Fin',
  taskDurationLabel: 'Duración',
  taskDurationPlaceholder: 'p. ej. 3d, 1w',
  taskLinkLabel: 'Enlace (URL)',
  taskColorLabel: 'Color',
  taskDurationDays: (days) => `${days} día${days === 1 ? '' : 's'}`,
  deleteTaskButton: 'Eliminar tarea',
  deleteTaskAriaLabel: (label) => `Eliminar tarea ${label}`,

  // Canvas
  taskWouldBeZero: (label) => `«${label}» quedaría en 0 días o menos. ¿Eliminar la tarea?`,
  todayLabel: 'Hoy',

  // Preview
  previewTabSyntax: 'Sintaxis',
  previewTabPreview: 'Vista previa',

  // Syntax pane
  syntaxPaneTitle: 'Sintaxis Mermaid',
  copyButton: 'Copiar',
  copiedButton: '¡Copiado!',

  // EditableLabel
  doubleClickToEdit: 'Doble clic para editar',

  // Import
  clipboardReadError: 'No se pudo leer el portapapeles. Comprueba los permisos del navegador.',
  noMermaidInClipboard: 'No se encontró ningún diagrama Mermaid Gantt en el portapapeles.',
  mermaidParseError: 'No se pudo analizar el diagrama Mermaid Gantt del portapapeles.',
  importConfirm: '¿Importar Mermaid Gantt desde el portapapeles? Esto reemplazará el diagrama actual.',

  // Share
  shareButton: 'Compartir',
  shareModalTitle: 'Compartir diagrama',
  shareModalCreating: 'Creando enlace…',
  shareModalUrlLabel: 'Enlace para compartir',
  shareCopyLink: 'Copiar enlace',
  shareLinkCopied: '¡Copiado!',
  shareModalLimitations: [
    'Cualquiera con el enlace puede ver y editar el diagrama',
    'Gana el último guardado — los cambios simultáneos pueden sobrescribirse',
    'El enlace caduca 30 días después del último guardado',
    'Sin historial de versiones — guardar sobrescribe el estado anterior',
  ],
  shareModalError: (error) => `No se pudo crear el enlace: ${error}`,
  sharedBannerInfo: 'Diagrama compartido — cualquiera con el enlace puede editar',
  sharedBannerExpiry: 'Caduca 30 días después del último guardado',
  sharedBannerSave: 'Guardar cambios',
  sharedBannerSaving: 'Guardando…',
  sharedBannerSaved: '¡Guardado!',
  sharedBannerSaveError: (error) => `Error al guardar: ${error}`,
  shareLoadNotFound: 'Este enlace ha caducado o no existe.',
  shareLoadError: 'No se pudo cargar el diagrama compartido.',
}

const de: Translations = {
  // Toolbar
  projectTitlePlaceholder: 'Projekttitel',
  settingsLabel: 'Diagrammeinstellungen',
  infoLabel: 'Über die App',
  switchToLight: 'Zu hellem Design wechseln',
  switchToDark: 'Zu dunklem Design wechseln',
  pasteMermaid: 'Mermaid einfügen',
  hidePreview: 'Vorschau ausblenden',
  showPreview: 'Vorschau anzeigen',
  downloadPng: 'PNG herunterladen',
  copyMermaid: 'Mermaid kopieren',

  // Settings panel
  settingsTitle: 'Diagrammeinstellungen',
  dateFormatLabel: 'Datumsformat',
  axisFormatLabel: 'Achsenformat',
  axisFormatHint: 'strftime-Format, z. B. %b %d, %Y-%m-%d',
  tickIntervalLabel: 'Tick-Intervall',
  tickIntervalHint: 'z. B. 1day, 1week, 1month',
  excludesLabel: 'Ausschließen',
  excludesHint: 'z. B. weekends, monday, 2025-12-25',
  weekdayLabel: 'Wochenbeginn',
  weekdayDefault: '— Standard (Sonntag) —',
  todayMarkerLabel: '„Heute"-Linie anzeigen',
  languageLabel: 'Sprache',
  closeButton: 'Schließen',

  // Info panel
  infoTitle: 'Über GanttMaker',
  infoDescription: 'Ein visuelles Werkzeug zum Erstellen von Mermaid-Gantt-Diagrammen. Zeichne die Zeitlinie visuell und exportiere gültige Mermaid-Syntax zum Einfügen in GitHub, Confluence oder andere Markdown-basierte Dokumentation.',
  infoFeaturesHeading: 'Funktionen',
  infoFeatures: [
    'Visuelle Bearbeitung — Abschnitte und Aufgaben über ein Formular-Panel hinzufügen',
    'Ziehen zum Verschieben von Aufgaben, Rand ziehen zum Ändern der Dauer',
    'Abhängigkeiten — Aufgaben mit „startet nach" verknüpfen und Pfeile in der Zeitlinie sehen',
    'Meilensteine — als Rauten dargestellt',
    'Statustypen: active, done, crit, crit+active, crit+done, milestone',
    'Klick-Links — öffnet URL aus dem Canvas beim Klicken auf eine Aufgabe',
    'Aufgaben ohne Abschnitt (ungruppiert)',
    'Einstellungen: Datumsformat, Wochenbeginn, Ausschlüsse, Heute-Markierung',
    'Mermaid-Syntax mit einem Klick exportieren',
    'Mermaid-Gantt aus der Zwischenablage mit „Mermaid einfügen" importieren',
    'Diagramm wird automatisch im Browser gespeichert (localStorage)',
    'Dunkles und helles Design',
  ],
  infoLimitationsHeading: 'Einschränkungen',
  infoLimitations: [
    'Farben sind nur visuell — sie werden nicht in die Mermaid-Syntax exportiert',
    'Nur lokal im Browser gespeichert — nicht geräteübergreifend synchronisiert',
  ],
  infoWhyHeading: 'Warum Mermaid.js?',
  infoWhy: [
    'Diagramm als Text — versionskontrollfreundlich, diff-bar',
    'Integrierte Unterstützung in GitHub, GitLab, Notion, Confluence und mehr',
    'Keine Bilddateien, die aktuell gehalten werden müssen',
    'Open Source und aktiv gepflegt',
  ],
  infoSupportText: 'Gefällt dir das Werkzeug? Du kannst die weitere Entwicklung unterstützen:',
  infoLinksHeading: 'Links',
  infoLinkMermaidSpec: 'Mermaid-Gantt-Spezifikation',
  infoLinkMermaidHome: 'Mermaid.js-Startseite',
  infoLinkGitHub: 'GanttMaker auf GitHub',
  infoLinkBugs: 'Fehler oder Vorschlag melden',

  // Export PNG modal
  exportPngTitle: 'Als PNG exportieren',
  exportPngTodayMarkerLabel: '„Heute"-Markierung einschließen',
  exportPngHint: 'Wird in 2× Auflösung exportiert. Hintergrund ist transparent.',
  exportPngLoading: 'Wird exportiert…',
  exportPngDownload: 'PNG herunterladen',
  exportPngCanvasNotFound: 'Canvas nicht gefunden — stelle sicher, dass das Diagramm sichtbar ist.',
  exportPngFailed: (msg) => `PNG-Export fehlgeschlagen: ${msg}`,

  // Task list
  sectionNamePlaceholder: 'Abschnittsname',
  deleteSectionTitle: 'Abschnitt löschen',
  deleteSectionAriaLabel: (title) => `Abschnitt ${title} löschen`,
  deleteUngroupedTitle: 'Ungruppierte Aufgaben löschen',
  deleteUngroupedAriaLabel: 'Ungruppierte Aufgaben löschen',
  ungroupedSectionLabel: 'Kein Abschnitt',
  doubleClickToRename: 'Doppelklick zum Umbenennen',
  addTask: '+ Neue Aufgabe',
  addSection: '+ Neuer Abschnitt',
  addUngroupedTask: '+ Aufgabe ohne Abschnitt',

  // Task detail panel
  editTaskTitle: 'Aufgabe bearbeiten',
  closeDetailPanel: 'Detailpanel schließen',
  taskNameLabel: 'Name',
  taskStatusLabel: 'Status',
  taskStatusNormal: 'Normal',
  taskStatusActive: 'Aktiv',
  taskStatusDone: 'Erledigt',
  taskStatusCrit: 'Kritisch',
  taskStatusCritActive: 'Kritisch + Aktiv',
  taskStatusCritDone: 'Kritisch + Erledigt',
  taskStatusMilestone: 'Meilenstein',
  taskAfterLabel: 'Startet nach',
  taskStartLabel: 'Start',
  taskEndLabel: 'Ende',
  taskDurationLabel: 'Dauer',
  taskDurationPlaceholder: 'z. B. 3d, 1w',
  taskLinkLabel: 'Link (URL)',
  taskColorLabel: 'Farbe',
  taskDurationDays: (days) => `${days} Tag${days === 1 ? '' : 'e'}`,
  deleteTaskButton: 'Aufgabe löschen',
  deleteTaskAriaLabel: (label) => `Aufgabe ${label} löschen`,

  // Canvas
  taskWouldBeZero: (label) => `„${label}" würde 0 Tage oder kürzer werden. Aufgabe löschen?`,
  todayLabel: 'Heute',

  // Preview
  previewTabSyntax: 'Syntax',
  previewTabPreview: 'Vorschau',

  // Syntax pane
  syntaxPaneTitle: 'Mermaid-Syntax',
  copyButton: 'Kopieren',
  copiedButton: 'Kopiert!',

  // EditableLabel
  doubleClickToEdit: 'Doppelklick zum Bearbeiten',

  // Import
  clipboardReadError: 'Zwischenablage konnte nicht gelesen werden. Bitte prüfe die Browser-Berechtigungen.',
  noMermaidInClipboard: 'Kein Mermaid-Gantt-Diagramm in der Zwischenablage gefunden.',
  mermaidParseError: 'Das Mermaid-Gantt-Diagramm in der Zwischenablage konnte nicht analysiert werden.',
  importConfirm: 'Mermaid-Gantt aus der Zwischenablage importieren? Das aktuelle Diagramm wird ersetzt.',

  // Share
  shareButton: 'Teilen',
  shareModalTitle: 'Diagramm teilen',
  shareModalCreating: 'Link wird erstellt…',
  shareModalUrlLabel: 'Freigabelink',
  shareCopyLink: 'Link kopieren',
  shareLinkCopied: 'Kopiert!',
  shareModalLimitations: [
    'Jeder mit dem Link kann das Diagramm ansehen und bearbeiten',
    'Letztes Speichern gewinnt — gleichzeitige Änderungen können überschrieben werden',
    'Link läuft 30 Tage nach dem letzten Speichern ab',
    'Kein Versionsverlauf — Speichern überschreibt den vorherigen Stand',
  ],
  shareModalError: (error) => `Link konnte nicht erstellt werden: ${error}`,
  sharedBannerInfo: 'Geteiltes Diagramm — jeder mit diesem Link kann es bearbeiten',
  sharedBannerExpiry: 'Läuft 30 Tage nach dem letzten Speichern ab',
  sharedBannerSave: 'Änderungen speichern',
  sharedBannerSaving: 'Speichert…',
  sharedBannerSaved: 'Gespeichert!',
  sharedBannerSaveError: (error) => `Speichern fehlgeschlagen: ${error}`,
  shareLoadNotFound: 'Dieser Freigabelink ist abgelaufen oder existiert nicht.',
  shareLoadError: 'Das geteilte Diagramm konnte nicht geladen werden.',
}

export const translations: Record<Locale, Translations> = { en, no, es, de }

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  no: 'Norsk',
  es: 'Español',
  de: 'Deutsch',
}
