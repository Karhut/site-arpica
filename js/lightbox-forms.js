/* ========================================
   LIGHTBOX.JS - Galeria Modal com Lightbox
   FORM-VALIDATION.JS - Validação de Formulários
   
   Semana 7-8: Interatividade Avançada
   
   ======================================== */

// ========== LIGHTBOX GALLERY ========== 

class LightboxGallery {
    constructor() {
        this.currentIndex = 0;
        this.images = [];
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.init();
    }
    
    init() {
        // Encontrar todas as imagens da galeria
        const galleryItems = document.querySelectorAll('.gallery-item img, .photo-gallery img');
        
        galleryItems.forEach((img, index) => {
            this.images.push({
                src: img.src,
                alt: img.alt
            });
            
            // Adicionar evento de clique
            img.parentElement.addEventListener('click', (e) => {
                e.preventDefault();
                this.open(index);
            });
        });
        
        // Criar modal HTML
        this.createModal();
    }
    
    createModal() {
        const modal = document.createElement('div');
        modal.id = 'lightbox-modal';
        modal.className = 'lightbox-modal';
        modal.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Fechar">&times;</button>
                
                <div class="lightbox-image-container">
                    <img id="lightbox-image" src="" alt="Galeria">
                </div>
                
                <div class="lightbox-caption" id="lightbox-caption"></div>
                
                <button class="lightbox-prev" aria-label="Anterior">&#10094;</button>
                <button class="lightbox-next" aria-label="Próxima">&#10095;</button>
                
                <div class="lightbox-counter">
                    <span id="lightbox-current">1</span> / <span id="lightbox-total">1</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const imageContainer = modal.querySelector('.lightbox-image-container');
        
        // Event listeners
        modal.querySelector('.lightbox-close').addEventListener('click', () => this.close());
        modal.querySelector('.lightbox-prev').addEventListener('click', () => this.prev());
        modal.querySelector('.lightbox-next').addEventListener('click', () => this.next());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close();
        });
        
        // Touch/Swipe para mobile
        imageContainer.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        imageContainer.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, false);
        
        // Teclado
        document.addEventListener('keydown', (e) => {
            if (modal.classList.contains('active') === false) return;
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
            if (e.key === 'Escape') this.close();
        });
        
        // Atualizar total
        document.getElementById('lightbox-total').textContent = this.images.length;
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }
    
    open(index) {
        this.currentIndex = index;
        const modal = document.getElementById('lightbox-modal');
        modal.classList.add('active');
        this.updateImage();
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        const modal = document.getElementById('lightbox-modal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateImage();
    }
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateImage();
    }
    
    updateImage() {
        const image = this.images[this.currentIndex];
        document.getElementById('lightbox-image').src = image.src;
        document.getElementById('lightbox-image').alt = image.alt;
        document.getElementById('lightbox-caption').textContent = image.alt;
        document.getElementById('lightbox-current').textContent = this.currentIndex + 1;
    }
}

// Inicializar lightbox quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.gallery-item') || document.querySelector('.photo-gallery img')) {
        new LightboxGallery();
    }
});

// ========== FORM VALIDATION ========== 

class FormValidator {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }
    
    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => this.validateForm(e, form));
            
            // Validação em tempo real
            form.querySelectorAll('input, textarea, select').forEach(field => {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('change', () => this.validateField(field));
                field.addEventListener('input', () => {
                    // Validação mais rápida enquanto o user escreve
                    if (field.classList.contains('field-invalid')) {
                        this.validateField(field);
                    }
                });
            });
        });
    }
    
    validateForm(event, form) {
        event.preventDefault();
        
        let isValid = true;
        form.querySelectorAll('input, textarea, select').forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            this.submitForm(form);
        } else {
            console.warn('⚠️ Formulário tem erros');
        }
    }
    
    validateField(field) {
        let isValid = true;
        let errorMessage = '';
        const fieldType = field.type || field.tagName.toLowerCase();
        const fieldValue = field.value.trim();
        
        // Verificações básicas - Campo obrigatório
        if (field.hasAttribute('required') && !fieldValue) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório';
        }
        // Se não é obrigatório e está vazio, é válido
        else if (!fieldValue && !field.hasAttribute('required')) {
            isValid = true;
        }
        // Validação de email
        else if (fieldType === 'email' && fieldValue) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(fieldValue)) {
                isValid = false;
                errorMessage = 'Email inválido (exemplo: user@domain.com)';
            }
        }
        // Validação de telefone
        else if (fieldType === 'tel' && fieldValue) {
            const phoneRegex = /^[0-9\s\+\-\(\)]{9,}$/;
            if (!phoneRegex.test(fieldValue)) {
                isValid = false;
                errorMessage = 'Telefone inválido (mínimo 9 dígitos)';
            }
        }
        // Validação de URL
        else if (fieldType === 'url' && fieldValue) {
            try {
                new URL(fieldValue);
            } catch (e) {
                isValid = false;
                errorMessage = 'URL inválida';
            }
        }
        // Validação de mínimo de caracteres
        else if (field.hasAttribute('minlength')) {
            const minLength = parseInt(field.getAttribute('minlength'));
            if (fieldValue.length < minLength && fieldValue.length > 0) {
                isValid = false;
                errorMessage = `Mínimo ${minLength} caracteres (atual: ${fieldValue.length})`;
            }
        }
        // Validação de máximo de caracteres
        else if (field.hasAttribute('maxlength')) {
            const maxLength = parseInt(field.getAttribute('maxlength'));
            if (fieldValue.length > maxLength) {
                isValid = false;
                errorMessage = `Máximo ${maxLength} caracteres`;
            }
        }
        // Validação de password (confirmação)
        else if (field.type === 'password' && field.name === 'password-confirm') {
            const passwordField = field.form.querySelector('input[name="password"]');
            if (passwordField && fieldValue !== passwordField.value) {
                isValid = false;
                errorMessage = 'As senhas não correspondem';
            }
        }
        // Validação de password strength
        else if (field.type === 'password' && field.name === 'password' && fieldValue) {
            const passwordStrength = this.checkPasswordStrength(fieldValue);
            if (passwordStrength < 2) {
                isValid = false;
                errorMessage = 'Senha muito fraca (use maiúsculas, números e caracteres especiais)';
            }
        }
        
        // Mostrar/esconder erro
        this.showFieldError(field, errorMessage, isValid);
        
        return isValid || fieldValue === '';
    }
    
    checkPasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        
        return strength;
    }
    
    showFieldError(field, errorMessage, isValid) {
        // Remover erro anterior
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) existingError.remove();
        
        // Adicionar classes
        if (isValid && field.value.trim()) {
            field.classList.remove('field-invalid');
            field.classList.add('field-valid');
        } else if (!isValid && field.value.trim()) {
            field.classList.remove('field-valid');
            field.classList.add('field-invalid');
            
            // Criar mensagem de erro
            const errorDiv = document.createElement('span');
            errorDiv.className = 'field-error';
            errorDiv.textContent = '❌ ' + errorMessage;
            field.parentElement.appendChild(errorDiv);
        } else {
            field.classList.remove('field-valid', 'field-invalid');
        }
    }
    
    submitForm(form) {
        // Mostrar mensagem de sucesso
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success';
        successMsg.innerHTML = '✅ <strong>Formulário enviado com sucesso!</strong><br>Entraremos em contacto em breve.';
        form.insertBefore(successMsg, form.firstChild);
        
        // Limpar formulário
        form.reset();
        form.querySelectorAll('input, textarea').forEach(field => {
            field.classList.remove('field-valid', 'field-invalid');
        });
        
        // Remover mensagem após 5 segundos
        setTimeout(() => {
            successMsg.remove();
        }, 5000);
        
        console.log('✅ Formulário enviado:', new FormData(form));
    }
}

// Inicializar validação quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('form')) {
        new FormValidator();
    }
});

console.log('✅ Lightbox + Form Validation Carregado!');
