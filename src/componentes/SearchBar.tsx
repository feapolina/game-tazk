import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchGames } from "@/apiService";
import { Search } from "lucide-react";

import { useToast } from "@/hooks/use-toast";

interface Game {
  name: string;
  image: string;
}

interface SearchbarWithListProps {
  onAddGame: (game: Game) => void;
}

export default function SearchbarWithList({
  onAddGame,
}: SearchbarWithListProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Detectar cliques fora do componente

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false); // fecha o componente quando clica fora
      }
    }

    // Adiciona o event listener quando o componente monta
    document.addEventListener("mousedown", handleClickOutside);

    // Removendo o event listener quando o componente é desmontado
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const searchGames = async () => {
      if (searchQuery.length > 0) {
        setIsLoading(true);
        setIsOpen(true);
        const results = await fetchGames(searchQuery);
        setGames(results);
        setIsLoading(false);
      } else {
        setGames([]);
        setIsOpen(false);
      }
    };

    searchGames();
  }, [searchQuery]);

  const handleAddGameWithToast = (game: Game) => {
    onAddGame(game);
    toast({
      title: "Jogo adicionado! 🎉",
      description: `${game.name} foi adicionado.`,
    });
  };
  
  return (
    <div ref={wrapperRef} className="w-full max-w-2xl mx-auto space-y-2 m-4">
      <div className="relative">
        <Input
          type="search"
          placeholder="Procure por um jogo..."
          value={searchQuery}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 dark:text-white rounded-full focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 transition-colors duration-300"
          aria-label="Search games"
        />
        <Search
          className="dark:text-white absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
      </div>
      {isOpen && searchQuery && (
        <ScrollArea className="h-[300px] w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
          <ul className="p-2">
            {isLoading ? (
              <li className="px-4 py-2 text-gray-500 dark:text-gray-400">
                Carregando...
              </li>
            ) : games.length > 0 ? (
              games.map((game, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors duration-200"
                  onClick={() => handleAddGameWithToast(game)}
                >
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {game.name}
                  </span>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500 dark:text-gray-400">
                Jogo Não Encontrado.
              </li>
            )}
          </ul>
        </ScrollArea>
      )}
    </div>
  );
}
