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
                body.style.overflow = '';
            } else {
                hamburger.classList.add('active');
                navMenu.classList.add('active');
                body.style.overflow = 'hidden'; // Previne scroll quando menu está aberto
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

// ========== FORMULÁRIO DE CONTACTO ==========

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('#contact-form, .contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validação básica
            if (!data.nome || !data.email || !data.mensagem) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('Por favor, insira um email válido.');
                return;
            }
            
            // Simular envio (substituir por backend real)
            console.log('Dados do formulário:', data);
            
            // Mostrar mensagem de sucesso
            alert('Obrigado pelo seu contacto! Respondemos em breve.');
            contactForm.reset();
        });
    }
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
