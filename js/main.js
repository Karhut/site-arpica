/* ========================================
   MAIN.JS - Funcionalidades Principais

   - Menu hamburger (mobile)
   - Scroll suave para âncoras
   - Header sticky com sombra
   - Animações de scroll
   - Carregamento de dados do siteinfo.json

   ======================================== */

// ========== MENU HAMBURGER ==========

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isActive = hamburger.classList.contains('active');
            
            if (isActive) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            } else {
                hamburger.classList.add('active');
                navMenu.classList.add('active');
                hamburger.setAttribute('aria-expanded', 'true');
                body.style.overflow = 'hidden';
            }
        });

        // Fechar menu ao clicar num link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                body.style.overflow = '';
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }
});

// ========== SCROLL SUAVE PARA ÂNCORAS ==========

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignorar se for apenas "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerOffset = 80; // Altura do header
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// ========== HEADER STICKY COM SOMBRA ==========

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    
    if (header) {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Adicionar sombra quando faz scroll
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }
});

// ========== ANIMAÇÕES DE SCROLL (FADE-IN) ==========

document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Selecionar elementos para animar
    const elementsToAnimate = document.querySelectorAll(
        '.activity-card, .help-card, .gallery-item, .featured-activities, .about-summary'
    );

    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ========== CARREGAR DADOS DO SITEINFO ==========

async function loadSiteInfo() {
    try {
        const response = await fetch('_data/siteinfo.json');
        const data = await response.json();
        
        // Atualizar elementos com a classe .siteinfo-[campo]
        const fields = {
            'institution_name': ['text', 'title'],
            'address': ['text'],
            'phone': ['text', 'href'],
            'email': ['text', 'href'],
            'facebook': ['href'],
            'hours_weekday': ['text'],
            'hours_saturday': ['text'],
            'hours_sunday': ['text']
        };

        for (const [field, selectors] of Object.entries(fields)) {
            selectors.forEach(selectorType => {
                const elements = document.querySelectorAll(`[data-siteinfo="${field}"]`);
                elements.forEach(el => {
                    if (selectorType === 'text') {
                        el.textContent = data[field];
                    } else if (selectorType === 'href') {
                        if (field === 'phone') {
                            el.href = `tel:${data[field].replace(/\s/g, '')}`;
                        } else if (field === 'email') {
                            el.href = `mailto:${data[field]}`;
                        } else {
                            el.href = data[field];
                        }
                    }
                });
            });
        }
        
        console.log('SiteInfo carregado com sucesso:', data);
    } catch (error) {
        console.warn('Não foi possível carregar siteinfo.json:', error);
    }
}

// Carregar dados quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', loadSiteInfo);

// ========== FORMULÁRIO DE CONTACTO (Netlify Forms) ==========

document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form[data-netlify="true"]');
    
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'A enviar...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(new FormData(form)).toString()
                });
                
                if (response.ok) {
                    const msg = document.createElement('div');
                    msg.className = 'form-success';
                    msg.textContent = '✅ Mensagem enviada com sucesso! Entraremos em contacto em breve.';
                    form.parentNode.insertBefore(msg, form.nextSibling);
                    form.reset();
                    setTimeout(() => msg.remove(), 8000);
                } else {
                    throw new Error('Erro no envio');
                }
            } catch (err) {
                const msg = document.createElement('div');
                msg.className = 'form-error';
                msg.textContent = '❌ Erro ao enviar. Por favor tente novamente ou contacte-nos por telefone.';
                form.parentNode.insertBefore(msg, form.nextSibling);
                setTimeout(() => msg.remove(), 8000);
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    });
});

// ========== UTILITÁRIOS ==========

/**
 * Formatar número de telefone português
 */
function formatPhone(phone) {
    return phone.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3');
}

/**
 * Verificar se está em dispositivo mobile
 */
function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * Smooth scroll para elemento específico
 */
function scrollToElement(selector, offset = 80) {
    const element = document.querySelector(selector);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Exportar utilitários para uso global
window.siteUtils = {
    formatPhone,
    isMobile,
    scrollToElement,
    loadSiteInfo
};
