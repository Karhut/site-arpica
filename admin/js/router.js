/**
 * router.js - Simple hash-based SPA router
 */
const Router = (() => {
    const routes = {};
    let contentEl = null;

    function register(path, handler) {
        routes[path] = handler;
    }

    function navigate(path) {
        window.location.hash = path;
    }

    function getCurrentRoute() {
        return window.location.hash.slice(1) || '/';
    }

    async function render() {
        const path = getCurrentRoute();
        contentEl = contentEl || document.getElementById('admin-content');
        if (!contentEl) return;

        // Update active nav
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + path);
        });

        const handler = routes[path] || routes['/'];
        if (handler) {
            UI.loading(true);
            try {
                await handler(contentEl);
            } catch (err) {
                contentEl.innerHTML = '';
                const errDiv = document.createElement('div');
                errDiv.className = 'error-state';
                errDiv.textContent = 'Erro ao carregar: ' + err.message;
                contentEl.appendChild(errDiv);
                console.error(err);
            }
            UI.loading(false);
        }
    }

    function init() {
        window.addEventListener('hashchange', render);
        if (!window.location.hash) window.location.hash = '/';
        else render();
    }

    return { register, navigate, init, getCurrentRoute };
})();
