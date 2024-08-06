"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '@/styles/Home.module.css';
import Puntuaciones from '@/components/Puntuaciones';

const Home = () => {
  const [paises, setPaises] = useState([]);
  const [paisSeleccionado, setPaisSeleccionado] = useState({});
  const [respuestaUsuario, setRespuestaUsuario] = useState('');
  const [puntos, setPuntos] = useState(0);
  const [tiempo, setTiempo] = useState(15);
  const [ayuda, setAyuda] = useState('');
  const [nombreJugador, setNombreJugador] = useState('');
  const [puntuaciones, setPuntuaciones] = useState([]);

  useEffect(() => {
    const fetchPaises = async () => {
      try {
        const response = await axios.get('https://countriesnow.space/api/v0.1/countries/flag/images');
        setPaises(response.data.data);
        seleccionarPaisAleatorio(response.data.data);
      } catch (error) {
        console.error('Error al obtener los países:', error);
      }
    };

    fetchPaises();
  }, []);

  useEffect(() => {
    if (tiempo > 0) {
      const timer = setInterval(() => {
        setTiempo((prevTiempo) => prevTiempo - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      procesarRespuesta();
    }
  }, [tiempo]);

  const seleccionarPaisAleatorio = (paisesLista) => {
    if (!paisesLista || paisesLista.length === 0) return;
    const indiceAleatorio = Math.floor(Math.random() * paisesLista.length);
    setPaisSeleccionado(paisesLista[indiceAleatorio]);
    setAyuda(''); // Limpiar la pista cuando se selecciona una nueva bandera
    setTiempo(15); // Reiniciar el temporizador
  };

  const procesarRespuesta = () => {
    if (respuestaUsuario.toLowerCase() === paisSeleccionado.name.toLowerCase()) {
      setPuntos((prevPuntos) => Math.max(prevPuntos + 10, 0)); // Añadir puntos y asegurarse de que no haya puntuaciones negativas
    } else {
      setPuntos((prevPuntos) => Math.max(prevPuntos - 1, 0)); // Restar puntos y asegurarse de que no haya puntuaciones negativas
    }
    setRespuestaUsuario('');
    setAyuda(''); // Limpiar la pista después de procesar la respuesta
    seleccionarPaisAleatorio(paises);
  };

  const manejarRespuesta = () => {
    procesarRespuesta();
    setTiempo(15); // Reiniciar el temporizador cuando se envía una respuesta
  };

  const manejarNombreJugador = () => {
    if (nombreJugador.trim() === '') return;

    const puntuacionesGuardadas = JSON.parse(localStorage.getItem('puntuaciones')) || [];
    const nuevaPuntuacion = { nombre: nombreJugador, puntos };
    puntuacionesGuardadas.push(nuevaPuntuacion);
    localStorage.setItem('puntuaciones', JSON.stringify(puntuacionesGuardadas));
    
    setPuntuaciones(puntuacionesGuardadas); // Actualizar el estado de puntuaciones
    setNombreJugador('');
    setPuntos(0); // Reiniciar los puntos después de guardar
    seleccionarPaisAleatorio(paises);
  };

  useEffect(() => {
    const puntuacionesGuardadas = JSON.parse(localStorage.getItem('puntuaciones')) || [];
    setPuntuaciones(puntuacionesGuardadas); // Cargar las puntuaciones al iniciar
  }, []);

  const manejarPedirAyuda = () => {
    if (tiempo > 2 && paisSeleccionado.name) {
      setTiempo((prevTiempo) => prevTiempo - 2); // Reducir tiempo al pedir ayuda
      const letrasReveladas = paisSeleccionado.name.slice(0, ayuda.length + 1);
      setAyuda(letrasReveladas);
    }
  };

  const eliminarPuntuacion = (index) => {
    const puntuacionesActualizadas = puntuaciones.filter((_, i) => i !== index);
    setPuntuaciones(puntuacionesActualizadas);
    localStorage.setItem('puntuaciones', JSON.stringify(puntuacionesActualizadas));
  };

  return (
    <div className={styles.contenedor}>
      {paisSeleccionado.flag && (
        <img src={paisSeleccionado.flag} alt={`Bandera de ${paisSeleccionado.name}`} className={styles.bandera} />
      )}
      <input
        type="text"
        value={respuestaUsuario}
        onChange={(e) => setRespuestaUsuario(e.target.value)}
        className={styles.input}
        placeholder="Nombre del país"
      />
      <button onClick={manejarRespuesta} className={styles.boton}>Enviar Respuesta</button>
      <button onClick={manejarPedirAyuda} className={styles.boton}>Pedir Ayuda</button>
      <p className={styles.puntuacion}>Puntos: {puntos}</p>
      <p className={styles.tiempo}>Tiempo: {tiempo}s</p>
      <p className={styles.pista}>Pista: {ayuda}</p>
      <input
        type="text"
        value={nombreJugador}
        onChange={(e) => setNombreJugador(e.target.value)}
        className={styles.input}
        placeholder="Nombre del Jugador"
      />
      <button onClick={manejarNombreJugador} className={styles.boton}>Guardar Puntuación</button>
      <Puntuaciones puntuaciones={puntuaciones} eliminarPuntuacion={eliminarPuntuacion} />
    </div>
  );
};

export default Home;
