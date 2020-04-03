import React from 'react';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import Store from '../../Store';
import Button from '../../_ui/button/Button';
import Icon from '../../_ui/icon/Icon';
import MetricSelector from '../metric-selector/MetricSelector';
import FlipMove from 'react-flip-move';
import ColorPicker from '../../_ui/color-picker/ColorPicker';
import ConfirmableButton from '../../_ui/confirmable-button/ConfirmableButton';
import * as mobx from 'mobx';
import ConfirmableInputField from '../../_ui/confirmable-input-field/ConfirmableInputField';

@inject('store')
@observer
export default class EditableMarkerList extends React.Component {

    constructor(props) {
        super(props);
        this.clonedMarkers = [];
        this.cloneMarkers();
    }

    /**
     * Update the markers if the given markers have changed from outside.
     * @inheritDoc
     * @param prevProps
     */
    componentDidUpdate(prevProps) {
        let {markers} = {...this.props};
        if (markers !== prevProps.markers) {
            this.cloneMarkers();
            this.forceUpdate();
        }
    }

    /**
     * @inheritDoc
     * @returns {*}
     */
    render() {
        let {store, markers = [], viewOnly, canAddNewMarkers} = {...this.props};
        return (
            <div className="editableMarkerList">
                <FlipMove
                    className="editableMarkerList__list"
                    typeName="ul"
                    easing="ease-out"
                    enterAnimation="fade"
                    leaveAnimation="none"
                    appearAnimation="fade"
                    staggerDelayBy={20}>
                    {this.clonedMarkers
                        .filter(marker => !marker._deleted)
                        .map((marker, i) => {
                        return (
                            <li key={marker._id || i} className="editableMarkerList__item">

                                <div className="editableMarkerList__item__label">
                                    <ConfirmableInputField value={marker.label} onChange={(value) => this.updateMarker(marker, 'label', value)}/>
                                </div>
                                <div className="editableMarkerList__item__metric">
                                    <MetricSelector
                                        selected={marker.metric}
                                        viewOnly={viewOnly}
                                        onChange={(metric) => this.updateMarker(marker, 'metric', metric)}/>
                                </div>
                                <div className="editableMarkerList__item__color">
                                    <ColorPicker
                                        color={marker.color}
                                        viewOnly={viewOnly}
                                        onChange={(color) => this.updateMarker(marker, 'color', color)}/>
                                </div>
                                <div className="editableMarkerList__item__delete">
                                    <ConfirmableButton
                                        disabled={viewOnly}
                                        type="noStyle"
                                        className="editableMarkerList__item__deleteBtn"
                                        showDeleteWarning={!!marker._id}
                                        onClick={() => this.updateMarker(marker, '_deleted', true)}>
                                        <Icon name="iconTrash"/>
                                    </ConfirmableButton>
                                </div>
                            </li>
                        )
                    })}
                </FlipMove>,
                {canAddNewMarkers &&
                    <a className="editableMarkerList__addMarker" onClick={() => this.addMarker()}>
                        Merkmal hinzufügen <Icon name="iconPlus" />
                    </a>
                }
                {(!viewOnly && markers.length > 0 || this.isDirty) &&
                    <div className="editableMarkerList__buttons">
                        <Button type="reset" disabled={!this.isDirty} onClick={() =>  this.reset()}>
                            <Icon name="iconRefresh"/> zurücksetzen
                        </Button>,
                        <Button type="confirm" disabled={!this.isDirty} onClick={() => this.onSave()}>
                            <Icon name="iconConfirm"/> speichern
                        </Button>
                    </div>
                }
            </div>
        )
    }

    /**
     * Event handler for the click event, when the save button is clicked. Calls the onSave prop
     * with all items that has been changed.
     */
    onSave() {
        let {onSave} = {...this.props},
            changedItems = this.clonedMarkers.filter(marker => marker._isDirty);
        onSave(changedItems);
    }

    /**
     * Restore the markers by cloning the ones given through props.
     */
    reset() {
        this.cloneMarkers();
        this.forceUpdate();
    }

    /**
     * Clones the markers given through props and add internal fields to each marker.
     */
    cloneMarkers() {
        let {markers = []} = {...this.props},
            clonedMarkers = mobx.toJS(markers);
        clonedMarkers.forEach(marker => {
            marker._isDirty = false;
            marker._deleted = false;
        });
        this.clonedMarkers = clonedMarkers || [];
    }

    /**
     * Adds a marker to the temporary list.
     */
    addMarker() {
        let length = this.clonedMarkers.length;
        this.clonedMarkers.push({
            _isDirty: false,
            _deleted: false,
            label: 'Please set marker name',
            metric: 0,
            active: true,
            chart: {
                pointInterval: 0,
                type: ""
            },
            color: '#000000',
            index: this.clonedMarkers.length,
            max: 0,
            min: 0,
            name: 'user' + length,
            points: 1,
            steps: 1,
            threshMax: 0,
            threshMin: 0,
            type: 'manual',
        });
        this.forceUpdate();
    }

    /**
     * Update a prop with the value of the given marker.
     * @param {object} marker
     * @param {string} prop
     * @param {*} value
     */
    updateMarker(marker, prop, value) {
        let previousValue = marker[prop];
        marker[prop] = value;
        if (previousValue !== value) {
            marker._isDirty = true;
        }
        // we need to force an update because we just changed properties of an existing
        // object and no references passed as props.
        this.forceUpdate();
    }

    /**
     * Returns true if one of the markers has the dirty flag set to true.
     * @returns {boolean}
     */
    get isDirty() {
        return (this.clonedMarkers || []).filter(marker => marker._isDirty).length > 0;
    }
}

EditableMarkerList.propTypes = {
    store: PropTypes.instanceOf(Store),
    markers: PropTypes.arrayOf(PropTypes.object),
    viewOnly: PropTypes.bool,
    onSave: PropTypes.func,
    canAddNewMarkers: PropTypes.bool
};

EditableMarkerList.defaultProps = {
    onSave: () => {},
    canAddNewMarkers: false
};