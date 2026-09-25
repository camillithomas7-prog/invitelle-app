# Invitelle — pannello creazione inviti

Avvio locale: `./start.sh` (porta 8486). Online su Hostinger: le rotte sono in `.htaccess`, dati in `data/` e caricamenti in `public/uploads/` (non nel repo). Accessi come il pannello corsi 3D WEB LAB: `/admin` = admin (email+password creati al primo accesso), genera i codici `INV-XXXX-XXXX` per ogni cliente; il cliente entra su `/` con il solo codice e vede solo il suo invito.

- `/` I miei inviti · `/editor?id=N` pannello · `/i/{slug}` invito pubblico (`?g=token` link personale ospite)
- `lib/db.php` SQLite (`data/invitelle.sqlite`) + invito di default
- `public/api.php` salvataggio, ospiti, RSVP, CSV, upload
- `public/assets/catalog.js` temi, font, sigilli, blocchi, lingue (condiviso)
- `public/assets/invite.js` motore dell'invito (busta, intro video, blocchi, RSVP) usato anche dall'anteprima live
- `public/assets/editor.js` pannello a 9 tab
- `public/media/` video temi, sigilli, fiori, musiche (generati con Higgsfield), icone blocchi
- `gen.sh` genera un asset con Higgsfield: `./gen.sh out.png gpt_image_2 --prompt "..."`
