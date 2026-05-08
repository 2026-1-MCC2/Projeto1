const slides = [
  {
    eyebrow: "DESTAQUE DA SEMANA",
    title: "Selecao Premium de Nozes",
    text:
      "Castanhas e nozes frescas direto dos fornecedores. Aproveite ofertas exclusivas no marketplace.",
    image:
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=1600&q=80",
    alt: "Nozes em tigelas rusticas",
  },
  {
    eyebrow: "CASTANHAS ESPECIAIS",
    title: "Castanha de Caju Dourada",
    text:
      "Lotes selecionados com textura cremosa e sabor intenso. Uma vitrine perfeita para novos vendedores.",
    image:
      "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1600&q=80",
    alt: "Castanhas de caju em uma tigela",
  },
  {
    eyebrow: "RAIZES DO DIA",
    title: "Batatas para Todo Menu",
    text:
      "Batatas selecionadas para assar, fritar e cozinhar. Qualidade garantida pelos parceiros.",
    image:
      "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=1600&q=80",
    alt: "Batatas em um cesto rustico",
  },
];

const imageEl = document.querySelector("#hero-image");
const titleEl = document.querySelector("#hero-title");
const textEl = document.querySelector("#hero-text");
const eyebrowEl = document.querySelector("#hero-eyebrow");
const dots = document.querySelectorAll(".hero-dots .dot");
const controls = document.querySelectorAll(".circle-btn");

if (imageEl && titleEl && textEl && eyebrowEl) {
  let currentIndex = 0;

  const updateSlide = (index) => {
    const slide = slides[index];
    imageEl.src = slide.image;
    imageEl.alt = slide.alt;
    titleEl.textContent = slide.title;
    textEl.textContent = slide.text;
    eyebrowEl.textContent = slide.eyebrow;

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === index);
    });
  };

  controls.forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.direction;
      if (direction === "next") {
        currentIndex = (currentIndex + 1) % slides.length;
      } else {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      }
      updateSlide(currentIndex);
    });
  });

  updateSlide(currentIndex);
}

const catalogTitle = document.querySelector("#catalog-title");
const catalogSubtitle = document.querySelector("#catalog-subtitle");
const catalogHighlight = document.querySelector("#catalog-highlight");
const catalogBreadcrumb = document.querySelector("#catalog-breadcrumb");
const catalogGrid = document.querySelector("#catalog-grid");
const catalogPagination = document.querySelector("#catalog-pagination");
const categoryInputs = document.querySelectorAll("[data-category]");
const ratingInputs = document.querySelectorAll("[data-rating]");
const stockInput = document.querySelector("#stock-only");
const priceInput = document.querySelector("#price-range");
const priceValue = document.querySelector("#price-value");

if (catalogTitle && catalogSubtitle && catalogHighlight && categoryInputs.length > 0) {
  const categoryCopy = {
    "Premium Nuts": {
      title: "Premium Nuts",
      subtitle: "Freshly sourced from organic farms and roasted to perfection.",
    },
    Almonds: {
      title: "Almonds",
      subtitle: "Lightly roasted almonds from trusted growers and partner farms.",
    },
    Cashews: {
      title: "Cashews",
      subtitle: "Creamy cashews selected for a rich finish and steady crunch.",
    },
    Walnuts: {
      title: "Walnuts",
      subtitle: "Bold, earthy walnuts with premium texture from verified sellers.",
    },
    Pistachios: {
      title: "Pistachios",
      subtitle: "Naturally sweet pistachios with vibrant color and flavor.",
    },
    "Mixed Nuts": {
      title: "Mixed Nuts",
      subtitle: "Balanced blends from multiple partner roasters and farms.",
    },
  };

  const defaultCategory = "Premium Nuts";
  const pageSize = 18;
  const productData = Array.isArray(window.catalogProducts) ? window.catalogProducts : [];
  let currentPage = 1;

  const getSelectedCategories = () =>
    Array.from(categoryInputs)
      .filter((input) => input.checked)
      .map((input) => input.value);

  const getEffectiveCategories = () => {
    const selected = getSelectedCategories();
    return selected.length > 0 ? selected : [defaultCategory];
  };

  const updatePriceValue = () => {
    if (!priceInput || !priceValue) {
      return;
    }

    const maxValue = Number(priceInput.max || 100);
    const currentValue = Number(priceInput.value || maxValue);
    priceValue.textContent = currentValue >= maxValue ? `$${maxValue}+` : `$${currentValue}`;
  };

  const updateCatalogCopy = () => {
    const selectedCategories = getSelectedCategories();

    let title = defaultCategory;
    let subtitle = categoryCopy[defaultCategory].subtitle;
    let highlight = `Featured partners for ${defaultCategory}.`;

    if (selectedCategories.length === 1) {
      const selected = selectedCategories[0];
      const copy = categoryCopy[selected] || {
        title: selected,
        subtitle: `Showing ${selected} products from verified partners.`,
      };
      title = copy.title;
      subtitle = copy.subtitle;
      highlight = `Featured partners for ${title}.`;
    } else if (selectedCategories.length > 1) {
      title = "Mixed Selection";
      subtitle = `Showing ${selectedCategories.length} categories: ${selectedCategories.join(", ")}.`;
      highlight = `Featured partners across ${selectedCategories.length} categories.`;
    }

    const ratingValues = Array.from(ratingInputs)
      .filter((input) => input.checked)
      .map((input) => Number(input.dataset.rating || 0))
      .filter((value) => value > 0);

    const highlightParts = [highlight];

    if (ratingValues.length > 0) {
      const topRating = Math.max(...ratingValues);
      highlightParts.push(`Rating ${topRating}+`);
    }

    if (stockInput && stockInput.checked) {
      highlightParts.push("In stock only");
    }

    if (priceInput) {
      const maxValue = Number(priceInput.max || 100);
      const currentValue = Number(priceInput.value || maxValue);
      if (currentValue < maxValue) {
        highlightParts.push(`Under $${currentValue}`);
      }
    }

    catalogTitle.textContent = title;
    catalogSubtitle.textContent = subtitle;
    catalogHighlight.textContent = highlightParts.join(" ");
    if (catalogBreadcrumb) {
      catalogBreadcrumb.textContent = `Home / ${title}`;
    }
  };

  const applyFilters = () => {
    const categories = getEffectiveCategories();
    const ratingValues = Array.from(ratingInputs)
      .filter((input) => input.checked)
      .map((input) => Number(input.dataset.rating || 0))
      .filter((value) => value > 0);
    const minRating = ratingValues.length > 0 ? Math.max(...ratingValues) : null;
    const maxValue = priceInput ? Number(priceInput.max || 100) : null;
    const currentValue = priceInput ? Number(priceInput.value || maxValue) : null;

    return productData.filter((product) => {
      if (categories.length > 0 && !categories.includes(product.category)) {
        return false;
      }

      if (minRating !== null && Number(product.rating || 0) < minRating) {
        return false;
      }

      if (stockInput && stockInput.checked && product.inStock === false) {
        return false;
      }

      if (currentValue !== null && maxValue !== null && currentValue < maxValue) {
        if (Number(product.price || 0) > currentValue) {
          return false;
        }
      }

      return true;
    });
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "--";
    }

    const value = Number(price);
    if (Number.isNaN(value)) {
      return String(price);
    }

    return `$${value.toFixed(2)}`;
  };

  const renderProducts = (items) => {
    if (!catalogGrid) {
      return;
    }

    if (items.length === 0) {
      catalogGrid.innerHTML = '<div class="empty-state">No products match the selected filters.</div>';
      return;
    }

    catalogGrid.innerHTML = items
      .map((product) => {
        const ratingText = product.rating
          ? `${Number(product.rating).toFixed(1)} / 5${product.reviews ? ` (${product.reviews} reviews)` : ""}`
          : "";
        const description = product.description || "";
        const priceText = formatPrice(product.price);
        const inStock = product.inStock !== false;

        return `
          <article class="product-card">
            ${product.image ? `<img src="${product.image}" alt="${product.name || "Product"}" />` : ""}
            <div class="product-body">
              ${ratingText ? `<p class="rating">${ratingText}</p>` : ""}
              <h3>${product.name || "Product"}</h3>
              ${description ? `<p class="desc">${description}</p>` : ""}
              <div class="product-meta">
                <span class="price">${priceText}</span>
                <button class="mini-btn" ${inStock ? "" : "disabled"}>
                  ${inStock ? "Add" : "Out"}
                </button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  };

  const renderPagination = (totalPages) => {
    if (!catalogPagination) {
      return;
    }

    catalogPagination.innerHTML = "";

    const createButton = (label, page, isActive, isDisabled, ariaLabel) => {
      const button = document.createElement("button");
      button.className = `page-btn${isActive ? " active" : ""}${ariaLabel ? " icon" : ""}`;
      button.textContent = label;
      button.disabled = Boolean(isDisabled);
      if (ariaLabel) {
        button.setAttribute("aria-label", ariaLabel);
      }
      if (isActive) {
        button.setAttribute("aria-current", "page");
      }
      if (!isDisabled && page) {
        button.dataset.page = String(page);
      }
      return button;
    };

    if (totalPages <= 1) {
      catalogPagination.appendChild(createButton("1", 1, true, true));
      return;
    }

    catalogPagination.appendChild(
      createButton("‹", currentPage - 1, false, currentPage === 1, "Previous page")
    );

    for (let page = 1; page <= totalPages; page += 1) {
      catalogPagination.appendChild(createButton(String(page), page, page === currentPage, false));
    }

    catalogPagination.appendChild(
      createButton("›", currentPage + 1, false, currentPage === totalPages, "Next page")
    );
  };

  const updateCatalogView = () => {
    updateCatalogCopy();

    if (!catalogGrid || !catalogPagination) {
      return;
    }

    const filtered = applyFilters();
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * pageSize;
    const pageItems = filtered.slice(startIndex, startIndex + pageSize);
    renderProducts(pageItems);
    renderPagination(totalPages);
  };

  categoryInputs.forEach((input) => {
    input.addEventListener("change", () => {
      currentPage = 1;
      updateCatalogView();
    });
  });

  ratingInputs.forEach((input) => {
    input.addEventListener("change", () => {
      currentPage = 1;
      updateCatalogView();
    });
  });

  if (stockInput) {
    stockInput.addEventListener("change", () => {
      currentPage = 1;
      updateCatalogView();
    });
  }

  if (priceInput) {
    priceInput.addEventListener("input", () => {
      updatePriceValue();
      currentPage = 1;
      updateCatalogView();
    });
  }

  if (catalogPagination) {
    catalogPagination.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      const pageValue = Number(target.dataset.page || 0);
      if (!pageValue || pageValue === currentPage) {
        return;
      }

      currentPage = pageValue;
      updateCatalogView();
    });
  }

  updatePriceValue();
  updateCatalogView();
}
