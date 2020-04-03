import React from 'react';
import {inject, observer} from 'mobx-react';
import {observable} from 'mobx';
import PropTypes from 'prop-types';
import Store from '../../Store';
import InputRange from 'react-input-range';
import Button from '../../_ui/button/Button';
import Icon from '../../_ui/icon/Icon';
import Checkbox from '../../_ui/checkbox/Checkbox';
import 'react-input-range/lib/css/index.css';
import classNames from  'classnames';
import * as mobx from 'mobx';
import Notification, {NotificationMessages} from '../../_ui/notification/Notification';

@inject('store')
@observer
export default class Procedures extends React.Component {

    @observable markers = [];

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
        this.loadData();
    }


    /**
     * @inheritDoc
     * @returns {*}
     */
    render() {
        let {store} = {...this.props},
            {showNotification, message} = {...this.state},
            metrics = store.metrics;
        return (
            <div className="procedures">
                {this.markers.map(marker => {
                    let metric = metrics.find(m => m.id === marker.metric),
                        css = classNames('procedures__item', {active: marker.active});
                    return (
                        <div className={css} key={marker._id}>
                            <span className="procedures__name">
                                {marker.label}
                            </span>
                            <div className="procedures__range">
                                <div className="procedures__range__label">
                                    Schwellen (<span dangerouslySetInnerHTML={{__html: metric && metric.metric}} />)
                                </div>
                                <div className="procedures__range__input">
                                    <InputRange
                                        minValue={marker.min}
                                        maxValue={marker.max}
                                        disabled={!marker.active}
                                        step={marker.steps}
                                        value={{min: marker.threshMin, max: marker.threshMax}}
                                        formatLabel={(value, type) => this.formatValue(value, marker)}
                                        onChange={(value) =>  {
                                            this.updateMarker(marker, 'threshMin', this.formatValue(value.min, marker));
                                            this.updateMarker(marker, 'threshMax', this.formatValue(value.max, marker));
                                        }}>

                                    </InputRange>
                                </div>

                            </div>
                            <div className="procedures__activeSwitch">
                                <Checkbox checked={marker.active} onChange={(e) =>  this.updateMarker(marker, 'active', !!e.target.checked)}/>
                            </div>
                        </div>
                    )
                })}
                <div className="procedures__buttons">
                    <Button type="reset" disabled={!this.isDirty} onClick={() =>  this.reset()}>
                        <Icon name="iconRefresh"/> zurücksetzen
                    </Button>,
                    <Button type="confirm" disabled={!this.isDirty} onClick={() => this.onSave()}>
                        <Icon name="iconConfirm"/> speichern
                    </Button>
                </div>
                <Notification show={showNotification} message={message} onClick={() => this.hideNotification()}/>
            </div>
        )
    }

    /**
     * Saves the changes markers
     */
    onSave() {
        let {store} = {...this.props},
            db = store.stores.modules,
            promises = [];
        this.markers
            .filter(marker =>  marker._isDirty)
            .map(marker => mobx.toJS(marker))
            .map(marker => {
                let {_isDirty, ...strippedMarker} = marker;
                return strippedMarker;
            })
            .map(marker => {
                promises.push(db.update({_id: marker._id}, marker));
            });

        Promise
            .all(promises)
            .then(() => {
                this.showNotification(NotificationMessages.SUCCESS_CHANGES_HAVE_BEEN_SAVED);
                this.loadData();
            })
            .catch((err) => {
                console.error(err);
                this.showNotification(NotificationMessages.ERROR_FAILURE_TO_SAVE_DATA);
            })
    }

    /**
     * Loads all markers with type automatic
     */
    loadData() {
        let {store} = {...this.props},
            db = store.stores.modules;
        db.find({type: 'automatic'}).then((markers) => this.markers = markers);
    }

    /**
     * Resets the markers
     */
    reset() {
        this.loadData();
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
     * Formats the value to match the steps of the given marker.
     * If a dot is found in the step definition, we set the precision of the value
     * the fraction size.
     * Otherwise the value will be just returned as a number.
     * @param value
     * @param marker
     * @returns {*}
     */
    formatValue(value, marker) {
        let fractionSize = 0;
        if (('' + marker.steps).indexOf('.') !== -1) {
            fractionSize = ('' + ('' + marker.steps).split('.').pop()).length;
        }
        if (fractionSize > 0) {
            return Number(Number(value).toFixed(fractionSize));
        }
        return Number(value);
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
        return (this.markers || []).filter(marker => marker._isDirty).length > 0;
    }
}

Procedures.propTypes = {
    store: PropTypes.instanceOf(Store)
};