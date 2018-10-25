import React from 'react';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import Store from '../../Store';
import Button from '../../_ui/button/Button';
import Icon from '../../_ui/icon/Icon';
import MetricSelector from '../metric-selector/MetricSelector';
import FlipMove from 'react-flip-move';
import ColorPicker from '../../_ui/color-picker/ColorPicker';

@inject('store')
@observer
export default class EditableMarkerList extends React.Component {

    render() {
        let {store, markers = []} = {...this.props},
            isDirty = false;
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
                    {markers.map((marker, i) => {
                        return (
                            <li key={marker._id || i} className="editableMarkerList__item">

                                <div className="editableMarkerList__item__label">
                                    {marker.label}
                                </div>
                                <div className="editableMarkerList__item__metric">
                                    <MetricSelector selected={marker.metric}/>
                                </div>
                                <div className="editableMarkerList__item__color">
                                    <ColorPicker color={marker.color}/>
                                </div>
                                <div className="editableMarkerList__item__delete">
                                    <Icon name="delete"/>
                                </div>
                            </li>
                        )
                    })}
                </FlipMove>,
                <div className="editableMarkerList__buttons">
                    <Button type="reset" disabled={!isDirty}>
                        <Icon name="iconRefresh"/> zurücksetzen
                    </Button>,
                    <Button type="confirm" disabled={!isDirty}>
                        <Icon name="iconConfirm"/> speichern
                    </Button>
                </div>
            </div>
        )
    }
}

EditableMarkerList.propTypes = {
    store: PropTypes.instanceOf(Store),
    markers: PropTypes.arrayOf(PropTypes.object)
};