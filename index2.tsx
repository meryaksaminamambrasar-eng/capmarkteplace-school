import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Lock, 
  Plus, 
  Edit2, 
  Trash2, 
  Settings, 
  Palette, 
  Image, 
  Check, 
  X, 
  ChevronRight, 
  User, 
  Users, 
  BookOpen, 
  Heart,
  ShoppingCart,
  Send,
  Sparkles,
  LockOpen,
  ClipboardList,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// Data mock dasar produk hasil karya siswa
const DEFAULT_PRODUCTS = [
  {
    id: '1',
    name: 'Kripik Tempe Keju Premium',
    category: 'Kuliner',
    targetRole: 'Siswa',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bb087?w=500&auto=format&fit=crop&q=60',
    description: 'Kripik tempe renyah dengan balutan bumbu keju premium buatan siswa jurusan Kuliner. Tanpa bahan pengawet!',
    stock: 25,
    seller: 'Kelas XI Kuliner 1'
  },
  {
    id: '2',
    name: 'Meja Belajar Minimalis Kayu Jati',
    category: 'Kriya & Furniture',
    targetRole: 'Orang Tua',
    price: 350000,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&auto=format&fit=crop&q=60',
    description: 'Meja belajar kokoh berdesain minimalis estetik, diproduksi langsung oleh siswa jurusan Kriya Kayu.',
    stock: 3,
    seller: 'Kelas XII Kriya Kayu'
  },
  {
    id: '3',
    name: 'Aplikasi Kasir Sekolah "SmartCash"',
    category: 'Teknologi',
    targetRole: 'Guru',
    price: 500000,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60',
    description: 'Software kasir berbasis web untuk koperasi sekolah. Mudah digunakan dan dilengkapi laporan keuangan otomatis karya siswa RPL.',
    stock: 10,
    seller: 'Tim RPL Creative'
  },
  {
    id: '4',
    name: 'Pupuk Kompos Organik "Go-Green"',
    category: 'Pertanian',
    targetRole: 'Umum',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500&auto=format&fit=crop&q=60',
    description: 'Pupuk kompos super subur hasil olahan limbah organik sekolah oleh siswa jurusan Agribisnis Organik.',
    stock: 50,
    seller: 'Green Club Agro'
  },
  {
    id: '5',
    name: 'Tas Kanvas Lukis Handmade',
    category: 'Fashion',
    targetRole: 'Umum',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=60',
    description: 'Tas jinjing kanvas tebal dengan lukisan tangan kustom bertema kebudayaan lokal karya siswa Seni Rupa.',
    stock: 8,
    seller: 'Siswa Seni Rupa'
  }
];

// Pilihan Warna Tema Aplikasi
const THEME_PRESETS = [
  { id: 'emerald', name: 'Emerald Green', primary: 'bg-emerald-600', hover: 'hover:bg-emerald-700', text: 'text-emerald-600', border: 'border-emerald-600', ring: 'focus:ring-emerald-500', bgLight: 'bg-emerald-50', bgHeader: 'from-emerald-700 to-teal-900' },
  { id: 'indigo', name: 'Indigo Blue', primary: 'bg-indigo-600', hover: 'hover:bg-indigo-700', text: 'text-indigo-600', border: 'border-indigo-600', ring: 'focus:ring-indigo-500', bgLight: 'bg-indigo-50', bgHeader: 'from-indigo-700 to-purple-900' },
  { id: 'rose', name: 'Warm Rose', primary: 'bg-rose-600', hover: 'hover:bg-rose-700', text: 'text-rose-600', border: 'border-rose-600', ring: 'focus:ring-rose-500', bgLight: 'bg-rose-50', bgHeader: 'from-rose-700 to-red-900' },
  { id: 'amber', name: 'Amber Gold', primary: 'bg-amber-600', hover: 'hover:bg-amber-700', text: 'text-amber-600', border: 'border-amber-600', ring: 'focus:ring-amber-500', bgLight: 'bg-amber-50', bgHeader: 'from-amber-600 to-orange-800' },
];

export default function App() {
  // State Utama Aplikasi
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('cap_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('cap_theme');
    return saved ? JSON.parse(saved) : THEME_PRESETS[0];
  });

  const [logoSettings, setLogoSettings] = useState(() => {
    const saved = localStorage.getItem('cap_logo');
    return saved ? JSON.parse(saved) : {
      type: 'text', // 'text' atau 'image'
      text: 'CAP Marketplace',
      imageUrl: ''
    };
  });

  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('cap_admin_password') || 'admin123';
  });

  // State Pemesanan (Disimpan di Local Storage)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('cap_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // State Navigasi & Filter
  const [activeTab, setActiveTab] = useState('pengunjung'); // 'pengunjung' atau 'admin'
  const [adminSubTab, setAdminSubTab] = useState('katalog'); // 'katalog' atau 'pesanan'
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('Semua'); // 'Semua', 'Guru', 'Siswa', 'Orang Tua', 'Umum'
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('Semua');

  // State Operasi CRUD Admin
  const [isEditing, setIsEditing] = useState(false); // true jika sedang tambah/edit
  const [editingProduct, setEditingProduct] = useState(null); // null untuk tambah baru, objek untuk edit
  const [productToDelete, setProductToDelete] = useState(null); // ID produk yang akan dihapus
  const [orderToDelete, setOrderToDelete] = useState(null); // ID pesanan yang akan dihapus
  
  // State Form Pemesanan
  const [orderingProduct, setOrderingProduct] = useState(null); // Produk yang sedang dipesan
  const [orderForm, setOrderForm] = useState({
    name: '',
    role: 'Siswa',
    phone: '',
    notes: '',
    quantity: 1
  });
  const [orderSuccess, setOrderSuccess] = useState(false);

  // State Modal Autentikasi Admin & Ganti Password
  const [inputPassword, setInputPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ old: '', new1: '', new2: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // Temp State untuk Pengaturan Logo/Tampilan di Panel Admin
  const [tempLogo, setTempLogo] = useState({ ...logoSettings });

  // Sync state ke LocalStorage ketika ada perubahan
  useEffect(() => {
    localStorage.setItem('cap_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('cap_theme', JSON.stringify(currentTheme));
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('cap_logo', JSON.stringify(logoSettings));
  }, [logoSettings]);

  useEffect(() => {
    localStorage.setItem('cap_admin_password', adminPassword);
  }, [adminPassword]);

  useEffect(() => {
    localStorage.setItem('cap_orders', JSON.stringify(orders));
  }, [orders]);

  // Hitung jumlah pesanan baru (belum diproses)
  const newOrdersCount = orders.filter(o => o.status === 'Baru').length;

  // Handler Autentikasi Admin
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (inputPassword === adminPassword) {
      setIsAdminAuthenticated(true);
      setAuthError('');
      setInputPassword('');
    } else {
      setAuthError('Kata sandi salah! Silakan coba lagi.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setActiveTab('pengunjung');
  };

  // Handler Ganti Password Admin
  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.old !== adminPassword) {
      setPasswordMessage({ type: 'error', text: 'Kata sandi lama tidak cocok!' });
      return;
    }
    if (passwordForm.new1.length < 4) {
      setPasswordMessage({ type: 'error', text: 'Kata sandi baru minimal 4 karakter!' });
      return;
    }
    if (passwordForm.new1 !== passwordForm.new2) {
      setPasswordMessage({ type: 'error', text: 'Konfirmasi kata sandi baru tidak sesuai!' });
      return;
    }
    setAdminPassword(passwordForm.new1);
    setPasswordMessage({ type: 'success', text: 'Kata sandi admin berhasil diubah!' });
    setPasswordForm({ old: '', new1: '', new2: '' });
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordMessage({ type: '', text: '' });
    }, 2000);
  };

  // Handler Pengelolaan Produk (CRUD)
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    targetRole: 'Semua',
    price: '',
    image: '',
    description: '',
    stock: '',
    seller: ''
  });

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Kuliner',
      targetRole: 'Umum',
      price: '',
      image: '',
      description: '',
      stock: '',
      seller: ''
    });
    setIsEditing(true);
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      targetRole: product.targetRole,
      price: product.price,
      image: product.image,
      description: product.description,
      stock: product.stock,
      seller: product.seller
    });
    setIsEditing(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (editingProduct) {
      // Edit mode
      setProducts(products.map(p => p.id === editingProduct.id ? {
        ...p,
        name: productForm.name,
        category: productForm.category,
        targetRole: productForm.targetRole,
        price: Number(productForm.price),
        image: productForm.image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60',
        description: productForm.description,
        stock: Number(productForm.stock),
        seller: productForm.seller
      } : p));
    } else {
      // Add mode
      const newProduct = {
        id: Date.now().toString(),
        name: productForm.name,
        category: productForm.category,
        targetRole: productForm.targetRole,
        price: Number(productForm.price),
        image: productForm.image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60',
        description: productForm.description,
        stock: Number(productForm.stock),
        seller: productForm.seller
      };
      setProducts([newProduct, ...products]);
    }
    setIsEditing(false);
  };

  const handleDeleteProduct = (productId) => {
    setProductToDelete(productId);
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete));
      setProductToDelete(null);
    }
  };

  // Handler Pemesanan
  const handleOpenOrder = (product) => {
    setOrderingProduct(product);
    setOrderForm({
      name: '',
      role: 'Siswa',
      phone: '',
      notes: '',
      quantity: 1
    });
    setOrderSuccess(false);
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    
    // Buat objek pemesanan baru untuk disimpan ke admin
    const newOrder = {
      id: Date.now().toString(),
      productId: orderingProduct.id,
      productName: orderingProduct.name,
      productImage: orderingProduct.image,
      price: orderingProduct.price,
      quantity: orderForm.quantity,
      totalPrice: orderingProduct.price * orderForm.quantity,
      customerName: orderForm.name,
      customerRole: orderForm.role,
      customerPhone: orderForm.phone,
      notes: orderForm.notes,
      seller: orderingProduct.seller,
      status: 'Baru', // 'Baru', 'Diproses', 'Selesai'
      date: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
    };

    // Tambah pemesanan baru ke dalam state
    setOrders([newOrder, ...orders]);
    setOrderSuccess(true);
    
    // Potong stok produk secara lokal
    setProducts(products.map(p => {
      if (p.id === orderingProduct.id) {
        return { ...p, stock: Math.max(0, p.stock - orderForm.quantity) };
      }
      return p;
    }));
  };

  // Mengubah Status Pemesanan oleh Admin
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  // Menghapus Pesanan dari Riwayat Admin
  const handleDeleteOrder = (orderId) => {
    setOrderToDelete(orderId);
  };

  const confirmDeleteOrder = () => {
    if (orderToDelete) {
      setOrders(orders.filter(o => o.id !== orderToDelete));
      setOrderToDelete(null);
    }
  };

  // Dapatkan daftar kategori unik untuk filter
  const categories = ['Semua', ...new Set(products.map(p => p.category))];

  // Saring produk berdasarkan pencarian, role, dan kategori
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.seller.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = selectedRoleFilter === 'Semua' || product.targetRole === selectedRoleFilter || product.targetRole === 'Semua';
    const matchesCategory = selectedCategoryFilter === 'Semua' || product.category === selectedCategoryFilter;
    
    return matchesSearch && matchesRole && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      
      {/* 1. TOP HEADER BAR */}
      <header className={`bg-gradient-to-r ${currentTheme.bgHeader} text-white shadow-md sticky top-0 z-40 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo area */}
            <div className="flex items-center space-x-3">
              <div className="bg-white/15 p-2.5 rounded-xl backdrop-blur-md border border-white/10 flex items-center justify-center">
                <ShoppingBag className="h-7 w-7 text-white" />
              </div>
              <div>
                {logoSettings.type === 'text' ? (
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-sm">
                    {logoSettings.text}
                  </h1>
                ) : (
                  <img 
                    src={logoSettings.imageUrl || 'https://via.placeholder.com/150x50?text=LOGO'} 
                    alt="Logo Aplikasi" 
                    className="max-h-12 max-w-[180px] object-contain rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150x50?text=Logo+Error';
                    }}
                  />
                )}
                <span className="text-xs text-white/70 block font-light -mt-1">Karya Siswa, Kebanggaan Sekolah</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-2 bg-black/15 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setActiveTab('pengunjung')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                  activeTab === 'pengunjung' 
                    ? 'bg-white text-slate-900 shadow' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Katalog Pengunjung</span>
                <span className="sm:hidden">Katalog</span>
              </button>
              
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 relative ${
                  activeTab === 'admin' 
                    ? 'bg-white text-slate-900 shadow' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Lock className="h-4 w-4" />
                <span>Panel Admin</span>
                {newOrdersCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] h-5 w-5 rounded-full flex items-center justify-center font-bold border-2 border-slate-950 animate-pulse">
                    {newOrdersCount}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 2. MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* ==================== A. HALAMAN PENGUNJUNG ==================== */}
        {activeTab === 'pengunjung' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Front Cover / Banner */}
            <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${currentTheme.bgHeader} text-white shadow-xl`}>
              <div className="absolute inset-0 bg-grid-white opacity-10"></div>
              <div className="relative px-6 py-12 sm:px-12 sm:py-20 max-w-3xl space-y-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md">
                  <Sparkles className="h-3 w-3 mr-1" /> Kewirausahaan Berbasis Sekolah
                </span>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  Wadah Karya Kreatif & Produk Unggulan Siswa
                </h2>
                <p className="text-lg text-white/80 max-w-xl font-light">
                  Mendukung pengembangan jiwa kewirausahaan siswa dengan menyajikan hasil karya orisinal terbaik yang siap dipesan oleh guru, siswa, orang tua, maupun masyarakat umum.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium border border-white/5">👨‍🏫 Guru</span>
                  <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium border border-white/5">🎒 Siswa</span>
                  <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium border border-white/5">👪 Orang Tua</span>
                  <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium border border-white/5">🌐 Umum</span>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden lg:block">
                <div className="h-full w-full opacity-20 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=60")' }}></div>
              </div>
            </div>

            {/* Pencarian dan Filter */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
              
              {/* Kolom Pencarian */}
              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari produk karya siswa... (misal: kripik, pupuk, meja)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all text-sm"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Filter Peran Pengguna */}
                <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 overflow-x-auto whitespace-nowrap">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 py-1">Untuk:</span>
                  {['Semua', 'Guru', 'Siswa', 'Orang Tua', 'Umum'].map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRoleFilter(role)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedRoleFilter === role
                          ? `${currentTheme.primary} text-white shadow-sm`
                          : 'text-slate-600 hover:bg-slate-200/50'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Kategori */}
              <div className="border-t border-slate-100 pt-4 flex flex-wrap gap-2 items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Kategori Produk:</span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      selectedCategoryFilter === cat
                        ? `${currentTheme.primary} ${currentTheme.border} text-white shadow-sm`
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

            </div>

            {/* Katalog Grid */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">
                    {selectedRoleFilter !== 'Semua' ? `Produk Spesial Untuk ${selectedRoleFilter}` : 'Katalog Unggulan'}
                  </h3>
                  <p className="text-sm text-slate-500">Menampilkan {filteredProducts.length} produk pilihan terbaik</p>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl py-16 px-4 text-center border border-slate-100 shadow-sm">
                  <ShoppingBag className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                  <p className="text-lg font-bold text-slate-700">Produk Tidak Ditemukan</p>
                  <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
                    Coba ubah kata kunci pencarian Anda atau reset filter peran dan kategori untuk melihat produk lainnya.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedRoleFilter('Semua');
                      setSelectedCategoryFilter('Semua');
                    }}
                    className={`mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-white ${currentTheme.primary} ${currentTheme.hover}`}
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col group"
                    >
                      {/* Foto Produk */}
                      <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60';
                          }}
                        />
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {product.category}
                          </span>
                        </div>
                        
                        {/* Label Target Peran */}
                        <div className="absolute top-3 right-3">
                          <span className={`text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md ${
                            product.targetRole === 'Siswa' ? 'bg-blue-600/90' :
                            product.targetRole === 'Guru' ? 'bg-purple-600/90' :
                            product.targetRole === 'Orang Tua' ? 'bg-amber-600/90' : 'bg-emerald-600/90'
                          }`}>
                            Untuk {product.targetRole}
                          </span>
                        </div>
                      </div>

                      {/* Info Detail Produk */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-slate-400">{product.seller}</p>
                          <h4 className="font-bold text-lg text-slate-800 line-clamp-1 group-hover:text-slate-900 transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-slate-600 text-sm line-clamp-2 font-light">
                            {product.description}
                          </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="block text-xs font-medium text-slate-400">Harga</span>
                            <span className={`text-xl font-black ${currentTheme.text}`}>
                              Rp {product.price.toLocaleString('id-ID')}
                            </span>
                          </div>
                          
                          {product.stock > 0 ? (
                            <button
                              onClick={() => handleOpenOrder(product)}
                              className={`px-4 py-2 rounded-xl text-sm font-bold text-white transition-all flex items-center space-x-1.5 ${currentTheme.primary} ${currentTheme.hover}`}
                            >
                              <ShoppingCart className="h-4 w-4" />
                              <span>Pesan</span>
                            </button>
                          ) : (
                            <span className="bg-red-50 text-red-600 px-3 py-1.5 rounded-xl text-xs font-bold border border-red-100">
                              Stok Habis
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==================== B. PANEL ADMINISTRATOR ==================== */}
        {activeTab === 'admin' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* 1. JIKA BELUM TERAUTENTIKASI */}
            {!isAdminAuthenticated ? (
              <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-md border border-slate-100 space-y-6">
                <div className="text-center space-y-2">
                  <div className="h-14 w-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-red-500 border border-red-100">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Autentikasi Administrator</h3>
                  <p className="text-sm text-slate-500">
                    Masukkan kata sandi khusus administrator untuk mengelola logo, warna, katalog produk, dan daftar pemesanan.
                  </p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Kata Sandi Admin
                    </label>
                    <input
                      type="password"
                      placeholder="Masukkan kata sandi..."
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 text-sm"
                      autoFocus
                    />
                    {authError && (
                      <p className="text-xs font-medium text-red-500 mt-1.5">{authError}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 rounded-xl text-sm font-bold text-white shadow-sm transition-all ${currentTheme.primary} ${currentTheme.hover}`}
                  >
                    Buka Akses Panel
                  </button>
                </form>
              </div>
            ) : (
              
              // 2. JIKA SUDAH TERAUTENTIKASI (PANEL UTAMA)
              <div className="space-y-6">
                
                {/* Header Panel Admin */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="h-12 w-12 bg-green-50 text-green-600 border border-green-100 rounded-xl flex items-center justify-center">
                      <LockOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        Panel Administrator Aktif
                      </h3>
                      <p className="text-xs text-slate-400">Kelola identitas visual marketplace, daftar katalog produk, serta kelola pesanan masuk.</p>
                    </div>
                  </div>

                  {/* Tombol Logout & Ganti Password */}
                  <div className="flex items-center flex-wrap gap-2">
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex items-center space-x-1.5"
                    >
                      <Settings className="h-3.5 w-3.5" />
                      <span>Ubah Password Admin</span>
                    </button>
                    
                    <button
                      onClick={handleAdminLogout}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                    >
                      Keluar Panel
                    </button>
                  </div>
                </div>

                {/* Sub Tab Navigation inside Admin Panel */}
                <div className="flex border-b border-slate-200">
                  <button
                    onClick={() => setAdminSubTab('katalog')}
                    className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center space-x-2 ${
                      adminSubTab === 'katalog' 
                        ? `${currentTheme.text} ${currentTheme.border.replace('border-', 'border-b-')}` 
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Kelola Katalog & Tampilan</span>
                  </button>

                  <button
                    onClick={() => setAdminSubTab('pesanan')}
                    className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center space-x-2 relative ${
                      adminSubTab === 'pesanan' 
                        ? `${currentTheme.text} ${currentTheme.border.replace('border-', 'border-b-')}` 
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <ClipboardList className="h-4 w-4" />
                    <span>Daftar Pemesanan Masuk</span>
                    {newOrdersCount > 0 && (
                      <span className="ml-1.5 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {newOrdersCount} Baru
                      </span>
                    )}
                  </button>
                </div>

                {/* TAB 1: KELOLA KATALOG & TAMPILAN */}
                {adminSubTab === 'katalog' && (
                  <div className="space-y-8 animate-fadeIn">
                    
                    {/* Grid Setting Visual: Logo & Tema Tampilan */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Panel Pengaturan Tema Warna */}
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                        <h4 className="font-extrabold text-slate-800 text-base flex items-center space-x-2">
                          <Palette className="h-4 w-4 text-slate-500" />
                          <span>Atur Warna Tampilan</span>
                        </h4>
                        
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Pilih palet warna aksen aplikasi. Perubahan akan langsung diaplikasikan ke tombol, teks, ikon, dan background utama di seluruh halaman pengunjung.
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                          {THEME_PRESETS.map((theme) => {
                            const isSelected = currentTheme.id === theme.id;
                            return (
                              <button
                                key={theme.id}
                                onClick={() => setCurrentTheme(theme)}
                                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all space-y-3 ${
                                  isSelected 
                                    ? 'border-slate-800 bg-slate-50 ring-2 ring-slate-800/20' 
                                    : 'border-slate-100 hover:bg-slate-50/50'
                                }`}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-xs font-bold text-slate-700">{theme.name}</span>
                                  {isSelected && <Check className="h-3.5 w-3.5 text-slate-900" />}
                                </div>
                                <div className="flex gap-1.5">
                                  <div className={`h-4 w-4 rounded-full ${theme.primary}`}></div>
                                  <div className="h-4 w-12 rounded bg-slate-200"></div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Panel Pengaturan Logo */}
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 lg:col-span-2">
                        <h4 className="font-extrabold text-slate-800 text-base flex items-center space-x-2">
                          <Image className="h-4 w-4 text-slate-500" />
                          <span>Kelola Logo Aplikasi</span>
                        </h4>

                        <p className="text-xs text-slate-500">
                          Ubah logo aplikasi dengan memilih jenis logo teks ataupun gambar kustom menggunakan tautan gambar luar.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          <div className="space-y-4">
                            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                              <button
                                type="button"
                                onClick={() => setTempLogo({ ...tempLogo, type: 'text' })}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
                                  tempLogo.type === 'text' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                                }`}
                              >
                                Format Teks
                              </button>
                              <button
                                type="button"
                                onClick={() => setTempLogo({ ...tempLogo, type: 'image' })}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
                                  tempLogo.type === 'image' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                                }`}
                              >
                                Format Gambar
                              </button>
                            </div>

                            {tempLogo.type === 'text' ? (
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Aplikasi</label>
                                <input
                                  type="text"
                                  value={tempLogo.text}
                                  onChange={(e) => setTempLogo({ ...tempLogo, text: e.target.value })}
                                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                />
                              </div>
                            ) : (
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">URL Gambar Logo</label>
                                <input
                                  type="text"
                                  placeholder="https://contoh-link.com/logo.png"
                                  value={tempLogo.imageUrl}
                                  onChange={(e) => setTempLogo({ ...tempLogo, imageUrl: e.target.value })}
                                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                                />
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setLogoSettings(tempLogo);
                              }}
                              className={`w-full py-2 rounded-xl text-xs font-bold text-white ${currentTheme.primary} ${currentTheme.hover}`}
                            >
                              Simpan Perubahan Logo
                            </button>
                          </div>

                          {/* Preview Box */}
                          <div className="border border-dashed border-slate-200 rounded-2xl p-4 flex flex-col justify-between bg-slate-50/50">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Live Preview Header Anda:</span>
                            <div className={`p-4 rounded-xl bg-gradient-to-r ${currentTheme.bgHeader} flex items-center space-x-3 text-white`}>
                              <ShoppingBag className="h-6 w-6 shrink-0" />
                              <div>
                                {tempLogo.type === 'text' ? (
                                  <h5 className="font-extrabold text-sm">{tempLogo.text || 'CAP Marketplace'}</h5>
                                ) : (
                                  <img 
                                    src={tempLogo.imageUrl || 'https://via.placeholder.com/150x50?text=LOGO'} 
                                    alt="Live Preview" 
                                    className="max-h-8 object-contain rounded"
                                  />
                                )}
                                <span className="text-[9px] text-white/75 block">Karya Siswa, Kebanggaan Sekolah</span>
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-400 italic mt-3 text-center block">Sesuai dengan tema warna terpilih.</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Panel Utama CRUD Katalog Barang */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                      
                      {/* Judul tabel dan tombol tambah */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-lg">Kelola Katalog Barang</h4>
                          <p className="text-xs text-slate-500">Tambah, ubah, atau hapus produk unggulan yang ditampilkan di halaman utama.</p>
                        </div>

                        <button
                          onClick={openAddProductModal}
                          className={`px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm flex items-center space-x-1.5 transition-all self-start sm:self-auto ${currentTheme.primary} ${currentTheme.hover}`}
                        >
                          <Plus className="h-4 w-4" />
                          <span>Tambah Barang Baru</span>
                        </button>
                      </div>

                      {/* Tabel Data Barang */}
                      <div className="overflow-x-auto rounded-xl border border-slate-100">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                              <th className="py-4 px-4 w-24">Foto</th>
                              <th className="py-4 px-4">Nama Produk</th>
                              <th className="py-4 px-4">Kategori</th>
                              <th className="py-4 px-4">Khusus Untuk</th>
                              <th className="py-4 px-4">Produsen/Kelas</th>
                              <th className="py-4 px-4">Harga</th>
                              <th className="py-4 px-4 text-center w-12">Stok</th>
                              <th className="py-4 px-4 text-right w-28">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                            {products.length === 0 ? (
                              <tr>
                                <td colSpan="8" className="py-12 text-center text-slate-400 font-medium">
                                  Belum ada data barang. Silakan tambahkan barang baru!
                                </td>
                              </tr>
                            ) : (
                              products.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/55 transition-colors">
                                  <td className="py-3 px-4">
                                    <img 
                                      src={p.image} 
                                      alt={p.name} 
                                      className="w-16 h-10 object-cover rounded-lg border border-slate-200"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60';
                                      }}
                                    />
                                  </td>
                                  <td className="py-3 px-4 font-semibold text-slate-900">{p.name}</td>
                                  <td className="py-3 px-4 text-xs">
                                    <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                                      {p.category}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-xs">
                                    <span className={`px-2.5 py-1 rounded-full font-semibold text-white ${
                                      p.targetRole === 'Siswa' ? 'bg-blue-600/80' :
                                      p.targetRole === 'Guru' ? 'bg-purple-600/80' :
                                      p.targetRole === 'Orang Tua' ? 'bg-amber-600/80' : 'bg-emerald-600/80'
                                    }`}>
                                      {p.targetRole}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-xs text-slate-500 font-medium">{p.seller}</td>
                                  <td className="py-3 px-4 font-bold text-slate-900">
                                    Rp {p.price.toLocaleString('id-ID')}
                                  </td>
                                  <td className="py-3 px-4 text-center font-semibold text-slate-700">{p.stock} pcs</td>
                                  <td className="py-3 px-4 text-right">
                                    <div className="flex items-center justify-end space-x-1">
                                      <button
                                        onClick={() => openEditProductModal(p)}
                                        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
                                        title="Ubah Barang"
                                      >
                                        <Edit2 className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteProduct(p.id)}
                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                                        title="Hapus Barang"
                                      >
                                        <Trash2 className="h-4 w-4" />
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

                  </div>
                )}

                {/* TAB 2: DAFTAR PEMESANAN MASUK (ADMIN VIEW) */}
                {adminSubTab === 'pesanan' && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 animate-fadeIn">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-lg">Kelola Pemesanan Masuk</h4>
                      <p className="text-xs text-slate-500">Pantau rincian pemesan, koordinasikan ke kelas terkait, dan kelola status prosesnya.</p>
                    </div>

                    {orders.length === 0 ? (
                      <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                        <ClipboardList className="h-16 w-16 mx-auto text-slate-300 mb-3" />
                        <h5 className="font-bold text-slate-700 text-base">Belum Ada Pemesanan</h5>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">Semua pesanan yang diajukan oleh pengunjung lewat form pesanan akan masuk secara real-time di panel ini.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-slate-100">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                              <th className="py-4 px-4">Tanggal</th>
                              <th className="py-4 px-4">Rincian Pemesan</th>
                              <th className="py-4 px-4">Item Karya Siswa</th>
                              <th className="py-4 px-4 text-center">Jumlah</th>
                              <th className="py-4 px-4">Total Biaya</th>
                              <th className="py-4 px-4 text-center">Status</th>
                              <th className="py-4 px-4 text-right">Kelola Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                            {orders.map((o) => (
                              <tr key={o.id} className={`hover:bg-slate-50/40 transition-colors ${o.status === 'Baru' ? 'bg-blue-50/30' : ''}`}>
                                
                                {/* Tanggal */}
                                <td className="py-4 px-4 whitespace-nowrap">
                                  <span className="font-bold text-slate-900 block">{o.date}</span>
                                </td>

                                {/* Pemesan */}
                                <td className="py-4 px-4">
                                  <span className="font-bold text-slate-900 block text-sm">{o.customerName}</span>
                                  <div className="flex items-center space-x-2 mt-0.5">
                                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-semibold text-slate-600">{o.customerRole}</span>
                                    <a 
                                      href={`https://wa.me/${o.customerPhone.replace(/^0/, '62')}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-emerald-600 hover:underline font-medium"
                                    >
                                      {o.customerPhone}
                                    </a>
                                  </div>
                                  {o.notes && (
                                    <p className="text-[11px] text-slate-500 mt-1.5 italic bg-slate-50 p-1.5 rounded border border-slate-100 max-w-xs">
                                      " {o.notes} "
                                    </p>
                                  )}
                                </td>

                                {/* Item */}
                                <td className="py-4 px-4">
                                  <div className="flex items-center space-x-2">
                                    <img 
                                      src={o.productImage} 
                                      alt={o.productName} 
                                      className="w-10 h-8 object-cover rounded border"
                                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=100'; }}
                                    />
                                    <div>
                                      <span className="font-bold text-slate-800 block">{o.productName}</span>
                                      <span className="text-[10px] text-slate-400">Produsen: {o.seller}</span>
                                    </div>
                                  </div>
                                </td>

                                {/* Jumlah */}
                                <td className="py-4 px-4 text-center font-bold text-slate-700">{o.quantity} pcs</td>

                                {/* Total Biaya */}
                                <td className="py-4 px-4 font-black text-slate-900 text-sm">
                                  Rp {o.totalPrice.toLocaleString('id-ID')}
                                </td>

                                {/* Status Badge */}
                                <td className="py-4 px-4 text-center">
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                    o.status === 'Baru' ? 'bg-blue-100 text-blue-700' :
                                    o.status === 'Diproses' ? 'bg-amber-100 text-amber-700' :
                                    'bg-green-100 text-green-700'
                                  }`}>
                                    {o.status === 'Baru' && <Clock className="h-3 w-3 mr-1" />}
                                    {o.status === 'Diproses' && <AlertCircle className="h-3 w-3 mr-1 animate-pulse" />}
                                    {o.status === 'Selesai' && <CheckCircle className="h-3 w-3 mr-1" />}
                                    {o.status}
                                  </span>
                                </td>

                                {/* Aksi Kelola */}
                                <td className="py-4 px-4 text-right">
                                  <div className="flex items-center justify-end space-x-1.5">
                                    {o.status === 'Baru' && (
                                      <button
                                        onClick={() => handleUpdateOrderStatus(o.id, 'Diproses')}
                                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] transition-all"
                                      >
                                        Proses
                                      </button>
                                    )}
                                    {o.status === 'Diproses' && (
                                      <button
                                        onClick={() => handleUpdateOrderStatus(o.id, 'Selesai')}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] transition-all"
                                      >
                                        Selesai
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleDeleteOrder(o.id)}
                                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                                      title="Hapus Pesanan"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
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
                )}

              </div>
            )}

          </div>
        )}

      </main>

      {/* 3. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 mt-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left space-y-1">
            <p className="font-bold text-white text-sm">{logoSettings.text} &copy; 2026</p>
            <p>Mendukung Kewirausahaan Siswa & Hubungan Sekolah dengan Masyarakat.</p>
          </div>
          <div className="flex space-x-4">
            <span className="hover:text-white transition-colors">Guru</span>
            <span>&bull;</span>
            <span className="hover:text-white transition-colors">Siswa</span>
            <span>&bull;</span>
            <span className="hover:text-white transition-colors">Orang Tua</span>
            <span>&bull;</span>
            <span className="hover:text-white transition-colors">Umum</span>
          </div>
        </div>
      </footer>

      {/* ==================== IV. MODAL-MODAL INTERAKTIF ==================== */}

      {/* MODAL KONFIRMASI HAPUS PESANAN */}
      {orderToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-5">
            <div className="text-center space-y-3">
              <div className="h-14 w-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-red-500 border border-red-100">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Hapus Data Pesanan?</h3>
              <p className="text-sm text-slate-500">
                Apakah Anda yakin ingin menghapus data transaksi pemesanan ini dari panel riwayat?
              </p>
            </div>

            <div className="flex space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteOrder}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-all shadow-sm"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS PRODUK */}
      {productToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-5">
            <div className="text-center space-y-3">
              <div className="h-14 w-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-red-500 border border-red-100">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Hapus Produk?</h3>
              <p className="text-sm text-slate-500">
                Apakah Anda yakin ingin menghapus produk ini dari katalog? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteProduct}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-all shadow-sm"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT / TAMBAH PRODUK (CRUD ADMIN) */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-xl border border-slate-100 space-y-5 my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-800">
                {editingProduct ? 'Ubah Data Produk' : 'Tambah Produk Baru'}
              </h3>
              <button 
                onClick={() => setIsEditing(false)} 
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Produk *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tas Laptop Rajut"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kategori *</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="Kuliner">Kuliner</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Kriya & Furniture">Kriya & Furniture</option>
                  <option value="Pertanian">Pertanian</option>
                  <option value="Teknologi">Teknologi</option>
                  <option value="Seni Kreatif">Seni Kreatif</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Akses Spesifik (Untuk) *</label>
                <select
                  value={productForm.targetRole}
                  onChange={(e) => setProductForm({ ...productForm, targetRole: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="Umum">Umum (Semua)</option>
                  <option value="Siswa">Siswa</option>
                  <option value="Guru">Guru</option>
                  <option value="Orang Tua">Orang Tua</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Harga (Rupiah) *</label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 25000"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Jumlah Stok *</label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 15"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pembuat / Kelas Produsen *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: XI Tata Busana 2"
                  value={productForm.seller}
                  onChange={(e) => setProductForm({ ...productForm, seller: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tautan Foto Produk (URL)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <p className="text-[10px] text-slate-400 mt-1">Kosongkan untuk menggunakan gambar standar bawaan sistem.</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Deskripsi & Detail Produk *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Ceritakan tentang detail kelebihan, bahan, rasa, ukuran dari produk ini..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                ></textarea>
              </div>

              <div className="md:col-span-2 flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-sm font-bold text-white shadow-sm transition-all ${currentTheme.primary} ${currentTheme.hover}`}
                >
                  Simpan Produk
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL GANTI PASSWORD ADMIN */}
      {isChangingPassword && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-800">
                Ubah Password Admin
              </h3>
              <button 
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordMessage({ type: '', text: '' });
                }} 
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kata Sandi Saat Ini</label>
                <input
                  type="password"
                  required
                  value={passwordForm.old}
                  onChange={(e) => setPasswordForm({ ...passwordForm, old: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kata Sandi Baru (Min. 4 Karakter)</label>
                <input
                  type="password"
                  required
                  value={passwordForm.new1}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new1: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ulangi Kata Sandi Baru</label>
                <input
                  type="password"
                  required
                  value={passwordForm.new2}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new2: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              {passwordMessage.text && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${
                  passwordMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {passwordMessage.text}
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordMessage({ type: '', text: '' });
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-sm font-bold text-white shadow-sm transition-all ${currentTheme.primary} ${currentTheme.hover}`}
                >
                  Ubah Kata Sandi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETAIL PRODUK & FORMULIR PEMESANAN */}
      {orderingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-xl border border-slate-100 flex flex-col md:flex-row my-8">
            
            {/* Bagian Kiri: Info Detail Produk */}
            <div className="md:w-1/2 bg-slate-50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100">
              <div className="space-y-4">
                <img 
                  src={orderingProduct.image} 
                  alt={orderingProduct.name} 
                  className="w-full aspect-video object-cover rounded-2xl border border-slate-200/80 shadow-sm"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60';
                  }}
                />
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {orderingProduct.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      orderingProduct.targetRole === 'Siswa' ? 'bg-blue-100 text-blue-700' :
                      orderingProduct.targetRole === 'Guru' ? 'bg-purple-100 text-purple-700' :
                      orderingProduct.targetRole === 'Orang Tua' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      Khusus {orderingProduct.targetRole}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800">{orderingProduct.name}</h3>
                  <p className="text-xs font-semibold text-slate-400">Diproduksi oleh: {orderingProduct.seller}</p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <h5 className="text-xs font-bold text-slate-500 uppercase">Deskripsi Produk:</h5>
                  <p className="text-slate-600 text-sm leading-relaxed font-light">
                    {orderingProduct.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200/60 mt-6 flex justify-between items-center">
                <div>
                  <span className="text-xs font-medium text-slate-400 block">Stok Tersedia</span>
                  <span className="font-bold text-slate-700 text-sm">{orderingProduct.stock} pcs</span>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-400 block">Harga Satuan</span>
                  <span className={`text-2xl font-black ${currentTheme.text}`}>
                    Rp {orderingProduct.price.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            {/* Bagian Kanan: Formulir Pemesanan */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between">
              
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-slate-800">Formulir Pemesanan</h3>
                  <p className="text-xs text-slate-400">Silakan lengkapi formulir untuk memesan produk karya siswa.</p>
                </div>
                <button 
                  onClick={() => setOrderingProduct(null)} 
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {!orderSuccess ? (
                <form onSubmit={handleOrderSubmit} className="space-y-4 my-6 flex-1">
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Pemesan *</label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama lengkap Anda"
                      value={orderForm.name}
                      onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Saya Adalah *</label>
                      <select
                        value={orderForm.role}
                        onChange={(e) => setOrderForm({ ...orderForm, role: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                      >
                        <option value="Siswa">Siswa</option>
                        <option value="Guru">Guru / Staff</option>
                        <option value="Orang Tua">Orang Tua Murid</option>
                        <option value="Umum">Masyarakat Umum</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Jumlah Pesanan *</label>
                      <input
                        type="number"
                        min="1"
                        max={orderingProduct.stock}
                        required
                        value={orderForm.quantity}
                        onChange={(e) => setOrderForm({ ...orderForm, quantity: Math.min(orderingProduct.stock, Number(e.target.value)) })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">No. WhatsApp Pemesan *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      value={orderForm.phone}
                      onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Catatan Tambahan</label>
                    <textarea
                      rows="2"
                      placeholder="Tulis ukuran, varian rasa, atau jam pengambilan produk..."
                      value={orderForm.notes}
                      onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    ></textarea>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">Estimasi Total Pembayaran:</span>
                    <span className={`text-base font-black ${currentTheme.text}`}>
                      Rp {(orderingProduct.price * orderForm.quantity).toLocaleString('id-ID')}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 rounded-xl text-sm font-bold text-white shadow-sm transition-all flex items-center justify-center space-x-2 ${currentTheme.primary} ${currentTheme.hover}`}
                  >
                    <Send className="h-4 w-4" />
                    <span>Kirim Pesanan Sekarang</span>
                  </button>

                </form>
              ) : (
                <div className="my-auto py-8 text-center space-y-4 animate-scaleUp">
                  <div className="h-16 w-16 bg-green-50 text-green-500 border border-green-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Check className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-800 text-lg">Pemesanan Sukses!</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      Terima kasih <strong className="text-slate-800">{orderForm.name}</strong>, pesanan Anda sebanyak <strong className="text-slate-800">{orderForm.quantity} pcs</strong> untuk <strong className="text-slate-800">{orderingProduct.name}</strong> telah berhasil direkam dalam sistem.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs text-slate-600 space-y-1.5 max-w-sm mx-auto">
                    <p className="font-bold text-slate-800 mb-1">Langkah Selanjutnya:</p>
                    <p>1. Panitia kewirausahaan kelas <strong className="text-slate-700">{orderingProduct.seller}</strong> akan menghubungi Anda melalui nomor WhatsApp ({orderForm.phone}).</p>
                    <p>2. Konfirmasi pembayaran dan teknis penyerahan produk akan dikoordinasikan secara langsung.</p>
                  </div>
                  <button
                    onClick={() => setOrderingProduct(null)}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                  >
                    Tutup Halaman
                  </button>
                </div>
              )}

              <div className="border-t border-slate-100 pt-3 text-[10px] text-slate-400 text-center">
                Aplikasi ini mendukung program edukasi kewirausahaan mandiri di lingkungan sekolah.
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}