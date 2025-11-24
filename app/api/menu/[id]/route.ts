import { NextResponse } from "next/server";
import {db as prisma} from "@/lib/prisma"; 

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const id = parseInt(awaitedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID Menu tidak valid" }, { status: 400 });
    }

    const body = await request.json();
    const { nama, harga, deskripsi } = body;

    if (!nama || harga == null) {
      return NextResponse.json(
        { error: "Nama dan harga wajib diisi" },
        { status: 400 }
      );
    }

    const updatedMenu = await prisma.menu.update({
      where: { id: id },
      data: {
        nama: nama,
        harga: Number(harga),
        deskripsi: deskripsi,
      },
    });

    return NextResponse.json(updatedMenu);
  } catch (error) {
    if ((error as any).code === 'P2025') {
       return NextResponse.json(
         { error: "Menu tidak ditemukan" },
         { status: 404 }
       );
    }
    return NextResponse.json(
      { error: "Gagal meng-update menu" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params; 
    const id = parseInt(awaitedParams.id); 

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID Menu tidak valid" }, { status: 400 });
    }

    await prisma.menu.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Menu berhasil dihapus" });
  } catch (error) {
    if ((error as any).code === 'P2025') {
       return NextResponse.json(
         { error: "Menu tidak ditemukan" },
         { status: 404 }
       );
    }
    return NextResponse.json(
      { error: "Gagal menghapus menu" },
      { status: 500 }
    );
  }
}