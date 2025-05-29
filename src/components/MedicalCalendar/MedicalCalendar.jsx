import React, { useState, useEffect, useCallback } from 'react'
import moment from 'moment'
import CalendarControls from './CalendarControls'
import CalendarModal from './CalendarModal'
import Sidebar from './Sidebar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './style.css'
import { usePatients } from '../../context/PatientsContext'
import { Calendar } from 'react-big-calendar'
import { momentLocalizer } from 'react-big-calendar'
import {
  getRecipesRequest,
  createRecipesRequest,
  updateRecipesRequest,
  deleteRecipesRequest,
} from '../../api/recipeCalendar'
import {
  normalizeDate,
  convertRecipesToEvents,
  calendarMessages,
  calendarFormats,
} from './utils'

moment.locale('es', {
  months:
    'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split(
      '_'
    ),
  monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
  weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
  weekdaysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
  weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sá'.split('_'),
})

const localizer = momentLocalizer(moment)

const MedicalCalendar = () => {
  const [recipes, setRecipes] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [currentRecipe, setCurrentRecipe] = useState({
    id: null,
    content: '',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [highlightedEvent, setHighlightedEvent] = useState(null)
  const [showSidebar, setShowSidebar] = useState(true)

  const { patient } = usePatients()

  const highlightEvent = (recipe) => {
    setHighlightedEvent({
      start: recipe.date,
      end: recipe.date,
      title: recipe.description.split('\n')[0],
      allDay: true,
    })
    setCurrentDate(recipe.date)

    setSelectedDate(recipe.date)
    setCurrentRecipe({
      id: recipe._id,
      content: recipe.description,
    })
    setShowModal(true)
    setIsEditing(false)

    setTimeout(() => setHighlightedEvent(null), 2000)
  }

  // Función para cargar recetas
  const fetchRecipes = useCallback(async () => {
    try {
      const response = await getRecipesRequest(patient._id)
      if (response.data) {
        const apiRecipes = response.data
        const normalizedRecipes = {}

        apiRecipes.forEach((recipe) => {
          const dateParts = recipe.date.split('T')[0].split('-')
          const pureDate = new Date(
            parseInt(dateParts[0]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[2])
          )

          const dateStr = normalizeDate(pureDate)
          normalizedRecipes[dateStr] = {
            _id: recipe._id, // Guardar el ID
            date: pureDate,
            description: recipe.description,
          }
        })

        setRecipes(normalizedRecipes)
      }
    } catch (error) {
      console.error('Error fetching recipe data:', error)
    }
  }, [patient._id])

  useEffect(() => {
    if (patient?._id) {
      fetchRecipes()
    }
  }, [patient, fetchRecipes])

  // Función para crear receta
  const createRecipeInAPI = useCallback(
    async (dateStr, description) => {
      try {
        const response = await createRecipesRequest(patient._id, {
          date: dateStr,
          description,
        })
        return response.data._id // Devolver el ID creado
      } catch (error) {
        console.error('Error creating recipe:', error)
        return null
      }
    },
    [patient._id]
  )

  // Función para actualizar receta
  const updateRecipeInAPI = useCallback(
    async (id, data) => {
      try {
        await updateRecipesRequest(patient._id, {
          recipeId: id,
          date: data.date,
          description: data.description,
        })
      } catch (error) {
        console.error('Error updating recipe:', error)
      }
    },
    [patient._id]
  )

  // Función para eliminar receta
  const deleteRecipeFromAPI = useCallback(
    async (id) => {
      try {
        await deleteRecipesRequest(patient._id, id)
      } catch (error) {
        console.error('Error deleting recipe:', error)
      }
    },
    [patient._id]
  )

  const handleSelectSlot = (slotInfo) => {
    const dateStr = normalizeDate(slotInfo.start)
    setSelectedDate(slotInfo.start)

    const existingRecipe = recipes[dateStr]
    setCurrentRecipe({
      id: existingRecipe?._id || null,
      content: existingRecipe?.description || '',
    })

    if (existingRecipe) {
      setShowModal(true)
      setIsEditing(false)
    } else {
      setShowModal(true)
      setIsEditing(true)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    const dateStr = normalizeDate(selectedDate)
    const content = currentRecipe.content.trim()

    if (content) {
      if (currentRecipe.id) {
        // Actualizar receta existente
        await updateRecipeInAPI(currentRecipe.id, {
          description: content,
          date: dateStr,
        })
      } else {
        // Crear nueva receta
        const newId = await createRecipeInAPI(dateStr, content)
        if (newId) {
          setRecipes((prev) => ({
            ...prev,
            [dateStr]: {
              _id: newId,
              date: selectedDate,
              description: content,
            },
          }))
        }
      }
    } else {
      // Eliminar si el contenido está vacío
      handleDelete()
    }

    // Recargar datos después de cualquier operación
    fetchRecipes()
    setShowModal(false)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (currentRecipe.id) {
      await deleteRecipeFromAPI(currentRecipe.id)
      fetchRecipes()
    }

    setShowModal(false)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setShowModal(false)
    setIsEditing(false)
  }

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => moment(prev).add(direction, 'month').toDate())
  }

  const navigateYear = (direction) => {
    setCurrentDate((prev) => moment(prev).add(direction, 'year').toDate())
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const events = convertRecipesToEvents(recipes)

  return (
    <div className='flex p-6 min-w-3xl max-w-6xl max-h-[30rem]'>
      <Sidebar recipes={recipes} onEventClick={highlightEvent} />

      <div className='flex-1'>
        <CalendarControls
          currentDate={currentDate}
          navigateMonth={navigateMonth}
          navigateYear={navigateYear}
          goToToday={goToToday}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          showSidebar={showSidebar}
        />

        <div className='bg-white rounded-lg shadow-md overflow-hidden'>
          <div className='h-[400px] p-4'>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor='start'
              endAccessor='end'
              date={currentDate}
              onNavigate={() => {}}
              toolbar={false}
              selectable
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectSlot}
              culture='es'
              messages={calendarMessages}
              formats={calendarFormats}
              eventPropGetter={(event) => ({
                style: {
                  border:
                    highlightedEvent === event
                      ? '2px solid #3b82f6'
                      : '1px solid #ddd',
                  boxShadow:
                    highlightedEvent === event
                      ? '0 0 0 2px rgba(59, 130, 246, 0.5)'
                      : 'none',
                  transition: 'all 0.3s ease',
                },
              })}
            />
          </div>
        </div>

        <CalendarModal
          showModal={showModal}
          selectedDate={selectedDate}
          currentRecipe={currentRecipe.content}
          isEditing={isEditing}
          handleEdit={handleEdit}
          handleSave={handleSave}
          handleCancel={handleCancel}
          handleDelete={handleDelete}
          setCurrentRecipe={(content) =>
            setCurrentRecipe((prev) => ({ ...prev, content }))
          }
          hasRecipe={!!currentRecipe.id}
        />
      </div>
    </div>
  )
}

export default MedicalCalendar
