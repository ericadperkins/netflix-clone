import React, {useState, useEffect} from 'react';
import axios from './axios';
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from 'movie-trailer';

const base_url = "https://image.tmdb.org/t/p/original";

function Row({ title, fetchUrl, isLargeRow }){

    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    //A snippet of code which runs based on a specific condition
    useEffect(() => {
        //if [], run once when the row loads, and do not run it again
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl]);

    const options = {
        height: "390",
        width: "100%",
        playerVars: {
            //https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    };
    
    {/*When user clicks on the picture get the trailer*/}
    const handleClick = (movie) => {
        {/*If the trailer is open when clicked close it setTrailerUrl('')*/}
        if(trailerUrl) {
            setTrailerUrl('');
        } else{
            {/*Else try to find a video trailer on YouTube*/}
            movieTrailer(movie?.title || movie?.name || movie?.original_name || "")
            .then((url) => {
                {/*Search for everything we get after the question mark "V="*/}
                const urlParams = new URLSearchParams(new URL(url).search);

                {/*Search the string for the video ID "everything after v="*/}
                setTrailerUrl(urlParams.get("v"));

            }).catch(error => console.log(error));
        }
    }



    return(
        <div className="row">
            <h2>{title}</h2>

            <div className="row_posters">
                {/*several row_poster*/}

                {movies.map(movie => (
                    <img 
                        key={movie.id}
                        onClick={() =>handleClick(movie)}
                        className={`row_poster ${isLargeRow && "row_posterLarge"}`}
                        src={`${base_url}${isLargeRow ? movie.poster_path : movie.poster_path}`}
                        alt={movie.name}
                    />
                ))}
            </div>

            {/*We have a trailerUrl &&then we play the trailer*/}
            {trailerUrl && <YouTube videoId={trailerUrl} opts={options} />}
        </div>
    )
}

export default Row;