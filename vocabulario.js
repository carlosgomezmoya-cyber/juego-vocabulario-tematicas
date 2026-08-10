/* ==========================================================================
   VOCABULARIO DEL JUEGO PARA INÉS
   ==========================================================================
   Este archivo contiene el listado de palabras, categorías, imágenes y frases.
   Puedes modificar o añadir nuevas palabras manteniendo exactamente esta estructura:
   
   - palabra: Nombre del objeto o palabra objetivo.
   - categoria: Grupo al que pertenece (ej: "Playa", "Casa", "Baño", "Alimentos", "Vehículos").
   - imagen_tarjeta: Imagen principal de la tarjeta de opción.
   - imagen_puzle: Imagen de recompensa que se muestra al acertar.
   - frase_acierto: Frase locutada por voz que celebra el acierto y aporta aprendizaje.
   ========================================================================== */

const miVocabulario = [
  // --- CATEGORÍA: PLAYA ---
  {
    palabra: "Rastrillo",
    categoria: "Playa",
    imagen_tarjeta: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=600&auto=format&fit=crop&q=80",
    imagen_puzle: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    frase_acierto: "¡Genial! El rastrillo sirve para hacer caminitos en la arena de la playa."
  },
  {
    palabra: "Cubo",
    categoria: "Playa",
    imagen_tarjeta: "https://images.unsplash.com/photo-1584988220023-e69c1f544252?w=600&auto=format&fit=crop&q=80",
    imagen_puzle: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    frase_acierto: "¡Muy bien! En el cubo guardas el agua y la arena para hacer castillos."
  },
  {
    palabra: "Sombrilla",
    categoria: "Playa",
    imagen_tarjeta: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=600&auto=format&fit=crop&q=80",
    imagen_puzle: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    frase_acierto: "¡Estupendo! La sombrilla nos da sombra y nos protege del sol."
  },
  {
    palabra: "Toalla",
    categoria: "Playa",
    imagen_tarjeta: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=600&auto=format&fit=crop&q=80",
    imagen_puzle: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    frase_acierto: "¡Bravo! Nos secamos con la toalla suave al salir del mar."
  },
  {
    palabra: "Pala",
    categoria: "Playa",
    imagen_tarjeta: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=600&auto=format&fit=crop&q=80",
    imagen_puzle: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    frase_acierto: "¡Súper! Con la pala cavamos un hoyo grande en la playa."
  },

  // --- CATEGORÍA: BAÑO ---
  {
    palabra: "Jabón",
    categoria: "Baño",
    imagen_tarjeta: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&auto=format&fit=crop&q=80",
    imagen_puzle: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80",
    frase_acierto: "¡Excelente! El jabón hace muchas pompas limpias para las manos."
  },
  {
    palabra: "Esponja",
    categoria: "Baño",
    imagen_tarjeta: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&auto=format&fit=crop&q=80",
    imagen_puzle: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80",
    frase_acierto: "¡Fantástico! La esponja es muy suave para darnos un buen baño."
  },
  {
    palabra: "Peine",
    categoria: "Baño",
    imagen_tarjeta: "https://images.unsplash.com/photo-1590159763121-7c9fd312190d?w=600&auto=format&fit=crop&q=80",
    imagen_puzle: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80",
    frase_acierto: "¡Bien hecho! Usamos el peine para peinarnos y quedar guapísimos."
  },
  {
    palabra: "Cepillo de dientes",
    categoria: "Baño",
    imagen_tarjeta: "https://images.unsplash.com/photo-1559591937-e58af1809278?w=600&auto=format&fit=crop&q=80",
    imagen_puzle: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80",
    frase_acierto: "¡Maravilloso! El cepillo deja los dientes limpios y brillantes."
  },

  // --- CATEGORÍA: CASA ---
  {
    palabra: "Cama",
    categoria: "Casa",
    imagen_tarjeta: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=80",
    imagen_puzle: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80",
    frase_acierto: "¡Maravilloso! En la cama dormimos calentitos por la noche."
  },
  {
    palabra: "Silla",
    categoria: "Casa",
    imagen_tarjeta: "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?w=600&auto=format&fit=crop&q=80",
    imagen_puzle: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80",
    frase_acierto: "¡Muy bien! Nos sentamos en la silla para comer y pintar."
  },
  {
    palabra: "Mesa",
    categoria: "Casa",
    imagen_tarjeta: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=600&auto=format&fit=crop&q=80",
    imagen_puzle: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80",
    frase_acierto: "¡Genial! En la mesa ponemos la comida rica y los cuentos."
  },
  {
    palabra: "Lámpara",
    categoria: "Casa",
    imagen_tarjeta: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
    imagen_puzle: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80",
    frase_acierto: "¡Fenomenal! La lámpara ilumina la habitación para leer juntos."
  },

  // --- CATEGORÍA: ALIMENTOS ---
  {
    palabra: "Cuchara",
    categoria: "Alimentos",
    imagen_tarjeta: "https://images.unsplash.com/photo-1619367300933-28f0907d853e?w=600&auto=format&fit=crop&q=80",
    imagen_puzle: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80",
    frase_acierto: "¡Estupendo! Con la cuchara comemos la puré y el yogur."
  },
  {
    palabra: "Manzana",
    categoria: "Alimentos",
    imagen_tarjeta: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80",
    imagen_puzle: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80",
    frase_acierto: "¡Riquísimo! La manzana es una fruta roja muy dulce y sana."
  },
  {
    palabra: "Pan",
    categoria: "Alimentos",
    imagen_tarjeta: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    imagen_puzle: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80",
    frase_acierto: "¡Bravo! El pan tierno para preparar el bocadillo."
  },
  {
    palabra: "Plátano",
    categoria: "Alimentos",
    imagen_tarjeta: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80",
    imagen_puzle: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80",
    frase_acierto: "¡Qué rico! El plátano amarillo nos da mucha energía."
  },

  // --- CATEGORÍA: VEHÍCULOS ---
  {
    palabra: "Coche",
    categoria: "Vehículos",
    imagen_tarjeta: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80",
    imagen_puzle: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80",
    frase_acierto: "¡Brum brum! El coche va por la carretera con la familia."
  },
  {
    palabra: "Autobús",
    categoria: "Vehículos",
    imagen_tarjeta: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&auto=format&fit=crop&q=80",
    imagen_puzle: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80",
    frase_acierto: "¡Genial! El autobús grande nos lleva al colegio."
  },
  {
    palabra: "Bicicleta",
    categoria: "Vehículos",
    imagen_tarjeta: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80",
    imagen_puzle: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80",
    frase_acierto: "¡A pedalear! La bicicleta rueda feliz en el parque."
  }
];

// Asignar al objeto global window para máxima compatibilidad
if (typeof window !== 'undefined') {
  window.miVocabulario = miVocabulario;
}

