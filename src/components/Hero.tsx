import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative w-full min-h-[calc(100vh-4.1rem)] flex items-center justify-center overflow-hidden">
      {/* Imagen Hero de fondo */}
      <img
        src="/hero-desktop.png"
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
      />

      {/* Contenido principal */}
      <div className="relative z-20 flex flex-col md:flex-row items-center justify-center w-full max-w-5xl mx-auto px-6">
        {/* Logo y textos */}
        <div className="flex-1 flex flex-col items-start justify-center gap-6">
          {/* Logo */}
          <img
            src="/logo.png"
            alt="RunPool Logo"
            className="w-40 h-auto mb-2"
          />
          {/* Título */}
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-2">
            Viajá a tu <br /> próxima carrera
          </h1>
          {/* Subtítulo */}
          <p className="text-lg md:text-xl text-white/90 mb-6 max-w-lg">
            Ofrece o encontrá viajes en auto hasta la línea de largada de todas las carreras de Argentina.
          </p>
          {/* Botones */}
          <div className="flex gap-4">
            <a href="/login">
              <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-md shadow transition">Iniciar sesión</button>
            </a>
            <a href="/races">
              <button className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-md border border-white/30 transition">Ver todas las carreras</button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
