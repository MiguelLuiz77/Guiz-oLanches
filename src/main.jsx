import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  acaiSizes, acaiToppings, address, categories, instagramUrl, mapsUrl, reviews, whatsappUrl,
} from './data.js';
import { addCartItem, buildOrderMessage, cartItemCount, cartTotal as calculateCartTotal, changeCartQuantity, removeCartItem } from './cart.js';
import './styles.css';

const money = (cents) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function Header({ cartCount, onOpenCart }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ['Início', '#inicio'], ['Cardápio', '#cardapio'], ['Avaliações', '#avaliacoes'], ['Localização', '#localizacao'],
  ];

  const closeMenu = () => setMenuOpen(false);
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#inicio" aria-label="Guizão Lanches — início" onClick={closeMenu}>
          <img src="/assets/guizao-logo.png" alt="Guizão Lanches" />
        </a>
        <button className="menu-toggle" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navegação principal">
          {links.map(([label, href], index) => (
            <a key={href} href={href} className={index === 0 ? 'nav-home' : ''} onClick={closeMenu}>
              <span className="nav-icon" aria-hidden="true">{['⌂', '♜', '★', '⌖'][index]}</span>{label}
            </a>
          ))}
          <button className="mobile-cart-link" onClick={() => { closeMenu(); onOpenCart(); }}>Sacola <span>{cartCount}</span></button>
        </nav>
        <a className="header-order" href={whatsappUrl} target="_blank" rel="noreferrer">
          <span aria-hidden="true">◉</span> Peça pelo WhatsApp
        </a>
      </div>
    </header>
  );
}

function Hero() {
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  return (
    <section id="inicio" className={`hero-scroll ${reducedMotion ? 'motion-reduced' : ''}`}>
      <div className="hero-stage">
        <img className="hero-poster" src="/assets/hero-burger.png" alt="Hambúrguer artesanal acompanhado de batatas fritas e refrigerante" />
        {!reducedMotion && (
          <video
            className="hero-video"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/assets/hero-burger.png"
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src="/assets/hero-scroll.mp4" type="video/mp4" />
          </video>
        )}
        <div className="hero-shade" />
        <div className="hero-content page-shell">
          <div className="hero-copy" data-reveal>
            <p className="eyebrow"><span /> Feito com capricho, servido com alegria</p>
            <h1>GUIZÃO<br /><span>LANCHES</span></h1>
            <p className="hero-slogan">Sabor de verdade<br />em cada <em>mordida!</em></p>
            <p className="hero-description">Os melhores lanches, preparados com capricho e ingredientes selecionados para você.</p>
            <a className="button button-yellow hero-cta" href={whatsappUrl} target="_blank" rel="noreferrer">
              <span className="whatsapp-mark" aria-hidden="true">◉</span> PEDIR PELO WHATSAPP <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="scroll-cue" aria-hidden="true"><span /> Role para sentir o sabor</div>
        </div>
        <div className="hero-bottom-glow" />
      </div>
    </section>
  );
}

function QuantityControl({ quantity, onMinus, onPlus, label }) {
  return (
    <div className="quantity-control" aria-label={`Quantidade de ${label}`}>
      <button aria-label={`Diminuir ${label}`} onClick={onMinus}>−</button>
      <span aria-live="polite">{quantity}</span>
      <button aria-label={`Adicionar mais ${label}`} onClick={onPlus}>+</button>
    </div>
  );
}

function ProductRow({ product, quantity, onAdd, onMinus }) {
  return (
    <li className="product-row">
      <div className="product-name-wrap">
        {product.number && <span className="product-number">{String(product.number).padStart(2, '0')}</span>}
        <span className="product-name">{product.name}</span>
      </div>
      <span className="product-price">{money(product.price)}</span>
      {quantity > 0 ? (
        <QuantityControl label={product.name} quantity={quantity} onMinus={onMinus} onPlus={onAdd} />
      ) : (
        <button className="add-button" aria-label={`Adicionar ${product.name} ao carrinho`} onClick={onAdd}>+</button>
      )}
    </li>
  );
}

function AcaiCard({ quantity, onCustomize, onMinus }) {
  return (
    <div className="acai-card">
      <div className="acai-card-copy">
        <span className="acai-kicker">Açaí do seu jeito</span>
        <h3>Monte seu açaí</h3>
        <p>Escolha o tamanho e combine com seus adicionais favoritos.</p>
      </div>
      <div className="acai-sizes" aria-label="Tamanhos de açaí">
        {acaiSizes.map((size) => <span key={size.label}>{size.label}<b>{money(size.price)}</b></span>)}
      </div>
      <div className="acai-card-actions">
        {quantity > 0 && <QuantityControl label="Açaí" quantity={quantity} onMinus={onMinus} onPlus={onCustomize} />}
        <button className="button button-yellow compact-button" onClick={onCustomize}>Personalizar e adicionar <span aria-hidden="true">+</span></button>
      </div>
    </div>
  );
}

function MenuCategory({ category, counts, onAdd, onMinus, onAcai }) {
  let lastSubgroup = '';
  return (
    <article id={category.id} className={`category-card category-${category.id}`} data-reveal>
      <div className="category-heading">
        <div className="category-title">
          <span className="category-icon" aria-hidden="true">{category.icon}</span>
          <div><h3>{category.title}</h3><span className="category-count">{category.id === 'acai' ? 'Escolha seus adicionais' : `${category.products.length} opções`}</span></div>
        </div>
      </div>
      {category.id === 'acai' ? (
        <div className="category-body"><AcaiCard quantity={counts['acai-custom'] || 0} onCustomize={onAcai} onMinus={() => onMinus('acai-custom')} /></div>
      ) : (
        <ul className="product-list">
          {category.products.map((product) => {
            const showHeading = product.subgroup && product.subgroup !== lastSubgroup;
            if (showHeading) lastSubgroup = product.subgroup;
            return <React.Fragment key={product.id}>
              {showHeading && <li className="product-subgroup">{product.subgroup}</li>}
              <ProductRow
                product={product}
                quantity={counts[product.id] || 0}
                onAdd={() => onAdd(product)}
                onMinus={() => onMinus(product.id)}
              />
            </React.Fragment>;
          })}
        </ul>
      )}
    </article>
  );
}

function MenuSection({ counts, onAdd, onMinus, onAcai }) {
  const goToCategory = (id) => {
    const target = document.getElementById(id);
    target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };
  return (
    <section id="cardapio" className="menu-section">
      <div className="menu-topline" />
      <div className="page-shell menu-shell">
        <div className="section-heading menu-heading" data-reveal>
          <span className="section-kicker">Escolha o seu favorito</span>
          <h2>Nosso <em>Cardápio</em></h2>
          <p>Feito na hora, com aquele capricho que você já conhece.</p>
        </div>
        <nav className="category-nav" aria-label="Navegar pelas categorias">
          {categories.map((category) => (
            <button key={category.id} onClick={() => goToCategory(category.id)}>
              <span aria-hidden="true">{category.icon}</span>{category.short}
            </button>
          ))}
        </nav>
        <div className="menu-grid">
          {categories.map((category) => <MenuCategory key={category.id} category={category} counts={counts} onAdd={onAdd} onMinus={onMinus} onAcai={onAcai} />)}
        </div>
        <p className="menu-note">Os valores estão sujeitos a atualização. Confirme seu pedido pelo WhatsApp.</p>
      </div>
    </section>
  );
}

function AcaiModal({ onClose, onConfirm }) {
  const [selectedSize, setSelectedSize] = useState(acaiSizes[0].label);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const size = acaiSizes.find((entry) => entry.label === selectedSize);
  const total = size.price + size.extra * selectedToppings.length;

  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  const toggleTopping = (name) => setSelectedToppings((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="acai-modal" role="dialog" aria-modal="true" aria-labelledby="acai-modal-title">
        <button className="close-button" onClick={onClose} aria-label="Fechar personalização">×</button>
        <span className="section-kicker">Do seu jeito</span>
        <h2 id="acai-modal-title">Personalize seu açaí</h2>
        <fieldset className="choice-fieldset">
          <legend>Escolha o tamanho</legend>
          <div className="size-options">
            {acaiSizes.map((entry) => (
              <label className={selectedSize === entry.label ? 'is-selected' : ''} key={entry.label}>
                <input type="radio" name="acai-size" value={entry.label} checked={selectedSize === entry.label} onChange={() => setSelectedSize(entry.label)} />
                <span>{entry.label}</span><b>{money(entry.price)}</b>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="choice-fieldset toppings-fieldset">
          <legend>Adicionais <small>{money(size.extra)} cada</small></legend>
          <div className="topping-options">
            {acaiToppings.map((topping) => (
              <label key={topping}>
                <input type="checkbox" checked={selectedToppings.includes(topping)} onChange={() => toggleTopping(topping)} />
                <span>{topping}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="modal-total"><span>Total do item</span><strong>{money(total)}</strong></div>
        <button className="button button-yellow modal-add" onClick={() => onConfirm(size, selectedToppings)}>Adicionar ao carrinho <span aria-hidden="true">↗</span></button>
      </section>
    </div>
  );
}

function ReviewsSection() {
  return (
    <section id="avaliacoes" className="reviews-section">
      <div className="page-shell">
        <div className="section-heading light-heading" data-reveal>
          <span className="section-kicker">Carinho que dá gosto de ler</span>
          <h2>O que nossos <em>clientes dizem</em></h2>
          <p>Opiniões de quem já provou e aprovou.</p>
        </div>
        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <article className="review-card" data-reveal key={review.name} style={{ '--reveal-delay': `${index * 90}ms` }}>
              <div className="review-top">
                <div className={`review-avatar avatar-${index}`}>{review.initials}</div>
                <div><h3>{review.name}</h3><span className="review-source">Cliente Guizão Lanches</span></div>
              </div>
              <div className="review-stars" aria-label="5 de 5 estrelas">★★★★★</div>
              <p>“{review.quote}”</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LocationSection() {
  const mapQuery = encodeURIComponent(address);
  return (
    <section id="localizacao" className="location-section">
      <div className="page-shell location-layout">
        <div className="location-copy" data-reveal>
          <span className="section-kicker">A gente te espera</span>
          <h2>Venha nos <em>visitar</em></h2>
          <div className="location-address"><span className="pin-icon" aria-hidden="true">⌖</span><p>{address}</p></div>
          <a className="button button-yellow" href={mapsUrl} target="_blank" rel="noreferrer">COMO CHEGAR <span aria-hidden="true">↗</span></a>
          <div className="location-hours"><span className="status-dot" /> Atendimento pelo WhatsApp</div>
        </div>
        <div className="map-card" data-reveal>
          <iframe
            title="Mapa da localização do Guizão Lanches em São José dos Campos"
            src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div className="map-caption"><span>📍</span> Monte Castelo · São José dos Campos</div>
        </div>
      </div>
    </section>
  );
}

function InstagramSection() {
  return (
    <section className="instagram-section">
      <div className="instagram-inner page-shell" data-reveal>
        <div className="instagram-mark" aria-hidden="true"><span>◎</span></div>
        <div><span className="section-kicker">Bastidores e novidades</span><h2>Siga o Guizão no Instagram</h2><p>Tem sempre um lanche especial saindo por lá.</p></div>
        <a href={instagramUrl} target="_blank" rel="noreferrer" className="button instagram-button">Acompanhar no Instagram <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-main">
        <div className="footer-brand">
          <a href="#inicio" aria-label="Voltar para o início"><img src="/assets/guizao-logo.png" alt="Guizão Lanches" loading="lazy" /></a>
          <p>Sabor de verdade<br />em cada mordida!</p>
        </div>
        <div className="footer-links"><h3>Navegue</h3><a href="#inicio">Início</a><a href="#cardapio">Cardápio</a><a href="#avaliacoes">Avaliações</a><a href="#localizacao">Localização</a></div>
        <div className="footer-contact"><h3>Faça seu pedido</h3><a className="footer-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer">◉ &nbsp; (12) 98808-1969</a><p>{address}</p></div>
      </div>
      <div className="footer-bottom page-shell"><span>© {new Date().getFullYear()} Guizão Lanches</span><span>Guizão Lanches — Sempre com você!</span><a href={instagramUrl} target="_blank" rel="noreferrer">Instagram ↗</a></div>
    </footer>
  );
}

function CartDrawer({ items, total, onClose, onChange, onRemove, onCheckout }) {
  useEffect(() => {
    if (!items) return undefined;
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose, items]);

  return (
    <div className="cart-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="cart-header"><div><span className="section-kicker">Seu pedido</span><h2 id="cart-title">Minha sacola</h2></div><button className="close-button" onClick={onClose} aria-label="Fechar sacola">×</button></div>
        <div className="cart-items">
          {!items.length ? (
            <div className="empty-cart"><span>🍔</span><h3>Sua sacola está vazia</h3><p>Escolha seus favoritos no cardápio e eles aparecem aqui.</p><button className="button button-yellow" onClick={onClose}>Ver cardápio</button></div>
          ) : items.map((item) => (
            <article className="cart-item" key={item.key}>
              <div className="cart-item-copy"><h3>{item.name}</h3>{item.details && <p>{item.details}</p>}<span>{money(item.unitPrice)} cada</span></div>
              <div className="cart-item-bottom">
                <QuantityControl label={item.name} quantity={item.quantity} onMinus={() => onChange(item.key, -1)} onPlus={() => onChange(item.key, 1)} />
                <strong>{money(item.unitPrice * item.quantity)}</strong>
              </div>
              <button className="remove-line" onClick={() => onRemove(item.key)}>Remover</button>
            </article>
          ))}
        </div>
        <div className="cart-footer">
          <div className="cart-total"><span>Total do pedido</span><strong>{money(total)}</strong></div>
          <button className="button button-yellow checkout-button" onClick={onCheckout} disabled={!items.length}>Finalizar pelo WhatsApp <span aria-hidden="true">↗</span></button>
          <button className="continue-shopping" onClick={onClose}>Continuar comprando</button>
        </div>
      </aside>
    </div>
  );
}

function App() {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('guizao-cart-v1');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [acaiOpen, setAcaiOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem('guizao-cart-v1', JSON.stringify(cart)); } catch { /* Storage may be unavailable in private browsing. */ }
  }, [cart]);

  useEffect(() => {
    const nodes = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const counts = useMemo(() => cart.reduce((result, item) => {
    result[item.id] = (result[item.id] || 0) + item.quantity;
    return result;
  }, {}), [cart]);
  const itemCount = cartItemCount(cart);
  const orderTotal = calculateCartTotal(cart);

  const addItem = (product, options = {}) => {
    const key = options.key || product.id;
    const newItem = {
      key, id: product.id, name: options.name || product.name,
      details: options.details || '', unitPrice: options.unitPrice ?? product.price,
    };
    setCart((current) => addCartItem(current, newItem));
  };

  const changeQuantity = (key, change) => setCart((current) => changeCartQuantity(current, key, change));
  const removeItem = (key) => setCart((current) => removeCartItem(current, key));

  const addAcai = (size, toppings) => {
    const name = `Açaí ${size.label}`;
    const details = toppings.length ? `Adicionais: ${toppings.join(', ')}` : 'Sem adicionais';
    const unitPrice = size.price + size.extra * toppings.length;
    const key = `acai-${size.label}-${[...toppings].sort().join('|') || 'sem-adicionais'}`;
    addItem({ id: 'acai-custom', name, price: unitPrice }, { key, name, details, unitPrice });
    setAcaiOpen(false);
  };

  const checkout = () => {
    if (!cart.length) return;
    const message = buildOrderMessage(cart);
    window.open(`${whatsappUrl}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <Header cartCount={itemCount} onOpenCart={() => setCartOpen(true)} />
      <main>
        <Hero />
        <MenuSection counts={counts} onAdd={addItem} onMinus={(id) => {
          const item = cart.find((entry) => entry.id === id);
          if (item) changeQuantity(item.key, -1);
        }} onAcai={() => setAcaiOpen(true)} />
        <ReviewsSection />
        <LocationSection />
        <InstagramSection />
      </main>
      <Footer />
      <button className="floating-cart" onClick={() => setCartOpen(true)} aria-label={`Abrir carrinho, ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`}>
        <span className="floating-cart-icon" aria-hidden="true">▱</span><span className="floating-cart-label">Sacola</span><b>{itemCount}</b>
      </button>
      {cartOpen && <CartDrawer items={cart} total={orderTotal} onClose={() => setCartOpen(false)} onChange={changeQuantity} onRemove={removeItem} onCheckout={checkout} />}
      {acaiOpen && <AcaiModal onClose={() => setAcaiOpen(false)} onConfirm={addAcai} />}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
