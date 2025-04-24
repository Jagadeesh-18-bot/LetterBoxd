import React, { useState, useEffect } from 'react';
import styles from '../styles/dashboard.module.css';
import { useRouter } from 'next/router';
import { Rating } from 'react-simple-star-rating';
import { UserPlus, Users } from 'lucide-react';

export async function getServerSideProps() {
  const apiKey = '675f7df0';
  const localMovies = [
    { title: 'Black Panther', rating: 8, image: 'movie1.png', description: "After death of his father, T'Challa returns to the hidden, advanced nation of Wakanda to take his place as king—but faces powerful enemies who challenge his throne and the fate of his people.", link: "https://www.youtube.com/watch?v=5jCHcChxG5I" },
    { title: 'Mickey 17', rating: 7.8, image: 'movie2.png', description: "An expendable worker on a distant planet is cloned every time he dies—but when one version survives, he must face his replacement and uncover the truth behind his existence.", link: "https://www.youtube.com/watch?v=Qjn5UZoWlaQ&pp=ygUPbWlja2V5IDE3IG1vdmll" },
    { title: 'Magazine Dreams', rating: 7.0, image: 'movie3.png', description: "A troubled bodybuilder chasing fame battles inner demons and societal pressures, risking everything as his obsession with perfection spirals out of control.", link: "https://www.youtube.com/watch?v=r44_aO8A_Hs&pp=ygUWbWFnYXppbm5lIGRyZWFtcyBtb3ZpZQ%3D%3D" },
    { title: 'The Wedding Banquet', rating: 8.0, image: 'movie4.png', description: "A gay Taiwanese-American man enters a marriage of convenience to appease his traditional parents, but unexpected complications arise when they arrive to plan a lavish wedding banquet.", link: "https://www.youtube.com/watch?v=kWy_IzW04YM" },
    { title: 'The Electric State', rating: 6.9, image: 'movie5.png', description: "In a retro-futuristic 1990s, an orphaned teen and her robot companion journey across a dystopian America to rescue her brother, whose consciousness powers a dangerous technology.", link: "https://www.youtube.com/watch?v=KpN98z8Kf5E" },
    { title: 'Freaky Friday', rating: 7.3, image: 'movie6.png', description: "A mother and daughter magically swap bodies and must navigate each other's lives, learning to understand and appreciate their differences in the process.", link: "https://www.youtube.com/watch?v=3WdpJI0qskM" },
    { title: 'Sting', rating: 6.5, image: 'movie7.png', description: "Sting, born Gordon Sumner, is a British musician renowned as the frontman of The Police and for his successful solo career, blending rock, jazz, and world music.", link: "https://www.youtube.com/watch?v=B73g786Izg0" },
  ];

  const maxPages = 20;
  let allOmdbMovies = [];
  for (let page = 1; page <= maxPages; page++) {
    const omdbResponse = await fetch(
      `http://www.omdbapi.com/?s=movie&apikey=${apiKey}&page=${page}`
    );
    const omdbData = await omdbResponse.json();
    if (omdbData.Search) {
      const pageMovies = await Promise.all(omdbData.Search.map(async (movie) => {
        const detailResponse = await fetch(
          `http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`
        );
        const detailData = await detailResponse.json();
        return {
          title: movie.Title,
          rating: detailData.imdbRating || 0,
          image: detailData.Poster !== 'N/A' ? detailData.Poster : 'default.png',
          description: detailData.Plot || `No detailed description available for ${movie.Title}.`,
          link: `https://www.imdb.com/title/${movie.imdbID}/`,
          genre: detailData.Genre || 'Uncategorized'
        };
      }));
      allOmdbMovies = [...allOmdbMovies, ...pageMovies];
    } else {
      break;
    }
  }

  const allMovies = [...localMovies, ...allOmdbMovies];

  const categorizedMovies = allMovies.reduce((acc, movie) => {
    const genres = movie.genre ? movie.genre.split(', ').map(g => g.trim()) : ['Uncategorized'];
    genres.forEach((genre) => {
      if (!acc[genre]) acc[genre] = [];
      acc[genre].push(movie);
    });
    return acc;
  }, {});

  return {
    props: { categorizedMovies },
  };
}

const Dashboard = ({ categorizedMovies }) => {
  const router = useRouter();
  const [activeDescriptions, setActiveDescriptions] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [userRatings, setUserRatings] = useState({});
  const [userList, setUserList] = useState([]);
  const [username, setUsername] = useState('');
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      alert('You must be logged in.');
      router.push('/Login');
    } else {
      setUsername(storedUsername);
      fetchRatings(storedUsername);
      fetchWatchlist(storedUsername);
      fetchFollowersCount(storedUsername);
    }
  }, []);

  const fetchRatings = async (user) => {
    try {
      const res = await fetch(`http://localhost:5000/api/ratings/${user}`);
      const data = await res.json();
      const ratingsMap = {};
      data.forEach((r) => {
        const movieIndex = Object.values(categorizedMovies).flat().findIndex((m) => m.title === r.movieTitle);
        if (movieIndex !== -1) ratingsMap[movieIndex] = r.rating;
      });
      setUserRatings(ratingsMap);
    } catch (err) {
      console.error('Fetching ratings failed:', err);
    }
  };

  const fetchWatchlist = async (user) => {
    try {
      const res = await fetch(`http://localhost:5000/api/watchlist/${user}`);
      const data = await res.json();
      setUserList(data);
    } catch (err) {
      console.error('Fetching watchlist failed:', err);
    }
  };

  const fetchFollowersCount = async (user) => {
    try {
      const res = await fetch(`http://localhost:5000/api/followers/${user}`);
      const data = await res.json();
      setFollowersCount(data.length);
    } catch (err) {
      console.error('Fetching followers count failed:', err);
      setFollowersCount(0);
    }
  };

  const toggleDescription = (index, genre) => {
    setActiveDescriptions((prev) => ({
      ...prev,
      [genre + index]: !prev[genre + index],
    }));
  };
// navigates to profile
  const goToProfile = () => {
    router.push('/UserProfile');
  };

  const handleRating = async (rate, movie) => {
    try {
      const response = await fetch('http://localhost:5000/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieTitle: movie.title,
          rating: rate,
          username,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setUserRatings((prev) => ({
          ...prev,
          [Object.values(categorizedMovies).flat().findIndex((m) => m.title === movie.title)]: rate,
        }));
        alert(`Rated ${movie.title} successfully`);
      } else {
        console.error(result.error);
        alert('Failed to rate movie');
      }
    } catch (err) {
      console.error('Rating error:', err);
    }
  };

  const handleAddToList = async (movie) => {
    try {
      const response = await fetch('http://localhost:5000/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieTitle: movie.title, username }),
      });

      const result = await response.json();
      if (response.ok) {
        if (!userList.includes(movie.title)) {
          setUserList([...userList, movie.title]);
          alert(`${movie.title} added to your watchlist!`);
        }
      } else {
        console.error(result.error);
        alert('Failed to update watchlist');
      }
    } catch (err) {
      console.error('Watchlist error:', err);
    }
  };

  const handleRemoveFromList = async (movie) => {
    try {
      const response = await fetch(`http://localhost:5000/api/watchlist/${username}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieTitle: movie.title }),
      });

      const result = await response.json();
      if (response.ok) {
        setUserList(userList.filter((title) => title !== movie.title));
        alert(`${movie.title} removed from your watchlist.`);
      } else {
        console.error(result.error);
        alert('Failed to remove from watchlist');
      }
    } catch (err) {
      console.error('Remove watchlist error:', err);
    }
  };

  const filteredMovies = Object.values(categorizedMovies).flat().filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedMovies = showWatchlist
    ? filteredMovies.filter((movie) => userList.includes(movie.title))
    : filteredMovies;

  const handleViewUsers = () => {
    router.push('/users');
  };

  const handleViewFollowers = () => {
    router.push('/Followers');
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h2>🎬 Movie Dashboard</h2>
        <div>
          <button className={styles.profileButton} onClick={goToProfile}>
            <img src="user.png" alt="Profile" className={styles.profileImage} />
          </button>
          <button className={styles.findUsersButton} onClick={handleViewUsers}>
            <UserPlus size={18} /> Find Users
          </button>
        </div>
      </header>

      <h1 className={styles.title}>{showWatchlist ? '🎥 My Watchlist' : '🔥 Trending Movies'}</h1>
      <p className={styles.subtitle}>Click any movie to rate or see more info!</p>

      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search movies..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className={styles.toggleButton}
          onClick={() => setShowWatchlist((prev) => !prev)}
        >
          {showWatchlist ? 'View All Movies' : 'View My Watchlist'}
        </button>
      </div>

      <div className={styles.followersButtonWrapper}>
        <button className={styles.followersButton} onClick={handleViewFollowers}>
          <Users size={18} style={{ marginRight: '8px' }} />
          View Followers ({followersCount})
        </button>
      </div>

      <div className={styles.categories}>
        {Object.keys(categorizedMovies).map((genre) => (
          <div key={genre} className={styles.categorySection}>
            <h2 className={styles.categoryTitle}>{genre}</h2>
            <div className={styles.moviesGrid}>
              {categorizedMovies[genre]
                .filter((movie) => displayedMovies.includes(movie))
                .map((movie, index) => (
                  <div key={index} className={styles.movieCard}>
                    {activeDescriptions[genre + index] ? (
                      <div className={styles.descriptionBox}>
                        <p className={styles.descriptionText}>{movie.description}</p>
                        <button onClick={() => toggleDescription(index, genre)}>Back</button>
                      </div>
                    ) : (
                      <>
                        <img src={movie.image} alt={movie.title} className={styles.movieImage} />
                        <div className={styles.movieInfo}>
                          <div className={styles.movieTitle}>{movie.title}</div>
                          <div className={styles.movieRating}>⭐ {movie.rating}</div>
                          <div className={styles.actionButtons}>
                            <button onClick={() => window.open(movie.link, '_blank')}>Watch</button>
                            <button onClick={() => toggleDescription(index, genre)}>About</button>
                            {!userList.includes(movie.title) ? (
                              <button onClick={() => handleAddToList(movie)}>Add to List</button>
                            ) : (
                              <button onClick={() => handleRemoveFromList(movie)}>Remove from List</button>
                            )}
                            <div className={styles.ratingWrapper}>
                              <Rating
                                onClick={(rate) => handleRating(rate, movie)}
                                initialValue={userRatings[Object.values(categorizedMovies).flat().findIndex((m) => m.title === movie.title)] || 0}
                                size={20}
                                label
                                transition
                                fillColor="orange"
                                emptyColor="gray"
                              />
                              {userRatings[Object.values(categorizedMovies).flat().findIndex((m) => m.title === movie.title)] && (
                                <span className={styles.userRatingText}>
                                  Your Rating: {userRatings[Object.values(categorizedMovies).flat().findIndex((m) => m.title === movie.title)]}/5
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      {displayedMovies.length === 0 && <p className={styles.noResults}>No movies found.</p>}
    </div>
  );
};

export default Dashboard;