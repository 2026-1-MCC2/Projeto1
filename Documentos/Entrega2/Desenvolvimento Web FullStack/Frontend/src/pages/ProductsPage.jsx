import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Filters from '../components/Filters.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Pagination from '../components/Pagination.jsx';
import { getProdutos } from '../api/productsApi.js';
import { useCart } from '../contexts/CartContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [produtos, setProdutos] = useState([]);
  const [filteredProdutos, setFilteredProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    categories: ['Premium Nuts'],
    priceMax: 300,
    ratingMin: null,
    inStock: false,
  });

  useEffect(() => {
    loadProdutos();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, produtos]);

  const loadProdutos = async () => {
    try {
      setLoading(true);
      const data = await getProdutos();
      setProdutos(data);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...produtos];

    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((p) => filters.categories.includes(p.categoria));
    }

    if (filters.priceMax) {
      filtered = filtered.filter((p) => p.preco <= filters.priceMax);
    }

    if (filters.ratingMin) {
      filtered = filtered.filter((p) => p.rating >= filters.ratingMin);
    }

    if (filters.inStock) {
      filtered = filtered.filter((p) => p.emEstoque === true);
    }

    setFilteredProdutos(filtered);
    setCurrentPage(1);
  };

  const handleAddCart = (idProduto) => {
    const product = produtos.find((p) => p.idProduto === idProduto);
    if (product) {
      addItem(product, 1);
      toast.success('Produto adicionado ao carrinho!');
    }
  };

  const totalPages = Math.ceil(filteredProdutos.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProdutos = filteredProdutos.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-marketplace-paper">
      <header className="bg-white border-b border-marketplace-cream sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-marketplace-accent rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">MR</span>
            </div>
            <h1 className="text-2xl font-bold text-marketplace-ink">NUTS</h1>
          </div>
          <nav className="hidden md:flex gap-8">
            <button
              onClick={() => navigate('/')}
              className="text-marketplace-ink font-medium hover:text-marketplace-accent"
            >
              Início
            </button>
            <button
              onClick={() => navigate('/produtos')}
              className="text-marketplace-ink font-medium text-marketplace-accent"
            >
              Produtos
            </button>
          </nav>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/carrinho')}
              className="px-4 py-2 rounded-lg bg-marketplace-cream text-marketplace-ink font-medium hover:bg-marketplace-gold transition-colors"
            >
              🛒 Carrinho
            </button>
            <button
              onClick={() => navigate('/perfil')}
              className="px-4 py-2 rounded-lg bg-marketplace-accent text-white font-medium hover:bg-marketplace-accent-dark transition-colors"
            >
              👤 Perfil
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="md:col-span-1">
            <Filters onFiltersChange={setFilters} />
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-marketplace-ink">
                    {filters.categories[0] || 'All Products'}
                  </h1>
                  <p className="text-marketplace-muted mt-2">
                    Browse our curated selection of premium nuts and seeds
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-marketplace-muted">
                  Showing {startIdx + 1}-{Math.min(startIdx + ITEMS_PER_PAGE, filteredProdutos.length)} of{' '}
                  {filteredProdutos.length} products
                </p>
                <button className="px-4 py-2 border border-marketplace-cream rounded text-marketplace-ink text-sm hover:bg-marketplace-paper transition-colors">
                  Sort by: Featured
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="h-64 bg-white rounded-lg border border-marketplace-cream animate-pulse"
                  />
                ))}
              </div>
            ) : paginatedProdutos.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {paginatedProdutos.map((produto) => (
                    <ProductCard
                      key={produto.idProduto}
                      product={produto}
                      onAddCart={handleAddCart}
                    />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-marketplace-muted text-lg mb-4">
                  Nenhum produto encontrado com os filtros selecionados.
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      categories: ['Premium Nuts'],
                      priceMax: 300,
                      ratingMin: null,
                      inStock: false,
                    })
                  }
                  className="px-6 py-3 bg-marketplace-accent text-white rounded-lg hover:bg-marketplace-accent-dark transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
