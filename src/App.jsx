import React, { useEffect, useState } from 'react'; // Mengimpor React dan hooks useEffect, useState untuk state dan efek samping
import { useDebounce } from 'react-use'; // Mengimpor useDebounce untuk menunda eksekusi hingga pengguna selesai mengetik
import Search from './components/Search.jsx'; // Mengimpor komponen Search untuk input pencarian
import Spinner from './components/Spinner.jsx'; // Mengimpor komponen Spinner untuk indikator loading
import MovieCard from './components/MovieCard.jsx'; // Mengimpor komponen MovieCard untuk menampilkan kartu film
import { getTrendingMovies, updateSearchCount } from './appwrite.js'; // Mengimpor fungsi dari appwrite untuk mengelola trending movies

// Mendefinisikan URL dasar API The Movie Database (TMDB)
const API_BASE_KEY = 'https://api.themoviedb.org/3';

// Mengambil kunci API dari variabel lingkungan untuk keamanan (tidak hardcode)
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Konfigurasi opsi untuk permintaan HTTP ke TMDB API
const API_OPTIONS = {
  method: 'GET', // Menggunakan metode GET untuk mengambil data
  headers: {
    accept: 'application/json', // Menentukan bahwa kita menerima data dalam format JSON
    Authorization: `Bearer ${API_KEY}` // Menyertakan kunci API dalam header untuk autentikasi
  }
};

// Komponen utama aplikasi
const App = () => {
  // State untuk menyimpan nilai pencarian yang tertunda (debounced) agar tidak langsung memicu fetch
  const [debouncedSearchTerm, setdebouncedSearchTerm] = useState('');
  // State untuk menyimpan input pencarian langsung dari pengguna
  const [searchTerm, setsearchTerm] = useState('');

  // State untuk menyimpan daftar film yang diambil dari API TMDB
  const [movieList, setmovieList] = useState([]);
  // State untuk menyimpan pesan kesalahan jika fetching gagal
  const [errorMessage, seterrorMessage] = useState('');
  // State untuk menunjukkan apakah data sedang dimuat
  const [isLoading, setisLoading] = useState(false);
  
  // State untuk menyimpan daftar film trending dari backend (misalnya Appwrite)
  const [trendingMovies, settrendingMovies] = useState([]);

  // Menggunakan useDebounce untuk menunda pembaruan debouncedSearchTerm selama 1 detik
  // Ini mencegah fetching API terlalu sering saat pengguna mengetik
  useDebounce(() => setdebouncedSearchTerm(searchTerm), 1000, [searchTerm]);

  // Fungsi asinkronus untuk mengambil data film dari TMDB API
  const fetchMovies = async (query = '') => {
    // Mengatur state loading menjadi true dan mengosongkan pesan kesalahan sebelum fetch
    setisLoading(true);
    seterrorMessage('');

    try {
      // Menentukan endpoint API berdasarkan ada atau tidaknya query pencarian
      const endpoint = query
        ? `${API_BASE_KEY}/search/movie?query=${encodeURIComponent(query)}` // Jika ada query, cari film berdasarkan query
        : `${API_BASE_KEY}/discover/movie?sort_by=popularity.desc`; // Jika tidak ada query, ambil film populer

      // Mengirim permintaan HTTP ke endpoint API dengan opsi yang telah dikonfigurasi
      const response = await fetch(endpoint, API_OPTIONS);

      // Memeriksa apakah respons dari API berhasil (status code 200-299)
      if (!response.ok) {
        throw new Error('Failed to fetch movies'); // Jika gagal, lempar error
      }

      // Mengonversi respons API menjadi format JSON
      const data = await response.json();

      // Memeriksa apakah data mengindikasikan kegagalan (meskipun response.ok true)
      if (data.response === 'False') {
        seterrorMessage(data.error || 'failed to fetch movies data'); // Set pesan kesalahan dari API
        setmovieList([]); // Kosongkan daftar film
        return; // Keluar dari fungsi
      }

      // Menyimpan hasil film (array results) ke state movieList, default ke array kosong jika tidak ada
      setmovieList(data.results || []);

      // Jika ada query dan hasilnya tidak kosong, perbarui jumlah pencarian di backend
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]); // Memperbarui statistik pencarian
      }
    } catch (error) {
      // Menangani error yang terjadi selama fetching
      console.log(`error fetching movies: ${error}`); // Log error ke konsol untuk debugging
      seterrorMessage('Error fetching movies, Please try again later'); // Tampilkan pesan kesalahan ke pengguna
    } finally {
      // Selalu set loading ke false setelah fetching selesai, baik sukses maupun gagal
      setisLoading(false);
    }
  };

  // Fungsi asinkronus untuk memuat daftar film trending dari backend
  const loadTrendingMovies = async () => {
    try {
      // Memanggil fungsi getTrendingMovies untuk mengambil data dari backend
      const movies = await getTrendingMovies();
      // Menyimpan daftar film trending ke state
      settrendingMovies(movies);
    } catch (error) {
      // Menangani error jika fetching trending movies gagal
      console.error(`Error Fetching trending Movies: ${error}`); // Log error ke konsol
    }
  };

  // useEffect untuk memicu fetching film saat debouncedSearchTerm berubah
  useEffect(() => {
    fetchMovies(debouncedSearchTerm); // Memanggil fetchMovies dengan query yang tertunda
  }, [debouncedSearchTerm]); // Dependensi: debouncedSearchTerm

  // useEffect untuk memuat film trending saat komponen pertama kali dimuat
  useEffect(() => {
    loadTrendingMovies(); // Memanggil fungsi untuk memuat trending movies
  }, []); // Dependensi kosong: hanya dijalankan sekali saat mount

  // Render UI aplikasi
  return (
    <main>
      {/* Elemen dekoratif untuk pola latar belakang */}
      <div className="pattern" />
      
      {/* Kontainer utama untuk konten aplikasi */}
      <div className="wrapper">
        <header>
          {/* Gambar banner di header */}
          <img src="./hero.png" alt="Hero Banner" />
          {/* Judul aplikasi dengan highlight pada kata "Movies" */}
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
          </h1>
          {/* Komponen Search untuk input pencarian, meneruskan state dan setter */}
          <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm} />
        </header>

        {/* Seksi untuk menampilkan film trending jika ada data */}
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2> {/* Judul seksi */}
            <ul>
              {/* Iterasi melalui trendingMovies untuk menampilkan setiap film */}
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}> {/* Key unik berdasarkan ID dari backend */}
                  <p>{index + 1}</p> {/* Nomor urut film */}
                  <img src={movie.poster_url} alt={movie.title} /> {/* Poster film */}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Seksi untuk menampilkan semua film */}
        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2> {/* Judul seksi dengan margin atas */}
          {/* Kondisional rendering berdasarkan state */}
          {isLoading ? (
            <Spinner /> // Menampilkan spinner saat data sedang dimuat
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p> // Menampilkan pesan kesalahan dalam warna merah
          ) : movieList.length === 0 ? (
            <p className="text-white">No Result Found for "{debouncedSearchTerm}"</p> // Pesan jika tidak ada hasil
          ) : (
            <ul>
              {/* Iterasi melalui movieList untuk menampilkan MovieCard */}
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} /> // Key unik berdasarkan ID film
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App; // Mengekspor komponen App sebagai default export