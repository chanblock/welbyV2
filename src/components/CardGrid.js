import React from 'react';
import styles from '../styles/CardGrid.module.css';

const CardGrid = ({ children }) => {
  return (
    <div className={styles.gridContainer}>
    {React.Children.map(children, (child) => (
      <div className={styles.cardWrapper}>{child}</div>
    ))}
  </div>
  );
};

export default CardGrid;
