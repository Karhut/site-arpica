// ============================================
// ADMIN CMS - Servir o painel CMS
// ============================================

app.get('/admin/', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// Servir ficheiros estáticos (DEPOIS das rotas CMS)
