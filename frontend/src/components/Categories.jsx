import { CATEGORIES } from '../data/mockData';

function Categories({ onSelectCategory, selectedCategory, products = [] }) {
  return (
    <section className="categories-section" id="categories">
      <div className="section-container">
        {/* Header */}
        <div className="section-header-center">
          <span className="section-eyebrow">BROWSE BY CATEGORY</span>
          <h2 className="section-title">Everything you need, in one place</h2>
          <p className="section-subtitle">
            Curated collections of stationery, gadgets, backpacks, home essentials, and lifestyle accessories.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="categories-grid">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.categoryId || selectedCategory === cat.name;

            // Connect to real product count if products are available
            const matchingCount = products.filter(
              (p) =>
                p.category?.toLowerCase() === cat.name.toLowerCase() ||
                p.categoryId?.toLowerCase() === cat.id.toLowerCase()
            ).length;

            const countDisplay = matchingCount > 0 ? `${matchingCount} Items` : cat.count;

            return (
              <div
                key={cat.id}
                className={`category-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectCategory(cat.name)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectCategory(cat.name);
                  }
                }}
              >
                <div className="category-image-wrapper">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="category-image"
                    loading="lazy"
                  />
                  <div className="category-overlay"></div>
                  <span className="category-count-badge">{countDisplay}</span>
                </div>

                <div className="category-body">
                  <h3 className="category-name">{cat.name}</h3>
                  <p className="category-description">{cat.description}</p>
                  <div className="category-action-link">
                    <span>Explore items</span>
                    <span className="link-arrow">→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Categories;
