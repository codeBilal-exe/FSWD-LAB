// Persistent e-commerce API routes used by the Lab 7 Node server.
const fs = require('node:fs');

const routes = new Set(['products', 'customers', 'reviews', 'orders']);

const send = (res, status, body) => {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(body));
};
const error = (res, status, message) => send(res, status, {error: message});
const readDb = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeDb = (file, db) => {
  const temp = `${file}.tmp`;
  fs.writeFileSync(temp, `${JSON.stringify(db, null, 2)}\n`);
  fs.renameSync(temp, file);
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 1_000_000)
        reject(Object.assign(
            new Error('Request body is too large (1 MB max).'), {status: 413}));
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(Object.assign(
            new Error('Request body must be valid JSON.'), {status: 400}));
      }
    });
    req.on('error', reject);
  });
}

function validate(resource, body) {
  if (!body || Array.isArray(body) || typeof body !== 'object')
    return 'Send a JSON object.';
  const fields = {
    products: ['name', 'category', 'price'],
    customers: ['name', 'email'],
    reviews: ['productId', 'customerName', 'rating', 'comment'],
    orders: ['customerId', 'items']
  }[resource];
  const missing =
      fields.filter(key => body[key] === undefined || body[key] === '');
  if (missing.length) return `Required fields: ${missing.join(', ')}.`;
  if (resource === 'products' &&
      (!Number.isFinite(Number(body.price)) || Number(body.price) < 0))
    return 'price must be a non-negative number.';
  if (resource === 'reviews' &&
      (!Number.isInteger(Number(body.rating)) || Number(body.rating) < 1 ||
       Number(body.rating) > 5))
    return 'rating must be an integer from 1 to 5.';
  if (resource === 'orders' && !Array.isArray(body.items))
    return 'items must be an array.';
  return null;
}

async function handleCart(req, res, parts, file) {
  const customerId = Number(parts[1]);
  const productId = parts[2] ? Number(parts[2]) : null;
  if (!Number.isInteger(customerId) || customerId < 1)
    return error(res, 400, 'Use /api/cart/:customerId.');
  const db = readDb(file);
  const items = db.carts[String(customerId)] || [];
  if (req.method === 'GET' && !productId)
    return send(res, 200, {customerId, items});
  if (req.method === 'POST' && !productId) {
    const body = await readBody(req);
    const product =
        db.products.find(item => item.id === Number(body.productId));
    const quantity = Number(body.quantity ?? 1);
    if (!product) return error(res, 404, 'Product not found.');
    if (!Number.isInteger(quantity) || quantity < 1)
      return error(res, 400, 'quantity must be a positive integer.');
    const line = items.find(item => item.productId === product.id);
    if ((line?.quantity || 0) + quantity > product.stock)
      return error(res, 409, 'Requested quantity exceeds available stock.');
    if (line)
      line.quantity += quantity;
    else
      items.push({productId: product.id, quantity});
    db.carts[String(customerId)] = items;
    writeDb(file, db);
    return send(res, 201, {customerId, items});
  }
  if (req.method === 'PATCH' && productId) {
    const body = await readBody(req);
    const line = items.find(item => item.productId === productId);
    const product = db.products.find(item => item.id === productId);
    const quantity = Number(body.quantity);
    if (!line || !product) return error(res, 404, 'Cart item not found.');
    if (!Number.isInteger(quantity) || quantity < 1)
      return error(res, 400, 'quantity must be a positive integer.');
    if (quantity > product.stock)
      return error(res, 409, 'Requested quantity exceeds available stock.');
    line.quantity = quantity;
    db.carts[String(customerId)] = items;
    writeDb(file, db);
    return send(res, 200, {customerId, items});
  }
  if (req.method === 'DELETE') {
    db.carts[String(customerId)] =
        productId ? items.filter(item => item.productId !== productId) : [];
    writeDb(file, db);
    return send(res, 200, {customerId, items: db.carts[String(customerId)]});
  }
  return error(res, 405, 'Method not allowed for cart.');
}

async function handleEcommerceApi(req, res, url, file) {
  const parts = url.pathname.split('/').filter(Boolean).slice(1);
  const [resource, id] = parts;
  if (resource === 'cart') return handleCart(req, res, parts, file);
  if (!routes.has(resource))
    return error(res, 404, 'E-commerce API route not found.');
  const db = readDb(file);
  const records = db[resource];
  if (req.method === 'GET' && !id) return send(res, 200, records);
  if (req.method === 'GET' && id) {
    const record = records.find(item => item.id === Number(id));
    return record ? send(res, 200, record) :
                    error(res, 404, 'Record not found.');
  }
  if (req.method === 'POST' && !id) {
    const body = await readBody(req);
    const invalid = validate(resource, body);
    if (invalid) return error(res, 400, invalid);
    const record = {
      ...body,
      id: Math.max(0, ...records.map(item => Number(item.id) || 0)) + 1,
      createdAt: new Date().toISOString()
    };
    records.push(record);
    writeDb(file, db);
    return send(res, 201, record);
  }
  if ((req.method === 'PUT' || req.method === 'PATCH') && id) {
    const index = records.findIndex(item => item.id === Number(id));
    if (index < 0) return error(res, 404, 'Record not found.');
    const body = await readBody(req);
    const updated = {
      ...records[index],
      ...body,
      id: records[index].id,
      updatedAt: new Date().toISOString()
    };
    const invalid = validate(resource, updated);
    if (invalid) return error(res, 400, invalid);
    records[index] = updated;
    writeDb(file, db);
    return send(res, 200, updated);
  }
  if (req.method === 'DELETE' && id) {
    const index = records.findIndex(item => item.id === Number(id));
    if (index < 0) return error(res, 404, 'Record not found.');
    const [record] = records.splice(index, 1);
    writeDb(file, db);
    return send(res, 200, {message: 'Record deleted.', record});
  }
  return error(res, 405, 'Method not allowed for this route.');
}

module.exports = {handleEcommerceApi};
