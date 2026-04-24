

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext'; // ✅ ADD THIS
import { api } from '../utils/api';
import toast from 'react-hot-toast';
import { FaHome, FaBriefcase, FaMapMarkerAlt, FaPlus, FaEdit, FaTrash, FaStar } from 'react-icons/fa';

export default function Profile() {
  const { user, token, updateProfile } = useAuth();
  const { t } = useLanguage(); // ✅ ADD THIS
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });

  const [addressForm, setAddressForm] = useState({
    addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '', label: 'Home'
  });

  const [addresses, setAddresses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api('/auth/profile', { token });
        setAddresses(data.addresses || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateProfile(profileForm);
      toast.success(t('profile') + ' updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const url = editingId ? `/auth/address/${editingId}` : '/auth/address';
      const method = editingId ? 'PUT' : 'POST';
      const data = await api(url, { method, body: addressForm, token });
      setAddresses(data.addresses);
      toast.success(editingId ? t('edit') + ' saved' : 'Address added');
      setAddressForm({ addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '', label: 'Home' });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this address?')) return;
    try {
      const data = await api(`/auth/address/${id}`, { method: 'DELETE', token });
      setAddresses(data.addresses);
      toast.success(t('delete') + ' successful');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const data = await api(`/auth/address/${id}/default`, { method: 'PUT', token });
      setAddresses(data.addresses);
      toast.success('Default address updated');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (addr) => {
    setAddressForm({
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || '',
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
      label: addr.label
    });
    setEditingId(addr._id);
    setShowForm(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">{t('profile')}</h1>
        <p className="text-blue-100 mt-2">{t('manageInfo')}</p>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* TABS */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 font-semibold ${activeTab === 'profile' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            {t('profile')}
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 px-4 font-semibold ${activeTab === 'addresses' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            {t('shippingAddress')} ({addresses.length})
          </button>
        </div>

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="bg-white p-8 rounded-xl shadow-md">
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-600">{t('fullName')}</label>
                <input
                  required
                  value={profileForm.name}
                  onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full border mt-1 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">{t('email')}</label>
                <input value={user?.email} disabled className="w-full border mt-1 p-3 rounded-lg bg-gray-100" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">{t('phone')}</label>
                <input
                  required
                  value={profileForm.phone}
                  onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full border mt-1 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                {loading ? t('loading') : t('save')}
              </button>
            </form>
          </div>
        )}

        {/* ADDRESSES TAB */}
        {activeTab === 'addresses' && (
          <div>
            {!showForm && (
              <button onClick={() => setShowForm(true)} className="mb-6 bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                <FaPlus /> {t('shippingAddress')}
              </button>
            )}

            {showForm && (
              <div className="bg-white p-8 rounded-xl shadow-md mb-6">
                <h3 className="text-xl font-bold mb-4">{editingId ? t('edit') : '+'} {t('shippingAddress')}</h3>
                <form onSubmit={handleSaveAddress} className="space-y-4">
                  <input required placeholder="Address Line 1" value={addressForm.addressLine1} onChange={e => setAddressForm({...addressForm, addressLine1: e.target.value})} className="w-full border p-3 rounded-lg" />
                  <input placeholder="Address Line 2 (optional)" value={addressForm.addressLine2} onChange={e => setAddressForm({...addressForm, addressLine2: e.target.value})} className="w-full border p-3 rounded-lg" />
                  <div className="grid grid-cols-2 gap-4">
                    <input required placeholder="City" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="w-full border p-3 rounded-lg" />
                    <input required placeholder="State" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} className="w-full border p-3 rounded-lg" />
                    <input required placeholder="ZIP Code" value={addressForm.zipCode} onChange={e => setAddressForm({...addressForm, zipCode: e.target.value})} className="w-full border p-3 rounded-lg" />
                    <select value={addressForm.label} onChange={e => setAddressForm({...addressForm, label: e.target.value})} className="w-full border p-3 rounded-lg">
                      <option value="Home">{t('home')}</option>
                      <option value="Work">{t('contact')}</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded-lg">
                      {loading ? t('loading') : t('save')}
                    </button>
                    <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setAddressForm({ addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '', label: 'Home' }); }} className="px-6 bg-gray-300 py-3 rounded-lg">
                      {t('cancel')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {addresses.length === 0 ? (
              <div className="bg-white p-12 rounded-xl shadow-md text-center">
                <FaMapMarkerAlt className="text-gray-300 text-6xl mx-auto mb-4" />
                <p className="text-gray-500">{t('emptyCart').replace('cart', 'addresses')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map(addr => (
                  <div key={addr._id} className={`relative bg-white p-6 rounded-xl shadow-md ${addr.isDefault ? 'border-2 border-blue-500' : ''}`}>
                    {addr.isDefault && (
                      <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <FaStar /> Default
                      </div>
                    )}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-blue-600 text-2xl">
                        {addr.label === 'Home' ? <FaHome /> : addr.label === 'Work' ? <FaBriefcase /> : <FaMapMarkerAlt />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{addr.label}</h3>
                        <p className="text-gray-700 mt-2">{addr.addressLine1}</p>
                        {addr.addressLine2 && <p className="text-gray-700">{addr.addressLine2}</p>}
                        <p className="text-gray-700">{addr.city}, {addr.state} {addr.zipCode}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {!addr.isDefault && (
                        <button onClick={() => handleSetDefault(addr._id)} className="text-xs bg-gray-100 px-3 py-2 rounded">
                          Set Default
                        </button>
                      )}
                      <button onClick={() => handleEdit(addr)} className="text-xs bg-blue-50 text-blue-600 px-3 py-2 rounded flex items-center gap-1">
                        <FaEdit /> {t('edit')}
                      </button>
                      <button onClick={() => handleDelete(addr._id)} className="text-xs bg-red-50 text-red-600 px-3 py-2 rounded flex items-center gap-1">
                        <FaTrash /> {t('delete')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}