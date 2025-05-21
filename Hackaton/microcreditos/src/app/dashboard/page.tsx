  // src/app/dashboard/page.tsx
  'use client';

  import { useRouter, usePathname, useSearchParams } from 'next/navigation';
  import * as React from 'react';
  import { PlusIcon } from '@heroicons/react/24/outline'; // Asegúrate de que estos iconos estén instalados
  // Reemplaza la línea existente de importación de Button por esta:
  import { Button } from '@worldcoin/mini-apps-ui-kit-react'; // Asegúrate de que esta ruta sea correcta
  import { HomeIcon, WalletIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
  // Si usas MinusSmallIcon, ArrowUpRightIcon en otras partes, impórtalos
  // import { MinusSmallIcon, ArrowUpRightIcon } from '@heroicons/react/24/solid';

  import {
    MiniKit,
    WalletAuthInput,
    MiniAppWalletAuthSuccessPayload,
    MiniAppWalletAuthErrorPayload,
  } from '@worldcoin/minikit-js';
  import Image from 'next/image';

  // --- Interfaz de Usuario ---
  interface UserInfo {
    address: string;
    username: string | null;
  }
  interface Contribution {
    id: string; // Un ID único para cada aportación (ej. timestamp + random)
    amount: number; // El monto de la aportación
    date: string; // La fecha en que se realizó la aportación
  }

  // --- Placeholder de Avatar de Usuario Mejorado ---
  const UserAvatarPlaceholder = ({ className, initial }: { className?: string, initial?: string }) => (
    <div className={`bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center overflow-hidden ${className || "w-24 h-24"} shadow-md`}>
      {initial ? (
        <span className="text-3xl md:text-4xl font-semibold text-white">{initial}</span>
      ) : (
        <svg className="w-3/4 h-3/4 text-sky-100/80" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
        </svg>
      )}
    </div>
  );

  // --- Constantes ---
  const TARGET_CONTRIBUTIONS_FOR_FULL_VISUAL = 50;
  const CONTRIBUTION_ANIMATION_DURATION = 1800;
  const USER_INFO_LOCALSTORAGE_KEY = "worldIdUserInfo";
  const POOL_CONTRIBUTIONS_LOCALSTORAGE_KEY = "poolContributionsCountV2";
  const USER_CONTRIBUTIONS_HISTORY_LOCALSTORAGE_KEY = "userContributionsHistory"; // Para la lista de aportaciones

  
  // --- Iconos de Categorías (se mueven al Dashboard porque son usados aquí) ---
  const ExchangeIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h18m-7.5-14L21 7.5m0 0L16.5 12M21 7.5H3" />
    </svg>
  );
  const MicroloanIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0H21m-9 12.75h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V10.5zm0 2.25h.008v.008h-.008v-.008zM4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
  );
  const SurveyIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25c.621 0 1.125.504 1.125 1.125v3.375c0 .621-.504 1.125-1.125 1.125h-1.5c-.621 0-1.125-.504-1.125-1.125v-3.375c0-.621.504-1.125 1.125-1.125h1.5zM17.25 10.5h.008v.008h-.008V10.5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.875 2.25c.621 0 1.125.504 1.125 1.125v3.375c0 .621-.504 1.125-1.125 1.125h-1.5c-.621 0-1.125-.504-1.125-1.125V3.375c0-.621.504-1.125 1.125-1.125h1.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008ZM10.5 15h.008v.008H10.5V15Zm0 2.25h.008v.008H10.5v-.008Zm0 2.25h.008v.008H10.5v-.008Z" />
    </svg>
  );
  const WorldIdIcon = ({className = "w-6 h-6"} : {className?: string}) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="3" fill="currentColor"/>
    </svg>
  );

  // --- Datos de Acciones para el Carrusel ---
  const actions = [
    {
      id: 'ahorro',
      title: 'Juega y Ahorra',
      description: 'Participa en encuestas y juegos para aumentar tu saldo.',
      icon: <SurveyIcon className="w-8 h-8" />, // Usar w-8 h-8 para los iconos en el carrusel
      path: '/survey-saving',
      textColor: 'text-indigo-900',
      gradientFrom: 'from-indigo-200',
      gradientTo: 'to-indigo-400',
      hoverGradientFrom: 'hover:from-indigo-300',
      hoverGradientTo: 'hover:to-indigo-500',
      ringColor: 'ring-indigo-400'
    },
    {
      id: 'intercambios',
      title: 'Intercambios',
      description: 'Intercambia puntos o saldo con otros usuarios.',
      icon: <ExchangeIcon className="w-8 h-8" />,
      path: '/exchange',
      textColor: 'text-emerald-900',
      gradientFrom: 'from-emerald-200',
      gradientTo: 'to-emerald-400',
      hoverGradientFrom: 'hover:from-emerald-300',
      hoverGradientTo: 'hover:to-emerald-500',
      ringColor: 'ring-emerald-400'
    },
    {
      id: 'microcreditos',
      title: 'Microcréditos',
      description: 'Solicita un microcrédito rápido y seguro.',
      icon: <MicroloanIcon className="w-8 h-8" />,
      path: '/microloand/apply', // Ruta corregida
      textColor: 'text-yellow-900',
      gradientFrom: 'from-yellow-200',
      gradientTo: 'to-yellow-400',
      hoverGradientFrom: 'hover:from-yellow-300',
      hoverGradientTo: 'hover:to-yellow-500',
      ringColor: 'ring-yellow-400'
    }
  ];


  const CategoryCardIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="teal" strokeWidth={1.5}>
      <rect x="3" y="7" width="18" height="10" rx="2" fill="#5eead4" />
      <rect x="7" y="15" width="4" height="2" fill="#fff" />
    </svg>
  );
 
  const TransactionSpotifyIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#1db954" />
      <path d="M8 15c2-1 6-1 8 0" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 12c2.5-1.5 7.5-1.5 10 0" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  // Datos de ejemplo para transacciones
  const transactions = [
    { id: 't1', name: 'Spotify Premium', date: '24 May', amount: -200.00, icon: <TransactionSpotifyIcon className="w-6 h-6" /> },
    { id: 't2', name: 'Netflix', date: '20 May', amount: -150.00, icon: <CategoryCardIcon className="w-6 h-6 text-red-600" /> },
    { id: 't3', name: 'Aportación Recibida', date: '18 May', amount: 1.00, icon: <PlusIcon className="w-6 h-6 text-green-600" /> },
    // Añade más transacciones si lo necesitas
  ];


  export default function DashboardPage() {
    const router = useRouter();
    const pathname = usePathname();
    const [contributionsList, setContributionsList] = React.useState<Contribution[]>([]);

    // Los navItems se han movido aquí para estar cerca de su uso y ser consistentes con el resto del archivo
    const navItems = [
      { path: '/dashboard', label: 'Inicio', icon: <HomeIcon className="w-6 h-6" /> },
      { path: '/survey-saving', label: 'Juega y Ahorra', icon: <SurveyIcon className="w-6 h-6" /> },
      { path: '/exchange', label: 'Intercambios', icon: <ExchangeIcon className="w-6 h-6" /> },
      { path: '/microloand/apply', label: 'Microcréditos', icon: <MicroloanIcon className="w-6 h-6" /> },
      { path: '/settings', label: 'Ajustes', icon: <Cog6ToothIcon className="w-6 h-6" /> },
    ];
    const searchParams = useSearchParams();

    const [userInfo, setUserInfo] = React.useState<UserInfo | null>(null);
    const [isLoadingUserInfo, setIsLoadingUserInfo] = React.useState(true);
    const [isAuthLoading, setIsAuthLoading] = React.useState(false);
    const [authError, setAuthError] = React.useState<string | null>(null);

    const [animateNewContribution, setAnimateNewContribution] = React.useState(false);
    const [animationTriggerKey, setAnimationTriggerKey] = React.useState(0);
    const [poolContributionsCount, setPoolContributionsCount] = React.useState(0);
   
  

    // useEffect para cargar userInfo y contributionsList al inicio y escuchar cambios
    React.useEffect(() => {
      const loadData = () => {
        const savedContributionsCount = parseInt(localStorage.getItem(POOL_CONTRIBUTIONS_LOCALSTORAGE_KEY) || '0', 10);
        setPoolContributionsCount(savedContributionsCount);

        const savedContributionsList = localStorage.getItem(USER_CONTRIBUTIONS_HISTORY_LOCALSTORAGE_KEY);
        if (savedContributionsList) {
          try {
            setContributionsList(JSON.parse(savedContributionsList));
          } catch (e) {
            console.error("Error parsing contributions history from localStorage", e);
            localStorage.removeItem(USER_CONTRIBUTIONS_HISTORY_LOCALSTORAGE_KEY);
          }
        }

        const storedUser = localStorage.getItem(USER_INFO_LOCALSTORAGE_KEY);
        if (storedUser) {
          try { setUserInfo(JSON.parse(storedUser)); }
          catch (e) { console.error("Error parsing user info", e); localStorage.removeItem(USER_INFO_LOCALSTORAGE_KEY); }
        }
        setIsLoadingUserInfo(false);
      };

      loadData();

      // Opcional: Escuchar eventos de storage para actualizar si otra pestaña/app cambia el localStorage
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === POOL_CONTRIBUTIONS_LOCALSTORAGE_KEY || event.key === USER_CONTRIBUTIONS_HISTORY_LOCALSTORAGE_KEY) {
          loadData();
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }, []); // El array de dependencias vacío asegura que esto se ejecute solo una vez al montar

    React.useEffect(() => {
      if (searchParams.get('contribution') === 'true') {
        setAnimateNewContribution(true);
        setAnimationTriggerKey(prevKey => prevKey + 1);
        const updatedContributions = parseInt(localStorage.getItem(POOL_CONTRIBUTIONS_LOCALSTORAGE_KEY) || '0', 10);
        setPoolContributionsCount(updatedContributions);
  
       

        const currentPath = window.location.pathname;
        router.replace(currentPath); // Usar router.replace para limpiar el searchParam sin recargar
        

       
      }
    }, [searchParams, router]);

    
    const handleSignInWithWorldID = async () => {
      setIsAuthLoading(true); setAuthError(null);
      if (typeof window !== 'undefined' && !MiniKit.isInstalled()) {
        setAuthError('World App no está instalado o MiniKit no está disponible.');
        setIsAuthLoading(false); alert('Por favor, asegúrate de tener World App instalado.'); return;
      }
      try {
        const nonceRes = await fetch('/api/nonce');
        if (!nonceRes.ok) { const errD = await nonceRes.json().catch(()=>({message: 'Error al obtener nonce.'})); throw new Error(errD.message);}
        const { nonce } = await nonceRes.json(); if (!nonce) throw new Error('Nonce inválido.');
        const authRequest: WalletAuthInput = { nonce, statement: 'Inicia sesión en la plataforma con tu World ID.' };
        const { finalPayload } = await MiniKit.commandsAsync.walletAuth(authRequest);
        if (finalPayload.status === 'error') { const eP = finalPayload as MiniAppWalletAuthErrorPayload; throw new Error((eP as any)?.detail || (eP as any)?.message || 'Error de Autenticación.');}
        const sP = finalPayload as MiniAppWalletAuthSuccessPayload;
        if (!sP.address) throw new Error("No se pudo obtener la dirección.");
        const verifyRes = await fetch('/api/complete-siwe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ payload: sP, nonce, username: MiniKit.user?.username || null })});
        const vBR = await verifyRes.json(); if (!verifyRes.ok || !vBR.isValid) { throw new Error(vBR.message || 'Verificación SIWE falló.');}
        const authUserInfo: UserInfo = { address: sP.address, username: MiniKit.user?.username || null };
        setUserInfo(authUserInfo); localStorage.setItem(USER_INFO_LOCALSTORAGE_KEY, JSON.stringify(authUserInfo)); setAuthError(null);
      } catch (err: any) { console.error('Error en SignIn:', err); setAuthError(err.message || 'Error desconocido.'); setUserInfo(null); localStorage.removeItem(USER_INFO_LOCALSTORAGE_KEY);
      } finally { setIsAuthLoading(false); }
    };



    if (isLoadingUserInfo) {
      return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-slate-100 p-4 animate-fadeIn">
          <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sky-700 mt-5 text-lg font-medium">Cargando tu espacio...</p>
        </div>
      );
    }

    // --- Datos de ejemplo (sustituye con tus estados y datos reales) ---
    // Ahora totalBalance reflejará poolContributionsCount
    const totalBalance = poolContributionsCount;
   

    return (
      // CONTENEDOR PRINCIPAL: Flexbox para el layout global, min-h-screen para ocupar toda la altura
      <div className="flex flex-col  relative ">

        {animateNewContribution && userInfo && (
          <div key={animationTriggerKey} className="flying-energy-spark">✨</div>
        )}

        {userInfo ? (
          // --- Dashboard Content (cuando el usuario está logueado y simplificado) ---
          <div className="relative max-w-md mx-auto w-full flex-grow flex flex-col">
          <div className="sticky top-0 z-0">
            {/* Fondo morado extendido, que contiene el balance y las tarjetas */}
            <div className="w-full bg-gradient-to-br from-indigo-800 to-purple-600 rounded-b-3xl shadow-lg relative z-0 h-55">

              {/* --- Contenedor de Partículas --- */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {Array.from({length: 15}).map((_,i) => (
                  <div key={`particle-${i}`} className="pool-particle" style={{left: `${Math.random()*100}%`, animationDelay: `${Math.random()*5}s`, animationDuration: `${Math.random()*10 + 10}s`, width: `${Math.random()*3+1}px`, height: `${Math.random()*3+1}px`, opacity: Math.random() * 0.3 + 0.1 }}></div>
                ))}
              </div>
              {/* --- FIN Contenedor de Partículas --- */}

              <header className="w-full p-6 pt-4 flex justify-between items-center text-white relative z-10">
                {/* Contenedor del Saludo y Nombre de Usuario */}
                <div className="flex flex-col">
                  <span className="text-white text-lg">Bienvenido de nuevo,</span>
                  <h1 className="text-2xl font-bold">
                    {userInfo.username || 'Usuario'}
                  </h1>
                  <p className="text-white/70 mt-1 text-sm">$550 disponible para usar</p>
                </div>
                {/* Precio y Icono de Moneda */}
                <div className="flex items-center space-x-2 bg-white/10 px-2 py-1 rounded-full border border-white/20 shadow-sm">
                  <WalletIcon className="w-6 h-6 text-yellow-300" />
                  <span className="text-lg font-extrabold text-white">21,902</span>
                </div>
              </header>

              {/* Contenido del Balance Total (de la imagen del dashboard) */}
              <div className="text-center text-white mt-2 mb-10 relative z-10">
                <p className="text-lg opacity-80">Mis Aportaciones</p>
                {/* Aquí se muestra el poolContributionsCount */}
                <p className="text-5xl font-bold mt-2">{totalBalance.toLocaleString()}</p>
              </div>
            </div>
          </div>
            {/* Área de Contenido Principal (el "main" blanco que subirá) */}
            <main className="flex-grow overflow-y-auto bg-gray-100 rounded-t-2xl shadow-inner px-6 pb-20 relative z-0 ">

              {/* --- SECCIÓN DE CATEGORÍAS (de la imagen del dashboard) --- */}
              <section className="w-full max-w-md mx-auto mt-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Categorías</h2>
                  <Button size="sm" variant="secondary" className="text-blue-600 text-sm font-medium">Ver Todo</Button> {/* Usando Button */}
                </div>
                <div className="flex bg-white rounded-xl shadow-sm p-4"> {/* Eliminado justify-around para que el scroll funcione mejor */}
                  <div className="flex overflow-x-auto py-2 pb-6 space-x-4 sm:space-x-5 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-sky-400/60 scrollbar-track-sky-100 scrollbar-thumb-rounded-full" style={{ WebkitOverflowScrolling: 'touch' }}>
                    <div className="snap-start shrink-0 md:w-0"></div>
                {actions.map((action) => (
               <div key={action.id} onClick={() => router.push(action.path)} onKeyPress={(e) => {if (e.key === 'Enter' || e.key === ' ') router.push(action.path);}} tabIndex={0} role="button"
                  className={`group ${action.textColor} bg-gradient-to-br ${action.gradientFrom} ${action.gradientTo} ${action.hoverGradientFrom} ${action.hoverGradientTo} snap-center shrink-0 w-[70vw] xs:w-[65vw] sm:w-[250px] md:w-[230px] h-60 sm:h-64 md:h-[270px]
                 rounded-2xl shadow-xl hover:shadow-2xl p-5 sm:p-6 flex flex-col items-center justify-between text-center transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 focus:outline-none focus:ring-4 ${action.ringColor} focus:ring-opacity-70 cursor-pointer`}>
                   <div className="flex flex-col items-center">
                 <div className="mb-3 sm:mb-4 p-3 sm:p-3.5 rounded-full bg-white/15 shadow">{action.icon}</div>
                <h4 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-1.5">{action.title}</h4>
               <p className="text-xs sm:text-sm opacity-90 leading-snug px-1">{action.description}</p>
               </div>
               <div className="mt-3 sm:mt-4 p-1.5 bg-white/20 rounded-full self-center transition-transform duration-200 group-hover:scale-110 group-hover:bg-white/30">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 opacity-90"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
             </div>
           </div>
      ))}
                    <div className="snap-end shrink-0 w-1 h-1 md:w-0"></div>
                  </div>
                </div>
              </section>

              {/* --- SECCIÓN DE TRANSACCIONES --- */}
              <section className="w-full max-w-md mx-auto mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Transacciones</h2>
                  <Button size="sm" variant="secondary" className="text-blue-600 text-sm font-medium">Ver Todo</Button> {/* Usando Button */}
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                  {transactions.map(tx => (
                    <div key={tx.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${tx.amount < 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {tx.icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{tx.name}</p>
                          <p className="text-gray-500 text-xs">{tx.date}</p>
                        </div>
                      </div>
                      <p className={`font-semibold ${tx.amount < 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.amount < 0 ? '' : '+'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  ))}
                </div>

              </section>

              {/* --- SECCIÓN DE APORTACIONES RECIENTES --- */}
              <div className="w-full max-w-md mx-auto mt-8 px-0">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-left">Aportaciones Recientes</h3>
                <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200/70">
                  <div className="grid grid-cols-2 bg-gray-800 text-gray-300 font-medium px-4 py-3 rounded-t-xl">
                    <span>Descripción</span>
                    <span className="text-right">Cantidad</span>
                  </div>
                  <ul>
                    {contributionsList.length > 0 ? (
                      contributionsList.map((contribution, index) => (
                        <li key={contribution.id} className="flex justify-between items-center py-2 border-b border-gray-200/80 last:border-b-0">
                          {/* Se muestra el ID de aportación y la fecha si está disponible */}
                          <span className="text-gray-700">Aportación {contributionsList.length - index}{contribution.date ? ` (${contribution.date})` : ''}:</span>
                          <span className="font-semibold text-blue-600">{contribution.amount.toFixed(2)} USDC</span>
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm py-2 px-4">No hay aportaciones recientes.</p>
                    )}
                  </ul>
                </div>
              </div>

            
            </main>
          </div>
        ) : (
          // --- Login Screen Content (cuando no está logueado) ---
          // Se mantiene la estructura anterior para la pantalla de login
          <div className="min-h-screen flex flex-col justify-start items-center bg-white px-4 pt-8 pb-12 w-full max-w-md mx-auto">
            <Image
              src="/Fondo.png"
              alt="Logo de CapitalWup"
              width={250}
              height={200}
              className="mx-auto mb-6 drop-shadow-lg mt-12 sm:mt-20"
            />
            <h2 className={`text-4xl sm:text-5xl font-bold mb-4 text-center text-gray-700`}>Iniciar Sesión</h2>
            <h2 className="text-base sm:text-lg font-semibold mb-8 text-center text-gray-700 max-w-md">
              ¿Y si aprender y participar pudiera mejorar tu salud financiera?
            </h2>
            {authError && (
              <div className="mb-6 p-3.5 bg-red-100 border border-red-300 text-red-700 rounded-xl text-sm text-left shadow-sm w-full max-w-md">
                <p className="font-semibold">Error de Autenticación:</p>
                <p>{authError}</p>
              </div>
            )}
            <Button
              onClick={handleSignInWithWorldID}
              size="lg" // Ajustado a "lg" o "sm"
              variant="primary"
              disabled={isAuthLoading}
              className="w-full max-w-md"
            >
              <div className="flex items-center justify-center">
                <WorldIdIcon className="w-7 h-7 mr-3" />
                <span>{isAuthLoading ? 'Conectando con World ID...' : 'Inicia Sesión con World ID'}</span>
              </div>
            </Button>
            <div className="z-10 bg-white p-8 rounded-lg shadow-xl w-full max-w-md mt-6 text-center">
              <p className="mt-2 text-gray-600 text-sm">
                Al Iniciar Sesión, aceptas nuestros Términos y Política de Privacidad.
              </p>
            </div>
            <footer className="mt-16 md:mt-20 text-center text-sm text-gray-500/90 relative z-20">
              <p>&copy; {new Date().getFullYear()} CapitaWu. Todos los derechos reservados.</p>
              <p className="text-xs text-gray-400/80 mt-1">Innovación financiera para todos.</p>
            </footer>
            
  <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 400" className="w-full h-auto">
     <path
  fill="#4c1d95"
  fillOpacity="1"
  d="M0,80 
     C160,100 720,460 1080,160 
     C1260,60 1440,80 1440,10 
     L1440,400 L0,400Z"
/>
    <path
      fill="#7c3aed"
      fillOpacity="1"
      d="M0,240 C180,180 360,300 540,240 C720,180 900,60 1080,140 C1260,220 1350,180 1440,160 L1440,400 L0,400Z"
    />
     <path
      fill="#8b5cf6"
      fillOpacity="1"
      d="M0,320 C120,280 240,340 360,300 C480,260 600,160 720,200 C840,240 960,340 1080,300 C1200,260 1320,320 1440,280 L1440,400 L0,400Z"
    />
  </svg>
</div>
          </div>
        )}

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
    );
  }