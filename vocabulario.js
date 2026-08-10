/* ==========================================================================
   VOCABULARIO DEL JUEGO PARA INÉS
   ==========================================================================
   Este archivo contiene el listado de palabras, categorías, imágenes y frases.
   Puedes modificar o añadir nuevas palabras manteniendo exactamente esta estructura:
   
   - palabra: Nombre del objeto o palabra objetivo.
   - categoria: Grupo al que pertenece (ej: "Playa", "Piscina", "Frutas").
   - imagen_tarjeta: Imagen principal de la tarjeta de opción.
   - imagen_puzle: Imagen de recompensa que se muestra al acertar.
   - frase_acierto: Frase locutada por voz que celebra el acierto y aporta aprendizaje.
   ========================================================================== */

const miVocabulario = [
  // --- CATEGORÍA: PLAYA ---
  {
    palabra: "Delfín",
    categoria: "Playa",
    imagen_tarjeta: "tarjetas/delfin_tarjeta.jpg",
    imagen_puzle: "puzles/delfin_puzle.jpg",
    frase_acierto: "¡Fantástico Inés! Has adivinado Delfín, ¡lo has hecho de maravilla!"
  },
  {
    palabra: "Estrella de mar",
    categoria: "Playa",
    imagen_tarjeta: "tarjetas/estrella_de_mar_tarjeta.jpg",
    imagen_puzle: "puzles/estrella_de_mar_puzle.jpg",
    frase_acierto: "¡Genial Inés! Has descubierto la Estrella de mar, ¡qué lista eres!"
  },
  {
    palabra: "Cubo y castillo de arena",
    categoria: "Playa",
    imagen_tarjeta: "tarjetas/cubo_castillo_arena_tarjeta.jpg",
    imagen_puzle: "puzles/nina_playa_olas.jpg",
    frase_acierto: "¡Muy bien Inés! En la playa hacemos un castillo de arena gigante."
  },
  {
    palabra: "Mar con olas",
    categoria: "Playa",
    imagen_tarjeta: "tarjetas/mar_con_olas_tarjeta.jpg",
    imagen_puzle: "puzles/nina_playa_olas.jpg",
    frase_acierto: "¡Súper bien Inés! Las olas del mar son muy frescas y divertidas."
  },
  {
    palabra: "Sombrilla",
    categoria: "Playa",
    imagen_tarjeta: "tarjetas/sombrilla_tarjeta.jpg",
    imagen_puzle: "puzles/nina_playa_olas.jpg",
    frase_acierto: "¡Bravo Inés! La sombrilla nos da sombra y nos protege del sol."
  },

  // --- CATEGORÍA: PISCINA ---
  {
    palabra: "Flotador amarillo",
    categoria: "Piscina",
    imagen_tarjeta: "tarjetas/flotador_amarillo_tarjeta.jpg",
    imagen_puzle: "puzles/piscina_toboganes.jpg",
    frase_acierto: "¡Fantástico Inés! El flotador amarillo nos ayuda a flotar felices."
  },
  {
    palabra: "Piscina de adultos",
    categoria: "Piscina",
    imagen_tarjeta: "tarjetas/piscina_adultos_tarjeta.jpg",
    imagen_puzle: "puzles/piscina_toboganes.jpg",
    frase_acierto: "¡Genial Inés! En la piscina grande nadamos con los papás."
  },
  {
    palabra: "Piscina infantil con chorros",
    categoria: "Piscina",
    imagen_tarjeta: "tarjetas/piscina_infantil_chorros_tarjeta.jpg",
    imagen_puzle: "puzles/piscina_toboganes.jpg",
    frase_acierto: "¡Qué divertido Inés! Los chorros de agua de la piscina son geniales."
  },

  // --- CATEGORÍA: FRUTAS ---
  {
    palabra: "Sandía",
    categoria: "Frutas",
    imagen_tarjeta: "tarjetas/sandia_tarjeta.jpg",
    imagen_puzle: "puzles/sandia_puzle.jpg",
    frase_acierto: "¡Bravo Inés! ¡La sandía es una fruta riquísima, dulce y jugosa!"
  },
  {
    palabra: "Melón",
    categoria: "Frutas",
    imagen_tarjeta: "tarjetas/melon_tarjeta.jpg",
    imagen_puzle: "puzles/sandia_puzle.jpg",
    frase_acierto: "¡Muy bien Inés! El melón es una fruta verde muy dulce y fresca."
  },
  {
    palabra: "Manzana",
    categoria: "Frutas",
    imagen_tarjeta: "tarjetas/manzana_tarjeta.jpg",
    imagen_puzle: "puzles/sandia_puzle.jpg",
    frase_acierto: "¡Excelente Inés! La manzana es roja y nos da mucha energía."
  },
  {
    palabra: "Naranja",
    categoria: "Frutas",
    imagen_tarjeta: "tarjetas/naranja_tarjeta.jpg",
    imagen_puzle: "puzles/sandia_puzle.jpg",
    frase_acierto: "¡Fenomenal Inés! La naranja es muy sana y tiene mucha vitamina C."
  }
];

// Asignar al objeto global window para máxima compatibilidad
if (typeof window !== 'undefined') {
  window.miVocabulario = miVocabulario;
}

