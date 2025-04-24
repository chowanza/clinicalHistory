const FormPatient = ({ closeModal }) => {
  return (
    <div className='w-full min-h-full dark:bg-background-dark dark:text-text-dark bg-background-light text-text-light flex justify-center items-center flex-col'>
      <h1 className='text-center text-3xl font-bold'>New Patient</h1>
      <form className='w-2/3 flex flex-col gap-4 p-4 px-8 rounded-lg mt-8 mx-auto m-0 overflow-hidden relative bg-white max-h-max dark:bg-slate-800 shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:shadow-[0_3px_20px_rgb(20,10,100,0.5)]'>
        <section className='grid grid-cols-6 grid-rows-[auto_1fr_1fr_1fr] gap-2'>
          <h2 className='col-span-6 text-xl font-bold'>Personal Information</h2>
          <div className='col-span-3'>
            <label
              htmlFor='first-names'
              className='block text-sm font-medium text-text-light/60 dark:text-text-dark/70'
            >
              First Names
            </label>
            <input
              type='text'
              name='first-names'
              required
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl w-full dark:bg-slate-700 placeholder:text-red-500'
            />
          </div>
          <div className='col-span-3'>
            <label
              htmlFor='last-names'
              className='block text-sm font-medium text-text-light/60 dark:text-text-dark/70'
            >
              Last Names
            </label>
            <input
              type='text'
              name='first-names'
              required
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl w-full dark:bg-slate-700 placeholder:text-red-500'
            />
          </div>
          <div className='col-span-3'>
            <label
              htmlFor='birth-date'
              className='block text-sm font-medium text-text-light/60 dark:text-text-dark/70'
            >
              Birth Date
            </label>
            <input
              type='date'
              name='birth-date'
              required
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl w-full dark:bg-slate-700 placeholder:text-red-500'
            />
          </div>
          <div className='col-span-3'>
            <label
              htmlFor='actual-age'
              className='block text-sm font-medium text-text-light/60 dark:text-text-dark/70'
            >
              Actual Age
            </label>
            <input
              type='number'
              name='actual-age'
              required
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl w-full dark:bg-slate-700 placeholder:text-red-500'
            />
          </div>
          <div className='col-span-3'>
            <label
              htmlFor='phone'
              className='block text-sm font-medium text-text-light/60 dark:text-text-dark/70'
            >
              Phone
            </label>
            <input
              type='text'
              name='phone'
              required
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl w-full dark:bg-slate-700 placeholder:text-red-500'
            />
          </div>
          <div className='col-span-3'>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-text-light/60 dark:text-text-dark/70'
            >
              Email
            </label>
            <input
              type='email'
              name='email'
              required
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl w-full dark:bg-slate-700 placeholder:text-red-500'
            />
          </div>
        </section>
        <section className='grid grid-cols-6 grid-rows-[auto_1fr] gap-2'>
          <h2 className='col-span-6 text-xl font-bold self-end'>
            Family Information
          </h2>
          <div className='col-span-3'>
            <label
              htmlFor='dad-name'
              className='block text-sm font-medium text-text-light/60 dark:text-text-dark/70'
            >
              Dad Name
            </label>
            <input
              type='text'
              name='dad-name'
              required
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl w-full dark:bg-slate-700 placeholder:text-red-500'
            />
          </div>
          <div className='col-span-3'>
            <label
              htmlFor='mom-name'
              className='block text-sm font-medium text-text-light/60 dark:text-text-dark/70'
            >
              Mom Name
            </label>
            <input
              type='text'
              name='mom-name'
              required
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl w-full dark:bg-slate-700 placeholder:text-red-500'
            />
          </div>
        </section>
        <section className='grid grid-cols-6 grid-rows-[auto_repeat(5,_1fr)] gap-2'>
          <h2 className='text-xl font-bold col-span-6'>Medical Information</h2>
          <div className='col-span-6'>
            <label
              htmlFor='neonatal-history'
              className='block text-sm font-medium text-text-light/60 dark:text-text-dark/70'
            >
              Neonatal History
            </label>
            <textarea
              name='neonatal-history'
              rows='3'
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl w-full dark:bg-slate-700 placeholder:text-red-500 resize-y'
            />
          </div>
          <div className='col-span-6'>
            <label
              htmlFor='personal-history'
              className='block text-sm font-medium text-text-light/60 dark:text-text-dark/70'
            >
              Personal History
            </label>
            <textarea
              name='personal-history'
              rows='3'
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl w-full dark:bg-slate-700 placeholder:text-red-500 resize-y'
            />
          </div>
          <div className='col-span-6'>
            <label
              htmlFor='family-history'
              className='block text-sm font-medium text-text-light/60 dark:text-text-dark/70'
            >
              Family History
            </label>
            <textarea
              name='family-history'
              rows='3'
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl w-full dark:bg-slate-700 placeholder:text-red-500 resize-y'
            />
          </div>
          <div className='col-span-6'>
            <label
              htmlFor='reason-for-consultation'
              className='block text-sm font-medium text-text-light/60 dark:text-text-dark/70'
            >
              Reason for Consultation
            </label>
            <textarea
              name='reason-for-consultation'
              rows='3'
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl w-full dark:bg-slate-700 placeholder:text-red-500 resize-y'
            />
          </div>
          <div className='col-span-6'>
            <label
              htmlFor='physical-exam'
              className='block text-sm font-medium text-text-light/60 dark:text-text-dark/70'
            >
              Physical Exam
            </label>
            <textarea
              name='physical-exam'
              rows='3'
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl w-full dark:bg-slate-700 placeholder:text-red-500 resize-y'
            />
          </div>
          <div className='col-span-2'>
            <label
              htmlFor='weight'
              className='block text-sm font-medium text-text-light/60 dark:text-text-dark/70'
            >
              Weight (kg)
            </label>
            <input
              type='text'
              name='weight'
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl w-full dark:bg-slate-700 placeholder:text-red-500'
            />
          </div>
          <div className='col-span-2'>
            <label
              htmlFor='height'
              className='block text-sm font-medium text-text-light/60 dark:text-text-dark/70'
            >
              Height (cm)
            </label>
            <input
              type='text'
              name='height'
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl w-full dark:bg-slate-700 placeholder:text-red-500'
            />
          </div>
          <div className='col-span-2'>
            <label
              htmlFor='head-circumference'
              className='block text-sm font-medium text-text-light/60 dark:text-text-dark/70'
            >
              Head Circumference (cm)
            </label>
            <input
              type='text'
              name='head-circumference'
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl w-full dark:bg-slate-700 placeholder:text-red-500'
            />
          </div>
        </section>
        <section className='grid grid-cols-1 grid-rows-[auto_1fr_1fr_1fr] gap-2'>
          <h2 className='text-xl font-bold mb-4'>Diagnosis and treatment</h2>
          <div>
            <label
              htmlFor='diagnosis'
              className='block text-sm font-medium text-text-light/60 dark:text-text-dark/70'
            >
              Diagnosis
            </label>
            <textarea
              name='diagnosis'
              rows='3'
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl w-full dark:bg-slate-700 placeholder:text-red-500 resize-y'
            />
          </div>
          <div>
            <label
              htmlFor='treatment'
              className='block text-sm font-medium text-text-light/60 dark:text-text-dark/70'
            >
              Treatment
            </label>
            <textarea
              name='treatment'
              rows='3'
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl w-full dark:bg-slate-700 placeholder:text-red-500 resize-y'
            />
          </div>
          <div>
            <label
              htmlFor='exams'
              className='block text-sm font-medium text-text-light/60 dark:text-text-dark/70'
            >
              Exams
            </label>
            <textarea
              name='exams'
              rows='3'
              className='border-slate-400 bg-slate-50 border p-2 rounded-xl w-full dark:bg-slate-700 placeholder:text-red-500 resize-y'
            />
          </div>
        </section>

        <div className='flex justify-end gap-4 mt-8'>
          <button
            type='button'
            onClick={closeModal}
            className='p-3 text-white font-semibold rounded-xl bg-[#791010] flex items-center gap-2 border-slate-400 border cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-[#791010]/50 hover:outline-2 hover:outline-white hover:bg-opacity-80 hover:animate-pulse'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='p-3 text-white font-semibold rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center gap-2 border-slate-400 border cursor-pointer
             hover:scale-105 transition-transform duration-300 
             hover:shadow-lg hover:shadow-secondary/50 
             hover:outline-2 hover:outline-white 
             hover:bg-opacity-80 hover:animate-pulse'
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormPatient
