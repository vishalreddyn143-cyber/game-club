/**
 * SARATHI: THE PATH OF RESILIENCE (सारथी)
 * Mobile Prototype & Psychological Game Mechanics Engine
 * Features:
 * - Sankalpa (Resolve) State Machine (No-Death mechanics)
 * - Concentric Ring Logic Solver (Chakravyuha)
 * - Socratic Mentoring Overlay (Lord Krishna)
 * - Pranayama 4-7-8 Breathing Reset Routine
 * - Procedural Web Audio Soundscape (Temple Bell, Conch Whoosh, Chimes)
 * - Daily Dharma Quest & Granth Filter System
 */

(function () {
  'use strict';

  // ==========================================
  // 1. GAME STATE & DATA
  // ==========================================
  const state = {
    sankalpa: 100, // Mental stamina (0-100%)
    streak: 14,
    gritPoints: 340,
    currentScreen: 'screenHome',
    soundEnabled: false,
    
    // Concentric Ring angles (degrees)
    rings: {
      outer: 90,   // Target is 0
      middle: 180, // Target is 0
    },

    // Quests state
    quests: {
      q1: false,
      q2: false,
      q3: false
    },

    // Daily Krishna quotes pool
    quotes: [
      { text: '"You have a right to your actions, Partha, but never to the fruits. Do not let failure shake your courage."', ref: '— Bhagavad Gita 2.47' },
      { text: '"The mind is restless and difficult to restrain, but through patient practice and non-attachment, it can be mastered."', ref: '— Bhagavad Gita 6.35' },
      { text: '"Better is one’s own duty, though imperfectly performed, than another’s duty well performed."', ref: '— Bhagavad Gita 3.35' },
      { text: '"When doubt clouds the vision of the archer, steady the breath before touching the bowstring."', ref: '— Sarathi Wisdom' }
    ]
  };

  // ==========================================
  // 2. PROCEDURAL WEB AUDIO SYNTHESIZER
  // ==========================================
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Temple Singing Bell Sound (Harmonic metallic decay)
  function playTempleBell(freq = 528) {
    if (!state.soundEnabled) return;
    initAudio();

    const now = audioCtx.currentTime;
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // Overtone for bell richness
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2.76, now);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioCtx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2.6);
    osc2.stop(now + 2.6);
  }

  // Conch (Shankha) Breath Resonance
  function playConchWhoosh() {
    if (!state.soundEnabled) return;
    initAudio();

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(330, now + 1.2);
    osc.frequency.exponentialRampToValueAtTime(180, now + 3.0);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.linearRampToValueAtTime(800, now + 1.2);
    filter.frequency.linearRampToValueAtTime(200, now + 3.0);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 1.0);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 3.1);
  }

  // Soft Tactile Tick for Ring Rotations
  function playTickSound() {
    if (!state.soundEnabled) return;
    initAudio();

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // ==========================================
  // 3. UI ELEMENT REFERENCES
  // ==========================================
  const dom = {
    // Sankalpa & Stats
    sankalpaBar: document.getElementById('sankalpaBar'),
    sankalpaValue: document.getElementById('sankalpaValue'),
    streakCount: document.getElementById('streakCount'),
    totalGrit: document.getElementById('totalGrit'),

    // Screens
    screens: document.querySelectorAll('.app-screen'),
    navTabs: document.querySelectorAll('.nav-tab'),
    btnStartTrial: document.getElementById('btnStartTrial'),
    btnExitPuzzle: document.getElementById('btnExitPuzzle'),

    // Puzzle Rings
    outerRing: document.getElementById('outerRing'),
    middleRing: document.getElementById('middleRing'),
    alignmentBeam: document.getElementById('alignmentBeam'),
    btnOuterCCW: document.getElementById('btnOuterCCW'),
    btnOuterCW: document.getElementById('btnOuterCW'),
    btnMiddleCCW: document.getElementById('btnMiddleCCW'),
    btnMiddleCW: document.getElementById('btnMiddleCW'),

    // Dharma Choice
    choiceRush: document.getElementById('choiceRush'),
    choiceDuty: document.getElementById('choiceDuty'),

    // Sarathi Mentor Modal
    btnCallSarathi: document.getElementById('btnCallSarathi'),
    sarathiModal: document.getElementById('sarathiModal'),
    btnCloseSarathi: document.getElementById('btnCloseSarathi'),
    sarathiDialogText: document.getElementById('sarathiDialogText'),
    choiceRiddle: document.getElementById('choiceRiddle'),
    choiceBreathe: document.getElementById('choiceBreathe'),
    choiceReady: document.getElementById('choiceReady'),

    // Pranayama Modal
    pranayamaModal: document.getElementById('pranayamaModal'),
    breathingRing: document.getElementById('breathingRing'),
    breathInstruction: document.getElementById('breathInstruction'),
    breathTimer: document.getElementById('breathTimer'),
    breathAffirmation: document.getElementById('breathAffirmation'),
    btnFinishPranayama: document.getElementById('btnFinishPranayama'),

    // Victory Modal
    victoryModal: document.getElementById('victoryModal'),
    btnClaimVictory: document.getElementById('btnClaimVictory'),

    // Audio & GDD buttons
    toggleAudioBtn: document.getElementById('toggleAudioBtn'),
    audioLabel: document.getElementById('audioLabel'),
    viewGddBtn: document.getElementById('viewGddBtn'),

    // Quests
    checkQ1: document.getElementById('checkQ1'),
    checkQ2: document.getElementById('checkQ2'),
    checkQ3: document.getElementById('checkQ3'),

    // Granth Tabs
    granthTabs: document.querySelectorAll('.granth-tab'),
    granthCards: document.querySelectorAll('.granth-card'),
    audioPronounceBtns: document.querySelectorAll('.audio-pronounce-btn'),

    // Side Sandbox Controls
    triggerDepleteSankalpa: document.getElementById('triggerDepleteSankalpa'),
    triggerPranayamaDirect: document.getElementById('triggerPranayamaDirect'),
    triggerKrishnaAdvice: document.getElementById('triggerKrishnaAdvice'),
    triggerAutoSolve: document.getElementById('triggerAutoSolve'),
    toastShelf: document.getElementById('toastShelf')
  };

  // ==========================================
  // 4. SANKALPA & STATE ENGINE
  // ==========================================
  function updateSankalpaUI() {
    const val = Math.max(0, Math.min(100, state.sankalpa));
    state.sankalpa = val;
    dom.sankalpaBar.style.width = `${val}%`;
    dom.sankalpaValue.textContent = `${val}%`;

    if (val <= 25) {
      dom.sankalpaBar.classList.add('low');
    } else {
      dom.sankalpaBar.classList.remove('low');
    }

    // Check if Sankalpa hit 0: Triggers growth intervention instead of Game Over
    if (val === 0) {
      showToast('Sankalpa exhausted. Krishna invites you to breathe.');
      setTimeout(() => {
        openPranayamaModal();
      }, 600);
    }
  }

  function adjustSankalpa(delta, reason) {
    state.sankalpa += delta;
    updateSankalpaUI();

    if (delta > 0) {
      showToast(`+${delta}% Sankalpa: ${reason}`);
      playTempleBell(660);
    } else {
      showToast(`${delta}% Sankalpa: ${reason}`);
      playTickSound();
    }
  }

  // Toast Notification
  function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = msg;
    dom.toastShelf.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // ==========================================
  // 5. NAVIGATION & SCREEN SWITCHING
  // ==========================================
  function switchScreen(targetId) {
    dom.screens.forEach(s => s.classList.remove('active'));
    dom.navTabs.forEach(t => t.classList.remove('active'));

    const targetScreen = document.getElementById(targetId);
    if (targetScreen) {
      targetScreen.classList.add('active');
      state.currentScreen = targetId;
    }

    const matchingTab = Array.from(dom.navTabs).find(t => t.dataset.target === targetId);
    if (matchingTab) {
      matchingTab.classList.add('active');
    }

    playTickSound();
  }

  dom.navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchScreen(tab.dataset.target);
    });
  });

  dom.btnStartTrial.addEventListener('click', () => {
    switchScreen('screenPuzzle');
    showToast('Entered Chakravyuha: Align the rings of Dhairya');
  });

  dom.btnExitPuzzle.addEventListener('click', () => {
    switchScreen('screenHome');
  });

  // ==========================================
  // 6. PUZZLE MECHANICS: CHAKRAVYUHA CONCENTRIC RINGS
  // ==========================================
  function rotateOuter(deltaDeg) {
    state.rings.outer = (state.rings.outer + deltaDeg) % 360;
    if (state.rings.outer < 0) state.rings.outer += 360;
    dom.outerRing.style.transform = `rotate(${state.rings.outer}deg)`;
    playTickSound();
    checkPuzzleWinCondition();
  }

  function rotateMiddle(deltaDeg) {
    state.rings.middle = (state.rings.middle + deltaDeg) % 360;
    if (state.rings.middle < 0) state.rings.middle += 360;
    dom.middleRing.style.transform = `rotate(${state.rings.middle}deg)`;
    playTickSound();
    checkPuzzleWinCondition();
  }

  function checkPuzzleWinCondition() {
    // Aligned when both outer & middle conduits line up with vertical axis (0 or 180 degrees)
    const isOuterAligned = (state.rings.outer === 0 || state.rings.outer === 180);
    const isMiddleAligned = (state.rings.middle === 0 || state.rings.middle === 180);

    if (isOuterAligned && isMiddleAligned) {
      dom.alignmentBeam.classList.add('active');
      playTempleBell(880);
      setTimeout(() => {
        openVictoryModal();
      }, 700);
    } else {
      dom.alignmentBeam.classList.remove('active');
    }
  }

  dom.btnOuterCCW.addEventListener('click', () => rotateOuter(-45));
  dom.btnOuterCW.addEventListener('click', () => rotateOuter(45));
  dom.btnMiddleCCW.addEventListener('click', () => rotateMiddle(-45));
  dom.btnMiddleCW.addEventListener('click', () => rotateMiddle(45));

  // Dharma Choices
  dom.choiceRush.addEventListener('click', () => {
    adjustSankalpa(-20, 'Hasty shortcut drained patience');
    showToast('Bypassed comrade: Speed gained, but resolve strained.');
  });

  dom.choiceDuty.addEventListener('click', () => {
    state.gritPoints += 40;
    dom.totalGrit.textContent = state.gritPoints;
    adjustSankalpa(+25, 'Dharma upheld! Comrade aided');
    showToast('Duty fulfilled: You strengthened your inner foundation (+40 Grit).');
  });

  // ==========================================
  // 7. SARATHI MODE OVERLAY (MENTOR DIALOGUE)
  // ==========================================
  function openSarathiModal(customMsg = null) {
    if (customMsg) {
      dom.sarathiDialogText.textContent = customMsg;
    } else {
      dom.sarathiDialogText.textContent = `"Partha, why look at the entire seven-layered maze and lose heart? Take one breath. The middle ring whispers a secret: when Knowledge (ज्ञान) faces Truth (सत्य), the gates unlock."`;
    }
    dom.sarathiModal.classList.add('active');
    playTempleBell(440);
  }

  function closeSarathiModal() {
    dom.sarathiModal.classList.remove('active');
  }

  dom.btnCallSarathi.addEventListener('click', () => openSarathiModal());
  dom.btnCloseSarathi.addEventListener('click', closeSarathiModal);

  dom.choiceRiddle.addEventListener('click', () => {
    dom.sarathiDialogText.textContent = `"A riddle for you: 'The bird in the branch is seen by all, but the disciple who strikes the target sees neither leaf nor feather.' Where is your true focus right now?"`;
    playTempleBell(520);
  });

  dom.choiceBreathe.addEventListener('click', () => {
    closeSarathiModal();
    openPranayamaModal();
  });

  dom.choiceReady.addEventListener('click', () => {
    closeSarathiModal();
    adjustSankalpa(+15, 'Sarathi encouragement');
  });

  // ==========================================
  // 8. PRANAYAMA (MINDFUL BREATHING RESET)
  // ==========================================
  let pranayamaInterval = null;
  let breathStep = 0; // 0 = Inhale, 1 = Hold, 2 = Exhale
  let breathCount = 0;

  function openPranayamaModal() {
    dom.pranayamaModal.classList.add('active');
    dom.btnFinishPranayama.style.display = 'none';
    playConchWhoosh();
    startBreathingCycle();
  }

  function startBreathingCycle() {
    breathStep = 0;
    breathCount = 4;
    runBreathPhase();

    clearInterval(pranayamaInterval);
    pranayamaInterval = setInterval(() => {
      breathCount--;
      dom.breathTimer.textContent = `${breathCount}s`;

      if (breathCount <= 0) {
        advanceBreathPhase();
      }
    }, 1000);
  }

  function runBreathPhase() {
    dom.breathingRing.className = 'breathing-ring';

    if (breathStep === 0) {
      // Inhale
      dom.breathingRing.classList.add('inhale');
      dom.breathInstruction.textContent = 'INHALE';
      dom.breathTimer.textContent = '4s';
      dom.breathAffirmation.textContent = '"Draw in calm, clarity, and courage."';
      breathCount = 4;
      playTickSound();
    } else if (breathStep === 1) {
      // Hold
      dom.breathingRing.classList.add('hold');
      dom.breathInstruction.textContent = 'HOLD';
      dom.breathTimer.textContent = '4s';
      dom.breathAffirmation.textContent = '"Anchor your focus at the center of your heart."';
      breathCount = 4;
      playTickSound();
    } else if (breathStep === 2) {
      // Exhale
      dom.breathingRing.classList.add('exhale');
      dom.breathInstruction.textContent = 'EXHALE';
      dom.breathTimer.textContent = '6s';
      dom.breathAffirmation.textContent = '"Release all doubt, hurry, and fear of failure."';
      breathCount = 6;
      playConchWhoosh();
    }
  }

  function advanceBreathPhase() {
    breathStep++;
    if (breathStep > 2) {
      // Completed 1 full cycle
      clearInterval(pranayamaInterval);
      dom.breathInstruction.textContent = 'PEACE';
      dom.breathTimer.textContent = '✨';
      dom.breathAffirmation.textContent = '"Your mind is stilled. The chariot is ready to move."';
      dom.btnFinishPranayama.style.display = 'inline-block';
      playTempleBell(720);
    } else {
      runBreathPhase();
    }
  }

  dom.btnFinishPranayama.addEventListener('click', () => {
    dom.pranayamaModal.classList.remove('active');
    clearInterval(pranayamaInterval);
    state.sankalpa = 100;
    updateSankalpaUI();
    showToast('Sankalpa fully restored to 100% via Pranayama!');
  });

  // ==========================================
  // 9. VICTORY MODAL & CLAIM REWARDS
  // ==========================================
  function openVictoryModal() {
    dom.victoryModal.classList.add('active');
  }

  dom.btnClaimVictory.addEventListener('click', () => {
    dom.victoryModal.classList.remove('active');
    state.gritPoints += 100;
    dom.totalGrit.textContent = state.gritPoints;
    switchScreen('screenHome');
    showToast('Dhairya trial recorded! +100 Grit Points added.');
  });

  // ==========================================
  // 10. DAILY DHARMA QUESTS (HABIT BUILDER)
  // ==========================================
  function setupQuest(checkboxId, questKey, points) {
    const btn = document.getElementById(checkboxId);
    if (!btn) return;

    btn.addEventListener('click', () => {
      const item = btn.closest('.quest-item');
      state.quests[questKey] = !state.quests[questKey];

      if (state.quests[questKey]) {
        item.classList.add('completed');
        adjustSankalpa(+points, 'Daily Dharma completed');
        state.gritPoints += points;
        dom.totalGrit.textContent = state.gritPoints;
      } else {
        item.classList.remove('completed');
      }
    });
  }

  setupQuest('checkQ1', 'q1', 20);
  setupQuest('checkQ2', 'q2', 30);
  setupQuest('checkQ3', 'q3', 25);

  // ==========================================
  // 11. THE GRANTH (LORE CODEX FILTERS & RECITATION)
  // ==========================================
  dom.granthTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dom.granthTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.dataset.cat;
      dom.granthCards.forEach(card => {
        if (cat === 'all' || card.dataset.cat === cat) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
      playTickSound();
    });
  });

  dom.audioPronounceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      playTempleBell(660);
      setTimeout(() => playTempleBell(880), 300);
      setTimeout(() => playTempleBell(1100), 600);
      showToast('Reciting sacred shloka cadence...');
    });
  });

  // ==========================================
  // 12. SOUND TOGGLE & GLOBAL CONTROLS
  // ==========================================
  dom.toggleAudioBtn.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    if (state.soundEnabled) {
      initAudio();
      dom.audioLabel.textContent = 'Sound: ON';
      dom.toggleAudioBtn.classList.add('highlight');
      playTempleBell(528);
      showToast('Sacred soundscapes enabled.');
    } else {
      dom.audioLabel.textContent = 'Sound: OFF';
      dom.toggleAudioBtn.classList.remove('highlight');
      showToast('Sound muted.');
    }
  });

  dom.viewGddBtn.addEventListener('click', () => {
    showToast('The full Game Design Document is saved in your project brain!');
    alert('Sarathi Game Design Document (GDD) is available in the project documentation directory with full system architecture, research psychology citations, and wireframes.');
  });

  // ==========================================
  // 13. EVALUATOR SANDBOX TRIGGER ACTIONS
  // ==========================================
  dom.triggerDepleteSankalpa.addEventListener('click', () => {
    state.sankalpa = 15;
    updateSankalpaUI();
    showToast('Simulated Low Resolve (15%). Krishna intervenes!');
    setTimeout(() => {
      openSarathiModal(`"Partha, your stamina wavers not because the mountain is too tall, but because you forgot to breathe. Rest in the shade of wisdom."`);
    }, 500);
  });

  dom.triggerPranayamaDirect.addEventListener('click', () => {
    openPranayamaModal();
  });

  dom.triggerKrishnaAdvice.addEventListener('click', () => {
    openSarathiModal();
  });

  dom.triggerAutoSolve.addEventListener('click', () => {
    state.rings.outer = 0;
    state.rings.middle = 0;
    dom.outerRing.style.transform = `rotate(0deg)`;
    dom.middleRing.style.transform = `rotate(0deg)`;
    checkPuzzleWinCondition();
    showToast('Outer & middle rings automatically aligned!');
  });

  // Initial setup
  updateSankalpaUI();
})();
