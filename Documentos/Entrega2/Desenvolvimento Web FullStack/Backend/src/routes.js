import { Router } from 'express';
import upload from './uploadConfig.js';
import { verifyTokenMiddleware } from './middlewares/authMiddleware.js';
import {
  register,
  login,
  logout,
  forgotPassword,
} from './controllers/authController.js';
import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  profile,
  updateMe,
} from './controllers/usuarioController.js';

const r = Router();

// ----- Rotas publicas (sem autenticacao) -----
r.post('/auth/register', upload.single('img'), register);
r.post('/auth/login', login);
r.post('/auth/forgot-password', forgotPassword);

// ----- Rotas protegidas (precisa de token) -----
r.post('/auth/logout', verifyTokenMiddleware, logout);

// Perfil do usuario logado
r.get('/usuarios/profile', verifyTokenMiddleware, profile);
r.put('/usuarios/me', verifyTokenMiddleware, upload.single('img'), updateMe);

// CRUD de usuarios
r.get('/usuarios', getUsuarios); // aberta - lista publica
r.get('/usuarios/:id', verifyTokenMiddleware, getUsuarioById);
r.post('/usuarios', verifyTokenMiddleware, upload.single('img'), createUsuario);
r.put('/usuarios/:id', verifyTokenMiddleware, upload.single('img'), updateUsuario);
r.delete('/usuarios/:id', verifyTokenMiddleware, deleteUsuario);

export default r;
