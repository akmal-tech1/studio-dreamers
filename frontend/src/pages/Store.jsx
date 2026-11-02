import { useEffect, useMemo, useState } from "react";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  X,
  CreditCard,
  CheckCircle2,
  Shirt,
  KeyRound,
  ShoppingCart,
} from "lucide-react";
import { api, ApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";

const TABS = [
  { id: "all", label: "All", icon: ShoppingBag },
  { id: "merch", label: "Merchandise", icon: Shirt },
  { id: "access", label: "Digital Access", icon: KeyRound },
];

const PRODUCT_IMAGES = {
  "Behind-the-Scenes Art Book": {
    src: "/film-accessories.svg",
    alt: "Film camera, reel, and production accessories",
  },
  "Director's Commentary Bundle": {
    src: "/director-clapboard.svg",
    alt: "Director's clapperboard on a film set",
  },
};

export default function Store() {
  const { user, openAuth } = useAuth();
  const [products, setProducts] = useState([]);
  const [tab, setTab] = useState("all");
  const [cart, setCart] = useState({}); // productId -> qty
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .products()
      .then(setProducts)
      .catch(() => setError("Could not load the store catalog."));
  }, []);

  const filtered = useMemo(
    () => (tab === "all" ? products : products.filter((p) => p.category === tab)),
    [products, tab]
  );

  const cartEntries = useMemo(
    () =>
      Object.entries(cart)
        .map(([pid, qty]) => ({ product: products.find((p) => p.id === Number(pid)), qty }))
        .filter((e) => e.product),
    [cart, products]
  );

  const subtotal = cartEntries.reduce((sum, { product, qty }) => sum + product.price * qty, 0);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const addToCart = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const setQty = (id, qty) =>
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = Math.min(qty, 50);
      return next;
    });

  const checkout = async () => {
    if (!user) {
      openAuth("login");
      return;
    }
    setPlacing(true);
    setError("");
    try {
      const items = Object.entries(cart).map(([product_id, qty]) => ({
        product_id: Number(product_id),
        qty,
      }));
      const result = await api.checkout(items);
      setOrder(result);
      setCart({});
      setDrawerOpen(false);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        openAuth("login");
      } else {
        setError(e.detail || "Checkout failed. Try again.");
      }
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-36 sm:px-8">
      <SectionHeading
        kicker="The Store"
        title="BEHIND THE FILM"
        description="Explore behind-the-scenes artwork and director commentary on the creative process."
      />

      {/* Filter tabs */}
      <Reveal delay={150}>
        <div className="no-scrollbar mt-10 flex gap-3 overflow-x-auto pb-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-6 py-2.5 text-[12px] font-bold uppercase tracking-[0.2em] transition ${
                tab === id
                  ? "bg-blood text-white shadow-[0_0_24px_rgba(255,0,51,0.4)]"
                  : "border border-white/10 text-white/55 hover:border-blood/50 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Product grid */}
      {error ? (
        <p className="mt-16 text-center text-white/50">{error}</p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 80}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-coal transition-all duration-500 hover:-translate-y-2 hover:border-blood/40 hover:shadow-[0_20px_60px_-15px_rgba(255,0,51,0.35)]">
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-blood/20 via-smoke to-ink">
                  <img
                    src={PRODUCT_IMAGES[p.name]?.src || `https://picsum.photos/seed/${p.image_seed}/640/480`}
                    alt={PRODUCT_IMAGES[p.name]?.alt || p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {p.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-blood px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blood">
                    {p.category === "ticket" ? "Tickets & Passes" : p.category === "merch" ? "Merchandise" : "Digital Access"}
                  </span>
                  <h3 className="mt-1.5 font-display text-2xl tracking-wide text-white">{p.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/50">{p.description}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="font-display text-3xl tracking-wide text-white">
                      ${p.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(p.id)}
                      disabled={p.stock === 0}
                      className="flex items-center gap-2 rounded-full bg-blood px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-ember disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      {p.stock === 0 ? "Sold Out" : "Add"}
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}

      {/* Floating cart button */}
      {cartCount > 0 && !drawerOpen && (
        <button
          onClick={() => setDrawerOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-blood px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_40px_rgba(255,0,51,0.5)] transition hover:bg-ember"
        >
          <ShoppingBag className="h-4 w-4" />
          Cart
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-blood">
            {cartCount}
          </span>
        </button>
      )}

      {/* Cart drawer */}
      <div
        className={`fixed inset-0 z-[90] transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
        <aside
          className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-coal transition-transform duration-500 ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
            <h3 className="font-display text-2xl tracking-wide text-white">YOUR ORDER</h3>
            <button onClick={() => setDrawerOpen(false)} aria-label="Close cart" className="text-white/50 transition hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {cartEntries.length === 0 ? (
              <p className="py-16 text-center text-white/40">Your cart is empty.</p>
            ) : (
              <ul className="space-y-5">
                {cartEntries.map(({ product, qty }) => (
                  <li key={product.id} className="flex gap-4">
                    <img
                      src={PRODUCT_IMAGES[product.name]?.src || `https://picsum.photos/seed/${product.image_seed}/200/200`}
                      alt={PRODUCT_IMAGES[product.name]?.alt || ""}
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-white">{product.name}</h4>
                        <button
                          onClick={() => setQty(product.id, 0)}
                          aria-label={`Remove ${product.name}`}
                          className="text-white/35 transition hover:text-blood"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm text-blood">${product.price.toFixed(2)}</p>
                      <div className="mt-auto flex items-center gap-3 pt-2">
                        <button
                          onClick={() => setQty(product.id, qty - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-blood hover:text-blood"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                        <button
                          onClick={() => setQty(product.id, qty + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-blood hover:text-blood"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {cartEntries.length > 0 && (
            <div className="border-t border-white/5 px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.2em] text-white/50">Subtotal</span>
                <span className="font-display text-3xl tracking-wide text-white">${subtotal.toFixed(2)}</span>
              </div>
              {error && <p className="mb-3 rounded-lg border border-blood/30 bg-blood/10 px-4 py-2.5 text-sm text-ember">{error}</p>}
              <button
                onClick={checkout}
                disabled={placing}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-blood px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_0_30px_rgba(255,0,51,0.4)] transition hover:bg-ember disabled:opacity-60"
              >
                <CreditCard className="h-4 w-4" />
                {placing ? "Processing…" : user ? "Checkout" : "Sign In to Checkout"}
              </button>
              <p className="mt-3 text-center text-[11px] text-white/35">
                Demo checkout — no real payment is processed.
              </p>
            </div>
          )}
        </aside>
      </div>

      {/* Order confirmation */}
      {order && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/90 backdrop-blur-md" onClick={() => setOrder(null)} />
          <div className="relative w-full max-w-md rounded-2xl border border-blood/30 bg-coal p-8 text-center shadow-[0_0_80px_rgba(255,0,51,0.25)]">
            <CheckCircle2 className="mx-auto h-14 w-14 text-blood" />
            <h3 className="mt-5 font-display text-4xl tracking-wide text-white">ORDER CONFIRMED</h3>
            <p className="mt-2 text-sm text-white/50">
              Order <span className="font-mono text-blood">#{order.id}</span> · {order.items.reduce((n, i) => n + i.qty, 0)} items
            </p>
            <p className="mt-4 font-display text-3xl tracking-wide text-white">${order.total.toFixed(2)}</p>
            <ul className="mt-5 space-y-2 text-sm text-white/55">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.product_name} × {item.qty}</span>
                  <span>${(item.unit_price * item.qty).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setOrder(null)}
              className="mt-7 w-full rounded-full bg-blood px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-ember"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
