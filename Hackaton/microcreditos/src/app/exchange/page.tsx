// src/app/exchange/page.tsx
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { HomeIcon, Cog6ToothIcon, WalletIcon } from '@heroicons/react/24/outline';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import Image from 'next/image';

// --- Interfaces de Usuario ---
interface UserInfo {
  address: string;
  username: string | null;
}

const WldCoinIcon = ({ className = "w-6 h-6" }: { className?: string }) => ( // Icono para WLD
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#E0E0E0" />
    <path d="M12 5V19M12 5C9.23858 5 7 7.23858 7 10V14C7 16.7614 9.23858 19 12 19M12 5C14.7614 5 17 7.23858 17 10V14C17 16.7614 14.7614 19 12 19" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" fill="#38BDF8" />
  </svg>
);
const UsdcCoinIcon = ({ className = "w-6 h-6" }: { className?: string }) => ( // Icono para USDC
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#2775CA" />
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">USDC</text>
  </svg>
);
const InfoIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);
const CheckCircleIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// --- Iconos de Categorías (necesarios para navItems) ---
const ExchangeIconNav = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h18m-7.5-14L21 7.5m0 0L16.5 12M21 7.5H3" />
  </svg>
);
const MicroloanIconNav = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0H21m-9 12.75h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V10.5zm0 2.25h.008v.008h-.008v-.008zM4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
  </svg>
);
const SurveyIconNav = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25c.621 0 1.125.504 1.125 1.125v3.375c0 .621-.504 1.125-1.125 1.125h-1.5c-.621 0-1.125-.504-1.125-1.125v-3.375c0-.621.504-1.125 1.125-1.125h1.5zM17.25 10.5h.008v.008h-.008V10.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.875 2.25c.621 0 1.125.504 1.125 1.125v3.375c0 .621-.504 1.125-1.125 1.125h-1.5c-.621 0-1.125-.504-1.125-1.125V3.375c0-.621.504-1.125 1.125-1.125h1.5Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008ZM10.5 15h.008v.008H10.5V15Zm0 2.25h.008v.008H10.5v-.008Zm0 2.25h.008v.008H10.5v-.008Z" />
  </svg>
);

const CLIENT_SIDE_FEE_PERCENTAGE = 1; // 1%
const CLIENT_SIDE_MOCK_EXCHANGE_RATE = 0.75; // 1 WLD = 0.75 USDC (solo para estimación inicial)
const POOL_CONTRIBUTIONS_LOCALSTORAGE_KEY = "poolContributionsCountV2";
// ¡Agrega la constante faltante aquí!
const USER_CONTRIBUTIONS_HISTORY_LOCALSTORAGE_KEY = "userContributionsHistory"; // Para la lista de aportaciones
const CONTRIBUTION_FROM_EXCHANGE = 1; // Cantidad a aumentar por un intercambio exitoso

interface SimulationResultData {
  exchangedWLD: number;
  receivedUSDC: number;
  feePaid: number;
  exchangeRateUsed: number;
}

export default function ExchangePage() {
  const router = useRouter();
  const pathname = usePathname();

  // Estado para simular la información del usuario del dashboard
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(true);

  // Cargar info del usuario al montar (simulado, pero necesario para el header)
  useEffect(() => {
    // Aquí puedes cargar la info real del usuario de localStorage si la guardas allí al iniciar sesión
    // Por ahora, simulamos un usuario
    const storedUser = localStorage.getItem("worldIdUserInfo"); // Usar la misma clave que en dashboard
    if (storedUser) {
      try {
        setUserInfo(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user info from localStorage", e);
        localStorage.removeItem("worldIdUserInfo");
      }
    } else {
      setUserInfo({ address: "0xSimulatedAddress", username: "ExchangeUser" }); // Simular un usuario si no está logueado
    }
    setIsLoadingUserInfo(false);
  }, []);

  // navItems para la barra de navegación inferior
  const navItems = [
    { path: '/dashboard', label: 'Inicio', icon: <HomeIcon className="w-6 h-6" /> },
    { path: '/survey-saving', label: 'Juega y Ahorra', icon: <SurveyIconNav className="w-6 h-6" /> },
    { path: '/exchange', label: 'Intercambios', icon: <ExchangeIconNav className="w-6 h-6" /> },
    { path: '/microloand/apply', label: 'Microcréditos', icon: <MicroloanIconNav className="w-6 h-6" /> },
    { path: '/settings', label: 'Ajustes', icon: <Cog6ToothIcon className="w-6 h-6" /> },
  ];

  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResultData | null>(null);

  const handleCancelSimulation = () => {
    setSimulationResult(null);
  };
  const wldAmount = parseFloat(amount || '0');
  // Estimación sutil en el cliente (opcional, para mostrar bajo el input)
  const estimatedUSDC_client_subtle = wldAmount * CLIENT_SIDE_MOCK_EXCHANGE_RATE;
  const feeAmount_client_subtle = estimatedUSDC_client_subtle * (CLIENT_SIDE_FEE_PERCENTAGE / 100);
  const finalUSDC_client_subtle = estimatedUSDC_client_subtle - feeAmount_client_subtle;

  const handleSimulateExchange = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!amount || wldAmount <= 0) {
      setError('Por favor, ingresa una cantidad válida de WLD.');
      setSimulationResult(null);
      return;
    }
    setError(null);
    setLoading(true);
    setSimulationResult(null); // Limpia resultados anteriores

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: wldAmount }),
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || `La simulación falló (HTTP ${response.status})`);
      }
      setSimulationResult(responseData.data);
    } catch (err: any) {
      console.error('Error al procesar la simulación de intercambio:', err);
      setError(err.message || 'Ocurrió un error inesperado.');
      setSimulationResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAndContribute = () => {
    if (simulationResult) {
      try {
        const currentContributions = parseInt(localStorage.getItem(POOL_CONTRIBUTIONS_LOCALSTORAGE_KEY) || '0', 10);
        const newTotalContributions = currentContributions + CONTRIBUTION_FROM_EXCHANGE;
        localStorage.setItem(POOL_CONTRIBUTIONS_LOCALSTORAGE_KEY, newTotalContributions.toString());

        // --- CAMBIO CLAVE AQUÍ: Guardar la aportación en el historial ---
        const currentUserContributionsHistory = JSON.parse(localStorage.getItem(USER_CONTRIBUTIONS_HISTORY_LOCALSTORAGE_KEY) || '[]');
        const newContribution: Contribution = {
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9), // ID único
          amount: simulationResult.receivedUSDC, // Usamos el USDC recibido como monto de la aportación
          date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }), // Formato "DD Mes"
        };
        // Añade la nueva aportación al principio de la lista para que se vea primero
        const updatedContributionsHistory = [newContribution, ...currentUserContributionsHistory];
        localStorage.setItem(USER_CONTRIBUTIONS_HISTORY_LOCALSTORAGE_KEY, JSON.stringify(updatedContributionsHistory));
        // --- FIN CAMBIO CLAVE ---

        router.push('/dashboard?contribution=true');
      } catch (e) {
        console.error("Error al actualizar localStorage en ExchangePage:", e);
        router.push('/dashboard?contribution=true&storageError=true');
      }
    } else {
      setError("No hay una simulación válida para confirmar.");
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permitir solo números y un punto decimal
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
    setError(null);
    setSimulationResult(null); // Limpia simulación si cambia el monto
  };
  if (isLoadingUserInfo) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-slate-100 p-4 animate-fadeIn">
        <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sky-700 mt-5 text-lg font-medium">Cargando...</p>
      </div>
    );
  }


  return (
    // CONTENEDOR PRINCIPAL: Fondo fijo
    <div className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden">

      {/* Div morado fijo en el fondo */}
      <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-purple-600 to-indigo-800 z-0"></div>

      {/* Contenedor principal con scroll */}
      <div className="relative z-10 flex flex-col min-h-screen w-full max-w-md mx-auto">

        {/* HEADER DE DASHBOARD (integrado aquí) */}
        {/* Fondo morado extendido, que contiene el balance y las tarjetas */}
        <div className="w-full bg-gradient-to-br from-indigo-800 to-purple-600 rounded-b-3xl shadow-lg relative z-0 h-20">

          {/* --- Contenedor de Partículas (necesita estilos CSS globales definidos en dashboard/page.tsx o globals.css) --- */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {Array.from({length: 15}).map((_,i) => (
              <div key={`particle-${i}`} className="pool-particle" style={{left: `${Math.random()*100}%`, animationDelay: `${Math.random()*5}s`, animationDuration: `${Math.random()*10 + 10}s`, width: `${Math.random()*3+1}px`, height: `${Math.random()*3+1}px`, opacity: Math.random() * 0.3 + 0.1 }}></div>
            ))}
          </div>
          {/* --- FIN Contenedor de Partículas --- */}

          <header className="w-full p-6 pt-4 flex justify-between items-center text-white relative z-10">
            {/* Contenedor del Saludo y Nombre de Usuario */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">
                {userInfo?.username || 'Usuario'}
              </h1>
              <p className="text-white/70 mt-1 text-sm">$550 disponible para usar</p>
            </div>
            {/* Precio y Icono de Moneda */}
            <div className="flex items-center space-x-2 bg-white/10 px-2 py-1 rounded-full border border-white/20 shadow-sm">
              <WalletIcon className="w-6 h-6 text-yellow-300" />
              <span className="text-lg font-extrabold text-white">21,902</span>
            </div>
          </header>
        </div>
        {/* FIN DEL HEADER DE DASHBOARD */}


        {/* Contenido blanco que debe TAPAR al morado */}
        <main className="flex-grow overflow-y-auto bg-gray-100 rounded-t-2xl shadow-inner px-6 pb-20 relative z-0 ">
          <Image
            src="/intercambiar.png"
            alt="Ilustración de intercambio"
            width={100}
            height={100}
            className="mx-auto mb-6 drop-shadow-lg mt-12 sm:mt-20"
          />
          {/* Se eliminan los <br /> y se manejan los márgenes con Tailwind CSS */}
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/70 mt-4"> {/* Ajustado mt-4 para espacio */}
            <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-slate-100/50 border-b border-slate-200/80">
              <div className="flex items-center justify-center gap-3 mb-1.5">
                {/* Icono de intercambio elegante */}
                <svg className="w-10 h-10 text-sky-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h18m-7.5-14L21 7.5m0 0L16.5 12M21 7.5H3" />
                </svg>
                <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500">
                  Intercambio WLD a USDC
                </h1>
              </div>
              <p className="text-slate-600 text-center text-sm sm:text-base">
                Obtén una cotización para convertir tus WLD a USDC de forma segura.
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <label htmlFor="wld-amount" className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                  Ingrese la Cantidad en WLD
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <WldCoinIcon className="text-slate-400" />  
                  </div>
                  <input
                    id="wld-amount" type="text" inputMode="decimal" placeholder="0.00" value={amount}
                    onChange={handleAmountChange}
                    className="w-full text-lg sm:text-xl p-3.5 pl-12 pr-4 border border-slate-300/80 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 rounded-xl shadow-sm outline-none transition-all duration-150 disabled:bg-slate-100 disabled:text-slate-500 placeholder-slate-400"
                    disabled={loading}
                    autoComplete="off"
                  />
                </div>
                {wldAmount > 0 && !simulationResult && !loading && finalUSDC_client_subtle > 0 && (
                  <p className="text-xs text-slate-500 mt-2 text-right px-1">
                    Recibirás aprox.: <span className="font-semibold text-slate-600">{finalUSDC_client_subtle.toFixed(3)} USDC</span>
                  </p>
                )}
              </div>

              {/* Resultado de la Simulación del Backend (se muestra después de la simulación) */}
              {simulationResult && !loading && (
                <div className="bg-green-50 p-5 rounded-xl space-y-3 border-2 border-green-500/30 shadow-lg animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-7 h-7 text-green-600" />
                    <h3 className="text-lg sm:text-xl font-semibold text-green-800">Cotización Confirmada:</h3>
                  </div>

                  <div className="space-y-2 text-sm sm:text-base">
                    <div className="flex justify-between items-center py-1.5 border-b border-green-200/70">
                      <span className="text-slate-600">Intercambias:</span>
                      <span className="font-semibold text-green-700 flex items-center gap-1.5">{simulationResult.exchangedWLD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <WldCoinIcon className="w-5 h-5 opacity-80" /></span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-green-200/70">
                      <span className="text-slate-600">Tasa Aplicada:</span>
                      <span className="font-medium text-slate-700">1 WLD ≈ {simulationResult.exchangeRateUsed.toFixed(4)} USDC</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-green-200/70">
                      <span className="text-slate-600">Comisión ({CLIENT_SIDE_FEE_PERCENTAGE}%):</span>
                      <span className="font-semibold text-red-600 flex items-center gap-1.5">{simulationResult.feePaid.toFixed(4)} <UsdcCoinIcon className="w-5 h-5 opacity-80" /></span>
                    </div>
                    <div className="flex justify-between items-center pt-2.5 text-base sm:text-lg">
                      <span className="font-bold text-green-800">Total a Recibir:</span>
                      <span className="font-extrabold text-green-700 text-xl flex items-center gap-1.5">{simulationResult.receivedUSDC.toFixed(4)} <UsdcCoinIcon className="w-5 h-5 opacity-90" /></span>
                    </div>
                  </div>
                </div>
              )}

              {/* Indicador de carga durante la simulación */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-8 space-y-3 w-full">
                  <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 overflow-hidden relative">
                    <div
                      className="absolute inset-y-0 left-0 bg-sky-500 rounded-full animate-progress-bar"
                      style={{
                        width: '50%',
                        animationDuration: '2s',
                        animationIterationCount: 'infinite',
                        animationTimingFunction: 'linear'
                      }}
                    ></div>
                  </div>
                  <p className="text-sky-600 font-medium">Obteniendo cotización...</p>
                </div>
              )}
            </div>

            <div className="bg-slate-100/70 p-5 sm:p-6 border-t border-slate-200/80 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              {!simulationResult ? (
                <Button size="lg" variant="primary" onClick={handleSimulateExchange} disabled={loading || !amount || wldAmount <= 0}>
                  <InfoIcon className="w-5 h-5 mr-1" />
                  {loading ? 'Obteniendo Cotización...' : 'Previsualizar Intercambio'}
                </Button>
              ) : (
                <>
                  <Button size="lg" variant="secondary" onClick={handleCancelSimulation} disabled={loading}>
                    Cancelar
                  </Button>
                  <Button size="lg" variant="primary" onClick={handleConfirmAndContribute} disabled={loading}>
                    <CheckCircleIcon className="w-5 h-5 mr-1" />
                    {loading ? 'Procesando...' : 'Confirmar Intercambio y Aportar'}
                  </Button>
                </>
              )}
            </div>
          </div>

          {error && !loading && (
            <div className="mt-6 max-w-md w-full bg-red-50 border-l-4 border-red-600 text-red-700 p-4 rounded-md shadow-lg animate-fadeIn" role="alert">
              <p className="font-bold text-red-800">Error en la Operación</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          <style jsx global>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeIn {
              animation: fadeIn 0.5s ease-out forwards;
            }
            @keyframes progress-bar {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            .animate-progress-bar {
              animation: progress-bar 2s linear infinite;
            }
          `}</style>
        </main>
          {/* Barra de navegación inferior (fixed) */}
        {userInfo && (
            <nav className="fixed bottom-0 left-0 right-0 w-full bg-white shadow-lg rounded-t-3xl p-4 max-w-md mx-auto z-50">
          <div className="flex justify-around items-center h-full">
            {navItems.map((item) => {
              const isActive = pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`flex flex-col items-center transition-colors ${
                    isActive ? 'text-indigo-600 font-semibold' : 'text-gray-400 hover:text-indigo-600'
                  }`}
                >
                  {item.icon}
                  <span className="text-xs mt-1">{item.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1 animate-bounce" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
        )}
      </div>
    </div>
  );
}