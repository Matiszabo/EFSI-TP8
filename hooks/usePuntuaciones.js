import { useState, useEffect } from 'react';

const usePuntuaciones = () => {
  const [puntuaciones, setPuntuaciones] = useState([]);

  useEffect(() => {
    const puntuacionesGuardadas = JSON.parse(localStorage.getItem('puntuaciones')) || [];
    setPuntuaciones(puntuacionesGuardadas);
  }, []);

  const guardarPuntuacion = (nombre, puntuacion) => {
    const nuevasPuntuaciones = [...puntuaciones, { nombre, puntuacion }];
    setPuntuaciones(nuevasPuntuaciones);
    localStorage.setItem('puntuaciones', JSON.stringify(nuevasPuntuaciones));
  };

  return { puntuaciones, guardarPuntuacion };
};

export default usePuntuaciones;
