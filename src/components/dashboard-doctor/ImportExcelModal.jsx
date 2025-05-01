import { useState, useCallback } from 'react'
import { read, utils } from 'xlsx'
import { FaFileExcel, FaCheck } from 'react-icons/fa'

const ImportExcelModal = ({ onClose, onImport }) => {
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const processExcelData = (data) => {
    // Mapeo completo de todos los campos del Excel
    const mapping = {
      'FECHA DE CONSULTA': (value) => ({ consultationDate: value }),
      'NOMBRES Y APELLIDOS': (value) => {
        const [firstNames, ...lastNames] = value.split(' ')
        return {
          firstNames: firstNames || '',
          lastNames: lastNames.join(' ') || '',
        }
      },
      'FECHA DE NACIMIENTO:': (value) => ({ birthDate: value }),
      'EDAD ACTUAL': (value) => ({ actualAge: value }),
      'NOMBRE MAMA': (value) => ({ momName: value }),
      'NOMBRE PAPA': (value) => ({ dadName: value }),
      OBSTETRA: (value) => ({ obstetrician: value }),
      DIRECCION: (value) => ({ address: value }),
      'TELEFONO DE CONTACTO': (value) => ({ phone: value }),
      EMAIL: (value) => ({ email: value }),
      'ANTECEDENTES NEONATALES': (value) => ({ neonatal: value }),
      'ANTECEDENTES PERSONALES': (value) => ({ personal: value }),
      'ANTECEDENTES FAMILIARES': (value) => ({ familiar: value }),
      'MOTIVO DE CONSULTA': (value) => ({ consultMotive: value }),
      'EXAMEN FISICO': (value) => ({ physicalExam: value }),
      PESO: (value) => ({ weight: value }),
      TALLA: (value) => ({ size: value }),
      PC: (value) => ({ pc: value }),
      DIAGNOSTICO: (value) => ({ diagnostic: value }),
      TRATAMIENTO: (value) => ({ treatment: value }),
      EXAMENES: (value) => ({ exams: value }),
      'ESQUEMA DE VACUNACION': (value) => ({ vacunationSchema: value }),
      'REFERENCIAS MEDICAS': (value) => ({ medicalReference: value }),
      'INFORMES MEDICOS ENTREGADOS': (value) => ({
        medicalInformShared: value,
      }),
      'MEDICAMENTOS DE VIAJE': (value) => ({ medicalTrip: value }),
    }

    const patientData = {}
    Object.entries(data).forEach(([key, value]) => {
      const normalizedKey = key.replace(/:/g, '').trim()
      if (mapping[normalizedKey] && value) {
        Object.assign(patientData, mapping[normalizedKey](value))
      }
    })
    return patientData
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setError('')
    setSuccess(false)
  }

  const handleSubmit = useCallback(async () => {
    if (!file) {
      setError('Por favor selecciona un archivo')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const data = await file.arrayBuffer()
      const workbook = read(data)

      // Buscar la hoja que contiene los datos (puede ser la primera o segunda)
      const sheetName =
        workbook.SheetNames.find(
          (name) => name.includes('HISTORIA') || name.includes('DATOS')
        ) || workbook.SheetNames[0]

      const worksheet = workbook.Sheets[sheetName]
      const jsonData = utils.sheet_to_json(worksheet, { header: 1 })

      // Convertir filas a objeto clave-valor
      const excelData = {}
      jsonData.forEach((row) => {
        if (row[0] && row[0].toString().trim() && row[1] !== undefined) {
          const key = row[0].toString().replace(/:/g, '').trim()
          excelData[key] = row[1]?.toString().trim() || ''
        }
      })

      const patientData = processExcelData(excelData)
      setSuccess(true)
      setTimeout(() => {
        onImport(patientData)
      }, 1000) // Pequeño delay para mostrar el feedback
    } catch (err) {
      console.error('Error al procesar el archivo:', err)
      setError('Error al procesar el archivo. Verifica el formato.')
    } finally {
      setIsLoading(false)
    }
  }, [file, onImport])

  return (
    <div className='p-6 dark:bg-slate-800 bg-white rounded-lg max-w-2xl mx-auto'>
      <h2 className='text-2xl font-bold mb-4 flex items-center gap-2'>
        <FaFileExcel className='text-green-600' />
        Importar desde Excel
      </h2>

      <div className='mb-4'>
        <label className='block text-sm font-medium mb-2'>
          Selecciona un archivo Excel (.xlsx) con el formato de historia clínica
        </label>
        <input
          type='file'
          accept='.xlsx, .xls'
          onChange={handleFileChange}
          disabled={isLoading}
          className='block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100 disabled:opacity-50'
        />
        <p className='text-xs text-gray-500 mt-1'>
          Asegúrate que el archivo tenga el formato correcto con los campos de
          historia clínica
        </p>
      </div>

      {error && (
        <div className='mb-4 p-3 bg-red-100 text-red-700 rounded-md'>
          {error}
        </div>
      )}

      {success && (
        <div className='mb-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center gap-2'>
          <FaCheck /> Datos importados correctamente. Cargando formulario...
        </div>
      )}

      <div className='flex justify-end gap-4 mt-6'>
        <button
          onClick={onClose}
          disabled={isLoading}
          className='p-3 text-white font-semibold rounded-xl bg-[#791010] flex items-center gap-2 border-slate-400 border cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-[#791010]/50 hover:outline-2 hover:outline-white hover:bg-opacity-80 hover:animate-pulse top-4 right-4 z-50 fixed'
        >
          Cerrar
        </button>
        <button
          onClick={handleSubmit}
          disabled={!file || isLoading || success}
          className='p-3 text-white font-semibold rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center gap-2 border-slate-400 border cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-secondary/50 hover:outline-2 hover:outline-white hover:bg-opacity-80 hover:animate-pulse flex-1 md:flex-none'
        >
          {isLoading ? (
            'Procesando...'
          ) : success ? (
            <>
              <FaCheck /> Listo
            </>
          ) : (
            <>
              <FaFileExcel />
              Importar Datos
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default ImportExcelModal
