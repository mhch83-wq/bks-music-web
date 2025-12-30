# WEB BKS Final - Versión para Cloudflare Pages

Esta es la versión limpia y final de la web de BKS Music, lista para desplegar en Cloudflare Pages.

## Características

- **Hero H**: Versión única del hero (tanto desktop como móvil)
- **Email actualizado**: contacto@bks-music.com
- **Año dinámico**: Se actualiza automáticamente cada año
- Optimizada para producción
- Sin código innecesario de otros heros
- Lista para deployment en Cloudflare Pages

## Estructura del Proyecto

```
WEB BKS final/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ArtistsSection.tsx
│   ├── BKSMusic.tsx
│   ├── CompaniesLogos.tsx
│   ├── Contact.tsx (email: contacto@bks-music.com)
│   ├── Footer.tsx (año dinámico)
│   ├── Hero.tsx (solo Hero H)
│   ├── Navigation.tsx
│   ├── Stats.tsx
│   └── WorkGrid.tsx
├── public/
│   ├── VideoLofi2.mp4 (video del hero)
│   ├── hero-h-logo.png
│   ├── hero-h-overlay.png
│   ├── Logos de compañías (archivos 68f66...)
│   └── Fotos del equipo (Jacque.jpeg, Javi.jpeg, Manu.jpg, etc.)
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── postcss.config.mjs
```

## Instrucciones de Deployment en Cloudflare Pages

### Opción 1: Desde GitHub (Recomendado)

1. **Sube el proyecto a GitHub:**
   ```bash
   cd "/Users/manuchalud/Desktop/WEB BKS final"
   git init
   git add .
   git commit -m "Initial commit - WEB BKS Final"
   git branch -M main
   git remote add origin <tu-repositorio-github>
   git push -u origin main
   ```

2. **En Cloudflare Dashboard:**
   - Ve a **Pages** → **Create a project**
   - Conecta tu repositorio de GitHub
   - Configuración del build:
     - **Framework preset**: Next.js
     - **Build command**: `npm run build`
     - **Build output directory**: `.next`
     - **Root directory**: `/` (raíz del proyecto)
   - Click en **Save and Deploy**

### Opción 2: Desde Wrangler CLI

1. **Instala Wrangler:**
   ```bash
   npm install -g wrangler
   ```

2. **Login en Cloudflare:**
   ```bash
   wrangler login
   ```

3. **Build del proyecto:**
   ```bash
   cd "/Users/manuchalud/Desktop/WEB BKS final"
   npm install
   npm run build
   ```

4. **Deploy:**
   ```bash
   wrangler pages deploy .next --project-name=bks-music-web
   ```

### Opción 3: Arrastrar y Soltar (Solo para pruebas)

1. **Build local:**
   ```bash
   cd "/Users/manuchalud/Desktop/WEB BKS final"
   npm install
   npm run build
   ```

2. **En Cloudflare Dashboard:**
   - Ve a **Pages** → **Create a project** → **Upload assets**
   - Arrastra la carpeta `.next` generada

## Configuración de Build

El proyecto está configurado con:
- **Next.js 14.2.5**
- **React 18**
- **TypeScript**
- **Tailwind CSS**

### Variables de Entorno

No se requieren variables de entorno para esta versión.

## Scripts Disponibles

```bash
npm run dev      # Desarrollo local
npm run build    # Build para producción
npm run start    # Servidor de producción
npm run lint     # Linter
```

## Notas Importantes

1. **Hero H único**: Esta versión solo incluye el Hero H (bg20). Los otros heros están guardados en la carpeta `archived_heroes_backup` del proyecto original.

2. **Recursos públicos**: Todos los recursos necesarios (videos, imágenes, logos) están incluidos en la carpeta `public/`.

3. **Optimización de imágenes**: Next.js Image component está configurado con `unoptimized: true` en `next.config.js` para evitar problemas con nombres de archivos con espacios.

4. **Video del Hero**: El video `VideoLofi2.mp4` se reproduce automáticamente en loop tanto en desktop como móvil.

5. **Email de contacto**: `contacto@bks-music.com`

6. **Año dinámico**: El año en el footer se actualiza automáticamente cada año.

## Respaldo de Otros Heros

Los otros heros (A, D, E, G, I, J, K, M) están guardados en:
- Proyecto original: `/archived_heroes_backup/hero-options/`

Si en el futuro necesitas restaurar algún otro hero, puedes:
1. Copiar las imágenes desde `archived_heroes_backup/hero-options/` a `public/hero-options/`
2. Modificar `components/Hero.tsx` para agregar la lógica del hero deseado

## Soporte

Para cualquier problema con el deployment, verifica:
- Que todas las dependencias estén instaladas (`npm install`)
- Que el build se complete sin errores (`npm run build`)
- Que los archivos en `public/` estén accesibles
- Los logs de Cloudflare Pages en el dashboard

## Versión

- **Fecha de creación**: Diciembre 2024
- **Hero activo**: Hero H (bg20)
- **Plataforma objetivo**: Cloudflare Pages
- **Email**: contacto@bks-music.com
- **Año**: Dinámico (se actualiza automáticamente)
