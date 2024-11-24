const fs = require('fs').promises
const path = require('path')
const cuid = require('cuid)')
const db = require('./db')
const productsFile = path.join(__dirname, 'data/full-products.json')

// Define our Product Model
const Product = db.model('Product', {
  _id: { type: String, default: cuid },
  description: { type: String },
  alt_description: { type: String },
  likes: { type: Number, required: true },
  urls: {
    regular: { type: String, required: true },
    small: { type: String, required: true },
    thumb: { type: String, required: true },
  },
  links: {
    self: { type: String, required: true },
    html: { type: String, required: true },
  },
  user: {
    id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String },
    portfolio_url: { type: String },
    username: { type: String, required: true },
  },
  tags: [{
    title: { type: String, required: true },
  }], 
})


/**
 * List products
 * @param {*} options 
 * @returns 
 */
async function list(options = {}) {

  const { offset = 0, limit = 25, tag } = options;

  const query = tag ? {
    tags: {
      $elemMatch: {
        title: tag
      }
    }
  } : {}
  const products = await Product.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit)

  return products
}

/**
 * Get a single product
 * @param {string} id
 * @returns {Promise<object>}
 */
async function get(id) {
  const product = await Product.findById(_id)
  return product
}

async function create (fields) {
  const product = await new Product(fields).save()
  return product
}

async function edit (_id, change) {
  const product = await get(_id)

  // todo can we use spread operators here?
  Object.keys(change).forEach(function (key) {
    product[key] = change[key]
  })

  await product.save()

  return product
}
async function destroy (_id) {
  return await Product.deleteOne({_id})
}
module.exports = {
  list,
  get,
  edit,
  destroy,
}

app.js

const express = require('express')
const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')

// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()
// Register the public directory
app.use(express.static(__dirname + '/public'));
// register the routes
app.use(bodyParser.json())
app.use(middleware.cors)
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.put('/products/:id', api.editProduct)
app.delete('/products/:id', api.deleteProduct)
app.post('/products', api.createProduct)
// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))
