/* ==========================================================================
   LÓGICA DEL JUEGO DE VOCABULARIO INFANTIL (VANILLA JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- ELEMENTOS DEL DOM ---
  const menuScreen = document.getElementById('menu-screen');
  const gameScreen = document.getElementById('game-screen');
  const categoriesGrid = document.getElementById('categories-grid');
  
  const currentCategoryTag = document.getElementById('current-category-tag');
  const puzzleTracker = document.getElementById('puzzle-tracker');
  const promptWordEl = document.getElementById('prompt-word');
  const optionsGrid = document.getElementById('options-grid');
  
  const btnSpeaker = document.getElementById('btn-speaker');
  const btnHome = document.getElementById('btn-home');
  const btnAudioToggle = document.getElementById('btn-audio-toggle');
  const btnInstall = document.getElementById('btn-install');

  const rewardModal = document.getElementById('reward-modal');
  const puzzleImg = document.getElementById('puzzle-img');
  const rewardPhrase = document.getElementById('reward-phrase');
  const btnNext = document.getElementById('btn-next');

  // --- ESTADO DE LA APLICACIÓN ---
  let selectedCategory = null;
  let activeVocabList = [];
  let currentTargetItem = null;
  let roundOptions = [];
  let correctCount = 0;
  let audioEnabled = true;
  let deferredPrompt = null;

  // MAPA DE ICONOS DE CATEGORÍAS
  const categoryIcons = {
    'Playa': '🏖️',
    'Baño': '🛁',
    'Casa': '🏠',
    'Alimentos': '🍎',
    'Vehículos': '🚗',
    'Animales': '🐶',
    'Ropa': '👕',
    'Juguetes': '🧸',
    'Escuela': '🎒',
    'Naturaleza': '🌳'
  };

  // --- REGISTRO DEL SERVICE WORKER DE PWA ---
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('✅ Service Worker registrado con éxito:', reg.scope))
      .catch(err => console.log('⚠️ Error al registrar Service Worker:', err));
  }

  // EVENTO DE INSTALACIÓN PWA
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (btnInstall) btnInstall.classList.remove('hidden');
  });

  if (btnInstall) {
    btnInstall.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          btnInstall.classList.add('hidden');
        }
        deferredPrompt = null;
      } else {
        alert('Para instalar en tu tablet Android:\n1. Toca los 3 puntos (⋮) de Chrome.\n2. Selecciona "Añadir a la pantalla de inicio".');
      }
    });
  }

  // --- SÍNTESIS DE VOZ Y EFECTOS DE SONIDO ---
  function speakText(text) {
    if (!audioEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel(); // Cancelar cualquier locución anterior
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9; // Hablar despacio y claro para niños
    utterance.pitch = 1.1; // Tono alegre
    window.speechSynthesis.speak(utterance);
  }

  // AUDIOS CON WEB AUDIO API
  function playSound(type) {
    if (!audioEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.3); // G5
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (err) {
      console.log('Audio feedback fallback:', err);
    }
  }

  // TOGGLE DE AUDIO
  if (btnAudioToggle) {
    btnAudioToggle.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      btnAudioToggle.textContent = audioEnabled ? '🔊 Voz On' : '🔇 Voz Off';
      if (!audioEnabled) window.speechSynthesis.cancel();
    });
  }

  // --- INICIALIZACIÓN DEL MENÚ DE CATEGORÍAS ---
  function initMenu() {
    if (!window.miVocabulario || !Array.isArray(window.miVocabulario)) {
      console.error('No se encontró la variable miVocabulario.');
      return;
    }

    // Extraer categorías únicas
    const categorias = [...new Set(window.miVocabulario.map(item => item.categoria))];
    categoriesGrid.innerHTML = '';

    // Generar tarjeta para cada categoría
    categorias.forEach(cat => {
      const count = window.miVocabulario.filter(i => i.categoria === cat).length;
      const icon = categoryIcons[cat] || '⭐';

      const card = document.createElement('div');
      card.className = 'category-card';
      card.innerHTML = `
        <div class="category-icon">${icon}</div>
        <div class="category-name">${cat}</div>
        <div class="category-badge">${count} palabras</div>
      `;

      card.addEventListener('click', () => startCategoryGame(cat));
      categoriesGrid.appendChild(card);
    });

    // Evento para jugar con todo el vocabulario
    const btnAll = document.getElementById('btn-play-all');
    if (btnAll) {
      btnAll.onclick = () => startCategoryGame(null);
    }

    // Botón volver al menú
    if (btnHome) {
      btnHome.onclick = showMenuScreen;
    }
  }

  function showMenuScreen() {
    gameScreen.classList.add('hidden');
    rewardModal.classList.add('hidden');
    menuScreen.classList.remove('hidden');
    window.speechSynthesis.cancel();
  }

  // --- INICIAR JUEGO ---
  function startCategoryGame(category) {
    selectedCategory = category;
    correctCount = 0;

    if (category) {
      activeVocabList = window.miVocabulario.filter(i => i.categoria === category);
      currentCategoryTag.textContent = `${categoryIcons[category] || '⭐'} ${category}`;
    } else {
      activeVocabList = [...window.miVocabulario];
      currentCategoryTag.textContent = `🌟 Todo el Vocabulario`;
    }

    if (activeVocabList.length === 0) return;

    menuScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    nextRound();
  }

  // --- SIGUIENTE RONDA ---
  function nextRound() {
    rewardModal.classList.add('hidden');
    puzzleTracker.textContent = `⭐ Aciertos: ${correctCount}`;

    // Elegir elemento objetivo al azar
    const randomIndex = Math.floor(Math.random() * activeVocabList.length);
    currentTargetItem = activeVocabList[randomIndex];

    // Formar las opciones (1 correcta + 2 distractores)
    const distractors = window.miVocabulario.filter(item => item.palabra !== currentTargetItem.palabra);
    
    // Mezclar distractores
    const shuffledDistractors = distractors.sort(() => 0.5 - Math.random()).slice(0, 2);
    roundOptions = [currentTargetItem, ...shuffledDistractors].sort(() => 0.5 - Math.random());

    // Actualizar UI
    promptWordEl.textContent = currentTargetItem.palabra;
    renderOptionCards();

    // Locución del objetivo
    setTimeout(() => {
      speakText(`Toca la imagen de ${currentTargetItem.palabra}`);
    }, 300);
  }

  // REPETIR VOZ CON EL BOTÓN ALTAVOZ
  if (btnSpeaker) {
    btnSpeaker.addEventListener('click', () => {
      if (currentTargetItem) {
        speakText(`Busca: ${currentTargetItem.palabra}`);
      }
    });
  }

  // RENDERIZAR LAS TARJETAS DE OPCIÓN
  function renderOptionCards() {
    optionsGrid.innerHTML = '';

    roundOptions.forEach(item => {
      const card = document.createElement('div');
      card.className = 'option-card';

      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'option-img-wrapper';

      const img = document.createElement('img');
      img.className = 'option-img';
      img.alt = item.palabra;
      img.src = item.imagen_tarjeta;

      // MANEJO DE ERROR DE CARGA DE IMAGEN (FALLBACK OFFLINE)
      img.onerror = () => {
        imgWrapper.innerHTML = `
          <div class="img-fallback-box">
            <span class="img-fallback-icon">🖼️</span>
            <span style="font-weight: 800; font-size: 1.2rem;">${item.palabra}</span>
          </div>
        `;
      };

      imgWrapper.appendChild(img);

      const label = document.createElement('div');
      label.className = 'option-card-label';
      label.textContent = item.palabra;

      card.appendChild(imgWrapper);
      card.appendChild(label);

      // EVENTO DE SELECCIÓN DE TARJETA
      card.addEventListener('click', () => handleOptionClick(item, card));

      optionsGrid.appendChild(card);
    });
  }

  // COMPROBACIÓN DE RESPUESTA
  function handleOptionClick(item, cardElement) {
    if (item.palabra === currentTargetItem.palabra) {
      // ¡ACIERTO!
      correctCount++;
      playSound('correct');
      
      // Mostrar Modal de Recompensa Puzle
      puzzleImg.src = item.imagen_puzle;
      puzzleImg.onerror = () => {
        puzzleImg.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%2338bdf8'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='32' fill='white' font-family='sans-serif'>🧩 ¡RECOMPENSA COMPLETA! 🧩</text></svg>";
      };

      rewardPhrase.textContent = item.frase_acierto;
      rewardModal.classList.remove('hidden');

      // Locutar frase de acierto
      speakText(item.frase_acierto);

    } else {
      // FALLO AMIGABLE
      playSound('wrong');
      cardElement.classList.add('card-wrong');
      speakText(`¡Casi! Inténtalo de nuevo. Busca ${currentTargetItem.palabra}`);

      setTimeout(() => {
        cardElement.classList.remove('card-wrong');
      }, 500);
    }
  }

  // BOTÓN SIGUIENTE EN MODAL RECOMPENSA
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      nextRound();
    });
  }

  // INICIAR EL MENÚ PRINCIPAL
  initMenu();
});
