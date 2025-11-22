import React from 'react'; // Mengimpor React untuk mendefinisikan komponen

// Komponen MovieCard menerima prop 'movie' dan mendestruktur properti yang diperlukan
const MovieCard = ({ movie: { title, vote_average, poster_path, release_date, original_language } }) => {
  return (
    <div className="movie-card"> {/* Kontainer utama untuk kartu film */}

      {/* Menampilkan poster film dari TMDB atau gambar default jika tidak ada */}
      <img
        src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : `/no-movie2.png`} // URL poster atau fallback
        alt={title} // Alt text menggunakan judul film untuk aksesibilitas
      />

      <div className="mt-4"> {/* Kontainer untuk informasi film dengan margin atas */}
        
        {/* Menampilkan judul film */}
        <h3>{title}</h3>
        <div className="content"> {/* Kontainer untuk rating, bahasa, dan tahun */}
          <div className="rating"> {/* Kontainer untuk rating film */}
            <img src="star.png" alt="Star Icon" /> {/* Ikon bintang untuk rating */}
            {/* Menampilkan rating, dibulatkan ke 1 desimal atau 'N/A' jika tidak ada */}
            <p>{vote_average ? vote_average.toFixed(1) : `N/A`}</p>
          </div>

          <span>•</span> {/* Pemisah antar elemen */}
          {/* Menampilkan bahasa asli film */}
          <p className="lang">{original_language}</p>
          <span>•</span> {/* Pemisah antar elemen */}
          
          {/* Menampilkan tahun rilis film atau 'N/A' jika tidak ada */}
          <p className="year">
            {release_date ? release_date.split('-')[0] : `N/A`} {/* Mengambil tahun dari tanggal */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard; // Mengekspor komponen MovieCard sebagai default export

// {
//   "page": 1,
//   "results": [
//     {
//       "id": 24428,
//       "title": "The Avengers",
//       "vote_average": 7.7,
//       "poster_path": "/cezWGskPY5x7GaglTTRN4Fugfb8.jpg",
//       "release_date": "2012-04-25",
//       "original_language": "en"
//     },
//     ...
//   ]
// }
