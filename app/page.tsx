import Link from "next/link";
import { Container, Button, Stack } from "react-bootstrap";

export default function Home() {
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Stack gap={3} className="text-center">
        <h1>Selamat Datang di Aplikasi Menu</h1>
        <p>
          553240121 - Yusuf Abdurrahman Aslam
        </p>
        
        <Link href="/explore">
          <Button variant="primary" size="lg">
            Lihat Resep Acak 
          </Button>
        </Link>

        <Link href="/my-menu">
          <Button variant="outline-secondary" size="lg">
            Kelola Menu Saya
          </Button>
        </Link>
      </Stack>
    </Container>
  );
}