const Mavis = require('../Global/Global');

Mavis.Notifications = {

  Status: false,

  Messages: [{
    "id": 0,
    "notetype": "error",
    "headline": "Fehlende Texteingabe!",
    "notetext": "Bitte geben Sie einen Kommentar-Text ein.",
    "buttontext": "OK"
  }, {
    "id": 1,
    "notetype": "error",
    "headline": "Schwellenkonflikt!",
    "notetext": "Der eingegebene minimum Schwellenwert darf den angegebenen Maximalwert nicht überschreiten.",
    "buttontext": "OK"
  }, {
    "id": 2,
    "notetype": "error",
    "headline": "Schwellenkonflikt!",
    "notetext": "Der eingegebene maximum Schwellenwert darf den angegebenen Minimalwert nicht unterschreiten.",
    "buttontext": "OK"
  }, {
    "id": 3,
    "notetype": "error",
    "headline": "Keine Prüfdaten!",
    "notetext": "Das ausgewählte Prüfverfahren wurde bei der Inspektion nicht eingesetzt und kann daher nicht aktiviert werden.",
    "buttontext": "OK"
  }, {
    "id": 4,
    "notetype": "error",
    "headline": "Fehler beim Speichern der Daten!",
    "notetext": "Beim Speichern der Daten ist ein Fehler aufgetreten. Bitte Starten Sie das Programm neu, tritt der Fehler dann erneut auf, wenden Sie sich bitte an uns.",
    "buttontext": "OK"
  }, {
    "id": 5,
    "notetype": "warning",
    "headline": "Nicht gespeicherte Änderungen gehen verloren!",
    "notetext": "Wenn Sie die Einstellungen verlassen ohne Ihre Änderungen zu speichern, gehen diese verloren.",
    "buttontext": "OK"
  }, {
    "id": 6,
    "notetype": "success",
    "headline": "Änderung erfolgreich gespeichert!",
    "notetext": "Ihre Änderungen wurden erfolgreich gespeichert und in der Datenanalyse angewendet.",
    "buttontext": "OK"
  }, {
    "id": 7,
    "notetype": "warning",
    "headline": "Daten werden gelöscht!",
    "notetext": "Wenn Sie das Löschen des Falls bestätigen, werden alle Einträge die Sie zu diesem Fall in der visuellen Inspektion gegebenenfalls bereits eingegeben haben ebenfalls gelöscht. Der OK-Button entfernt nur diese Nachricht, das Löschen bestätigen Sie über das Häkchen am Feld.",
    "buttontext": "OK"
  }],

  noted: function () {

    return new Promise(function (resolve, reject) {

      let notification = document.getElementById('notification'),
        message = document.getElementById('message'),
        button = document.querySelector('#message button');

      notification.setAttribute('class', '');
      notification.setAttribute('data-status', null);

      button.removeEventListener('click', Mavis.Notifications.noted);
      message.innerHTML = '';

      Mavis.Notifications.Status = false;

      resolve();
    });
  },

  _events: function () {

    let button = document.querySelector('#message button');

    button.addEventListener('click', Mavis.Notifications.noted);

  },

  notify: function (noteid) {

    let content = document.createElement('div');
    content.innerHTML = '<h1>' + this.Messages[noteid].headline + '</h1><p>' + this.Messages[noteid].notetext + '</p><button data-value="' + [noteid] + '">' + this.Messages[noteid].buttontext + '</button>';

    let notification = document.getElementById('notification'),
      message = document.getElementById('message');

    message.appendChild(content);
    notification.setAttribute('class', this.Messages[noteid].notetype + ' show');
    notification.setAttribute('data-stats', this.Messages[noteid].notetype);

    this.Status = true;
    this._events();
  },
};

module.exports = Mavis.Notifications;