# 📚 Documentação do Site ARPICA

## 🏢 Visão Geral

**ARPICA** - Associação de Reformados, Pensionistas e Idosos do Concelho de Alpiarca  
**Tipo:** Instituição Particular de Solidariedade Social (IPSS)  
**Fundação:** 1983  
**Website:** Site institucional estático (HTML/CSS/JS)

---

## 📁 Estrutura do Projeto

```
site-arpica-main/
├── index.html              # Página inicial
├── base-template.html      # Template base para novas páginas
├── sobre.html              # Sobre a instituição
├── actividades.html        # Lista de atividades/serviços
├── galeria.html            # Galeria de fotos
├── direcao.html            # Membros da direção
├── documentos.html         # Documentos institucionais
├── contacto.html           # Formulário de contacto
├── voluntariado.html       # Página de voluntariado
│
├── _data/
│   └── siteinfo.json       # Informações institucionais (JSON)
│
├── admin/
│   ├── index.html          # Interface Decap CMS (Netlify CMS)
│   └── config.yml          # Configuração do CMS
│
├── css/
│   ├── style.css           # Estilos principais (841 linhas)
│   ├── responsive.css      # Media queries / responsivo
│   └── lightbox-forms.css  # Estilos do lightbox e formulários
│
└── js/
    └── lightbox-forms.js   # Lightbox gallery + validação forms
```

---

## 🎯 Funcionalidades

### 1. **Páginas Institucionais**
| Página | Descrição |
|--------|-----------|
| `index.html` | Homepage com destaques, atividades principais, galeria e call-to-action |
| `sobre.html` | História, missão, visão e valores da ARPICA |
| `actividades.html` | Detalhe dos serviços: Centro de Convívio, Centro de Dia, Apoio Domiciliário, Lar (ERPI), SADI |
| `galeria.html` | Galeria de fotos com lightbox modal |
| `direcao.html` | Membros da direção, conselho fiscal e assembleia geral |
| `documentos.html` | Contas, relatórios e estatutos |
| `contacto.html` | Formulário de contacto + informações |
| `voluntariado.html` | Informação e inscrição para voluntários |

### 2. **CMS (Decap CMS / Netlify CMS)**
- **Configuração:** `admin/config.yml`
- **Repositório:** GitHub (Karhut/site-arpica)
- **Collections configuradas:**
  - ✏️ Atividades
  - ✏️ Direção
  - ✏️ Documentos
  - ✏️ Notícias & Eventos
  - ⚙️ Configurações do Site (siteinfo.json)

> ⚠️ **Nota:** As collections do CMS apontam para pastas que ainda não existem (`_data/actividades`, `_data/direcao`, etc.). É necessário criar estas pastas ou ajustar a configuração.

### 3. **Design System**
**Cores:**
- Primária: `#2c5282` (Azul escuro)
- Secundária: `#e74c3c` (Vermelho-coral)
- Accent: `#f39c12` (Laranja)

**Tipografia:** Segoe UI, Tahoma, Geneva, Verdana, sans-serif

**Recursos:**
- Font Awesome 6.4.0 (ícones)
- Lightbox para galeria de fotos
- Formulários com validação JavaScript
- Menu hamburger responsivo

---

## 🔧 Como Editar

### Opção 1: **Diretamente no Código** (Recomendado atualmente)

1. Editar ficheiros HTML diretamente
2. Atualizar `siteinfo.json` para dados institucionais
3. Substituir imagens na pasta `images/` (a criar)

### Opção 2: **Via CMS** (Requer configuração)

1. Aceder a `/admin/index.html`
2. Autenticar via GitHub
3. Editar conteúdo através da interface visual

**Pré-requisitos para CMS:**
```bash
# Criar pastas faltantes para as collections
mkdir -p _data/actividades
mkdir -p _data/direcao
mkdir -p _data/documentos
mkdir -p _data/noticias
mkdir -p images/uploads
```

---

## 📋 Dados Institucionais (siteinfo.json)

```json
{
  "institution_name": "ARPICA",
  "address": "Rua Dr. José Antónios Simões, Nº 52",
  "postal_code": "2090-040",
  "city": "Alpiarca",
  "phone": "+351 243 558 862",
  "email": "geral.arpica@hotmail.com",
  "facebook": "https://www.facebook.com/arpica.alpiarca/",
  "hours_weekday": "Segunda a Sexta: 09:00 - 17:00",
  "hours_saturday": "Sábado: Fechado",
  "hours_sunday": "Domingo: Fechado"
}
```

---

## 🌐 Serviços da ARPICA

1. **Centro de Convívio** (1983) - Espaço de encontro e atividades sociais
2. **Centro de Dia** (1999) - Cuidados diários, refeições, animação
3. **Apoio Domiciliário** - Cuidados em casa
4. **Lar de Idosos (ERPI)** (2013) - Residência com cuidados médicos
5. **SADI** (2001) - Serviço de Apoio Domiciliário Integrado

---

## ✅ Trabalho Realizado (Março 2026)

### Estrutura Criada
- [x] Pasta `images/` e `images/uploads/` para uploads do CMS
- [x] Pastas para o CMS: `_data/actividades/`, `_data/direcao/`, `_data/documentos/`, `_data/noticias/`
- [x] Ficheiro `js/main.js` com funcionalidades completas
- [x] Ficheiros de dados iniciais para todas as collections do CMS
- [x] Remoção de ficheiro duplicado `js/lightbox.js`

### Funcionalidades do main.js
- Menu hamburger mobile com animação
- Scroll suave para âncoras
- Header sticky com sombra ao fazer scroll
- Animações de fade-in ao fazer scroll
- Carregamento automático de dados do siteinfo.json
- Validação de formulários de contacto

### Dados Iniciais Criados
- **Atividades:** 5 ficheiros (Centro de Convívio, Centro de Dia, Apoio Domiciliário, Lar ERPI, SADI)
- **Direção:** 3 ficheiros JSON com estruturas para Direção, Conselho Fiscal e Assembleia Geral
- **Documentos:** Ficheiro com exemplos de contas, relatórios e estatutos
- **Notícias:** 3 notícias de exemplo (Natal, Fátima, Aniversário)

---

## 🚀 Próximos Passos Sugeridos

### Prioridade Alta
- [ ] Substituir imagens de placeholder (picsum.photos) por imagens reais
- [ ] Fazer upload do logótipo (`images/logo.svg`) e favicon (`images/favicon.ico`)

### Prioridade Média
- [ ] Completar a página `sobre.html` com história completa
- [ ] Preencher `galeria.html` com fotos reais dos eventos
- [ ] Configurar formulário de contacto (backend/envio de emails)
- [ ] Adicionar política de privacidade e cookies (RGPD)

### Prioridade Baixa
- [ ] Implementar secção de notícias (já configurada no CMS)
- [ ] Adicionar mapa do Google Maps na página de contacto
- [ ] Otimizar SEO (meta tags, Open Graph, sitemap.xml)
- [ ] Configurar domínio e hosting (Netlify, Vercel, GitHub Pages)

---

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologia |
|-----------|------------|
| Frontend | HTML5, CSS3, JavaScript (Vanilla) |
| Ícones | Font Awesome 6.4.0 |
| CMS | Decap CMS (Netlify CMS) |
| Hosting | A definir (sugestão: Netlify ou GitHub Pages) |
| Versionamento | Git + GitHub |

---

## 📞 Contactos para Desenvolvimento

**Equipa Anterior:** Não documentado  
**Repositório GitHub:** Karhut/site-arpica  
**Branch:** main

---

## 📝 Notas Importantes

1. **Imagens:** O site usa placeholders do `picsum.photos`. Substituir por imagens reais.
2. **JavaScript:** O ficheiro `js/main.js` é referenciado mas não foi encontrado na pasta `js/`.
3. **CMS:** A configuração do CMS está feita mas requer pastas e estrutura de dados.
4. **Formulários:** A validação existe em JS, mas é necessário backend para envio de emails.
5. **Acessibilidade:** Adicionar atributos `alt` em todas as imagens e `aria-label` em botões.

---

**Última atualização:** Março 2026  
**Documentação criada por:** Qwen Code Assistant
