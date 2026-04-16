import { useEffect, useState } from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer'
import { calcularEdadPediatrica } from '../../utils/ageUtils'

const PatientPDF = ({ patient }) => {
  const [inputs, setInputs] = useState({
    age: {},
    head: '',
    length: '',
    sex: '',
    weight: '',
  })

  useEffect(() => {
    if (patient) {
      setInputs((prev) => ({
        ...prev,
        age: calcularEdadPediatrica(patient.birthDate),
        head: patient.pc,
        length: patient.size,
        sex: 'male',
        weight: patient.weight,
      }))
    }
  }, [patient])

  const styles = StyleSheet.create({
    page: {
      padding: 40,
      paddingVertical: 30,
      fontFamily: 'Helvetica',
      fontSize: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottom: '1px solid #000',
      paddingBottom: 10,
      marginBottom: 10,
    },
    section: { marginBottom: 8 },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 8,
      backgroundColor: '#f0f0f0',
      padding: 5,
      textTransform: 'uppercase',
    },
    twoColumns: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    column: { width: '48%' },
    fullWidth: { width: '100%', marginBottom: 8 },
    signature: {
      marginTop: 30,
      borderTop: '1px solid #000',
      paddingTop: 10,
      width: 200,
      textAlign: 'center',
      alignSelf: 'flex-end',
    },
    medicalData: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
      gap: 10,
    },
  })

  return (
    <Document>
      <Page style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text>Historia Clínica</Text>
          <Text>Fecha: {new Date(patient.date).toLocaleDateString()}</Text>
        </View>

        {/* 1. INFORMACIÓN PERSONAL */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <Text>Nombres: {patient.firstNames}</Text>
              <Text>Apellidos: {patient.lastNames}</Text>
              <Text>Fecha de Nacimiento: {patient.birthDate}</Text>
              <Text>Grupo Sang. y RH: {patient.bloodType || 'N/E'}</Text>
            </View>
            <View style={styles.column}>
              <Text>Teléfono: {patient.phone}</Text>
              <Text>Email: {patient.email}</Text>
              <Text>Dirección: {patient.address}</Text>
            </View>
          </View>
        </View>

        {/* 2. INFORMACIÓN FAMILIAR */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Familiar</Text>
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <Text>Nombre del Padre: {patient.dadName}</Text>
              <Text>Nombre de la Madre: {patient.momName}</Text>
            </View>
            <View style={styles.column}>
              <Text>Obstetra/Ginecólogo: {patient.obstetrician}</Text>
            </View>
          </View>
        </View>

        {/* 3. HISTORIAL MÉDICO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historial Médico</Text>
          <View style={styles.fullWidth}>
            <Text>Historia Neonatal: {patient.neonatal}</Text>
          </View>
          <View style={styles.fullWidth}>
            <Text>Historia Personal: {patient.personal}</Text>
          </View>
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <Text>Esquema de Vacunación: {patient.vacunationSchema}</Text>
            </View>
            <View style={styles.column}>
              <Text>Motivo de Consulta: {patient.consultMotive}</Text>
            </View>
          </View>
          <View style={styles.fullWidth}>
            <Text>Examen Físico: {patient.physicalExam}</Text>
          </View>
        </View>

        {/* 4. MEDIDAS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medidas</Text>
          <View style={styles.medicalData}>
            <Text>Peso: {patient.weight} kg</Text>
            <Text>Talla: {patient.size} cm</Text>
            <Text>PC: {patient.pc} cm</Text>
            <Text>Circ. Abdominal: {patient.abdominalCircumference} cm</Text>
          </View>
        </View>

        {/* 5. DIAGNÓSTICO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diagnóstico</Text>
          <Text>Diagnóstico: {patient.diagnostic}</Text>
          <Text>Tratamiento: {patient.treatment}</Text>
          <Text>Exámenes Solicitados: {patient.exams}</Text>
        </View>

        {/* 6. INFORMACIÓN MÉDICA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Médica</Text>
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <Text>Referencia Médica: {patient.medicalReference}</Text>
              <Text>Información Compartida: {patient.medicalInformShared}</Text>
            </View>
            <View style={styles.column}>
              <Text>Viaje Médico: {patient.medicalTrip}</Text>
            </View>
          </View>
        </View>

        {/* Firma */}
        <View style={styles.signature}>
          <Text>Dra. Eunice Brito G.</Text>
          <Text>Pediatra - Neonatólogo</Text>
          <Text>M.P.P.S: 53988 / CM 4.699</Text>
          <Text>C.I.:V-8.918.808</Text>
        </View>
      </Page>
    </Document>
  )
}

export default PatientPDF
