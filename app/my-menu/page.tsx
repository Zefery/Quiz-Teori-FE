// Tandai sebagai Client Component
"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Spinner,
  Alert,
  Row,
  Col,
  Stack,
} from "react-bootstrap";
import Link from "next/link";

type Menu = {
  id: number;
  nama: string;
  harga: number;
  deskripsi: string | null;
  createdAt: Date;
};

export default function MyMenuPage() {
  const [menuItems, setMenuItems] = useState<Menu[]>([]);
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  
  const [editingItem, setEditingItem] = useState<Menu | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/menu"); 
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data: Menu[] = await res.json();
      setMenuItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (editingItem) {
      setNama(editingItem.nama);
      setHarga(editingItem.harga.toString());
      setDeskripsi(editingItem.deskripsi || "");
    }
  }, [editingItem]);

  const clearForm = () => {
    setNama("");
    setHarga("");
    setDeskripsi("");
    setEditingItem(null); 
    setError(null);
  };
  
  const handleEditClick = (item: Menu) => {
    setEditingItem(item);
    window.scrollTo(0, 0); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);

    const method = editingItem ? "PUT" : "POST";
    const url = editingItem ? `/api/menu/${editingItem.id}` : "/api/menu";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: nama,
          harga: parseInt(harga),
          deskripsi: deskripsi,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Gagal ${editingItem ? 'meng-update' : 'menyimpan'} menu`);
      }
      
      clearForm(); 
      await fetchMenuItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus menu ini?")) {
      return;
    }

    setDeletingId(id);
    setError(null);

    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menghapus menu");
      }
      await fetchMenuItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <Stack direction="horizontal" gap={3} className="mb-4">
        <Link href="/">
          <Button variant="outline-secondary">{"< Kembali ke Home"}</Button>
        </Link>
        <h1>Kelola Menu Saya</h1>
      </Stack>

      <Row>
        <Col md={4}>
          <h3>{editingItem ? 'Edit Menu' : 'Tambah Menu Baru'}</h3>
          
          <Card className="p-3">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formNama">
                <Form.Label>Nama Menu</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Contoh: Nasi Goreng"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formHarga">
                <Form.Label>Harga</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Contoh: 15000"
                  value={harga}
                  onChange={(e) => setHarga(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDeskripsi">
                <Form.Label>Deskripsi (Opsional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Contoh: Nasi goreng spesial..."
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                />
              </Form.Group>

              {error && <Alert variant="danger">{error}</Alert>}

              <Stack direction="horizontal" gap={2}>
                <Button variant="primary" type="submit" disabled={submitLoading}>
                  {submitLoading ? (
                    <Spinner as="span" animation="border" size="sm" />
                  ) : (
                    editingItem ? 'Simpan Perubahan' : 'Simpan Menu'
                  )}
                </Button>
                
                {editingItem && (
                  <Button variant="outline-secondary" onClick={clearForm} disabled={submitLoading}>
                    Batal
                  </Button>
                )}
              </Stack>
            </Form>
          </Card>
        </Col>

        <Col md={8}>
          <h3>Daftar Menu Tersimpan</h3>
          {loading && <Spinner animation="border" />}
          
          <Stack gap={3}>
            {menuItems.length > 0 ? (
              menuItems.map((item) => (
                <Card key={item.id}>
                  <Card.Body>
                    <Card.Title>{item.nama}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Rp {item.harga.toLocaleString("id-ID")}
                    </Card.Subtitle>
                    <Card.Text>{item.deskripsi}</Card.Text>
                  </Card.Body>
                  
                  <Card.Footer>
                    <Stack direction="horizontal" gap={2}>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleEditClick(item)}
                        disabled={!!editingItem} 
                      >
                        Edit
                      </Button>

                      <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id || !!editingItem} 
                      >
                        {deletingId === item.id ? (
                          <Spinner as="span" animation="border" size="sm" />
                        ) : (
                          "Hapus"
                        )}
                      </Button>
                    </Stack>
                  </Card.Footer>

                </Card>
              ))
            ) : (
              !loading && <p>Belum ada menu yang disimpan.</p>
            )}
          </Stack>
        </Col>
      </Row>
    </Container>
  );
}