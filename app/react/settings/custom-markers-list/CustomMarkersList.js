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

    constructor(props) {
        super(props);
        this.loadMarkers();
    }

    render() {
        return (
            <div  id="settingsManualList" className="customMarkersList">
                <EditableMarkerList markers={this.customMarkers}/>
            </div>  
        );
    }

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