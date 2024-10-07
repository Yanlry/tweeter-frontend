import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/user';
import styles from '../styles/Hashtag.module.css';

function Hashtag() {
  const router = useRouter();
  const { hashtag } = router.query; 
  const [tweets, setTweets] = useState([]);
  const [query, setQuery] = useState(hashtag ? `#${hashtag}` : '#'); 
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const fetchTweetsByHashtag = (hashtag) => {
    fetch(`https://tweeter-backend-eta.vercel.app/tweets/hashtag/${hashtag}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setTweets(data.tweets);
        } else {
          setTweets([]);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch tweets for hashtag:', error);
      });
  };

  useEffect(() => {
    if (hashtag) {
      fetchTweetsByHashtag(hashtag);
    }
  }, [hashtag]);

  const handleInputChange = (e) => {
    const value = `#${e.target.value.replace(/^#/, '')}`;
    setQuery(value);

    const hashtagToSearch = value.slice(1);
    fetchTweetsByHashtag(hashtagToSearch);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div>
          <Link href="/">
            <Image src="/logo.png" alt="Logo" width={50} height={50} className={styles.logo} />
          </Link>
        </div>

        <div>
          <div className={styles.userSection}>
            <Image src="/avatar.png" alt="Avatar" width={46} height={46} className={styles.avatar} />
            <div className={styles.userInfo}>
              <p className={styles.name}>{user.firstName}</p>
              <p className={styles.username}>@{user.username}</p>
            </div>
          </div>
          <button
            onClick={() => {
              router.push('/login');
              dispatch(logout());
            }}
            className={styles.logout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className={styles.middleSection}>
        <h1 className={styles.title}>Saisissez un hashtag dans la barre de recherche pour afficher les résultats</h1>

        <div className={styles.searchSection}>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            className={styles.searchBar}
            placeholder="Search hashtags"
          />
        </div>

        {tweets.length > 0 ? (
          tweets.map((tweet, index) => (
            <div key={index} className={styles.tweetContainer}>
              <p className={styles.tweetContent}>{tweet.content}</p>
              <p className={styles.tweetAuthor}>@{tweet.author.username}</p>
            </div>
          ))
        ) : (
          <p className={styles.noTweet}>Aucun tweet trouvé pour ce hashtag</p>
        )}
      </div>

      <div className={styles.rightSection}>
      </div>
    </div>
  );
}

export default Hashtag;
