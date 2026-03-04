import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ThemeSwitch from './ThemeSwitch'
import { useAuth } from '../../context/AuthContext'
import Tooltip from '@mui/material/Tooltip'
import { triggerManualSyncRequest, getSyncStatusRequest } from '../../api/sync'

import {
  FaArrowRightFromBracket,
  FaArrowUpRightFromSquare,
  FaFileMedical,
  FaStethoscope,
  FaUserDoctor,
  FaCloud,
  FaServer,
  FaArrowsRotate
} from 'react-icons/fa6'

const Header = ({ patientPage, openModal }) => {
  const { logout } = useAuth()

  // Determinar si estamos conectados al servidor local o en la nube
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const isLocal = apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1');

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ isSynced: true, totalPending: 0 });

  // Polling para el estado de sincronización (cada 15 segundos)
  useEffect(() => {
    if (!isLocal) return;

    const checkSyncStatus = async () => {
      try {
        const res = await getSyncStatusRequest();
        setSyncStatus(res.data);
      } catch (error) {
        console.error('Error fetching sync status:', error);
      }
    };

    // Verificación inicial
    checkSyncStatus();

    const interval = setInterval(checkSyncStatus, 15000);
    return () => clearInterval(interval);
  }, [isLocal, isSyncing]); // Dependemos de isSyncing para recargar al terminar un sync manual

  const handleManualSync = async () => {
    if (isSyncing) return;

    if (isLocal) {
      try {
        setIsSyncing(true);
        await triggerManualSyncRequest();
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (error) {
        console.error('Error in manual sync:', error);
        alert('Error sincronizando con la nube: ' + (error.response?.data?.message || error.message));
        setIsSyncing(false);
        return;
      }
    } else {
      // Si es nube, simular un peque\u00f1o delay visual
      setIsSyncing(true);
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    // Recargar la p\u00e1gina para traer los datos frescos
    window.location.reload();
  };

  return (
    <header className='top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-white/95 via-slate-50/95 to-white/95 dark:from-slate-900/95 dark:via-slate-800/95 dark:to-slate-900/95 border-b border-slate-200/50 dark:border-slate-700/50 shadow-xl'>
      <div className='flex flex-col lg:flex-row justify-between items-center p-4 sm:p-6 gap-4 lg:gap-6 w-full max-w-7xl mx-auto'>
        {/* Logo y título mejorado */}
        <div className='flex items-center gap-4'>
          <div className='flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-lg ring-4 ring-white/20 dark:ring-slate-700/50'>
            <FaStethoscope className='text-white text-xl' />
          </div>
          <div>
            <div className='flex items-center gap-3'>
              <h1 className='font-bold text-xl sm:text-2xl lg:text-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight'>
                Consultorio Dra. Eunice Brito
              </h1>
              {/* Badge y Botón de Sincronización */}
              <div className="flex items-center gap-2">

                {/* Indicador de Desincronización (Solo Local) */}
                {isLocal && !syncStatus.isSynced && (
                  <Tooltip title={`Hay ${syncStatus.totalPending} registro(s) local(es) pendiente(s) por subir a la Nube. La sincronización se hará en breve.`} arrow>
                    <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm whitespace-nowrap bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-300 dark:border-amber-700 animate-pulse">
                      Desincronizado ({syncStatus.totalPending})
                    </div>
                  </Tooltip>
                )}

                <Tooltip title={isLocal ? "Conectado al servidor local de la clínica. Los datos se sincronizan en 2do plano." : "Conectado directamente a la nube."} arrow>
                  <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm whitespace-nowrap ${isLocal
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                    }`}>
                    {isLocal ? <FaServer className="text-[10px]" /> : <FaCloud className="text-[10px]" />}
                    {isLocal ? 'Modo Local' : 'Nube'}
                  </div>
                </Tooltip>

                <Tooltip title={isLocal ? "Sincronizar con la nube y recargar" : "Recargar datos"} arrow>
                  <button
                    onClick={handleManualSync}
                    disabled={isSyncing}
                    className={`hidden md:flex items-center justify-center p-1.5 rounded-full transition-all duration-300 ${isSyncing
                      ? isLocal ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200 shadow-inner' : 'bg-blue-200 text-blue-800 shadow-inner'
                      : isLocal
                        ? 'bg-white border border-emerald-300 text-emerald-600 hover:bg-emerald-50 dark:bg-slate-800 dark:border-emerald-700 dark:hover:bg-emerald-900/30'
                        : 'bg-white border border-blue-300 text-blue-600 hover:bg-blue-50 dark:bg-slate-800'
                      }`}
                  >
                    <FaArrowsRotate className={`text-sm ${isSyncing ? 'animate-spin' : 'hover:rotate-180 transition-transform duration-500'}`} />
                  </button>
                </Tooltip>
              </div>
            </div>
            <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium'>
              Sistema de Gestión Médica
            </p>
          </div>
        </div>

        {/* Badge móvil */}
        <div className='md:hidden flex flex-col items-center w-full gap-2 mb-2'>
          <div className='flex items-center gap-2'>
            <Tooltip title={isLocal ? "Servidor Local" : "Nube"} arrow>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${isLocal
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                }`}>
                {isLocal ? <FaServer className="text-[10px]" /> : <FaCloud className="text-[10px]" />}
                {isLocal ? 'Modo Local' : 'Modo Nube'}
              </div>
            </Tooltip>
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className={`p-1.5 rounded-full transition-all duration-300 ${isSyncing
                ? isLocal ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-800' : 'bg-blue-200 text-blue-800'
                : isLocal ? 'bg-white border border-emerald-300 text-emerald-600' : 'bg-white border border-blue-300 text-blue-600'
                }`}
            >
              <FaArrowsRotate className={`text-sm ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Indicador móvil de Desincronización */}
          {isLocal && !syncStatus.isSynced && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold shadow-sm bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-300 dark:border-amber-700 animate-pulse">
              Desincronizado ({syncStatus.totalPending} pendientes)
            </div>
          )}
        </div>

        {/* Navegación mejorada */}
        <div className='flex items-center gap-3 flex-wrap justify-center lg:justify-end'>
          {patientPage ? (
            <>
              <Tooltip title='Gestión de Recetas Médicas' arrow>
                <button
                  onClick={openModal.openMedicalCalendar}
                  className='group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-emerald-500/20 hover:border-emerald-400/30'
                >
                  <FaFileMedical className='transition-transform duration-300 group-hover:rotate-12' />
                  <span className='hidden sm:inline'>Recetas</span>
                </button>
              </Tooltip>

              <Tooltip title='Calendario de Vacunación' arrow>
                <button
                  onClick={openModal.openVaccinationSchedule}
                  className='group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-violet-500/20 hover:border-violet-400/30'
                >
                  <FaArrowUpRightFromSquare className='transition-transform duration-300 group-hover:scale-110' />
                  <span className='hidden sm:inline'>Vacunas</span>
                </button>
              </Tooltip>

              <Tooltip title='Editar Información del Paciente' arrow>
                <button
                  onClick={openModal.openFormModal}
                  className='group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-blue-500/20 hover:border-blue-400/30'
                >
                  <FaUserDoctor className='transition-transform duration-300 group-hover:rotate-12' />
                  <span className='hidden sm:inline'>Editar</span>
                </button>
              </Tooltip>

              <Tooltip title='Volver al Dashboard Principal' arrow>
                <Link
                  to='/dashboard-doctor'
                  className='group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-amber-500/20 hover:border-amber-400/30'
                >
                  <FaArrowRightFromBracket className='rotate-180 transition-transform duration-300 group-hover:-translate-x-1' />
                  <span className='hidden sm:inline'>Dashboard</span>
                </Link>
              </Tooltip>
            </>
          ) : (
            <></>
          )}

          {/* Separador visual */}
          {patientPage && (
            <div className='w-px h-8 bg-gradient-to-b from-transparent via-slate-300 dark:via-slate-600 to-transparent'></div>
          )}

          <Tooltip title='Cerrar Sesión' arrow>
            <Link
              to='/signin'
              onClick={() => logout()}
              className='group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-red-500/20 hover:border-red-400/30'
            >
              <FaArrowRightFromBracket className='transition-transform duration-300 group-hover:translate-x-1' />
              <span className='hidden sm:inline'>Salir</span>
            </Link>
          </Tooltip>

          <div className='flex items-center justify-center'>
            <ThemeSwitch />
          </div>
        </div>
      </div>

      {/* Barra decorativa inferior */}
      <div className='h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30'></div>
    </header>
  )
}

export default Header
