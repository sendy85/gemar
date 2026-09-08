import { NextResponse, type NextRequest } from "next/server";
import { getDocumentById, getDocumentSignedUrl } from "@/lib/data/documents";

// GET /dokumen/download/[id]
// Mengambil baris dokumen (RLS otomatis menolak jika tidak berhak),
// lalu membuat signed URL sementara ke Supabase Storage dan redirect.
// Tidak pernah mengekspos URL storage internal secara langsung ke client.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const origin = request.nextUrl.origin;

  const document = await getDocumentById(id);
  if (!document) {
    return NextResponse.redirect(new URL("/dokumen?error=notfound", origin));
  }

  const signedUrl = await getDocumentSignedUrl(document.file_url);
  if (!signedUrl) {
    return NextResponse.redirect(new URL("/dokumen?error=denied", origin));
  }

  return NextResponse.redirect(signedUrl);
}
