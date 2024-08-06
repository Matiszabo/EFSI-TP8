import { useState, useEffect } from 'react';
import axios from 'axios';

const usePaises = () => {
  const [paises, setPaises] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerPaises = async () => {
      try {
        const respuesta = await axios.get('https://countriesnow.space/api/v0.1/countries/flag/images');
        setPaises(respuesta.data.data);
      } catch (error) {
        setError(error);
      }
    };

    obtenerPaises();
  }, []);

  return { paises, error };
};

export default usePaises;
