// Todo el texto editable de la web vive aquí. Para cambiar cualquier dato
// (fecha, hora, dirección, preguntas frecuentes...) edita este archivo,
// haz commit y haz `git push plesk main` para desplegarlo.

export const NOMBRES = {
  novio1: "Álvaro",
  novio2: "Luisma",
};

// Formato ISO con zona horaria. Se usa para la cuenta atrás de la portada.
export const FECHA_BODA_ISO = "2026-12-07T17:00:00+01:00";

export const LUGAR = {
  nombre: "El Tinto",
  direccionCompleta: "Finca El Tinto · Carretera de Olías, Km 7,7, 29018 Málaga",
  mapaEmbedSrc:
    "https://www.google.com/maps?q=Carretera+de+Ol%C3%ADas+Km+7.7+29018+M%C3%A1laga&output=embed",
};

export const FECHA_TEXTO = "7 de diciembre de 2026";

export const HORA_CONVOCATORIA = "13:00";

export const MOMENTOS_DEL_DIA = ["Ceremonia simbólica", "Banquete", "Fiesta"];

export const FAQ: { pregunta: string; respuesta: string }[] = [
  {
    pregunta: "¿Hay código de vestimenta?",
    respuesta: "Libre — venid guapos y elegantes, cada uno a su estilo.",
  },
  {
    pregunta: "¿Hay aparcamiento?",
    respuesta:
      "Sí, hay aparcamiento en la finca. Aún estamos decidiendo si organizamos un autobús — si hay novedades, os avisamos.",
  },
];
