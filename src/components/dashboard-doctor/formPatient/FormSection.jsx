const FormSection = ({
  register,
  sectionTitle,
  fields,
  gridColumns = 'grid-cols-6',
}) => {
  return (
    <section className={`grid ${gridColumns} gap-2`}>
      <h2 className='col-span-full text-xl font-bold mb-4'>{sectionTitle}</h2>
      {fields.map((field, index) => (
        <div
          key={index}
          className={field.colSpan ? `${field.colSpan}` : 'col-span-3'}
        >
          <label
            htmlFor={field.name}
            className='block text-sm font-medium text-text-light/60 dark:text-text-dark/70'
          >
            {field.label}
          </label>
          {field.isTextArea ? (
            <textarea
              {...register(field.name)}
              id={field.name}
              rows={field.rows || 3}
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl w-full dark:bg-slate-700 placeholder:text-red-500 resize-y'
            />
          ) : (
            <input
              {...register(field.name)}
              type={field.type || 'text'}
              id={field.name}
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl w-full dark:bg-slate-700 placeholder:text-red-500'
            />
          )}
        </div>
      ))}
    </section>
  )
}

export default FormSection
