#!/usr/bin/env python3
# Dati completi dell'invito demo "Stefania & Angelo" (tutti i blocchi compilati, foto in /media/demo).
# uso: python3 tools/demo-invite.py > demo.json
import json, random, string
uid = lambda n=8: ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(n))
M = '/media/demo/'
def b(t, data, accent='', icon=1): return {'id': uid(), 'type': t, 'visible': True, 'accent': accent, 'icon': icon, 'data': data}
D = {
  'theme': 'mare',
  'fx': {'motion': 'cinema', 'particles': 'cuori', 'amount': 'medium', 'body': 'stelle', 'bodyAmount': 'light', 'scratch': True, 'toast': True},
  'envelope': {'mode': 'template', 'template': 'riviera', 'initials': 'S & A', 'style': 'ceralacca', 'color': 'crema', 'seal': 'rosso'},
  'details': {'date': '2027-06-19', 'endDate': '', 'dateSize': 19, 'datePos': 'below', 'headline': 'Stefania\n&\nAngelo\n\nsposi',
              'headlineFont': 'Playfair Display', 'headlineSize': 34, 'textColor': '#2e2420'},
  'blocksStyle': {'font': 'Cormorant Garamond', 'color': '#3a2e28', 'flowers': 'boho', 'bg': '#fbf8f2', 'iconColor': '#a8864f'},
  'blocks': [
    b('countdown', {'title': 'Manca sempre meno', 'subtitle': 'al giorno più bello della nostra vita', 'image': M + 'countdown.jpg', 'bw': False, 'darken': True, 'darkness': 38, 'posX': 50, 'posY': 50, 'zoom': 100}),
    b('story', {'title': 'La nostra storia', 'intro': 'Da un aperitivo in piazza fino al sì sul mare: ecco come è andata.', 'showWedding': True,
                'weddingTitle': 'Il grande giorno', 'weddingText': 'E adesso vogliamo festeggiarlo con le persone che amiamo di più.',
                'items': [
      {'date': '2019-06-14', 'title': 'Il primo incontro', 'text': 'Un aperitivo tra amici in piazza, due spritz e una chiacchierata che non voleva finire.', 'image': M + 'couple-3.jpg'},
      {'date': '2021-08-07', 'title': 'Il primo viaggio insieme', 'text': 'In Vespa lungo la Costiera, senza una meta precisa. Lì abbiamo capito che volevamo andare lontano, insieme.', 'image': M + 'couple-5.jpg'},
      {'date': '2026-05-23', 'title': 'La proposta', 'text': 'Una terrazza sul mare al tramonto, un anello nascosto in tasca e il sì più emozionato di sempre.', 'image': M + 'couple-4.jpg'}]}),
    b('venue', {'title': 'Il luogo', 'days': [{'label': 'Sabato 19 giugno 2027', 'name': 'Il San Pietro di Positano', 'address': 'Via Laurito 2, 84017 Positano SA, Italia', 'maps': '', 'image': M + 'venue.webp'}]}),
    b('timeline', {'title': 'Programma della giornata', 'items': [
      {'time': '17:00', 'title': 'Cerimonia', 'text': 'Sulla terrazza affacciata sul mare'},
      {'time': '18:15', 'title': 'Aperitivo al tramonto', 'text': 'Bollicine e crudi in giardino'},
      {'time': '20:30', 'title': 'Cena', 'text': 'Sotto il pergolato di limoni'},
      {'time': '22:30', 'title': 'Taglio della torta', 'text': 'Con i fuochi sulla baia'},
      {'time': '23:00', 'title': 'Si balla!', 'text': 'Fino a quando ne avremo voglia'}]}),
    b('gallery', {'title': 'I nostri momenti', 'images': [M + 'couple-1.jpg', M + 'couple-2.jpg', M + 'couple-6.jpg', M + 'couple-5.jpg', M + 'couple-3.jpg']}),
    b('destination', {'title': 'La destinazione', 'place': 'Positano, Costiera Amalfitana', 'image': M + 'destination.jpg',
                      'text': 'Abbiamo scelto il posto dove ci siamo innamorati la seconda volta: case color pastello, bouganville e il mare più blu che ci sia.',
                      'tips': 'Aeroporto più vicino: Napoli Capodichino (1 h 30 min in auto). In estate il modo più bello per arrivare è il traghetto da Salerno o Amalfi.'}),
    b('boarding', {'title': 'Il vostro volo per l\'amore', 'from': 'Milano', 'fromCode': 'MXP', 'to': 'Napoli', 'toCode': 'NAP', 'flight': 'SA 1906', 'gate': 'A1', 'seat': 'Ospite VIP'}),
    b('transport', {'title': 'Come arrivare', 'items': [
      {'mode': 'Navetta', 'text': 'Dalle 16:00 navetta gratuita dal parcheggio di Positano (Via Pasitea) ogni 20 minuti, e ritorno fino alle 2:00.'},
      {'mode': 'Traghetto', 'text': 'Da Salerno o Amalfi con Travelmar, sbarco al molo di Positano a 5 minuti dalla villa.'},
      {'mode': 'Auto', 'text': 'Parcheggio riservato agli ospiti all\'ingresso della struttura, comunicate la targa entro il 1° giugno.'}]}),
    b('hotel', {'title': 'Dove dormire', 'items': [
      {'name': 'Hotel Poseidon', 'address': 'Via Pasitea 148, Positano', 'link': 'https://www.hotelposeidonpositano.it', 'note': 'Codice STEFANGELO27 per il 10% di sconto.'},
      {'name': 'Villa Franca', 'address': 'Viale Pasitea 318, Positano', 'link': 'https://www.villafrancahotel.it', 'note': 'Navetta per la villa inclusa.'}]}),
    b('dress', {'title': 'Dress code', 'text': 'Elegante estivo, nei toni del mare e della sabbia. Le signore potranno lasciare i tacchi a spillo a casa: la cerimonia è sulla terrazza in pietra.', 'colors': ['#f1e6d6', '#d9c3a5', '#a9c4d6', '#5f86a6', '#e8c9c4']}),
    b('menu', {'title': 'Il menù', 'courses': [
      {'name': 'Benvenuto', 'dish': 'Crudi di mare, mozzarella di bufala e bollicine'},
      {'name': 'Antipasto', 'dish': 'Tartare di gamberi rossi con agrumi della Costiera'},
      {'name': 'Primo', 'dish': 'Scialatielli ai frutti di mare'},
      {'name': 'Secondo', 'dish': 'Pescato del giorno in crosta di limone, verdure dell\'orto'},
      {'name': 'Dolce', 'dish': 'Torta nuziale al limone e delizia al limone'}]}),
    b('drawing', {'image': M + 'drawing.webp', 'caption': 'Ci vediamo sulla terrazza, tra il mare e i limoni.'}, icon=0),
    b('gift', {'title': 'Lista nozze', 'text': 'La vostra presenza è il regalo più bello. Se desiderate aiutarci a realizzare il nostro viaggio di nozze in Polinesia:',
               'iban': 'IT60 X054 2811 1010 0000 0123 456', 'holder': 'Stefania Russo e Angelo Esposito', 'link': ''}),
    b('todo', {'title': 'Cose da sapere', 'items': ['La sera in terrazza c\'è un po\' di brezza: portate un foulard', 'Ci saranno ciabattine per chi vuole ballare a piedi nudi', 'Bambini benvenuti: ci sarà un\'animatrice tutta per loro']}),
    b('faq', {'title': 'Domande frequenti', 'items': [
      {'q': 'Posso portare un accompagnatore?', 'a': 'Il numero di posti è indicato nel vostro invito personale.'},
      {'q': 'C\'è il parcheggio?', 'a': 'Sì, gratuito e riservato agli ospiti, con navetta fino alla villa.'},
      {'q': 'Entro quando confermare?', 'a': 'Entro il 1° maggio 2027, così possiamo organizzare tutto al meglio.'}]}),
  ],
  'audio': {'track': 'dolce-piano', 'custom': ''},
  'languages': {'main': 'it', 'extra': ['en']},
  'rsvp': {'enabled': True, 'title': 'Conferma la tua presenza', 'message': True, 'song': True, 'deadline': '2027-05-01', 'dietary': True, 'icon': 1,
           'diets': {'glutine': True, 'lattosio': True, 'vegetariano': True, 'vegano': True, 'frutta_secca': True, 'pesce': True}, 'otherAllergies': True,
           'custom': [{'id': uid(6), 'label': 'Portata principale', 'required': False, 'type': 'choice', 'options': ['Pesce', 'Carne', 'Vegetariano']}]},
  'album': {'enabled': True, 'askName': True, 'cardStyle': 'avorio', 'cardTitle': 'Condividi i tuoi scatti', 'cardText': 'Inquadra il codice e carica le foto e i video della festa'},
  'whatsapp': 'Ciao {nome}!\nStefania e Angelo hanno il piacere di invitarti al loro matrimonio.\nApri qui il tuo invito: {link}',
}
print(json.dumps(D, ensure_ascii=False))
