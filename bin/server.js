// ponto de entrada do servidor listen e porta

const app = require('../src/app'); // importar aplicação
const http = require('http'); // criar servidor HTTP
const debug = require('debug');

// criar aplicacao
const port = normalizePort(process.env.PORT || '3000'); // definir porta, se não existir, usar 3000
app.set('port', port);

const server = http.createServer(app); // criar servidor

server.listen(port); // iniciar ouvir servidor
server.on('error', onError); // evento error tratar erros
server.on('listening', onListening); // evento listening logar quando estiver ouvindo
console.log(`Servidor rodando na porta ${port}`); // logar porta

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') throw error;
  const bind = typeof port === 'string' ? `Pipe ` + port : `Port ` + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `Pipe ` + addr : `Port ` + addr.port;
  debug('Listening on ' + bind);
}

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Node - Loja',
      version: '1.0.0',
      description: 'Documentação das rotas da API (Clientes, Produtos , Pedidos)'
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'apiKey',
          name: 'x-access-token',
          in: 'header'
        }
      },
      schemas: {
        Product: {
          type: 'object',
          required: ['title', 'slug', 'price', 'active', 'tags', 'description'],
          properties: {
            title: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            active: { type: 'boolean' },
            tags: {
              type: 'array',
              items: { type: 'string' }
            },
            image: { type: 'string' }
          }
        },
        Customer: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' }
          }
        },
        OrderItem: {
            type: 'object',
            required: ['product', 'quantity', 'price'],
          properties: {
            product: { type: 'string' },
            quantity: { type: 'number' },
            price: { type: 'number' }
          }
        },
        Order: {
          type: 'object',
          required: ['items', 'customer', 'status'],
          properties: {
            customer: { type: 'string' },
            status: { type: 'string', enum: ['created', 'done'] },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/OrderItem' }
            }
          }
        }
      }
    },
    security: [
      { bearerAuth: [] }
    ],
    tags: [
      { name: 'Clientes', description: 'Gestão de clientes' },
      { name: 'Produtos', description: 'Gestão de produtos' },
      { name: 'Pedidos', description: 'Gestão de pedidos' }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));