export default function ProductCard({ product, onAddCart }) {
  return (
    <article className="bg-white rounded-lg border border-marketplace-cream shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative h-40 bg-marketplace-paper overflow-hidden">
        {product.imagem ? (
          <img
            src={product.imagem}
            alt={product.nomeProduto}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-marketplace-cream">
            <span className="text-marketplace-muted">Sem imagem</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-marketplace-muted font-medium">
            ⭐ {product.rating.toFixed(1)} ({product.reviews} reviews)
          </span>
        </div>

        <h3 className="font-semibold text-sm text-marketplace-ink mb-1 line-clamp-2">
          {product.nomeProduto}
        </h3>

        <p className="text-xs text-marketplace-muted mb-3 line-clamp-2">
          {product.descricao || 'Produto premium do marketplace'}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-marketplace-accent">
            ${product.preco.toFixed(2)}
          </span>
          <button
            onClick={() => onAddCart(product.idProduto)}
            disabled={!product.emEstoque}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              product.emEstoque
                ? 'bg-marketplace-cream text-marketplace-ink hover:bg-marketplace-gold cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {product.emEstoque ? 'Add' : 'Out'}
          </button>
        </div>
      </div>
    </article>
  );
}
