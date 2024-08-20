import React, { useState, useEffect, useRef } from 'react';
import './YouTubeAudioPlayer.css'; // Import your CSS file

const YouTubeAudioPlayer = () => {
    const [isPaused, setIsPaused] = useState(true);
    const [songUrls, setSongUrls] = useState([
        { title: 'Bones: White Boy Rick', url: 'https://www.youtube.com/watch?v=I4jh4ojwSoM' },
        { title: 'Pooh Shiesty: See Me Coming', url: 'https://www.youtube.com/watch?v=VlpJPgINMRI' },
        { title: 'Nasty C: King ft. A$AP Ferg', url: 'https://www.youtube.com/watch?v=KjwuxQmyeyE' }, 
        { title: '50 Cent: Heat', url: 'https://www.youtube.com/watch?v=YCGzRQjX2eQ' },
    ]);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const playerRef = useRef(null);

    useEffect(() => {
        // Load YouTube IFrame Player API script
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // Initialize YouTube player
        window.onYouTubeIframeAPIReady = () => {
            playerRef.current = new window.YT.Player('player', {
                height: '0',
                width: '0',
                videoId: extractVideoId(songUrls[currentSongIndex].url),
                events: {
                    onReady: onPlayerReady,
                    onStateChange: onPlayerStateChange
                }
            });
        };
    }, []);

    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.loadVideoById(extractVideoId(songUrls[currentSongIndex].url));
            setIsPaused(true); // Pause the player when changing songs
        }
    }, [currentSongIndex]);

    const extractVideoId = (url) => {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : null;
    };

    const onPlayerReady = (event) => {
        event.target.pauseVideo();
    };

    const onPlayerStateChange = (event) => {
        if (event.data === window.YT.PlayerState.ENDED) {
            nextSong();
        }
    };

    const previousSong = () => {
        const newIndex = (currentSongIndex - 1 + songUrls.length) % songUrls.length;
        setCurrentSongIndex(newIndex);
    };

    const nextSong = () => {
        const newIndex = (currentSongIndex + 1) % songUrls.length;
        setCurrentSongIndex(newIndex);
    };

    const handleSongChange = (index) => {
        setCurrentSongIndex(index);
    };

    const playPause = () => {
        if (isPaused) {
            playerRef.current.playVideo();
        } else {
            playerRef.current.pauseVideo();
        }
        setIsPaused(!isPaused);
    };

    return (
        <div className="youtube-control">
            <div className="control-buttons">
            {/*    <span onClick={previousSong} style={{ cursor: 'pointer' }}>&nbsp;⏮️&nbsp;</span>*/}
                <select
                    value={currentSongIndex}
                    onChange={(e) => handleSongChange(parseInt(e.target.value))}
                    style={{ backgroundColor: "black", color: "#00FF00" }}
                >
                    {songUrls.map((song, index) => (
                        <option key={song.url} value={index}>{song.title}</option>
                    ))}
                </select>
          {/*      <span onClick={nextSong} style={{ cursor: 'pointer' }}>&nbsp;⏭️</span>*/}
                <span onClick={playPause} style={{ cursor: 'pointer' }}>&nbsp;{isPaused ? '▶' : '❚❚'}</span>
             
            </div>
            <div id="player" style={{ display: 'none' }}></div> {/* Hidden YouTube player */}
        </div>
    );
};

export default YouTubeAudioPlayer;
