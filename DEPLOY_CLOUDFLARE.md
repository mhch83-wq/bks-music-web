# 🚀 Guía de Deployment en Cloudflare Pages

Esta guía te ayudará a subir tu proyecto BKS Music a Cloudflare Pages paso a paso.

## 📋 Requisitos Previos

1. **Cuenta de Cloudflare** (gratuita): https://dash.cloudflare.com/sign-up
2. **Node.js instalado** (versión 18 o superior)
3. **Git instalado** (opcional, pero recomendado)

---

## 🎯 Opción 1: Deployment desde GitHub (RECOMENDADO)

Esta es la opción más fácil y permite actualizaciones automáticas cada vez que hagas cambios.

### Paso 1: Subir el proyecto a GitHub

1. **Crea un repositorio en GitHub:**
   - Ve a https://github.com/new
   - Nombra tu repositorio (ej: `bks-music-web`)
   - Crea el repositorio (puedes dejarlo público o privado)

2. **Sube tu código:**
   ```bash
   cd "/Users/manuchalud/Desktop/WEB BKS final"
   
   # Inicializa git (si no lo has hecho)
   git init
   
   # Agrega todos los archivos
   git add .
   
   # Haz tu primer commit
   git commit -m "Initial commit - BKS Music Web"
   
   # Cambia a la rama main
   git branch -M main
   
   # Conecta con tu repositorio de GitHub (reemplaza TU_USUARIO y TU_REPO)
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   
   # Sube el código
   git push -u origin main
   ```

### Paso 2: Conectar con Cloudflare Pages

1. **Ve al Dashboard de Cloudflare:**
   - Inicia sesión en https://dash.cloudflare.com
   - En el menú lateral, haz clic en **Pages**

2. **Crea un nuevo proyecto:**
   - Haz clic en **Create a project**
   - Selecciona **Connect to Git**
   - Autoriza Cloudflare para acceder a tu GitHub (si es necesario)
   - Selecciona tu repositorio `bks-music-web`

3. **Configura el Build:**
   - **Project name**: `bks-music-web` (o el nombre que prefieras)
   - **Production branch**: `main`
   - **Framework preset**: `Next.js`
   - **Build command**: `npm run build:cloudflare`
   - **Build output directory**: `.vercel/output/static`
   - **Root directory**: `/` (dejar vacío o poner `/`)

4. **Variables de entorno:**
   - No necesitas agregar ninguna variable de entorno por ahora
   - Haz clic en **Save and Deploy**

5. **Espera a que termine el build:**
   - Cloudflare instalará las dependencias y construirá tu proyecto
   - Esto puede tardar 2-5 minutos la primera vez
   - Verás el progreso en tiempo real

6. **¡Listo! Tu web estará online:**
   - Una vez terminado, tendrás una URL como: `https://bks-music-web.pages.dev`
   - Puedes personalizar el dominio en la configuración del proyecto

---

## 🛠️ Opción 2: Deployment con Wrangler CLI

Si prefieres hacer el deployment directamente desde tu terminal:

### Paso 1: Instalar dependencias

```bash
cd "/Users/manuchalud/Desktop/WEB BKS final"
npm install
```

### Paso 2: Instalar Wrangler (si no lo tienes)

```bash
npm install -g wrangler
```

### Paso 3: Iniciar sesión en Cloudflare

```bash
wrangler login
```

Esto abrirá tu navegador para autorizar Wrangler.

### Paso 4: Hacer el build y deploy

```bash
# Build para Cloudflare
npm run build:cloudflare

# Deploy
wrangler pages deploy .vercel/output/static --project-name=bks-music-web
```

### Paso 5: ¡Listo!

Tu web estará disponible en la URL que te proporcione Wrangler.

---

## 🔄 Actualizar tu web después de cambios

### Si usas GitHub (Opción 1):
1. Haz tus cambios en el código
2. Haz commit y push:
   ```bash
   git add .
   git commit -m "Descripción de los cambios"
   git push
   ```
3. Cloudflare detectará automáticamente los cambios y hará un nuevo deployment

### Si usas Wrangler CLI (Opción 2):
```bash
npm run build:cloudflare
wrangler pages deploy .vercel/output/static --project-name=bks-music-web
```

---

## ⚙️ Configuración Avanzada

### Personalizar el dominio

1. En Cloudflare Pages, ve a tu proyecto
2. Haz clic en **Custom domains**
3. Agrega tu dominio personalizado (ej: `www.bks-music.com`)
4. Sigue las instrucciones para configurar los DNS

### Variables de entorno

Si en el futuro necesitas variables de entorno:
1. Ve a tu proyecto en Cloudflare Pages
2. Settings → Environment variables
3. Agrega las variables necesarias

---

## 🐛 Solución de Problemas

### Error: "Build failed"

1. **Verifica que el build funciona localmente:**
   ```bash
   npm install
   npm run build:cloudflare
   ```

2. **Revisa los logs en Cloudflare:**
   - Ve a tu proyecto → Deployments
   - Haz clic en el deployment fallido para ver los logs

3. **Problemas comunes:**
   - **Dependencias faltantes**: Asegúrate de que `package.json` tiene todas las dependencias
   - **Node version**: Cloudflare usa Node 18 por defecto (compatible con tu proyecto)
   - **Memoria**: Si el build es muy grande, puede necesitar más tiempo

### El sitio no carga correctamente

1. Verifica que el **Build output directory** es correcto: `.vercel/output/static`
2. Asegúrate de que el build se completó sin errores
3. Revisa la consola del navegador para ver errores específicos

### Video no se reproduce

- Los videos grandes pueden tardar en cargar
- Verifica que el archivo `VideoLofi2.mp4` está en la carpeta `public/`
- Considera optimizar el video si es muy pesado (>10MB)

---

## 📝 Notas Importantes

- ✅ Tu proyecto ya está configurado para Cloudflare Pages
- ✅ Las imágenes están optimizadas para funcionar sin problemas
- ✅ El video del hero se reproducirá automáticamente
- ✅ El diseño es responsive (funciona en móvil y desktop)

---

## 🆘 ¿Necesitas ayuda?

Si tienes problemas:
1. Revisa los logs de Cloudflare Pages
2. Verifica que todas las dependencias están instaladas
3. Asegúrate de que el build funciona localmente antes de hacer deploy

---

**¡Buena suerte con tu deployment! 🎉**

