import Link from 'next/link';
import { Container, Button, Stack } from 'react-bootstrap';

export default function NotFound() {
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Stack gap={3} className="text-center">

        <h1 style={{ fontSize: '6rem', fontWeight: 'bold' }}>404</h1>
        <h2>Halaman Tidak Ditemukan</h2>
        <p className="text-muted">
          Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan.
        </p>

        <Link href="/">
          <Button variant="primary" size="lg">
            Kembali ke Halaman Utama
          </Button>
        </Link>

      </Stack>
    </Container>
  );
}