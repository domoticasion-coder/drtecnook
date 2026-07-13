import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, LayoutDashboard, ShoppingBag, Truck, Users, 
  Settings, LogOut, Search, Plus, Edit, Trash2, Check, X, 
  SlidersHorizontal, RefreshCw, Landmark, Cpu, Hammer, Heart, Eye, Layers 
} from "lucide-react";
import { Product, Order, Customer, ServiceRequest, Collection } from "../types.js";

interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  pendingServiceRequests: number;
  inProgressServiceRequests: number;
  recentOrders: any[];
  recentServiceRequests: any[];
}

export const AdminDashboardPage: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Admin tabs state
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "customers" | "support" | "collections">("overview");

  // Admin lists data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);

  // Editing states
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);

  // Search/Filter states inside tabs
  const [productSearch, setProductSearch] = useState("");
  const [productCatFilter, setProductCatFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [ticketSearch, setTicketSearch] = useState("");

  // Loader states
  const [loadingData, setLoadingData] = useState(false);

  // Edit/Create Product Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Specifications builder helper
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");

  // Helper to make authenticated requests to the admin API
  const fetchWithAuth = async (url: string, init?: RequestInit) => {
    const token = localStorage.getItem("dr_tecno_admin_token");
    const headers = new Headers(init?.headers);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return fetch(url, { ...init, headers });
  };

  // Check existing session on mount
  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetchWithAuth("/api/admin/session");
        if (response.ok) {
          const data = await response.json();
          setIsAdmin(true);
          setUsername(data.username);
        } else {
          localStorage.removeItem("dr_tecno_admin_token");
        }
      } catch (err) {
        console.error("Session verification failed:", err);
      } finally {
        setCheckingAuth(false);
      }
    };
    verifySession();
  }, []);

  // Fetch admin data once authenticated or on activeTab change
  useEffect(() => {
    if (!isAdmin) return;

    const loadAdminData = async () => {
      setLoadingData(true);
      try {
        if (activeTab === "overview") {
          const resp = await fetchWithAuth("/api/admin/stats");
          if (resp.ok) setStats(await resp.json());
        } else if (activeTab === "products") {
          const resp = await fetchWithAuth("/api/admin/products");
          if (resp.ok) setProducts(await resp.json());
        } else if (activeTab === "orders") {
          const resp = await fetchWithAuth("/api/admin/orders");
          if (resp.ok) setOrders(await resp.json());
        } else if (activeTab === "customers") {
          const resp = await fetchWithAuth("/api/admin/customers");
          if (resp.ok) setCustomers(await resp.json());
        } else if (activeTab === "support") {
          const resp = await fetchWithAuth("/api/admin/service-requests");
          if (resp.ok) setServiceRequests(await resp.json());
        } else if (activeTab === "collections") {
          const resp = await fetchWithAuth("/api/admin/collections");
          if (resp.ok) setCollections(await resp.json());
        }
      } catch (err) {
        console.error("Error loading admin data:", err);
      } finally {
        setLoadingData(false);
      }
    };

    loadAdminData();
  }, [isAdmin, activeTab]);

  // Handle Admin Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem("dr_tecno_admin_token", data.token);
        }
        setIsAdmin(true);
        setPassword("");
      } else {
        const data = await response.json();
        setLoginError(data.error || "Credenciales incorrectas");
      }
    } catch (err) {
      setLoginError("Error de conexión al servidor");
    }
  };

  // Handle Admin Logout
  const handleLogout = async () => {
    try {
      await fetchWithAuth("/api/admin/logout", { method: "POST" });
      localStorage.removeItem("dr_tecno_admin_token");
      setIsAdmin(false);
      setUsername("");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Handle order status modifications
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetchWithAuth(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        // Refresh orders list
        const resp = await fetchWithAuth("/api/admin/orders");
        if (resp.ok) setOrders(await resp.json());
      }
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  // Handle service request updates
  const handleUpdateServiceRequest = async (id: string, payload: Partial<ServiceRequest>) => {
    try {
      const response = await fetchWithAuth(`/api/admin/service-requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const resp = await fetchWithAuth("/api/admin/service-requests");
        if (resp.ok) setServiceRequests(await resp.json());
      }
    } catch (err) {
      console.error("Failed to update service request:", err);
    }
  };

  // Delete product action
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("¿Estás seguro de que querés eliminar permanentemente este producto del catálogo?")) return;
    try {
      const response = await fetchWithAuth(`/api/admin/products/${id}`, { method: "DELETE" });
      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  // Open product modal for creation
  const handleNewProductClick = () => {
    setEditingProduct({
      name: "",
      slug: "",
      category: "Herramientas",
      collection: "herramientas",
      brand: "",
      price: 0,
      stock: 5,
      short_description: "",
      description: "",
      image_url: "",
      specifications: {},
      badge: "",
      featured: false,
      active: true
    });
    setIsProductModalOpen(true);
  };

  // Open product modal for edit
  const handleEditProductClick = (prod: Product) => {
    setEditingProduct({ ...prod });
    setIsProductModalOpen(true);
  };

  // Handle product creation or update submit
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || !editingProduct.slug) {
      alert("Completá los campos requeridos.");
      return;
    }

    const isEdit = !!editingProduct.id;
    const url = isEdit ? `/api/admin/products/${editingProduct.id}` : "/api/admin/products";
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct)
      });

      if (response.ok) {
        setIsProductModalOpen(false);
        setEditingProduct(null);
        // Refresh products
        const resp = await fetchWithAuth("/api/admin/products");
        if (resp.ok) setProducts(await resp.json());
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(`Ocurrió un error al guardar el producto: ${errData.details || errData.error || "Error desconocido"}`);
      }
    } catch (err: any) {
      console.error("Failed to save product:", err);
      alert(`Error de conexión al guardar el producto: ${err.message || String(err)}`);
    }
  };

  const handleSaveCollection = async () => {
    if (!editingCollection) return;
    try {
      const response = await fetchWithAuth(`/api/admin/collections/${editingCollection.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCollection)
      });
      if (response.ok) {
        const updated = await response.json();
        setCollections(prev => prev.map(c => c.id === updated.id ? updated : c));
        setIsCollectionModalOpen(false);
        setEditingCollection(null);
      } else {
        alert("Ocurrió un error al guardar la colección.");
      }
    } catch (err) {
      console.error("Failed to save collection:", err);
      alert("Error de conexión al guardar la colección.");
    }
  };

  const handleAddSpecification = () => {
    if (!specKey.trim() || !specValue.trim() || !editingProduct) return;
    const updatedSpecs = {
      ...(editingProduct.specifications || {}),
      [specKey.trim()]: specValue.trim()
    };
    setEditingProduct(prev => prev ? { ...prev, specifications: updatedSpecs } : null);
    setSpecKey("");
    setSpecValue("");
  };

  const handleRemoveSpecification = (key: string) => {
    if (!editingProduct || !editingProduct.specifications) return;
    const updatedSpecs = { ...editingProduct.specifications };
    delete updatedSpecs[key];
    setEditingProduct(prev => prev ? { ...prev, specifications: updatedSpecs } : null);
  };

  // Rendering loading state for login verification
  if (checkingAuth) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4 font-sans tech-bg">
        <div className="h-10 w-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground">Verificando nivel de acceso administrativo...</p>
      </div>
    );
  }

  // ==================== ADMINISTRATIVE LOGIN FORM SCREEN ====================
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center font-sans tech-bg min-h-[500px]">
        <div className="w-full max-w-md bg-card border border-border/80 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="p-3 bg-accent/15 border border-accent/25 text-accent rounded-full w-fit mx-auto">
              <ShieldAlert className="w-6 h-6 animate-pulse-subtle" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-foreground">Acceso Administrador</h1>
            <p className="text-xs text-muted-foreground">Logueate con tu cuenta autorizada para gestionar inventario, ventas y tickets técnicos.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-foreground font-semibold">Usuario de Red</label>
              <input
                type="text"
                required
                placeholder="Ej: admin_dr_tecno"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-background border border-border rounded-lg p-3 text-foreground outline-none focus:border-accent font-serif"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-foreground font-semibold">Contraseña Segura</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-lg p-3 text-foreground outline-none focus:border-accent"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-lg text-rose-300 leading-normal text-[11px]">
                ⚠️ {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full h-11 bg-accent hover:bg-accent/90 text-accent-foreground font-serif font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filter products inside products manager
  const filteredProductsList = products.filter((prod) => {
    const matchesSearch = (prod.name || "").toLowerCase().includes(productSearch.toLowerCase()) || 
                          (prod.brand || "").toLowerCase().includes(productSearch.toLowerCase()) ||
                          (prod.category || "").toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCatFilter === "all" || prod.category === productCatFilter;
    return matchesSearch && matchesCategory;
  });

  // Filter orders inside orders manager
  const filteredOrdersList = orders.filter((ord) => 
    (ord.order_number || "").toLowerCase().includes(orderSearch.toLowerCase()) ||
    (ord.customer_name || "").toLowerCase().includes(orderSearch.toLowerCase())
  );

  // Filter service requests inside technical support manager
  const filteredServiceRequests = serviceRequests.filter((req) => 
    (req.request_number || "").toLowerCase().includes(ticketSearch.toLowerCase()) ||
    (req.customer_name || "").toLowerCase().includes(ticketSearch.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 font-sans tech-bg flex flex-col lg:flex-row gap-8 items-start">
      
      {/* ==================== ADMIN NAVIGATION SIDEBAR ==================== */}
      <aside className="w-full lg:w-64 bg-card border border-border/60 rounded-xl p-4 space-y-4 shrink-0">
        <div className="border-b border-border/30 pb-3 flex flex-col gap-2">
          <img 
            src="https://i.postimg.cc/ry7vnvRP/Chat-GPT-Image-13-jul-2026-06-16-55-p-m.png" 
            alt="Dr Tecno Logo" 
            className="h-8 w-auto object-contain self-start"
            referrerPolicy="no-referrer"
          />
          <div>
            <span className="text-[10px] text-accent font-mono block">Control Panel ({username})</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1 text-xs">
          {[
            { id: "overview", label: "Panel de Control", icon: LayoutDashboard },
            { id: "products", label: "Gestionar Productos", icon: ShoppingBag },
            { id: "collections", label: "Gestionar Colecciones", icon: Layers },
            { id: "orders", label: "Gestionar Pedidos", icon: Truck },
            { id: "customers", label: "Gestionar Clientes", icon: Users },
            { id: "support", label: "Servicio Técnico", icon: Hammer },
          ].map((tab) => {
            const IconC = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer ${
                  isActive 
                    ? "bg-accent/10 text-accent font-medium border-l-2 border-accent pl-3" 
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                }`}
              >
                <IconC className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-border/30 pt-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg text-left text-xs font-semibold cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* ==================== ADMIN TAB PANELS CONTENT ==================== */}
      <main className="flex-1 w-full bg-card/20 border border-border/45 rounded-xl p-5 sm:p-6 min-h-[500px]">
        {loadingData && (
          <div className="flex items-center justify-center h-48 text-xs text-muted-foreground gap-2">
            <div className="w-4 h-4 border border-accent border-t-transparent rounded-full animate-spin" />
            <span>Sincronizando información de Supabase...</span>
          </div>
        )}

        {!loadingData && (
          <>
            {/* ==================== PANEL 1: OVERVIEW STATISTICS ==================== */}
            {activeTab === "overview" && stats && (
              <div className="space-y-8 animate-fade-in text-xs">
                <div className="border-b border-border/30 pb-3">
                  <h2 className="font-serif text-lg font-bold text-foreground">Estadísticas Comerciales</h2>
                </div>

                {/* Grid counters */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-card border border-border/45 p-4 rounded-xl space-y-1 shadow">
                    <span className="text-muted-foreground font-serif text-[10px] uppercase tracking-widest">Ingresos Totales</span>
                    <p className="font-serif font-bold text-lg sm:text-2xl text-accent">
                      USD {stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Facturado contra entrega o acreditado.</p>
                  </div>

                  <div className="bg-card border border-border/45 p-4 rounded-xl space-y-1 shadow">
                    <span className="text-muted-foreground font-serif text-[10px] uppercase tracking-widest">Total Pedidos</span>
                    <p className="font-serif font-bold text-lg sm:text-2xl text-foreground">
                      {stats.totalOrders}
                    </p>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
                      {stats.pendingOrders} en preparación / despacho
                    </p>
                  </div>

                  <div className="bg-card border border-border/45 p-4 rounded-xl space-y-1 shadow">
                    <span className="text-muted-foreground font-serif text-[10px] uppercase tracking-widest">Clientes Activos</span>
                    <p className="font-serif font-bold text-lg sm:text-2xl text-foreground">
                      {stats.totalCustomers}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Registros únicos en base de datos.</p>
                  </div>

                  <div className="bg-card border border-border/45 p-4 rounded-xl space-y-1 shadow">
                    <span className="text-muted-foreground font-serif text-[10px] uppercase tracking-widest">Taller Técnico</span>
                    <p className="font-serif font-bold text-lg sm:text-2xl text-accent">
                      {stats.pendingServiceRequests}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Reparaciones en progreso o diagnóstico.</p>
                  </div>
                </div>

                {/* Custom SVG Graphical Trend Data Viz Chart */}
                <div className="bg-card border border-border/50 rounded-xl p-5 space-y-3 shadow">
                  <span className="font-semibold text-foreground font-serif uppercase text-[9px] tracking-widest">PROGRESO MENSUAL DE FACTURACIÓN (USD)</span>
                  
                  {/* Visual trend simulation using animated inline vector paths */}
                  <div className="h-44 w-full bg-background border border-border/40 rounded-lg relative overflow-hidden flex items-end px-12 pt-6">
                    {/* SVG Graphic vector paths for beautiful gradients */}
                    <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      
                      {/* Grid lines */}
                      <line x1="0" y1="33%" x2="100%" y2="33%" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="4 4" />
                      <line x1="0" y1="66%" x2="100%" y2="66%" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="4 4" />

                      {/* Area */}
                      <path 
                        d="M -20,170 Q 150,110 300,120 T 600,60 T 900,100 L 900,180 L -20,180 Z" 
                        fill="url(#chartGrad)" 
                      />

                      {/* Line */}
                      <path 
                        d="M -20,170 Q 150,110 300,120 T 600,60 T 900,100" 
                        fill="none" 
                        stroke="var(--color-accent)" 
                        strokeWidth="2.5" 
                        className="animate-pulse-subtle"
                      />
                    </svg>

                    {/* Simple months markers */}
                    <div className="absolute bottom-1 left-0 right-0 px-12 flex justify-between text-[9px] font-serif text-muted-foreground">
                      <span>Marzo</span>
                      <span>Abril</span>
                      <span>Mayo</span>
                      <span>Junio</span>
                      <span>Julio (Actual)</span>
                    </div>

                    <div className="absolute top-2 right-4 bg-accent/10 border border-accent/20 px-2 py-0.5 text-[9px] font-bold text-accent rounded uppercase tracking-wider">
                      RECH_GRAPH: SEGUIMIENTO EN TIEMPO REAL
                    </div>
                  </div>
                </div>

                {/* Recent entries double panel lists */}
                <div className="grid gap-6 md:grid-cols-2 text-[11px]">
                  {/* Recent orders */}
                  <div className="bg-card border border-border/50 rounded-xl p-4 space-y-3 shadow">
                    <span className="font-serif font-bold text-foreground">Ventas Recientes</span>
                    <div className="space-y-2">
                      {stats.recentOrders.length === 0 ? (
                        <p className="text-muted-foreground italic">No hay pedidos registrados.</p>
                      ) : (
                        stats.recentOrders.map((ord: any) => (
                          <div key={ord.id} className="flex justify-between items-center border-b border-border/10 pb-1.5 last:border-0">
                            <div>
                              <p className="font-serif font-bold text-foreground">{ord.order_number}</p>
                              <p className="text-[10px] text-muted-foreground">{ord.customer_name} · {ord.items_count} items</p>
                            </div>
                            <div className="text-right">
                              <p className="font-serif font-bold text-accent">USD {ord.total.toLocaleString("en-US")}</p>
                              <span className="text-[9px] px-1.5 py-0.2 border border-border rounded bg-muted/40 text-foreground">{ord.status}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Recent repairs */}
                  <div className="bg-card border border-border/50 rounded-xl p-4 space-y-3 shadow">
                    <span className="font-serif font-bold text-foreground">Ingresos de Laboratorio Recientes</span>
                    <div className="space-y-2">
                      {stats.recentServiceRequests.length === 0 ? (
                        <p className="text-muted-foreground italic">No hay tickets técnicos cargados.</p>
                      ) : (
                        stats.recentServiceRequests.map((req: any) => (
                          <div key={req.id} className="flex justify-between items-center border-b border-border/10 pb-1.5 last:border-0">
                            <div>
                              <p className="font-serif font-bold text-foreground">{req.request_number}</p>
                              <p className="text-[10px] text-muted-foreground">{req.customer_name} · {req.device_type}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-foreground">{req.brand} {req.model}</p>
                              <span className="text-[9px] px-1.5 py-0.2 border border-border rounded bg-muted/40 text-foreground uppercase tracking-widest">{req.status}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== PANEL 2: PRODUCTS CATALOG CRUD ==================== */}
            {activeTab === "products" && (
              <div className="space-y-4 animate-fade-in text-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/30 pb-3">
                  <h2 className="font-serif text-lg font-bold text-foreground">Catálogo de Productos</h2>
                  <button
                    onClick={handleNewProductClick}
                    className="px-4 py-2 bg-accent text-accent-foreground font-serif font-bold uppercase rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Producto</span>
                  </button>
                </div>

                {/* Filtering controls bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Buscar por nombre, marca..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 outline-none focus:border-accent"
                    />
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <select
                    value={productCatFilter}
                    onChange={(e) => setProductCatFilter(e.target.value)}
                    className="bg-background border border-border rounded-lg px-3 py-2 text-foreground outline-none focus:border-accent font-serif"
                  >
                    <option value="all">Todas las Categorías</option>
                    {["Herramientas", "Insumos", "Capacitaciones", "Merchandising"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Table list */}
                <div className="overflow-x-auto border border-border/60 rounded-xl bg-card">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/60 border-b border-border/40 font-serif font-semibold text-foreground text-[10px] uppercase tracking-wider">
                        <th className="p-3">Detalle / Imagen</th>
                        <th className="p-3">Precio</th>
                        <th className="p-3">Stock</th>
                        <th className="p-3">Destacado / Activo</th>
                        <th className="p-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20 text-[11px]">
                      {filteredProductsList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-muted-foreground italic">No se encontraron productos en esta selección.</td>
                        </tr>
                      ) : (
                        filteredProductsList.map((prod) => (
                          <tr key={prod.id} className="hover:bg-muted/20 transition-colors">
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={prod.image_url || ""}
                                  alt={prod.name}
                                  className="w-10 h-10 object-cover rounded bg-muted/15 border border-border/30"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="min-w-0">
                                  <span className="text-[9px] text-accent uppercase font-serif block">{prod.brand}</span>
                                  <p className="font-semibold text-foreground truncate max-w-[200px]">{prod.name}</p>
                                  <span className="text-[10px] text-muted-foreground">{prod.category}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 font-serif font-bold text-foreground">
                              USD {prod.price.toLocaleString("en-US")}
                            </td>
                            <td className="p-3">
                              <span className={`font-serif font-bold ${prod.stock <= 3 ? "text-rose-400 font-extrabold" : "text-foreground"}`}>
                                {prod.stock} un.
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex flex-col gap-1">
                                <span className={`inline-block px-1.5 py-0.2 rounded font-semibold w-fit text-[9px] ${
                                  prod.featured ? "bg-accent/15 border border-accent/20 text-accent" : "bg-muted/40 border border-border/30 text-muted-foreground"
                                }`}>
                                  {prod.featured ? "DESTACADO" : "REGULAR"}
                                </span>
                                <span className={`inline-block px-1.5 py-0.2 rounded font-semibold w-fit text-[9px] ${
                                  prod.active ? "bg-emerald-950/40 border border-emerald-500/20 text-emerald-400" : "bg-rose-950/40 border border-rose-500/20 text-rose-400"
                                }`}>
                                  {prod.active ? "ACTIVO" : "INACTIVO"}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => handleEditProductClick(prod)}
                                  className="p-1.5 bg-muted hover:bg-accent hover:text-accent-foreground text-foreground border border-border rounded-lg transition-colors cursor-pointer"
                                  title="Editar"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod.id)}
                                  className="p-1.5 bg-muted hover:bg-rose-500/10 text-rose-400 border border-transparent hover:border-rose-500/20 rounded-lg transition-colors cursor-pointer"
                                  title="Eliminar permanentemente"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ==================== PANEL 3: ORDERS PROCESSOR ==================== */}
            {activeTab === "orders" && (
              <div className="space-y-4 animate-fade-in text-xs">
                <div className="border-b border-border/30 pb-3">
                  <h2 className="font-serif text-lg font-bold text-foreground">Pedidos y Compras</h2>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por código de pedido o nombre de cliente..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 outline-none focus:border-accent"
                  />
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <div className="overflow-x-auto border border-border/60 rounded-xl bg-card">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/60 border-b border-border/40 font-serif font-semibold text-foreground text-[10px] uppercase tracking-wider">
                        <th className="p-3">Código / Fecha</th>
                        <th className="p-3">Cliente</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Estado</th>
                        <th className="p-3 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20 text-[11px]">
                      {filteredOrdersList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-muted-foreground italic">No se encontraron pedidos.</td>
                        </tr>
                      ) : (
                        filteredOrdersList.map((ord) => (
                          <tr key={ord.id} className="hover:bg-muted/20 transition-colors">
                            <td className="p-3">
                              <span className="font-serif font-bold text-foreground text-sm block">{ord.order_number}</span>
                              <span className="text-[10px] text-muted-foreground">{new Date(ord.created_at).toLocaleDateString()}</span>
                            </td>
                            <td className="p-3">
                              <p className="font-semibold text-foreground">{ord.customer_name}</p>
                              <p className="text-[10px] text-muted-foreground truncate max-w-[160px]">{ord.customer_email}</p>
                              <span className="text-[9px] uppercase font-serif text-accent block mt-0.5">{ord.delivery_method}</span>
                            </td>
                            <td className="p-3 font-serif font-bold text-foreground">
                              USD {ord.total.toLocaleString("en-US")}
                            </td>
                            <td className="p-3">
                              <select
                                value={ord.status}
                                onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                className="bg-background border border-border rounded-md px-1.5 py-1 text-[11px] text-foreground outline-none focus:border-accent"
                              >
                                {["En preparación", "Despachado", "Entregado", "Cancelado"].map(st => (
                                  <option key={st} value={st}>{st}</option>
                                ))}
                              </select>
                            </td>
                            <td className="p-3 text-right">
                              <span className="text-[10px] text-muted-foreground font-mono">{ord.items_count} un.</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ==================== PANEL 4: CUSTOMERS DIRECTORY ==================== */}
            {activeTab === "customers" && (
              <div className="space-y-4 animate-fade-in text-xs">
                <div className="border-b border-border/30 pb-3">
                  <h2 className="font-serif text-lg font-bold text-foreground">Clientes Registrados</h2>
                </div>

                <div className="overflow-x-auto border border-border/60 rounded-xl bg-card">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/60 border-b border-border/40 font-serif font-semibold text-foreground text-[10px] uppercase tracking-wider">
                        <th className="p-3">Nombre</th>
                        <th className="p-3">Contacto</th>
                        <th className="p-3">Ubicación</th>
                        <th className="p-3 text-right">Historial</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20 text-[11px]">
                      {customers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-muted-foreground italic">No hay clientes registrados en la base de datos de Supabase.</td>
                        </tr>
                      ) : (
                        customers.map((cust) => (
                          <tr key={cust.id} className="hover:bg-muted/20 transition-colors">
                            <td className="p-3">
                              <p className="font-bold text-foreground">{cust.name}</p>
                              <p className="text-[10px] text-muted-foreground">ID: {cust.id.slice(0, 8)}</p>
                            </td>
                            <td className="p-3 space-y-0.5">
                              <p>{cust.email}</p>
                              <p className="text-muted-foreground">{cust.phone || "Sin Teléfono"}</p>
                            </td>
                            <td className="p-3">
                              <p className="truncate max-w-[150px]">{cust.address || "N/A"}</p>
                              <p className="text-[10px] text-muted-foreground">{cust.city}, {cust.state}</p>
                            </td>
                            <td className="p-3 text-right">
                              <span className="text-[10px] bg-accent/10 border border-accent/20 px-2 py-0.5 rounded font-serif text-accent">COMPRADOR</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ==================== PANEL 5: TECHNICAL SERVICE LABORATORY TICKETS ==================== */}
            {activeTab === "support" && (
              <div className="space-y-4 animate-fade-in text-xs">
                <div className="border-b border-border/30 pb-3">
                  <h2 className="font-serif text-lg font-bold text-foreground">Mesa de Servicio Técnico</h2>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por número de ticket o nombre de cliente..."
                    value={ticketSearch}
                    onChange={(e) => setTicketSearch(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 outline-none focus:border-accent"
                  />
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <div className="overflow-x-auto border border-border/60 rounded-xl bg-card">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/60 border-b border-border/40 font-serif font-semibold text-foreground text-[10px] uppercase tracking-wider">
                        <th className="p-3">Ticket / Fecha</th>
                        <th className="p-3">Equipo</th>
                        <th className="p-3">Cliente</th>
                        <th className="p-3">Falla / Problema</th>
                        <th className="p-3 text-right">Actualizar Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20 text-[11px]">
                      {filteredServiceRequests.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-muted-foreground italic">No hay tickets de reparación en curso.</td>
                        </tr>
                      ) : (
                        filteredServiceRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-muted/20 transition-colors">
                            <td className="p-3">
                              <span className="font-serif font-bold text-accent text-sm block">{req.request_number}</span>
                              <span className="text-[10px] text-muted-foreground">{new Date(req.created_at).toLocaleDateString()}</span>
                            </td>
                            <td className="p-3">
                              <p className="font-bold text-foreground">{req.device_type}</p>
                              <p className="text-muted-foreground">{req.brand} {req.model}</p>
                            </td>
                            <td className="p-3">
                              <p className="font-semibold text-foreground">{req.customer_name}</p>
                              <p className="text-[10px] text-muted-foreground">{req.phone}</p>
                            </td>
                            <td className="p-3">
                              <p className="truncate max-w-[150px] italic">"{req.problem_description}"</p>
                              {req.internal_notes && <p className="text-[10px] text-accent font-semibold mt-1">Notas: {req.internal_notes}</p>}
                            </td>
                            <td className="p-3 text-right space-y-1.5">
                              <select
                                value={req.status}
                                onChange={(e) => handleUpdateServiceRequest(req.id, { status: e.target.value as any })}
                                className="bg-background border border-border rounded-md px-1.5 py-1 text-[11px] text-foreground outline-none focus:border-accent w-full max-w-[140px]"
                              >
                                {["Pendiente", "En diagnóstico", "Esperando aprobación", "En proceso", "Listo", "Entregado", "Cancelado"].map(st => (
                                  <option key={st} value={st}>{st.toUpperCase()}</option>
                                ))}
                              </select>
                              
                              <input
                                type="text"
                                placeholder="Escribir nota de laboratorio..."
                                defaultValue={req.internal_notes || ""}
                                onBlur={(e) => handleUpdateServiceRequest(req.id, { internal_notes: e.target.value })}
                                className="w-full max-w-[140px] bg-background border border-border rounded p-1 text-[10px] text-foreground"
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ==================== PANEL 6: COLLECTIONS / CATEGORIES EDITOR ==================== */}
            {activeTab === "collections" && (
              <div className="space-y-4 animate-fade-in text-xs">
                <div className="border-b border-border/30 pb-3">
                  <h2 className="font-serif text-lg font-bold text-foreground">Gestión de Colecciones y Páginas</h2>
                  <p className="text-muted-foreground text-[11px] mt-0.5">Modificá el contenido de las secciones principales de la tienda (Herramientas, Insumos, Capacitaciones, Merchandising) en tiempo real.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {collections.map((col) => (
                    <div key={col.id} className="bg-card border border-border/60 rounded-xl overflow-hidden shadow flex flex-col justify-between">
                      <div className="relative h-32 bg-muted overflow-hidden">
                        <img 
                          src={col.bg_url || col.bgUrl || "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&auto=format&fit=crop&q=60"} 
                          alt={col.name} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-3 left-3 text-white">
                          <span className="text-[9px] uppercase font-bold text-accent tracking-wider font-mono">{col.id.toUpperCase()}</span>
                          <h4 className="font-serif font-bold text-base leading-tight">{col.name}</h4>
                        </div>
                      </div>
                      <div className="p-4 space-y-2 flex-grow">
                        <div>
                          <p className="text-[10px] font-semibold text-accent font-mono uppercase">{col.subtitle || "Sin subtítulo"}</p>
                          <p className="text-muted-foreground text-[11px] line-clamp-3 mt-1 leading-relaxed">
                            {col.description || "Sin descripción cargada."}
                          </p>
                        </div>
                      </div>
                      <div className="p-3 bg-muted/40 border-t border-border/20 flex justify-end">
                        <button
                          onClick={() => {
                            setEditingCollection({ ...col });
                            setIsCollectionModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors flex items-center gap-1.5 text-[11px] cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Editar Sección</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ==================== SUB-MODAL: PRODUCT CREATION & EDITION ==================== */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-card border border-border w-full max-w-xl rounded-xl shadow-2xl p-6 space-y-4 animate-scale-up my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/30 pb-2">
              <h3 className="font-serif font-bold text-base text-foreground">
                {editingProduct.id ? "Editar Producto" : "Nuevo Producto"}
              </h3>
              <button 
                onClick={() => {
                  setIsProductModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-1 text-muted-foreground hover:text-foreground rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Nombre del Producto *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ""}
                    onChange={(e) => {
                      const nameVal = e.target.value;
                      setEditingProduct(prev => {
                        if (!prev) return null;
                        const update = { ...prev, name: nameVal };
                        if (!prev.id) {
                          // Clean slugifier helper
                          update.slug = nameVal
                            .toLowerCase()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "") // remove accents
                            .replace(/[^\w\s-]/g, "")        // remove non-word chars
                            .trim()
                            .replace(/[\s_]+/g, "-")         // spaces to hyphens
                            .replace(/^-+|-+$/g, "");        // clean start/end
                        }
                        return update;
                      });
                    }}
                    className="w-full bg-background border border-border rounded p-2 text-foreground"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Slug Único *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.slug || ""}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, slug: e.target.value } : null)}
                    placeholder="ej: notebook-asus-zenbook"
                    className="w-full bg-background border border-border rounded p-2 text-foreground font-serif"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Categoría *</label>
                  <select
                    value={editingProduct.category || "Herramientas"}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, category: e.target.value } : null)}
                    className="w-full bg-background border border-border rounded p-2 text-foreground"
                  >
                    {["Herramientas", "Insumos", "Capacitaciones", "Merchandising"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Colección</label>
                  <select
                    value={editingProduct.collection || ""}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, collection: e.target.value || undefined } : null)}
                    className="w-full bg-background border border-border rounded p-2 text-foreground"
                  >
                    <option value="">Ninguna</option>
                    <option value="herramientas">Herramientas de Precisión</option>
                    <option value="insumos">Insumos & Repuestos</option>
                    <option value="capacitaciones">Capacitaciones</option>
                    <option value="merchandising">Merchandising Dr Tecno</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Marca *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.brand || ""}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, brand: e.target.value } : null)}
                    className="w-full bg-background border border-border rounded p-2 text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Precio (USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, price: parseFloat(e.target.value) } : null)}
                    className="w-full bg-background border border-border rounded p-2 text-foreground font-serif font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Stock *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock || 0}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, stock: parseInt(e.target.value) } : null)}
                    className="w-full bg-background border border-border rounded p-2 text-foreground font-serif"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Badge Decorativo</label>
                  <input
                    type="text"
                    value={editingProduct.badge || ""}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, badge: e.target.value } : null)}
                    placeholder="Ej: 10% OFF, NUEVO"
                    className="w-full bg-background border border-border rounded p-2 text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Imagen URL principal</label>
                <input
                  type="url"
                  value={editingProduct.image_url || ""}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, image_url: e.target.value } : null)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-background border border-border rounded p-2 text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Descripción Corta *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.short_description || ""}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, short_description: e.target.value } : null)}
                  className="w-full bg-background border border-border rounded p-2 text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Descripción Detallada</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="w-full bg-background border border-border rounded p-2 text-foreground resize-none"
                />
              </div>

              {/* Specifications Sub-builder */}
              <div className="border border-border/50 rounded-lg p-3 space-y-2">
                <span className="font-serif font-bold text-[10px] text-foreground uppercase tracking-wider block">Especificaciones Técnicas</span>
                
                {/* Specifications List */}
                {editingProduct.specifications && Object.keys(editingProduct.specifications).length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-2 max-h-24 overflow-y-auto">
                    {Object.entries(editingProduct.specifications).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between bg-muted px-2 py-1 rounded border border-border/30">
                        <span className="truncate max-w-[80px] font-semibold">{k}: {v}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSpecification(k)}
                          className="text-rose-400 hover:text-rose-500 font-bold px-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Spec inputs */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Clave (Ej: Procesador)"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    className="w-1/2 bg-background border border-border rounded p-1.5 text-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Valor (Ej: Intel i7)"
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    className="w-1/2 bg-background border border-border rounded p-1.5 text-foreground"
                  />
                  <button
                    type="button"
                    onClick={handleAddSpecification}
                    className="px-3 bg-accent text-accent-foreground rounded font-bold font-serif"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Status checkboxes */}
              <div className="flex gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={!!editingProduct.featured}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, featured: e.target.checked } : null)}
                    className="accent-accent"
                  />
                  <label htmlFor="featured" className="font-semibold text-foreground cursor-pointer select-none">Destacado en Portada</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={editingProduct.active !== undefined ? !!editingProduct.active : true}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, active: e.target.checked } : null)}
                    className="accent-accent"
                  />
                  <label htmlFor="active" className="font-semibold text-foreground cursor-pointer select-none">Producto Activo en Tienda</label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-accent text-accent-foreground font-serif font-bold uppercase tracking-widest rounded-lg hover:bg-accent/90 transition-colors cursor-pointer"
              >
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================== SUB-MODAL: COLLECTION EDITION ==================== */}
      {isCollectionModalOpen && editingCollection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-card border border-border w-full max-w-xl rounded-xl shadow-2xl p-6 space-y-4 animate-scale-up my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/30 pb-2">
              <h3 className="font-serif font-bold text-base text-foreground">
                Personalizar Contenido: {editingCollection.name}
              </h3>
              <button 
                onClick={() => {
                  setIsCollectionModalOpen(false);
                  setEditingCollection(null);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                await handleSaveCollection();
              }}
              className="space-y-4 text-xs"
            >
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Nombre de la Colección/Página *</label>
                <input
                  type="text"
                  required
                  value={editingCollection.name || ""}
                  onChange={(e) => setEditingCollection(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full bg-background border border-border rounded p-2 text-foreground font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Subtítulo Descriptivo *</label>
                <input
                  type="text"
                  required
                  value={editingCollection.subtitle || ""}
                  onChange={(e) => setEditingCollection(prev => prev ? { ...prev, subtitle: e.target.value } : null)}
                  className="w-full bg-background border border-border rounded p-2 text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Imagen URL de Banner/Portada</label>
                <input
                  type="url"
                  value={editingCollection.bg_url || editingCollection.bgUrl || ""}
                  onChange={(e) => setEditingCollection(prev => prev ? { ...prev, bg_url: e.target.value, bgUrl: e.target.value } : null)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-background border border-border rounded p-2 text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Texto de Introducción / Descripción Detallada</label>
                <textarea
                  rows={4}
                  value={editingCollection.description || ""}
                  onChange={(e) => setEditingCollection(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="w-full bg-background border border-border rounded p-2 text-foreground resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-accent text-accent-foreground font-serif font-bold uppercase tracking-widest rounded-lg hover:bg-accent/90 transition-colors cursor-pointer"
              >
                Guardar Cambios de Sección
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
