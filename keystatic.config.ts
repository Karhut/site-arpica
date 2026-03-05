import { collection, config, fields } from '@keystatic/core'

export default config({
  storage: {
    kind: 'github',
    repo: {
      owner: 'Karhut',
      name: 'site-arpica',
    },
  },
  collections: {
    actividades: collection({
      label: 'Atividades',
      slugField: 'title',
      path: '_data/actividades/**',
      format: { contentField: 'description' },
      schema: {
        title: fields.slug({
          label: 'Título',
          validation: { length: { min: 1 } },
        }),
        description: fields.markdoc({
          label: 'Descrição',
          options: {
            image: {
              directory: 'images/uploads',
              publicPath: '/images/uploads/',
            },
          },
        }),
        image: fields.image({
          label: 'Imagem',
          directory: 'images/uploads',
          publicPath: '/images/uploads/',
        }),
        services: fields.array(fields.text({ label: 'Serviço' }), {
          label: 'Serviços',
          itemLabel: (props) => props,
        }),
        schedule: fields.text({ label: 'Horário' }),
        location: fields.text({ label: 'Local' }),
      },
    }),
    direcao: collection({
      label: 'Direção',
      slugField: 'name',
      path: '_data/direcao/**',
      format: 'json',
      schema: {
        name: fields.text({ label: 'Nome' }),
        role: fields.text({ label: 'Cargo' }),
        section: fields.select({
          label: 'Secção',
          options: [
            { label: 'Direção', value: 'Direção' },
            { label: 'Conselho Fiscal', value: 'Conselho Fiscal' },
            { label: 'Assembleia Geral', value: 'Assembleia Geral' },
          ],
        }),
        description: fields.text({ label: 'Descrição' }),
        image: fields.image({
          label: 'Imagem',
          directory: 'images/uploads',
          publicPath: '/images/uploads/',
        }),
      },
    }),
    documentos: collection({
      label: 'Documentos',
      slugField: 'title',
      path: '_data/documentos/**',
      format: 'json',
      schema: {
        year: fields.number({ label: 'Ano' }),
        type: fields.select({
          label: 'Tipo',
          options: [
            { label: 'Contas', value: 'Contas' },
            { label: 'Relatório', value: 'Relatório' },
            { label: 'Estatutos', value: 'Estatutos' },
            { label: 'Outro', value: 'Outro' },
          ],
        }),
        title: fields.text({ label: 'Título' }),
        url: fields.text({ label: 'Link PDF' }),
        description: fields.text({ label: 'Descrição' }),
      },
    }),
    noticias: collection({
      label: 'Notícias & Eventos',
      slugField: 'title',
      path: '_data/noticias/**',
      format: { contentField: 'body' },
      schema: {
        title: fields.text({ label: 'Título' }),
        date: fields.datetime({ label: 'Data' }),
        excerpt: fields.text({ label: 'Resumo' }),
        body: fields.markdoc({
          label: 'Conteúdo',
          options: {
            image: {
              directory: 'images/uploads',
              publicPath: '/images/uploads/',
            },
          },
        }),
        image: fields.image({
          label: 'Imagem',
          directory: 'images/uploads',
          publicPath: '/images/uploads/',
        }),
        author: fields.text({ label: 'Autor' }),
      },
    }),
    config: collection({
      label: 'Configurações',
      slugField: 'institution_name',
      path: '_data/',
      format: 'json',
      entryLayout: 'content',
      schema: {
        institution_name: fields.text({ label: 'Nome da Instituição' }),
        address: fields.text({ label: 'Morada' }),
        postal_code: fields.text({ label: 'Código Postal' }),
        city: fields.text({ label: 'Cidade' }),
        phone: fields.text({ label: 'Telefone' }),
        email: fields.text({ label: 'Email' }),
        facebook: fields.text({ label: 'Facebook URL' }),
        hours_weekday: fields.text({ label: 'Horário (2ª-6ª)' }),
        hours_saturday: fields.text({ label: 'Horário (Sábado)' }),
        hours_sunday: fields.text({ label: 'Horário (Domingo)' }),
      },
    }),
  },
})
