# Instrucciones para el dueño de Fly Soul Perfumes

Guía simple para manejar el catálogo de tu tienda. No necesitás saber programación.

---

## Antes de publicar el sitio

Abrí el archivo **main.js** con el Bloc de notas (clic derecho → Abrir con → Bloc de notas).

Buscá estas tres líneas al inicio del archivo y reemplazá los valores:

```
const SHEET_ID        = 'TU_ID_DE_GOOGLE_SHEETS_AQUI';
const WHATSAPP_NUMERO = 'XXXXXXXXXXX';
const INSTAGRAM_HANDLE = 'flysoulperfumes';
```

- **SHEET_ID**: lo obtenés de tu Google Sheets (ver Paso 1)
- **WHATSAPP_NUMERO**: tu número con código de país, sin + ni espacios. Ejemplo: `595981234567`
- **INSTAGRAM_HANDLE**: tu usuario de Instagram sin el @. Ejemplo: `flysoulperfumes`

---

## Paso 1 — Crear la planilla de productos en Google Sheets

1. Andá a [sheets.google.com](https://sheets.google.com) e iniciá sesión con tu cuenta de Google.
2. Hacé clic en el botón **+** para crear una hoja nueva.
3. En la **primera fila** escribí estos títulos exactamente así (una palabra por celda):

   | A | B | C | D | E | F | G |
   |---|---|---|---|---|---|---|
   | nombre | descripcion | precio | categoria | foto | disponible | destacado |

4. Hacé clic en **Compartir** (arriba a la derecha) → **Cambiar a cualquier persona con el enlace** → elegí **Lector** → clic en **Copiar enlace** → **Listo**.

5. Del enlace que copiaste, buscá la parte que dice `/d/` y copiá lo que viene después hasta el próximo `/`.

   Ejemplo: si el link es `https://docs.google.com/spreadsheets/d/1aBcD_EfGh/edit`, entonces el ID es **1aBcD_EfGh**.

6. Pegá ese ID en el archivo **main.js** donde dice `TU_ID_DE_GOOGLE_SHEETS_AQUI`.

---

## Paso 2 — Subir una foto a Google Drive y obtener el link

1. Andá a [drive.google.com](https://drive.google.com).
2. Hacé clic en **Nuevo → Subir archivo** y elegí la foto del perfume desde tu computadora o celular.
3. Una vez subida, hacé **clic derecho** sobre la foto → **Compartir** → **Cualquier persona con el enlace puede ver** → **Listo**.
4. Volvé a hacer **clic derecho** → **Copiar enlace**.
5. Pegá ese link en la columna **foto** de la fila correspondiente al perfume.

El sitio convierte automáticamente ese link para mostrar la imagen. No necesitás hacer nada más.

> **Tamaño recomendado para las fotos**: mínimo 600 × 400 píxeles. Cuadrada o apaisada se ve bien.

---

## Paso 3 — Agregar un perfume nuevo

Simplemente agregá una fila nueva en la planilla con los datos del perfume:

| Campo | Qué poner | Ejemplo |
|---|---|---|
| **nombre** | El nombre del perfume | Oud Royale |
| **descripcion** | Una descripción corta | Fragancia amaderada con notas de ámbar... |
| **precio** | El precio con formato | 150.000 Gs |
| **categoria** | hombre, mujer o unisex (en minúscula) | unisex |
| **foto** | El link de Google Drive (ver Paso 2) | https://drive.google.com/file/d/... |
| **disponible** | SI para que se muestre, NO para ocultarlo | SI |
| **destacado** | SI para mostrar el badge "Destacado", NO si no | NO |

> **Importante**: usá exactamente **SI** o **NO** en mayúsculas en las columnas `disponible` y `destacado`.

El sitio se actualiza automáticamente. En unos minutos (o al recargar la página) el nuevo perfume aparece en el catálogo.

---

## Paso 4 — Ocultar un perfume sin borrarlo

Si querés dejar de mostrar un perfume temporalmente (por ejemplo, porque se agotó):

1. Buscá su fila en la planilla.
2. En la columna **disponible**, cambiá el valor de `SI` a `NO`.
3. Guardá (Google Sheets guarda automáticamente).

El perfume desaparece del sitio pero sus datos siguen guardados en la planilla. Para volver a mostrarlo, poné `SI` de nuevo.

---

## Paso 5 — Cambiar un precio

1. Buscá el perfume en la planilla.
2. Hacé clic en la celda de la columna **precio**.
3. Escribí el nuevo precio y presioná Enter.

El cambio se refleja en el sitio en pocos minutos.

---

## Cómo publicar el sitio en Netlify (gratis, 5 pasos)

1. Andá a [netlify.com](https://netlify.com) y creá una cuenta gratuita (podés entrar con tu cuenta de Google).
2. En el panel principal, buscá la sección **"Deploy manually"** o **"Sites"** → **"Add new site"** → **"Deploy manually"**.
3. Comprimí la carpeta `fly-soul` en un archivo **.zip** (clic derecho → Comprimir o Enviar a → Carpeta comprimida).
4. Arrastrá el archivo .zip a la zona de Netlify que dice **"Drag and drop your site folder here"**.
5. ¡Listo! Netlify te da una URL pública tipo `https://nombre-random.netlify.app`. Podés cambiarla desde **Site settings → Domain management**.

> Para actualizar el sitio en el futuro, repetí los pasos 3 y 4 con la carpeta modificada.

---

## Qué hacer si Google Sheets tarda en reflejar los cambios

Google Sheets a veces demora hasta **5 minutos** en mostrar los cambios en el sitio (es un caché del servicio que usamos).

Si necesitás que el cambio aparezca ya:

1. Abrí la planilla en Google Sheets.
2. Hacé un cambio pequeño en cualquier celda (por ejemplo, agregá un espacio en blanco y borralo).
3. Esto fuerza que Google actualice los datos.

También podés simplemente esperar 5 minutos y recargar la página del sitio.

---

## Contacto y soporte

Si tenés dudas sobre cómo usar el sitio, la planilla o Netlify, podés consultar:
- Los tutoriales de YouTube de Google Sheets (son muy amigables)
- La ayuda de Netlify en [docs.netlify.com](https://docs.netlify.com) (en inglés)

---

*Fly Soul Perfumes · Sistema de catálogo web*
