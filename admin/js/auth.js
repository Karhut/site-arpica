/**
 * auth.js - GitHub OAuth Authentication
 * Handles login/logout flow and session management
 */
const Auth = (() => {
    const STORAGE_KEY = 'arpica_gh_token';
    const USER_KEY = 'arpica_gh_user';

    function getClientId() {
        // Read from meta tag or fallback
        const meta = document.querySelector('meta[name="github-client-id"]');
        return meta ? meta.content : '';
    }

    function getToken() {
        return sessionStorage.getItem(STORAGE_KEY);
    }

    function getUser() {
        const data = sessionStorage.getItem(USER_KEY);
        return data ? JSON.parse(data) : null;
    }

    function isLoggedIn() {
        return !!getToken();
    }

    function login() {
        const clientId = getClientId();
        if (!clientId) {
            console.error('GitHub Client ID não configurado');
            return;
        }
        const redirectUri = window.location.origin + '/admin/';
        const scope = 'repo';
        const state = crypto.randomUUID();
        sessionStorage.setItem('oauth_state', state);
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
    }

    async function handleCallback() {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');

        if (!code) return false;

        const savedState = sessionStorage.getItem('oauth_state');
        if (state !== savedState) {
            console.error('OAuth state mismatch');
            return false;
        }
        sessionStorage.removeItem('oauth_state');

        try {
            const response = await fetch('/.netlify/functions/github-oauth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            sessionStorage.setItem(STORAGE_KEY, data.access_token);

            // Fetch user info
            const userRes = await fetch('https://api.github.com/user', {
                headers: { 'Authorization': `Bearer ${data.access_token}` }
            });
            const user = await userRes.json();
            sessionStorage.setItem(USER_KEY, JSON.stringify({
                login: user.login,
                name: user.name || user.login,
                avatar: user.avatar_url
            }));

            // Clean URL
            window.history.replaceState({}, '', '/admin/');
            return true;
        } catch (err) {
            console.error('OAuth error:', err);
            return false;
        }
    }

    function logout() {
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(USER_KEY);
        window.location.reload();
    }

    return { getToken, getUser, isLoggedIn, login, handleCallback, logout };
})();
