// lib/api/posts.ts

// Definimos a interface para o tipo de dado que esperamos do backend
export interface MemePost {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  createdAt: string;
  // Outros campos que você pode ter no seu modelo
}

// Obtenha a URL da API da variável de ambiente
// Usamos process.env.NEXT_PUBLIC_API que você já configurou
const API_BASE_URL = process.env.NEXT_PUBLIC_API;

// Função para lidar com erros de requisição
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorBody = await response.text(); // Tenta ler o corpo do erro
    console.error(`Erro na API: ${response.status} - ${errorBody}`);
    throw new Error(`Erro na API: ${response.status} - ${errorBody}`);
  }
  return response.json();
};

/**
 * Busca todos os posts de memes da API.
 * @returns {Promise<MemePost[]>} Um array de objetos MemePost.
 */
export async function getAllMemes(): Promise<MemePost[]> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API não está configurada no frontend.");
  }
  try {
    const response = await fetch(`${API_BASE_URL}/api/posts`);
    const data: MemePost[] = await handleApiResponse(response);
    return data;
  } catch (error) {
    console.error("Erro ao buscar todos os memes:", error);
    throw error; // Propaga o erro para quem chamar a função
  }
}

/**
 * Cria um novo post de meme na API.
 * @param {FormData} formData Os dados do formulário (incluindo título, descrição, e a imagem).
 * @returns {Promise<MemePost>} O novo objeto MemePost criado.
 */
export async function createMeme(formData: FormData): Promise<MemePost> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API não está configurada no frontend.");
  }
  try {
    const response = await fetch(`${API_BASE_URL}/api/posts`, {
      method: 'POST',
      body: formData, // FormData define automaticamente o Content-Type: multipart/form-data
    });
    const data: MemePost = await handleApiResponse(response);
    return data;
  } catch (error) {
    console.error("Erro ao criar meme:", error);
    throw error;
  }
}

/**
 * @param {string} id O ID (_id) do meme a ser deletado.
 * @returns {Promise<void>} Uma promessa que resolve quando o meme é deletado com sucesso.
 */
export async function deleteMeme(id: string): Promise<void> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API não está configurada no frontend.");
  }
  try {
    const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Erro ao deletar meme: ${response.status} - ${errorBody}`);
      throw new Error(`Erro ao deletar meme: ${response.status} - ${errorBody}`);
    }
  } catch (error) {
    console.error(`Erro ao deletar meme com ID ${id}:`, error);
    throw error;
  }
}