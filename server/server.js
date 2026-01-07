const express = require('express');
const cors = require('cors');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok'});
});

const analyzer_routes = require('./routes/analyzer_routes');
app.use('/api/analyzer', analyzer_routes);

const PORT = process.env.PORT || 3001;

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', PORT);
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Configurada ✅' : 'NÃO configurada ❌');

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});