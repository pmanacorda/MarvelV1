import { useCallback, useEffect, useRef, useState } from "react";
import { Hero } from "../../models/hero";
import { useNavigate } from "react-router-dom";
import { ApiResponse } from "../../models/api";
import { fetchHeroes } from "../../services/heroService";
import Loading from "../../shared/Loading";
import styles from "./style.module.css";
import { useSearch } from "../../shared/SearchContext";
import { useDebounce } from "use-debounce";

export default function HeroesList() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const { search, setSearch } = useSearch();
  const [debouncedSearch] = useDebounce(search, 500);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const abortController = useRef<AbortController | null>(null);

  const getHeroes = useCallback(async (search: string) => {
    const controller = new AbortController();
    abortController.current = controller;

    try {
      const result: ApiResponse = await fetchHeroes(search, controller.signal);
      if (result?.code === 200 && result?.data) {
        setHeroes(result.data.results);
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Error fetching heroes:", error);
      }
    } finally {
      if (abortController.current === controller) {
        setIsLoading(false);
      }
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    if (abortController.current) {
      abortController.current.abort();
    }

    setIsLoading(true);
    getHeroes(debouncedSearch);

    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [getHeroes, debouncedSearch]);

  return (
    <div className={styles.heroes_list_page}>
      <header className={styles.header}>
        <h1>Heroes</h1>

        <div className={styles.search}>
          <label>Search: </label>
          <input
            type="text"
            value={search}
            onChange={handleInputChange}
            data-testid="search-field"
          />
        </div>
      </header>
      <div className={styles.content}>
        {isLoading ? (
          <Loading
            text={
              debouncedSearch.length === 0 ? "Default Heroes" : debouncedSearch
            }
          />
        ) : heroes.length === 0 ? (
          "No heroes found!"
        ) : (
          heroes.map((hero: Hero) => <HeroItem hero={hero} key={hero.id} />)
        )}
      </div>
      <footer className={styles.footer}>
        <div> Marvel API V1 </div>
      </footer>
    </div>
  );
}

function HeroItem({ hero }: { hero: Hero }) {
  const navigate = useNavigate();
  return (
    <div
      className={styles.hero_item_container}
      onClick={() => navigate(`/hero/${hero.id}/details`, { state: { hero } })}
    >
      <label className={styles.hero_label}>Hero: {hero.name}</label>
      <img
        alt="Hero"
        className={styles.hero_thumbnail}
        src={`${hero.thumbnail.path}.${hero.thumbnail.extension}`}
      />
    </div>
  );
}
