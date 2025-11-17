'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MenuItem } from '@/types/menu';

const getInitialMenu = (): MenuItem[] => {
  if (typeof window !== 'undefined') {
    const savedMenu = localStorage.getItem('e-makanan-menu');
    return savedMenu ? JSON.parse(savedMenu) : [];
  }
  return [];
};

export default function MenuManager() {
  const [menuList, setMenuList] = useState<MenuItem[]>(getInitialMenu());
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(0);
  const [newItemDesc, setNewItemDesc] = useState('');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('e-makanan-menu', JSON.stringify(menuList));
    }
  }, [menuList]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim() === '' || newItemPrice <= 0) return;

    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      price: newItemPrice,
      description: newItemDesc.trim() || 'Deskripsi belum tersedia.',
    };

    setMenuList([...menuList, newItem]); 
    setNewItemName('');
    setNewItemPrice(0);
    setNewItemDesc('');
  };
  const handleDeleteItem = (id: string) => {
    setMenuList(menuList.filter(item => item.id !== id));
  };

  return (
    <div className="container my-5">
      <div className="card mb-4 shadow-lg">
        <div className="card-header bg-primary text-white">
          <h4> Tambah Item Menu Baru</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleAddItem} className="row g-3">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">Nama Makanan</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="price" className="form-label">Harga (IDR)</label>
              <input
                type="number"
                id="price"
                className="form-control"
                value={newItemPrice}
                onChange={(e) => {
                    const val = e.target.value;
                    setNewItemPrice(val === '' ? 0 : parseInt(val) || 0);
                }}
                min="0"
                required
              />
            </div>
            <div className="col-12">
              <label htmlFor="description" className="form-label">Deskripsi</label>
              <textarea
                id="description"
                className="form-control"
                value={newItemDesc}
                onChange={(e) => setNewItemDesc(e.target.value)}
              ></textarea>
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-success">
                <i className="bi bi-plus-circle"></i> Tambah Menu
              </button>
            </div>
          </form>
        </div>
      </div>

      <h2 className="mt-5 mb-3">Daftar Menu e-makanan ({menuList.length} Item)</h2>
      <div className="list-group shadow-sm">
        {menuList.length > 0 ? (
          menuList.map((item) => (
            <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <Link href={`/menu/${item.id}`} passHref className="text-decoration-none h5 text-primary">
                  {item.name}
                </Link>
                <p className="mb-0 text-muted">Rp{item.price.toLocaleString('id-ID')}</p>
              </div>
              <div>
                <button 
                  onClick={() => handleDeleteItem(item.id)} 
                  className="btn btn-sm btn-outline-danger"
                  aria-label={`Hapus ${item.name}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="p-3 text-center text-muted">Belum ada item di menu.</p>
        )}
      </div>
    </div>
  );
}