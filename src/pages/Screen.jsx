import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Armchair,
  Building2,
  Film,
  Plus,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import styles from "../styles/Screen/Screen.module.css";

const initialForm = {
  name: "",
  theater: "",
  rows: "",
  seatsPerRow: "",
};

function Screen() {
  const [screens, setScreens] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingScreenId, setDeletingScreenId] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchScreenData = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const [screensResponse, theatersResponse] = await Promise.all([
        api.get("/api/screens"),
        api.get("/api/theaters"),
      ]);
      setScreens(screensResponse.data.screens || []);
      setTheaters(theatersResponse.data.theaters || []);
    } catch (error) {
      setLoadError(
        error.response?.data?.message || "Unable to load screens and theaters.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScreenData();
  }, [fetchScreenData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setFormError("");
    setSuccessMessage("");
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setIsCreating(true);
    setFormError("");
    setSuccessMessage("");

    try {
      const response = await api.post("/api/screens/create", {
        ...form,
        rows: Number(form.rows),
        seatsPerRow: Number(form.seatsPerRow),
      });
      setScreens((currentScreens) =>
        [...currentScreens, response.data.newScreen].sort((first, second) =>
          first.name.localeCompare(second.name),
        ),
      );
      setForm(initialForm);
      setSuccessMessage("Screen and seats created successfully.");
    } catch (error) {
      setFormError(error.response?.data?.message || "Unable to create the screen.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (screen) => {
    const confirmed = window.confirm(
      `Delete ${screen.name} at ${screen.theater?.name || "this theater"}? Its seats will also be deleted. Screens with scheduled showtimes must have those showtimes removed first.`,
    );
    if (!confirmed) return;

    setDeletingScreenId(screen._id);
    setActionError("");
    setSuccessMessage("");
    try {
      await api.delete(`/api/screens/${screen._id}`);
      setScreens((currentScreens) =>
        currentScreens.filter((item) => item._id !== screen._id),
      );
      setSuccessMessage(`${screen.name} and its seats were deleted.`);
    } catch (error) {
      setActionError(
        error.response?.data?.message || `Unable to delete ${screen.name}.`,
      );
    } finally {
      setDeletingScreenId(null);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.content}>
        <Link className={styles.backLink} to="/admin-dashboard">
          <ArrowLeft size={17} />
          <span>Admin dashboard</span>
        </Link>

        <header className={styles.header}>
          <span className={styles.eyebrow}>VENUE MANAGEMENT</span>
          <h1>Theater screens</h1>
          <p>Create and manage screens, seating capacity, and theater assignments.</p>
        </header>

        <section className={styles.createPanel} aria-labelledby="create-screen-title">
          <div className={styles.panelHeading}>
            <div className={styles.headingIcon}>
              <Plus size={19} />
            </div>
            <div>
              <span className={styles.panelKicker}>NEW SCREEN</span>
              <h2 id="create-screen-title">Create a screen</h2>
              <p>Seats are generated automatically from your row settings.</p>
            </div>
          </div>

          {theaters.length === 0 && !isLoading && !loadError && (
            <p className={styles.infoMessage}>
              Add a theater before creating a screen.
            </p>
          )}

          <form className={styles.form} onSubmit={handleCreate}>
            <label className={styles.field}>
              <span>Screen name</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Screen 1"
                required
                disabled={isCreating}
                maxLength={60}
              />
            </label>

            <label className={styles.field}>
              <span>Theater</span>
              <select
                name="theater"
                value={form.theater}
                onChange={handleChange}
                required
                disabled={isCreating || theaters.length === 0}
              >
                <option value="">Choose a theater</option>
                {theaters.map((theater) => (
                  <option key={theater._id} value={theater._id}>
                    {theater.name} — {theater.location}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>Rows</span>
              <input
                name="rows"
                type="number"
                min="1"
                max="26"
                step="1"
                value={form.rows}
                onChange={handleChange}
                placeholder="e.g. 8"
                required
                disabled={isCreating}
              />
              <small>Maximum 26 rows (A–Z)</small>
            </label>

            <label className={styles.field}>
              <span>Seats per row</span>
              <input
                name="seatsPerRow"
                type="number"
                min="1"
                step="1"
                value={form.seatsPerRow}
                onChange={handleChange}
                placeholder="e.g. 12"
                required
                disabled={isCreating}
              />
            </label>

            <button
              className={styles.createButton}
              type="submit"
              disabled={isCreating || isLoading || theaters.length === 0}
            >
              <Plus size={17} />
              {isCreating ? "Creating screen…" : "Create screen"}
            </button>
          </form>

          {formError && (
            <p className={styles.errorMessage} role="alert">
              {formError}
            </p>
          )}
          {successMessage && (
            <p className={styles.successMessage} role="status">
              {successMessage}
            </p>
          )}
        </section>

        <section className={styles.screenSection} aria-labelledby="screens-title">
          <div className={styles.listHeading}>
            <div>
              <span className={styles.panelKicker}>YOUR VENUES</span>
              <h2 id="screens-title">All screens</h2>
            </div>
            {!isLoading && (
              <span className={styles.countBadge}>
                {screens.length} {screens.length === 1 ? "screen" : "screens"}
              </span>
            )}
          </div>

          {loadError && (
            <div className={styles.errorPanel} role="alert">
              <p>{loadError}</p>
              <button type="button" onClick={fetchScreenData}>
                Try again
              </button>
            </div>
          )}

          {actionError && (
            <p className={styles.errorMessage} role="alert">
              {actionError}
            </p>
          )}

          {isLoading ? (
            <div className={styles.emptyPanel}>
              <span className={styles.spinner} />
              <p>Loading screens…</p>
            </div>
          ) : !loadError && screens.length ? (
            <div className={styles.screenGrid}>
              {screens.map((screen) => (
                <article className={styles.screenCard} key={screen._id}>
                  <div className={styles.screenCardTop}>
                    <div className={styles.screenIcon}>
                      <Film size={19} />
                    </div>
                    <button
                      className={styles.deleteButton}
                      type="button"
                      aria-label={`Delete ${screen.name}`}
                      title={`Delete ${screen.name}`}
                      disabled={deletingScreenId === screen._id}
                      onClick={() => handleDelete(screen)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                  <h3>{screen.name}</h3>
                  <p className={styles.theaterInfo}>
                    <Building2 size={15} />
                    <span>
                      {screen.theater?.name || "Unknown theater"}
                      {screen.theater?.location
                        ? ` · ${screen.theater.location}`
                        : ""}
                    </span>
                  </p>
                  <div className={styles.capacity}>
                    <Armchair size={15} />
                    <span>{screen.totalSeats} seats</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            !loadError && (
              <div className={styles.emptyPanel}>
                <div className={styles.emptyIcon}>
                  <Film size={22} />
                </div>
                <h3>No screens yet</h3>
                <p>Create your first screen using the form above.</p>
              </div>
            )
          )}
        </section>
      </div>
    </main>
  );
}

export default Screen;
