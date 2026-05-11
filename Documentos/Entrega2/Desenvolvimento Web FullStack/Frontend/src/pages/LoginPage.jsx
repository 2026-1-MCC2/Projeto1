import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !senha) {
      setError('Preencha email e senha');
      return;
    }
    setLoading(true);
    try {
      await login(email, senha);
      toast.success('Bem-vindo!');
      navigate('/usuarios');
    } catch (err) {
      const msg = err.response?.data?.error || 'Erro ao fazer login';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-16 px-4">
      <div className="bg-white border border-brand-200 rounded-2xl p-8 w-full max-w-md shadow-sm">
        <div className="flex items-center gap-3 mb-7">
          <div className="w-10 h-10 bg-brand-900 rounded-lg flex items-center justify-center text-white font-mono text-sm">
            TF
          </div>
          <div>
            <div className="font-semibold">TechFood</div>
            <div className="text-xs text-gray-500 font-mono">Marketplace</div>
          </div>
        </div>

        <h1 className="text-xl font-semibold mb-1">Entrar</h1>
        <p className="text-sm text-gray-500 mb-5">Acesse sua conta para continuar</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-gray-500 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-brand-200 rounded-lg bg-brand-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
              placeholder="seu@email.com"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-gray-500 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-3 py-2.5 border border-brand-200 rounded-lg bg-brand-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
              placeholder="********"
            />
          </div>

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
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-2 text-xs text-gray-400 font-mono">
          <div className="flex-1 h-px bg-brand-200" />
          ou
          <div className="flex-1 h-px bg-brand-200" />
        </div>

        <Link
          to="/registro"
          className="block w-full text-center py-2.5 bg-brand-100 text-brand-900 rounded-lg font-medium text-sm hover:bg-brand-200 transition"
        >
          Criar nova conta
        </Link>
      </div>
    </div>
  );
}
