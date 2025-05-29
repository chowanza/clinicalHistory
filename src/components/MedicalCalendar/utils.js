export const normalizeDate = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const convertRecipesToEvents = (recipes) => {
  return Object.values(recipes).map((recipe) => ({
    start: recipe.date,
    end: recipe.date,
    title:
      recipe.description.split('\n')[0].substring(0, 20) +
      (recipe.description.length > 20 ? '...' : ''),
    allDay: true,
    id: recipe._id, // Incluir el ID en los eventos
  }))
}

export const calendarMessages = {
  today: 'Hoy',
  previous: 'Anterior',
  next: 'Siguiente',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'No hay eventos en este rango.',
  showMore: (total) => `+ Ver más (${total})`,
}

export const calendarFormats = {
  dayFormat: 'dddd D',
  monthHeaderFormat: 'MMMM YYYY',
  dayHeaderFormat: 'dddd D MMMM',
  dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
    localizer.format(start, 'D MMMM', culture) +
    ' - ' +
    localizer.format(end, 'D MMMM', culture),
}
