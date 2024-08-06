import React, { useState, useEffect } from 'react';
import './StretchVideo.css';

function StretchVideo() {
    const [videoIds, setVideoIds] = useState([]);

    useEffect(() => {
        fetch('/stretching')
            .then(response => response.json())
            .then(data => setVideoIds(data.videoIds))
            .catch(error => console.error('Error fetching video IDs:', error));
    }, []);

    return (
        <div className="stretch-video-container">
            <h1>Keep your eye healthy with noti's</h1>
            <a>추천 영상을 통해 눈 운동을 시도해 봐요!</a>
            <div id="videos">
                {videoIds.length > 0 ? (
                    videoIds.map((videoId, index) => (
                        <iframe key={index} width="560" height="315"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen>
                        </iframe>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
}

export default StretchVideo;