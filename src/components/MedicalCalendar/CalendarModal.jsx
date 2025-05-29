import { PDFDownloadLink } from '@react-pdf/renderer'
import RecipePDF from './RecipePDF'
import moment from 'moment'
import { usePatients } from '../../context/PatientsContext'

const CalendarModal = ({
  showModal,
  selectedDate,
  currentRecipe,
  isEditing,
  handleEdit,
  handleSave,
  handleCancel,
  handleDelete,
  setCurrentRecipe,
  hasRecipe,
}) => {
  if (!showModal) return null
  const { patient } = usePatients()

  return (
    <div className='fixed inset-0 bg-slate-600/60 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-lg'>
        <h2 className='text-xl font-bold mb-4 text-gray-800'>
          {moment(selectedDate).format('dddd D [de] MMMM [de] YYYY')}
        </h2>

        {isEditing ? (
          <>
            <textarea
              value={currentRecipe}
              onChange={(e) => setCurrentRecipe(e.target.value)}
              className='w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4'
              placeholder='Ingrese los detalles de la receta...'
              autoFocus
            />
            <div className='flex justify-between'>
              <div className='flex space-x-3'>
                <button
                  onClick={handleCancel}
                  className='h-10 p-3 text-gray-800 font-semibold rounded-xl bg-gray-200 flex items-center gap-2 border-slate-400 border cursor-pointer
                                hover:scale-105 transition-transform duration-300 
                                hover:shadow-lg hover:shadow-gray-200/50 
                                hover:outline-2 hover:outline-white 
                                hover:bg-opacity-80 hover:animate-pulse'
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className='h-10 p-3 text-white font-semibold rounded-xl bg-blue-600 flex items-center gap-2 border-slate-400 border cursor-pointer
                                hover:scale-105 transition-transform duration-300 
                                hover:shadow-lg hover:shadow-blue-600/50 
                                hover:outline-2 hover:outline-white 
                                hover:bg-opacity-80 hover:animate-pulse'
                >
                  Guardar
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='bg-gray-50 p-4 rounded-md mb-4 whitespace-pre-wrap'>
              {currentRecipe || 'No hay receta para esta fecha'}
            </div>
            <div className='flex justify-end space-x-3'>
              <button
                onClick={handleCancel}
                className='h-10 p-3 text-gray-800 font-semibold rounded-xl bg-gray-200 flex items-center gap-2 border-slate-400 border cursor-pointer
                                hover:scale-105 transition-transform duration-300 
                                hover:shadow-lg hover:shadow-gray-200/50 
                                hover:outline-2 hover:outline-white 
                                hover:bg-opacity-80 hover:animate-pulse'
              >
                Cerrar
              </button>
              <button
                onClick={handleEdit}
                className='h-10 p-3 text-white font-semibold rounded-xl bg-blue-600 flex items-center gap-2 border-slate-400 border cursor-pointer
                                hover:scale-105 transition-transform duration-300 
                                hover:shadow-lg hover:shadow-blue-600/50 
                                hover:outline-2 hover:outline-white 
                                hover:bg-opacity-80 hover:animate-pulse'
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                className='h-10 p-3 text-white font-semibold rounded-xl bg-red-700 flex items-center gap-2 border-slate-400 border cursor-pointer
                                hover:scale-105 transition-transform duration-300 
                                hover:shadow-lg hover:shadow-red-700/50 
                                hover:outline-2 hover:outline-white 
                                hover:bg-opacity-80 hover:animate-pulse'
              >
                Eliminar
              </button>
              <PDFDownloadLink
                document={
                  <RecipePDF
                    data={currentRecipe || 'No hay receta para esta fecha'}
                    patient={patient}
                  />
                }
                fileName={`Recipe.pdf`}
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                <button
                  className='h-10 p-3 text-white font-semibold rounded-xl bg-[#FA0F00] flex items-center gap-2 border-slate-400 border cursor-pointer
                                hover:scale-105 transition-transform duration-300 
                                hover:shadow-lg hover:shadow-[#FA0F00]/50 
                                hover:outline-2 hover:outline-white 
                                hover:bg-opacity-80 hover:animate-pulse'
                >
                  Descargar PDF
                </button>
              </PDFDownloadLink>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CalendarModal
