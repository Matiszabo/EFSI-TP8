import React from 'react';
import styles from './Puntuaciones.module.css';

const Puntuaciones = ({ puntuaciones, eliminarPuntuacion }) => {
  return (
    <div className={styles.puntuacionesContainer}>
      <h2 className={styles.titulo}>Tabla de Puntuaciones</h2>
      <ul className={styles.lista}>
        {puntuaciones
          .sort((a, b) => b.puntos - a.puntos)
          .map((puntuacion, index) => (
            <li key={index} className={styles.elemento}>
              <span className={styles.nombre}>{puntuacion.nombre}</span>: <span className={styles.puntos}>{puntuacion.puntos}</span>
              <button className={styles.botonEliminar} onClick={() => eliminarPuntuacion(index)}>Eliminar</button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Puntuaciones;
