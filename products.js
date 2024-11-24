const path = require('path');
const Products = require('./products'); // Ensure this module exists
const Orders = require('./orders'); // Ensure this module exists
const autoCatch = require('./lib/auto-catch'); // Ensure this middleware exists

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
 */
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query;
  const products = await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag,
  });
  res.json(products);
}

/**
 * Get a single product
 * @param {object} req
 * @param {object} res
 */
async function getProduct(req, res, next) {
  const { id } = req.params;
  const product = await Products.get(id);
  if (!product) return next(); // Pass to a 404 handler if not found
  res.json(product);
}

/**
 * Create a product
 * @param {object} req
 * @param {object} res
 */
async function createProduct(req, res) {
  const product = await Products.create(req.body);
  res.json(product);
}

/**
 * Edit a product
 * @param {object} req
 * @param {object} res
 */
async function editProduct(req, res) {
  const changes = req.body;
  const product = await Products.edit(req.params.id, changes);
  res.json(product);
}

/**
 * Delete a product
 * @param {object} req
 * @param {object} res
 */
async function deleteProduct(req, res) {
  const response = await Products.destroy(req.params.id);
  res.json(response);
}

/**
 * Create an order
 * @param {object} req
 * @param {object} res
 */
async function createOrder(req, res) {
  const order = await Orders.create(req.body);
  res.json(order);
}

/**
 * List all orders
 * @param {object} req
 * @param {object} res
 */
async function listOrders(req, res) {
  const { offset = 0, limit = 25, productId, status } = req.query;
  const orders = await Orders.list({
    offset: Number(offset),
    limit: Number(limit),
    productId,
    status,
  });
  res.json(orders);
}

/**
 * Edit an order
 * @param {object} req
 * @param {object} res
 */
async function editOrder(req, res) {
  const changes = req.body;
  const order = await Orders.edit(req.params.id, changes);
  res.json(order);
}

/**
 * Delete an order
 * @param {object} req
 * @param {object} res
 */
async function deleteOrder(req, res) {
  const response = await Orders.destroy(req.params.id);
  res.json(response);
}

/**
 * Export all handlers with error handling
 */
module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,
  listOrders,
  createOrder,
  editOrder,
  deleteOrder,
});