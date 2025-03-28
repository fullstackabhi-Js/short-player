import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX 
} from 'lucide-react';

// Video data from the provided document
const MOCK_VIDEOS = [
  {
    id: '1',
    user: '@blenderfoundation',
    caption: 'Big Buck Bunny - Animated Short',
    likes: Math.floor(Math.random() * 10000),
    comments: Math.floor(Math.random() * 500),
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    userAvatar: "/api/placeholder/100/100",
    title: "Big Buck Bunny",
    thumbnail: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
  },
  {
    id: '2',
    user: '@blenderfoundation',
    caption: 'Sintel - Independent Animation',
    likes: Math.floor(Math.random() * 10000),
    comments: Math.floor(Math.random() * 500),
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    userAvatar: "/api/placeholder/100/100",
    title: "Sintel",
    thumbnail: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg"
  },
  {
    id: '3',
    user: '@google',
    caption: 'For Bigger Joyrides - Chromecast Ad',
    likes: Math.floor(Math.random() * 10000),
    comments: Math.floor(Math.random() * 500),
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    userAvatar: "/api/placeholder/100/100",
    title: "For Bigger Joyrides",
    thumbnail: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg"
  }
];

const VideoPlayer = ({ video, isActive }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [likes, setLikes] = useState(video.likes);

  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (isActive) {
      videoElement?.play().catch(error => {
        console.error('Autoplay prevented:', error);
        setIsPlaying(false);
      });
    } else {
      videoElement?.pause();
    }
  }, [isActive]);

  const togglePlay = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
        setIsPlaying(false);
      } else {
        videoElement.play().catch(error => {
          console.error('Play error:', error);
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleLike = () => {
    setLikes(likes + 1);
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      <video 
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnail}
        className="w-full h-full object-cover"
        playsInline
        muted={isMuted}
        loop
      />
      
      <div className="absolute bottom-4 left-4 flex items-center space-x-2">
        <img 
          src={video.thumbnail} 
          alt={video.user} 
          className="w-10 h-10 rounded-full border-2 border-white"
        />
        <span className="text-white font-bold">{video.user}</span>
      </div>
      
      <div className="absolute bottom-4 right-4 flex flex-col space-y-4">
        <button 
          onClick={handleLike} 
          className="flex flex-col items-center text-white"
        >
          <Heart fill="white" size={32} />
          <span>{likes}</span>
        </button>
        
        <button className="flex flex-col items-center text-white">
          <MessageCircle size={32} />
          <span>{video.comments}</span>
        </button>
        
        <button className="flex flex-col items-center text-white">
          <Share2 size={32} />
        </button>
      </div>
      
      <div className="absolute top-4 right-4 flex space-x-2">
        <button onClick={toggleMute} className="text-white">
          {isMuted ? <VolumeX size={32} /> : <Volume2 size={32} />}
        </button>
        
        <button onClick={togglePlay} className="text-white">
          {isPlaying ? <Pause size={32} /> : <Play size={32} />}
        </button>
      </div>
      
      <div className="absolute bottom-16 left-4 text-white">
        <p className="font-bold">{video.title}</p>
        <p className="text-sm">{video.caption}</p>
      </div>
    </div>
  );
};

const ShortVideosApp = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videos] = useState(MOCK_VIDEOS);
  const [touchStart, setTouchStart] = useState(0);
  const containerRef = useRef(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientY;
    const touchDiff = touchStart - touchEnd;

    if (Math.abs(touchDiff) > 50) {
      if (touchDiff > 0) {
        // Swipe Up
        setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
      } else {
        // Swipe Down
        setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {videos.map((video, index) => {
        let translateY = 0;
        if (index < currentVideoIndex) {
          translateY = '-100%';
        } else if (index > currentVideoIndex) {
          translateY = '100%';
        }

        return (
          <div 
            key={video.id} 
            className="absolute inset-0 transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateY(${translateY})`,
              zIndex: index === currentVideoIndex ? 10 : 0
            }}
          >
            <VideoPlayer 
              video={video} 
              isActive={index === currentVideoIndex} 
            />
          </div>
        );
      })}
    </div>
  );
};

export default ShortVideosApp;