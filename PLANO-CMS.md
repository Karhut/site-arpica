# Plano: CMS Custom para ARPICA

## Problema
O Decap CMS com Netlify Identity não funciona (popup de login não aparece). O cliente quer um CMS custom, profissional, que permita editar **tudo** no site.

## Abordagem
Construir um painel de administração custom (`/admin/`) que:
- Autentica via **GitHub OAuth** (login com conta GitHub, sem passwords extra)
- Lê e escreve ficheiros JSON via **GitHub API**
- Interface profissional em português, feita à medida para os dados da ARPICA
- Funciona em qualquer hosting (Netlify, GitHub Pages, etc.)

## Arquitetura

```
admin/
├── index.html          # Página principal do CMS (SPA)
├── css/
│   └── admin.css       # Estilos do painel admin
├── js/
│   ├── auth.js         # GitHub OAuth + gestão de sessão
│   ├── api.js          # GitHub API wrapper (CRUD ficheiros)
│   ├── router.js       # SPA router (navegação sem reload)
│   ├── editor.js       # Editores de conteúdo (formulários)
│   ├── media.js        # Upload e gestão de imagens
│   ├── ui.js           # Componentes UI (toasts, modals, sidebar)
│   └── app.js          # Inicialização e orquestração
└── config.yml          # (removido - já não é necessário)

netlify/
└── functions/
    └── github-oauth.js # Serverless function para OAuth callback
```

## Conteúdo Editável (Tudo)

| Secção | Ficheiro(s) JSON | Operações |
|--------|-----------------|-----------|
| Configurações do Site | `_data/siteinfo.json` | Editar |
| Atividades (5) | `_data/actividades/*.json` | Criar, Editar, Eliminar |
| Direção | `_data/direcao/direcao.json` | Editar membros |
| Conselho Fiscal | `_data/direcao/conselho-fiscal.json` | Editar membros |
| Assembleia Geral | `_data/direcao/assembleia-geral.json` | Editar membros |
| Documentos | `_data/documentos/documentos.json` | Criar, Editar, Eliminar |
| Notícias & Eventos | `_data/noticias/noticias.json` | Criar, Editar, Eliminar |
| Galeria | `_data/galeria.json` (novo) | Criar, Editar, Eliminar |
| Página Sobre | `_data/paginas/sobre.json` (novo) | Editar |
| Voluntariado | `_data/paginas/voluntariado.json` (novo) | Editar |

## Fases de Implementação

### Fase 0: Frontend — Polimento e correção do site existente

#### 0A: Corrigir formulários (Netlify Forms)
- Converter formulário de contacto (contacto.html) para Netlify Forms (atributo `netlify`)
- Converter formulário de voluntariado (voluntariado.html) para Netlify Forms
- Remover referências ao Formspree
- Adicionar feedback visual de sucesso/erro ao utilizador

#### 0B: Preencher conteúdos `[MUDAR: ...]`
- contacto.html: Adicionar Google Maps embed com morada do siteinfo.json
- voluntariado.html: Preencher tipos de voluntariado reais (acompanhamento a idosos, apoio em eventos, apoio administrativo)
- voluntariado.html: Preencher FAQ com perguntas genéricas realistas
- sobre.html: Preencher secção da equipa com dados genéricos
- Preencher todos os restantes `[MUDAR: ...]` com conteúdo coerente

#### 0C: Melhorar imagens placeholder
- Substituir picsum.photos por placeholders temáticos e consistentes (placehold.co com texto descritivo ou imagens SVG genéricas)
- Garantir que quando fotos reais forem adicionadas via CMS, substituem facilmente

#### 0D: Segurança e correções técnicas
- Adicionar headers de segurança via `netlify.toml` (X-Frame-Options, CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- Adicionar SRI (Subresource Integrity) a todos os recursos CDN externos (Font Awesome, etc.)
- Adicionar `rel="noopener noreferrer"` a todos os links `target="_blank"`
- Substituir `innerHTML` por métodos DOM seguros (createElement/textContent) onde possível
- Adicionar sanitização de input nos formulários
- Mover inline scripts para ficheiros .js externos (compatível com CSP)
- Adicionar `robots.txt` com diretivas de segurança
- Adicionar regra CSS `.scrolled` para header sticky
- Remover animações excessivas (parallax, gradient-shift)
- Adicionar fallback para `backdrop-filter`
- Corrigir acessibilidade: aria-labels, alt text, skip-to-content
- Corrigir links de documentos partidos
- Limpar CSS duplicado (.activity-card vs .card)
- Remover scripts Netlify Identity (será substituído pelo CMS custom)

### Fase 1: Dados — Extrair conteúdo hardcoded para JSON
- Criar `_data/galeria.json` com as imagens da galeria
- Criar `_data/paginas/sobre.json` com conteúdo da página Sobre
- Criar `_data/paginas/voluntariado.json` com conteúdo da página Voluntariado
- Atualizar as páginas HTML para carregar conteúdo dinamicamente dos JSON

### Fase 2: Autenticação — GitHub OAuth
- Registar GitHub OAuth App (manual, instruções fornecidas)
- Criar Netlify serverless function para OAuth token exchange
- Implementar `auth.js` com fluxo completo de login/logout
- Tela de login profissional com botão "Entrar com GitHub"

### Fase 3: Fundação do Admin — Layout e componentes base
- `index.html` — Estrutura SPA com sidebar, topbar, área de conteúdo
- `admin.css` — Design profissional (sidebar escura, conteúdo limpo, responsivo)
- `ui.js` — Toast notifications, modal de confirmação, loading states
- `router.js` — Navegação SPA entre secções sem reload
- `api.js` — Wrapper GitHub API (ler ficheiro, guardar ficheiro, upload imagem)

### Fase 4: Editores de Conteúdo
- **Dashboard** — Visão geral com contadores e atalhos rápidos
- **Configurações** — Formulário para siteinfo.json
- **Atividades** — Lista + formulário com campos: título, descrição (markdown), imagem, serviços, horário, local
- **Direção** — 3 tabs (Direção, Conselho Fiscal, Assembleia Geral) com drag-and-drop para reordenar
- **Documentos** — Tabela com filtros por ano/tipo + formulário
- **Notícias** — Lista com cards + editor com preview
- **Galeria** — Grid de imagens com upload e reordenação
- **Páginas** — Editor para Sobre e Voluntariado

### Fase 5: Gestão de Media
- Upload de imagens via GitHub API para `images/uploads/`
- Browser de imagens existentes com preview
- Seletor de imagem integrado nos formulários

### Fase 6: Polish e UX
- Confirmação antes de guardar/eliminar
- Auto-save em rascunho (localStorage)
- Indicador de alterações não guardadas
- Responsivo para tablet/mobile
- Mensagens de erro claras em português
- Preview do conteúdo antes de publicar

## Requisitos para Configuração (único, manual)

1. **Criar GitHub OAuth App:**
   - GitHub → Settings → Developer settings → OAuth Apps → New
   - Authorization callback URL: `https://seu-site.netlify.app/admin/`
   - Guardar Client ID e Client Secret

2. **Configurar Netlify Environment Variables:**
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`

3. **Deploy:** Push para main → Netlify faz deploy automático

## Stack Tecnológica

- **Frontend:** HTML5, CSS3, JavaScript vanilla (sem frameworks — leve e rápido)
- **Auth:** GitHub OAuth 2.0
- **Backend:** Netlify Functions (1 function apenas)
- **Storage:** GitHub API (ficheiros JSON no repositório)
- **Markdown:** Biblioteca lightweight para editor de texto rico

## Notas
- Sem dependências de CDN externas além do FontAwesome (já usado no site)
- Sem build step — funciona diretamente como ficheiros estáticos
- Compatível com qualquer browser moderno
