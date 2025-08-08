export const personalInfoFields = [
  {
    name: 'firstNames',
    label: 'Nombres',
    colSpan: 'col-span-3',
    dataValue: '{patient.firstNames}',
  },
  {
    name: 'lastNames',
    label: 'Apellidos',
    colSpan: 'col-span-3',
    dataValue: '{patient.lastNames}',
  },
  {
    name: 'birthDate',
    label: 'Fecha de Nacimiento',
    type: 'date',
    colSpan: 'col-span-3',
    dataValue: '{patient.birthDate}',
  },
  {
    name: 'address',
    label: 'Dirección',
    colSpan: 'col-span-full',
    dataValue: '{patient.address}',
  },
]

export const familyInfoFields = [
  {
    name: 'phone',
    label: 'Teléfono',
    colSpan: 'col-span-3',
    required: false,
    dataValue: '{patient.phone}',
  },
  {
    name: 'email',
    label: 'Correo Electrónico',
    type: 'email',
    colSpan: 'col-span-3',
    required: false,
    dataValue: '{patient.email}',
  },
  {
    name: 'dadName',
    label: 'Nombre del Padre',
    colSpan: 'col-span-3',
    dataValue: '{patient.dadName}',
  },
  {
    name: 'momName',
    label: 'Nombre de la Madre',
    colSpan: 'col-span-3',
    dataValue: '{patient.momName}',
  },
  {
    name: 'obstetrician',
    label: 'Obstetra/Ginecólogo',
    colSpan: 'col-span-full',
    dataValue: '{patient.obstetrician}',
  },
]

export const medicalHistoryFields = [
  {
    name: 'neonatal',
    label: 'Historia Neonatal',
    isTextArea: true,
    colSpan: 'col-span-full',
    rows: '3',
    dataValue: '{patient.neonatal}',
  },
  {
    name: 'personal',
    label: 'Historia Personal',
    isTextArea: true,
    colSpan: 'col-span-full',
    rows: '3',
    dataValue: '{patient.personal}',
  },
  {
    name: 'familiar',
    label: 'Historia Familiar',
    isTextArea: true,
    colSpan: 'col-span-full',
    rows: '3',
    dataValue: '{patient.familiar}',
  },
]

export const consultationFields = [
  {
    name: 'consultMotive',
    label: 'Motivo de Consulta',
    isTextArea: true,
    colSpan: 'col-span-full',
    rows: '3',
    dataValue: '{patient.consultMotive}',
  },
  {
    name: 'physicalExam',
    label: 'Examen Físico',
    isTextArea: true,
    colSpan: 'col-span-full',
    rows: '3',
    dataValue: '{patient.physicalExam}',
  },
]

export const measurementsFields = [
  {
    name: 'consultationDate',
    label: 'Fecha de Consulta',
    type: 'datetime-local',
    colSpan: 'col-span-3',
    dataValue: '{patient.consultationDate}',
  },
  {
    name: 'weight',
    label: 'Peso',
    type: 'number',
    min: 0,
    step: 'any',
    unit: 'kg',
    colSpan: 'col-span-3',
    dataValue: '{patient.weight}',
  },
  {
    name: 'size',
    label: 'Talla',
    type: 'number',
    min: 0,
    step: 'any',
    unit: 'cm',
    colSpan: 'col-span-3',
    dataValue: '{patient.size}',
  },
  {
    name: 'pc',
    label: 'Perímetro Cefálico',
    type: 'number',
    min: 0,
    step: 'any',
    unit: 'cm',
    colSpan: 'col-span-3',
    dataValue: '{patient.pc}',
  },
  {
    name: 'abdominalCircumference',
    label: 'Circunferencia Abdominal',
    type: 'number',
    min: 0,
    step: 'any',
    unit: 'cm',
    colSpan: 'col-span-3',
    dataValue: '{patient.abdominalCircumference}',
  },
]

export const diagnosisFields = [
  {
    name: 'diagnostic',
    label: 'Diagnóstico',
    isTextArea: true,
    colSpan: 'col-span-full',
    rows: '3',
    dataValue: '{patient.diagnostic}',
  },
  {
    name: 'treatment',
    label: 'Tratamiento',
    isTextArea: true,
    colSpan: 'col-span-full',
    rows: '3',
    dataValue: '{patient.treatment}',
  },
  {
    name: 'exams',
    label: 'Exámenes Complementarios',
    isTextArea: true,
    colSpan: 'col-span-full',
    rows: '3',
    dataValue: '{patient.exams}',
  },
]

export const medicalInfoFields = [
  {
    name: 'medicalReference',
    label: 'Referencia Médica',
    isTextArea: true,
    colSpan: 'col-span-full',
    rows: '2',
    dataValue: '{patient.medicalReference}',
  },
  {
    name: 'medicalInformShared',
    label: 'Información Médica Compartida',
    isTextArea: true,
    colSpan: 'col-span-full',
    rows: '2',
    dataValue: '{patient.medicalInformShared}',
  },
  {
    name: 'medicalTrip',
    label: 'Viaje Médico',
    isTextArea: true,
    colSpan: 'col-span-full',
    rows: '2',
    dataValue: '{patient.medicalTrip}',
  },
]
