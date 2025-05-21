// src/app/settings/page.tsx
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@worldcoin/mini-apps-ui-kit-react'; // Importación directa del componente Button
import { HomeIcon, Cog6ToothIcon,  } from '@heroicons/react/24/outline'; // Asegúrate de importar WalletIcon


// --- Interfaz de Usuario (igual que en dashboard/page.tsx) ---
interface UserInfo {
  address: string;
  username: string | null;
}

// --- Placeholder de Avatar de Usuario Mejorado (igual que en dashboard/page.tsx) ---
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

// --- Constantes (igual que en dashboard/page.tsx) ---
const USER_INFO_LOCALSTORAGE_KEY = "worldIdUserInfo"; // Asegúrate de que esta constante sea la misma
const POOL_CONTRIBUTIONS_LOCALSTORAGE_KEY = "poolContributionsCountV2"; // Necesaria para el balance en el header

// --- Iconos de Categorías (necesarios para navItems) ---
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


export default function SettingsPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(true);
  
  // Definición de los ítems de la barra de navegación (igual que en dashboard/page.tsx)
  const navItems = [
    { path: '/dashboard', label: 'Inicio', icon: <HomeIcon className="w-6 h-6" /> },
    { path: '/survey-saving', label: 'Juega y Ahorra', icon: <SurveyIcon className="w-6 h-6" /> },
    { path: '/exchange', label: 'Intercambios', icon: <ExchangeIcon className="w-6 h-6" /> },
    { path: '/microloand/apply', label: 'Microcréditos', icon: <MicroloanIcon className="w-6 h-6" /> },
    { path: '/settings', label: 'Ajustes', icon: <Cog6ToothIcon className="w-6 h-6" /> },
  ];

  // Efecto para cargar la información del usuario y las aportaciones al montar el componente
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_INFO_LOCALSTORAGE_KEY);
    if (storedUser) {
      try {
        setUserInfo(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user info from localStorage", e);
        localStorage.removeItem(USER_INFO_LOCALSTORAGE_KEY);
      }
    } else {
      setUserInfo({ address: "0xSimulatedAddress", username: "SettingsUser" }); // Simular un usuario si no está logueado
    }


    setIsLoadingUserInfo(false);
  }, []);

  // Función para cerrar sesión
  const handleSignOut = () => {
    localStorage.removeItem(USER_INFO_LOCALSTORAGE_KEY);
    localStorage.removeItem(POOL_CONTRIBUTIONS_LOCALSTORAGE_KEY); // Limpiar también las aportaciones al cerrar sesión
    setUserInfo(null);
 
    router.push('/'); // Redirigir a la página de inicio o login
  };

  

  if (isLoadingUserInfo) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-slate-100 p-4 animate-fadeIn">
        <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sky-700 mt-5 text-lg font-medium">Cargando ajustes...</p>
      </div>
    );
  }

  // --- Vista de Ajustes ---
  return (
    // CONTENEDOR PRINCIPAL: Fondo fijo
    <div className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden">
      {/* Div morado fijo en el fondo */}
      <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-purple-600 to-indigo-800 z-0"></div>

      {/* Contenedor principal con scroll */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col min-h-screen">

        {/* HEADER DE DASHBOARD (integrado aquí) */}
        <div className="w-full bg-gradient-to-br from-indigo-800 to-purple-600 rounded-b-3xl shadow-lg relative z-0 h-30">
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
              <span className="text-white text-lg">Bienvenido de nuevo,</span>
              <h1 className="text-2xl font-bold">
                {userInfo?.username || 'Usuario'}
              </h1>
              <p className="text-white/70 mt-1 text-sm">$550 disponible para usar</p>
            </div>
     
          </header>

    
        </div>
        {/* FIN DEL HEADER DE DASHBOARD */}

        <main className="flex-grow overflow-y-auto bg-gray-200 rounded-t-2xl shadow-inner px-6 pb-20 relative z-10">
          <br/>
          <br/>
          {userInfo ? (
            <div className="flex flex-col relative max-w-md mx-auto w-full p-6 sm:p-8 bg-white rounded-3xl shadow-2xl space-y-6 text-center">

              {/* Avatar del Usuario */}
              <UserAvatarPlaceholder
                className="w-24 h-24 mx-auto border-4 border-white shadow-lg"
                initial={(userInfo.username || (userInfo.address ? userInfo.address[2] : '') || 'U').toUpperCase()}
              />
              {/* Nombre de Usuario o Dirección (cortada) */}
              <h2 className="text-2xl font-semibold text-gray-700">
                {userInfo.username || `Usuario: ${userInfo.address.substring(0, 6)}...${userInfo.address.substring(userInfo.address.length - 4)}`}
              </h2>
              {/* Botón de cerrar sesión */}
              <Button
                size="lg"
                variant="primary" // Usar "destructive" para cerrar sesión
                onClick={handleSignOut}
                className="w-full flex justify-center mt-6"
              >
                Cerrar Sesión
              </Button>
            </div>
          ) : (
            // Si no hay userInfo, puedes redirigir o mostrar un mensaje de "iniciar sesión"
            <div className="text-center p-8 bg-white rounded-xl shadow-lg">
              <p className="text-lg text-slate-700 mb-4">Necesitas iniciar sesión para ver los ajustes.</p>
              <Button size="lg" variant="primary" onClick={() => router.push('/')}>Ir a Iniciar Sesión</Button>
            </div>
          )}
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