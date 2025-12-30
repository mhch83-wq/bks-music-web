"use client";

const partners = [
  "Omar Montes",
  "Zion & Lennox",
  "Ludmilla",
  "Coti",
  "Carlos Baute",
  "Ana Mena",
  "Juan Magán",
  "Don Patricio",
  "Álex Ubago",
  "Cruz Cafuné",
  "Marta Sánchez",
  "DVICIO",
  "Lu Decker",
  "Adexe y Nau",
  "Lérica",
  "María Pelae",
  "Blas Cantó",
  "Gloria Trevi",
  "Bombai",
  "Dj Nano",
  "Kalenn",
  "Polo Nandez",
  "Nyno Vargas",
  "Oscar El Ruso",
  "Sweet California",
  "Kapla y Miky",
  "Lennis Rodriguez"
];

export default function PartnersStrip() {
  return (
    <section className="py-0.5 bg-black border-y border-gray-800">
      <div className="overflow-hidden whitespace-nowrap">
        <div className="inline-flex animate-scroll space-x-2">
          {partners.map((partner, index) => (
            <span
              key={index}
              className="text-sm font-light text-gray-200 tracking-wider"
            >
              {partner}
            </span>
          ))}
          {/* Duplicado para efecto loop */}
          {partners.map((partner, index) => (
            <span
              key={`duplicate-${index}`}
              className="text-sm font-light text-gray-200 tracking-wider"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
      `}</style>
    </section>
  );
}

