

import { useState, useEffect,useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../utils/api';
import toast from 'react-hot-toast';
import { FaHome, FaBriefcase, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';

export default function Checkout() {
  const { cart, fetchCart } = useCart();
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [payment, setPayment] = useState('COD');
  const [loading, setLoading] = useState(false);

  // NEW: Saved addresses state
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    label: 'Home'
  });


  // When user selects a saved address
  const handleSelectAddress = useCallback( (addr) => {
    setSelectedAddressId(addr._id);
    setAddress({
      name: user?.name || '',
      phone: user?.phone || '',
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || '',
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode
    });
    setShowNewAddressForm(false);
  },[user]);

  
useEffect(() => {
  const fetchSavedAddresses = async () => {
    try {
      const data = await api('/auth/profile', { token });
      setSavedAddresses(data.addresses || []);

      const defaultAddr = data.addresses?.find(addr => addr.isDefault);
      if (defaultAddr) {
        handleSelectAddress(defaultAddr);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };

  if (token) {
    fetchSavedAddresses();
  }
}, [token, handleSelectAddress]);

  // Save new address and use it
  const handleSaveAndUseAddress = async (e) => {
    e.preventDefault();
    try {
      const data = await api('/auth/address', {
        method: 'POST',
        body: newAddress,
        token
      });
      
      setSavedAddresses(data.addresses);
      const addedAddress = data.addresses[data.addresses.length - 1];
      handleSelectAddress(addedAddress);
      
      toast.success('Address saved!');
      setShowNewAddressForm(false);
    } catch (err) {
      toast.error(err.message || 'Failed to save address');
    }
  };

  const handleCOD = async () => {
    const order = await api('/orders/create', {
      method: 'POST',
      body: { shippingAddress: address }
    });
    await fetchCart();
    toast.success('Order placed!');
    navigate(`/order-success/${order._id}`);
  };

  const handleOnline = async () => {
    const rz = await api('/orders/razorpay/create', {
      method: 'POST',
      body: { totalPrice: cart.totalAmount }

    });

    const options = {
      key: rz.key,
      amount: rz.amount,
      currency: rz.currency,
      name: 'ELVORA',
      description: 'Order Payment',
      order_id: rz.orderId,
      handler: async (response) => {
        try {
          const result = await api('/orders/razorpay/verify', {
            method: 'POST',
            body: { ...response, shippingAddress: address },
          });
          await fetchCart();
          toast.success('Payment successful!');
          navigate(`/order-success/${result.order._id}`);
        } catch (err) {
          toast.error(err.message);
        }
      },
      prefill: { name: user?.name, email: user?.email, contact: user?.phone },
      theme: { color: '#2563eb' },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (payment === 'COD') await handleCOD();
      else await handleOnline();
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

   
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('checkout') || 'Checkout'}</h1>
      
      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          
          {/* Contact Information */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-3">Contact Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                placeholder="Name"
                value={address.name}
                onChange={e => setAddress({ ...address, name: e.target.value })}
                className="border p-2 rounded col-span-2"
              />
              <input
                required
                placeholder="Phone"
                value={address.phone}
                onChange={e => setAddress({ ...address, phone: e.target.value })}
                className="border p-2 rounded col-span-2"
              />
            </div>
          </div>

          {/* Saved Addresses Section */}
          {savedAddresses.length > 0 && (
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold mb-3">Select Delivery Address</h3>
              <div className="space-y-2">
                {savedAddresses.map((addr) => (
                  <label
                    key={addr._id}
                    className={`flex items-start p-3 border-2 rounded cursor-pointer transition ${
                      selectedAddressId === addr._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="savedAddress"
                      checked={selectedAddressId === addr._id}
                      onChange={() => handleSelectAddress(addr)}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-blue-600">
                          {addr.label === 'Home' ? <FaHome /> :
                           addr.label === 'Work' ? <FaBriefcase /> :
                           <FaMapMarkerAlt />}
                        </span>
                        <span className="font-semibold">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">{addr.addressLine1}</p>
                      {addr.addressLine2 && (
                        <p className="text-sm text-gray-700">{addr.addressLine2}</p>
                      )}
                      <p className="text-sm text-gray-700">
                        {addr.city}, {addr.state} {addr.zipCode}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                className="mt-3 w-full border-2 border-dashed border-gray-300 p-3 rounded text-gray-600 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
              >
                <FaPlus /> Add New Address
              </button>
            </div>
          )}

          {/* New Address Form */}
          {(showNewAddressForm || savedAddresses.length === 0) && (
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold mb-3">
                {savedAddresses.length === 0 ? t('shippingAddress') || 'Shipping Address' : 'Add New Address'}
              </h3>

              {savedAddresses.length > 0 ? (
                // Save to profile form
                <form onSubmit={handleSaveAndUseAddress} className="space-y-3">
                  <input
                    required
                    placeholder="Address Line 1"
                    value={newAddress.addressLine1}
                    onChange={e => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    placeholder="Address Line 2 (Optional)"
                    value={newAddress.addressLine2}
                    onChange={e => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                    className="border p-2 rounded w-full"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      required
                      placeholder="City"
                      value={newAddress.city}
                      onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="border p-2 rounded"
                    />
                    <input
                      required
                      placeholder="State"
                      value={newAddress.state}
                      onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="border p-2 rounded"
                    />
                    <input
                      required
                      placeholder="Zip Code"
                      value={newAddress.zipCode}
                      onChange={e => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                      className="border p-2 rounded"
                    />
                    <select
                      value={newAddress.label}
                      onChange={e => setNewAddress({ ...newAddress, label: e.target.value })}
                      className="border p-2 rounded"
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                      Save & Use This Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="px-4 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                // Direct entry form (no saved addresses)
                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    placeholder="Address Line 1"
                    value={address.addressLine1}
                    onChange={e => setAddress({ ...address, addressLine1: e.target.value })}
                    className="border p-2 rounded col-span-2"
                  />
                  <input
                    placeholder="Address Line 2"
                    value={address.addressLine2}
                    onChange={e => setAddress({ ...address, addressLine2: e.target.value })}
                    className="border p-2 rounded col-span-2"
                  />
                  <input
                    required
                    placeholder="City"
                    value={address.city}
                    onChange={e => setAddress({ ...address, city: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <input
                    required
                    placeholder="State"
                    value={address.state}
                    onChange={e => setAddress({ ...address, state: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <input
                    required
                    placeholder="Zip Code"
                    value={address.zipCode}
                    onChange={e => setAddress({ ...address, zipCode: e.target.value })}
                    className="border p-2 rounded col-span-2"
                  />
                </div>
              )}
            </div>
          )}

          {/* Payment Method */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-3">{t('paymentMethod') || 'Payment Method'}</h3>
            <label className="flex items-center gap-2 cursor-pointer py-2 hover:bg-gray-50 px-2 rounded">
              <input
                type="radio"
                value="COD"
                checked={payment === 'COD'}
                onChange={e => setPayment(e.target.value)}
              />
              {t('cod') || 'Cash on Delivery'}
            </label>
            <label className="flex items-center gap-2 cursor-pointer py-2 hover:bg-gray-50 px-2 rounded">
              <input
                type="radio"
                value="ONLINE"
                checked={payment === 'ONLINE'}
                onChange={e => setPayment(e.target.value)}
              />
              {t('online') || 'Online Payment'} (Razorpay)
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-4 rounded shadow h-fit sticky top-4">
          <h3 className="font-bold mb-3">{t('orderSummary') || 'Order Summary'}</h3>
          {cart.items?.map(i => (
            <div key={i._id} className="flex justify-between text-sm py-1">
              <span>{i.quantity} x {i.product?.name?.en || 'Item'}</span>
              <span>Rs. {i.price * i.quantity}</span>
            </div>
          ))}
          <hr className="my-2" />
          <div className="flex justify-between font-bold">
            <span>{t('total') || 'Total'}:</span>
            <span>Rs. {cart.totalAmount}</span>
          </div>
          <button
            type="submit"
            disabled={loading || !address.addressLine1}
            className="w-full mt-4 bg-primary text-white py-2 rounded disabled:bg-gray-400 hover:bg-blue-700 transition"
          >
            {loading ? 'Processing...' : t('placeOrder') || 'Place Order'}
          </button>
          {!address.addressLine1 && (
            <p className="text-red-500 text-xs mt-2 text-center">
              Please select or enter a delivery address
            </p>
          )}
        </div>
      </form>
    </div>
  );
}