import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Clapperboard,
  Clock3,
  Languages,
  Save,
  Star,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import movieAlt from "../assests/Movie/movieAlt.png";
import styles from "../styles/EditMovie/EditMovie.module.css";

const emptyMovie = {
  title: "",
  genre: "",
  releaseDate: "",
  duration_min: "",
  overview: "",
  language: "english",
  poster_path: "",
  backdrop_path: "",
};

function getDateInputValue(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function EditMovie() {
  const { movieID } = useParams(); //from the url
  const location = useLocation();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(location.state || null);
  const [form, setForm] = useState(emptyMovie);
  const [isLoading, setIsLoading] = useState(true);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchMovie = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/api/movies/getOne/${movieID}`);
        if (isMounted) setMovie(response.data);
      } catch (error) {
        if (isMounted) {
          toast.error(
            error.response?.data?.message || "Unable to load this movie.",
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchMovie();
    return () => {
      isMounted = false;
    };
  }, [movieID]);

  useEffect(() => {
    if (!movie) return;
    setForm({
      title: movie.title || "",
      genre: movie.genre || "",
      releaseDate: getDateInputValue(movie.releaseDate),
      duration_min: movie.duration_min ?? "",
      overview: movie.overview || "",
      language: movie.language || "english",
      poster_path: movie.poster_path || "",
      backdrop_path: movie.backdrop_path || "",
    });
  }, [movie]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const posterUrl = form.poster_path
    ? /^https?:\/\//i.test(form.poster_path)
      ? form.poster_path
      : `${process.env.REACT_APP_BASE_MOVIES_IMGS_URL}${form.poster_path}`
    : movieAlt;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      await api.put(`/api/movies/updateOne/${movieID}`, {
        ...form,
        duration_min: Number(form.duration_min),
        releaseDate: new Date(form.releaseDate).toISOString(),
      });

      toast.success("Movie details updated.", {
        style: {
          width: "500px",
        },
        onOpen: () => {
          setIsBlocking(true);
        },
        onClose: () => {
          setIsBlocking(false);
          navigate("/movie-list-dashboard");
        },
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to save movie changes.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.content}>
        <button
          className={styles.backButton}
          type="button"
          onClick={() => navigate("/movie-list-dashboard")}
        >
          <ArrowLeft size={17} />
          <span>Back to movies</span>
        </button>

        <header className={styles.heading}>
          <div className={styles.eyebrow}>
            <Clapperboard size={15} />
            <span>ADMINISTRATION</span>
          </div>
          <h1>Edit movie</h1>
          <p>Update the details shown to movie.</p>
        </header>

        {isLoading && !movie ? (
          <div className={styles.loading}>Loading movie details…</div>
        ) : !movie ? (
          <div className={styles.loading}>
            Movie details are unavailable. Return to the movie list and try
            again.
          </div>
        ) : (
          <form className={styles.editor} onSubmit={handleSubmit}>
            <section className={styles.formCard} aria-label="Movie details">
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.sectionKicker}>MOVIE DETAILS</span>
                  <h2>Basic information</h2>
                </div>
                <span className={styles.requiredNote}>
                  <span>*</span> Required
                </span>
              </div>

              <div className={styles.fields}>
                <label className={`${styles.field} ${styles.fullWidth}`}>
                  <span>
                    Movie title <b>*</b>
                  </span>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter movie title"
                    required
                    maxLength={120}
                  />
                </label>

                <label className={styles.field}>
                  <span>
                    Genre <b>*</b>
                  </span>
                  <input
                    name="genre"
                    value={form.genre}
                    onChange={handleChange}
                    placeholder="e.g. Sci-Fi, Drama"
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span>
                    Release date <b>*</b>
                  </span>
                  <input
                    name="releaseDate"
                    type="date"
                    value={form.releaseDate}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span>
                    Duration <b>*</b>
                  </span>
                  <div className={styles.inputWithIcon}>
                    <Clock3 size={17} aria-hidden="true" />
                    <input
                      name="duration_min"
                      type="number"
                      min="1"
                      step="0.01"
                      value={form.duration_min}
                      onChange={handleChange}
                      placeholder="Minutes"
                      required
                    />
                    <span className={styles.inputSuffix}>min</span>
                  </div>
                </label>

                <label className={styles.field}>
                  <span>Language</span>
                  <div className={styles.inputWithIcon}>
                    <Languages size={17} aria-hidden="true" />
                    <input
                      name="language"
                      value={form.language}
                      onChange={handleChange}
                      placeholder="e.g. English"
                    />
                  </div>
                </label>

                <label className={`${styles.field} ${styles.fullWidth}`}>
                  <span>
                    Overview <b>*</b>
                  </span>
                  <textarea
                    name="overview"
                    value={form.overview}
                    onChange={handleChange}
                    placeholder="Write a short synopsis for this movie"
                    rows={5}
                    required
                  />
                  <span className={styles.fieldHint}>
                    A concise synopsis helps audiences decide what to watch.
                  </span>
                </label>

              {/*   <label className={`${styles.field} ${styles.fullWidth}`}>
                  <span>Poster image path</span>
                  <input
                    name="poster_path"
                    value={form.poster_path}
                    onChange={handleChange}
                    placeholder="Paste a poster URL or image path"
                  />
                  <span className={styles.fieldHint}>
                    Use an image URL or the image path provided by your movie
                    catalog.
                  </span>
                </label> */}
              </div>
            </section>

            <aside className={styles.previewCard}>
              <div className={styles.previewHeading}>
                <div>
                  <span className={styles.sectionKicker}>PREVIEW</span>
                  <h2>Movie poster</h2>
                </div>
                {movie.rating !== undefined && (
                  <span className={styles.rating}>
                    <Star size={15} fill="currentColor" />
                    {Number(movie.rating).toFixed(2)}
                  </span>
                )}
              </div>
              <div className={styles.posterFrame}>
                <img
                  src={posterUrl}
                  alt={`${form.title || "Movie"} poster preview`}
                  onError={(event) => {
                    event.currentTarget.src = movieAlt;
                  }}
                />
              </div>
              <p className={styles.previewNote}>
                Preview updates when you change the poster image path.
              </p>
              {movie.vote_count !== undefined && (
                <div className={styles.metaRow}>
                  <span>Audience votes</span>
                  <strong>{movie.vote_count}</strong>
                </div>
              )}
            </aside>

            <footer className={styles.actions}>
              <button
                className={styles.cancelButton}
                type="button"
                onClick={() => navigate("/movie-list-dashboard")}
                disabled={isSaving || isBlocking}
              >
                Cancel
              </button>
              <button
                className={styles.saveButton}
                type="submit"
                disabled={isSaving || isBlocking}
              >
                <Save size={17} />
                {isSaving ? "Saving…" : "Save changes"}
              </button>
            </footer>
          </form>
        )}
      </div>
    </main>
  );
}

export default EditMovie;
