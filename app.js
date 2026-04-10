const WHATSAPP_NUMBER = "5491139190499";
const BRAND_NAME = "GG3D";

const grid       = document.getElementById("grid");
const emptyState = document.getElementById("emptyState");
const filters    = document.querySelectorAll(".filter");
const modal      = document.getElementById("modal");
const year       = document.getElementById("year");

const modalTitle = document.getElementById("modalTitle");
const modalDesc  = document.getElementById("modalDesc");
const modalImg   = document.getElementById("modalImg");
const modalCat   = document.getElementById("modalCat");
const modalPers  = document.getElementById("modalPers");
const modalPrice = document.getElementById("modalPrice");
const modalWpp   = document.getElementById("modalWpp");

const ctaTop      = document.getElementById("ctaTop");
const ctaHero     = document.getElementById("ctaHero");
const ctaContact  = document.getElementById("ctaContact");
const ctaEmpty    = document.getElementById("ctaEmpty");
const ctaWorksWpp = document.getElementById("ctaWorksWpp");
const wppFloat    = document.getElementById("wppFloat");

if (year) year.textContent = new Date().getFullYear();

function catLabel(cat){
  const map = {
    llaveros:    "Llaveros",
    cuadros:     "Cuadros",
    senaladores: "Señaladores",
    funcionales: "Objetos funcionales",
    decorativas: "Piezas decorativas",
    juegos:      "Juegos",
    articulados: "Articulados",
  };
  return map[cat] || cat;
}

function wppLink(message){
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function baseMessage(){
  return `Hola GG3D! 👋
Quiero consultar por un producto del catálogo.

• Categoría: ______
• Producto: ______
• Personalización (si aplica): ______
• Zona/entrega: ______
• Para cuándo: ______`;
}

function productMessage(p){
  return `Hola GG3D! 👋
Quiero pedir:
• Producto: ${p.name}
• Precio: ${p.price ? "$"+p.price : "Consultar"}
• Personalización: ${p.personalization}

Necesito:
• Color: ______
• Texto/nombre: ______
• Zona/entrega: ______
• Para cuándo: ______`;
}

function render(products){
  grid.innerHTML = "";

  if(products.length === 0){
    emptyState.style.display = "flex";
    grid.style.display = "none";
    return;
  }

  emptyState.style.display = "none";
  grid.style.display = "grid";

  products.forEach((p, i) => {
    const card = document.createElement("article");
    card.className = "card";
    card.style.animationDelay = `${i * 60}ms`;

    const priceHTML = p.price
      ? `<div class="card__price">$${p.price.toLocaleString("es-AR")}</div>`
      : `<div class="card__price" style="color:var(--dark);opacity:.5">Consultar precio</div>`;

    card.innerHTML = `
      <img class="card__img" src="${p.image}" alt="${p.name}" loading="lazy">
      <div class="card__body">
        <h3 class="card__title">${p.name}</h3>
        <p class="card__desc">${p.description}</p>
        ${priceHTML}
        <div class="badges">
          <span class="badge">${catLabel(p.category)}</span>
          ${p.tags?.includes("Premio") || p.tags?.includes("Premium") ? '<span class="badge badge--hot">⭐ Premium</span>' : ""}
        </div>
        <div class="card__actions">
          <button class="btn btn--ghost" data-open="${p.id}">Ver detalle</button>
          <a class="btn btn--primary" href="${wppLink(productMessage(p))}">Pedir</a>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function setActiveFilter(btn){
  filters.forEach(b => b.classList.remove("is-active"));
  btn.classList.add("is-active");
}

function applyFilter(filter){
  if(filter === "all") return window.PRODUCTS;
  return window.PRODUCTS.filter(p => p.category === filter);
}

function openModal(product){
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  modalTitle.textContent = product.name;
  modalDesc.textContent  = product.description;
  modalImg.src           = product.image;
  modalImg.alt           = product.name;
  modalCat.textContent   = catLabel(product.category);
  modalPers.textContent  = product.personalization;
  modalPrice.textContent = product.price ? `$${product.price.toLocaleString("es-AR")}` : "Consultar";
  modalWpp.href = wppLink(`Hola GG3D! 👋
Quiero pedir:
• Producto: ${product.name}
• Precio: ${product.price ? "$"+product.price : "Consultar"}
• Personalización: ${product.personalization}

¿Me confirmás disponibilidad y tiempo?
• Color: ______
• Texto/nombre: ______
• Zona/entrega: ______
• Para cuándo: ______`);
}

function closeModal(){
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden","true");
}

// Filter clicks
filters.forEach(btn => {
  btn.addEventListener("click", () => {
    setActiveFilter(btn);
    render(applyFilter(btn.dataset.filter));
  });
});

// Card open / modal close via data attributes
document.addEventListener("click", e => {
  const openId = e.target?.dataset?.open;
  if(openId){
    const p = window.PRODUCTS.find(x => x.id === openId);
    if(p) openModal(p);
  }
  if(e.target?.dataset?.close !== undefined) closeModal();
});

document.addEventListener("keydown", e => {
  if(e.key === "Escape") closeModal();
});

// Set all WhatsApp links
const baseLink = wppLink(baseMessage());
if(ctaTop)      ctaTop.href      = baseLink;
if(ctaHero)     ctaHero.href     = baseLink;
if(ctaContact)  ctaContact.href  = baseLink;
if(ctaEmpty)    ctaEmpty.href    = baseLink;
if(ctaWorksWpp) ctaWorksWpp.href = wppLink(`Hola GG3D! 👋 Quiero consultar por un proyecto o trabajo a medida.

• Descripción de lo que necesito: ______
• Cantidad aproximada: ______
• Zona: ______`);
if(wppFloat)    wppFloat.href    = baseLink;

// Hero random product
function setRandomHeroProduct(){
  if(!window.PRODUCTS?.length) return;
  const product = window.PRODUCTS[Math.floor(Math.random() * window.PRODUCTS.length)];
  const heroImage = document.getElementById("heroImage");
  const heroPrice = document.getElementById("heroPrice");
  const heroName  = document.getElementById("heroName");
  const heroCard  = document.querySelector(".mockCard--image");

  if(heroImage){ heroImage.src = product.image; heroImage.alt = product.name; }
  if(heroPrice) heroPrice.textContent = product.price ? `Desde $${product.price.toLocaleString("es-AR")}` : "Consultar";
  if(heroName)  heroName.textContent  = product.name;
  if(heroCard){
    heroCard.onclick = () => window.open(wppLink(productMessage(product)), "_blank");
  }
}

// Nav toggle
const navToggle = document.getElementById("navToggle");
const nav       = document.getElementById("nav");
if(navToggle && nav){
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded","false");
    });
  });
}

// Init
render(window.PRODUCTS);
setRandomHeroProduct();