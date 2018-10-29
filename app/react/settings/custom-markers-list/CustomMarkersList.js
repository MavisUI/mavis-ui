import React from 'react';
import PropTypes from 'prop-types';
import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import Store from '../../Store';
import EditableMarkerList from '../editable-marker-list/EditableMarkerList';
import {NotificationMessages} from '../../_ui/notification/Notification';
import Notification from '../../_ui/notification/Notification';

@inject('store')
@observer
export class CustomMarkersList extends React.Component{

    @observable customMarkers = [];

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            showNotification: false,
            message: null
        };
        this.loadMarkers();
    }

    /**
     * @inheritDoc
     * @returns {*}
     */
    render() {
        let {showNotification, message} = {...this.state};
        return (
            <div  id="settingsManualList" className="customMarkersList">
                <EditableMarkerList
                    markers={this.customMarkers}
                    onSave={(markers) =>  this.onSave(markers)}
                    canAddNewMarkers={true}/>
                <Notification show={showNotification} message={message} onClick={() => this.hideNotification()}/>
            </div>
        );
    }

    /**
     * Saves the given markers to the db.
     * @param markers
     */
    onSave(markers) {
        let {store} = {... this.props},
            db = store.stores.modules,
            deletedMarkers = (markers ||[]).filter(marker => marker._deleted),
            updatedMarkers = (markers ||[]).filter(marker => !marker._deleted && marker._id),
            newMarkers = (markers ||[]).filter(marker => !marker._deleted && !marker._id),
            promises = [];

        //remove all deleted
        deletedMarkers.map(marker => {
            promises.push(
                db.remove({_id: marker._id})
            );
        });

        // update existing
        updatedMarkers.map(marker => {
            // remove the _isDirty and _deleted flags
            let {_isDirty, _deleted, ...markerClone} = {...marker};
            promises.push(
                db.update(
                {_id: markerClone._id},
                {$set:
                    markerClone
                })
            );
        });

        // insert new
        newMarkers.map(marker => {
            // remove the _isDirty and _deleted flags
            let {_isDirty, _deleted, ...markerClone} = {...marker};
            markerClone.type = 'manual';
            promises.push(
                db.insert(markerClone)
            );

        });
        Promise.all(promises)
            .then(() => {
                this.showNotification(NotificationMessages.SUCCESS_CHANGES_HAVE_BEEN_SAVED);
                this.loadMarkers();
            })
            .catch((err) => {
                console.error(err);
                this.showNotification(NotificationMessages.ERROR_FAILURE_TO_SAVE_DATA);
            })

    }

    /**
     * Shows the given notification message
     * @param message
     */
    showNotification(message) {
        this.setState({
            showNotification: true,
            message: message
        });
    }

    /**
     * Hides the notification
     */
    hideNotification() {
        this.setState({
           showNotification: false
        });
    }

    /**
     * Loads the current manual markers from the db.
     */
    loadMarkers() {
        let {store} = {...this.props};
        store.stores.modules
            .find({type: 'manual'})
            .sort({index: 1})
            .then(results => {
                this.customMarkers = results;
            });
    }
}

CustomMarkersList.propTypes = {
    store: PropTypes.instanceOf(Store)
};