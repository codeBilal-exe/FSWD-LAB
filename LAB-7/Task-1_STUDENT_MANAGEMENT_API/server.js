const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const {handleEcommerceApi} = require('../Task-2_ECOMMERCE_UI/ecommerce-api');

const ROOT = __dirname;
const STORE = path.resolve(ROOT, '..', 'Task-2_ECOMMERCE_UI');
const DB_FILE = path.join(ROOT, 'data', 'db.json');
const PORT = Number(process.env.PORT) || 3000;
const ecommerceResources =
    new Set(['products', 'customers', 'reviews', 'orders', 'cart']);
const collections = new Set([
  'students', 'teachers', 'attendance', 'marks', 'products', 'customers',
  'reviews', 'orders'
]);

function readDb() {
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDb(db) {
  const temporary = `${DB_FILE}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(db, null, 2)}\n`);
  fs.renameSync(temporary, DB_FILE);
}

function send(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}

function fail(res, status, message) {
  send(res, status, {error: message});
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(Object.assign(
            new Error('Request body is too large (1 MB max).'), {status: 413}));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(Object.assign(
            new Error('Request body must be valid JSON.'), {status: 400}));
      }
    });
    req.on('error', reject);
  });
}

function validRecord(collection, body) {
  if (!body || Array.isArray(body) || typeof body !== 'object')
    return 'Send a JSON object.';
  const required = {
    students: ['name'],
    teachers: ['name'],
    attendance: ['studentId', 'date', 'status'],
    marks: ['studentId', 'subject', 'score'],
    products: ['name', 'category', 'price'],
    customers: ['name', 'email'],
    reviews: ['productId', 'customerName', 'rating', 'comment'],
    orders: ['customerId', 'items']
  }[collection] ||
      [];
  const missing =
      required.filter(key => body[key] === undefined || body[key] === '');
  if (missing.length) return `Required fields: ${missing.join(', ')}.`;
  if (collection === 'attendance' &&
      !['present', 'absent', 'late'].includes(
          String(body.status).toLowerCase()))
    return 'status must be present, absent, or late.';
  if (collection === 'marks' &&
      (!Number.isFinite(Number(body.score)) || Number(body.score) < 0))
    return 'score must be a non-negative number.';
  if (collection === 'products' &&
      (!Number.isFinite(Number(body.price)) || Number(body.price) < 0))
    return 'price must be a non-negative number.';
  if (collection === 'reviews' &&
      (!Number.isInteger(Number(body.rating)) || Number(body.rating) < 1 ||
       Number(body.rating) > 5))
    return 'rating must be an integer from 1 to 5.';
  if (collection === 'orders' && !Array.isArray(body.items))
    return 'items must be an array.';
  return null;
}

function getProduct(db, id) {
  return db.products.find(item => item.id === Number(id));
}

async function handleApi(req, res, url) {
  const parts =
      url.pathname.split('/').filter(Boolean).slice(1);  // remove "api"
  const [resource, id, extra] = parts;
  const method = req.method;
  if (ecommerceResources.has(resource))
    return handleEcommerceApi(req, res, url, DB_FILE);
  const db = readDb();

  if (resource === 'cart') {
    const customerId = Number(id);
    if (!Number.isInteger(customerId) || customerId < 1)
      return fail(res, 400, 'Use /api/cart/:customerId.');
    const cart = db.carts[String(customerId)] || [];
    if (method === 'GET' && !extra)
      return send(res, 200, {customerId, items: cart});
    if (method === 'POST' && !extra) {
      const body = await readBody(req);
      const product = getProduct(db, body.productId);
      const quantity = Number(body.quantity ?? 1);
      if (!product) return fail(res, 404, 'Product not found.');
      if (!Number.isInteger(quantity) || quantity < 1)
        return fail(res, 400, 'quantity must be a positive integer.');
      const line = cart.find(item => item.productId === product.id);
      const nextQuantity = (line?.quantity || 0) + quantity;
      if (nextQuantity > product.stock)
        return fail(res, 409, 'Requested quantity exceeds available stock.');
      if (line)
        line.quantity = nextQuantity;
      else
        cart.push({productId: product.id, quantity});
      db.carts[String(customerId)] = cart;
      writeDb(db);
      return send(res, 201, {customerId, items: cart});
    }
    if (method === 'PATCH' && extra) {
      const body = await readBody(req);
      const line = cart.find(item => item.productId === Number(extra));
      const quantity = Number(body.quantity);
      if (!line) return fail(res, 404, 'Cart item not found.');
      const product = getProduct(db, extra);
      if (!Number.isInteger(quantity) || quantity < 1)
        return fail(res, 400, 'quantity must be a positive integer.');
      if (quantity > product.stock)
        return fail(res, 409, 'Requested quantity exceeds available stock.');
      line.quantity = quantity;
      db.carts[String(customerId)] = cart;
      writeDb(db);
      return send(res, 200, {customerId, items: cart});
    }
    if (method === 'DELETE') {
      if (extra)
        db.carts[String(customerId)] =
            cart.filter(item => item.productId !== Number(extra));
      else
        db.carts[String(customerId)] = [];
      writeDb(db);
      return send(res, 200, {customerId, items: db.carts[String(customerId)]});
    }
    return fail(res, 405, 'Method not allowed for cart.');
  }

  if (!collections.has(resource)) return fail(res, 404, 'API route not found.');
  const records = db[resource];
  if (method === 'GET' && !id) return send(res, 200, records);
  if (method === 'GET' && id) {
    const record = records.find(item => item.id === Number(id));
    return record ? send(res, 200, record) :
                    fail(res, 404, `${resource.slice(0, -1)} not found.`);
  }
  if (method === 'POST' && !id) {
    const body = await readBody(req);
    const error = validRecord(resource, body);
    if (error) return fail(res, 400, error);
    const record = {
      ...body,
      id: Math.max(0, ...records.map(item => Number(item.id) || 0)) + 1,
      createdAt: new Date().toISOString()
    };
    records.push(record);
    writeDb(db);
    return send(res, 201, record);
  }
  if ((method === 'PUT' || method === 'PATCH') && id) {
    const index = records.findIndex(item => item.id === Number(id));
    if (index < 0) return fail(res, 404, `${resource.slice(0, -1)} not found.`);
    const body = await readBody(req);
    if (!body || Array.isArray(body) || typeof body !== 'object')
      return fail(res, 400, 'Send a JSON object.');
    const updated = {
      ...records[index],
      ...body,
      id: records[index].id,
      updatedAt: new Date().toISOString()
    };
    const error = validRecord(resource, updated);
    if (error) return fail(res, 400, error);
    records[index] = updated;
    writeDb(db);
    return send(res, 200, updated);
  }
  if (method === 'DELETE' && id) {
    const index = records.findIndex(item => item.id === Number(id));
    if (index < 0) return fail(res, 404, `${resource.slice(0, -1)} not found.`);
    const [deleted] = records.splice(index, 1);
    writeDb(db);
    return send(res, 200, {message: 'Record deleted.', record: deleted});
  }
  return fail(res, 405, 'Method not allowed for this route.');
}

function serveStatic(req, res, url) {
  const pathname =
      decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
  const file = path.resolve(STORE, `.${pathname}`);
  if (!file.startsWith(`${path.resolve(STORE)}${path.sep}`) &&
      file !== path.resolve(STORE, 'index.html')) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  fs.readFile(file, (error, content) => {
    if (error) {
      res.writeHead(404);
      return res.end('Not found');
    }
    const types = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8'
    };
    res.writeHead(200, {
      'Content-Type': types[path.extname(file)] || 'application/octet-stream'
    });
    res.end(content);
  });
}

let apiQueue = Promise.resolve();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    if (url.pathname.startsWith('/api/')) {
      const current = apiQueue.then(() => handleApi(req, res, url));
      apiQueue = current.catch(() => {});
      return await current;
    }
    if (req.method !== 'GET' && req.method !== 'HEAD')
      return fail(res, 405, 'Use GET for storefront pages.');
    return serveStatic(req, res, url);
  } catch (error) {
    if (!res.headersSent)
      fail(
          res, error.status || 500,
          error.status ? error.message : 'Internal server error.');
    else
      res.destroy();
  }
});

server.listen(
    PORT, () => console.log(`Lab 7 running at http://localhost:${PORT}`));
