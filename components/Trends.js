import { useEffect, useState } from 'react';
import styles from '../styles/Trends.module.css';

function Trends() {
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    console.log('Trends component mounted');
    fetch('https://tweeter-backend-eta.vercel.app/tweets/trends')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('API Response:', data); 
        if (data.result) {
          setTrends(data.trends);
        }
      })
      .catch(error => {
        console.error('Failed to fetch trends:', error);
      });
  }, []);

  return (
    <div className={styles.trends}>
      <ul>
        {trends.length > 0 ? (
          trends.map((hashtag, index) => (
            <li key={index} className={styles.popularHashtag}>
              <a href={`/hashtag/${hashtag.slice(1)}`}>{hashtag}</a>
            </li>
          ))
        ) : (
          <li>No trends available</li>
        )}
      </ul>
    </div>
  );
}

export default Trends;
