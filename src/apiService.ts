const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api/games";

type GameData = {
  name: string;
  image: string;
};

// fazendo fetch da api
export async function fetchGames(query: string): Promise<GameData[]> {
  try {
    const response = await fetch(
      `${BASE_URL}?search=${encodeURIComponent(query)}&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Erro na requisição à API");
    }

    const data = await response.json();
    return data.results.map((game: any) => ({
      name: game.name,
      image: game.background_image || "",
    }));
  } catch (error) {
    console.error("Erro ao buscar jogos:", error);
    return [];
  }
}
