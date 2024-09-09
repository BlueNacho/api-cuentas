import express, { Request, Response } from 'express';
import { users } from './data/users';
import { accounts } from './data/accounts';
import { Account, User } from './types';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Definición de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Banco API',
            version: '1.0.0',
            description: 'API de un banco para la gestión de usuarios y cuentas',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor local'
            }
        ],
    },
    apis: ['./**/*.ts'], // Revisa esta ruta
};


const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Endpoint Prueba
app.get('/', (req: Request, res: Response) => {
    res.send('Hola');
});

// Endpoints Accounts
/**
 * @swagger
 * components:
 *   schemas:
 *     Account:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - cedula_usuario
 *         - balance
 *       properties:
 *         id:
 *           type: integer
 *           description: ID de la cuenta
 *         name:
 *           type: string
 *           description: Nombre de la cuenta
 *         cedula_usuario:
 *           type: string
 *           description: Cédula del usuario dueño de la cuenta
 *         balance:
 *           type: number
 *           description: Balance de la cuenta
 *       example:
 *         id: 1
 *         name: "Cuenta Corriente"
 *         cedula_usuario: "802-80-2354"
 *         balance: 460484.36
 */

/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summary: Obtiene todas las cuentas
 *     tags: [Account]
 *     responses:
 *       200:
 *         description: Lista de cuentas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Account'
 */
app.get('/api/accounts', (req, res) => {
    res.json(accounts);
});

/**
 * @swagger
 * /api/accounts/{id}:
 *   get:
 *     summary: Obtiene una cuenta por su ID
 *     tags: [Account]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la cuenta
 *     responses:
 *       200:
 *         description: Cuenta obtenida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       404:
 *         description: Cuenta no encontrada
 */
app.get('/api/accounts/:id', (req, res) => {
    const account = accounts.find(a => a.id === parseInt(req.params.id));
    if (account) {
        res.json(account);
    } else {
        res.status(404).send('Cuenta no encontrada');
    }
});

/**
 * @swagger
 * /api/accounts:
 *   post:
 *     summary: Crea una nueva cuenta
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Account'
 *     responses:
 *       201:
 *         description: Cuenta creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       400:
 *         description: Datos incompletos o la cuenta ya existe
 */
app.post('/api/accounts', (req, res) => {
    const newAccount: Account = req.body;

    if (!newAccount.id || !newAccount.name || !newAccount.cedula_usuario || newAccount.balance === undefined) {
        return res.status(400).send('Datos incompletos');
    }

    const existingAccount = accounts.find(a => a.id === newAccount.id);
    if (existingAccount) {
        res.status(400).send('La cuenta ya existe');
    } else {
        accounts.push(newAccount);
        res.status(201).json(newAccount);
    }
});

/**
 * @swagger
 * /api/accounts/{id}:
 *   delete:
 *     summary: Elimina una cuenta
 *     tags: [Account]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la cuenta
 *     responses:
 *       204:
 *         description: Cuenta eliminada
 *       404:
 *         description: Cuenta no encontrada
 */
app.delete('/api/accounts/:id', (req, res) => {
    const index = accounts.findIndex(a => a.id === parseInt(req.params.id));
    if (index !== -1) {
        accounts.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Cuenta no encontrada');
    }
});

// Endpoints Users
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - lastname
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: ID del usuario
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *         lastname:
 *           type: string
 *           description: Apellido del usuario
 *         email:
 *           type: string
 *           description: Correo electrónico del usuario
 *       example:
 *         id: "802-80-2354"
 *         name: "Marylou"
 *         lastname: "Baum"
 *         email: "mbaum0@blogtalkradio.com"
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get('/api/user', (req, res) => {
    res.json(users);
});

/**
 * @swagger
 * /api/user/find/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario obtenido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 */
app.get('/api/user/find/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('Usuario no encontrado');
    }
});

/**
 * @swagger
 * /api/user/update/{id}:
 *   put:
 *     summary: Actualiza un usuario por su ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos incompletos
 *       404:
 *         description: Usuario no encontrado
 */
app.put('/api/user/update/:id', (req, res) => {
    const index = users.findIndex(u => u.id === req.params.id);
    if (index !== -1) {
        const updatedUser: User = req.body;
        if (!updatedUser.name || !updatedUser.lastname || !updatedUser.email) {
            return res.status(400).send('Datos incompletos');
        }
        users[index] = { ...users[index], ...updatedUser };
        res.json(users[index]);
    } else {
        res.status(404).send('Usuario no encontrado');
    }
});

/**
 * @swagger
 * /api/user/save:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos incompletos o el usuario ya existe
 */
app.post('/api/user/save', (req, res) => {
    const newUser: User = req.body;
    if (!newUser.id || !newUser.name || !newUser.lastname || !newUser.email) {
        return res.status(400).send('Datos incompletos');
    }

    const existingUser = users.find(u => u.id === newUser.id);
    if (existingUser) {
        return res.status(400).send('El usuario ya existe');
    } else {
        users.push(newUser);
        res.status(201).json(newUser);
    }
});

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Elimina un usuario por su ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       204:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 */
app.delete('/api/user/:id', (req, res) => {
    const index = users.findIndex(u => u.id === req.params.id);
    if (index !== -1) {
        users.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Usuario no encontrado');
    }
});

const APP_PORT = 3000;

app.listen(APP_PORT, () => {
    console.log(`Server started on port ${APP_PORT}`);
});

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
