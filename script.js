/* script.js
   Interactions : menu mobile, galerie/lightbox, validation formulaire
*/

/* --- Helpers --- */
const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));

/* --- Mobile navigation toggle --- */
const navToggle = $('#nav-toggle');
const mainNav = $('#main-nav');

navToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

/* Close mobile nav on link click (good UX) */
$$('#main-nav a').forEach(a => a.addEventListener('click', () => {
  if (mainNav.classList.contains('open')) {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
}));

/* --- Lightbox / Gallery --- */
const lightbox = $('#lightbox');
const lbContent = $('#lb-content');
const lbCaption = $('#lb-caption');
const lbClose = $('#lb-close');

function openLightbox({type, src, title}){
  lbContent.innerHTML = ''; lbCaption.textContent = '';
  if (type === 'video') {
    // Embed YouTube responsibly (no autoplay)
    const iframe = document.createElement('iframe');
    iframe.src = src.replace('watch?v=','embed/'); // basic conversion for youtube links
    iframe.setAttribute('allowfullscreen','');
    iframe.setAttribute('frameborder','0');
    lbContent.appendChild(iframe);
    lbCaption.textContent = title ?? '';
  } else {
    const img = document.createElement('img');
    img.src = src;
    img.alt = title ?? 'Visuel';
    lbContent.appendChild(img);
    lbCaption.textContent = title ?? '';
  }
  lightbox.setAttribute('aria-hidden','false');
  // focus for accessibility
  lbContent.focus();
}

function closeLightbox(){
  lightbox.setAttribute('aria-hidden','true');
  lbContent.innerHTML='';
  lbCaption.textContent='';
}

/* Open when clicking a film-card */
$$('.film-card').forEach(card => {
  card.addEventListener('click', () => {
    const type = card.dataset.type || 'image';
    const src = card.dataset.src;
    const title = card.querySelector('figcaption h4')?.textContent || '';
    if (!src) return;
    openLightbox({type, src, title});
  });
});

/* Close handlers */
lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e)=> {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e)=>{
  if (e.key === 'Escape') closeLightbox();
});

/* --- Simple contact form validation + fake submit --- */
const form = $('#contact-form');
const formMsg = $('#form-msg');

if(form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    formMsg.textContent = '';
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    // Basic validation
    if(name.length < 2){ formMsg.textContent = 'Veuillez indiquer un nom valide.'; form.name.focus(); return; }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ formMsg.textContent = 'Veuillez indiquer une adresse email valide.'; form.email.focus(); return; }
    if(message.length < 10){ formMsg.textContent = 'Un message plus long est requis (min 10 caractères).'; form.message.focus(); return; }

    // Simulate sending (replace by real endpoint when available)
    formMsg.style.color = 'var(--gold)';
    formMsg.textContent = 'Envoi en cours…';
    // For demo we just set a timeout to simulate a network request
    setTimeout(()=>{
      formMsg.style.color = 'lightgreen';
      formMsg.textContent = 'Merci — votre message a bien été envoyé. Nous revenons vers vous rapidement.';
      form.reset();
    }, 900);
  });
}

/* --- Small UI improvements --- */
// Set current year in footer
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* Smooth scroll for internal links */
$$('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const targetId = a.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

/* Fade-in on scroll (simple) */
const faders = $$('section, .card, .member-card, .event-card');
const appearOnScroll = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
      obs.unobserve(entry.target);
    }
  });
}, {threshold:0.1});

faders.forEach(f => {
  f.style.opacity = 0;
  f.style.transform = 'translateY(10px)';
  f.style.transition = 'opacity 600ms ease, transform 600ms ease';
  appearOnScroll.observe(f);
});
