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
          className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 w-screen h-screen backdrop-blur-sm`}
          variants={backdropVariants}
          initial='hidden'
          animate='visible'
          exit='exit'
          transition={{ duration: 0.1 }}
        >
          <motion.div
            className={`rounded-2xl shadow-2xl relative w-4/5 h-5/6 overflow-y-auto dark:bg-background-dark dark:text-text-dark bg-background-light text-text-light p-8 scrollbar-modal ${
              size == 'large' ? 'w-11/12 h-11/12' : ''
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
