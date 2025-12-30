"use client";

const artists = [
  "Omar Montes",
  "Zion & Lennox",
  "Ludmilla",
  "Coti",
  "Ruslana",
  "Carlos Baute",
  "Ana Mena",
  "Juan Magán",
  "Don Patricio",
  "Álex Ubago",
  "Cruz Cafuné",
  "Marta Sánchez",
  "DVICIO",
  "Danny Romero",
  "Adexe y Nau",
  "Lérica",
  "María Pelae",
  "Marlena",
  "Blas Cantó",
  "Gloria Trevi",
  "Bombai",
  "Dj Nano",
  "Lu Decker",
  "Kalenn",
  "Polo Nandez",
  "Nyno Vargas",
  "Oscar El Ruso",
  "María Luna",
  "Sweet California",
  "Guzmen",
  "Kapla y Miky",
  "Lennis Rodriguez"
];

export default function ArtistsSection() {
  return (
    <section className="relative -mt-8 md:-mt-2 pt-0 md:pt-2 pb-8 sm:pb-12 overflow-visible bg-black">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-xs sm:text-sm font-light text-gray-500 mb-4 sm:mb-6 text-center uppercase tracking-widest">
          Artistas
        </h2>
        
        <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-2 sm:gap-y-3">
          {artists.map((artist, index) => (
            <span
              key={index}
              className="text-[10px] sm:text-xs font-light text-gray-200 uppercase tracking-wider relative z-10 transition-colors duration-200 cursor-pointer"
              style={{
                transition: 'color 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                if (window.innerWidth >= 768) {
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (window.innerWidth >= 768) {
                  e.currentTarget.style.color = '#e5e7eb';
                }
              }}
            >
              {artist}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

