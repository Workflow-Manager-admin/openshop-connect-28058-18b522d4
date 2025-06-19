import React, { useState, useEffect, useMemo, useCallback, createContext, useContext } from "react";
import "./App.css";

// ======= THEME CONSTANTS =======
const theme = {
  primary: "#007bff",
  secondary: "#6c757d",
  accent: "#ffc107",
  light: "#f8f9fa",
  dark: "#212529"
};

// ======= AUTH CONTEXT =======
const AuthContext = createContext();
function useAuth() {
  return useContext(AuthContext);
}

// ======= CART CONTEXT =======
const CartContext = createContext();
function useCart() {
  return useContext(CartContext);
}

// ======= MOCK/DEMO API URLS =======
const PRODUCTS_API = "https://fakestoreapi.com/products";
const CATEGORIES_API = "https://fakestoreapi.com/products/categories";
// No backend for users or orders: use localStorage/demo flows

// ================== COMPONENTS ===================

// ===== Navbar =====
function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  return (
    <nav
      className="navbar"
      style={{
        background: theme.primary,
        color: "#fff",
        borderBottom: `1.5px solid ${theme.secondary}`,
        zIndex: 101
      }}
    >
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="logo" style={{ fontWeight: 700, fontSize: 21 }}>
          <span className="logo-symbol" style={{ color: theme.accent, fontWeight: 900 }}>&#9733;</span>&nbsp;
          <span style={{ letterSpacing: 1 }}>OpenShop&nbsp;Connect</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <a href="#cart" style={{ color: "#fff", textDecoration: "none", position: "relative" }}>
            <CartIcon count={cart.length} />
          </a>
          {user ? (
            <>
              <span style={{ marginRight: 12 }}>Hi, {user.username}</span>
              <button className="btn" style={{ background: theme.secondary, color: "#fff" }} onClick={logout}>Logout</button>
            </>
          ) : (
            <a href="#login" className="btn" style={{
              background: theme.secondary,
              color: "#fff"
            }}>Login</a>
          )}
        </div>
      </div>
    </nav>
  );
}

// ===== Sidebar =====
function Sidebar({ categories, selectedCategory, onSelect }) {
  return (
    <aside
      style={{
        minWidth: 200,
        background: theme.light,
        borderRight: `1px solid ${theme.secondary}22`,
        padding: "32px 0 24px 0"
      }}
    >
      <div style={{ fontWeight: 600, fontSize: 18, paddingLeft: 30, color: theme.secondary, marginBottom: 13 }}>
        Categories
      </div>
      <div>
        {["all", ...categories].map((cat) => (
          <button
            key={cat}
            className="sidebar-cat"
            style={{
              width: "90%",
              textAlign: "left",
              margin: "6px 5% 2px 5%",
              padding: "8px 20px",
              border: "none",
              background: selectedCategory === cat ? theme.primary : "transparent",
              color: selectedCategory === cat ? "#fff" : theme.dark,
              fontWeight: selectedCategory === cat ? 600 : 400,
              borderRadius: 7,
              transition: "background 0.2s"
            }}
            onClick={() => onSelect(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
    </aside>
  );
}

// ===== Cart Icon =====
function CartIcon({ count }) {
  return (
    <span style={{ position: "relative" }}>
      <svg width="30" height="30" fill="currentColor" viewBox="0 0 20 20">
        <path d="M16 16v-9a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM6 5h8a1 1 0 0 1 1 1v1H5V6a1 1 0 0 1 1-1z"/>
      </svg>
      {count > 0 && (
        <span style={{
          position: "absolute", top: -7, right: -7, background: theme.accent,
          color: "#222", borderRadius: "50%", padding: "2.5px 7px",
          fontSize: 12, fontWeight: 700, border: "1px solid #fff"
        }}>
          {count}
        </span>
      )}
    </span>
  );
}

// ===== Product Card =====
function ProductCard({ product, onAdd, onDetail }) {
  return (
    <div
      className="product-card"
      style={{
        background: "#fff",
        border: `1px solid ${theme.secondary}22`,
        borderRadius: 10,
        boxShadow: "0 1px 6px #eee",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 18,
        minWidth: 210,
        maxWidth: 260,
        margin: "7px"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img src={product.image} alt={product.title} style={{ width: 90, height: 90, objectFit: "contain", marginBottom: 8 }} />
        <div style={{ fontWeight: 600, fontSize: 15, marginTop: 5, color: theme.primary, textAlign: "center" }}>
          {product.title}
        </div>
        <div style={{ fontSize: 13, color: theme.secondary, marginTop: 6, minHeight: 35, textAlign: "center" }}>
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </div>
      </div>
      <div style={{ fontWeight: 700, margin: "12px 0 7px 0", fontSize: 17, color: theme.accent }}>
        ${product.price.toFixed(2)}
      </div>
      <div style={{ display: "flex", gap: 8, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <button className="btn" style={{ background: theme.primary, color: "#fff", flex: 1 }} onClick={() => onAdd(product)}>
          Add to Cart
        </button>
        <button className="btn" style={{ background: theme.secondary, color: "#fff", flex: 1 }} onClick={() => onDetail(product)}>
          Details
        </button>
      </div>
    </div>
  );
}

// ===== Products List =====
function ProductsList({ products, onAdd, onDetail }) {
  if (!products.length) {
    return <div style={{ padding: 25, color: theme.secondary, fontWeight: 500 }}>No products found.</div>;
  }
  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "24px 8px",
      justifyContent: "flex-start"
    }}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onAdd={onAdd} onDetail={onDetail} />
      ))}
    </div>
  );
}

// ===== Cart Modal =====
function CartModal({ open, onClose, cart, onRemove, onCheckout }) {
  const total = useMemo(() =>
    cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "#1119", zIndex: 201, display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        width: 430, maxWidth: "94vw", background: "#fff",
        borderRadius: 12, boxShadow: "0 1px 14px #2257",
        padding: "32px 24px 18px 24px", minHeight: 340, position: "relative"
      }}>
        <button onClick={onClose}
          style={{
            position: "absolute", right: 15, top: 15, background: "none", border: "none", fontSize: 23, color: theme.secondary, cursor: "pointer"
          }} title="Close">&times;</button>
        <h2 style={{ color: theme.primary, fontWeight: 700, fontSize: 22, margin: 0, marginBottom: 16 }}>Your Cart</h2>
        {cart.length === 0 ? (
          <div style={{ color: theme.secondary, fontStyle: "italic" }}>Your cart is empty.</div>
        ) : (
          <div>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {cart.map((item) => (
                <li style={{ marginBottom: 11, display: "flex", justifyContent: "space-between", alignItems: "center" }} key={item.id}>
                  <div>
                    <b>{item.title}</b>
                    <span style={{ color: theme.secondary, fontSize: 14, marginLeft: 7 }}>(x{item.qty})</span>
                  </div>
                  <div style={{ fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</div>
                  <button onClick={() => onRemove(item.id)} style={{
                    marginLeft: 8, background: theme.secondary, color: "#fff", border: "none", borderRadius: 5, padding: "2px 10px", cursor: "pointer"
                  }}>Remove</button>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 12, fontWeight: 700, color: theme.primary, fontSize: 17 }}>Total: ${total.toFixed(2)}</div>
            <button style={{ marginTop: 20, background: theme.accent, color: "#222", border: "none", borderRadius: 6, padding: "10px 0", width: "100%", fontWeight: 600, fontSize: 16, cursor: "pointer" }}
              onClick={onCheckout}>Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== Product Details Modal =====
function ProductDetailModal({ open, onClose, product, onAdd }) {
  if (!open || !product) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "#1119", zIndex: 202, display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        width: 430, maxWidth: "97vw", background: "#fff",
        borderRadius: 13, boxShadow: "0 1px 16px #2379",
        padding: "34px 26px 18px 26px", minHeight: 290, position: "relative"
      }}>
        <button onClick={onClose}
          style={{
            position: "absolute", right: 15, top: 13, background: "none", border: "none", fontSize: 23, color: theme.secondary, cursor: "pointer"
          }} title="Close">&times;</button>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 17 }}>
          <img src={product.image} alt={product.title} style={{ width: 85, height: 85, objectFit: "contain" }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: theme.primary }}>{product.title}</div>
            <div style={{ margin: "10px 0", color: theme.secondary }}>{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
            <div style={{ fontSize: 14, minHeight: 48, color: "#333", maxWidth: 220 }}>{product.description}</div>
            <div style={{ margin: "13px 0 0 0", color: theme.accent, fontWeight: 600, fontSize: 18 }}>${product.price.toFixed(2)}</div>
            <button
              className="btn"
              style={{
                background: theme.primary,
                color: "#fff",
                borderRadius: 8,
                marginTop: 10
              }}
              onClick={() => { onAdd(product); onClose(); }}
            >Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Auth Modal (Login/Register) =====
function AuthModal({ open, onClose, onLogin, onRegister }) {
  const [view, setView] = useState("login");
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => {
    if (open) {
      setView("login");
      setForm({ username: "", password: "" });
      setErr("");
      setLoading(false);
    }
  }, [open]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (view === "login") {
        await onLogin(form.username, form.password);
      } else {
        await onRegister(form.username, form.password);
      }
      onClose();
    } catch (error) {
      setErr(error.message);
    }
    setLoading(false);
  };
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "#111a", zIndex: 222, display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        width: 340, background: "#fff", borderRadius: 11,
        padding: "30px 24px 20px 24px", boxShadow: "0 2px 16px #2376",
        position: "relative"
      }}>
        <button onClick={onClose}
          style={{
            position: "absolute", right: 13, top: 11, background: "none", border: "none", fontSize: 24, color: theme.secondary, cursor: "pointer"
          }} title="Close">&times;</button>
        <h2 style={{ color: theme.primary, fontWeight: 700, fontSize: 22, margin: 0, marginBottom: 16 }}>
          {view === "login" ? "Login" : "Register"}
        </h2>
        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", color: theme.secondary, marginBottom: 5, fontWeight: 500 }}>Username</label>
          <input
            type="text"
            style={inputStyle}
            required
            autoFocus
            disabled={loading}
            minLength={3}
            value={form.username}
            onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
          />
          <label style={{ display: "block", color: theme.secondary, margin: "10px 0 5px 0", fontWeight: 500 }}>Password</label>
          <input
            type="password"
            style={inputStyle}
            required
            disabled={loading}
            minLength={3}
            value={form.password}
            onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
          />
          {err && <div style={{ color: "crimson", margin: "8px 0", fontWeight: 500 }}>{err}</div>}
          <button className="btn" style={{
            background: theme.primary,
            color: "#fff",
            width: "100%",
            marginTop: 13,
            borderRadius: 6
          }} disabled={loading}>
            {loading ? "..." : (view === "login" ? "Login" : "Register")}
          </button>
        </form>
        <div style={{ textAlign: "center", fontSize: 14, marginTop: 17 }}>
          {view === "login" ? (
            <>No account? <button style={plainBtn} onClick={() => setView("register")}>Register</button></>
          ) : (
            <>Already registered? <button style={plainBtn} onClick={() => setView("login")}>Login</button></>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", fontSize: 16, padding: "8px 12px",
  border: `1.5px solid #ddd`, borderRadius: 6, outline: "none", marginBottom: 5,
  marginTop: 1
};

const plainBtn = {
  color: theme.primary, background: "none", border: "none", cursor: "pointer", fontWeight: 600, textDecoration: "underline", padding: 0
};

// ===== Checkout Modal =====
function CheckoutModal({ open, onClose, cart, onPay, paymentInProgress, paymentSuccess, paymentError }) {
  const total = useMemo(() =>
    cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "#1119", zIndex: 230, display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        width: 400, maxWidth: "95vw", background: "#fff", borderRadius: 13,
        padding: "30px 23px 20px 23px", minHeight: 210, position: "relative"
      }}>
        <button onClick={onClose}
          style={{
            position: "absolute", right: 13, top: 11, background: "none", border: "none", fontSize: 25, color: theme.secondary, cursor: "pointer"
          }} title="Close">&times;</button>
        <h2 style={{ color: theme.primary, fontWeight: 700, fontSize: 21, margin: 0, marginBottom: 11 }}>Checkout</h2>
        <div style={{ fontWeight: 500, marginBottom: 16 }}>
          <span style={{ color: theme.secondary }}>Amount:</span>&nbsp;
          <span style={{ color: theme.accent, fontWeight: 700, fontSize: 17 }}>${total.toFixed(2)}</span>
        </div>
        {!paymentInProgress && !paymentSuccess && (
          <button className="btn"
            style={{ background: theme.primary, color: "#fff", width: "100%", borderRadius: 7, fontWeight: 600 }}
            onClick={onPay}
          >Pay now</button>
        )}
        {paymentInProgress && (
          <div style={{ color: theme.accent, marginTop: 21, fontWeight: 600 }}>Processing payment...</div>
        )}
        {paymentSuccess && (
          <div style={{ color: "green", fontWeight: 700, marginTop: 21 }}>
            Payment successful!<br />Thank you for your order.
          </div>
        )}
        {paymentError && (
          <div style={{ color: "crimson", fontWeight: 600, marginTop: 21 }}>{paymentError}</div>
        )}
      </div>
    </div>
  );
}

// ===== Orders Preview =====
function OrdersSection({ orders }) {
  if (!orders.length) return null;
  return (
    <section style={{ margin: "30px 0 18px 0" }}>
      <h2 style={{ color: theme.secondary, fontSize: 20, fontWeight: 700, margin: "0 0 15px 0" }}>Order History</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 8, boxShadow: "0 1px 7px #f3f3f3" }}>
        <thead>
          <tr style={{ background: theme.light, borderBottom: `2px solid ${theme.secondary}25` }}>
            <th style={thStyle}>Order #</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Total</th>
            <th style={thStyle}>Items</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, idx) => (
            <tr key={o.id || idx} style={{ borderBottom: `1px solid #eee` }}>
              <td style={tdStyle}>{o.id || (orders.length - idx)}</td>
              <td style={tdStyle}>{new Date(o.date).toLocaleDateString()}</td>
              <td style={tdStyle}>${o.total.toFixed(2)}</td>
              <td style={tdStyle}>{o.items.map(i => `${i.title}(x${i.qty})`).join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
const thStyle = { textAlign: "left", color: theme.secondary, fontWeight: 600, padding: "10px 7px" };
const tdStyle = { padding: "7px 7px", color: theme.dark };

// ================== MAIN CONTAINER ===================
function MainContainer() {
  // ----- State: Auth -----
  const [user, setUser] = useState(() => {
    const val = localStorage.getItem("osc_user");
    return val ? JSON.parse(val) : null;
  });
  const login = useCallback((username, password) => {
    // Demo: accepts any nonempty username/pass, simulate "register"
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!username || !password) return reject(new Error("Username/password required"));
        setUser({ username });
        localStorage.setItem("osc_user", JSON.stringify({ username }));
        resolve();
      }, 600);
    });
  }, []);
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("osc_user");
  }, []);
  const register = login;

  // ----- State: Cart -----
  const [cart, setCart] = useState(() => {
    const val = localStorage.getItem("osc_cart");
    return val ? JSON.parse(val) : [];
  });
  const saveCart = (cart) => {
    setCart(cart);
    localStorage.setItem("osc_cart", JSON.stringify(cart));
  };
  const addToCart = (product) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.id === product.id);
      let newCart;
      if (idx === -1) {
        newCart = [...prev, { ...product, qty: 1 }];
      } else {
        newCart = [...prev];
        newCart[idx].qty++;
      }
      localStorage.setItem("osc_cart", JSON.stringify(newCart));
      return newCart;
    });
  };
  const removeFromCart = (id) => {
    setCart(prev => {
      const next = prev.filter(i => i.id !== id);
      localStorage.setItem("osc_cart", JSON.stringify(next));
      return next;
    });
  };
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("osc_cart");
  };

  // ----- State: Orders -----
  const [orders, setOrders] = useState(() => {
    const val = localStorage.getItem("osc_orders");
    return val ? JSON.parse(val) : [];
  });
  const addOrder = (order) => {
    setOrders(prev => {
      const next = [order, ...prev];
      localStorage.setItem("osc_orders", JSON.stringify(next));
      return next;
    });
  };

  // ----- State: Products, Categories -----
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Product Detail/Cart modal control
  const [showCart, setShowCart] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Payment state
  const [paying, setPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [payError, setPayError] = useState(null);

  // --- Fetch products/categories ---
  useEffect(() => {
    setLoadingProducts(true);
    fetch(PRODUCTS_API).then(res => res.json())
      .then(data => { setProducts(data); setLoadingProducts(false); })
      .catch(() => setLoadingProducts(false));
    fetch(CATEGORIES_API).then(res => res.json())
      .then(cats => setCategories(cats)).catch(() => {});
  }, []);

  // --- Filtered products ---
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter(prod => prod.category === selectedCategory);
  }, [products, selectedCategory]);

  // --- Cart Modal Events ---
  const handleCartCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  // --- Payment/Order Logic ---
  const handlePay = () => {
    setPaying(true);
    setPayError(null);
    // Demo "payment": delay
    setTimeout(() => {
      setPaying(false);
      setPaySuccess(true);
      // Add order
      const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        total: cart.reduce((sum, i) => sum + i.price * i.qty, 0),
        items: cart
      };
      addOrder(order);
      clearCart();
      setTimeout(() => {
        setShowCheckout(false);
        setPaySuccess(false);
      }, 1650);
    }, 1650);
  };

  // --- Handle navigation/hash modals
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "cart") setShowCart(true);
    if (hash === "login") setShowAuth(true);
    const onHash = () => {
      const h = window.location.hash.replace("#", "");
      setShowCart(h === "cart");
      setShowAuth(h === "login");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // -- Provide Auth and Cart context
  return (
    <AuthContext.Provider value={{
      user, login, logout, register
    }}>
      <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
        <div className="app"
          style={{
            background: theme.light,
            color: theme.dark,
            minHeight: "100vh",
            fontFamily: "Inter, Roboto, Arial, sans-serif"
          }}>
          <Navbar />
          <div style={{
            display: "flex", flexDirection: "row", paddingTop: 73, height: "100%", minHeight: 620
          }}>
            <Sidebar categories={categories} selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
            <main className="main-content" style={{
              flex: 1,
              padding: 32,
              maxWidth: 1250,
              margin: "0 auto"
            }}>
              <div>
                <h1 style={{ color: theme.primary, fontWeight: 800, fontSize: 30, marginTop: 0, marginBottom: 6 }}>Products</h1>
                <hr style={{ borderColor: theme.secondary + "28" }} />
                {loadingProducts ? (
                  <div style={{ color: theme.secondary, padding: "30px 0" }}>Loading products...</div>
                ) : (
                  <ProductsList
                    products={filteredProducts}
                    onAdd={addToCart}
                    onDetail={(p) => { setDetailProduct(p); setShowDetail(true); }}
                  />
                )}
              </div>
              <OrdersSection orders={user ? orders : []} />
            </main>
          </div>
          <CartModal
            open={showCart}
            onClose={() => { setShowCart(false); window.location.hash = ""; }}
            cart={cart}
            onRemove={removeFromCart}
            onCheckout={handleCartCheckout}
          />
          <ProductDetailModal
            open={showDetail}
            onClose={() => setShowDetail(false)}
            product={detailProduct}
            onAdd={addToCart}
          />
          <AuthModal
            open={showAuth}
            onClose={() => { setShowAuth(false); window.location.hash = ""; }}
            onLogin={login}
            onRegister={register}
          />
          <CheckoutModal
            open={showCheckout}
            onClose={() => { setShowCheckout(false); setPayError(null); setPaySuccess(false); }}
            cart={cart}
            onPay={handlePay}
            paymentInProgress={paying}
            paymentSuccess={paySuccess}
            paymentError={payError}
          />
        </div>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}

// ================== MAIN APP ENTRY ===================

// PUBLIC_INTERFACE
function App() {
  /**
   * The main entry for OpenShop Connect.
   * 
   * Handles authentication, product listing, cart, payment, order history, 
   * with a modern, responsive layout and theming.
   */
  return <MainContainer />;
}

export default App;
