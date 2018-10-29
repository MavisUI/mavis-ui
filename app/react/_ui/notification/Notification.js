import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button/Button';
import Modal from '../modal/Modal';

export default class Notification extends React.Component {
    render() {
        let {show, message = {}, onClick} = {...this.props},
            m = message || {};
        return (
            <Modal open={show} type="noStyle" onClose={() => onClick()} userCanClose={false}>
                <div className={'notification ' + m.noteType}>
                    <h1 className="notification__headline">
                        {m.headline || ''}
                    </h1>
                    <p className="notification__text">
                        {m.noteText || ''}
                    </p>
                    <Button className="notification__button" onClick={() => onClick()}>
                        {m.buttonText || ''}
                    </Button>
                </div>
            </Modal>
        );
    }
}

Notification.propTypes = {
    show: PropTypes.bool,
    message: PropTypes.object,
    onClick: PropTypes.func
};

Notification.defaultProps = {
    show: false,
    onClick: () => {}
};

export const NotificationMessages = {
    ERROR_MISSING_INPUT: {
        id: 0,
        noteType: 'error',
        headline: 'Fehlende Texteingabe!',
        noteText: 'Bitte geben Sie einen Kommentar-Text ein.',
        buttonText: 'OK'
    },
    ERROR_THRESHOLD_CONFLICT_MIN: {
        id: 1,
        noteType: 'error',
        headline: 'Schwellenkonflikt!',
        noteText: 'Der eingegebene minimum Schwellenwert darf den angegebenen Maximalwert nicht überschreiten.',
        buttonText: 'OK'
    },
    ERROR_THRESHOLD_CONFLICT_MAX: {
        id: 2,
        noteType: 'error',
        headline: 'Schwellenkonflikt!',
        noteText: 'Der eingegebene maximum Schwellenwert darf den angegebenen Minimalwert nicht unterschreiten.',
        buttonText: 'OK'
    },
    ERROR_TEST_PROCEDURE_NOT_USED: {
        id: 3,
        noteType: 'error',
        headline: 'Keine Prüfdaten!',
        noteText: 'Das ausgewählte Prüfverfahren wurde bei der Inspektion nicht eingesetzt und kann daher nicht aktiviert werden.',
        buttonText: 'OK'
    },
    ERROR_FAILURE_TO_SAVE_DATA: {
        id: 4,
        noteType: 'error',
        headline: 'Fehler beim Speichern der Daten!',
        noteText: 'Beim Speichern der Daten ist ein Fehler aufgetreten. Bitte Starten Sie das Programm neu, tritt der Fehler dann erneut auf, wenden Sie sich bitte an uns.',
        buttonText: 'OK'
    },
    WARNING_UNSAVED_CHANGES_WILL_BE_LOST: {
        id: 5,
        noteType: 'warning',
        headline: 'Nicht gespeicherte Änderungen gehen verloren!',
        noteText: 'Wenn Sie die Einstellungen verlassen ohne Ihre Änderungen zu speichern, gehen diese verloren.',
        buttonText: 'OK'
    },
    SUCCESS_CHANGES_HAVE_BEEN_SAVED: {
        id: 6,
        noteType: 'success',
        headline: 'Änderung erfolgreich gespeichert!',
        noteText: 'Ihre Änderungen wurden erfolgreich gespeichert und in der Datenanalyse angewendet.',
        buttonText: 'OK'
    },
    WARNING_DATA_WILL_BE_DELETED: {
        id: 7,
        noteType: 'warning',
        headline: 'Daten werden gelöscht!',
        noteText: 'Wenn Sie das Löschen des Falls bestätigen, werden alle Einträge die Sie zu diesem Fall in der visuellen Inspektion gegebenenfalls bereits eingegeben haben ebenfalls gelöscht. Der OK-Button entfernt nur diese Nachricht, das Löschen bestätigen Sie über das Häkchen am Feld.',
        buttonText: 'OK'
    },
    WARNING_PLEASE_SELECT_MARKER: {
        id: 8,
        noteType: 'warning',
        headline: 'Merkmal auswählen!',
        noteText: 'Bitte wählen Sie den passendes Merkmal (Schadensfall).',
        buttonText: 'OK'
    },
    WARNING_PLEASE_SELECT_SIDES: {
        id: 9,
        noteType: 'warning',
        headline: 'Betroffene Seiten wählen!',
        noteText: 'Bitte wählen Sie die betroffenen Seiten per Klick auf das jeweilige Bild aus.',
        buttonText: 'OK'
    }
};
