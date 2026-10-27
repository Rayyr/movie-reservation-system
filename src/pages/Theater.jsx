import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import styles from "../styles/Theater/Theater.module.css";

const initialForm = { name: "", location: "" };

function Theater() {
  const [theaters, setTheaters] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingTheaterId, setDeletingTheaterId] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchTheaters = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const response = await api.get("/api/theaters");
      setTheaters(response.data.theaters || []);
    } catch (error) {
      setLoadError(
        error.response?.data?.message || "Unable to load theaters.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTheaters();
  }, [fetchTheaters]);

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
      const response = await api.post("/api/theaters/create", {
        name: form.name.trim(),
        location: form.location.trim(),
      });
      setTheaters((currentTheaters) =>
        [...currentTheaters, response.data].sort((first, second) =>
          first.name.localeCompare(second.name),
        ),
      );
      setForm(initialForm);
      setSuccessMessage("Theater created successfully.");
    } catch (error) {
      setFormError(
        error.response?.data?.message || "Unable to create the theater.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (theater) => {
    const confirmed = window.confirm(
      `Delete ${theater.name} in ${theater.location}? You must delete its screens first.`,
    );
    if (!confirmed) return;

    setDeletingTheaterId(theater._id);
    setActionError("");
    setSuccessMessage("");
    try {
      await api.delete(`/api/theaters/${theater._id}`);
      setTheaters((currentTheaters) =>
        currentTheaters.filter((item) => item._id !== theater._id),
      );
      setSuccessMessage(`${theater.name} was deleted.`);
    } catch (error) {
      setActionError(
        error.response?.data?.message || `Unable to delete ${theater.name}.`,
      );
    } finally {
      setDeletingTheaterId(null);
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
          <h1>Theaters</h1>
          <p>Manage your cinema locations and keep your venues organized.</p>
        </header>

        <section className={styles.createPanel} aria-labelledby="create-theater-title">
          <div className={styles.panelHeading}>
            <div className={styles.headingIcon}>
              <Plus size={19} />
            </div>
            <div>
              <span className={styles.panelKicker}>NEW VENUE</span>
              <h2 id="create-theater-title">Add a theater</h2>
              <p>Enter the venue name and its location.</p>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleCreate}>
            <label className={styles.field}>
              <span>Theater name</span>
              <div className={styles.inputWrap}>
                <Building2 size={17} aria-hidden="true" />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Grand Cinema"
                  required
                  maxLength={100}
                  disabled={isCreating}
                />
              </div>
            </label>

            <label className={styles.field}>
              <span>Location</span>
              <div className={styles.inputWrap}>
                <MapPin size={17} aria-hidden="true" />
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="City, district, or address"
                  required
                  maxLength={200}
                  disabled={isCreating}
                />
              </div>
            </label>

            <button
              className={styles.createButton}
              type="submit"
              disabled={isCreating}
            >
              <Plus size={17} />
              {isCreating ? "Creating…" : "Create theater"}
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

        <section className={styles.theaterSection} aria-labelledby="theaters-title">
          <div className={styles.listHeading}>
            <div>
              <span className={styles.panelKicker}>YOUR VENUES</span>
              <h2 id="theaters-title">All theaters</h2>
            </div>
            {!isLoading && (
              <span className={styles.countBadge}>
                {theaters.length} {theaters.length === 1 ? "theater" : "theaters"}
              </span>
            )}
          </div>

          {actionError && (
            <p className={styles.errorMessage} role="alert">
              {actionError}
            </p>
          )}

          {isLoading ? (
            <div className={styles.emptyPanel}>
              <span className={styles.spinner} />
              <p>Loading theaters…</p>
            </div>
          ) : loadError ? (
            <div className={styles.emptyPanel} role="alert">
              <p className={styles.errorMessage}>{loadError}</p>
              <button
                className={styles.retryButton}
                type="button"
                onClick={fetchTheaters}
              >
                Try again
              </button>
            </div>
          ) : theaters.length ? (
            <div className={styles.theaterGrid}>
              {theaters.map((theater) => (
                <article className={styles.theaterCard} key={theater._id}>
                  <div className={styles.cardTop}>
                    <div className={styles.theaterIcon}>
                      <Building2 size={20} />
                    </div>
                    <button
                      className={styles.deleteButton}
                      type="button"
                      aria-label={`Delete ${theater.name}`}
                      title={`Delete ${theater.name}`}
                      disabled={deletingTheaterId === theater._id}
                      onClick={() => handleDelete(theater)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                  <h3>{theater.name}</h3>
                  <p className={styles.location}>
                    <MapPin size={15} />
                    <span>{theater.location}</span>
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyPanel}>
              <div className={styles.emptyIcon}>
                <Building2 size={22} />
              </div>
              <h3>No theaters yet</h3>
              <p>Create your first theater using the form above.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Theater;
