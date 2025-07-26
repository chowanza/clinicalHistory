import { motion, AnimatePresence } from 'framer-motion'

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

const Modal = ({ isOpen, onClose, children, size }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 w-screen h-screen backdrop-blur-sm p-2 sm:p-4`}
          variants={backdropVariants}
          initial='hidden'
          animate='visible'
          exit='exit'
          transition={{ duration: 0.1 }}
        >
          <motion.div
            className={`rounded-2xl shadow-2xl relative w-full h-full sm:w-11/12 sm:h-5/6 md:w-4/5 md:h-5/6 lg:w-3/4 lg:h-4/5 xl:w-2/3 xl:h-3/4 overflow-y-auto dark:bg-background-dark dark:text-text-dark bg-background-light text-text-light p-2 sm:p-4 md:p-6 lg:p-8 scrollbar-modal ${
              size == 'large' ? 'w-full h-full sm:w-11/12 sm:h-11/12 md:w-10/12 md:h-10/12 lg:w-9/12 lg:h-9/12' : ''
            }`}
            variants={modalVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            transition={{ duration: 0.1, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal
