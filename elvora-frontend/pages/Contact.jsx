
import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    query: ''
  });

  const queries = [
    "Order Issue",
    "Payment Problem",
    "Delivery Delay",
    "Product Inquiry",
    "Return / Refund",
    "Other"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    alert("Query submitted successfully!");
    setForm({ name: '', phone: '', query: '' });
  };

  return (
    <div className="bg-gray-100">

      {/* HERO */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-2">Contact ELVORA</h1>
        <p className="text-gray-300">We are here to help you anytime</p>
      </section>

      {/* FORM SECTION */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-md space-y-5"
        >

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold mb-1">Phone</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Query Dropdown */}
          <div>
            <label className="block text-sm font-semibold mb-1">Query Type</label>
            <select
              required
              value={form.query}
              onChange={(e) =>
                setForm({ ...form, query: e.target.value })
              }
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select your issue</option>
              {queries.map((q, i) => (
                <option key={i} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Submit Query
          </button>

        </form>
      </section>
    </div>
  );
}