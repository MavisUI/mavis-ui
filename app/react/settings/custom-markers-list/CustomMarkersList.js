import React from 'react';
import PropTypes from 'prop-types';
import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import Store from '../../Store';
import EditableMarkerList from '../editable-marker-list/EditableMarkerList';

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
        this.loadMarkers();
    }

    /**
     * @inheritDoc
     * @returns {*}
     */
    render() {
        let {modalOpen} = {...this.state};
        return (
            <div  id="settingsManualList" className="customMarkersList">
                <EditableMarkerList
                    markers={this.customMarkers}
                    onSave={(markers) =>  this.onSave(markers)}
                    canAddNewMarkers={true}/>
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
            newMarkers = (markers ||[]).filter(marker => !marker._deleted && !marker._id);

        //remove all deleted
        deletedMarkers.map(marker => {
            db.remove({_id: marker._id});
        });

        // update existing
        updatedMarkers.map(marker => {
            // remove the _isDirty and _deleted flags
            let {_isDirty, _deleted, ...markerClone} = {...marker};
            db.update(
                {_id: markerClone._id},
                {$set:
                    markerClone
                });
        });

        // insert new
        newMarkers.map(marker => {
            // remove the _isDirty and _deleted flags
            let {_isDirty, _deleted, ...markerClone} = {...marker};
            markerClone.type = 'manual';
            db.insert(markerClone);
        });

        this.loadMarkers();
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