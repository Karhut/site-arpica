# 📋 Guia de Implementação do CMS (Decap CMS)

## Visão Geral

Este guia explica como configurar e usar o **Decap CMS** (antigo Netlify CMS) para permitir que a equipa da ARPICA edite o conteúdo do site sem precisar de mexer em código.

---

## 📁 Estrutura Atual

```
_data/
├── siteinfo.json           # Informações institucionais
├── actividades/
│   ├── centro-convivio.json
│   ├── centro-dia.json
│   ├── apoio-domiciliario.json
│   ├── lar-erpi.json
│   └── sadi.json
├── direcao/
│   ├── direcao.json
│   ├── conselho-fiscal.json
│   └── assembleia-geral.json
├── documentos/
│   └── documentos.json
└── noticias/
    └── noticias.json

images/
└── uploads/                # Para onde vão as imagens do CMS
```

---

## ⚙️ Configuração Necessária

### Opção 1: **Netlify (Recomendado - Mais Fácil)**

1. **Criar conta no Netlify:** https://app.netlify.com

2. **Conectar repositório GitHub:**
   - "Add new site" → "Import an existing project"
   - Escolher "GitHub" e autorizar
   - Selecionar repositório: `Karhut/site-arpica`

3. **Configurar build:**
   - Build command: (deixar vazio - site estático)
   - Publish directory: `/` (raiz do projeto)

4. **Configurar CMS:**
   - Em "Site settings" → "Identity" → "Enable Identity"
   - Em "Registration preferences" → escolher "Invite only"
   - Em "Services" → "Git Gateway" → "Enable Git Gateway"

5. **Aceder ao CMS:**
   - URL: `https://seu-site.netlify.app/admin/`
   - Fazer login com email convidado

### Opção 2: **GitHub Pages (Gratuito)**

1. **Ativar GitHub Pages:**
   - Settings → Pages → Source: `main` branch → `/ (root)`

2. **Configurar CMS para GitHub Pages:**
   - O `admin/config.yml` já está configurado para GitHub

3. **Criar ficheiro `admin/index.html`:**
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <meta charset="utf-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1" />
     <title>ARPICA CMS</title>
   </head>
   <body>
     <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
   </body>
   </html>
   ```

4. **Autenticação:**
   - Para GitHub Pages, é necessário usar **Netlify Identity** ou outro serviço de autenticação

---

## 🎯 Como Usar o CMS

### 1. **Aceder ao Painel**
- URL: `https://seu-site.netlify.app/admin/`
- Login com email e senha

### 2. **Editar Informações Institucionais**
- Secção: **⚙️ Configurações**
- Campos: Nome, morada, telefone, email, horários
- Estes dados atualizam automaticamente o `siteinfo.json`

### 3. **Gerir Atividades**
- Secção: **Atividades**
- Criar, editar ou remover atividades
- Cada atividade tem: título, descrição, imagem, serviços, horário, local

### 4. **Gerir Direção**
- Secção: **Membros da Direção**
- Adicionar membros para:
  - Direção
  - Conselho Fiscal
  - Assembleia Geral

### 5. **Gerir Documentos**
- Secção: **Documentos**
- Upload de PDFs (ou links para URLs externos)
- Organizar por ano e tipo

### 6. **Gerir Notícias**
- Secção: **Notícias & Eventos**
- Criar notícias com data, imagem e conteúdo

---

## 📝 Notas Importantes

### Formato dos Ficheiros

**Atividades e Notícias:** Um ficheiro JSON por item
```json
{
  "title": "Exemplo",
  "description": "Descrição..."
}
```

**Direção e Documentos:** Arrays JSON num único ficheiro
```json
[
  {
    "name": "Nome da Pessoa",
    "role": "Cargo"
  }
]
```

### Imagens

- As imagens fazem upload para `images/uploads/`
- O CMS guarda o caminho no ficheiro JSON
- Exemplo: `/images/uploads/foto-evento.jpg`

### URLs de Documentos

- Para PDFs locais: `/documentos/ficheiro.pdf`
- Para URLs externos: `https://exemplo.com/doc.pdf`

---

## 🔧 Problemas Comuns e Soluções

### "Unable to locate resource"
- Verificar se as pastas `_data/*` existem
- Confirmar que os ficheiros JSON são válidos

### Imagens não aparecem
- Verificar caminho: deve começar com `/images/uploads/`
- Confirmar que o ficheiro existe na pasta

### CMS não carrega
- Verificar `admin/index.html` e `admin/config.yml`
- Confirmar que o Netlify Identity está ativo

---

## 🚀 Próximos Passos

1. **Configurar Netlify** (ou GitHub Pages)
2. **Testar CMS** com uma edição simples
3. **Convidar utilizadores** da equipa ARPICA
4. **Formação básica** à equipa

---

## 📞 Suporte

- **Documentação Decap CMS:** https://decapcms.org/docs/
- **Comunidade:** https://github.com/decaporg/decap-cms/discussions

---

**Criado:** Março 2026  
**Versão:** 1.0
