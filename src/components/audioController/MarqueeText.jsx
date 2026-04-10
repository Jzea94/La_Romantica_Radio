import React, { useState, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * MarqueeText blindado: 
 * Solo anima si el contenido desborda. 
 * Resetea forzosamente el estado al cambiar el texto para evitar el "efecto memoria" de títulos largos anteriores.
 */
const MarqueeText = ({ text, className }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Usamos useLayoutEffect para medir ANTES de que el usuario vea el cambio en pantalla
  useLayoutEffect(() => {
    // 1. Reset inmediato: Por seguridad, asumimos que no debe animar al cambiar el texto
    setShouldAnimate(false);

    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const isOverflowing = textRef.current.offsetWidth > containerRef.current.offsetWidth;
        setShouldAnimate(isOverflowing);
      }
    };

    // 2. Pequeño delay para permitir que el motor de renderizado de React 
    // actualice el ancho del elemento textRef con el nuevo contenido.
    const timeoutId = setTimeout(checkOverflow, 50);

    return () => clearTimeout(timeoutId);
  }, [text]); // Se dispara cada vez que el texto cambia

  return (
    <div 
      ref={containerRef} 
      className="w-full overflow-hidden whitespace-nowrap relative"
    >
      <motion.div
        key={text} // Al usar el texto como KEY, Framer Motion destruye y recrea el componente al cambiar de canción
        ref={textRef}
        className={`inline-block ${className}`}
        initial={{ x: 0 }}
        animate={shouldAnimate ? { x: [0, "-50%"] } : { x: 0 }}
        transition={
          shouldAnimate 
            ? {
                duration: 12,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 2
              }
            : { duration: 0 }
        }
      >
        <span>{text}</span>
        {/* Solo renderizamos el segundo span si es estrictamente necesario animar */}
        {shouldAnimate && <span className="ml-12">{text}</span>}
      </motion.div>
    </div>
  );
};

export default MarqueeText;