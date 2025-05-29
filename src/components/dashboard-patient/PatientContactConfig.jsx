import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUsers,
  FaMale,
  FaFemale,
  FaUserMd,
  FaNotesMedical,
  FaBaby,
  FaUserEdit,
  FaRulerCombined,
  FaWeight,
  FaRulerVertical,
  FaSkull,
  FaDiagnoses,
  FaStethoscope,
  FaPills,
  FaClinicMedical,
  FaSyringe,
  FaHospitalUser,
} from 'react-icons/fa'

export const patientContactSections = [
  {
    title: 'Información Personal',
    titleIcon: <FaUser />,
    sections: [
      {
        title: 'Teléfono',
        icon: <FaPhone />,
        content: '{phone}',
        colSpan: 1,
      },
      {
        title: 'Correo Electrónico',
        icon: <FaEnvelope />,
        content: '{email}',
        colSpan: 1,
      },
      {
        title: 'Edad',
        icon: <FaPhone />,
        content: '{actualAge}',
        colSpan: 1,
      },
      {
        title: 'Fecha de Nacimiento',
        icon: <FaEnvelope />,
        content: '{birthDate}',
        colSpan: 1,
      },
      {
        title: 'Dirección',
        icon: <FaMapMarkerAlt />,
        content: '{address}',
        colSpan: 2,
      },
    ],
  },
  {
    title: 'Información Familiar',
    titleIcon: <FaUsers />,
    sections: [
      {
        title: 'Nombre del Padre',
        icon: <FaMale />,
        content: '{dadName}',
        colSpan: 1,
      },
      {
        title: 'Nombre de la Madre',
        icon: <FaFemale />,
        content: '{momName}',
        colSpan: 1,
      },
      {
        title: 'Obstetra/Ginecólogo',
        icon: <FaUserMd />,
        content: '{obstetrician}',
        colSpan: 2,
      },
    ],
  },
  {
    title: 'Historial Médico',
    titleIcon: <FaNotesMedical />,
    sections: [
      {
        title: 'Historia Neonatal',
        icon: <FaBaby />,
        content: '{neonatal}',
        colSpan: 2,
      },
      {
        title: 'Historia Personal',
        icon: <FaUserEdit />,
        content: '{personal}',
        colSpan: 2,
      },
      {
        title: 'Motivo de Consulta',
        icon: <FaUserEdit />,
        content: '{consultMotive}',
        colSpan: 2,
      },
      {
        title: 'Examen Físico',
        icon: <FaUserEdit />,
        content: '{physicalExam}',
        colSpan: 2,
      },
    ],
  },
  {
    title: 'Medidas',
    titleIcon: <FaRulerCombined />,
    sections: [
      {
        title: 'Peso',
        icon: <FaWeight />,
        content: '{weight} kg',
        colSpan: 1,
      },
      {
        title: 'Talla',
        icon: <FaRulerVertical />,
        content: '{size} cm',
        colSpan: 1,
      },
      {
        title: 'Perímetro Cefálico',
        icon: <FaSkull />,
        content: '{pc} cm',
        colSpan: 1,
      },
    ],
  },
  {
    title: 'Diagnóstico',
    titleIcon: <FaDiagnoses />,
    sections: [
      {
        title: 'Diagnóstico Principal',
        icon: <FaStethoscope />,
        content: '{diagnostic}',
        colSpan: 2,
      },
      {
        title: 'Tratamiento',
        icon: <FaPills />,
        content: '{treatment}',
        colSpan: 2,
      },
      {
        title: 'Exámenes Complementarios',
        icon: <FaPills />,
        content: '{exams}',
        colSpan: 2,
      },
    ],
  },
  {
    title: 'Información Médica',
    titleIcon: <FaClinicMedical />,
    sections: [
      {
        title: 'Referencia Médica',
        icon: <FaHospitalUser />,
        content: '{medicalReference}',
        colSpan: 2,
      },
      {
        title: 'Información Médica Compartida',
        icon: <FaSyringe />,
        content: '{medicalInformShared}',
        colSpan: 2,
      },
      {
        title: 'Viaje Médico',
        icon: <FaHospitalUser />,
        content: '{medicalTrip}',
        colSpan: 2,
      },
    ],
  },
]
