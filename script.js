const checkbox = document.getElementById("checkbox");

// SOUND EFFECTS HANDLER
const sfx = {
    shake: new Audio('sounds/shaking.mp3'),
    open: new Audio('sounds/open.mp3'),
    uncrample: new Audio('sounds/uncrample.mp3')
};

function playSfx(type, pitch = 1) {
    if (sfx[type]) {
        sfx[type].currentTime = 0;
        sfx[type].playbackRate = pitch; // Cambia il "pitch" (velocità/intonazione)
        sfx[type].play().catch(err => {
            console.log("Audio playback failed, possibly due to user interaction policy or missing file:", err);
            playSynthSfx(type);
        });
    }
}

function playSynthSfx(type) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        if (type === 'shake') {
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(100, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.2);
        } else if (type === 'open') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.3);
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.5);
        }
    } catch (e) {
        console.error("Web Audio API not supported", e);
    }
}

// Carica il tema salvato
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
    checkbox.checked = true;
}

checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
        document.documentElement.classList.add("dark-theme");
        document.body.classList.add("dark-theme");
        localStorage.setItem("theme", "dark");
    } else {
        document.documentElement.classList.remove("dark-theme");
        document.body.classList.remove("dark-theme");
        localStorage.setItem("theme", "light");
    }
});



// Logica per nascondere l'header allo scroll
let lastScrollTop = 0;
const header = document.getElementById("header");

window.addEventListener("scroll", () => {
    let scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scroll verso il basso - Nascondi header
        header.classList.add("nav-up");
    } else {
        // Scroll verso l'alto - Mostra header
        header.classList.remove("nav-up");
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, { passive: true });



// LOGICA MODAL CALENDARIO
const dayBoxes = document.querySelectorAll(".day-box");
const modal = document.getElementById("day-modal");
const closeModalBtn = document.getElementById("close-modal");
const modalBody = document.getElementById("modal-body");

if (dayBoxes.length > 0 && modal) {
    dayBoxes.forEach(box => {
        box.addEventListener("click", () => {
            const dayNumber = box.innerText;
            // Qui puoi personalizzare il contenuto del modal in base al giorno
            modalBody.innerHTML = `
                <div class="bloom-overlay"></div>
                <h2 id="modal-title">Giorno ${dayNumber}</h2>
                <div class="modal-gift-container" id="gift-container">
                    <div class="vibration-fx left"></div>
                    <div class="modal-gift-image" id="gift-image"></div>
                    <div class="vibration-fx right"></div>
                    <div class="gift-shadow" id="gift-shadow"></div>
                    <div class="cat-floor"></div>
                </div>
                <div id="gift-message-container">
                    <p id="modal-desc">Apri il regalo per scoprire il contenuto speciale!</p>
                    <button class="claim-btn" id="claim-button">Riscatta</button>
                </div>
            `;
            modal.classList.add("active");
            document.body.style.overflow = "hidden"; // Previene lo scroll della pagina

            // Gestione audio per l'animazione idle (jumpingGift)
            const giftImage = document.getElementById("gift-image");

            // Riproduce il suono al primo avvio (dopo il delay di 1s impostato nei CSS)
            setTimeout(() => {
                if (!giftImage.classList.contains('opened') && modal.classList.contains('active')) {
                    playSfx('shake', 1.2);
                }
            }, 1000);

            giftImage.addEventListener('animationiteration', (e) => {
                // Se l'animazione che è appena finita è quella di default (jumpingGift)
                // e il pacchetto non è ancora stato aperto
                if (e.animationName === 'jumpingGift' && !giftImage.classList.contains('opened')) {
                    playSfx('shake', 1.2);
                }
            });

            // Aggiungi listener per il pulsante "Riscatta"
            const claimBtn = document.getElementById("claim-button");
            const giftShadow = document.getElementById("gift-shadow");
            const bloomOverlay = document.querySelector(".bloom-overlay");
            const vibrationFx = document.querySelectorAll(".vibration-fx");

            claimBtn.addEventListener("click", () => {
                if (giftImage.classList.contains("opened") || claimBtn.getAttribute("disabled")) return;

                // Disabilita UI
                claimBtn.setAttribute("disabled", "true");
                claimBtn.style.opacity = "0.5";
                claimBtn.innerText = "Attendi...";

                // Funzione che avvia la sequenza finale
                const startFinalSequence = () => {
                    // Reset animazione e stato
                    giftImage.style.animation = "none";
                    giftImage.offsetHeight; // trigger reflow

                    // 1. Nascondi pulsante e messaggio iniziale
                    claimBtn.style.display = "none";
                    document.getElementById("modal-desc").style.opacity = "0";

                    // 2. Audio: Scuotimento finale
                    playSfx('shake', 1.2);

                    // 3. Avvia Animazione Scuotimento Finale (giftShake)
                    giftImage.classList.add("shaking");
                    giftImage.style.animation = "giftShake 0.6s ease-in-out forwards";

                    // Dopo lo scuotimento finale, parte il bianco
                    setTimeout(() => {
                        bloomOverlay.classList.add("active");
                        setTimeout(() => playSfx('open'), 200);

                        setTimeout(() => {
                            giftImage.classList.remove("shaking");
                            giftImage.style.animation = "none";
                            giftImage.classList.add("opened");
                            if (giftShadow) giftShadow.style.opacity = "1"; // MOSTRA il gatto solo ora, sotto la cartaccia
                            vibrationFx.forEach(fx => fx.style.display = "none");

                            document.getElementById("modal-title").innerText = "Un messaggio per te!";
                            const modalDesc = document.getElementById("modal-desc");
                            modalDesc.innerHTML = `<span class="gift-content-text show">Tocca il foglio per aprirlo...</span>`;
                            modalDesc.style.opacity = "1";
                            modalDesc.classList.add("show");

                            // Logica di apertura della carta
                            let paperState = 0; // 0: crample, 1: mid, 2: opened
                            giftImage.addEventListener("click", () => {
                                if (paperState === 0) {
                                    playSfx('uncrample', 1.1);
                                    if (giftShadow) giftShadow.classList.add("cat-exit");
                                    giftImage.classList.add("paper-mid");
                                    paperState = 1;
                                } else if (paperState === 1) {
                                    playSfx('uncrample', 0.9);
                                    giftImage.classList.add("paper-opened");
                                    modalDesc.innerHTML = `<span class="gift-content-text show">Hai ricevuto un bacio virtuale e una sorpresa speciale per il giorno ${dayNumber}!</span>`;
                                    paperState = 2;
                                }
                            });
                        }, 1200);
                    }, 600);
                };

                // LOGICA DI ATTESA:
                // Se il regalo è "in aria" o sta scuotendo nell'idle, attendiamo la fine del ciclo
                // L'animazione jumpingGift dura 3s, con il movimento concentrato all'inizio.
                // Usiamo un listener temporaneo per aspettare il prossimo 'animationiteration'

                const onAnimationFinish = (e) => {
                    if (e.animationName === 'jumpingGift') {
                        giftImage.removeEventListener('animationiteration', onAnimationFinish);
                        startFinalSequence();
                    }
                };

                // Controlliamo se è in pausa (tra i 0.7s e i 3s dell'animazione idle)
                // Se siamo nella fase statica, possiamo partire quasi subito, 
                // altrimenti aspettiamo il ciclo. Per semplicità e pulizia, aspettiamo sempre l'iteration.
                giftImage.addEventListener('animationiteration', onAnimationFinish);

                // Se per qualche motivo non triggherasse (es. browser lag), forziamo dopo max 3.1s
                setTimeout(() => {
                    giftImage.removeEventListener('animationiteration', onAnimationFinish);
                    if (!giftImage.classList.contains("opened") && claimBtn.style.display !== "none") {
                        startFinalSequence();
                    }
                }, 3100);
            });
        });
    });

    const closeModal = () => {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";

        // Ferma tutti i suoni quando il modal viene chiuso
        Object.values(sfx).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });

        // Pulisce il contenuto del modal per sicurezza
        setTimeout(() => {
            modalBody.innerHTML = "";
        }, 400);
    };

    closeModalBtn.addEventListener("click", closeModal);

    // Chiudi il modal cliccando fuori dal contenuto
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Chiudi con il tasto ESC
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            closeModal();
        }
    });
}



// LOGICA COUNTDOWN
function updateCountdown() {
    const now = new Date();
    const currentYear = 2026; // Fissiamo l'anno come da richiesta
    let targetDate;

    // Se siamo prima di Febbraio 1, il target è Febbraio 1
    if (now.getMonth() < 1 || (now.getMonth() === 1 && now.getDate() < 1)) {
        targetDate = new Date(currentYear, 1, 1); // 1 Febbraio (index 1)
    }
    // Se siamo tra l'1 e il 13 Febbraio, il target è il giorno successivo a mezzanotte
    else if (now.getMonth() === 1 && now.getDate() < 14) {
        targetDate = new Date(currentYear, 1, now.getDate() + 1);
    }
    // Se è il 14 Febbraio o dopo, San Valentino è passato o è oggi
    else {
        targetDate = new Date(currentYear, 1, 14); // Target finale 14 Febbraio
    }

    const diff = targetDate - now;

    if (diff <= 0) {
        document.getElementById("hours").innerText = "00";
        document.getElementById("minutes").innerText = "00";
        document.getElementById("seconds").innerText = "00";
        return;
    }

    // Calcoliamo le ore totali (includendo i giorni convertiti in ore)
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("hours").innerText = h.toString().padStart(2, '0');
    document.getElementById("minutes").innerText = m.toString().padStart(2, '0');
    document.getElementById("seconds").innerText = s.toString().padStart(2, '0');
}

if (document.getElementById("countdown")) {
    setInterval(updateCountdown, 1000);
    updateCountdown();
}
