"use client";

import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Usar FormSubmit (gratis, sin configuración previa)
      // Solo necesita el email de destino en la acción del formulario
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("message", formData.message);
      formDataToSend.append("_subject", `Nueva consulta de ${formData.name}`);

      const response = await fetch("https://formsubmit.co/contacto@bks-music.com", {
        method: "POST",
        body: formDataToSend,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        throw new Error("Error al enviar el email");
      }
    } catch (error) {
      console.error("Error:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-12 sm:py-16 md:py-24 overflow-hidden" style={{ backgroundColor: 'transparent' }}>
      {/* Línea decorativa superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800/50 to-transparent"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Título principal */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-center text-gray-400">
            CONTACTO
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 max-w-6xl mx-auto">
          {/* Left Column - Info */}
          <div className="space-y-4">
            <div className="space-y-6">
              <div className="group">
                <a
                  href="mailto:contacto@bks-music.com"
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal text-gray-300 hover:text-gray-200 transition-all duration-300 block break-all"
                >
                  contacto@bks-music.com
                </a>
              </div>
            </div>
            
            <div className="pt-2 border-t border-zinc-800">
              <p className="text-gray-400 text-sm leading-relaxed font-normal">
                Si eres artista o compositor/a, comparte tu material con nosotros. Puedes hacernos llegar tus archivos mediante enlace de Dropbox o similares. También puedes escribirnos para cualquier propuesta, colaboración o consulta. Estaremos encantados de hablar contigo.
              </p>
            </div>
          </div>
          
          {/* Right Column - Contact Form */}
          <form onSubmit={handleSubmit} className="text-gray-200 relative">
            <div className="space-y-3">
              <div className="relative group">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Tu nombre"
                  className="w-full bg-white/90 hover:bg-white text-gray-900 px-3 py-2 text-sm rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-200 transition-all duration-300 placeholder-gray-500"
                />
              </div>
              
              <div className="relative group">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="tu@email.com"
                  className="w-full bg-white/90 hover:bg-white text-gray-900 px-3 py-2 text-sm rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-200 transition-all duration-300 placeholder-gray-500"
                />
              </div>
              
              <div className="relative group mb-0">
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={5}
                  placeholder="Cuéntanos sobre tu proyecto..."
                  className="w-full bg-white/90 hover:bg-white text-gray-900 px-3 py-2 text-sm rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-200 transition-all duration-300 resize-none placeholder-gray-500"
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-0.5">
              {submitStatus === "success" && (
                <p className="text-green-400 text-xs">¡Mensaje enviado correctamente!</p>
              )}
              {submitStatus === "error" && (
                <p className="text-red-400 text-xs">Error al enviar. Intenta de nuevo.</p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="text-gray-300 hover:text-gray-200 transition-all duration-300 flex items-center justify-center p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                viewBox="0 0 24 24"
                style={{ transform: 'rotate(45deg)' }}
              >
                <path d="M22 2L11 13"></path>
                <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
              </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

