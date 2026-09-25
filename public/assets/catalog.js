// Catalogo condiviso tra pannello e invito: temi, font, colori, blocchi, audio, lingue
window.INV = {
  themes: [
    { id: 'amalfi', name: 'Terrazza di Amalfi', desc: 'Un arco fiorito sulla Costiera, al tramonto', video: '/media/themes/amalfi.mp4', poster: '/media/themes/amalfi.jpg', popular: true },
    { id: 'como', name: 'Villa sul Lago', desc: 'Viale di cipressi verso una villa sul Lago di Como', video: '/media/themes/como.mp4', poster: '/media/themes/como.jpg', popular: false },
    { id: 'toscana', name: 'Castello in Toscana', desc: 'Vigneti e cipressi al tramonto in Val d\'Orcia', video: '/media/themes/toscana.mp4', poster: '/media/themes/toscana.jpg', popular: true },
    { id: 'glicine', name: 'Pergola di glicine', desc: 'Un giardino in fiore con rose bianche e fontana', video: '/media/themes/glicine.mp4', poster: '/media/themes/glicine.jpg', popular: false },
    { id: 'puglia', name: 'Masseria in Puglia', desc: 'Ulivi secolari e luminarie accese sotto le stelle', video: '/media/themes/puglia.mp4', poster: '/media/themes/puglia.jpg', popular: false },
    { id: 'mare', name: 'Altare sul mare', desc: 'Arco di rose bianche sulla spiaggia al tramonto', video: '/media/themes/mare.mp4', poster: '/media/themes/mare.jpg', popular: true },
    { id: 'venezia', name: 'Palazzo a Venezia', desc: 'Il Canal Grande all\'ora blu, tra lanterne e gondole', video: '/media/themes/venezia.mp4', poster: '/media/themes/venezia.jpg', popular: false },
    { id: 'serra', name: 'Serra di cristallo', desc: 'Centinaia di candele e ortensie in una serra di vetro', video: '/media/themes/serra.mp4', poster: '/media/themes/serra.jpg', popular: false },
    { id: 'dolomiti', name: 'Chalet nelle Dolomiti', desc: 'Prato fiorito e vette rosate al tramonto', video: '/media/themes/dolomiti.mp4', poster: '/media/themes/dolomiti.jpg', popular: false },
    { id: 'inverno', name: 'Inverno incantato', desc: 'Bosco innevato illuminato da lanterne e candele', video: '/media/themes/inverno.mp4', poster: '/media/themes/inverno.jpg', popular: false },
    { id: 'parigi', name: 'Balcone a Parigi', desc: 'Rose sul balcone e la Tour Eiffel all\'imbrunire', video: '/media/themes/parigi.mp4', poster: '/media/themes/parigi.jpg', popular: true },
    { id: 'santorini', name: 'Cupole di Santorini', desc: 'Chiesa bianca e blu tra bouganville e mare Egeo', video: '/media/themes/santorini.mp4', poster: '/media/themes/santorini.jpg', popular: true },
    { id: 'lavanda', name: 'Lavanda in Provenza', desc: 'Campi viola e un arco di legno fiorito', video: '/media/themes/lavanda.mp4', poster: '/media/themes/lavanda.jpg', popular: false },
    { id: 'marrakech', name: 'Riad a Marrakech', desc: 'Lanterne, zellige e petali sulla fontana', video: '/media/themes/marrakech.mp4', poster: '/media/themes/marrakech.jpg', popular: false },
    { id: 'bosco', name: 'Bosco fatato', desc: 'Lucine sospese e candele tra alberi secolari', video: '/media/themes/bosco.mp4', poster: '/media/themes/bosco.jpg', popular: false },
    { id: 'roma', name: 'Terrazza su Roma', desc: 'Limoni e la cupola di San Pietro al tramonto', video: '/media/themes/roma.mp4', poster: '/media/themes/roma.jpg', popular: false },
    { id: 'ciliegi', name: 'Giardino dei ciliegi', desc: 'Ciliegi in fiore, ponticello e laghetto', video: '/media/themes/ciliegi.mp4', poster: '/media/themes/ciliegi.jpg', popular: false },
    { id: 'reggia', name: 'Salone della Reggia', desc: 'Lampadari di cristallo e stucchi dorati', video: '/media/themes/reggia.mp4', poster: '/media/themes/reggia.jpg', popular: false },
  ],

  fonts: ['Playfair Display', 'Cormorant Garamond', 'Great Vibes', 'Dancing Script', 'Lora', 'Cinzel', 'Alex Brush', 'Libre Baskerville',
    'Merriweather', 'Raleway', 'Abril Fatface', 'Bebas Neue', 'Oswald', 'Righteous', 'Passion One', 'Bodoni Moda', 'Cinzel Decorative',
    'Yeseva One', 'Parisienne', 'Italiana', 'Pinyon Script', 'Tangerine', 'Josefin Sans', 'Montserrat'],

  colors: [
    { id: '#1c1c1c', name: 'Nero classico' }, { id: '#5a4636', name: 'Marrone classico' }, { id: '#a8864f', name: 'Oro elegante' },
    { id: '#7a2331', name: 'Bordeaux' }, { id: '#1f3a60', name: 'Blu notte' }, { id: '#2f4f3a', name: 'Verde bosco' },
    { id: '#3b4148', name: 'Antracite' }, { id: '#b76e79', name: 'Oro rosa' }, { id: '#ffffff', name: 'Bianco puro' }, { id: '#f4ecd8', name: 'Crema' },
  ],

  accents: ['', '#6b7a3a', '#5e9e7a', '#2f5d4a', '#d88a98', '#c0566a', '#7a2331', '#e0824a', '#5aa9d6', '#4a7fb5', '#1f3a60', '#a58bd6', '#d4a82a', '#c8643a', '#3b4148'],

  envelopeColors: [
    { id: 'bianco', name: 'Bianco', hex: '#fbfaf7' }, { id: 'crema', name: 'Crema', hex: '#f3ead9' }, { id: 'cipria', name: 'Rosa cipria', hex: '#f2c9c9' },
    { id: 'salvia', name: 'Verde salvia', hex: '#b9c7a8' }, { id: 'notte', name: 'Blu notte', hex: '#27365c' }, { id: 'nero', name: 'Nero', hex: '#1d1d1f' },
    { id: 'celeste', name: 'Celeste', hex: '#9fcfee' }, { id: 'reale', name: 'Blu reale', hex: '#3f63d8' },
  ],

  // Aperture busta già pronte: foto della busta chiusa + video dell'apertura (Higgsfield)
  envelopeTemplates: [
    { id: 'ricamo', name: 'Ricamo di fiori', desc: 'Carta avorio con fiori ricamati e sigillo cipria', poster: '/media/envelopes/ricamo.jpg', video: '/media/envelopes/ricamo.mp4', popular: true },
    { id: 'salvia', name: 'Salvia ed eucalipto', desc: 'Carta verde salvia, eucalipto e sigillo oro', poster: '/media/envelopes/salvia.jpg', video: '/media/envelopes/salvia.mp4' },
    { id: 'notte', name: 'Notte stellata', desc: 'Blu notte con stelle in foglia oro', poster: '/media/envelopes/notte.jpg', video: '/media/envelopes/notte.mp4' },
    { id: 'amalfi', name: 'Limoni di Amalfi', desc: 'Acquerello di limoni e maioliche, sigillo bordeaux', poster: '/media/envelopes/amalfi.jpg', video: '/media/envelopes/amalfi.mp4' },
  ],

  // busta personalizzata: foto reale di una busta bianca senza sigillo, colorata dal codice.
  // tipX/tipY = punta del lembo nella foto originale (in %), dove va il sigillo
  customEnvelopes: {
    ceralacca: { poster: '/media/envelopes/custom/liscia.jpg', video: '/media/envelopes/custom/liscia.mp4', tipX: 51, tipY: 60 },
    floreale: { poster: '/media/envelopes/custom/floreale.jpg', video: '/media/envelopes/custom/floreale.mp4', tipX: 51, tipY: 65.8 },
  },

  seals: [
    { id: 'rosso', name: 'Rosso classico', img: '/media/seals/rosso.png', ink: '#3f070d' },
    { id: 'crema', name: 'Crema elegante', img: '/media/seals/crema.png', ink: '#7d6a48' },
    { id: 'rosa', name: 'Rosa cipria', img: '/media/seals/rosa.png', ink: '#9a4d5a' },
  ],

  flowers: [
    { id: 'none', name: 'Nessuno' },
    { id: 'classico', name: 'Classico', img: '/media/flowers/classico.jpg' },
    { id: 'gigli-rose', name: 'Gigli e rose', img: '/media/flowers/gigli-rose.jpg' },
  ],

  tracks: [
    { id: 'dolce-piano', name: 'Dolce Piano', desc: 'Melodia romantica al pianoforte', src: '/media/music/dolce-piano.mp3' },
    { id: 'archi-lago', name: 'Archi sul Lago', desc: 'Quartetto d\'archi elegante', src: '/media/music/archi-lago.mp3' },
    { id: 'chitarra-tramonto', name: 'Chitarra al Tramonto', desc: 'Ballata acustica mediterranea', src: '/media/music/chitarra-tramonto.mp3' },
  ],

  // Tipi di blocco disponibili (icona = /media/icons/icon-blk-*.png)
  blockTypes: {
    countdown: { name: 'Conto alla rovescia', icon: 'countdown', def: () => ({ title: 'Conto alla rovescia', subtitle: 'Non vediamo l\'ora di festeggiare con voi', image: '', darken: true, darkness: 45 }) },
    venue: { name: 'Luogo', icon: 'venue', def: () => ({ title: 'Il luogo', days: [{ label: 'Giorno 1', name: '', address: '', maps: '', image: '' }] }) },
    destination: { name: 'Destinazione', icon: 'destination', def: () => ({ title: 'La destinazione', place: 'Costiera Amalfitana', text: 'Vi aspettiamo in uno dei luoghi più belli d\'Italia.', image: '', tips: 'Aeroporto più vicino: Napoli Capodichino (1 h 30 min)' }) },
    drawing: { name: 'Disegno', icon: 'text', def: () => ({ image: '', caption: '' }) },
    timeline: { name: 'Programma', icon: 'timeline', def: () => ({ title: 'Programma della giornata', items: [{ time: '16:00', title: 'Cerimonia', text: '' }] }) },
    story: { name: 'La nostra storia', icon: 'story', def: () => ({ title: 'La nostra storia', intro: 'Da quel primo sguardo fino al sì: ecco come è andata.', showWedding: true, weddingTitle: 'Il grande giorno', weddingText: 'E adesso vogliamo festeggiarlo con voi.', items: [
      { date: '2019-05-12', title: 'Il primo incontro', text: 'Una sera d\'estate, amici in comune e una chiacchierata che non finiva più.', image: '' },
      { date: '2021-08-20', title: 'Il primo viaggio insieme', text: 'Zaino in spalla e tanta voglia di scoprire il mondo, insieme.', image: '' },
      { date: '2026-02-14', title: 'La proposta', text: 'Un anello, una domanda e il sì più bello della nostra vita.', image: '' },
    ] }) },
    gallery: { name: 'Galleria', icon: 'gallery', def: () => ({ title: 'I nostri momenti', images: [] }) },
    dress: { name: 'Dress code', icon: 'dress', def: () => ({ title: 'Dress code', text: '', colors: ['#e9dcc4', '#b7c7a4'] }) },
    menu: { name: 'Menù', icon: 'menu', def: () => ({ title: 'Il menù', courses: [{ name: 'Antipasto', dish: '' }, { name: 'Primo', dish: '' }, { name: 'Secondo', dish: '' }, { name: 'Dolce', dish: '' }] }) },
    gift: { name: 'Lista nozze', icon: 'gift', def: () => ({ title: 'Lista nozze', text: '', iban: '', holder: '', link: '' }) },
    hotel: { name: 'Hotel consigliati', icon: 'hotel', def: () => ({ title: 'Dove dormire', items: [{ name: '', address: '', link: '', note: '' }] }) },
    transport: { name: 'Trasporti', icon: 'transport', def: () => ({ title: 'Come arrivare', items: [{ mode: 'Navetta', text: '' }] }) },
    boarding: { name: 'Carta d\'imbarco', icon: 'boarding', def: () => ({ title: 'Il vostro volo per l\'amore', from: 'Milano', fromCode: 'MXP', to: 'Napoli', toCode: 'NAP', flight: 'GM 1906', gate: 'A1', seat: '1A' }) },
    todo: { name: 'Cose da sapere', icon: 'todo', def: () => ({ title: 'Cose da sapere', items: ['Portate un foulard per la sera', 'Non dimenticate il costume!'] }) },
    faq: { name: 'Domande frequenti', icon: 'faq', def: () => ({ title: 'Domande frequenti', items: [{ q: '', a: '' }] }) },
    text: { name: 'Testo libero', icon: 'text', def: () => ({ title: '', text: '' }) },
  },

  diets: [
    { id: 'glutine', it: 'Senza glutine / celiachia' }, { id: 'lattosio', it: 'Senza lattosio' }, { id: 'vegetariano', it: 'Vegetariano' },
    { id: 'vegano', it: 'Vegano' }, { id: 'frutta_secca', it: 'Allergia frutta secca' }, { id: 'pesce', it: 'Allergia pesce e frutti di mare' },
  ],

  countryCodes: ['+39', '+41', '+33', '+49', '+34', '+44', '+1', '+32', '+31', '+43', '+351', '+30', '+20', '+971', '+378'],

  // tutte le lingue disponibili: name = nome nativo, it = nome in italiano (le traduzioni oltre alle prime 5 stanno in assets/i18n/<id>.json)
  languages: [
    { id: 'it', name: 'Italiano', it: 'Italiano' },
    { id: 'en', name: 'English', it: 'Inglese' },
    { id: 'es', name: 'Español', it: 'Spagnolo' },
    { id: 'fr', name: 'Français', it: 'Francese' },
    { id: 'de', name: 'Deutsch', it: 'Tedesco' },
    { id: 'pt', name: 'Português', it: 'Portoghese' },
    { id: 'nl', name: 'Nederlands', it: 'Olandese' },
    { id: 'pl', name: 'Polski', it: 'Polacco' },
    { id: 'ro', name: 'Română', it: 'Rumeno' },
    { id: 'el', name: 'Ελληνικά', it: 'Greco' },
    { id: 'sv', name: 'Svenska', it: 'Svedese' },
    { id: 'nb', name: 'Norsk', it: 'Norvegese' },
    { id: 'da', name: 'Dansk', it: 'Danese' },
    { id: 'fi', name: 'Suomi', it: 'Finlandese' },
    { id: 'cs', name: 'Čeština', it: 'Ceco' },
    { id: 'sk', name: 'Slovenčina', it: 'Slovacco' },
    { id: 'hu', name: 'Magyar', it: 'Ungherese' },
    { id: 'hr', name: 'Hrvatski', it: 'Croato' },
    { id: 'sr', name: 'Srpski', it: 'Serbo' },
    { id: 'sl', name: 'Slovenščina', it: 'Sloveno' },
    { id: 'bg', name: 'Български', it: 'Bulgaro' },
    { id: 'mk', name: 'Македонски', it: 'Macedone' },
    { id: 'sq', name: 'Shqip', it: 'Albanese' },
    { id: 'uk', name: 'Українська', it: 'Ucraino' },
    { id: 'ru', name: 'Русский', it: 'Russo' },
    { id: 'lt', name: 'Lietuvių', it: 'Lituano' },
    { id: 'lv', name: 'Latviešu', it: 'Lettone' },
    { id: 'et', name: 'Eesti', it: 'Estone' },
    { id: 'tr', name: 'Türkçe', it: 'Turco' },
    { id: 'ar', name: 'العربية', it: 'Arabo' },
    { id: 'he', name: 'עברית', it: 'Ebraico' },
    { id: 'fa', name: 'فارسی', it: 'Persiano' },
    { id: 'ur', name: 'اردو', it: 'Urdu' },
    { id: 'hi', name: 'हिन्दी', it: 'Hindi' },
    { id: 'bn', name: 'বাংলা', it: 'Bengalese' },
    { id: 'pa', name: 'ਪੰਜਾਬੀ', it: 'Punjabi' },
    { id: 'ta', name: 'தமிழ்', it: 'Tamil' },
    { id: 'ne', name: 'नेपाली', it: 'Nepalese' },
    { id: 'zh', name: '中文（简体）', it: 'Cinese semplificato' },
    { id: 'zh-TW', name: '中文（繁體）', it: 'Cinese tradizionale' },
    { id: 'ja', name: '日本語', it: 'Giapponese' },
    { id: 'ko', name: '한국어', it: 'Coreano' },
    { id: 'th', name: 'ไทย', it: 'Thailandese' },
    { id: 'vi', name: 'Tiếng Việt', it: 'Vietnamita' },
    { id: 'id', name: 'Bahasa Indonesia', it: 'Indonesiano' },
    { id: 'ms', name: 'Bahasa Melayu', it: 'Malese' },
    { id: 'tl', name: 'Filipino', it: 'Filippino' },
    { id: 'ka', name: 'ქართული', it: 'Georgiano' },
    { id: 'hy', name: 'Հայերեն', it: 'Armeno' },
    { id: 'az', name: 'Azərbaycan', it: 'Azero' },
    { id: 'sw', name: 'Kiswahili', it: 'Swahili' },
    { id: 'am', name: 'አማርኛ', it: 'Amarico' },
    { id: 'af', name: 'Afrikaans', it: 'Afrikaans' },
    { id: 'ca', name: 'Català', it: 'Catalano' },
    { id: 'is', name: 'Íslenska', it: 'Islandese' },
    { id: 'ga', name: 'Gaeilge', it: 'Irlandese' },
    { id: 'mt', name: 'Malti', it: 'Maltese' },
  ],
  rtl: ['ar', 'he', 'fa', 'ur'],

  // Testi fissi dell'invito tradotti (i testi scritti dalla coppia restano come sono)
  i18n: {
    it: { giftOnline: 'Lista nozze online', book: 'Prenota', day: 'Giorno', yesShort: 'Sì', noShort: 'No', chooseLang: 'Scegli la lingua', contactHelp: 'Inserisci almeno email o telefono', tap: 'Tocca per aprire', scroll: 'Scorri', days: 'Giorni', hours: 'Ore', minutes: 'Minuti', seconds: 'Secondi', directions: 'Indicazioni', openMaps: 'Apri in Google Maps',
      rsvp: 'Conferma la tua presenza', replyBy: 'Rispondi entro il', name: 'Nome e cognome', email: 'Email', phone: 'Telefono', attend: 'Parteciperai?', yes: 'Sì, ci sarò', no: 'Purtroppo non posso',
      guestsN: 'Quante persone siete?', guest: 'Ospite', guestName: 'Nome ospite', diets: 'Allergie e intolleranze', dietsHelp: 'Per noi è importante saperlo: seleziona tutto ciò che vale.',
      other: 'Altre allergie o esigenze', otherPh: 'es. allergia alle uova', message: 'Un messaggio per gli sposi', messagePh: 'Scrivi qualche parola...', song: 'Una canzone che non può mancare',
      songPh: 'Titolo e artista', send: 'Invia risposta', sending: 'Invio...', thanksYes: 'Grazie! Non vediamo l\'ora di festeggiare con te.', thanksNo: 'Grazie per averci avvisato, ci mancherai.',
      optional: 'facoltativo', required: 'Campo obbligatorio', holder: 'Intestatario', copy: 'Copia', copied: 'Copiato', flight: 'Volo', gate: 'Gate', seat: 'Posto', boarding: 'Carta d\'imbarco',
      madeWith: 'Creato con Invitelle', change: 'Modifica risposta', select: 'Seleziona...' },
    en: { giftOnline: 'Online registry', book: 'Book', day: 'Day', yesShort: 'Yes', noShort: 'No', chooseLang: 'Choose language', contactHelp: 'Enter at least email or phone', tap: 'Tap to open', scroll: 'Scroll', days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds', directions: 'Directions', openMaps: 'Open in Google Maps',
      rsvp: 'Kindly RSVP', replyBy: 'Please reply by', name: 'Full name', email: 'Email', phone: 'Phone', attend: 'Will you attend?', yes: 'Yes, I will attend', no: 'Sorry, I can\'t',
      guestsN: 'How many of you?', guest: 'Guest', guestName: 'Guest name', diets: 'Allergies and intolerances', dietsHelp: 'It matters to us: select all that apply.',
      other: 'Other allergies or needs', otherPh: 'e.g. egg allergy', message: 'A message for the couple', messagePh: 'Write a few words...', song: 'A song that must be played',
      songPh: 'Title and artist', send: 'Send reply', sending: 'Sending...', thanksYes: 'Thank you! We can\'t wait to celebrate with you.', thanksNo: 'Thank you for letting us know, we\'ll miss you.',
      optional: 'optional', required: 'Required field', holder: 'Account holder', copy: 'Copy', copied: 'Copied', flight: 'Flight', gate: 'Gate', seat: 'Seat', boarding: 'Boarding pass',
      madeWith: 'Made with Invitelle', change: 'Change reply', select: 'Select...' },
    es: { giftOnline: 'Lista de bodas online', book: 'Reservar', day: 'Día', yesShort: 'Sí', noShort: 'No', chooseLang: 'Elige el idioma', contactHelp: 'Indica al menos email o teléfono', tap: 'Toca para abrir', scroll: 'Desliza', days: 'Días', hours: 'Horas', minutes: 'Minutos', seconds: 'Segundos', directions: 'Cómo llegar', openMaps: 'Abrir en Google Maps',
      rsvp: 'Confirma tu asistencia', replyBy: 'Responde antes del', name: 'Nombre y apellido', email: 'Email', phone: 'Teléfono', attend: '¿Asistirás?', yes: 'Sí, allí estaré', no: 'Lo siento, no puedo',
      guestsN: '¿Cuántos sois?', guest: 'Invitado', guestName: 'Nombre del invitado', diets: 'Alergias e intolerancias', dietsHelp: 'Es importante para nosotros: marca todo lo que corresponda.',
      other: 'Otras alergias o necesidades', otherPh: 'p. ej. alergia al huevo', message: 'Un mensaje para los novios', messagePh: 'Escribe unas palabras...', song: 'Una canción que no puede faltar',
      songPh: 'Título y artista', send: 'Enviar respuesta', sending: 'Enviando...', thanksYes: '¡Gracias! Estamos deseando celebrarlo contigo.', thanksNo: 'Gracias por avisarnos, te echaremos de menos.',
      optional: 'opcional', required: 'Campo obligatorio', holder: 'Titular', copy: 'Copiar', copied: 'Copiado', flight: 'Vuelo', gate: 'Puerta', seat: 'Asiento', boarding: 'Tarjeta de embarque',
      madeWith: 'Creado con Invitelle', change: 'Cambiar respuesta', select: 'Selecciona...' },
    fr: { giftOnline: 'Liste de mariage en ligne', book: 'Réserver', day: 'Jour', yesShort: 'Oui', noShort: 'Non', chooseLang: 'Choisir la langue', contactHelp: 'Indiquez au moins un email ou un téléphone', tap: 'Touchez pour ouvrir', scroll: 'Faites défiler', days: 'Jours', hours: 'Heures', minutes: 'Minutes', seconds: 'Secondes', directions: 'Itinéraire', openMaps: 'Ouvrir dans Google Maps',
      rsvp: 'Confirmez votre présence', replyBy: 'Merci de répondre avant le', name: 'Nom et prénom', email: 'Email', phone: 'Téléphone', attend: 'Serez-vous présent ?', yes: 'Oui, je serai là', no: 'Désolé, je ne peux pas',
      guestsN: 'Combien êtes-vous ?', guest: 'Invité', guestName: 'Nom de l\'invité', diets: 'Allergies et intolérances', dietsHelp: 'C\'est important pour nous : cochez tout ce qui s\'applique.',
      other: 'Autres allergies ou besoins', otherPh: 'ex. allergie aux œufs', message: 'Un message pour les mariés', messagePh: 'Écrivez quelques mots...', song: 'Une chanson incontournable',
      songPh: 'Titre et artiste', send: 'Envoyer', sending: 'Envoi...', thanksYes: 'Merci ! Nous avons hâte de fêter ça avec vous.', thanksNo: 'Merci de nous avoir prévenus, vous nous manquerez.',
      optional: 'facultatif', required: 'Champ obligatoire', holder: 'Titulaire', copy: 'Copier', copied: 'Copié', flight: 'Vol', gate: 'Porte', seat: 'Siège', boarding: 'Carte d\'embarquement',
      madeWith: 'Créé avec Invitelle', change: 'Modifier la réponse', select: 'Choisir...' },
    de: { giftOnline: 'Online-Hochzeitsliste', book: 'Buchen', day: 'Tag', yesShort: 'Ja', noShort: 'Nein', chooseLang: 'Sprache wählen', contactHelp: 'Mindestens E-Mail oder Telefon angeben', tap: 'Zum Öffnen tippen', scroll: 'Scrollen', days: 'Tage', hours: 'Stunden', minutes: 'Minuten', seconds: 'Sekunden', directions: 'Anfahrt', openMaps: 'In Google Maps öffnen',
      rsvp: 'Bitte um Rückmeldung', replyBy: 'Bitte antwortet bis', name: 'Vor- und Nachname', email: 'E-Mail', phone: 'Telefon', attend: 'Bist du dabei?', yes: 'Ja, ich komme', no: 'Leider nicht',
      guestsN: 'Wie viele seid ihr?', guest: 'Gast', guestName: 'Name des Gastes', diets: 'Allergien und Unverträglichkeiten', dietsHelp: 'Das ist uns wichtig: alles Zutreffende auswählen.',
      other: 'Weitere Allergien oder Wünsche', otherPh: 'z. B. Eierallergie', message: 'Eine Nachricht an das Brautpaar', messagePh: 'Schreib ein paar Worte...', song: 'Ein Lied, das nicht fehlen darf',
      songPh: 'Titel und Interpret', send: 'Antwort senden', sending: 'Senden...', thanksYes: 'Danke! Wir freuen uns darauf, mit dir zu feiern.', thanksNo: 'Danke für die Nachricht, du wirst uns fehlen.',
      optional: 'optional', required: 'Pflichtfeld', holder: 'Kontoinhaber', copy: 'Kopieren', copied: 'Kopiert', flight: 'Flug', gate: 'Gate', seat: 'Sitz', boarding: 'Bordkarte',
      madeWith: 'Erstellt mit Invitelle', change: 'Antwort ändern', select: 'Auswählen...' },
  },
  dietNames: {
    en: { glutine: 'Gluten-free / coeliac', lattosio: 'Lactose-free', vegetariano: 'Vegetarian', vegano: 'Vegan', frutta_secca: 'Nut allergy', pesce: 'Seafood allergy' },
    es: { glutine: 'Sin gluten / celiaquía', lattosio: 'Sin lactosa', vegetariano: 'Vegetariano', vegano: 'Vegano', frutta_secca: 'Alergia a frutos secos', pesce: 'Alergia al marisco' },
    fr: { glutine: 'Sans gluten / cœliaque', lattosio: 'Sans lactose', vegetariano: 'Végétarien', vegano: 'Végan', frutta_secca: 'Allergie aux noix', pesce: 'Allergie aux fruits de mer' },
    de: { glutine: 'Glutenfrei / Zöliakie', lattosio: 'Laktosefrei', vegetariano: 'Vegetarisch', vegano: 'Vegan', frutta_secca: 'Nussallergie', pesce: 'Meeresfrüchteallergie' },
  },
  months: {
    it: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    fr: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
    de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  },
};

// sigillo in un colore qualsiasi: ceralacca avorio tinta con il colore scelto
INV.sealStyle = (e) => {
  const custom = e.seal === 'custom' && /^#[0-9a-f]{6}$/i.test(e.sealColor || '');
  const base = INV.seals.find(s => s.id === (custom ? 'crema' : e.seal)) || INV.seals[0];
  if (!custom) return { img: base.img, ink: base.ink, tint: '' };
  const n = parseInt(e.sealColor.slice(1), 16), d = v => Math.round(v * .45).toString(16).padStart(2, '0');
  return { img: base.img, ink: '#' + d(n >> 16) + d(n >> 8 & 255) + d(n & 255), tint: e.sealColor };
};

// carica al volo le traduzioni di una lingua (file JSON in assets/i18n)
INV.loadLang = async (code) => {
  if (!code || INV.i18n[code]) return;
  try {
    const d = await fetch(`/assets/i18n/${code}.json`).then(r => r.ok ? r.json() : null);
    if (d) { INV.i18n[code] = d.strings; INV.dietNames[code] = d.diets; }
  } catch (e) {}
};
INV.loadLangs = (codes) => Promise.all([...new Set(codes)].map(INV.loadLang));

INV.fontUrl = (fams) => 'https://fonts.googleapis.com/css2?' + [...new Set(fams)].filter(Boolean)
  .map(f => 'family=' + f.replace(/ /g, '+')).join('&') + '&display=swap';

INV.loadFonts = (fams) => {
  const id = 'inv-fonts-' + [...new Set(fams)].sort().join('|');
  if (document.querySelector(`link[data-f="${CSS.escape(id)}"]`)) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet'; l.href = INV.fontUrl(fams); l.dataset.f = id;
  document.head.appendChild(l);
};
