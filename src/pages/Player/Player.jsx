import React, { useState, useEffect } from 'react'
import './Player.css'
import back_arrow_icon from '../../assets/back_arrow_icon.png'
import { useNavigate, useParams } from 'react-router-dom'

const Player = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [apiData, setApiData] = useState({
    name: "",
    key: "",
    published_at: "",
    typeof: ""
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYWMyNzRjZGM5YjFhMTY5YmFiMDc2NGZiZDA2OWY2YSIsIm5iZiI6MTc1NTA3MTE0MS42NTIsInN1YiI6IjY4OWM0MmE1ZTkyY2IzMTdhN2M3MDJhMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jP4PwYdUFTizFWlOixLM3g5x63EqJ0GK8vzGtd9QxSM",
    },
  };

  useEffect(() => {
    if (id) {
      
      fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
        options
      )
        .then((videoRes) => videoRes.json())
        .then((videoData) => {
          console.log('Video data:', videoData); // Debug için
          if (videoData.results && videoData.results.length > 0) {
            // Önce YouTube trailer'ı ara
            let trailer = videoData.results.find(video => 
              video.site === "YouTube" && video.type === "Trailer"
            );
            
            // Eğer YouTube trailer yoksa, herhangi bir trailer'ı al
            if (!trailer) {
              trailer = videoData.results.find(video => 
                video.type === "Trailer"
              );
            }
            
            // Eğer trailer yoksa, herhangi bir video'yu al
            if (!trailer) {
              trailer = videoData.results[0];
            }
            
            if (trailer) {
              setApiData({
                name: trailer.name || "Movie Trailer",
                key: trailer.key,
                published_at: trailer.published_at || "",
                typeof: trailer.type || "Video"
              });
              setError(null);
            } else {
              setError("No video available for this movie");
            }
          } else {
            setError("No video available for this movie");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('API Error:', err);
          setError("Error loading video");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id])

  if (loading) {
    return (
      <div className="player">
        <img 
        src={back_arrow_icon} 
        alt="" 
          onClick={() => { navigate(-2) }}
        style={{ cursor: 'pointer' }}
      />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <p>Loading trailer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="player">
      <img 
        src={back_arrow_icon} 
        alt="" 
        onClick={() => navigate(-1)}
        style={{ cursor: 'pointer' }}
      />
      {error ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column' }}>
          <p style={{ fontSize: '18px', color: '#e50914', marginBottom: '10px' }}>{error}</p>
          <p style={{ fontSize: '14px', color: '#666' }}>Please select another movie</p>
        </div>
      ) : apiData.key ? (
        <iframe
          width="90%"
          height="90%"
          src={`https://www.youtube.com/embed/${apiData.key}`}
          title="trailer"
          allowFullScreen
        ></iframe>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <p>No trailer available</p>
        </div>
      )}
      <div className="player-info">
        <p>{apiData.published_at ? apiData.published_at.slice(0,10) : "No date available"}</p>
        <p>{apiData.name}</p>
        <p>{apiData.type}</p>
      </div>
    </div>
  );
}

export default Player
