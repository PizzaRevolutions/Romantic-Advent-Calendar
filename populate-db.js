/**
 * Script di popolamento Firebase - Valentine's Calendar
 * 
 * Eseguire UNA SOLA VOLTA per caricare i messaggi iniziali nel database.
 * 
 * Istruzioni:
 * 1. Installa firebase-admin: npm install firebase-admin
 * 2. Scarica la chiave di servizio dal Firebase Console:
 *    - Vai su Impostazioni progetto > Account di servizio
 *    - Genera nuova chiave privata
 *    - Salva il file come 'serviceAccountKey.json' nella stessa cartella
 * 3. Esegui: node populate-db.js
 * 
 * ALTERNATIVA (senza Node.js):
 * Puoi copiare il JSON qui sotto e importarlo direttamente dal Firebase Console:
 * Database > menu (tre puntini) > Importa JSON
 */

const admin = require('firebase-admin');

// Sostituisci con il percorso del tuo file di credenziali
const serviceAccount = require('./serviceAccountKey.json');

// Sostituisci con l'URL del tuo database (lo trovi nel Firebase Console)
const DATABASE_URL = 'https://TUO-PROGETTO.firebaseio.com';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: DATABASE_URL
});

const db = admin.database();

// Messaggi segnaposto per i 14 giorni
// PERSONALIZZA questi messaggi prima di eseguire lo script!
const letterine = {
    "1": {
        messaggio: "Giorno 1: Primo giorno del nostro countdown d'amore! 💕 Ogni giorno con te è un dono prezioso.",
        aperto: false
    },
    "2": {
        messaggio: "Giorno 2: Il tuo sorriso illumina le mie giornate più grigie. ☀️",
        aperto: false
    },
    "3": {
        messaggio: "Giorno 3: Grazie per essere sempre al mio fianco, sei la mia roccia. 🪨💝",
        aperto: false
    },
    "4": {
        messaggio: "Giorno 4: Ogni momento passato insieme diventa un ricordo indimenticabile. 📸",
        aperto: false
    },
    "5": {
        messaggio: "Giorno 5: Ti amo oggi più di ieri, ma meno di domani. 💗",
        aperto: false
    },
    "6": {
        messaggio: "Giorno 6: Sei la melodia che rende speciale la mia vita. 🎵",
        aperto: false
    },
    "7": {
        messaggio: "Giorno 7: Una settimana di conto alla rovescia! Il mio cuore batte solo per te. 💓",
        aperto: false
    },
    "8": {
        messaggio: "Giorno 8: Con te ogni giorno è un'avventura meravigliosa. 🌟",
        aperto: false
    },
    "9": {
        messaggio: "Giorno 9: Sei il mio pensiero preferito, la mia dolce follia. 🦋",
        aperto: false
    },
    "10": {
        messaggio: "Giorno 10: Il tuo abbraccio è il mio posto sicuro nel mondo. 🤗",
        aperto: false
    },
    "11": {
        messaggio: "Giorno 11: Mancano solo 3 giorni! L'attesa mi fa battere forte il cuore. 💘",
        aperto: false
    },
    "12": {
        messaggio: "Giorno 12: Sei la persona più speciale che abbia mai incontrato. ✨",
        aperto: false
    },
    "13": {
        messaggio: "Giorno 13: Domani è il grande giorno! Non vedo l'ora di festeggiare con te. 🎉",
        aperto: false
    },
    "14": {
        messaggio: "Buon San Valentino, amore mio! 💝🌹 Sei tutto per me. Ti amo infinitamente! 💕",
        aperto: false
    }
};

// Carica i dati nel database
async function popolaDatabase() {
    try {
        console.log('Caricamento dati in corso...');
        await db.ref('letterine').set(letterine);
        console.log('✅ Database popolato con successo!');
        console.log('📝 Struttura caricata:');
        console.log(JSON.stringify(letterine, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('❌ Errore durante il caricamento:', error);
        process.exit(1);
    }
}

popolaDatabase();

/*
 * ALTERNATIVA: Copia questo JSON e importalo direttamente nel Firebase Console
 * 
{
  "letterine": {
    "1": { "messaggio": "Giorno 1: Primo giorno del nostro countdown d'amore! 💕", "aperto": false },
    "2": { "messaggio": "Giorno 2: Il tuo sorriso illumina le mie giornate più grigie. ☀️", "aperto": false },
    "3": { "messaggio": "Giorno 3: Grazie per essere sempre al mio fianco, sei la mia roccia. 🪨💝", "aperto": false },
    "4": { "messaggio": "Giorno 4: Ogni momento passato insieme diventa un ricordo indimenticabile. 📸", "aperto": false },
    "5": { "messaggio": "Giorno 5: Ti amo oggi più di ieri, ma meno di domani. 💗", "aperto": false },
    "6": { "messaggio": "Giorno 6: Sei la melodia che rende speciale la mia vita. 🎵", "aperto": false },
    "7": { "messaggio": "Giorno 7: Una settimana di conto alla rovescia! 💓", "aperto": false },
    "8": { "messaggio": "Giorno 8: Con te ogni giorno è un'avventura meravigliosa. 🌟", "aperto": false },
    "9": { "messaggio": "Giorno 9: Sei il mio pensiero preferito, la mia dolce follia. 🦋", "aperto": false },
    "10": { "messaggio": "Giorno 10: Il tuo abbraccio è il mio posto sicuro nel mondo. 🤗", "aperto": false },
    "11": { "messaggio": "Giorno 11: Mancano solo 3 giorni! L'attesa mi fa battere forte il cuore. 💘", "aperto": false },
    "12": { "messaggio": "Giorno 12: Sei la persona più speciale che abbia mai incontrato. ✨", "aperto": false },
    "13": { "messaggio": "Giorno 13: Domani è il grande giorno! Non vedo l'ora di festeggiare con te. 🎉", "aperto": false },
    "14": { "messaggio": "Buon San Valentino, amore mio! 💝🌹 Ti amo infinitamente! 💕", "aperto": false }
  }
}
*/
