import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;
const app = express();
const port = process.env.PORT || 8787;

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' }));
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.get('/health', async (_req, res) => {
  try {
    await pool.query('select 1');
    res.json({ ok: true, db: 'up' });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('/api/employees', async (_req, res) => {
  const r = await pool.query('select * from employees order by created_at desc');
  res.json(r.rows);
});

app.post('/api/employees', async (req, res) => {
  const { employee_id, name, role, department, employment_type, status } = req.body;
  if (!employee_id || !name || !role) return res.status(400).json({ error: 'employee_id, name, role required' });
  const q = `insert into employees(employee_id,name,role,department,employment_type,status)
             values($1,$2,$3,$4,$5,$6) returning *`;
  const r = await pool.query(q, [employee_id, name, role, department || 'HR', employment_type || 'Permanent', status || 'Active']);
  res.status(201).json(r.rows[0]);
});

app.delete('/api/employees/:id', async (req, res) => {
  await pool.query('delete from employees where id=$1', [req.params.id]);
  res.status(204).send();
});

app.get('/api/admin-staff', async (_req, res) => {
  const r = await pool.query('select * from admin_staff order by created_at desc');
  res.json(r.rows);
});

app.post('/api/admin-staff', async (req, res) => {
  const { name, email, dept, level, view_scope, app_function, approval_right } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'name, email required' });
  const q = `insert into admin_staff(name,email,dept,level,view_scope,app_function,approval_right)
             values($1,$2,$3,$4,$5,$6,$7) returning *`;
  const r = await pool.query(q, [name, email, dept || 'HR', level || 'Executive', view_scope || 'Own records', app_function || 'Employee + Leave', approval_right || 'None']);
  res.status(201).json(r.rows[0]);
});

app.delete('/api/admin-staff/:id', async (req, res) => {
  await pool.query('delete from admin_staff where id=$1', [req.params.id]);
  res.status(204).send();
});

app.post('/api/ai/deepseek', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'prompt required' });
  if (!process.env.DEEPSEEK_API_KEY) return res.status(500).json({ error: 'Server missing DEEPSEEK_API_KEY' });

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are an HR analytics assistant.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3
    })
  });

  const data = await response.json();
  if (!response.ok) return res.status(response.status).json(data);
  res.json({ report: data?.choices?.[0]?.message?.content || '' });
});

app.listen(port, () => console.log(`API listening on :${port}`));
