import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import { getProdutos } from '../api/productsApi.js';

export default function SupplierDashboardPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    titulo: '',
    idCategoria: '',
    descricao: '',
    preco: '',
    estoque: '',
  });

  const [categories, setCategories] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [imagem, setImagem] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [produtosData, categoriasRes] = await Promise.all([
        getProdutos(),
        fetch('http://localhost:3000/api/categorias').then(r => r.json()),
      ]);
      setProdutos(produtosData);
      setCategories(categoriasRes);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titulo || !formData.idCategoria || !formData.preco) {
      showMessage('Preencha os campos obrigatórios', 'error');
      return;
    }

    try {
      const fd = new FormData();
      fd.append('idCategoria', parseInt(formData.idCategoria));
      fd.append('titulo', formData.titulo);
      fd.append('descricao', formData.descricao);
      fd.append('preco', parseFloat(formData.preco));
      fd.append('estoque', parseInt(formData.estoque) || 0);
      if (imagem) {
        fd.append('imagem', imagem);
      }

      const response = await fetch('http://localhost:3000/api/produtos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: fd,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar produto');
      }

      showMessage('Produto publicado com sucesso!', 'success');
      setFormData({ titulo: '', idCategoria: '', descricao: '', preco: '', estoque: '' });
      setImagem(null);
      loadData();
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className="space-y-8">
      {/* Novo Produto Section */}
      <div className="bg-marketplace-paper border border-marketplace-cream rounded-xl p-8">
        <h2 className="text-lg font-bold text-marketplace-ink mb-6 flex items-center gap-2">
          ➕ Novo Produto
        </h2>

        {message && (
          <div
            className={`p-3 rounded-lg mb-4 text-sm font-medium ${
              message.type === 'error'
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-green-50 text-green-800 border border-green-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-marketplace-muted uppercase mb-2">
              Título do Produto *
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              placeholder="Ex: Amendoim Torrado"
              className="w-full px-3 py-2 border border-marketplace-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-marketplace-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-marketplace-muted uppercase mb-2">
              Categoria *
            </label>
            <select
              name="idCategoria"
              value={formData.idCategoria}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-marketplace-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-marketplace-accent"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map(cat => (
                <option key={cat.idCategoria} value={cat.idCategoria}>
                  {cat.nomeCategoria}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-marketplace-muted uppercase mb-2">
              Descrição
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              placeholder="Descreva seu produto..."
              className="w-full px-3 py-2 border border-marketplace-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-marketplace-accent resize-none min-h-20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-marketplace-muted uppercase mb-2">
              Imagem do Produto
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagem(e.target.files[0])}
              className="w-full px-3 py-2 border border-dashed border-marketplace-cream rounded-lg bg-marketplace-cream text-xs text-marketplace-muted cursor-pointer hover:bg-marketplace-gold transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-marketplace-muted uppercase mb-2">
              Preço (R$) *
            </label>
            <input
              type="number"
              name="preco"
              value={formData.preco}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              className="w-full px-3 py-2 border border-marketplace-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-marketplace-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-marketplace-muted uppercase mb-2">
              Estoque
            </label>
            <input
              type="number"
              name="estoque"
              value={formData.estoque}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-marketplace-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-marketplace-accent"
            />
          </div>

          <button
            type="submit"
            className="md:col-span-2 py-3 bg-marketplace-accent text-white font-bold rounded-lg hover:bg-marketplace-accent-dark transition"
          >
            📤 Publicar Produto
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Produtos Ativos" value={produtos.filter(p => p.ativo).length} />
        <StatCard label="Total de Produtos" value={produtos.length} />
        <StatCard
          label="Avaliação Média"
          value={
            produtos.length > 0 && produtos.some(p => p.avaliacao > 0)
              ? (produtos.reduce((sum, p) => sum + (p.avaliacao || 0), 0) / produtos.filter(p => p.avaliacao > 0).length).toFixed(1)
              : '-'
          }
        />
        <StatCard label="Clientes" value={produtos.length > 0 ? produtos.reduce((sum, p) => sum + (p.vendas || 0), 0) : '0'} />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-marketplace-cream p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-marketplace-cream">
          <h2 className="text-lg font-bold text-marketplace-ink">📦 Seus Produtos</h2>
          <span className="text-sm text-marketplace-muted">
            {produtos.length} produto{produtos.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-marketplace-muted">Carregando...</div>
          </div>
        ) : produtos.length === 0 ? (
          <div className="text-center py-12 text-marketplace-muted">
            <p className="text-lg mb-2">Nenhum produto publicado ainda</p>
            <p className="text-sm">Use o formulário acima para adicionar seu primeiro produto</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-marketplace-paper border-b border-marketplace-cream">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-marketplace-ink">Produto</th>
                  <th className="text-left px-4 py-3 font-bold text-marketplace-ink">Categoria</th>
                  <th className="text-left px-4 py-3 font-bold text-marketplace-ink">Preço</th>
                  <th className="text-left px-4 py-3 font-bold text-marketplace-ink">Estoque</th>
                  <th className="text-left px-4 py-3 font-bold text-marketplace-ink">Status</th>
                  <th className="text-left px-4 py-3 font-bold text-marketplace-ink">Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map(produto => (
                  <tr key={produto.idProduto} className="border-b border-marketplace-cream hover:bg-marketplace-paper transition">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-marketplace-ink">{produto.nomeProduto}</div>
                      <div className="text-xs text-marketplace-muted mt-1">
                        {new Date(produto.dataCriacao).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {produto.nomeCategoria || 'Sem categoria'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-marketplace-accent">
                      R$ {parseFloat(produto.preco).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">{produto.estoque || 0} un.</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium inline-flex items-center gap-1 ${
                          produto.ativo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <span className="inline-block w-2 h-2 rounded-full bg-current" />
                        {produto.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs font-semibold hover:bg-blue-200">
                          Editar
                        </button>
                        <button className="bg-red-100 text-red-800 px-3 py-1 rounded text-xs font-semibold hover:bg-red-200">
                          Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-marketplace-cream rounded-xl p-6 text-center shadow-sm">
      <div className="text-3xl font-bold text-marketplace-accent mb-2">{value}</div>
      <div className="text-xs font-semibold text-marketplace-muted uppercase tracking-wide">{label}</div>
    </div>
  );
}
