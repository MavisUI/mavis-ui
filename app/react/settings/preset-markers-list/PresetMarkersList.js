import React from 'react';
import {observable} from 'mobx';
import EditableMarkerList from '../editable-marker-list/EditableMarkerList';
import PropTypes from 'prop-types';
import Store from '../../Store';
import {inject, observer} from 'mobx-react';

@inject('store')
@observer
export default class PresetMarkersList extends React.Component{
    @observable presetMarkers = [];

    constructor(props) {
        super(props);
        this.loadMarkers();
    }

    render() {
        return (
            <div  id="settingsManualList" className="presetMarkersList">
                <EditableMarkerList markers={this.presetMarkers} viewOnly={true}/>
            </div>
        );
    }

    loadMarkers() {
        let {store} = {...this.props};
        store.stores.modules
            .find({type: 'din'})
            .sort({label: 1})
            .then(results => {
                this.presetMarkers = results;
            });
    }
}

PresetMarkersList.propTypes = {
    store: PropTypes.instanceOf(Store)
};