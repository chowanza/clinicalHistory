import { useState, useCallback } from 'react';
import { FaPlus, FaFileExport } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import EnhancedTable from '../components/dashboard-doctor/EnhancedTable';
import Modal from '../components/ui/Modal';
import FormPatient from '../components/dashboard-doctor/FormPatient';
import PatientSearchBar from '../components/dashboard-doctor/PatientSearchBar';
import ImportExcelModal from '../components/dashboard-doctor/ImportExcelModal';

const DashboardDoctor = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('');
  const [modalState, setModalState] = useState({
    form: false,
    import: false
  });
  const [importedData, setImportedData] = useState(null);

  // Abre el modal de formulario y limpia datos importados
  const openFormModal = useCallback(() => {
    setModalState({ form: true, import: false });
    setImportedData(null);
  }, []);

  // Abre el modal de importación
  const openImportModal = useCallback(() => {
    setModalState({ form: false, import: true });
  }, []);

  // Cierra todos los modales
  const closeModals = useCallback(() => {
    setModalState({ form: false, import: false });
  }, []);

  // Maneja los datos importados desde Excel
  const handleExcelImport = useCallback((data) => {
    setImportedData(data);
    setModalState({ form: true, import: false }); // Cierra importación y abre formulario
  }, []);

  return (
    <main className='relative min-h-[calc(100vh-73.99px)] bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark px-4 md:px-24 py-5'>
      {/* Modal para formulario de paciente */}
      <Modal isOpen={modalState.form} onClose={closeModals}>
        <div className="relative h-full">
          <button
            onClick={closeModals}
            className='p-3 text-white font-semibold rounded-xl bg-[#791010] flex items-center gap-2 border-slate-400 border cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-[#791010]/50 hover:outline-2 hover:outline-white hover:bg-opacity-80 hover:animate-pulse absolute top-4 right-4 z-50'
          >
            Cerrar
          </button>
          <div className="pt-16 h-full overflow-y-auto">
            <FormPatient 
              closeModal={closeModals} 
              patientData={importedData || {}} 
            />
          </div>
        </div>
      </Modal>

      {/* Modal para importar desde Excel */}
      <Modal isOpen={modalState.import} onClose={closeModals}>
        <div className="relative h-full p-4">
          <ImportExcelModal 
            onClose={closeModals}
            onImport={handleExcelImport}
          />
        </div>
      </Modal>

      {/* Contenido principal */}
      <div className='flex flex-col justify-center w-full h-full grow'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-4 mb-6'>
          <PatientSearchBar filter={filter} setFilter={setFilter} />
          <div className='flex gap-4 w-full md:w-auto'>
            <button
              className='p-3 text-white font-semibold rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center gap-2 border-slate-400 border cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-secondary/50 hover:outline-2 hover:outline-white hover:bg-opacity-80 hover:animate-pulse flex-1 md:flex-none'
              onClick={openFormModal}
            >
              <FaPlus />
              <span className='whitespace-nowrap'>Agregar Nuevo Registro</span>
            </button>
            <button
              className='p-3 text-white font-semibold rounded-xl bg-[#10793F] flex items-center gap-2 border-slate-400 border cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-[#10793F]/50 hover:outline-2 hover:outline-white hover:bg-opacity-80 hover:animate-pulse flex-1 md:flex-none'
              onClick={openImportModal}
            >
              <FaFileExport />
              <span className='whitespace-nowrap'>Importar desde Excel</span>
            </button>
          </div>
        </div>
        <EnhancedTable filter={filter} />
      </div>
    </main>
  );
};

export default DashboardDoctor;