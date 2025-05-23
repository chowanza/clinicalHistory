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
import { calculatePercentiles } from './Percentiles'

const PatientPDF = ({ patient }) => {
  const [inputs, setInputs] = useState({
    age: {},
    head: '',
    length: '',
    sex: '',
    weight: '',
  })

  const [percentiles, setPercentiles] = useState({
    weight: { z: '', percentile: '' },
    length: { z: '', percentile: '' },
    head: { z: '', percentile: '' },
    weightLength: { z: '', percentile: '' },
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

  useEffect(() => {
    if (inputs.head != '') {
      setPercentiles((prev) => ({
        ...prev,
        ...calculatePercentiles(inputs),
      }))
      console.log(percentiles)
    }
  }, [inputs])

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
              <Text>Fecha Nacimiento: {patient.birthDate}</Text>
              <Text>Edad: {patient.actualAge}</Text>
            </View>
            <View style={styles.column}>
              <Text>Dirección: {patient.address}</Text>
              <Text>Teléfono: {patient.phone}</Text>
              <Text>Email: {patient.email}</Text>
            </View>
          </View>
        </View>

        {/* 2. INFORMACIÓN FAMILIAR */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Familiar</Text>
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <Text>Padre: {patient.dadName}</Text>
              <Text>Madre: {patient.momName}</Text>
              <Text>Obstetra: {patient.obstetrician}</Text>
            </View>
            <View style={styles.column}>
              <Text>Historia Familiar: {patient.familiar}</Text>
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
            <Text>Peso: {patient.weight}</Text>
            <Text>Talla: {patient.size}</Text>
            <Text>PC: {patient.pc}</Text>
          </View>
        </View>

        {/* 5. PERCENTILES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Percentiles</Text>
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <Text>Peso para la edad: {percentiles.weight.percentile}%</Text>
            </View>
            <View style={styles.column}>
              <Text>Talla para la edad: {percentiles.length.percentile}%</Text>
            </View>
          </View>
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <Text>
                Peso para la talla: {percentiles.weightLength.percentile}%
              </Text>
            </View>
            <View style={styles.column}>
              <Text>
                Perimetro Cefalico para la edad: {percentiles.head.percentile}%
              </Text>
            </View>
          </View>
        </View>

        {/* 6. DIAGNÓSTICO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diagnóstico</Text>
          <Text>Diagnóstico: {patient.diagnostic}</Text>
          <Text>Tratamiento: {patient.treatment}</Text>
          <Text>Exámenes Solicitados: {patient.exams}</Text>
        </View>

        {/* 7. INFORMACIÓN MÉDICA */}
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
          <Text>
            Dr. {patient.user?.firstName} {patient.user?.lastName}
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export default PatientPDF
