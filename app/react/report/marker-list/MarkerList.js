import React from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import CableImage from '../../_ui/cable-image/CableImage';
import Filter from '../../_ui/filter/Filter';
import Store from '../../Store';
import Downloads from './Downloads';
import FlipMove from 'react-flip-move';
import crypto  from  'crypto';
import App from '../../App';
import classNames from 'classnames';

@inject('store', 'app')
@observer
export default class MarkerList extends React.Component {

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            criteria: null
        }
    }

    /**
     * @inheritDoc
     * @returns {*}
     */
    render() {
        let {store, maxItemsToShow} = {...this.props},
            {data = []} = {...this.state},
            noData = !data || (data && data.length === 0),
            displaysOnlyPartial = !noData && data.length > maxItemsToShow,
            css = classNames('markerList', {displaysOnlyPartial: displaysOnlyPartial});
        return (
            <div id="reportContainerList" className={css}>
                <Filter onChange={(d, c) => this.setState({data: d, criteria: c})} hideSort={false}/>
                {displaysOnlyPartial &&
                    <div className="markerList__info">
                        Es werden maximal {maxItemsToShow} Einträge angezeigt.
                    </div>
                }
                <div id="list" className="markerList__list">
                    <div id="listHeader" className="markerList__header">
                        <label className="markerList__header__label">Schadensfall ({data ? data.length : '--'})</label>
                        <label className="markerList__header__label">Seil</label>
                        <label className="markerList__header__label">Position</label>
                        <label className="markerList__header__label">Seiten</label>
                        <label className="markerList__header__label">Schadensklasse</label>
                        <label className="markerList__header__label">Wert</label>
                        <label className="markerList__header__label">Links</label>
                        </div>
                    <FlipMove className="markerList__list__body"
                              typeName="ul"
                              easing="ease-out"
                              enterAnimation="fade"
                              leaveAnimation="none"
                              appearAnimation="fade"
                              staggerDelayBy={20}>
                        {data && data.slice(0, maxItemsToShow).map((item, i) => {
                            let key = crypto.randomBytes(16).toString("hex");
                            return (
                                <li className="markerList__row"  key={key}>
                                    <div className="markerList__item itemLabel">
                                        <div className="colorBar markerList__item__colorBar" style={{backgroundColor: item.color}}/>
                                        {item.label}
                                    </div>
                                    <div className="markerList__item itemCable">{store.cableData[item.cable].name}</div>
                                    <div className="markerList__item itemPosition">{item.position + ' m'}</div>
                                    <div className="markerList__item itemSides">
                                        <CableImage selectedSides={item.sides}/>
                                    </div>
                                    <div className="markerList__item itemRating">{'SK ' + item.rating}</div>
                                    <div className="markerList__item itemValue">{item.value} <span dangerouslySetInnerHTML={{__html: item.metric}}/></div>
                                    <div className="markerList__item itemLink">
                                        <a className="markerList__link" onClick={() => this.navigateToPlayer(item.cable, item.position)}>
                                            Zur Seilprüfungsansicht
                                        </a>
                                    </div>
                                </li>
                            )
                        })}
                        {noData && <li className="markerList__noResults">Zu diesen Filtereinstellungen liegen keine Daten vor.</li> }
                    </FlipMove>
                    <div id="reportDownload">
                        <Downloads data={data}/>
                    </div>
                </div>
            </div>
        )
    }

    navigateToPlayer(cableIndex, position) {
        let {app, store} = {...this.props};
        store.playerState.cableIndex = cableIndex;
        store.playerState.position = position;
        app.loadPage('inspection')
    }
}

MarkerList.propTypes = {
    store: PropTypes.instanceOf(Store),
    app: PropTypes.instanceOf(App),
    maxItemsToShow: PropTypes.number
};

MarkerList.defaultProps = {
    maxItemsToShow: 999
};