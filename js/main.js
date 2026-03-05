/* ========================================
   MAIN.JS - JavaScript Principal + AVANÇADO (SEMANA 5-6+)
   
   Funcionalidades:
   - Menu burger funcional
   - Parallax ao scroll
   - Fade-in ao scroll (Intersection Observer)
   - Dark mode toggle
   - Smooth scroll
   
   ======================================== */

// ========== PARALLAX EFFECT ========== 

window.addEventListener('scroll', () => {
    const parallaxElements = document.querySelectorAll('.hero');
    parallaxElements.forEach(element => {
        let scrollPosition = window.pageYOffset;
        element.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
    });
});

// ========== MENU BURGER + ACTIVE STATE ========== 

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Toggle menu ao clicar no hamburger
    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            navbar.classList.toggle('active');
        });
    }
    
    // Fechar menu ao clicar num link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navbar.classList.remove('active');
        });
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.header')) {
            navbar.classList.remove('active');
        }
    });
    
    // ========== HIGHLIGHT MENU ITEM ATUAL ========== 
    function updateActiveMenu() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
    
    updateActiveMenu();
    window.addEventListener('hashchange', updateActiveMenu);
});

// ========== SMOOTH SCROLL ========== 

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== SCROLL TO TOP BUTTON ========== 

document.addEventListener('DOMContentLoaded', () => {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.id = 'scroll-to-top';
    scrollTopBtn.innerHTML = '▲';
    scrollTopBtn.title = 'Voltar ao topo';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: var(--cor-secundaria);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        z-index: 999;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
    `;

    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollTopBtn.addEventListener('mouseover', () => {
        scrollTopBtn.style.transform = 'scale(1.1)';
        scrollTopBtn.style.backgroundColor = '#d63728';
    });

    scrollTopBtn.addEventListener('mouseout', () => {
        scrollTopBtn.style.transform = 'scale(1)';
        scrollTopBtn.style.backgroundColor = 'var(--cor-secundaria)';
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.card, section').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.6s ease';
    observer.observe(element);
});

// ========== DARK MODE TOGGLE ========== 

function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // Verificar preferência guardada
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.documentElement.style.colorScheme = 'dark';
    }
    
    // Toggle ao clicar (se houver botão)
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            const currentDarkMode = localStorage.getItem('darkMode') === 'true';
            localStorage.setItem('darkMode', !currentDarkMode);
            document.documentElement.style.colorScheme = !currentDarkMode ? 'dark' : 'light';
            darkModeToggle.innerHTML = !currentDarkMode ? '☀️' : '🌙';
        });
    }
}

// Inicializar dark mode ao carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
    initDarkMode();
}

// ========== SCROLL ANIMATIONS - Parallax Text ========== 

document.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroElements = document.querySelectorAll('.hero h1, .hero-subtitle');
    
    heroElements.forEach((element, index) => {
        element.style.transform = `translateY(${scrollY * (0.3 + index * 0.1)}px)`;
    });
});

// ========== PERFORMANCE - Lazy Loading Images ========== 

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ========== CONSOLE ========== 

console.log('✅ Site ARPICA - JavaScript Avançado Pronto!');
console.log('✨ Features: Parallax + Dark Mode + Smooth Scroll + Animations');
