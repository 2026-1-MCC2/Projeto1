import { useEffect, useState } from 'react';
import { authApi } from '../api/authApi.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import Avatar from '../components/Avatar.jsx';
import PurchaseHistoryPage from './PurchaseHistoryPage.jsx';
import SupplierDashboardPage from './SupplierDashboardPage.jsx';

export default function PerfilPage() {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const isAdmin = user?.tipoUsuario === 1;
  const isComprador = user?.tipoUsuario === 2;
  const isFornecedor = user?.tipoUsuario === 3;

  // Define aba padrão conforme tipo de usuário
  const defaultTab = isFornecedor ? 'fornecedor' : 'perfil';
  const [activeTab, setActiveTab] = useState(defaultTab);

  const [perfil, setPerfil] = useState(null);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [nomeUsuario, setNomeUsuario] = useState('');
  const [contato, setContato] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [imagem, setImagem] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await authApi.profile();
        setPerfil(data);
        setNomeUsuario(data.nomeUsuario || '');
        setContato(data.contato || '');
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao carregar perfil');
      } finally {
        setLoadingFetch(false);
      }
    })();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      if (nomeUsuario && nomeUsuario !== perfil.nomeUsuario)
        fd.append('nomeUsuario', nomeUsuario);
      if (contato !== perfil.contato) fd.append('contato', contato);
      if (novaSenha) {
        fd.append('senhaAtual', senhaAtual);
        fd.append('novaSenha', novaSenha);
      }
      if (imagem) fd.append('img', imagem);

      const { data } = await authApi.updateMe(fd);
      setPerfil(data);
      updateUser({
        id: data.idUsuario,
        nomeUsuario: data.nomeUsuario,
        email: data.email,
        contato: data.contato,
        img: data.img,
        tipoUsuario: data.tipoUsuario,
      });
      setSenhaAtual('');
      setNovaSenha('');
      setImagem(null);
      toast.success('Perfil atualizado!');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loadingFetch) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-marketplace-muted">
        Carregando perfil...
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          {error || 'Perfil indisponivel'}
        </div>
      </div>
    );
  }

  const tabButtonClass = (tab) =>
    `px-4 py-2.5 text-sm font-medium rounded-lg transition ${
      activeTab === tab
        ? 'bg-marketplace-accent text-white'
        : 'bg-marketplace-cream text-marketplace-ink hover:bg-marketplace-gold'
    }`;

  return (
    <div className="min-h-screen bg-marketplace-paper">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Card de Perfil */}
        <div className="bg-white border border-marketplace-cream rounded-xl p-8 mb-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Avatar user={perfil} size="lg" />
              <div>
                <div className="text-2xl font-bold text-marketplace-ink">{perfil.nomeUsuario}</div>
                <div className="text-sm text-marketplace-muted font-mono mt-1">{perfil.email}</div>
                <div className="text-xs text-marketplace-muted mt-2">
                  Membro desde {new Date(perfil.dataCadastro).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab('perfil')}
            className={tabButtonClass('perfil')}
          >
            📋 Meus Dados
          </button>

          {isComprador && (
            <button
              onClick={() => setActiveTab('compras')}
              className={tabButtonClass('compras')}
            >
              🛒 Histórico de Compras
            </button>
          )}

          {isFornecedor && (
            <button
              onClick={() => setActiveTab('fornecedor')}
              className={tabButtonClass('fornecedor')}
            >
              🏪 Minha Loja
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setActiveTab('usuarios')}
              className={tabButtonClass('usuarios')}
            >
              👥 Gerenciar Usuários
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'perfil' && (
          <form onSubmit={onSubmit} className="bg-white border border-marketplace-cream rounded-xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-marketplace-ink border-b border-marketplace-cream pb-4 mb-6">
              ✏️ Atualizar Dados Pessoais
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Field label="Nome de Usuário">
                <input
                  type="text"
                  value={nomeUsuario}
                  onChange={(e) => setNomeUsuario(e.target.value)}
                  className={fieldClass}
                />
              </Field>

              <Field label="Contato">
                <input
                  type="text"
                  value={contato}
                  onChange={(e) => setContato(e.target.value)}
                  className={fieldClass}
                />
              </Field>
            </div>

            <Field label="Foto de Perfil">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagem(e.target.files[0])}
                className="w-full px-4 py-3 border border-dashed border-marketplace-cream rounded-lg bg-marketplace-cream text-xs text-marketplace-muted cursor-pointer hover:bg-marketplace-gold transition"
              />
            </Field>

            <h3 className="text-lg font-bold text-marketplace-ink border-b border-marketplace-cream pb-4 mb-6 mt-8">
              🔐 Segurança
            </h3>

            <p className="text-sm text-marketplace-muted mb-6">Deixe em branco se não deseja alterar a senha</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Field label="Senha Atual">
                <input
                  type="password"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  className={fieldClass}
                />
              </Field>

              <Field label="Nova Senha">
                <input
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className={fieldClass}
                />
              </Field>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 mb-6">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-8 py-3 bg-marketplace-accent text-white rounded-lg font-bold text-sm hover:bg-marketplace-accent-dark disabled:opacity-50 transition"
            >
              {loading ? '💾 Salvando...' : '💾 Salvar Alterações'}
            </button>
          </form>
        )}

        {activeTab === 'compras' && isComprador && (
          <PurchaseHistoryPage />
        )}

        {activeTab === 'fornecedor' && isFornecedor && (
          <div className="bg-white border border-marketplace-cream rounded-xl shadow-sm overflow-hidden">
            <SupplierDashboardPage />
          </div>
        )}
      </div>
    </div>
  );
}

const fieldClass =
  'w-full px-4 py-2.5 border border-marketplace-cream rounded-lg bg-marketplace-cream text-sm text-marketplace-ink focus:outline-none focus:ring-2 focus:ring-marketplace-accent transition';

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-marketplace-muted mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
