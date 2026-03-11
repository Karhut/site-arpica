# 📋 Guia do CMS Custom — ARPICA

## Visão Geral

O site ARPICA utiliza um **CMS custom** que permite editar todo o conteúdo diretamente através de um painel de administração em `/admin/`. A autenticação é feita via **GitHub OAuth** e os dados são guardados como ficheiros JSON no repositório.

---

## ⚙️ Configuração Inicial (Uma Única Vez)

### 1. Criar GitHub OAuth App

1. Aceda a: https://github.com/settings/developers
2. Clique em **"New OAuth App"**
3. Preencha:
   - **Application name:** `ARPICA CMS`
   - **Homepage URL:** `https://seu-site.netlify.app`
   - **Authorization callback URL:** `https://seu-site.netlify.app/admin/`
4. Clique em **"Register application"**
5. Copie o **Client ID**
6. Gere e copie o **Client Secret**

### 2. Configurar Netlify

1. No painel do Netlify → **Site settings** → **Environment variables**
2. Adicione:
   - `GITHUB_CLIENT_ID` → (cole o Client ID)
   - `GITHUB_CLIENT_SECRET` → (cole o Client Secret)

### 3. Atualizar o Client ID no HTML

1. Abra `admin/index.html`
2. Substitua `GITHUB_CLIENT_ID` pelo seu Client ID real:
   ```html
   <meta name="github-client-id" content="SEU_CLIENT_ID_AQUI">
   ```

### 4. Deploy

Faça push para o branch `main` — o Netlify faz deploy automaticamente.

---

## 🎯 Como Usar o CMS

### Aceder ao Painel
- URL: `https://seu-site.netlify.app/admin/`
- Clique em **"Entrar com GitHub"**
- Autorize a aplicação (apenas na primeira vez)

### Secções Disponíveis

| Secção | O que edita |
|--------|-------------|
| ⚙️ **Configurações** | Nome, morada, telefone, email, horários |
| 📋 **Atividades** | Serviços: Centro de Convívio, Centro de Dia, SAD, SADI, ERPI |
| 👥 **Direção** | Membros da Direção, Conselho Fiscal, Assembleia Geral |
| 📄 **Documentos** | Documentos institucionais (contas, relatórios, estatutos) |
| 📰 **Notícias** | Notícias e eventos |
| 🖼️ **Galeria** | Fotografias da galeria |
| 📝 **Páginas** | Conteúdo das páginas Sobre e Voluntariado |
| 📤 **Media** | Upload e gestão de imagens |

### Editar Conteúdo
1. Clique na secção pretendida
2. Clique em **"Editar"** no item desejado
3. Modifique os campos
4. Clique em **"💾 Guardar"**

### Adicionar Novo Conteúdo
1. Clique em **"+ Novo"** na secção pretendida
2. Preencha os campos
3. Clique em **"💾 Guardar"**

### Upload de Imagens
1. Vá a **"Media"**
2. Clique em **"📤 Upload Imagem"**
3. Selecione a imagem do seu computador
4. A imagem ficará disponível em `/images/uploads/nome-da-imagem.jpg`

---

## 📁 Estrutura de Dados

```
_data/
├── siteinfo.json              # Configurações gerais do site
├── actividades/               # Uma atividade por ficheiro
│   ├── centro-convivio.json
│   ├── centro-dia.json
│   ├── apoio-domiciliario.json
│   ├── lar-erpi.json
│   └── sadi.json
├── direcao/                   # Órgãos sociais
│   ├── direcao.json
│   ├── conselho-fiscal.json
│   └── assembleia-geral.json
├── documentos/
│   └── documentos.json        # Lista de documentos
├── noticias/
│   └── noticias.json          # Lista de notícias
├── galeria.json               # Lista de imagens da galeria
└── paginas/
    ├── sobre.json             # Conteúdo da página Sobre
    └── voluntariado.json      # Conteúdo da página Voluntariado

images/
└── uploads/                   # Imagens carregadas via CMS
```

---

## 🔒 Segurança

- **Autenticação:** GitHub OAuth (apenas utilizadores com acesso ao repositório)
- **Headers de segurança:** CSP, X-Frame-Options, X-Content-Type-Options (via netlify.toml)
- **Spam protection:** Honeypot nos formulários
- **SRI:** Subresource Integrity nos CDN externos
- **Sem secrets no código:** Client Secret guardado nas variáveis de ambiente do Netlify

---

## 🔧 Resolução de Problemas

### "OAuth not configured"
- Verifique que as variáveis `GITHUB_CLIENT_ID` e `GITHUB_CLIENT_SECRET` estão definidas no Netlify

### Popup de login não aparece
- Verifique que o Client ID está correto no `<meta name="github-client-id">`

### Erro ao guardar
- Verifique que a sua conta GitHub tem permissão de escrita no repositório

### Imagens não aparecem
- Verifique que o caminho começa com `/images/uploads/`

---

**Criado:** Março 2026
**Versão:** 2.0 — CMS Custom com GitHub OAuth
