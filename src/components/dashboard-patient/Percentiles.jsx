import {
  FaRulerCombined,
  FaWeightScale,
  FaRuler,
  FaSkull,
} from 'react-icons/fa6'

const Percentiles = ({
  weight = { z: -1.35, percentil: 8.9 },
  size = { z: 0.54, percentil: 70.4 },
  pc = { z: -2.2, percentil: 1.4 },
}) => {
  return (
    <section className='w-full py-3 px-7 bg-white dark:bg-slate-800 rounded-lg shadow-md flex gap-5 flex-col pb-4'>
      <h2 className='flex justify-start items-center gap-1 text-secondary border-b border-gray-300 p-4 font-semibold text-xl'>
        <FaRulerCombined />
        Percentiles
      </h2>
      <div className='grid grid-cols-2 gap-4'>
        <div className='flex flex-col border-b border-gray-300 gap-2 pb-4'>
          <span className='text-gray-500 flex justify-start items-center gap-1'>
            <FaWeightScale />
            Peso para la edad
          </span>
          <p className='text-text-light dark:text-text-dark font-semibold'>
            Z-Score: {weight.z}
          </p>
          <p className='text-text-light dark:text-text-dark font-semibold'>
            Percentil: {weight.percentil}%
          </p>
          <p className='bg-orange-500 text-white w-fit p-1 rounded-md'>
            Interpretación: ligeramente por debajo del promedio
          </p>
        </div>
        <div className='flex flex-col border-b border-gray-300 gap-2 pb-4'>
          <span className='text-gray-500 flex justify-start items-center gap-1'>
            <FaRuler />
            Talla para la edad
          </span>
          <p className='text-text-light dark:text-text-dark font-semibold'>
            Z-Score: {size.z}
          </p>
          <p className='text-text-light dark:text-text-dark font-semibold'>
            Percentil: {size.percentil}%
          </p>
          <p className='bg-green-500 text-white w-fit p-1 rounded-md'>
            Interpretación: dentro del rango normal
          </p>
        </div>
        <div className='flex flex-col border-b border-gray-300 gap-2 pb-4'>
          <span className='text-gray-500 flex justify-start items-center gap-1'>
            <FaSkull />
            Circunferencia cefálica para la edad
          </span>
          <p className='text-text-light dark:text-text-dark font-semibold'>
            Z-Score: {pc.z}
          </p>
          <p className='text-text-light dark:text-text-dark font-semibold'>
            Percentil: {pc.percentil}%
          </p>
          <p className='bg-red-500 text-white w-fit p-1 rounded-md'>
            Interpretación: por debajo del esperado
          </p>
        </div>
      </div>
    </section>
  )
}

export default Percentiles
