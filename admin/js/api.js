/**
 * api.js - GitHub API wrapper
 * CRUD operations on repository files
 */
const API = (() => {
    const REPO = 'Karhut/site-arpica';
    const BRANCH = 'main';
    const BASE = 'https://api.github.com';

    function headers() {
        return {
            'Authorization': `Bearer ${Auth.getToken()}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        };
    }

    async function getFile(path) {
        const res = await fetch(`${BASE}/repos/${REPO}/contents/${path}?ref=${BRANCH}`, { headers: headers() });
        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error(`Erro ao ler ${path}: ${res.status}`);
        }
        const data = await res.json();
        const content = decodeURIComponent(escape(atob(data.content)));
        return { content: JSON.parse(content), sha: data.sha, path: data.path };
    }

    async function saveFile(path, content, message, sha) {
        const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2))));
        const body = {
            message: message || `Atualizar ${path}`,
            content: encoded,
            branch: BRANCH
        };
        if (sha) body.sha = sha;

        const res = await fetch(`${BASE}/repos/${REPO}/contents/${path}`, {
            method: 'PUT',
            headers: headers(),
            body: JSON.stringify(body)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || `Erro ao guardar ${path}`);
        }
        return await res.json();
    }

    async function deleteFile(path, sha, message) {
        const res = await fetch(`${BASE}/repos/${REPO}/contents/${path}`, {
            method: 'DELETE',
            headers: headers(),
            body: JSON.stringify({
                message: message || `Remover ${path}`,
                sha: sha,
                branch: BRANCH
            })
        });
        if (!res.ok) throw new Error(`Erro ao eliminar ${path}`);
        return true;
    }

    async function listFiles(path) {
        const res = await fetch(`${BASE}/repos/${REPO}/contents/${path}?ref=${BRANCH}`, { headers: headers() });
        if (!res.ok) {
            if (res.status === 404) return [];
            throw new Error(`Erro ao listar ${path}`);
        }
        const data = await res.json();
        return Array.isArray(data) ? data : [data];
    }

    async function uploadImage(path, file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    const base64 = reader.result.split(',')[1];
                    const res = await fetch(`${BASE}/repos/${REPO}/contents/${path}`, {
                        method: 'PUT',
                        headers: headers(),
                        body: JSON.stringify({
                            message: `Upload imagem: ${path}`,
                            content: base64,
                            branch: BRANCH
                        })
                    });
                    if (!res.ok) throw new Error('Erro no upload');
                    resolve(await res.json());
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    return { getFile, saveFile, deleteFile, listFiles, uploadImage };
})();
