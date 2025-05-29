import React from 'react'
import moment from 'moment'

const Sidebar = ({ recipes, onEventClick }) => {
  const recipeArray = Object.values(recipes)

  return (
    <div className='w-64 mr-4 overflow-y-auto sidebar border-r border-gray-200'>
      <h3 className='font-bold mb-4 text-lg p-2 bg-gray-50 rounded'>
        Recetas Médicas
      </h3>

      {recipeArray.length === 0 ? (
        <div className='p-3 text-gray-500 text-center'>
          No hay recetas registradas
        </div>
      ) : (
        <ul className='space-y-2 p-2'>
          {recipeArray
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((recipe) => (
              <li
                key={recipe._id} // Usar el ID único
                onClick={() => onEventClick(recipe)} // Pasar la receta completa
                className='p-3 cursor-pointer hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100'
              >
                <div className='font-medium text-gray-800'>
                  {moment(recipe.date).format('D MMMM YYYY')}
                </div>
                <div className='text-sm text-gray-600 mt-1 line-clamp-2'>
                  {recipe.description.split('\n').slice(0, 2).join(' - ')}
                  {recipe.description.split('\n').length > 2 && '...'}
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}

export default Sidebar
