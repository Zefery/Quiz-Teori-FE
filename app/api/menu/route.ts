import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const menuItems = await prisma.menu.findMany({
      orderBy: { createdAt: "desc" }, 
    });
    return NextResponse.json(menuItems);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data menu" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama, harga, deskripsi } = body;

    if (!nama || harga == null) {
      return NextResponse.json(
        { error: "Nama dan harga wajib diisi" },
        { status: 400 }
      );
    }

    const newMenu = await prisma.menu.create({
      data: {
        nama: nama,
        harga: Number(harga),
        deskripsi: deskripsi,
      },
    });
    return NextResponse.json(newMenu, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal membuat menu baru" },
      { status: 500 }
    );
  }
}