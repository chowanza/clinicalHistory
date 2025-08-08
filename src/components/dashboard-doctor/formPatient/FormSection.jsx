const FormSection = ({
  register,
  sectionTitle,
  fields,
  gridColumns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  patientData = {},
  setValue,
  watch,
}) => {
  return (
    <section className={`grid ${gridColumns} gap-2 sm:gap-3 lg:gap-4`}>
      <h2 className='col-span-full text-lg sm:text-xl font-bold mb-3 sm:mb-4'>{sectionTitle}</h2>
      {fields.map((field, index) => (
        <div
          key={index}
          className={field.colSpan ? `${field.colSpan}` : 'col-span-1 sm:col-span-2 lg:col-span-3'}
        >
          <label
            htmlFor={field.name}
            className='block text-sm font-medium text-text-light/60 dark:text-text-dark/70 mb-1'
          >
            {field.label}
          </label>
          {field.isTextArea ? (
            <textarea
              required={field.required !== false}
              {...register(field.name)}
              id={field.name}
              rows={field.rows || 3}
              defaultValue={patientData?.[field.name] || ''}
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl w-full dark:bg-slate-700 placeholder:text-red-500 resize-y min-h-[80px] text-sm sm:text-base'
            />
          ) : field.type === 'number' ? (
            <div className='flex items-center gap-2'>
              <input
                required={field.required !== false}
                {...register(field.name, { valueAsNumber: true, min: 1 })}
                type='number'
                id={field.name}
                min={field.min || 1}
                step={field.step}
                value={
                  watch && (watch(field.name) !== undefined && watch(field.name) !== null && watch(field.name) !== '')
                    ? watch(field.name)
                    : 1
                }
                onChange={e => {
                  const val = e.target.value === '' ? 1 : e.target.value;
                  setValue(field.name, val);
                }}
                className='border-slate-400 bg-slate-50 border p-2 rounded-xl w-full dark:bg-slate-700 placeholder:text-red-500 input-date-color text-sm sm:text-base'
              />
              {field.unit && (
                <span className='text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap'>{field.unit}</span>
              )}
            </div>
          ) : (
            <input
              required={field.required !== false}
              {...register(field.name)}
              type={field.type || 'text'}
              id={field.name}
              defaultValue={patientData?.[field.name] || ''}
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl w-full dark:bg-slate-700 placeholder:text-red-500 input-date-color text-sm sm:text-base'
            />
          )}
        </div>
      ))}
    </section>
  )
}

export default FormSection
