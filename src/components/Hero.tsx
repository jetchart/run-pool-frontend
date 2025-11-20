import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Hero: React.FC = () => {
  const { userCredential } = useAuth();
  return (
    <>
      {/* Desktop Hero */}
      <section className="relative w-full min-h-[calc(100vh-4.1rem)] flex items-center justify-center overflow-hidden hidden md:flex">
        <img
          src="/hero-desktop.png"
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
        {/* Overlay para opacidad */}
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 flex flex-row items-center justify-between w-full max-w-6xl mx-auto px-6">
          {/* Columna izquierda: logo y textos */}
          <div className="flex-1 flex flex-col md:items-start items-center justify-center gap-6 w-full md:max-w-none max-w-md mx-auto px-4 py-6">
            <img
              src="/logo.png"
              alt="RunPool Logo"
              className="w-40 h-auto mb-2 md:mx-0 mx-auto"
            />
            <h1 className="text-6xl font-bold text-white leading-tight mb-2 md:text-left text-center">
              Viajá a tu <br /> próxima carrera
            </h1>
            <p className="text-xl text-white/90 mb-6 md:text-left text-center md:max-w-lg">
              Ofrece o encontrá viajes en auto hasta la línea de largada de todas las carreras de Argentina.
            </p>
            <div className="flex flex-row gap-4 w-auto">
              {!userCredential && (
                <a href="/login">
                  <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-md shadow transition">Iniciar sesión</button>
                </a>
              )}
              <a href="/races">
                <button className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-md border border-white/30 transition">Ver todas las carreras</button>
              </a>
            </div>
          </div>
          {/* Columna derecha: imagen de ejemplo de carrera */}
          <div className="hidden md:flex flex-col items-center justify-center h-full">
            <img
              src="/race-example.png"
              alt="Ejemplo carrera"
              className="rounded-2xl shadow-lg w-[420px] h-auto max-h-[520px] object-cover object-center border border-white/30"
              style={{ marginRight: '0px' }}
            />
          </div>
        </div>
      </section>

      {/* Mobile Hero */}
      <section className="relative w-full min-h-[calc(100vh-4.1rem)] flex items-center justify-center overflow-hidden md:hidden">
        <img
          src="/hero-desktop.png"
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
        {/* Overlay para opacidad */}
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-md mb-10 mx-auto px-4 py-6">
          <img
            src="/logo.png"
            alt="RunPool Logo"
            className="w-32 h-auto mb-2 mx-auto"
          />
          <h1 className="ml-10 mr-10 text-5xl font-bold text-white leading-tight mb-2 text-center">
            Viajá a tu <br /> próxima carrera
          </h1>
          <p className="text-base text-white/90 mb-6 text-center">
            Ofrece o encontrá viajes en auto hasta la línea de largada de todas las carreras de Argentina.
          </p>
          <div className="flex flex-col gap-3 w-full">
            {!userCredential && (
              <a href="/login" className="w-full">
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-black font-semibold px-6 py-3 rounded-md shadow transition text-lg">Iniciar sesión</button>
              </a>
            )}
            <a href="/races" className="w-full">
              <button className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-md border border-white/30 transition text-lg">Ver todas las carreras</button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
