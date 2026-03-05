/* ========================================
   LIGHTBOX.JS - Galeria com Lightbox (SEMANA 7-8)
   
   Funcionalidades:
   - Click na imagem abre fullscreen
   - Navegação com setas
   - Fechar com ESC ou X
   - Suporta teclado (← →)
   
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== LIGHTBOX SETUP ========== 
    
    const galleryItems = document.querySelectorAll('.gallery-item img');
    let currentImageIndex = 0;
    
    // Criar HTML do lightbox
    const lightboxHTML = `
        <div id="lightbox" class="lightbox">
            <div class="lightbox-overlay"></div>
            <div class="lightbox-container">
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-prev">❮</button>
                <img id="lightbox-image" src="" alt="">
                <button class="lightbox-next">❯</button>
                <div class="lightbox-counter">
                    <span id="lightbox-current">1</span> / <span id="lightbox-total">12</span>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightboxCurrent = document.getElementById('lightbox-current');
    const lightboxTotal = document.getElementById('lightbox-total');
    const lightboxOverlay = document.querySelector('.lightbox-overlay');
    
    // Atualizar total de imagens
    lightboxTotal.textContent = galleryItems.length;
    
    // ========== FUNÇÕES DO LIGHTBOX ========== 
    
    function openLightbox(index) {
        currentImageIndex = index;
        const img = galleryItems[currentImageIndex];
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxCurrent.textContent = currentImageIndex + 1;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    function showNext() {
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        const img = galleryItems[currentImageIndex];
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxCurrent.textContent = currentImageIndex + 1;
    }
    
    function showPrev() {
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        const img = galleryItems[currentImageIndex];
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxCurrent.textContent = currentImageIndex + 1;
    }
    
    // ========== EVENT LISTENERS ========== 
    
    // Abrir ao clicar nas imagens
    galleryItems.forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            openLightbox(index);
        });
    });
    
    // Botões de controle
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNext);
    lightboxPrev.addEventListener('click', showPrev);
    
    // Teclado
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
    
    console.log('✅ Lightbox Inicializado - ' + galleryItems.length + ' imagens');
});
