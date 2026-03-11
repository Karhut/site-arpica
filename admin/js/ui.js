/**
 * ui.js - UI components (toasts, modals, loading)
 */
const UI = (() => {
    function toast(message, type = 'success') {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const el = document.createElement('div');
        el.className = `toast toast-${type}`;
        el.textContent = message;
        document.body.appendChild(el);
        requestAnimationFrame(() => el.classList.add('show'));
        setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 4000);
    }

    function confirm(message) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.innerHTML = '';

            const modal = document.createElement('div');
            modal.className = 'modal-confirm';

            const p = document.createElement('p');
            p.textContent = message;
            modal.appendChild(p);

            const actions = document.createElement('div');
            actions.className = 'modal-actions';

            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'btn btn-secondary';
            cancelBtn.textContent = 'Cancelar';
            cancelBtn.onclick = () => { overlay.remove(); resolve(false); };

            const confirmBtn = document.createElement('button');
            confirmBtn.className = 'btn btn-danger';
            confirmBtn.textContent = 'Confirmar';
            confirmBtn.onclick = () => { overlay.remove(); resolve(true); };

            actions.appendChild(cancelBtn);
            actions.appendChild(confirmBtn);
            modal.appendChild(actions);
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
        });
    }

    function loading(show) {
        let el = document.getElementById('loading-overlay');
        if (show) {
            if (!el) {
                el = document.createElement('div');
                el.id = 'loading-overlay';
                el.className = 'loading-overlay';
                const spinner = document.createElement('div');
                spinner.className = 'spinner';
                el.appendChild(spinner);
                document.body.appendChild(el);
            }
            el.style.display = 'flex';
        } else if (el) {
            el.style.display = 'none';
        }
    }

    return { toast, confirm, loading };
})();
