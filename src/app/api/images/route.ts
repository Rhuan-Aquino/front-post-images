// app/api/images/route.ts

import { getAllMemes } from '../../../../lib/posts.';

export async function GET() {
  try {
    const data = await getAllMemes();

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Erro na rota /api/images:", error.message);
    return new Response(`Erro ao buscar memes: ${error.message}`, { status: 500 });
  }
}