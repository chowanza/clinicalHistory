export const personalInfoFields = [
  {
    name: 'firstNames',
    label: 'Nombres',
    colSpan: 'col-span-3',
  },
  {
    name: 'lastNames',
    label: 'Apellidos',
    colSpan: 'col-span-3',
  },
  {
    name: 'birthDate',
    label: 'Fecha de Nacimiento',
    type: 'date',
    colSpan: 'col-span-3',
  },
  {
    name: 'actualAge',
    label: 'Edad Actual',
    type: 'number',
    colSpan: 'col-span-3',
  },
  { name: 'phone', label: 'Teléfono', colSpan: 'col-span-3' },
  {
    name: 'email',
    label: 'Correo Electrónico',
    type: 'email',
    colSpan: 'col-span-3',
  },
  {
    name: 'address',
    label: 'Dirección',
    colSpan: 'col-span-full',
  },
]

export const familyInfoFields = [
  { name: 'dadName', label: 'Nombre del Padre', colSpan: 'col-span-3' },
  {
    name: 'momName',
    label: 'Nombre de la Madre',
    colSpan: 'col-span-3',
  },
  {
    name: 'obstetrician',
    label: 'Obstetra/Ginecólogo',
    colSpan: 'col-span-full',
  },
]
export const medicalHistoryFields = [
  {
    name: 'neonatal',
    label: 'Historia Neonatal',
    isTextArea: true,
    colSpan: 'col-span-full',
    rows: '3',
  },
  {
    name: 'personal',
    label: 'Historia Personal',
    isTextArea: true,
    colSpan: 'col-span-full',
    rows: '3',
  },
  {
    name: 'familiar',
    label: 'Historia Familiar',
    isTextArea: true,
    colSpan: 'col-span-full',
    rows: '3',
  },
  {
    name: 'consultMotive',
    label: 'Motivo de Consulta',
    isTextArea: true,
    colSpan: 'col-span-full',
    rows: '3',
  },
  {
    name: 'physicalExam',
    label: 'Examen Físico',
    isTextArea: true,
    colSpan: 'col-span-full',
    rows: '3',
  },
]
export const measurementsFields = [
  { name: 'weight', label: 'Peso (kg)', colSpan: 'col-span-3' },
  { name: 'size', label: 'Talla (cm)', colSpan: 'col-span-3' },
  {
    name: 'pc',
    label: 'Perímetro Cefálico (cm)',
    colSpan: 'col-span-3',
  },
  { name: 'percentil', label: 'Percentil', colSpan: 'col-span-3' },
]
export const diagnosisFields = [
  {
    name: 'diagnostic',
    label: 'Diagnóstico',
    isTextArea: true,
    colSpan: 'col-span-full',
    rows: '3',
  },
  {
    name: 'treatment',
    label: 'Tratamiento',
    isTextArea: true,
    colSpan: 'col-span-full',
    rows: '3',
  },
  {
    name: 'exams',
    label: 'Exámenes Complementarios',
    isTextArea: true,
    colSpan: 'col-span-full',
    rows: '3',
  },
]
export const medicalInfoFields = [
  {
    name: 'vacunationSchema',
    label: 'Esquema de Vacunación',
    isTextArea: true,
    colSpan: 'col-span-full',
    rows: '2',
  },
  {
    name: 'medicalReference',
    label: 'Referencia Médica',
    isTextArea: true,
    colSpan: 'col-span-full',
    rows: '2',
  },
  {
    name: 'medicalInformShared',
    label: 'Información Médica Compartida',
    isTextArea: true,
    colSpan: 'col-span-full',
    rows: '2',
  },
  {
    name: 'medicalTrip',
    label: 'Viaje Médico',
    isTextArea: true,
    colSpan: 'col-span-full',
    rows: '2',
  },
]
