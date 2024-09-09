import express, { Request, Response } from 'express';
import { users } from './data/users';
import { accounts } from './data/accounts';
import { Account, User } from './types';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint Prueba
app.get('/', (req: Request, res: Response) => {
    res.send('Hola');
});

// Endpoints Accounts
// GET /api/accounts
app.get('/api/accounts', (req, res) => {
    res.json(accounts);
});

// GET /api/accounts/:id
app.get('/api/accounts/:id', (req, res) => {
    const account = accounts.find(a => a.id === parseInt(req.params.id));
    if (account) {
        res.json(account);
    } else {
        res.status(404).send('Cuenta no encontrada');
    }
});

// POST /api/accounts
app.post('/api/accounts', (req, res) => {
    const newAccount: Account = req.body;

    // Validación básica para asegurarse de que todos los campos estén presentes
    if (!newAccount.id || !newAccount.name || !newAccount.cedula_usuario || newAccount.balance === undefined) {
        return res.status(400).send('Datos incompletos');
    }

    // Verificar si la cuenta ya existe
    const existingAccount = accounts.find(a => a.id === newAccount.id);

    if (existingAccount) {
        res.status(400).send('La cuenta ya existe');
    } else {
        accounts.push(newAccount);
        res.status(201).json(newAccount);
    }
});

// DELETE /api/accounts/:id
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

// GET /api/user
app.get('/api/user', (req, res) => {
    res.json(users);
});

// GET /api/user/find/:id
app.get('/api/user/find/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('Usuario no encontrado');
    }
});

// PUT /api/user/update/:id
app.put('/api/user/update/:id', (req: express.Request, res: express.Response) => {
    
    const index = users.findIndex(u => u.id === req.params.id);
    
    if (index !== -1) {
        const updatedUser: User = req.body;
        console.log(updatedUser)
        if (!updatedUser.name || !updatedUser.lastname || !updatedUser.email) {
            return res.status(400).send('Datos incompletos');
        }
        users[index] = { ...users[index], ...updatedUser };
        res.json(users[index]);
    } else {
        res.status(404).send('Usuario no encontrado');
    }
});

// POST /api/user/save
app.post('/api/user/save', (req, res) => {

    console.log(req.body)
    const newUser: User = req.body;

    if (!newUser.id || !newUser.name || !newUser.lastname || !newUser.email) {
        return res.status(400).send('Datos incompletos');
    }

    // Verificar si el usuario ya existe
    const existingUser = users.find(u => u.id === newUser.id);

    if (existingUser) {
        return res.status(400).send('El usuario ya existe');
    } else {
        users.push(newUser);
        res.status(201).json(newUser);
    }
});

// DELETE /api/user/:id
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