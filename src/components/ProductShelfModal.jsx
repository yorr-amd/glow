import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Save,
  Trash2,
  RotateCcw,
  Package,
  Edit2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Heart,
} from 'lucide-react';
import {
  categoryConfig,
  getMergedSkincareData,
  saveCustomProducts,
  resetPAOTimer,
  modeConfig,
  deleteProductFromMode,
  restoreDefaultProducts,
} from '../data/skincareData';
import { useLanguage } from '../i18n/LanguageContext';
import { getCurrentUser } from '../services/firebase';
import { saveCloudProducts } from '../services/firestoreService';

export default function ProductShelfModal({ isOpen, onClose, onUpdate, routineMode }) {
  const { t, isEn } = useLanguage();
  const [activeModeTab, setActiveModeTab] = useState(routineMode || 'sore');

  const syncProductsToCloud = (custom, deleted) => {
    const user = getCurrentUser();
    if (user?.uid) {
      const customP = custom || JSON.parse(localStorage.getItem('ceceyori_custom_products') || '{}');
      const deletedP = deleted || JSON.parse(localStorage.getItem('ceceyori_deleted_products') || '{}');
      saveCloudProducts(user.uid, customP, deletedP).catch(() => {});
    }
  };
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    category: 'face',
    pao: '12M',
    isEssential: true,
  });

  useEffect(() => {
    if (routineMode) {
      setActiveModeTab(routineMode);
    }
  }, [routineMode]);

  useEffect(() => {
    if (isOpen) {
      const merged = getMergedSkincareData();
      setProducts(merged[activeModeTab]?.full || []);
    }
  }, [isOpen, activeModeTab]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const customProducts = JSON.parse(localStorage.getItem('ceceyori_custom_products') || '{}');
    const deletedProducts = JSON.parse(localStorage.getItem('ceceyori_deleted_products') || '{}');

    if (!customProducts[activeModeTab]) customProducts[activeModeTab] = [];

    if (editingId) {
      if (deletedProducts[activeModeTab]) {
        deletedProducts[activeModeTab] = deletedProducts[activeModeTab].filter((id) => id !== editingId);
        localStorage.setItem('ceceyori_deleted_products', JSON.stringify(deletedProducts));
      }

      const index = customProducts[activeModeTab].findIndex((p) => p.id === editingId);
      if (index >= 0) {
        customProducts[activeModeTab][index] = { ...formData, id: editingId };
      } else {
        customProducts[activeModeTab].push({ ...formData, id: editingId });
      }
    } else {
      const newId = `custom_${activeModeTab}_${Date.now()}`;
      customProducts[activeModeTab].push({ ...formData, id: newId, isCustom: true });
    }

    saveCustomProducts(customProducts);
    resetPAOTimer(formData.pao);
    syncProductsToCloud(customProducts);
    setProducts(getMergedSkincareData()[activeModeTab]?.full || []);
    onUpdate?.();
    resetForm();
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      desc: product.desc,
      category: product.category,
      pao: product.pao || '12M',
      isEssential: product.isEssential !== false,
    });
    setShowAddForm(true);
  };

  const getModeLabel = (key) => {
    if (isEn) {
      if (key === 'pagi') return 'Morning';
      if (key === 'siang') return 'Afternoon';
      if (key === 'sore') return 'Evening';
      return 'Night';
    }
    return modeConfig[key]?.label || key;
  };

  const handleDelete = (product) => {
    const confirmMsg = isEn
      ? `Delete "${product.name}" from ${getModeLabel(activeModeTab)} routine?`
      : `Hapus produk "${product.name}" dari Rutin ${getModeLabel(activeModeTab)}?`;
    if (!window.confirm(confirmMsg)) return;
    deleteProductFromMode(activeModeTab, product.id);
    syncProductsToCloud();
    const updated = getMergedSkincareData();
    setProducts(updated[activeModeTab]?.full || []);
    onUpdate?.();
  };

  const handleRestoreDefault = () => {
    const confirmMsg = isEn
      ? `Reset all ${getModeLabel(activeModeTab)} routine products to defaults?`
      : `Kembalikan semua produk Rutin ${getModeLabel(activeModeTab)} ke daftar bawaan?`;
    if (!window.confirm(confirmMsg)) return;
    restoreDefaultProducts(activeModeTab);
    syncProductsToCloud();
    const updated = getMergedSkincareData();
    setProducts(updated[activeModeTab]?.full || []);
    onUpdate?.();
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', desc: '', category: 'face', pao: '12M', isEssential: true });
    setShowAddForm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white/95 backdrop-blur-2xl border border-pink-200/80 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-pink-100 bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-purple-500/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#D06885] to-[#9B4B62] text-white flex items-center justify-center text-xl shadow-md border-2 border-white">
              <Package size={22} />
            </div>
            <div>
              <h2 className="font-display text-[#3D1F2A] text-lg font-bold">{t('shelfModal.title')}</h2>
              <p className="text-xs text-slate-500">{t('shelfModal.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-white/80 transition-all"
            title={t('shelfModal.cancel')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex gap-2 p-3 bg-pink-50/50 border-b border-pink-100 overflow-x-auto flex-shrink-0">
          {Object.entries(modeConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => {
                setActiveModeTab(key);
                resetForm();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
                activeModeTab === key
                  ? 'bg-white text-[#D06885] shadow-xs border-pink-300'
                  : 'text-slate-500 border-transparent hover:bg-white/60'
              }`}
            >
              <span>{config.icon}</span>
              <span>{t('shelfModal.routinePrefix')} {getModeLabel(key)}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {showAddForm ? (
            <form onSubmit={handleSubmit} className="p-5 bg-pink-50/60 border border-pink-200/80 rounded-2xl space-y-4 animate-scale-in">
              <div className="flex items-center justify-between pb-2 border-b border-pink-200/60">
                <h3 className="font-display font-bold text-sm text-[#3D1F2A] flex items-center gap-2">
                  {editingId ? `✏️ ${t('shelfModal.editProduct')}` : `➕ ${t('shelfModal.addProduct')}`} ({t('shelfModal.routinePrefix')} {getModeLabel(activeModeTab)})
                </h3>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
                >
                  {t('shelfModal.cancel')}
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t('shelfModal.name')}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('shelfModal.namePlaceholder')}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm font-semibold text-[#3D1F2A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t('shelfModal.desc')}
                </label>
                <input
                  type="text"
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  placeholder={t('shelfModal.descPlaceholder')}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm text-[#3D1F2A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t('shelfModal.category')}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-pink-200 bg-white text-xs font-semibold text-[#3D1F2A]"
                  >
                    <option value="face">{t('shelfModal.categories.face')}</option>
                    <option value="lip">{t('shelfModal.categories.lip')}</option>
                    <option value="body">{t('shelfModal.categories.body')}</option>
                    <option value="exfoliate">{isEn ? 'Exfoliation' : 'Eksfoliasi'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t('shelfModal.pao')}
                  </label>
                  <select
                    value={formData.pao}
                    onChange={(e) => setFormData({ ...formData, pao: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-pink-200 bg-white text-xs font-semibold text-[#3D1F2A]"
                  >
                    <option value="3M">{t('shelfModal.paoOptions.m3')}</option>
                    <option value="6M">{t('shelfModal.paoOptions.m6')}</option>
                    <option value="12M">{t('shelfModal.paoOptions.m12')}</option>
                    <option value="24M">{t('shelfModal.paoOptions.m24')}</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-white"
                >
                  {t('shelfModal.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D06885] to-[#9B4B62] shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
                >
                  <Save size={14} /> {t('shelfModal.save')}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-center justify-between pb-2">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  {isEn ? 'Product List' : 'Daftar Produk'} ({products.length} {isEn ? 'items' : 'item'})
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D06885] to-[#9B4B62] shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
                >
                  <Plus size={14} /> {t('shelfModal.addProduct')}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {products.map((product) => {
                  const displayDesc = isEn && product.desc_en ? product.desc_en : product.desc;
                  return (
                    <div
                      key={product.id}
                      className="p-4 rounded-2xl border border-pink-100 bg-white shadow-2xs hover:shadow-sm transition-all flex items-start justify-between gap-3 group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#3D1F2A]">{product.name}</span>
                          {product.isEssential !== false && (
                            <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md">
                              {t('routine.essential')}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{displayDesc}</p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[9px] uppercase font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
                            {t(`shelfModal.categories.${product.category || 'face'}`) || product.category || 'face'}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">
                            PAO: {product.pao || '12M'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                          title={t('shelfModal.edit')}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          title={t('shelfModal.delete')}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-pink-50/40 border-t border-pink-100 flex items-center justify-between flex-shrink-0">
          <button
            onClick={handleRestoreDefault}
            className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw size={13} /> {t('shelfModal.resetDefault')}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D06885] to-[#9B4B62] shadow-sm hover:shadow-md transition-all"
          >
            {isEn ? 'Done' : 'Selesai'}
          </button>
        </div>

      </div>
    </div>
  );
}