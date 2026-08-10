import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, CheckCircle, HelpCircle } from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border-8 border-sky-400 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 transition-transform active:scale-95"
          aria-label="Cerrar"
        >
          <X className="w-7 h-7" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 text-sky-900">
          <Smartphone className="w-10 h-10 text-sky-600 flex-shrink-0" />
          <h2 className="text-2xl sm:text-3xl font-black font-['Outfit']">
            Instalar App en Tablet (Android)
          </h2>
        </div>

        {isInstalled ? (
          <div className="p-4 bg-emerald-50 border-4 border-emerald-400 rounded-2xl text-center my-4">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-emerald-900">
              ¡La aplicación ya está instalada en tu tablet!
            </p>
            <p className="text-sm text-emerald-700">
              Busca el icono de "Vocabulario Inés" en el menú de aplicaciones de tu Android.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="w-full py-4 px-6 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xl sm:text-2xl rounded-2xl border-b-4 border-emerald-700 shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-95"
              >
                <Download className="w-8 h-8" />
                <span>¡INSTALAR AHORA EN TABLET!</span>
              </button>
            )}

            <div className="p-4 bg-sky-50 border-2 border-sky-200 rounded-2xl space-y-3">
              <h3 className="font-bold text-sky-950 text-lg flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-sky-600" />
                Instalación manual desde Chrome Android:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 text-sm sm:text-base font-semibold">
                <li>
                  En Chrome de tu tablet Android, toca los <strong>3 puntos verticales (⋮)</strong> en la esquina superior derecha.
                </li>
                <li>
                  Busca y selecciona la opción <strong className="text-sky-700">"Añadir a la pantalla de inicio"</strong> o <strong className="text-sky-700">"Instalar aplicación"</strong>.
                </li>
                <li>
                  Confirma el mensaje. Se creará un <strong>icono directo en el escritorio de tu tablet</strong> como una app nativa de Android.
                </li>
              </ol>
            </div>

            {/* Offline direct HTML backup */}
            <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl space-y-2 text-center">
              <p className="text-sm font-bold text-amber-900">
                O bien descarga el archivo ejecutable autónomo sin servidor:
              </p>
              <a
                href="/INICIAR_JUEGO_TABLET.html"
                download="INICIAR_JUEGO_TABLET.html"
                className="inline-flex items-center gap-2 px-5 py-3 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black rounded-xl border-b-4 border-amber-600 text-sm sm:text-base transition-transform active:scale-95"
              >
                <Download className="w-5 h-5" />
                <span>Descargar INICIAR_JUEGO_TABLET.html</span>
              </a>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-sm"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
