import { useState, useEffect } from "react";
import { Toaster } from "./components/ui/toaster";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { LucideTrash } from "lucide-react";
import ChangeThemeButton from "./componentes/ThemeButton";
import SearchbarWithList from "./componentes/SearchBar";
import LogoBranca from "./assets/game-task-logo-branca.svg";
import LogoEscura from "./assets/game-task-logo.svg";
import Footer from "./componentes/Footer";
import ToDoList from "./componentes/ToDoListComponent";

interface Game {
  name: string;
  image: string;
}

export default function App() {
  const [selectedGames, setSelectedGames] = useState<Game[]>([]);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleHandleDark = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const fetchPersistedGames = async () => {
      const gamesFromStorage = localStorage.getItem("selectedGames");
      if (gamesFromStorage) {
        setSelectedGames(JSON.parse(gamesFromStorage));
      }
    };
    fetchPersistedGames();
  }, []);

  const handleAddGame = async (game: Game) => {
    setSelectedGames((prevGames) => {
      if (prevGames.some((g) => g.name === game.name)) {
        return prevGames;
      }
      const updatedGames = [...prevGames, game];
      localStorage.setItem("selectedGames", JSON.stringify(updatedGames));
      return updatedGames;
    });
  };

  const handleRemoveGame = async (gameName: string) => {
    const updatedGames = selectedGames.filter((game) => game.name !== gameName);
    setSelectedGames(updatedGames);
    localStorage.setItem("selectedGames", JSON.stringify(updatedGames));
  };

  const openModal = (game: Game) => {
    setCurrentGame(game);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentGame(null);
  };

  return (
    <div id="wrapper" className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <Toaster />
      <div className="min-h-screen bg-[#f5f5f5] dark:bg-neutral-900 transition-colors duration-200">
        <div className="container mx-auto px-4 flex flex-col justify-center items-center">
          <div className="flex w-full gap-12 justify-center items-center p-4">
            {darkMode ? (
              <img
                src={LogoBranca}
                alt="Logo da página"
                className="h-14 md:h-32 object-contain"
              />
            ) : (
              <img
                src={LogoEscura}
                alt="Logo da página"
                className="h-14 md:h-32 object-contain"
              />
            )}
            <ChangeThemeButton toggleHandleDark={toggleHandleDark} />
          </div>
          <SearchbarWithList onAddGame={handleAddGame} />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 m-14">
            {selectedGames.map((game) => (
              <div
                key={game.name}
                className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md group hover:shadow-xl transition-shadow duration-200 cursor-pointer"
                onClick={() => openModal(game)}
              >
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <h3 className="absolute bottom-3 left-2 right-2 text-white font-bold text-lg leading-tight line-clamp-2">
                  {game.name}
                </h3>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="absolute top-2 right-2 text-white/50 rounded-full size-5 flex items-center justify-center transition-colors hover:text-red-400"
                    >
                      <LucideTrash />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Tem certeza que deseja excluir esse jogo?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Essa ação não pode ser desfeita. Você terá que adicionar
                        o jogo e as tasks novamente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel asChild>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          Cancelar
                        </button>
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleRemoveGame(game.name)}
                      >
                        Deletar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lista de tarefas para {currentGame?.name}</DialogTitle>
          </DialogHeader>
          <div>
            <ToDoList gameName={currentGame?.name || ""} />
          </div>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
}
