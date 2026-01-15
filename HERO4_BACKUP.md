# Hero4 - Guardado para Referencia Futura

Este documento describe cómo reactivar Hero4 si es necesario en el futuro.

## Estado Actual
- **Hero activo**: Solo Hero1 (tanto desktop como móvil)
- **Hero4**: Guardado pero oculto
- **Selector de Hero**: Oculto pero código preservado

## Archivos Relacionados

### Componentes
- `components/Hero.tsx`: Contiene la lógica de ambos heroes
  - Hero4 está comentado en `HERO_OPTIONS` (línea ~8)
  - Selector está oculto con `{false && ...}` (línea ~382)
  - Código de renderizado de Hero4 está comentado pero preservado

### Imágenes
- `public/hero-options/hero-4.png`: Imagen de Hero4 (preservada)

### Configuración
- `app/page.tsx`: Lógica de secciones ajustada para Hero1
  - Hero4 usaría `-mt-24 md:mt-0` en ArtistsSection si se reactiva

## Cómo Reactivar Hero4

### Paso 1: Descomentar Hero4 en Hero.tsx
```typescript
const HERO_OPTIONS = [
  { id: "hero1", label: "1", hasVideo: true, hasLogo: true },
  { id: "hero4", label: "4", hasVideo: false, hasLogo: true, imageSrc: "/hero-options/hero-4.png" }, // Descomentar esta línea
];
```

### Paso 2: Mostrar el Selector
En `components/Hero.tsx`, línea ~382, cambiar:
```typescript
{false && (  // Cambiar false a true
```

### Paso 3: Ajustar Estado Inicial (Opcional)
Si quieres que Hero4 sea el predeterminado en móvil, en `Hero.tsx` línea ~31:
```typescript
const [activeBgId, setActiveBgId] = useState<string>(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 768 ? "hero4" : "hero1";
  }
  return "hero1";
});
```

### Paso 4: Ajustar page.tsx (Si es necesario)
En `app/page.tsx`, línea ~114, restaurar la lógica condicional:
```typescript
<div className={activeHeroBg === "hero1" ? "-mt-16 md:mt-0" : activeHeroBg === "hero4" ? "-mt-24 md:mt-0" : ""}>
```

## Características de Hero4

### Desktop
- Usa imagen estática: `/hero-options/hero-4.png`
- Mismo logo y overlay que Hero1
- Misma posición de iconos sociales

### Mobile
- Usa imagen estática: `/hero-options/hero-4.png`
- Iconos sociales aparecen inmediatamente (sin delay)
- Mismo logo y overlay que Hero1
- Posición ajustada con `objectPosition: 'center -15%'` y `transform: 'translateY(-10%)'`

## Notas
- Todos los estilos CSS para Hero4 están preservados en el archivo
- La clase `icons-visible-hero4` está disponible para iconos inmediatos en móvil
- El código está completamente funcional, solo necesita ser descomentado
