// ═══════════════════════════════════════════════════════════
// FLY SOUL PERFUMES — main.js
// ═══════════════════════════════════════════════════════════

// ┌─────────────────────────────────────────────────────────┐
// │  🔧 CONFIGURACIÓN — reemplazá estos valores             │
// │     antes de publicar el sitio                          │
// └─────────────────────────────────────────────────────────┘

const SHEET_ID          = '1xCDPc6orpE_gp0gZpvY50EB8x4gYS_A9_UFUrFQ_ojo';
const WHATSAPP_NUMERO   = '595984462949'; // Número sin + ni espacios, ej: 595981234567
const INSTAGRAM_HANDLE  = 'flysoulperfumes_'; // Sin el @

// ─── URLs derivadas (no modificar) ──────────────────────────
const SHEET_URL      = `https://opensheet.elk.sh/${SHEET_ID}/Productos`;
const WHATSAPP_BASE  = `https://wa.me/${WHATSAPP_NUMERO}`;
const INSTAGRAM_URL  = `https://instagram.com/${INSTAGRAM_HANDLE}`;

// ─── Estado de la aplicación ────────────────────────────────
let todosLosProductos    = [];
let categoriaActiva      = 'hombre';
let textoBusqueda        = '';
let precioMin            = 0;
let precioMax            = Infinity;
let precioMinDisponible  = 0;
let precioMaxDisponible  = 0;


// ═══════════════════════════════════════════════════════════
// INICIALIZACIÓN
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  configurarLinks();
  configurarNavbar();
  configurarMenuMovil();
  configurarAnimaciones();

  // Solo corre en catalogo.html
  if (document.getElementById('vistaCategorias')) {
    configurarCategorias();
    configurarBuscador();
    configurarFiltroPrecio();
    configurarFiltrosMovil();
    cargarProductos();
  }
});


// ═══════════════════════════════════════════════════════════
// CONFIGURACIÓN DE LINKS DINÁMICOS
// ═══════════════════════════════════════════════════════════
function configurarLinks() {
  const msgGeneral = encodeURIComponent('Hola! Quiero saber más sobre los perfumes de Fly Soul 🌸');

  const whatsappFloat = document.getElementById('whatsappFloat');
  if (whatsappFloat) {
    whatsappFloat.href = `${WHATSAPP_BASE}?text=${msgGeneral}`;
  }

  const footerWhatsapp = document.getElementById('footerWhatsapp');
  if (footerWhatsapp) {
    footerWhatsapp.href = `${WHATSAPP_BASE}?text=${msgGeneral}`;
  }

  const footerInstagram = document.getElementById('footerInstagram');
  if (footerInstagram) {
    footerInstagram.href = INSTAGRAM_URL;
  }
}


// ═══════════════════════════════════════════════════════════
// NAVBAR — efecto scroll
// ═══════════════════════════════════════════════════════════
function configurarNavbar() {
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}


// ═══════════════════════════════════════════════════════════
// MENÚ MÓVIL (hamburguesa)
// ═══════════════════════════════════════════════════════════
function configurarMenuMovil() {
  const burger   = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  if (!burger || !navLinks) return;

  burger.addEventListener('click', () => {
    const estaAbierto = navLinks.classList.toggle('open');
    burger.classList.toggle('open', estaAbierto);
    burger.setAttribute('aria-expanded', String(estaAbierto));
    // Bloquear scroll del body cuando el menú está abierto
    document.body.style.overflow = estaAbierto ? 'hidden' : '';
  });

  // Cerrar al tocar cualquier link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      burger.focus();
    }
  });
}


// ═══════════════════════════════════════════════════════════
// BUSCADOR POR NOMBRE
// ═══════════════════════════════════════════════════════════
function configurarBuscador() {
  const input = document.getElementById('buscadorNombre');
  const clear = document.getElementById('buscadorClear');

  if (!input) return;

  input.addEventListener('input', () => {
    textoBusqueda = input.value.trim().toLowerCase();
    clear.classList.toggle('hidden', textoBusqueda === '');
    renderizarProductos();
  });

  clear.addEventListener('click', () => {
    input.value = '';
    textoBusqueda = '';
    clear.classList.add('hidden');
    input.focus();
    renderizarProductos();
  });
}


// ═══════════════════════════════════════════════════════════
// ANIMACIONES DE ENTRADA (Intersection Observer)
// ═══════════════════════════════════════════════════════════
function configurarAnimaciones() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
}


// ═══════════════════════════════════════════════════════════
// NAVEGACIÓN DE CATEGORÍAS
// ═══════════════════════════════════════════════════════════
function configurarCategorias() {
  document.querySelectorAll('.categoria-card').forEach(card => {
    card.addEventListener('click', () => {
      mostrarVistaProductos(card.dataset.cat);
    });
  });

  const btnVolver = document.getElementById('btnVolver');
  if (btnVolver) {
    btnVolver.addEventListener('click', () => mostrarVistaCategorias(true));
  }
}

function mostrarVistaCategorias(scrollTo = false) {
  document.getElementById('vistaCategorias').classList.remove('hidden');
  document.getElementById('vistaProductos').classList.add('hidden');

  const input = document.getElementById('buscadorNombre');
  if (input) {
    input.value = '';
    textoBusqueda = '';
    const clear = document.getElementById('buscadorClear');
    if (clear) clear.classList.add('hidden');
  }

  precioMin = precioMinDisponible;
  precioMax = precioMaxDisponible;

  if (scrollTo) {
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function mostrarVistaProductos(cat) {
  categoriaActiva = cat;
  document.getElementById('vistaCategorias').classList.add('hidden');
  document.getElementById('vistaProductos').classList.remove('hidden');

  const labels = { hombre: 'Hombre', mujer: 'Mujer', unisex: 'Unisex' };
  document.getElementById('breadcrumbCat').textContent = labels[cat] || cat;

  inicializarFiltrosPrecio(cat);
  renderizarProductos();
  document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth', block: 'start' });
}


// ═══════════════════════════════════════════════════════════
// DRAWER DE FILTROS (MOBILE)
// ═══════════════════════════════════════════════════════════
function configurarFiltrosMovil() {
  const btnAbrir  = document.getElementById('btnFiltrosMobile');
  const btnCerrar = document.getElementById('btnCerrarFiltros');
  const sidebar   = document.getElementById('filtrosSidebar');
  const overlay   = document.getElementById('filtrosOverlay');
  const btnFiltrar = document.getElementById('btnFiltrarPrecio');

  if (!btnAbrir || !sidebar) return;

  function abrirFiltros() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function cerrarFiltros() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  btnAbrir.addEventListener('click', abrirFiltros);
  if (btnCerrar) btnCerrar.addEventListener('click', cerrarFiltros);
  overlay.addEventListener('click', cerrarFiltros);

  // Cerrar drawer automáticamente al aplicar filtro en mobile
  if (btnFiltrar) {
    btnFiltrar.addEventListener('click', () => {
      if (window.innerWidth <= 900) cerrarFiltros();
    });
  }
}


// ═══════════════════════════════════════════════════════════
// FILTRO DE PRECIO
// ═══════════════════════════════════════════════════════════
function configurarFiltroPrecio() {
  const rangeMin = document.getElementById('rangeMin');
  const rangeMax = document.getElementById('rangeMax');
  const btnFiltrar = document.getElementById('btnFiltrarPrecio');

  if (!rangeMin || !rangeMax) return;

  rangeMin.addEventListener('input', () => {
    if (parseInt(rangeMin.value) > parseInt(rangeMax.value)) {
      rangeMin.value = rangeMax.value;
    }
    actualizarFillPrecio();
  });

  rangeMax.addEventListener('input', () => {
    if (parseInt(rangeMax.value) < parseInt(rangeMin.value)) {
      rangeMax.value = rangeMin.value;
    }
    actualizarFillPrecio();
  });

  if (btnFiltrar) {
    btnFiltrar.addEventListener('click', () => {
      precioMin = parseInt(document.getElementById('rangeMin').value);
      precioMax = parseInt(document.getElementById('rangeMax').value);
      renderizarProductos();
    });
  }
}

function inicializarFiltrosPrecio(cat) {
  const precios = todosLosProductos
    .filter(p => (p.categoria || '').trim().toLowerCase() === cat)
    .map(p => parsearPrecio(p.precio))
    .filter(n => n !== null);

  if (precios.length === 0) return;

  precioMinDisponible = Math.min(...precios);
  precioMaxDisponible = Math.max(...precios);
  precioMin = precioMinDisponible;
  precioMax = precioMaxDisponible;

  const rangeMin = document.getElementById('rangeMin');
  const rangeMax = document.getElementById('rangeMax');

  if (!rangeMin || !rangeMax) return;

  rangeMin.min  = precioMinDisponible;
  rangeMin.max  = precioMaxDisponible;
  rangeMin.step = Math.max(1000, Math.floor((precioMaxDisponible - precioMinDisponible) / 100 / 1000) * 1000);
  rangeMin.value = precioMinDisponible;

  rangeMax.min  = precioMinDisponible;
  rangeMax.max  = precioMaxDisponible;
  rangeMax.step = rangeMin.step;
  rangeMax.value = precioMaxDisponible;

  actualizarFillPrecio();
}

function actualizarFillPrecio() {
  const elMin = document.getElementById('rangeMin');
  const elMax = document.getElementById('rangeMax');
  if (!elMin || !elMax) return;

  const min   = parseInt(elMin.value);
  const max   = parseInt(elMax.value);
  const total = precioMaxDisponible - precioMinDisponible || 1;

  const minPct = ((min - precioMinDisponible) / total) * 100;
  const maxPct = ((max - precioMinDisponible) / total) * 100;

  // Colorea el track: izquierda del thumb = apagado, derecha = activo (rangeMin)
  elMin.style.background =
    `linear-gradient(to right, #E6D5B8 ${minPct}%, #C2983F ${minPct}%)`;
  // Colorea el track: izquierda = activo, derecha del thumb = apagado (rangeMax)
  elMax.style.background =
    `linear-gradient(to right, #C2983F ${maxPct}%, #E6D5B8 ${maxPct}%)`;

  const labelMin = document.getElementById('precioLabelMin');
  const labelMax = document.getElementById('precioLabelMax');
  if (labelMin) labelMin.textContent = formatearPrecio(min);
  if (labelMax) labelMax.textContent = formatearPrecio(max);
}

function parsearPrecio(str) {
  if (!str) return null;
  const n = parseInt(String(str).replace(/[^\d]/g, ''), 10);
  return isNaN(n) ? null : n;
}

function formatearPrecio(n) {
  return '₲ ' + n.toLocaleString('es-PY');
}


// ═══════════════════════════════════════════════════════════
// CARGA DE PRODUCTOS DESDE GOOGLE SHEETS
// ═══════════════════════════════════════════════════════════
async function cargarProductos() {
  mostrarCargando();

  try {
    const resp = await fetch(SHEET_URL);

    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

    const datos = await resp.json();

    if (!Array.isArray(datos)) throw new Error('Formato de datos inesperado');

    // Solo mostrar los que tengan disponible = SI
    todosLosProductos = datos.filter(p => {
      const disp = (p.disponible || '').trim().toUpperCase();
      return disp === 'SI' || disp === 'SÍ';
    });

    ocultarEstado();
    actualizarContadores();

    // Si viene con ?cat=hombre o ?cat=mujer, ir directo a esa categoría
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('cat');
    if (catParam && ['hombre', 'mujer', 'unisex'].includes(catParam)) {
      mostrarVistaProductos(catParam);
    } else {
      mostrarVistaCategorias();
    }

  } catch (err) {
    console.error('[Fly Soul] Error al cargar productos:', err);
    mostrarError();
  }
}

function mostrarCargando() {
  const estado   = document.getElementById('catalogoEstado');
  const spinner  = document.getElementById('loadingSpinner');
  const errorDiv = document.getElementById('errorState');

  estado.classList.remove('hidden');
  spinner.classList.remove('hidden');
  errorDiv.classList.add('hidden');
  document.getElementById('vistaCategorias').classList.add('hidden');
  document.getElementById('vistaProductos').classList.add('hidden');
}

function actualizarContadores() {
  ['hombre', 'mujer', 'unisex'].forEach(cat => {
    const n = todosLosProductos.filter(p =>
      (p.categoria || '').trim().toLowerCase() === cat
    ).length;
    const el = document.getElementById('count' + cat.charAt(0).toUpperCase() + cat.slice(1));
    if (el) el.textContent = n + ' producto' + (n !== 1 ? 's' : '');
  });
}

function ocultarEstado() {
  document.getElementById('catalogoEstado').classList.add('hidden');
}

function mostrarError() {
  const estado   = document.getElementById('catalogoEstado');
  const spinner  = document.getElementById('loadingSpinner');
  const errorDiv = document.getElementById('errorState');

  estado.classList.remove('hidden');
  spinner.classList.add('hidden');
  errorDiv.classList.remove('hidden');

  const btnReintentar = document.getElementById('btnReintentar');
  if (btnReintentar) {
    // Limpiar listener anterior para no acumular
    btnReintentar.replaceWith(btnReintentar.cloneNode(true));
    document.getElementById('btnReintentar').addEventListener('click', cargarProductos);
  }
}


// ═══════════════════════════════════════════════════════════
// RENDERIZADO DE TARJETAS
// ═══════════════════════════════════════════════════════════
function renderizarProductos() {
  const grid          = document.getElementById('productosGrid');
  const sinResultados = document.getElementById('sinResultados');

  let filtrados = todosLosProductos.filter(p =>
    (p.categoria || '').trim().toLowerCase() === categoriaActiva
  );

  if (textoBusqueda) {
    filtrados = filtrados.filter(p =>
      (p.nombre || '').toLowerCase().includes(textoBusqueda)
    );
  }

  // Filtro de precio (solo si el usuario lo aplicó explícitamente)
  if (precioMin > precioMinDisponible || precioMax < precioMaxDisponible) {
    filtrados = filtrados.filter(p => {
      const precio = parsearPrecio(p.precio);
      if (precio === null) return true;
      return precio >= precioMin && precio <= precioMax;
    });
  }

  if (filtrados.length === 0) {
    grid.innerHTML = '';
    sinResultados.classList.remove('hidden');
    return;
  }

  sinResultados.classList.add('hidden');
  grid.innerHTML = filtrados.map(p => crearTarjetaHTML(p)).join('');

  // Entrada escalonada de tarjetas
  grid.querySelectorAll('.producto-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(18px)';
    requestAnimationFrame(() => {
      setTimeout(() => {
        card.style.transition = 'opacity 0.45s ease, transform 0.45s ease, box-shadow 0.3s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 75);
    });
  });
}


// ═══════════════════════════════════════════════════════════
// CONSTRUCCIÓN DE HTML DE TARJETA
// ═══════════════════════════════════════════════════════════
function crearTarjetaHTML(producto) {
  const nombre      = producto.nombre      || 'Perfume sin nombre';
  const descripcion = producto.descripcion || '';
  const precio      = producto.precio      || '';
  const categoria   = (producto.categoria  || '').trim().toLowerCase();
  const fotoRaw     = (producto.foto       || '').trim();
  const destacado   = (producto.destacado  || '').trim().toUpperCase() === 'SI';

  const fotoSrc = convertirUrlDrive(fotoRaw);

  const categoriaLabel = {
    hombre: 'Hombre',
    mujer:  'Mujer',
    unisex: 'Unisex',
  }[categoria] || (categoria ? categoria : '');

  const msgWA  = encodeURIComponent(`Hola! Me interesa el perfume *${nombre}* 🌸`);
  const linkWA = `${WHATSAPP_BASE}?text=${msgWA}`;

  // ─── Imagen o placeholder ───
  const imgHTML = fotoSrc
    ? `<img
         class="producto-img"
         src="${escHtml(fotoSrc)}"
         alt="${escHtml(nombre)}"
         loading="lazy"
         onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
       <div class="producto-img-placeholder" style="display:none">
         ${svgPerfume()}
         <span>Sin imagen</span>
       </div>`
    : `<div class="producto-img-placeholder">
         ${svgPerfume()}
         <span>Foto próximamente</span>
       </div>`;

  return `
    <article class="producto-card" role="listitem">
      <div class="producto-img-wrapper">
        ${imgHTML}
        ${destacado    ? '<span class="badge-destacado">Destacado</span>' : ''}
        ${categoriaLabel ? `<span class="badge-categoria">${escHtml(categoriaLabel)}</span>` : ''}
      </div>
      <div class="producto-body">
        <h3 class="producto-nombre">${escHtml(nombre)}</h3>
        ${descripcion ? `<p class="producto-desc">${escHtml(descripcion)}</p>` : ''}
        ${precio      ? `<p class="producto-precio">${escHtml(precio)}</p>`    : ''}
      </div>
      <div class="producto-footer">
        <a href="${escHtml(linkWA)}"
           class="btn-consultar"
           target="_blank"
           rel="noopener noreferrer"
           aria-label="Consultar ${escHtml(nombre)} por WhatsApp">
          ${svgWhatsApp()}
          Consultar por WhatsApp
        </a>
      </div>
    </article>`;
}


// ═══════════════════════════════════════════════════════════
// CONVERSIÓN DE URL DE GOOGLE DRIVE → THUMBNAIL
// ═══════════════════════════════════════════════════════════
function convertirUrlDrive(url) {
  if (!url) return null;

  // Formatos comunes de Drive:
  //   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  //   https://drive.google.com/open?id=FILE_ID
  //   https://drive.google.com/uc?id=FILE_ID
  const regexFile = /\/file\/d\/([^\/\?&]+)/;
  const regexId   = /[?&]id=([^&]+)/;

  let fileId = null;
  const mFile = url.match(regexFile);
  const mId   = url.match(regexId);

  if (mFile)      fileId = mFile[1];
  else if (mId)   fileId = mId[1];

  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
  }

  // Si no es un link de Drive pero es una URL, la usamos directa
  if (/^https?:\/\//.test(url)) return url;

  return null;
}


// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

// Escapa caracteres HTML para prevenir XSS
function escHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(str).replace(/[&<>"']/g, m => map[m]);
}

// SVG inline — ícono de frasco de perfume
function svgPerfume() {
  return `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="22" width="20" height="20" rx="5" stroke="currentColor" stroke-width="2"/>
    <rect x="18" y="13" width="12" height="12" rx="2.5" stroke="currentColor" stroke-width="2"/>
    <rect x="15" y="9" width="18" height="7" rx="3.5" fill="currentColor" opacity="0.35"/>
    <path d="M14 33 Q6 28 5 19 Q14 24 14 31" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M34 33 Q42 28 43 19 Q34 24 34 31" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`;
}

// SVG inline — ícono de WhatsApp
function svgWhatsApp() {
  return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>`;
}
