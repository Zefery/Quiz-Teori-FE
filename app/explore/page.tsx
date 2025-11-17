"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Spinner,
  Alert,
  Stack,
} from "react-bootstrap";
import Image from "next/image";
import Link from "next/link"; 

type Meal = {
  idMeal: string;
  strMeal: string;
  strInstructions: string;
  strMealThumb: string;
  strCategory: string;
};

export default function ExplorePage() {
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomRecipe = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
      );
      if (!res.ok) {
        throw new Error("Gagal mengambil data resep");
      }
      const data = await res.json();
      setMeal(data.meals[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomRecipe();
  }, []);

  return (
    <Container className="mt-5">
      <Stack direction="horizontal" gap={3} className="mb-4">
        <Link href="/">
          <Button variant="outline-secondary">{"< Kembali ke Home"}</Button>
        </Link>
        <h1>Explore Resep Acak</h1>
      </Stack>

      <p>Ini adalah halaman untuk memenuhi Soal 2: External API Fetch.</p>

      <Button
        onClick={fetchRandomRecipe}
        disabled={loading}
        className="mb-3"
      >
        {loading ? (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        ) : (
          "Cari Resep Acak Lainnya"
        )}
      </Button>

      {loading && !meal && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && meal && (
        <Card style={{ width: "100%" }}>
          <Card.Img
            as={Image} 
            variant="top"
            src={meal.strMealThumb}
            alt={meal.strMeal}
            width={500} 
            height={300} 
            style={{ objectFit: "cover" }} 
            priority 
          />
          <Card.Body>
            <Card.Title>{meal.strMeal}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Kategori: {meal.strCategory}
            </Card.Subtitle>
            <Card.Text style={{ whiteSpace: "pre-wrap" }}>
              {meal.strInstructions}
            </Card.Text>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}