'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function AdminDashboard({ userName }: { userName?: string }) {
  const router = useRouter();
  
  type TabType = 'posts' | 'services' | 'authors' | 'mediaContent' | 'settings';
  const [activeTab, setActiveTab] = useState<TabType>('posts');

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  
  // Generic Form State
  const [formData, setFormData] = useState<any>({});
  const [message, setMessage] = useState('');

  // Setting States
  const [oldPassword, setOldPassword] = useState('');
  const [updatePassword, setUpdatePassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingsMessage, setSettingsMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // New Admin States
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [adminMessage, setAdminMessage] = useState('');

  // Drag and drop state
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const configs: Record<TabType, any> = {
    posts: {
      label: 'Makaleler',
      fields: [
        { name: 'title', label: 'Makale Başlığı', type: 'text', placeholder: 'Örn: Ceza Hukukunda Beraat' },
        { name: 'body', label: 'İçerik (Makale Metni)', type: 'textarea', placeholder: 'Makalenizi buraya yazın...' }
      ]
    },
    services: {
      label: 'Hizmetlerimiz',
      fields: [
        { name: 'title', label: 'Hizmet Adı', type: 'text', placeholder: 'Örn: İş Hukuku' },
        { name: 'body', label: 'Hizmet Detayı', type: 'textarea', placeholder: 'Verdiğiniz hizmeti tanımlayın...' }
      ]
    },
    authors: {
      label: 'Ekip (Kişiler)',
      fields: [
        { name: 'name', label: 'Ad Soyad', type: 'text', placeholder: 'Avukatın Adı Soyadı' },
        { name: 'bio', label: 'Hakkında (Biyografi)', type: 'textarea', placeholder: 'İsteğe bağlı... (Biyografi girmek zorunlu değildir)' },
        { name: 'image', label: 'Kişi Fotoğrafı', type: 'file-upload', placeholder: '' }
      ]
    },
    mediaContent: {
      label: 'Videolar',
      fields: [
        { name: 'type', label: 'Tip (sadece "video" veya "news" yazın)', type: 'text', placeholder: 'video' },
        { name: 'title', label: 'Video Başlığı', type: 'text', placeholder: 'Canlı Yayınımız' },
        { name: 'description', label: 'Kısa Açıklama', type: 'text', placeholder: 'Açıklama' },
        { name: 'youtubeUrl', label: 'Youtube Linki', type: 'url', placeholder: 'https://youtube.com/watch?v=...' }
      ] // order is handled by drag and drop now generally, but for others we'll use drag and drop natively
    },
    settings: { label: 'Ayarlar' }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.refresh();
  };

  const fetchItems = async (tab: TabType) => {
    if (tab === 'settings') return;
    setLoading(true);
    setItems([]);
    try {
      const res = await fetch(`/api/admin/crud?col=${tab}`);
      const data = await res.json();
      if (data.data) setItems(data.data);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchItems(activeTab);
    setEditingItem(null);
    setFormData({});
    setMessage('');
  }, [activeTab]);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (name: string, file: File | null) => {
    if (!file) return;
    const safeFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const storageRef = ref(storage, `uploads/${Date.now()}-${safeFilename}`);
    
    try {
      alert("Fotoğraf buluta yükleniyor, lütfen 'tamamlandı' mesajı gelene kadar bekleyin...");
      await uploadBytesResumable(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData((prev: any) => ({ ...prev, [name]: url }));
      alert("Fotoğraf başarıyla yüklendi!");
    } catch (e: any) {
      alert("Yükleme sırasında hata oluştu: " + e.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    
    const finalData = { collectionName: activeTab, ...formData };
    
    let res;
    if (editingItem) {
      finalData.id = editingItem.id;
      res = await fetch('/api/admin/crud', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });
    } else {
      if (activeTab === 'posts' || activeTab === 'services') {
        finalData.author = { name: userName || 'Admin' };
      }
      if (activeTab === 'authors' || activeTab === 'mediaContent') {
        // assign last index order
        finalData.order = items.length;
      }
      res = await fetch('/api/admin/crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });
    }

    if (res.ok) {
      setMessage(editingItem ? 'Başarıyla güncellendi!' : 'Başarıyla eklendi!');
      setFormData({});
      setEditingItem(null);
      fetchItems(activeTab);
    } else {
      const data = await res.json();
      setMessage(data.error || 'Bir hata oluştu');
    }
  };

  const startEditing = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Bunu kalıcı olarak silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/admin/crud?col=${activeTab}&id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      alert("Başarıyla silindi.");
      fetchItems(activeTab);
    } else {
      alert("Silme işlemi başarısız.");
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminMessage('');
    const res = await fetch('/api/admin/create-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: newUsername, password: newPassword, name: newName })
    });
    if (res.ok) {
      setAdminMessage('Sistem kullanıcısı (Admin) eklendi!');
      setNewUsername('');
      setNewPassword('');
      setNewName('');
    } else {
      const d = await res.json();
      setAdminMessage(d.error || 'Hata');
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMessage('');
    if (updatePassword !== confirmPassword) {
      setSettingsMessage('Hata: Girdiğiniz yeni şifreler eşleşmiyor.');
      return;
    }
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword, newPassword: updatePassword })
    });

    if (res.ok) {
      setSettingsMessage('Şifreniz başarıyla güncellendi!');
      setOldPassword('');
      setUpdatePassword('');
      setConfirmPassword('');
    } else {
      const data = await res.json();
      setSettingsMessage(data.error || 'Bir hata oluştu');
    }
  };

  // Drag and Drop Logic
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
  };
  const handleDrop = async (e: React.DragEvent, dropzoneId: string) => {
    e.preventDefault();
    if (draggedItemId === dropzoneId || !draggedItemId) return;

    const oldIndex = items.findIndex(i => i.id === draggedItemId);
    const newIndex = items.findIndex(i => i.id === dropzoneId);
    
    if (oldIndex === -1 || newIndex === -1) return;

    const newItems = [...items];
    const [moved] = newItems.splice(oldIndex, 1);
    newItems.splice(newIndex, 0, moved);

    setItems(newItems);
    
    const updates = newItems.map((v, i) => ({ id: v.id, order: i }));
    await fetch('/api/admin/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collectionName: activeTab, items: updates })
    });
  };

  const TabButton = ({ tab }: { tab: TabType }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`pb-2 px-3 sm:px-4 text-sm sm:text-base font-semibold whitespace-nowrap transition-colors ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-500' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
    >
      {configs[tab].label}
    </button>
  );

  return (
    <div className="min-h-screen bg-zinc-50 p-4 sm:p-8 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 overflow-x-hidden">
      <div className="mx-auto max-w-[1400px] rounded-xl bg-white p-4 sm:p-8 shadow-xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 dark:border-zinc-800 gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Yönetim Paneli</h1>
            {userName && <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Hoş geldiniz, <span className="font-semibold text-zinc-700 dark:text-zinc-300">{userName}</span></p>}
          </div>
          <button onClick={handleLogout} className="rounded-lg bg-red-500 px-5 py-2.5 font-bold text-white shadow hover:bg-red-600 transition-all self-start sm:self-auto">
            Güvenli Çıkış Yap
          </button>
        </div>

        <div className="mb-8 flex overflow-x-auto gap-2 sm:gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-1 scrollbar-hide">
          <TabButton tab="posts" />
          <TabButton tab="services" />
          <TabButton tab="mediaContent" />
          <TabButton tab="authors" />
          <TabButton tab="settings" />
        </div>

        {activeTab !== 'settings' && (
          <div className="flex flex-col gap-12">
            {/* ÜST TARAF: FORM (Tam Ekran Genişliğinde) */}
            <div className="w-full bg-zinc-50 dark:bg-zinc-800/50 p-4 sm:p-6 lg:p-10 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-inner">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 border-b pb-3 dark:border-zinc-700">
                {editingItem ? 'Düzenle' : `Yeni Ekle`}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {message && <p className="mb-4 rounded bg-blue-100 p-3 text-sm font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">{message}</p>}
                
                {configs[activeTab].fields.map((f: any) => (
                  <div key={f.name}>
                    <label className="mb-2 block text-sm font-bold">{f.label}</label>
                    {f.type === 'textarea' ? (
                      <textarea
                        required={!editingItem && f.name !== 'bio'}
                        rows={activeTab === 'posts' && f.name === 'body' ? 30 : 6}
                        className="w-full rounded-lg border border-zinc-300 p-4 font-mono text-sm leading-relaxed dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                        value={formData[f.name] || ''}
                        onChange={(e) => handleInputChange(f.name, e.target.value)}
                        placeholder={f.placeholder}
                      />
                    ) : f.type === 'file-upload' ? (
                      <div className="flex flex-col gap-4">
                        {formData[f.name] && <img src={formData[f.name]} alt="Önizleme" className="h-32 w-32 object-cover rounded-lg shadow-sm border border-zinc-300 dark:border-zinc-600 bg-white" />}
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full text-sm text-zinc-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer transition"
                          onChange={(e) => handleFileChange(f.name, e.target.files?.[0] || null)}
                        />
                      </div>
                    ) : (
                      <input
                        type={f.type}
                        required={f.name === 'title' || f.name === 'name'}
                        className="w-full rounded-lg border border-zinc-300 p-3 dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                        value={formData[f.name] || ''}
                        onChange={(e) => handleInputChange(f.name, e.target.value)}
                        placeholder={f.placeholder}
                      />
                    )}
                  </div>
                ))}

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t dark:border-zinc-700">
                  <button type="submit" className="flex-1 rounded-lg bg-blue-600 px-6 py-4 sm:py-3 font-bold text-white shadow hover:bg-blue-700 transition text-lg sm:text-base">
                    {editingItem ? 'Kaydet ve Güncelle' : 'Ekle / Yayınla'}
                  </button>
                  {editingItem && (
                    <button 
                      type="button" 
                      onClick={() => { setEditingItem(null); setFormData({}); }} 
                      className="flex-1 rounded-lg bg-zinc-200 dark:bg-zinc-700 px-6 py-4 sm:py-3 font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition text-lg sm:text-base">
                      Düzenlemeyi İptal Et
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* ALT TARAF: LİSTE (Tam Ekran Genişliğinde) */}
            <div className="w-full mt-4">
              <h2 className="text-xl font-bold mb-4 border-b pb-2 dark:border-zinc-700 flex justify-between items-center">
                Sistemdeki İçerikleriniz
                {(activeTab === 'authors' || activeTab === 'mediaContent') && (
                  <span className="text-xs text-blue-500 font-semibold bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full animate-pulse">
                    Tut ve Sürükleyerek Sıralamayı Değiştir
                  </span>
                )}
              </h2>
              {loading ? (
                <p className="text-zinc-500 dark:text-zinc-400 animate-pulse">Yükleniyor...</p>
              ) : items.length === 0 ? (
                <p className="text-zinc-500 p-6 text-center border border-dashed rounded-xl dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/30">Kayıtlı veri bulunamadı.</p>
              ) : (
                <div className="grid gap-3">
                  {items.map((item, idx) => (
                    <div 
                      key={item.id || idx} 
                      draggable={activeTab === 'authors' || activeTab === 'mediaContent'}
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, item.id)}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm transition-all group ${
                        draggedItemId === item.id ? 'opacity-50 ring-2 ring-blue-500 scale-[0.98]' : 'hover:shadow'
                      } ${(activeTab === 'authors' || activeTab === 'mediaContent') && 'cursor-grab active:cursor-grabbing'}`}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Drag Handle Icon for visual affordance on Authors & Media */}
                        {(activeTab === 'authors' || activeTab === 'mediaContent') && (
                           <div className="text-zinc-400 cursor-grab active:cursor-grabbing hover:text-blue-500">
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                           </div>
                        )}
                        {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover border border-zinc-200 dark:border-zinc-700" />}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base truncate">{item.title || item.name} {item.type && <span className="ml-2 text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded-full">{item.type}</span>}</h3>
                          {item.publishedAt && <p className="text-xs text-zinc-500 mt-1">{new Date(item.publishedAt).toLocaleDateString('tr-TR')}</p>}
                          {item.youtubeUrl && <a href={item.youtubeUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 truncate block mt-1 hover:underline">{item.youtubeUrl}</a>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEditing(item)} className="bg-zinc-100 dark:bg-zinc-700 px-4 py-2 rounded-lg font-semibold text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition">
                          Düzenle
                        </button>
                        <button onClick={() => deleteItem(item.id)} className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-100 dark:hover:bg-red-900/40 transition">
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6 border-b pb-2 dark:border-zinc-700">Sistem Giriş Şifresini Değiştir</h2>
              <form onSubmit={handleSettingsSubmit} className="space-y-4">
                {settingsMessage && <p className="mb-4 rounded bg-blue-100 p-3 text-sm font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">{settingsMessage}</p>}
                <div>
                  <label className="mb-1.5 block text-sm font-bold">Mevcut Şifreniz</label>
                  <input
                    type="password"
                    required
                    className="w-full rounded-lg border border-zinc-300 p-2.5 dark:bg-zinc-800 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold">Yeni Şifreniz</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full rounded-lg border border-zinc-300 p-2.5 pr-20 dark:bg-zinc-800 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                      value={updatePassword}
                      onChange={(e) => setUpdatePassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-4 font-semibold text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition">
                      {showPassword ? 'Gizle' : 'Göster'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold">Yeni Şifreniz (Tekrar)</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full rounded-lg border border-zinc-300 p-2.5 pr-20 dark:bg-zinc-800 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-4 font-semibold text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition">
                      {showPassword ? 'Gizle' : 'Göster'}
                    </button>
                  </div>
                </div>
                <button type="submit" className="w-full rounded-lg bg-zinc-800 dark:bg-zinc-700 px-4 py-3 font-bold text-white hover:bg-zinc-900 dark:hover:bg-zinc-600 transition shadow-sm mt-2">
                  Şifreyi Kaydet
                </button>
              </form>
            </div>

            <div>
               <h2 className="text-2xl font-bold mb-6 border-b pb-2 dark:border-zinc-700">Sisteme Yeni Çapraz Admin Ekle</h2>
              <form onSubmit={handleAdminSubmit} className="space-y-4 bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
                {adminMessage && <p className="mb-4 rounded bg-blue-100 p-3 text-sm font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">{adminMessage}</p>}
                <div>
                  <label className="mb-1.5 block text-sm font-bold">Sistemde Gözükecek Ad Soyad</label>
                  <input
                    type="text"
                    required
                    placeholder="Sisteme Kayıtlı Etiket İsmi Giriniz"
                    className="w-full rounded-lg border border-zinc-300 p-2.5 dark:bg-zinc-800 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold">Giriş Yapacağı Kullanıcı Adı</label>
                  <input
                    type="text"
                    required
                    placeholder="örnek-kullanici-adi"
                    className="w-full rounded-lg border border-zinc-300 p-2.5 dark:bg-zinc-800 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold">Giriş Şifresi Atayın</label>
                  <input
                    type="password"
                    required
                    className="w-full rounded-lg border border-zinc-300 p-2.5 dark:bg-zinc-800 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700 transition shadow mt-2">
                  Yetki Ver (Admin Oluştur)
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
