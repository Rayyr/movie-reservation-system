import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Plus,
  Search,
  Ticket,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import styles from "../styles/ShowTime/ShowTime.module.css";

function formatTime(value) {
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ShowTime() {
  const [movies, setMovies] = useState([]);
  const [movieTitle, setMovieTitle] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showTimes, setShowTimes] = useState([]);
  const [screens, setScreens] = useState([]);
  const [isLoadingScreens, setIsLoadingScreens] = useState(true);
  const [screenLoadError, setScreenLoadError] = useState("");
  const [newShowTime, setNewShowTime] = useState({
    screen: "",
    startTime: "",
    price: "",
  });
  const [isCreatingShowTime, setIsCreatingShowTime] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [deletingShowTimeId, setDeletingShowTimeId] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [isLoadingMovies, setIsLoadingMovies] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchMovies = async () => {
      try {
        const response = await api.get("/api/movies/getAll");
        if (isMounted) setMovies(response.data.movies || []);
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error.response?.data?.message || "Unable to load the movie catalog.",
          );
        }
      } finally {
        if (isMounted) setIsLoadingMovies(false);
      }
    };

    const fetchScreens = async () => {
      try {
        const response = await api.get("/api/screens");
        if (isMounted) setScreens(response.data.screens || []);
      } catch (error) {
        if (isMounted) {
          setScreenLoadError(
            error.response?.data?.message || "Unable to load available screens.",
          );
        }
      } finally {
        if (isMounted) setIsLoadingScreens(false);
      }
    };

    fetchMovies();
    fetchScreens();
    return () => {
      isMounted = false;
    };
  }, []);

  const movieSuggestions = useMemo(
    () => movies.filter((movie) => movie.title),
    [movies],
  );

  const handleSearch = async (event) => {
    event.preventDefault();
    const query = movieTitle.trim();

    if (!query) {
      setErrorMessage("Enter a movie title to search for its showtimes.");
      setHasSearched(false);
      setSelectedMovie(null);
      setShowTimes([]);
      setCreateError("");
      setCreateSuccess("");
      return;
    }

    const movie = movies.find(
      (item) => item.title.trim().toLowerCase() === query.toLowerCase(),
    );

    if (!movie) {
      setErrorMessage("No movie with that exact title was found. Try a suggestion from the list.");
      setHasSearched(false);
      setSelectedMovie(null);
      setShowTimes([]);
      return;
    }

    setIsSearching(true);
    setErrorMessage("");
    setSelectedMovie(movie);
    setHasSearched(true);
    setShowTimes([]);

    try {
      const response = await api.get(
        `/api/showTimes/getMovieShowTimes/${movie._id}`,
      );
      setShowTimes(response.data.showtimes || []);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to load showtimes for this movie.",
      );
      setHasSearched(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateFieldChange = (event) => {
    const { name, value } = event.target;
    setNewShowTime((current) => ({ ...current, [name]: value }));
    setCreateError("");
    setCreateSuccess("");
  };

  const handleCreateShowTime = async (event) => {
    event.preventDefault();
    if (!selectedMovie) return;

    setIsCreatingShowTime(true);
    setCreateError("");
    setCreateSuccess("");

    try {
      const response = await api.post("/api/showTimes/create", {
        movie: selectedMovie._id,
        screen: newShowTime.screen,
        startTime: new Date(newShowTime.startTime).toISOString(),
        price: Number(newShowTime.price),
      });

      setShowTimes((current) =>
        [...current, response.data].sort(
          (first, second) =>
            new Date(first.startTime).getTime() -
            new Date(second.startTime).getTime(),
        ),
      );
      setNewShowTime({ screen: "", startTime: "", price: "" });
      setCreateSuccess("Showtime created and added to the schedule.");
    } catch (error) {
      setCreateError(
        error.response?.data?.message || "Unable to create this showtime.",
      );
    } finally {
      setIsCreatingShowTime(false);
    }
  };

  const handleDeleteShowTime = async (showTime) => {
    const confirmed = window.confirm(
      `Delete this screening on ${new Date(showTime.startTime).toLocaleString()}? Any bookings for it will also be permanently deleted.`,
    );
    if (!confirmed) return;

    setDeletingShowTimeId(showTime._id);
    setDeleteError("");

    try {
      await api.delete(`/api/showTimes/${showTime._id}`);
      setShowTimes((current) =>
        current.filter((item) => item._id !== showTime._id),
      );
    } catch (error) {
      setDeleteError(
        error.response?.data?.message || "Unable to delete this showtime.",
      );
    } finally {
      setDeletingShowTimeId(null);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.content}>
        <Link className={styles.backLink} to="/admin-dashboard">
          <ArrowLeft size={17} />
          <span>Admin dashboard</span>
        </Link>

        <header className={styles.header}>
          <span className={styles.eyebrow}>SCHEDULE MANAGEMENT</span>
          <h1>Find showtimes</h1>
          <p>Search a film to view its upcoming screenings.</p>
        </header>

        <form className={styles.searchPanel} onSubmit={handleSearch}>
          <label className={styles.searchLabel} htmlFor="movie-title">
            Film name
          </label>
          <div className={styles.searchRow}>
            <div className={styles.inputWrap}>
              <Search size={19} aria-hidden="true" />
              <input
                id="movie-title"
                name="movieTitle"
                type="search"
                list="movie-title-suggestions"
                value={movieTitle}
                onChange={(event) => {
                  setMovieTitle(event.target.value);
                  setErrorMessage("");
                }}
                placeholder={
                  isLoadingMovies ? "Loading movie catalog…" : "Enter a film name"
                }
                autoComplete="off"
                disabled={isLoadingMovies || isSearching}
                aria-describedby={errorMessage ? "search-error" : undefined}
              />
              <datalist id="movie-title-suggestions">
                {movieSuggestions.map((movie) => (
                  <option key={movie._id} value={movie.title} />
                ))}
              </datalist>
            </div>
            <button
              className={styles.searchButton}
              type="submit"
              disabled={isLoadingMovies || isSearching}
            >
              <Search size={17} />
              {isSearching ? "Searching…" : "Find showtimes"}
            </button>
          </div>
          <p className={styles.searchHint}>
            Start typing to see movie suggestions, then choose the film title.
          </p>
          {errorMessage && (
            <p className={styles.errorMessage} id="search-error" role="alert">
              {errorMessage}
            </p>
          )}
        </form>

        {isSearching && (
          <div className={styles.statusPanel} role="status">
            <span className={styles.spinner} />
            <span>Finding screenings for {selectedMovie?.title}…</span>
          </div>
        )}

        {!isSearching && hasSearched && selectedMovie && (
          <section className={styles.results} aria-live="polite">
            <div className={styles.resultsHeader}>
              <div>
                <span className={styles.resultKicker}>SHOWTIMES FOR</span>
                <h2>{selectedMovie.title}</h2>
              </div>
              <span className={styles.countBadge}>
                {showTimes.length} {showTimes.length === 1 ? "screening" : "screenings"}
              </span>
            </div>

            <form
              className={styles.createPanel}
              onSubmit={handleCreateShowTime}
            >
              <div className={styles.createHeading}>
                <div className={styles.createIcon}>
                  <Plus size={18} />
                </div>
                <div>
                  <h3>Add a showtime</h3>
                  <p>Schedule a screening for {selectedMovie.title}.</p>
                </div>
              </div>

              {screenLoadError ? (
                <p className={styles.errorMessage} role="alert">
                  {screenLoadError}
                </p>
              ) : (
                <div className={styles.createFields}>
                  <label className={styles.createField}>
                    <span>Screen</span>
                    <select
                      name="screen"
                      value={newShowTime.screen}
                      onChange={handleCreateFieldChange}
                      required
                      disabled={
                        isLoadingScreens ||
                        screens.length === 0 ||
                        isCreatingShowTime
                      }
                    >
                      <option value="">
                        {isLoadingScreens
                          ? "Loading screens…"
                          : screens.length
                            ? "Choose a screen"
                            : "No screens available"}
                      </option>
                      {screens.map((screen) => (
                        <option key={screen._id} value={screen._id}>
                          {screen.theater?.name || "Theater"} — {screen.name}
                          {screen.theater?.location
                            ? ` · ${screen.theater.location}`
                            : ""}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={styles.createField}>
                    <span>Start date &amp; time</span>
                    <input
                      name="startTime"
                      type="datetime-local"
                      value={newShowTime.startTime}
                      onChange={handleCreateFieldChange}
                      required
                      disabled={isCreatingShowTime}
                    />
                  </label>

                  <label className={styles.createField}>
                    <span>Ticket price</span>
                    <div className={styles.priceInput}>
                      <span>$</span>
                      <input
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={newShowTime.price}
                        onChange={handleCreateFieldChange}
                        placeholder="0.00"
                        required
                        disabled={isCreatingShowTime}
                      />
                    </div>
                  </label>

                  <button
                    className={styles.createButton}
                    type="submit"
                    disabled={
                      isCreatingShowTime ||
                      isLoadingScreens ||
                      screens.length === 0 ||
                      !newShowTime.screen
                    }
                  >
                    <Plus size={17} />
                    {isCreatingShowTime ? "Creating…" : "Create showtime"}
                  </button>
                </div>
              )}
              {createError && (
                <p className={styles.errorMessage} role="alert">
                  {createError}
                </p>
              )}
              {createSuccess && (
                <p className={styles.successMessage} role="status">
                  {createSuccess}
                </p>
              )}
              {!isLoadingScreens && !screenLoadError && screens.length === 0 && (
                <p className={styles.searchHint}>
                  Create a screen before scheduling a showtime.
                </p>
              )}
            </form>

            {deleteError && (
              <p className={styles.errorMessage} role="alert">
                {deleteError}
              </p>
            )}

            {showTimes.length > 0 ? (
              <div className={styles.showtimeGrid}>
                {showTimes.map((showtime) => (
                  <article className={styles.showtimeCard} key={showtime._id}>
                    <div className={styles.cardTop}>
                      <div className={styles.theaterIcon}>
                        <Ticket size={18} />
                      </div>
                      <div className={styles.cardActions}>
                        <span className={styles.price}>
                          ${Number(showtime.price).toFixed(2)}
                          <small> / seat</small>
                        </span>
                        <button
                          className={styles.deleteButton}
                          type="button"
                          aria-label={`Delete ${selectedMovie.title} screening`}
                          title="Delete showtime"
                          disabled={deletingShowTimeId === showtime._id}
                          onClick={() => handleDeleteShowTime(showtime)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <h3>{showtime.screen?.theater?.name || "Theater"}</h3>
                    {showtime.screen?.theater?.location && (
                      <p className={styles.location}>
                        <MapPin size={14} />
                        {showtime.screen.theater.location}
                      </p>
                    )}
                    <div className={styles.screenLabel}>
                      {showtime.screen?.name || "Screen"}
                    </div>
                    <div className={styles.timeInfo}>
                      <div>
                        <CalendarDays size={15} />
                        <span>
                          {new Date(showtime.startTime).toLocaleDateString([], {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div>
                        <Clock3 size={15} />
                        <span>
                          {formatTime(showtime.startTime)} – {formatTime(showtime.endTime)}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <CalendarDays size={22} />
                </div>
                <h3>No showtimes scheduled</h3>
                <p>There are currently no screenings listed for this film.</p>
              </div>
            )}
          </section>
        )}

        {!isSearching && !hasSearched && !errorMessage && (
          <div className={styles.emptyPrompt}>
            <div className={styles.emptyIcon}>
              <Search size={22} />
            </div>
            <p>Search for a film to see its showtimes here.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default ShowTime;
