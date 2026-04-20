# 🏥 Site ARPICA

## Bem-vindo ao repositório do site da ARPICA!

**ARPICA** - Associação de Reformados, Pensionistas e Idosos do Concelho de Alpiarca

### 📋 Sobre

Site institucional responsivo e acessível para a ARPICA, uma Instituição Particular de Solidariedade Social fundada em 1983 dedicada ao bem-estar integral da população idosa.

### 🎯 Funcionalidades

✅ **8 Páginas Principais**
- 🏠 Início (Homepage)
- ℹ️ Sobre (História, Missão, Valores)
- 📋 Atividades (Detalhes dos 5 serviços)
- 🖼️ Galeria (Fotos dos eventos)
- 👥 Direção (Membros da organização)
- 📄 Documentos (Contas, relatórios, estatutos)
- 📞 Contacto (Formulário + Mapa Google)
- 💝 Voluntariado (Oportunidades + Candidatura)

### 🛠️ Tecnologias

- **HTML5** - Markup semântico
- **CSS3** - Estilos responsivos
- **JavaScript** - Interatividade (hamburger menu, lightbox, formulários)
- **Keystatic CMS** - Gestão de conteúdo no GitHub
- **FormSpree** - Processamento de formulários
- **Font Awesome 6.4** - Ícones

### 📱 Recursos

- ✨ Design moderno e profissional
- 📲 Totalmente responsivo (mobile, tablet, desktop)
- ♿ Acessibilidade otimizada
- 🎨 Cores: Azul (#2c5282), Vermelho (#e74c3c), Laranja (#f39c12)
- 🔍 SEO-friendly com sitemap.xml e robots.txt

### 🚀 Como Usar

#### Desenvolvimento Local

```bash
# Iniciar servidor local
npm start
# ou
python3 -m http.server 8000
```

Acesse em: `http://localhost:8000`

#### Estrutura de Ficheiros

```
site-arpica-main/
├── index.html                 # Homepage
├── sobre.html                 # Sobre ARPICA
├── actividades.html          # Atividades e serviços
├── galeria.html              # Galeria de fotos
├── direcao.html              # Membros da direção
├── documentos.html           # Documentos institucionais
├── contacto.html             # Contacto e mapa
├── voluntariado.html         # Voluntariado
├── css/
│   ├── style.css             # Estilos principais
│   ├── responsive.css        # Media queries
│   └── lightbox-forms.css   # Lightbox e formulários
├── js/
│   ├── main.js               # Scripts principais
│   ├── lightbox.js           # Galeria lightbox
│   └── lightbox-forms.js     # Scripts de formulários
├── images/
│   ├── logo.svg              # Logo
│   ├── favicon.ico           # Ícone navegador
│   └── uploads/              # Imagens de conteúdo
├── _data/
│   ├── siteinfo.json         # Configurações do site
│   ├── actividades/          # Dados de atividades (Keystatic)
│   ├── direcao/              # Dados da direção (Keystatic)
│   ├── documentos/           # Dados de documentos (Keystatic)
│   └── noticias/             # Dados de notícias (Keystatic)
├── keystatic.config.ts       # Configuração Keystatic CMS
├── sitemap.xml               # Mapa do site para SEO
├── robots.txt                # Instruções para motores busca
├── package.json              # Dependências do projeto
└── README.md                 # Este ficheiro
```

### 📞 Informações de Contacto

- **Endereço:** Rua Dr. José Antónios Simões, Nº 52, Alpiarca
- **Telefone:** +351 243 558 862
- **Email:** geral.arpica@hotmail.com
- **Facebook:** https://www.facebook.com/arpica.alpiarca/
- **Horário:** Segunda a Sexta, 09:00 - 17:00

### 🔧 Editar Conteúdo

#### Usando Keystatic CMS
1. Acesse o Keystatic Editor integrado no GitHub
2. Navegue para "Collections" (Atividades, Direção, Documentos, Notícias)
3. Crie ou edite conteúdo
4. Faça commit automático para GitHub

#### Editando Manualmente
1. Edite os ficheiros `.html` diretamente
2. Edite os ficheiros `.json` em `_data/` para conteúdo dinâmico
3. Faça commit e push para GitHub

### 📊 Estatísticas

- **Fundação:** 1983
- **Pessoas Apoiadas:** 800+ anuais
- **Voluntários:** 100+
- **Serviços:** 5 (Centro de Convívio, Centro de Dia, SAD, SADI, Lar ERPI)
- **Páginas:** 8
- **Formulários:** 2 (Contacto, Voluntariado)

### 🔐 Segurança

- ✅ Sem dados sensíveis no código
- ✅ Formulários seguros via FormSpree
- ✅ HTTPS em produção
- ✅ Privacy-friendly

### 📝 Licença

MIT License - Veja `LICENSE` para detalhes

### 👥 Créditos

**Desenvolvido com ❤️ para ARPICA por GitHub Copilot**

---

**Versão:** 1.0.0  
**Última Atualização:** 20 de Abril de 2026  
**Status:** ✅ Pronto para Produção
