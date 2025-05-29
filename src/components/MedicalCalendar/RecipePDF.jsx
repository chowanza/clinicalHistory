import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const RecipePDF = ({ data }) => {
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
  })
  return (
    <>
      <Document>
        <Page style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>Receta Médica</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.text}>{data}</Text>
          </View>
        </Page>
      </Document>
    </>
  )
}

export default RecipePDF
