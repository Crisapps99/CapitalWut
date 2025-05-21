// src/app/survey-savings/page.tsx
'use client';

import * as React from 'react';
import { useState, useEffect, useCallback, FormEvent } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { HomeIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'; // Asegúrate de importar WalletIcon
import { Button } from '@worldcoin/mini-apps-ui-kit-react'; // Importación directa del componente Button
import Image from 'next/image';


// --- Interfaz de Usuario (Necesario para el header) ---
interface UserInfo {
  address: string;
  username: string | null;
}

// --- Placeholder de Avatar de Usuario Mejorado (Necesario si userInfo se simula o viene de algún lado) ---
// Aunque no se use directamente en el header, si userInfo se carga, esta interfaz es necesaria.


// --- Iconos SVG (manteniendo tus definiciones) ---
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

// --- Iconos SVG (Ajustados para mayor impacto visual) ---
const NativeCheckCircleIcon = ({ className = "w-24 h-24" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const NativeXCircleIcon = ({ className = "w-24 h-24" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const NativeClockIcon = ({ className = "w-24 h-24" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WalletIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6.75A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18.75V12m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m12 3V9" />
  </svg>
);

// --- Tipos de datos ---
type SurveyStep = 'deposit' | 'survey' | 'results';
interface SurveyOption { id: string; text: string; }
interface SurveyQuestion { id: number; text: string; options: SurveyOption[]; correctOptionId: string; timeLimitSeconds: number; points: number; }
interface Contribution { // Define la interfaz Contribution aquí para que sea reconocida
  id: string;
  amount: number;
  date: string;
}

// --- Datos de las preguntas (manteniendo tus tiempos de 10s) ---
const ALL_SURVEY_QUESTIONS: SurveyQuestion[] = [
  { id: 1, text: "¿Qué es la 'inflación' en economía?", options: [{ id: 'a', text: 'Aumento del valor del dinero' }, { id: 'b', text: 'Disminución general de precios' }, { id: 'c', text: 'Aumento sostenido de precios' }, { id: 'd', text: 'Estabilidad total de precios' }], correctOptionId: 'c', timeLimitSeconds: 10, points: 100 },
  { id: 2, text: "¿Una característica clave de un 'activo líquido' es?", options: [{ id: 'a', text: 'Difícil de vender' }, { id: 'b', text: 'fácil convercion en efectivo sin perder valor' }, { id: 'c', text: 'Solo propiedades' }, { id: 'd', text: 'Siempre da altos retornos' }], correctOptionId: 'b', timeLimitSeconds: 10, points: 120 },
  { id: 3, text: "El 'riesgo de mercado' en inversiones se refiere a:", options: [{ id: 'a', text: 'Riesgo de quiebra empresarial' }, { id: 'b', text: 'Riesgo por no invertir' }, { id: 'c', text: 'Riesgo de pérdidas en el mercado' }, { id: 'd', text: 'Garantía de no perder' }], correctOptionId: 'c', timeLimitSeconds: 10, points: 110 },
];

const QUESTIONS_PER_SURVEY = 3;
const MAX_INTEREST_RATE_PERCENT = 2.5;
const CONTRIBUTION_TO_MAIN_POOL_ON_SUCCESS = 1;
const USER_CONTRIBUTIONS_LOCALSTORAGE_KEY = "poolContributionsCountV2";
const USER_CONTRIBUTIONS_HISTORY_LOCALSTORAGE_KEY = "userContributionsHistory"; // Nueva constante para el historial
const PREDEFINED_PARTICIPATION_AMOUNTS = [10, 25, 50, 100];

// --- NUEVAS CONSTANTES PARA CONTROLAR EL TIEMPO ---
const FEEDBACK_DISPLAY_DURATION = 1500;
const ADVANCE_TO_NEXT_QUESTION_DELAY = 500;

export default function SurveySavingsPage() {
  const router = useRouter();
  const pathname = usePathname();

  // Estado para simular la información del usuario del dashboard
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  
  // navItems para la barra de navegación inferior
  const navItems = [
    { path: '/dashboard', label: 'Inicio', icon: <HomeIcon className="w-6 h-6" /> },
    { path: '/survey-saving', label: 'Juega y Ahorra', icon: <SurveyIcon className="w-6 h-6" /> },
    { path: '/exchange', label: 'Intercambios', icon: <ExchangeIcon className="w-6 h-6" /> },
    { path: '/microloand/apply', label: 'Microcréditos', icon: <MicroloanIcon className="w-6 h-6" /> },
    { path: '/settings', label: 'Ajustes', icon: <Cog6ToothIcon className="w-6 h-6" /> },
  ];

  const [currentStep, setCurrentStep] = useState<SurveyStep>('deposit');
  const [participationAmount, setParticipationAmount] = useState<number>(PREDEFINED_PARTICIPATION_AMOUNTS[1]);

  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | 'pending' | 'timeout'>('pending');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [totalPossiblePoints, setTotalPossiblePoints] = useState<number>(0);
  const [showInSituFeedback, setShowInSituFeedback] = useState<boolean>(false);

  const [earnedInterestAmount, setEarnedInterestAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Efecto para cargar la información del usuario y las aportaciones al montar el componente
  useEffect(() => {
    const storedUser = localStorage.getItem("worldIdUserInfo");
    if (storedUser) {
      try {
        setUserInfo(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user info from localStorage", e);
        localStorage.removeItem("worldIdUserInfo");
      }
    } else {
      setUserInfo({ address: "0xSimulatedAddress", username: "SurveyUser" }); // Simular un usuario
    }
  }, []);


  const initializeSurvey = useCallback(() => {
    const shuffled = [...ALL_SURVEY_QUESTIONS].sort(() => 0.5 - Math.random());
    const currentSurveySet = shuffled.slice(0, QUESTIONS_PER_SURVEY);
    setQuestions(currentSurveySet);
    setTotalPossiblePoints(currentSurveySet.reduce((sum, q) => sum + q.points, 0));
    setCurrentQuestionIndex(0);
    setScore(0);
    setEarnedInterestAmount(0);
    setSelectedAnswerId(null);
    setAnswerStatus('pending');
    setShowInSituFeedback(false);
  }, []);

  useEffect(() => {
    initializeSurvey();
  }, [initializeSurvey]);

  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleAnswer = useCallback((optionId: string | null, timeout: boolean = false) => {
    if (!questions[currentQuestionIndex]) return;

    clearTimer();

    const currentQuestion = questions[currentQuestionIndex];
    let pointsThisRound = 0;

    if (!timeout && optionId && optionId === currentQuestion.correctOptionId) {
      pointsThisRound = currentQuestion.points;
      setAnswerStatus('correct');
    } else if (timeout) {
      setAnswerStatus('timeout');
    } else {
      setAnswerStatus('incorrect');
    }

    const updatedScore = score + pointsThisRound;
    setScore(updatedScore);
    setSelectedAnswerId(optionId);
    setShowInSituFeedback(true);

    setTimeout(() => {
      setShowInSituFeedback(false);
      setSelectedAnswerId(null);

      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
          const performanceRatio = totalPossiblePoints > 0 ? updatedScore / totalPossiblePoints : 0;
          const calculatedInterest = participationAmount * performanceRatio * (MAX_INTEREST_RATE_PERCENT / 100);
          setEarnedInterestAmount(parseFloat(calculatedInterest.toFixed(2)));

          // --- LÓGICA DE AUMENTO DE APORTACIONES Y REGISTRO EN LOCALSTORAGE ---
          if (performanceRatio >= 0.5) {
            const currentContributionsCount = parseInt(localStorage.getItem(USER_CONTRIBUTIONS_LOCALSTORAGE_KEY) || '0', 10);
            localStorage.setItem(USER_CONTRIBUTIONS_LOCALSTORAGE_KEY, (currentContributionsCount + CONTRIBUTION_TO_MAIN_POOL_ON_SUCCESS).toString());

            const currentContributionsHistoryString = localStorage.getItem(USER_CONTRIBUTIONS_HISTORY_LOCALSTORAGE_KEY);
            let currentContributionsHistory: Contribution[] = [];
            if (currentContributionsHistoryString) {
              try {
                currentContributionsHistory = JSON.parse(currentContributionsHistoryString);
              } catch (e) {
                console.error("Error al parsear historial de aportaciones, iniciando uno nuevo.", e);
              }
            }

            const newContribution: Contribution = {
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              amount: CONTRIBUTION_TO_MAIN_POOL_ON_SUCCESS,
              date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
            };
            currentContributionsHistory.unshift(newContribution);
            localStorage.setItem(USER_CONTRIBUTIONS_HISTORY_LOCALSTORAGE_KEY, JSON.stringify(currentContributionsHistory.slice(0, 10)));
          }
          setCurrentStep('results');
        }
      }, ADVANCE_TO_NEXT_QUESTION_DELAY);
    }, FEEDBACK_DISPLAY_DURATION);
  }, [currentQuestionIndex, questions, score, participationAmount, totalPossiblePoints]);

  useEffect(() => {
    if (currentStep === 'survey' && currentQuestionIndex < questions.length && questions.length > 0) {
      setTimeLeft(questions[currentQuestionIndex].timeLimitSeconds);
      setAnswerStatus('pending');
      setShowInSituFeedback(false);

      clearTimer();
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearTimer();
            handleAnswer(null, true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearTimer();
    }
  }, [currentStep, currentQuestionIndex, questions, handleAnswer]);

  const handleParticipationSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (participationAmount <= 0) { alert("Por favor, selecciona un monto de participación válido."); return; }
    if (participationAmount > 5000) { alert("Participa con menos de 5,000 USDC."); return; }
    setCurrentStep('survey');
  };

  const restartSurveyFlow = () => {
    setIsLoading(true);
    initializeSurvey();
    setParticipationAmount(PREDEFINED_PARTICIPATION_AMOUNTS[1]);
    setCurrentStep('deposit');
    setTimeout(() => setIsLoading(false), 300);
  };

  const currentQuestion = questions[currentQuestionIndex];

  const kahootButtonBaseLayout = "p-5 md:p-6 rounded-xl text-xl md:text-2xl font-bold shadow-xl hover:opacity-95 transform hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center";
  const kahootButtonStyles = [
    `bg-red-600 hover:bg-red-700 text-white focus:ring-red-500/70`,
    `bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500/70`,
    `bg-yellow-500 hover:bg-yellow-600 text-slate-900 focus:ring-yellow-500/70`,
    `bg-green-600 hover:bg-green-700 text-white focus:ring-green-500/70`,
  ];


  if (isLoading) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-100 via-slate-50 to-sky-100 p-4">
      <div className="w-14 h-14 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-600 text-lg">Cargando encuesta...</p>
    </div>
  );

  // --- VISTA DE DEPÓSITO (adaptada al layout de fondo fijo y con Button del UI Kit) ---
  if (currentStep === 'deposit') {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden">
        {/* Div morado fijo en el fondo */}
        <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-purple-600 to-indigo-800 z-0"></div>

        {/* Contenedor principal con scroll */}
        <div className="relative z-10 flex flex-col min-h-screen w-full max-w-md mx-auto">

          {/* HEADER DE DASHBOARD (integrado aquí) */}
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
                <span className="text-white text-lg">Juega y Gana</span>
                <h1 className="text-2xl font-bold">
                  {userInfo?.username || 'Usuario'}
                </h1>
              </div>
              {/* Precio y Icono de Moneda */}
              <div className="flex items-center space-x-2 bg-white/10 px-2 py-1 rounded-full border border-white/20 shadow-sm">
                <WalletIcon className="w-6 h-6 text-yellow-300" />
                <span className="text-lg font-extrabold text-white">21,902</span>
              </div>
            </header>

          </div>
          {/* FIN DEL HEADER DE DASHBOARD */}


          <main className="flex-grow overflow-y-auto bg-white rounded-t-2xl shadow-inner px-6 pb-20 relative z-10">
            <Image
              src="/descarga-removebg-preview.png"
              alt="Ilustración de ahorro"
              width={300}
              height={300}
              className="mx-auto mb-6 drop-shadow-lg mt-12 sm:mt-20"
            />
            <p className="text-slate-700 mb-8 text-lg md:text-lg leading-relaxed text-center px-2">
              Participa con un monto, pon a prueba tus conocimientos financieros y ¡gana un interés atractivo sobre tu participación!
            </p>
            <form onSubmit={handleParticipationSubmit} className="space-y-8">
              <div>
                <label className="block text-lg font-semibold text-slate-700 mb-4 text-center">
                  Selecciona tu Monto de Participación (USDC):
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {PREDEFINED_PARTICIPATION_AMOUNTS.map((val) => (
                    <Button
                      key={val}
                      type="button"
                      onClick={() => setParticipationAmount(val)}
                      size="lg"
                      variant={participationAmount === val ? "primary" : "secondary"}
                      className={`flex items-center justify-center`}
                    >
                      <WalletIcon className="h-5 w-5 mr-1" />
                      {val} <span className="font-normal text-xs ml-1">USDC</span>
                    </Button>
                  ))}
                </div>
              </div>
              <div className="w-full flex justify-center mt-8">
                <Button size="lg" variant="primary" type="submit">
                  Participar con {participationAmount} USDC
                </Button>
              </div>
            </form>
          </main>
          {/* Barra de navegación inferior */}
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


  if (currentStep === 'survey' && currentQuestion) {
    const progressPercent = ((currentQuestionIndex) / questions.length) * 100;
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-stretch justify-between p-4 sm:p-6 transition-colors duration-300 overflow-y-auto">

          {/* FIN DEL HEADER PARA VISTA DE ENCUESTA */}

        <header className="w-full max-w-4xl mx-auto pt-2 sm:pt-4 shrink-0">
          <div className="flex justify-between items-center text-slate-300 mb-2.5">
            <span className="text-sm font-semibold tracking-wide">Pregunta {currentQuestionIndex + 1} <span className="opacity-70">de</span> {questions.length}</span>
            <span className="text-lg font-bold rounded-lg bg-slate-700/60 px-4 py-1.5 shadow-sm">Puntos: {score}</span>
          </div>
          <div className="w-full bg-slate-700/80 rounded-full h-4 md:h-5 overflow-hidden shadow-inner">
            <div className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 h-full rounded-full transition-all duration-300 ease-out" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </header>
        <Image
          src="/contabilidad.png"
          alt="Ilustración de contabilidad"
          width={150}
          height={150}
          className="mx-auto mb-2 drop-shadow-lg mt-12 sm:mt-10"
        />
        <main className="flex-grow flex flex-col items-center justify-center w-full max-w-3xl mx-auto px-2 my-5 sm:my-8">
          <div className="relative w-full bg-white/95 backdrop-blur-md text-slate-800 p-8 sm:p-10 md:p-14 rounded-2xl shadow-2xl mb-8 text-center border border-slate-200/50">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">{currentQuestion.text}</h2>

            {/* --- Nuevo div para el feedback in-situ --- */}
            {showInSituFeedback && (
              <div className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl
                                 ${answerStatus === 'correct' ? 'bg-green-600/90' :
                                   answerStatus === 'incorrect' ? 'bg-red-700/90' :
                                   'bg-orange-600/90'}
                                 text-white transition-opacity duration-300 ease-out z-10`}>
                {answerStatus === 'correct' && <NativeCheckCircleIcon className="w-16 h-16 sm:w-20 sm:h-20 mb-2 drop-shadow-lg" />}
                {answerStatus === 'incorrect' && <NativeXCircleIcon className="w-16 h-16 sm:w-20 sm:h-20 mb-2 drop-shadow-lg" />}
                {answerStatus === 'timeout' && <NativeClockIcon className="w-16 h-16 sm:w-20 sm:h-20 mb-2 drop-shadow-lg" />}
                <p className="text-3xl sm:text-4xl font-extrabold tracking-tight [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]">
                  {answerStatus === 'correct' ? '¡Correcto!' :
                   answerStatus === 'incorrect' ? '¡Incorrecto!' :
                   '¡Tiempo Agotado!'}
                </p>
                {answerStatus === 'correct' && <p className="text-lg sm:text-xl font-semibold opacity-90 [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]">+{questions[currentQuestionIndex]?.points || 0} puntos</p>}
                {answerStatus === 'incorrect' && questions[currentQuestionIndex] && (
                    <p className="text-base sm:text-lg mt-2 opacity-80 max-w-xs text-center px-2">
                        La respuesta correcta era: <strong className="font-bold text-yellow-300">{questions[currentQuestionIndex].options.find(o => o.id === questions[currentQuestionIndex].correctOptionId)?.text}</strong>
                    </p>
                )}
              </div>
            )}
            {/* --- Fin del feedback in-situ --- */}

          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {currentQuestion.options.map((option, index) => (
              <button
                key={option.id} type="button"
                onClick={() => handleAnswer(option.id)}
                disabled={showInSituFeedback}
                className={`${kahootButtonBaseLayout} ${kahootButtonStyles[index % kahootButtonStyles.length]}
                                 ${showInSituFeedback && option.id === selectedAnswerId ?
                                     (answerStatus === 'correct' ? '!bg-green-500 ring-green-400 !opacity-100 scale-105 shadow-2xl' :
                                      answerStatus === 'incorrect' ? '!bg-red-500 ring-red-400 !opacity-100 scale-105 shadow-2xl' :
                                      '!bg-orange-500 ring-orange-400 !opacity-100 scale-105 shadow-2xl'
                                     )
                                     : ''}
                                 ${showInSituFeedback && option.id !== selectedAnswerId && option.id === currentQuestion.correctOptionId ? '!bg-green-500 !opacity-60 ring-2 ring-white/50' : ''}
                                 ${showInSituFeedback && option.id !== selectedAnswerId && option.id !== currentQuestion.correctOptionId ? 'opacity-30 hover:opacity-30 scale-95' : ''}
                               `}
              >
                <span className="block truncate">{option.text}</span>
              </button>
            ))}
          </div>
        </main>

        <footer className="w-full max-w-3xl mx-auto pb-2 sm:pb-4 text-center shrink-0">
          <div className={`inline-block px-10 py-4 rounded-full text-4xl font-bold border-4 shadow-xl transition-all duration-300
                                 ${timeLeft <= 5 && timeLeft > 0 ? 'text-red-300 border-red-500/80 bg-red-900/40 animate-pulse' :
                                   timeLeft === 0 ? 'text-slate-500 border-slate-700 bg-slate-800/40' :
                                   'text-slate-100 border-slate-500/80 bg-slate-700/60'}`}>
            {timeLeft}
          </div>
        </footer>
      </div>
    );
  }

  // --- VISTA DE RESULTADOS (con botón de "Aportar al Dashboard" que lleva el parámetro `contribution=true`) ---
  if (currentStep === 'results') {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden">
        {/* Div morado fijo en el fondo */}
        <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-purple-600 to-indigo-800 z-0"></div>

        {/* Contenedor principal con scroll */}
        <div className="relative z-10 flex flex-col min-h-screen w-full max-w-md mx-auto">

         
       
          {/* FIN DEL HEADER DE DASHBOARD */}

          <main className="flex-grow overflow-y-auto bg-white rounded-t-2xl shadow-inner px-6 pb-20 relative z-10 flex flex-col items-center justify-center text-center">
            <Image
              src="/medalla.png"
              alt="medalla de CapitalWup"
              width={100}
              height={100}
              className="mx-auto mb-6 drop-shadow-lg mt-12 sm:mt-20"
            />
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-400 mb-4">
              ¡Felicidades!
            </h1>
            <p className="text-slate-700 text-lg sm:text-xl mb-8">Puntuación Final: <span className="font-bold text-sky-600 text-xl sm:text-2xl">{score}</span> / {totalPossiblePoints} puntos.</p>

            <div className="bg-sky-50/80 p-6 rounded-xl border-2 border-sky-200/90 space-y-4 mb-8 text-left text-md shadow-lg w-full max-w-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Monto de Participación:</span>
                <span className="font-semibold text-slate-800 text-lg">{participationAmount.toFixed(2)} USDC</span>
              </div>
              <div className="flex justify-between items-center text-green-600">
                <span className="font-semibold">Interés Ganado:</span>
                <span className="font-bold text-xl">+{earnedInterestAmount.toFixed(2)} USDC</span>
              </div>
              <hr className="my-3 border-sky-300/70" />
              <div className="flex justify-between items-center font-bold text-2xl text-sky-700">
                <span>Saldo Final con Interés: </span>
                <span> {(participationAmount + earnedInterestAmount).toFixed(2)} USDC</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-8 px-4 leading-relaxed">Al volver al dashboard, se registrará tu aporte simbólico al fondo comunitario por tu excelente desempeño.</p>

            <div className="flex flex-col items-center w-full px-4 sm:px-6 md:px-8 max-w-md">
              <div className="flex flex-col items-center w-full">
                <Button size="lg" variant="tertiary" onClick={restartSurveyFlow} className="w-full" >
                  Jugar otra vez
                </Button>
              </div>
              <br />
              <div className="flex flex-col items-center w-full">
                <Button
                  size="lg"
                  variant="primary"
                  onClick={() => { router.push('/dashboard?contribution=true'); }} className="w-full" >
                  Aportar al Dashboard
                </Button>
              </div>
            </div>
          </main>
          {/* Barra de navegación inferior */}
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

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-100 via-slate-50 to-sky-100 p-4">
      <div className="w-14 h-14 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-600 text-lg">Cargando encuesta...</p>
    </div>
  );
}