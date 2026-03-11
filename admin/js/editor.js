/**
 * editor.js - Content editors for all CMS sections
 */
const Editor = (() => {

    // ===== HELPERS =====
    function el(tag, attrs = {}, children = []) {
        const e = document.createElement(tag);
        Object.entries(attrs).forEach(([k, v]) => {
            if (k === 'className') e.className = v;
            else if (k === 'textContent') e.textContent = v;
            else if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v);
            else e.setAttribute(k, v);
        });
        children.forEach(c => {
            if (typeof c === 'string') e.appendChild(document.createTextNode(c));
            else if (c) e.appendChild(c);
        });
        return e;
    }

    function formGroup(label, input) {
        return el('div', { className: 'form-group' }, [
            el('label', { textContent: label }),
            input
        ]);
    }

    function textInput(name, value = '', placeholder = '', type = 'text') {
        const input = el('input', { type, name, value, placeholder, className: 'form-input' });
        return input;
    }

    function textArea(name, value = '', placeholder = '', rows = 5) {
        const ta = el('textarea', { name, placeholder, className: 'form-input', rows: String(rows) });
        ta.value = value;
        return ta;
    }

    function selectInput(name, options, selected = '') {
        const select = el('select', { name, className: 'form-input' });
        options.forEach(opt => {
            const o = el('option', { value: opt.value || opt, textContent: opt.label || opt });
            if ((opt.value || opt) === selected) o.selected = true;
            select.appendChild(o);
        });
        return select;
    }

    function getFormData(form) {
        const data = {};
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.name) data[input.name] = input.value;
        });
        return data;
    }

    // ===== DASHBOARD =====
    async function dashboard(container) {
        container.innerHTML = '';
        const user = Auth.getUser();

        const header = el('div', { className: 'page-header' }, [
            el('h1', { textContent: `Bem-vindo, ${user ? user.name : 'Administrador'}` }),
            el('p', { textContent: 'Painel de administração do site ARPICA', className: 'text-muted' })
        ]);
        container.appendChild(header);

        const grid = el('div', { className: 'dashboard-grid' });

        const sections = [
            { icon: '⚙️', title: 'Configurações', desc: 'Informações do site', route: '/config' },
            { icon: '📋', title: 'Atividades', desc: 'Serviços e respostas sociais', route: '/actividades' },
            { icon: '👥', title: 'Direção', desc: 'Órgãos sociais', route: '/direcao' },
            { icon: '📄', title: 'Documentos', desc: 'Documentos institucionais', route: '/documentos' },
            { icon: '📰', title: 'Notícias', desc: 'Notícias e eventos', route: '/noticias' },
            { icon: '🖼️', title: 'Galeria', desc: 'Fotografias', route: '/galeria' },
            { icon: '📝', title: 'Páginas', desc: 'Sobre e Voluntariado', route: '/paginas' },
            { icon: '🖼️', title: 'Media', desc: 'Gerir imagens', route: '/media' }
        ];

        sections.forEach(s => {
            const card = el('div', { className: 'dashboard-card', onClick: () => Router.navigate(s.route) }, [
                el('div', { className: 'dashboard-card-icon', textContent: s.icon }),
                el('h3', { textContent: s.title }),
                el('p', { textContent: s.desc, className: 'text-muted' })
            ]);
            grid.appendChild(card);
        });

        container.appendChild(grid);
    }

    // ===== CONFIG EDITOR =====
    async function configEditor(container) {
        container.innerHTML = '';
        container.appendChild(el('div', { className: 'page-header' }, [
            el('h1', { textContent: '⚙️ Configurações do Site' })
        ]));

        const file = await API.getFile('_data/siteinfo.json');
        if (!file) { container.appendChild(el('p', { textContent: 'Ficheiro não encontrado.', className: 'error-state' })); return; }

        const data = file.content;
        const form = el('form', { className: 'editor-form' });

        const fields = [
            ['institution_name', 'Nome da Instituição'],
            ['description', 'Descrição'],
            ['address', 'Morada'],
            ['postal_code', 'Código Postal'],
            ['city', 'Cidade'],
            ['phone', 'Telefone'],
            ['email', 'Email'],
            ['facebook', 'Facebook URL'],
            ['hours_weekday', 'Horário (2ª-6ª)'],
            ['hours_saturday', 'Horário (Sábado)'],
            ['hours_sunday', 'Horário (Domingo)']
        ];

        fields.forEach(([key, label]) => {
            form.appendChild(formGroup(label, textInput(key, data[key] || '', label)));
        });

        const saveBtn = el('button', { type: 'submit', className: 'btn btn-primary', textContent: '💾 Guardar' });
        form.appendChild(saveBtn);

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            saveBtn.disabled = true;
            saveBtn.textContent = 'A guardar...';
            try {
                const formData = getFormData(form);
                await API.saveFile('_data/siteinfo.json', formData, 'Atualizar configurações do site', file.sha);
                UI.toast('Configurações guardadas com sucesso!');
                file.sha = (await API.getFile('_data/siteinfo.json')).sha;
            } catch (err) {
                UI.toast('Erro: ' + err.message, 'error');
            }
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Guardar';
        });

        container.appendChild(form);
    }

    // ===== GENERIC LIST + EDIT for JSON collections =====
    async function collectionEditor(container, config) {
        container.innerHTML = '';
        container.appendChild(el('div', { className: 'page-header' }, [
            el('h1', { textContent: config.title }),
            config.canCreate ? el('button', {
                className: 'btn btn-primary',
                textContent: '+ Novo',
                onClick: () => showItemForm(container, config, null)
            }) : null
        ]));

        let items, sha;

        if (config.folder) {
            // Multiple files in a folder
            const files = await API.listFiles(config.folder);
            const jsonFiles = files.filter(f => f.name.endsWith('.json'));
            items = [];
            for (const f of jsonFiles) {
                const fileData = await API.getFile(f.path);
                if (fileData) {
                    items.push({ ...fileData.content, _path: f.path, _sha: fileData.sha, _filename: f.name });
                }
            }
        } else {
            // Single file with array
            const file = await API.getFile(config.file);
            if (!file) { container.appendChild(el('p', { textContent: 'Sem dados.', className: 'empty-state' })); return; }
            sha = file.sha;
            items = Array.isArray(file.content) ? file.content.map((item, i) => ({ ...item, _index: i })) : [file.content];
        }

        if (items.length === 0) {
            container.appendChild(el('p', { textContent: 'Ainda não existem itens.', className: 'empty-state' }));
            return;
        }

        const list = el('div', { className: 'items-list' });
        items.forEach((item, idx) => {
            const title = item[config.titleField] || item.name || item.title || `Item ${idx + 1}`;
            const subtitle = item[config.subtitleField] || '';

            const card = el('div', { className: 'item-card' }, [
                el('div', { className: 'item-info' }, [
                    el('h3', { textContent: title }),
                    subtitle ? el('p', { textContent: subtitle, className: 'text-muted' }) : null
                ]),
                el('div', { className: 'item-actions' }, [
                    el('button', {
                        className: 'btn btn-small',
                        textContent: '✏️ Editar',
                        onClick: () => showItemForm(container, config, item, sha)
                    }),
                    config.canDelete ? el('button', {
                        className: 'btn btn-small btn-danger',
                        textContent: '🗑️',
                        onClick: async () => {
                            if (await UI.confirm(`Eliminar "${title}"?`)) {
                                try {
                                    if (item._path) {
                                        await API.deleteFile(item._path, item._sha, `Remover ${title}`);
                                    } else {
                                        const file = await API.getFile(config.file);
                                        const arr = file.content;
                                        arr.splice(item._index, 1);
                                        await API.saveFile(config.file, arr, `Remover ${title}`, file.sha);
                                    }
                                    UI.toast(`"${title}" eliminado.`);
                                    collectionEditor(container, config);
                                } catch (err) {
                                    UI.toast('Erro: ' + err.message, 'error');
                                }
                            }
                        }
                    }) : null
                ])
            ]);
            list.appendChild(card);
        });
        container.appendChild(list);
    }

    function showItemForm(container, config, item, collectionSha) {
        container.innerHTML = '';
        const isNew = !item;
        container.appendChild(el('div', { className: 'page-header' }, [
            el('button', { className: 'btn btn-secondary', textContent: '← Voltar', onClick: () => collectionEditor(container, config) }),
            el('h1', { textContent: isNew ? `Novo ${config.itemName}` : `Editar ${config.itemName}` })
        ]));

        const form = el('form', { className: 'editor-form' });

        config.fields.forEach(f => {
            let input;
            const value = item ? (item[f.name] || '') : (f.default || '');

            if (f.type === 'textarea') {
                input = textArea(f.name, value, f.placeholder || '', f.rows || 5);
            } else if (f.type === 'select') {
                input = selectInput(f.name, f.options, value);
            } else if (f.type === 'list') {
                input = textArea(f.name, Array.isArray(value) ? value.join('\n') : value, 'Um item por linha', 4);
            } else {
                input = textInput(f.name, value, f.placeholder || '', f.type || 'text');
            }

            form.appendChild(formGroup(f.label, input));
        });

        if (config.folder && isNew) {
            form.appendChild(formGroup('Nome do ficheiro (sem .json)', textInput('_filename', '', 'ex: centro-convivio')));
        }

        const saveBtn = el('button', { type: 'submit', className: 'btn btn-primary', textContent: '💾 Guardar' });
        form.appendChild(saveBtn);

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            saveBtn.disabled = true;
            saveBtn.textContent = 'A guardar...';

            try {
                const formData = getFormData(form);

                // Convert list fields
                config.fields.forEach(f => {
                    if (f.type === 'list' && formData[f.name]) {
                        formData[f.name] = formData[f.name].split('\n').map(s => s.trim()).filter(Boolean);
                    }
                    if (f.type === 'number' && formData[f.name]) {
                        formData[f.name] = Number(formData[f.name]);
                    }
                });

                if (config.folder) {
                    const filename = isNew ? formData._filename : item._filename.replace('.json', '');
                    delete formData._filename;
                    const path = `${config.folder}/${filename}.json`;
                    await API.saveFile(path, formData, `${isNew ? 'Criar' : 'Atualizar'} ${config.itemName}: ${formData[config.titleField] || filename}`, item ? item._sha : undefined);
                } else {
                    const file = await API.getFile(config.file);
                    const arr = file.content;
                    delete formData._filename;
                    if (isNew) {
                        arr.push(formData);
                    } else {
                        Object.assign(arr[item._index], formData);
                    }
                    await API.saveFile(config.file, arr, `${isNew ? 'Adicionar' : 'Atualizar'} ${config.itemName}`, file.sha);
                }

                UI.toast(`${config.itemName} guardado com sucesso!`);
                collectionEditor(container, config);
            } catch (err) {
                UI.toast('Erro: ' + err.message, 'error');
                saveBtn.disabled = false;
                saveBtn.textContent = '💾 Guardar';
            }
        });

        container.appendChild(form);
    }

    // ===== SPECIFIC COLLECTION CONFIGS =====

    function actividades(container) {
        return collectionEditor(container, {
            title: '📋 Atividades',
            folder: '_data/actividades',
            itemName: 'Atividade',
            titleField: 'title',
            subtitleField: 'location',
            canCreate: true,
            canDelete: true,
            fields: [
                { name: 'title', label: 'Título', type: 'text' },
                { name: 'description', label: 'Descrição', type: 'textarea', rows: 6 },
                { name: 'image', label: 'Imagem (caminho)', type: 'text', placeholder: '/images/uploads/foto.jpg' },
                { name: 'services', label: 'Serviços (um por linha)', type: 'list' },
                { name: 'schedule', label: 'Horário', type: 'text' },
                { name: 'location', label: 'Local', type: 'text' }
            ]
        });
    }

    function direcao(container) {
        container.innerHTML = '';
        container.appendChild(el('div', { className: 'page-header' }, [
            el('h1', { textContent: '👥 Órgãos Sociais' })
        ]));

        const tabs = el('div', { className: 'tabs' });
        const tabContent = el('div', { className: 'tab-content' });

        const sections = [
            { file: '_data/direcao/direcao.json', label: 'Direção' },
            { file: '_data/direcao/conselho-fiscal.json', label: 'Conselho Fiscal' },
            { file: '_data/direcao/assembleia-geral.json', label: 'Assembleia Geral' }
        ];

        sections.forEach((sec, i) => {
            const tab = el('button', {
                className: `tab-btn ${i === 0 ? 'active' : ''}`,
                textContent: sec.label,
                onClick: () => {
                    tabs.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    loadDirecaoSection(tabContent, sec);
                }
            });
            tabs.appendChild(tab);
        });

        container.appendChild(tabs);
        container.appendChild(tabContent);
        loadDirecaoSection(tabContent, sections[0]);
    }

    async function loadDirecaoSection(container, sec) {
        container.innerHTML = '';
        const file = await API.getFile(sec.file);
        if (!file) { container.appendChild(el('p', { textContent: 'Sem dados.' })); return; }

        const members = Array.isArray(file.content) ? file.content : [];

        members.forEach((m, i) => {
            const card = el('div', { className: 'item-card' }, [
                el('div', { className: 'item-info' }, [
                    el('h3', { textContent: m.name || 'Sem nome' }),
                    el('p', { textContent: m.role || '', className: 'text-muted' })
                ]),
                el('div', { className: 'item-actions' }, [
                    el('button', {
                        className: 'btn btn-small',
                        textContent: '✏️',
                        onClick: () => editMember(container, sec, file, i)
                    })
                ])
            ]);
            container.appendChild(card);
        });

        container.appendChild(el('button', {
            className: 'btn btn-primary mt-1',
            textContent: '+ Adicionar Membro',
            onClick: () => editMember(container, sec, file, -1)
        }));
    }

    function editMember(container, sec, file, index) {
        const isNew = index < 0;
        const member = isNew ? {} : file.content[index];
        container.innerHTML = '';

        const form = el('form', { className: 'editor-form' });
        form.appendChild(formGroup('Nome', textInput('name', member.name || '')));
        form.appendChild(formGroup('Cargo', textInput('role', member.role || '')));
        form.appendChild(formGroup('Descrição', textArea('description', member.description || '')));
        form.appendChild(formGroup('Imagem', textInput('image', member.image || '', '/images/uploads/foto.jpg')));

        const saveBtn = el('button', { type: 'submit', className: 'btn btn-primary', textContent: '💾 Guardar' });
        form.appendChild(saveBtn);

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            saveBtn.disabled = true;
            try {
                const data = getFormData(form);
                const freshFile = await API.getFile(sec.file);
                const arr = freshFile.content;
                if (isNew) arr.push(data);
                else Object.assign(arr[index], data);
                await API.saveFile(sec.file, arr, `Atualizar ${sec.label}`, freshFile.sha);
                UI.toast('Membro guardado!');
                loadDirecaoSection(container, sec);
            } catch (err) {
                UI.toast('Erro: ' + err.message, 'error');
                saveBtn.disabled = false;
            }
        });

        container.appendChild(el('button', {
            className: 'btn btn-secondary mb-1',
            textContent: '← Voltar',
            onClick: () => loadDirecaoSection(container, sec)
        }));
        container.appendChild(form);
    }

    function documentos(container) {
        return collectionEditor(container, {
            title: '📄 Documentos',
            file: '_data/documentos/documentos.json',
            itemName: 'Documento',
            titleField: 'title',
            subtitleField: 'year',
            canCreate: true,
            canDelete: true,
            fields: [
                { name: 'year', label: 'Ano', type: 'number' },
                { name: 'type', label: 'Tipo', type: 'select', options: ['Contas', 'Relatório', 'Estatutos', 'Outro'] },
                { name: 'title', label: 'Título', type: 'text' },
                { name: 'url', label: 'Link PDF (URL)', type: 'text' },
                { name: 'description', label: 'Descrição', type: 'textarea', rows: 3 }
            ]
        });
    }

    function noticias(container) {
        return collectionEditor(container, {
            title: '📰 Notícias & Eventos',
            file: '_data/noticias/noticias.json',
            itemName: 'Notícia',
            titleField: 'title',
            subtitleField: 'date',
            canCreate: true,
            canDelete: true,
            fields: [
                { name: 'title', label: 'Título', type: 'text' },
                { name: 'date', label: 'Data', type: 'date' },
                { name: 'excerpt', label: 'Resumo', type: 'textarea', rows: 3 },
                { name: 'body', label: 'Conteúdo Completo', type: 'textarea', rows: 8 },
                { name: 'image', label: 'Imagem', type: 'text', placeholder: '/images/uploads/foto.jpg' },
                { name: 'author', label: 'Autor', type: 'text' }
            ]
        });
    }

    function galeria(container) {
        return collectionEditor(container, {
            title: '🖼️ Galeria',
            file: '_data/galeria.json',
            itemName: 'Imagem',
            titleField: 'alt',
            subtitleField: 'caption',
            canCreate: true,
            canDelete: true,
            fields: [
                { name: 'id', label: 'ID', type: 'text' },
                { name: 'src', label: 'Caminho da imagem', type: 'text', placeholder: '/images/uploads/foto.jpg' },
                { name: 'alt', label: 'Texto alternativo', type: 'text' },
                { name: 'caption', label: 'Legenda', type: 'text' }
            ]
        });
    }

    function paginas(container) {
        container.innerHTML = '';
        container.appendChild(el('div', { className: 'page-header' }, [
            el('h1', { textContent: '📝 Páginas' })
        ]));

        const pages = [
            { file: '_data/paginas/sobre.json', label: 'Sobre', icon: 'ℹ️' },
            { file: '_data/paginas/voluntariado.json', label: 'Voluntariado', icon: '❤️' }
        ];

        const list = el('div', { className: 'items-list' });
        pages.forEach(p => {
            list.appendChild(el('div', { className: 'item-card', onClick: () => editPage(container, p) }, [
                el('div', { className: 'item-info' }, [
                    el('h3', { textContent: `${p.icon} ${p.label}` }),
                    el('p', { textContent: `Editar conteúdo da página ${p.label}`, className: 'text-muted' })
                ])
            ]));
        });
        container.appendChild(list);
    }

    async function editPage(container, page) {
        container.innerHTML = '';
        container.appendChild(el('button', {
            className: 'btn btn-secondary mb-1',
            textContent: '← Voltar às Páginas',
            onClick: () => paginas(container)
        }));
        container.appendChild(el('h1', { textContent: `Editar: ${page.label}` }));

        const file = await API.getFile(page.file);
        if (!file) { container.appendChild(el('p', { textContent: 'Ficheiro não encontrado.' })); return; }

        const form = el('form', { className: 'editor-form' });
        const pre = el('textarea', {
            className: 'form-input code-editor',
            name: 'content',
            rows: '25',
            style: 'font-family: monospace; font-size: 14px;'
        });
        pre.value = JSON.stringify(file.content, null, 2);

        form.appendChild(formGroup('Conteúdo JSON', pre));

        const saveBtn = el('button', { type: 'submit', className: 'btn btn-primary', textContent: '💾 Guardar' });
        form.appendChild(saveBtn);

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            saveBtn.disabled = true;
            try {
                const parsed = JSON.parse(pre.value);
                await API.saveFile(page.file, parsed, `Atualizar página ${page.label}`, file.sha);
                UI.toast(`Página ${page.label} guardada!`);
                file.sha = (await API.getFile(page.file)).sha;
            } catch (err) {
                UI.toast('Erro: ' + err.message, 'error');
            }
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Guardar';
        });

        container.appendChild(form);
    }

    // ===== MEDIA MANAGER =====
    async function media(container) {
        container.innerHTML = '';
        container.appendChild(el('div', { className: 'page-header' }, [
            el('h1', { textContent: '🖼️ Gestor de Media' }),
            el('label', { className: 'btn btn-primary', textContent: '📤 Upload Imagem' }, [
                (() => {
                    const input = el('input', { type: 'file', accept: 'image/*', style: 'display:none' });
                    input.addEventListener('change', async () => {
                        if (input.files[0]) {
                            const file = input.files[0];
                            const path = `images/uploads/${file.name}`;
                            UI.loading(true);
                            try {
                                await API.uploadImage(path, file);
                                UI.toast(`${file.name} enviado com sucesso!`);
                                media(container);
                            } catch (err) {
                                UI.toast('Erro no upload: ' + err.message, 'error');
                            }
                            UI.loading(false);
                        }
                    });
                    return input;
                })()
            ])
        ]));

        try {
            const files = await API.listFiles('images/uploads');
            const images = files.filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f.name));

            if (images.length === 0) {
                container.appendChild(el('p', { textContent: 'Nenhuma imagem carregada.', className: 'empty-state' }));
                return;
            }

            const grid = el('div', { className: 'media-grid' });
            images.forEach(img => {
                const card = el('div', { className: 'media-card' }, [
                    el('img', { src: img.download_url, alt: img.name, loading: 'lazy' }),
                    el('div', { className: 'media-info' }, [
                        el('span', { textContent: img.name, className: 'media-name' }),
                        el('button', {
                            className: 'btn btn-small btn-danger',
                            textContent: '🗑️',
                            onClick: async (e) => {
                                e.stopPropagation();
                                if (await UI.confirm(`Eliminar ${img.name}?`)) {
                                    try {
                                        const fileData = await API.getFile(img.path);
                                        await API.deleteFile(img.path, fileData.sha, `Remover imagem ${img.name}`);
                                        UI.toast('Imagem eliminada.');
                                        media(container);
                                    } catch (err) {
                                        UI.toast('Erro: ' + err.message, 'error');
                                    }
                                }
                            }
                        })
                    ])
                ]);
                grid.appendChild(card);
            });
            container.appendChild(grid);
        } catch (err) {
            container.appendChild(el('p', { textContent: 'Pasta images/uploads/ ainda não existe. Faça upload da primeira imagem.', className: 'empty-state' }));
        }
    }

    return { dashboard, configEditor, actividades, direcao, documentos, noticias, galeria, paginas, media };
})();
