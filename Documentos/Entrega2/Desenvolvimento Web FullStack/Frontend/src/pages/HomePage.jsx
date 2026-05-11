import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { getProdutos } from '../api/productsApi.js';
import { useCart } from '../contexts/CartContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

export default function HomePage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProdutos();
  }, []);

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

  const handleAddCart = async (idProduto) => {
    const product = produtos.find((p) => p.idProduto === idProduto);
    addItem(product, 1);
    toast.success('Produto adicionado ao carrinho!');
  };

  const handleHeroCTA = () => {
    navigate('/produtos');
  };

  return (
    <div className="min-h-screen bg-marketplace-paper">
      <header className="bg-white border-b border-marketplace-cream sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
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
              className="text-marketplace-ink font-medium hover:text-marketplace-accent"
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
        <Hero onCTAClick={handleHeroCTA} />

        {/* Premium Potatoes Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-marketplace-ink mb-2">Premium Potatoes</h2>
              <p className="text-marketplace-muted">
                Farm-to-table root vegetables for every dish.
              </p>
            </div>
            <button
              onClick={() => navigate('/produtos')}
              className="px-6 py-3 border-2 border-marketplace-accent text-marketplace-accent-dark font-medium rounded-lg hover:bg-marketplace-paper transition-colors"
            >
              See More
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-white rounded-lg border border-marketplace-cream animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {produtos.slice(0, 4).map((produto) => (
                <ProductCard
                  key={produto.idProduto}
                  product={produto}
                  onAddCart={handleAddCart}
                />
              ))}
            </div>
          )}
        </section>

        {/* Signature Nut Blends Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-marketplace-ink mb-2">
                Signature Nut Blends
              </h2>
              <p className="text-marketplace-muted">
                Crafted mixes for the ultimate snacking experience.
              </p>
            </div>
            <button
              onClick={() => navigate('/produtos')}
              className="px-6 py-3 border-2 border-marketplace-accent text-marketplace-accent-dark font-medium rounded-lg hover:bg-marketplace-paper transition-colors"
            >
              See More
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-white rounded-lg border border-marketplace-cream animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {produtos.slice(4, 8).map((produto) => (
                <ProductCard
                  key={produto.idProduto}
                  product={produto}
                  onAddCart={handleAddCart}
                />
              ))}
            </div>
          )}
        </section>

        {/* CTA Newsletter */}
        <section className="bg-gradient-to-r from-marketplace-accent to-marketplace-accent-dark rounded-2xl p-12 text-white mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Join the Nutty Community</h2>
            <p className="text-white/80 mb-8">
              Get weekly recipes, exclusive discounts, and first access to seasonal harvests.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success('Inscrito com sucesso!');
              }}
              className="flex gap-4"
            >
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-3 rounded-lg text-marketplace-ink"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-marketplace-gold text-marketplace-ink font-bold rounded-lg hover:bg-marketplace-gold/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-marketplace-ink text-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-marketplace-gold rounded flex items-center justify-center">
                  <span className="text-marketplace-ink font-bold">MR</span>
                </div>
                <span className="text-xl font-bold">NUTS</span>
              </div>
              <p className="text-white/70">
                Your global marketplace for nuts, seeds, and root vegetables sourced directly from
                farmers around the world.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div>
                <h4 className="font-bold mb-4">Shop</h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>
                    <a href="#" className="hover:text-marketplace-gold">
                      Best Sellers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-marketplace-gold">
                      New Arrivals
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-marketplace-gold">
                      Wholesale
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Support</h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>
                    <a href="#" className="hover:text-marketplace-gold">
                      Shipping Info
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-marketplace-gold">
                      Returns
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-marketplace-gold">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Contact</h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>
                    <a href="mailto:support@mrnuts.com" className="hover:text-marketplace-gold">
                      support@mrnuts.com
                    </a>
                  </li>
                  <li>+1 (555) 888-9999</li>
                  <li>123 Orchard Lane, CA</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-white/70 text-sm">
            <span>2026 Mr Nuts Marketplace. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
