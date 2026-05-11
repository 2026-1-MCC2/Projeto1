import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi.js';
import { useToast } from '../contexts/ToastContext.jsx';

export default function RegisterPage() {
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nomeUsuario: '',
    email: '',
    senha: '',
    contato: '',
    tipoUsuario: '2',
  });
  const [imagem, setImagem] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.nomeUsuario || !form.email || !form.senha) {
      setError('Nome, email e senha sao obrigatorios');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imagem) fd.append('img', imagem);

      await authApi.register(fd);
      toast.success('Conta criada com sucesso! Faca login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-12 pb-12 px-4">
      <div className="bg-white border border-brand-200 rounded-2xl p-8 w-full max-w-md shadow-sm">
        <h1 className="text-xl font-semibold mb-1">Criar conta</h1>
        <p className="text-sm text-gray-500 mb-5">Preencha seus dados</p>

        <form onSubmit={onSubmit} className="space-y-3">
          <Field label="Nome">
            <input
              type="text"
              value={form.nomeUsuario}
              onChange={(e) => update('nomeUsuario', e.target.value)}
              className={fieldClass}
              placeholder="Seu nome completo"
            />
          </Field>

          <Field label="E-mail">
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              className={fieldClass}
              placeholder="seu@email.com"
            />
          </Field>

          <Field label="Senha">
            <input
              type="password"
              value={form.senha}
              onChange={(e) => update('senha', e.target.value)}
              className={fieldClass}
              placeholder="********"
            />
          </Field>

          <Field label="Contato">
            <input
              type="text"
              value={form.contato}
              onChange={(e) => update('contato', e.target.value)}
              className={fieldClass}
              placeholder="(11) 99999-9999"
            />
          </Field>

          <Field label="Tipo de usuario">
            <select
              value={form.tipoUsuario}
              onChange={(e) => update('tipoUsuario', e.target.value)}
              className={fieldClass}
            >
              <option value="1">Administrador</option>
              <option value="2">Comprador</option>
              <option value="3">Fornecedor</option>
            </select>
          </Field>

          <Field label="Foto (opcional)">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagem(e.target.files[0])}
              className="w-full px-3 py-2 border border-dashed border-brand-200 rounded-lg bg-brand-100 text-xs text-gray-600 cursor-pointer"
            />
          </Field>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-brand-900 text-white rounded-lg font-medium text-sm hover:bg-black disabled:opacity-50 transition"
          >
            {loading ? 'Criando...' : 'Criar conta'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Ja tem conta?{' '}
          <Link to="/login" className="text-brand-900 font-medium hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}

const fieldClass =
  'w-full px-3 py-2.5 border border-brand-200 rounded-lg bg-brand-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900';

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-wider text-gray-500 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
