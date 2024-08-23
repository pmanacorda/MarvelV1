import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchComics } from "../../services/heroService";
import { Comic } from "../../models/comic";
import { ApiResponse } from "../../models/api";
import { Hero } from "../../models/hero";
import Loading from "../../shared/Loading";
import styles from "./style.module.css";

export default function HeroDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation();
  const hero: Hero = state?.hero;

  const [comics, setComics] = useState<Comic[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  let getComics = useCallback(async () => {
    try {
      setIsLoading(true);
      if (id === undefined) {
        return;
      }
      const response: ApiResponse = await fetchComics(id);

      setComics(response.data.results);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getComics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.hero_details_page}>
      <header className={styles.header}>
        <div className={styles.back_button}>
          <button onClick={() => navigate("/")}>Back</button>
        </div>
        <div className={styles.header_title}>{hero.name} Comics</div>
      </header>
      <div className={styles.content}>
        <HeroDetail hero={hero} comics={comics} isLoading={isLoading} />
      </div>
    </div>
  );
}

function HeroDetail({
  hero,
  comics,
  isLoading,
}: {
  hero: Hero;
  comics: Comic[];
  isLoading: boolean;
}) {
  return (
    <div className={styles.hero_details}>
      <div className={styles.hero_info}>
        <img
          className={styles.hero_thumbnail}
          alt="Hero"
          src={`${hero.thumbnail.path}.${hero.thumbnail.extension}`}
        />
        <div>
          {hero.description.trim().length === 0
            ? "No description available"
            : hero.description}
        </div>
      </div>
      <div className={styles.hero_comics}>
        {isLoading ? (
          <Loading text="Comics" />
        ) : comics.length === 0 ? (
          <div className="default_centered">No comics found!</div>
        ) : (
          comics.map((comic: Comic) => {
            return (
              <div key={comic.id} className={styles.comic_image}>
                <img
                  alt="Comic"
                  src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
