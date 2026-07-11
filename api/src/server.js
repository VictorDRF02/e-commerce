import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');
const dataFile = resolve(rootDir, 'data/db.json');
const uploadsDir = resolve(rootDir, 'public/uploads');
const port = Number(process.env.PORT ?? 3000);
const apiPrefix = '/api';
const jwtSecret = process.env.JWT_SECRET ?? 'e-commerce-secret';

const app = express();

app.use(cors());
app.use(express.json());
app.use(`${apiPrefix}/uploads`, express.static(uploadsDir));

let db = await loadDb();

app.get(`${apiPrefix}/health`, (_req, res) => {
  res.json({ ok: true });
});

app.post(`${apiPrefix}/auth/login`, (req, res) => {
  const { username, password } = req.body ?? {};
  const user = db.users.find((item) => item.username === username && item.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    {
      sub: String(user.id),
      username: user.username,
    },
    jwtSecret,
    { expiresIn: '1d' }
  );

  return res.json({ token });
});

app.get(`${apiPrefix}/users`, (_req, res) => {
  res.json(db.users);
});

app.get(`${apiPrefix}/users/:id`, (req, res) => {
  const id = Number(req.params.id);
  const user = db.users.find((item) => item.id === id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json(user);
});

app.get(`${apiPrefix}/products`, (req, res) => {
  const id = req.query.id ? Number(req.query.id) : null;

  if (id) {
    const product = db.products.find((item) => item.id === id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  }

  return res.json(db.products);
});

app.post(`${apiPrefix}/products`, async (req, res) => {
  const product = normalizeProduct(req.body ?? {}, nextProductId());
  db.products.push(product);
  await persistDb();
  return res.status(201).json(product);
});

app.put(`${apiPrefix}/products`, async (req, res) => {
  const id = Number(req.query.id);
  const index = db.products.findIndex((item) => item.id === id);

  if (index < 0) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const updatedProduct = normalizeProduct({ ...db.products[index], ...req.body, id }, id);
  db.products[index] = updatedProduct;
  await persistDb();
  return res.json(updatedProduct);
});

app.delete(`${apiPrefix}/products`, async (req, res) => {
  const id = Number(req.query.id);
  const index = db.products.findIndex((item) => item.id === id);

  if (index < 0) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const [deletedProduct] = db.products.splice(index, 1);
  await persistDb();
  return res.json(deletedProduct);
});

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.listen(port, () => {
  console.log(`E-commerce API running on http://localhost:${port}${apiPrefix}`);
});

async function loadDb() {
  if (!existsSync(dataFile)) {
    return { users: [], products: [] };
  }

  const raw = await readFile(dataFile, 'utf-8');
  return JSON.parse(raw);
}

async function persistDb() {
  await writeFile(dataFile, `${JSON.stringify(db, null, 2)}\n`, 'utf-8');
}

function nextProductId() {
  return db.products.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

function normalizeProduct(product, fallbackId) {
  return {
    id: Number(product.id ?? fallbackId),
    title: String(product.title ?? '').trim(),
    price: Number(product.price ?? 0),
    description: String(product.description ?? '').trim(),
    category: String(product.category ?? '').trim(),
    image: String(product.image ?? 'placeholder.svg').trim(),
    rating: product.rating
      ? {
          rate: Number(product.rating.rate ?? 0),
          count: Number(product.rating.count ?? 0),
        }
      : undefined,
    quantity: product.quantity ? Number(product.quantity) : undefined,
  };
}