import {
  FaRulerCombined,
  FaWeightScale,
  FaRuler,
  FaSkull,
} from 'react-icons/fa6'
import { calculateAllPercentiles } from '../../utils/lmsUtils'
import weightData from '../../data/weight_for_age.json'
import lengthData from '../../data/length_for_age.json'
import weightLengthData from '../../data/weight_for_length.json'
import headData from '../../data/head_circumference_for_age.json'

const datasets = {
  weight: weightData,
  length: lengthData,
  weightLength: weightLengthData,
  head: headData,
}

export const calculatePercentiles = (inputs) => {
  const results = calculateAllPercentiles(datasets, inputs)

  // Formatear el Z-Score para mostrar 2 decimales
  const formatZScore = (z) => {
    return z !== null && z !== undefined ? z.toFixed(2) : 'N/A'
  }

  // Formatear el percentil para mostrar 1 decimal
  const formatPercentile = (p) => {
    return p !== null && p !== undefined ? p.toFixed(1) : 'N/A'
  }

  return {
    weight: {
      z: formatZScore(results.weight.z),
      percentile: formatPercentile(results.weight.percentile),
    },
    length: {
      z: formatZScore(results.length.z),
      percentile: formatPercentile(results.length.percentile),
    },
    head: {
      z: formatZScore(results.head.z),
      percentile: formatPercentile(results.head.percentile),
    },
    weightLength: {
      z: formatZScore(results.weightLength.z),
      percentile: formatPercentile(results.weightLength.percentile),
    },
  }
}

export const Percentiles = ({ inputs }) => {
  // Calcular los percentiles usando los inputs recibidos
  const results = calculateAllPercentiles(datasets, inputs)

  // Función para determinar la interpretación según el percentil
  const getInterpretation = (percentile) => {
    if (percentile === null || percentile === undefined) return 'No disponible'
    if (percentile < 3) return 'Muy por debajo del esperado'
    if (percentile < 10) return 'Por debajo del esperado'
    if (percentile < 25) return 'Ligeramente por debajo del promedio'
    if (percentile < 75) return 'Dentro del rango normal'
    if (percentile < 90) return 'Ligeramente por encima del promedio'
    if (percentile < 97) return 'Por encima del esperado'
    return 'Muy por encima del esperado'
  }

  // Función para determinar el color según la interpretación
  const getInterpretationColor = (percentile) => {
    if (percentile === null || percentile === undefined) return 'bg-gray-500'
    if (percentile < 3) return 'bg-red-700'
    if (percentile < 10) return 'bg-red-500'
    if (percentile < 25) return 'bg-orange-500'
    if (percentile < 75) return 'bg-green-500'
    if (percentile < 90) return 'bg-orange-500'
    if (percentile < 97) return 'bg-red-500'
    return 'bg-red-700'
  }

  // Formatear el Z-Score para mostrar 2 decimales
  const formatZScore = (z) => {
    return z !== null && z !== undefined ? z.toFixed(2) : 'N/A'
  }

  // Formatear el percentil para mostrar 1 decimal
  const formatPercentile = (p) => {
    return p !== null && p !== undefined ? p.toFixed(1) : 'N/A'
  }

  return (
    <section className='w-full py-3 px-7 bg-white dark:bg-slate-800 rounded-lg shadow-md flex gap-5 flex-col pb-4'>
      <h2 className='flex justify-start items-center gap-1 text-secondary border-b border-gray-300 p-4 font-semibold text-xl'>
        <FaRulerCombined />
        Percentiles
      </h2>
      <div className='grid grid-cols-2 gap-4'>
        {/* Peso para la edad */}
        {results.weight && (
          <div className='flex flex-col border-b border-gray-300 gap-2 pb-4'>
            <span className='text-gray-500 flex justify-start items-center gap-1'>
              <FaWeightScale />
              Peso para la edad
            </span>
            <p className='text-text-light dark:text-text-dark font-semibold'>
              Z-Score: {formatZScore(results.weight.z)}
            </p>
            <p className='text-text-light dark:text-text-dark font-semibold'>
              Percentil: {formatPercentile(results.weight.percentile)}%
            </p>
            <p
              className={`${getInterpretationColor(
                results.weight.percentile
              )} text-white w-fit p-1 rounded-md`}
            >
              Interpretación: {getInterpretation(results.weight.percentile)}
            </p>
          </div>
        )}

        {/* Talla para la edad */}
        {results.length && (
          <div className='flex flex-col border-b border-gray-300 gap-2 pb-4'>
            <span className='text-gray-500 flex justify-start items-center gap-1'>
              <FaRuler />
              Talla para la edad
            </span>
            <p className='text-text-light dark:text-text-dark font-semibold'>
              Z-Score: {formatZScore(results.length.z)}
            </p>
            <p className='text-text-light dark:text-text-dark font-semibold'>
              Percentil: {formatPercentile(results.length.percentile)}%
            </p>
            <p
              className={`${getInterpretationColor(
                results.length.percentile
              )} text-white w-fit p-1 rounded-md`}
            >
              Interpretación: {getInterpretation(results.length.percentile)}
            </p>
          </div>
        )}

        {/* Peso para la talla */}
        {results.weightLength && (
          <div className='flex flex-col border-b border-gray-300 gap-2 pb-4'>
            <span className='text-gray-500 flex justify-start items-center gap-1'>
              <FaWeightScale />
              Peso para la talla
            </span>
            <p className='text-text-light dark:text-text-dark font-semibold'>
              Z-Score: {formatZScore(results.weightLength.z)}
            </p>
            <p className='text-text-light dark:text-text-dark font-semibold'>
              Percentil: {formatPercentile(results.weightLength.percentile)}%
            </p>
            <p
              className={`${getInterpretationColor(
                results.weightLength.percentile
              )} text-white w-fit p-1 rounded-md`}
            >
              Interpretación:{' '}
              {getInterpretation(results.weightLength.percentile)}
            </p>
          </div>
        )}

        {/* Circunferencia cefálica para la edad */}
        {results.head && (
          <div className='flex flex-col border-b border-gray-300 gap-2 pb-4'>
            <span className='text-gray-500 flex justify-start items-center gap-1'>
              <FaSkull />
              Circunferencia cefálica para la edad
            </span>
            <p className='text-text-light dark:text-text-dark font-semibold'>
              Z-Score: {formatZScore(results.head.z)}
            </p>
            <p className='text-text-light dark:text-text-dark font-semibold'>
              Percentil: {formatPercentile(results.head.percentile)}%
            </p>
            <p
              className={`${getInterpretationColor(
                results.head.percentile
              )} text-white w-fit p-1 rounded-md`}
            >
              Interpretación: {getInterpretation(results.head.percentile)}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Percentiles
