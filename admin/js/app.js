/**
 * app.js - Application bootstrap
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Handle OAuth callback
    if (window.location.search.includes('code=')) {
        const success = await Auth.handleCallback();
        if (!success) {
            UI.toast('Erro na autenticação. Tente novamente.', 'error');
        }
    }

    // Check auth
    if (!Auth.isLoggedIn()) {
        showLogin();
        return;
    }

    showAdmin();
});

function showLogin() {
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.className = 'login-page';

    const card = document.createElement('div');
    card.className = 'login-card';

    const logo = document.createElement('div');
    logo.className = 'login-logo';
    logo.textContent = 'ARPICA';

    const subtitle = document.createElement('p');
    subtitle.className = 'login-subtitle';
    subtitle.textContent = 'Painel de Administração';

    const btn = document.createElement('button');
    btn.className = 'btn btn-github';
    btn.textContent = '🔐 Entrar com GitHub';
    btn.addEventListener('click', () => Auth.login());

    const note = document.createElement('p');
    note.className = 'login-note';
    note.textContent = 'Acesso restrito a administradores autorizados.';

    card.appendChild(logo);
    card.appendChild(subtitle);
    card.appendChild(btn);
    card.appendChild(note);
    app.appendChild(card);
}

function showAdmin() {
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.className = 'admin-layout';

    const user = Auth.getUser();

    // Sidebar
    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';
    sidebar.innerHTML = `
        <div class="sidebar-header">
            <h2>ARPICA</h2>
            <span>CMS</span>
        </div>
        <nav class="sidebar-nav">
            <a href="#/" class="nav-link active">🏠 Dashboard</a>
            <a href="#/config" class="nav-link">⚙️ Configurações</a>
            <a href="#/actividades" class="nav-link">📋 Atividades</a>
            <a href="#/direcao" class="nav-link">👥 Direção</a>
            <a href="#/documentos" class="nav-link">📄 Documentos</a>
            <a href="#/noticias" class="nav-link">📰 Notícias</a>
            <a href="#/galeria" class="nav-link">🖼️ Galeria</a>
            <a href="#/paginas" class="nav-link">📝 Páginas</a>
            <a href="#/media" class="nav-link">📤 Media</a>
        </nav>
        <div class="sidebar-footer">
            <div class="sidebar-user">
                ${user && user.avatar ? `<img src="${encodeURI(user.avatar)}" alt="" class="user-avatar">` : ''}
                <span>${user ? user.name : 'Admin'}</span>
            </div>
            <button class="btn btn-small btn-logout" id="logout-btn">Sair</button>
        </div>
    `;

    // Main content
    const main = document.createElement('main');
    main.className = 'admin-main';

    const topbar = document.createElement('header');
    topbar.className = 'admin-topbar';
    topbar.innerHTML = `
        <button class="hamburger-admin" id="sidebar-toggle" aria-label="Abrir menu">☰</button>
        <a href="/" target="_blank" rel="noopener noreferrer" class="btn btn-small">🌐 Ver Site</a>
    `;

    const content = document.createElement('div');
    content.id = 'admin-content';
    content.className = 'admin-content';

    main.appendChild(topbar);
    main.appendChild(content);

    app.appendChild(sidebar);
    app.appendChild(main);

    // Events
    document.getElementById('logout-btn').addEventListener('click', () => Auth.logout());
    document.getElementById('sidebar-toggle').addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Close sidebar on link click (mobile)
    sidebar.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => sidebar.classList.remove('open'));
    });

    // Register routes
    Router.register('/', Editor.dashboard);
    Router.register('/config', Editor.configEditor);
    Router.register('/actividades', Editor.actividades);
    Router.register('/direcao', Editor.direcao);
    Router.register('/documentos', Editor.documentos);
    Router.register('/noticias', Editor.noticias);
    Router.register('/galeria', Editor.galeria);
    Router.register('/paginas', Editor.paginas);
    Router.register('/media', Editor.media);

    Router.init();
}
