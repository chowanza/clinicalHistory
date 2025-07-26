import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const RecipePDF = ({ data, patient }) => {
  const styles = StyleSheet.create({
    page: {
      padding: 40,
      paddingVertical: 30,
      fontFamily: 'Helvetica',
      fontSize: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    content: {
      marginTop: 20,
    },
    text: {
      fontSize: 12,
      lineHeight: 1.5,
    },
    signature: {
      marginTop: 30,
      borderTop: '1px solid #000',
      paddingTop: 10,
      width: 200,
      textAlign: 'center',
      alignSelf: 'flex-end',
    },
    patientInfo: {
      marginBottom: 20,
      padding: 10,
      backgroundColor: '#f5f5f5',
    },
    date: {
      fontSize: 10,
      color: '#666',
      marginBottom: 10,
    }
  })

  // Asegurar que los datos sean válidos
  const recipeContent = typeof data === 'string' ? data : 'No hay receta para esta fecha'
  const patientName = patient?.firstNames && patient?.lastNames 
    ? `${patient.firstNames} ${patient.lastNames}` 
    : 'Paciente'
  const doctorName = patient?.user?.firstName && patient?.user?.lastName
    ? `Dr. ${patient.user.firstName} ${patient.user.lastName}`
    : 'Dr. Médico'

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Récipe Médico</Text>
        </View>
        
        <View style={styles.patientInfo}>
          <Text style={styles.date}>
            Fecha: {new Date().toLocaleDateString('es-ES')}
          </Text>
          <Text style={styles.text}>
            Paciente: {patientName}
          </Text>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.text}>{recipeContent}</Text>
        </View>
        
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

export default RecipePDF
