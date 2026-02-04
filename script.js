// Utilitários
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

$('#ano').textContent = new Date().getFullYear();

// Header scroll
window.addEventListener('scroll', () => {
  $('#header').classList.toggle('scrolled', window.scrollY > 50);
});

// ========================================
// MENU MOBILE HAMBÚRGUER
// ========================================
const mobileMenuBtn = $('#mobileMenuBtn');
const mainNav = $('#mainNav');
let menuOverlay = null;

// Criar overlay para fechar menu ao clicar fora
function createMenuOverlay() {
  if (!menuOverlay) {
    menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    document.body.appendChild(menuOverlay);
    
    menuOverlay.addEventListener('click', closeMobileMenu);
  }
}

function openMobileMenu() {
  createMenuOverlay();
  mainNav.classList.add('active');
  menuOverlay.classList.add('active');
  mobileMenuBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mainNav.classList.remove('active');
  if (menuOverlay) {
    menuOverlay.classList.remove('active');
  }
  mobileMenuBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

mobileMenuBtn.addEventListener('click', () => {
  const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
  if (isExpanded) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

// Fechar menu ao clicar em um link
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    closeMobileMenu();
  });
});

// Fechar menu ao redimensionar para desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    closeMobileMenu();
  }
});

// Fechar menu com tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mainNav.classList.contains('active')) {
    closeMobileMenu();
  }
});

// Smooth scroll
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href && href !== '#') {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// ========================================
// TOGGLE DE TEMA DARK/LIGHT
// ========================================
const themeToggle = $('#themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Carregar tema salvo ou usar preferência do sistema
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (!prefersDark.matches) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

loadTheme();

// Toggle do tema
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// ========================================
// WHATSAPP FLUTUANTE
// ========================================
const whatsappBtn = $('#whatsappBtn');
const whatsappChat = $('#whatsappChat');
const chatClose = $('#chatClose');

function openWhatsappChat() {
  whatsappChat.classList.add('active');
  whatsappBtn.setAttribute('aria-expanded', 'true');
}

function closeWhatsappChat() {
  whatsappChat.classList.remove('active');
  whatsappBtn.setAttribute('aria-expanded', 'false');
}

whatsappBtn.addEventListener('click', () => {
  const isExpanded = whatsappBtn.getAttribute('aria-expanded') === 'true';
  if (isExpanded) {
    closeWhatsappChat();
  } else {
    openWhatsappChat();
  }
});

chatClose.addEventListener('click', () => {
  closeWhatsappChat();
});

// Fechar chat ao clicar fora
document.addEventListener('click', (e) => {
  if (!e.target.closest('.whatsapp-float')) {
    closeWhatsappChat();
  }
});

// Fechar chat com tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && whatsappChat.classList.contains('active')) {
    closeWhatsappChat();
  }
});

// ========================================
// TOAST
// ========================================
function showToast(title, msg) {
  $('#toastTitle').textContent = title;
  $('#toastMsg').textContent = msg;
  $('#toast').classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => $('#toast').classList.remove('show'), 4000);
}
$('#toastClose').onclick = () => $('#toast').classList.remove('show');

// ========================================
// FORMULÁRIO
// ========================================
const form = $('#formContato');
const validPhone = v => v.replace(/\D/g, '').length >= 10;
const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v);

function setErr(id, show) {
  $(id).classList.toggle('show', show);
}

$('#btnDemo').onclick = () => {
  $('#nome').value = 'Maria Silva';
  $('#tel').value = '(43) 98765-4321';
  $('#email').value = 'maria@email.com';
  $('#assunto').value = 'Orçamento de lentes';
  $('#msg').value = 'Olá, gostaria de saber valores para lentes multifocais com antirreflexo. Obrigada.';
  showToast('Exemplo preenchido', 'Clique em enviar para testar');
};

form.onsubmit = async e => {
  e.preventDefault();
  
  const nome = $('#nome').value.trim();
  const tel = $('#tel').value.trim();
  const email = $('#email').value.trim();
  const assunto = $('#assunto').value.trim();
  const msg = $('#msg').value.trim();

  const errs = {
    nome: nome.length < 2,
    tel: !validPhone(tel),
    email: !validEmail(email),
    assunto: assunto.length < 3,
    msg: msg.length < 10
  };

  setErr('#errNome', errs.nome);
  setErr('#errTel', errs.tel);
  setErr('#errEmail', errs.email);
  setErr('#errAssunto', errs.assunto);
  setErr('#errMsg', errs.msg);

  if (Object.values(errs).some(Boolean)) {
    showToast('Atenção', 'Verifique os campos destacados');
    return;
  }

  form.querySelector('button[type="submit"]').disabled = true;
  await new Promise(r => setTimeout(r, 800));
  form.reset();
  form.querySelector('button[type="submit"]').disabled = false;
  showToast('Mensagem enviada', 'Retornaremos em breve');
};