import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 4000;
const SECRET_KEY = process.env.JWT_SECRET || 'fallbacksecretkey';

app.use(cors());
app.use(express.json());

// 💡 Configuração do pool do PostgreSQL usando DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  host: 'db.cqvvxthwyzltxsugsrhb.supabase.co',
  query_timeout: 5000, // Timeout para evitar travamento
  keepAlive: true,     // Mantém a conexão ativa
  connectionTimeoutMillis: 10000, // Timeout na conexão inicial
});

// 🛠️ Teste de conexão com o banco
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erro ao conectar no PostgreSQL:', err.stack);
  } else {
    console.log('✅ Conexão com PostgreSQL bem-sucedida!');
    release();
  }
});

// 🔒 Middleware para verificar o token JWT
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido.' });
    req.user = user;
    next();
  });
}

// 📝 Rota de registro de usuário (com senha criptografada)
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO Users (email, password) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔑 Rota de login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(`Tentativa de login: ${email}`);

  try {
    const result = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      console.log('Usuário não encontrado.');
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    const senhaValida = await bcrypt.compare(password, user.password);
    console.log(`Senha válida? ${senhaValida}`);

    if (!senhaValida) {
      console.log('Senha incorreta.');
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    console.log('Login bem-sucedido.');
    res.json({ token, userId: user.id, email: user.email });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Rota protegida para atualizar o perfil do usuário
app.put('/users/:userId/profile', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  const { name, bio, avatar } = req.body;

  if (req.user.userId !== parseInt(userId)) {
    return res.status(403).json({ message: 'Acesso negado.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO Profiles (user_id, name, bio, avatar)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) 
       DO UPDATE SET name = EXCLUDED.name, bio = EXCLUDED.bio, avatar = EXCLUDED.avatar
       RETURNING *`,
      [userId, name, bio, avatar]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err);
    res.status(500).json({ error: err.message });
  }
});

// 📄 Rota protegida para buscar perfil e links do usuário autenticado
app.get('/users/:userId/profile', authenticateToken, async (req, res) => {
  const { userId } = req.params;

  if (req.user.userId !== parseInt(userId)) {
    return res.status(403).json({ message: 'Acesso negado.' });
  }

  try {
    const profileResult = await pool.query(
      'SELECT name, bio, avatar FROM Profiles WHERE user_id = $1',
      [userId]
    );
    const profile = profileResult.rows[0];

    if (!profile) {
      return res.status(404).json({ message: 'Perfil não encontrado.' });
    }

    const linksResult = await pool.query(
      'SELECT id, title, url, platform FROM Links WHERE user_id = $1',
      [userId]
    );

    res.json({ profile, links: linksResult.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➕ Rota protegida para adicionar link para um usuário
app.post('/users/:userId/links', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  const { title, url, platform } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO Links (user_id, title, url, platform) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, title, url, platform]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔄 Rota protegida para atualizar link
app.put('/users/:userId/links/:linkId', authenticateToken, async (req, res) => {
  const { userId, linkId } = req.params;
  const { title, url, platform } = req.body;

  try {
    const result = await pool.query(
      'UPDATE Links SET title = $1, url = $2, platform = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
      [title, url, platform, linkId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Link não encontrado.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Rota protegida para deletar link
app.delete('/users/:userId/links/:linkId', authenticateToken, async (req, res) => {
  const { userId, linkId } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM Links WHERE id = $1 AND user_id = $2 RETURNING *',
      [linkId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Link não encontrado.' });
    }

    res.json({ message: 'Link deletado com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🌍 Iniciando o servidor
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
