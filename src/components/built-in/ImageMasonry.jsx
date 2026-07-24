import { Box } from "@mui/material";

const columns = [
  [
    ["Top Gun: Maverick", "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg"],
    ["The Dark Knight", "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"],
    ["The Matrix", "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"],
  ],
  [
    ["Interstellar", "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"],
    ["Avatar", "https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg"],
    ["The Little Mermaid", "https://image.tmdb.org/t/p/w500/ym1dxyOk4jFcSl4Q2zmRrA5BEEN.jpg"],
  ],
  [
    ["Inception", "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg"],
    ["Oppenheimer", "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg"],
    ["Dune", "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg"],
  ],
];

function Poster({ poster }) {
  const [title, src] = poster;

  return (
    <Box
      component="img"
      src={src}
      alt={`${title} poster`}
      loading="lazy"
      sx={{
        width: "100%",
        display: "block",
        borderRadius: "6px",
        boxShadow: "0 8px 20px white",
        transition: "transform 180ms ease, filter 180ms ease",
        "&:hover": {
          filter: "brightness(1.08)",
          transform: "scale(1.025)",
        },
      }}
    />
  );
}

export default function ImageMasonry() {
  return (
    <Box
      aria-label="Featured movies"
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 1.5,
        height: "100vh",
        overflow: "hidden",
        p: 0.5,
        bgcolor: "white",
        "@keyframes postersUp": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(-50%)" },
        },
        "@keyframes postersDown": {
          from: { transform: "translateY(-50%)" },
          to: { transform: "translateY(0)" },
        },
      }}
    >
      {columns.map((column, index) => (
        <Box key={index} sx={{ overflow: "hidden" }}>
          <Box
            sx={{
              display: "grid",
              gap: 1.5,
              animation: `${index === 1 ? "postersDown" : "postersUp"} ${index === 1 ? 34 : 40}s linear infinite`,
              "&:hover": { animationPlayState: "paused" },
              "@media (prefers-reduced-motion: reduce)": {
                animation: "none",
              },
            }}
          >
            {[...column, ...column].map((poster, posterIndex) => (
              <Poster key={`${poster[0]}-${posterIndex}`} poster={poster} />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
