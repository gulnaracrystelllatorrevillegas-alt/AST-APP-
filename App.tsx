import React, { useState } from 'react';
import { AppView, AIRecommendation, UserInput, TechniqueId } from './types';
import { EMOTION_OPTIONS, TECHNIQUES } from './constants';
import { getBreathingRecommendation } from './services/geminiService';
import BreathingSession from './components/BreathingSession';
import Button from './components/Button';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.WELCOME);
  const [userInput, setUserInput] = useState<UserInput>({ emotion: '', customText: '' });
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);

  // --- Handlers ---

  const handleStart = () => setCurrentView(AppView.INPUT);

  const handleEmotionSelect = (emotion: string) => {
    setUserInput(prev => ({ ...prev, emotion }));
  };

  const handleSubmitEmotion = async () => {
    if (!userInput.emotion && !userInput.customText) return;

    setCurrentView(AppView.LOADING);
    
    const rec = await getBreathingRecommendation(userInput.emotion, userInput.customText);
    setRecommendation(rec);
    setCurrentView(AppView.RECOMMENDATION);
  };

  const handleStartBreathing = () => setCurrentView(AppView.BREATHING);
  
  const handleFinishBreathing = () => setCurrentView(AppView.FINISHED);
  
  const handleReset = () => {
    setUserInput({ emotion: '', customText: '' });
    setRecommendation(null);
    setCurrentView(AppView.WELCOME);
  };

  // --- Views ---

  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in">
      <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center mb-4 shadow-xl shadow-sky-200/50 border border-sky-100">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <h1 className="text-4xl font-bold text-mist-900 mb-3 tracking-tight">Respira Contigo</h1>
        <p className="text-mist-800 max-w-xs mx-auto text-lg leading-relaxed font-medium">
          Tu espacio seguro para recuperar la calma y respirar mejor.
        </p>
      </div>
      <div className="w-full max-w-xs pt-8">
        <Button onClick={handleStart} fullWidth>Comenzar</Button>
      </div>
    </div>
  );

  const renderInput = () => (
    <div className="flex flex-col h-full w-full max-w-md mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-mist-900 mb-6 text-center">¿Cómo te sientes ahora?</h2>
      
      <div className="grid grid-cols-1 gap-3 mb-6">
        {EMOTION_OPTIONS.map((emotion) => (
          <Button
            key={emotion}
            variant={userInput.emotion === emotion ? 'primary' : 'secondary'}
            onClick={() => handleEmotionSelect(emotion)}
            className="text-left px-6 py-5 text-lg"
          >
            {emotion}
          </Button>
        ))}
      </div>

      <div className="mb-8">
        <label className="block text-sm font-semibold text-mist-700 mb-2 ml-1">
          ¿Quieres contarlo con tus palabras? (opcional)
        </label>
        <textarea
          className="w-full p-4 rounded-3xl border-2 border-mist-200 focus:border-sky-400 focus:ring-0 resize-none bg-white text-mist-900 placeholder-mist-400 shadow-sm transition-all"
          rows={3}
          placeholder="Ej: Siento un nudo en el pecho..."
          value={userInput.customText}
          onChange={(e) => setUserInput(prev => ({ ...prev, customText: e.target.value }))}
        />
      </div>

      <Button 
        onClick={handleSubmitEmotion} 
        fullWidth 
        disabled={!userInput.emotion && !userInput.customText}
        className="mt-auto mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continuar
      </Button>
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-pulse">
      <div className="w-20 h-20 bg-mist-200 rounded-full flex items-center justify-center relative">
         <div className="absolute inset-0 bg-sky-200 rounded-full animate-ping opacity-40"></div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-mist-900 mb-1">Analizando tu estado...</h3>
        <p className="text-mist-600">Buscando la técnica ideal para ti</p>
      </div>
    </div>
  );

  const renderRecommendation = () => {
    if (!recommendation) return null;
    const technique = TECHNIQUES[recommendation.techniqueId];

    return (
      <div className="flex flex-col h-full items-center justify-center w-full max-w-md mx-auto p-4 animate-fade-in">
        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-sky-100 border border-mist-200 w-full text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky-50 text-sky-500 mb-2 border border-sky-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            </div>
            
            <div>
                <h2 className="text-xl font-semibold text-sky-600 mb-2">Te recomendamos:</h2>
                <h3 className="text-3xl font-bold text-mist-900 mb-4">{technique.name}</h3>
            </div>

            <div className="bg-mist-50 p-5 rounded-2xl text-left border border-mist-100">
                <p className="text-mist-800 italic leading-relaxed">"{recommendation.reasoning}"</p>
            </div>

            <div className="text-mist-600 text-sm bg-white border border-mist-200 rounded-xl p-3 inline-block">
                Secuencia: <span className="font-semibold text-sky-700">{technique.pattern.map(p => p.label.split(' ')[0]).join(' → ')}</span>
            </div>

            <Button onClick={handleStartBreathing} fullWidth>
                Iniciar Respiración Guiada
            </Button>
        </div>
      </div>
    );
  };

  const renderFinished = () => (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in">
       <div className="w-28 h-28 bg-ocean-50 text-ocean-600 rounded-full flex items-center justify-center mb-4 border border-ocean-200 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h2 className="text-3xl font-bold text-mist-900 mb-3">¡Buen trabajo!</h2>
        <p className="text-mist-800 max-w-xs mx-auto text-lg">
          Te has tomado un momento importante para ti. Esperamos que te sientas con más calma.
        </p>
      </div>
      <div className="w-full max-w-xs pt-8">
        <Button onClick={handleReset} variant="outline" className="!text-mist-600 !border-mist-300 hover:!bg-mist-100" fullWidth>
            Volver al Inicio
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-mist-50 text-mist-900 font-sans selection:bg-sky-200">
        <main className="max-w-xl mx-auto min-h-screen p-6 flex flex-col relative overflow-hidden">
            {/* Background ambient blobs - Cool Blue tones */}
            <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-sky-200/60 rounded-full mix-blend-multiply filter blur-3xl animate-blob opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-ocean-200/60 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 opacity-50 pointer-events-none"></div>
            <div className="absolute top-[40%] left-[20%] w-48 h-48 bg-mist-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse opacity-30 pointer-events-none"></div>

            <div className="relative z-10 flex-grow flex flex-col">
                {currentView === AppView.WELCOME && renderWelcome()}
                {currentView === AppView.INPUT && renderInput()}
                {currentView === AppView.LOADING && renderLoading()}
                {currentView === AppView.RECOMMENDATION && renderRecommendation()}
                {currentView === AppView.BREATHING && recommendation && (
                    <BreathingSession 
                        technique={TECHNIQUES[recommendation.techniqueId]} 
                        onFinish={handleFinishBreathing} 
                    />
                )}
                {currentView === AppView.FINISHED && renderFinished()}
            </div>
        </main>
    </div>
  );
};

export default App;