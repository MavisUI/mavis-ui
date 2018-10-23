import React from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import CableImage from '../ui/cable-image/CableImage';
import Filter from '../ui/filter/Filter';
import Store from '../Store';
import Downloads from './Downloads';
import FlipMove from 'react-flip-move';
import crypto  from  'crypto';
import App from '../App';

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
            {data} = {...this.state},
            noData = !data || (data && data.length === 0);
        return (
            <div id="reportContainerList" className="markerList">
                <Filter onChange={(d, c) => this.setState({data: d, criteria: c})} hideSort={false}/>
                <div className="markerList__info">
                    Es werden maximal {maxItemsToShow} Einträge angzeigt.
                </div>
                <div id="list">
                    <div id="listHeader">
                        <label>Schadensfall ({data ? data.length : '--'})</label>
                        <label>Seil</label>
                        <label>Position</label>
                        <label>Seiten</label>
                        <label>Schadensklasse</label>
                        <label>Wert</label>
                        <label>Links</label>
                        </div>
                    <FlipMove id="listBody"
                              typeName="ul"
                              easing="ease-out"
                              enterAnimation="fade"
                              leaveAnimation="none"
                              appearAnimation="fade"
                              staggerDelayBy={20}>
                        {data && data.slice(0, maxItemsToShow).map((item, i) => {
                            let key = crypto.randomBytes(16).toString("hex");
                            return (
                                <li className="result markerList__item"  key={key}>
                                    <div className="item itemLabel">
                                        <div className="colorBar markerList__item__colorBar" style={{backgroundColor: item.color}}/>
                                        {item.label}
                                    </div>
                                    <div className="item itemCable">{store.cableData[item.cable].name}</div>
                                    <div className="item itemPosition">{item.position + ' m'}</div>
                                    <div className="item itemSides">
                                        <CableImage selectedSides={item.sides}/>
                                    </div>
                                    <div className="item itemRating">{'SK ' + item.rating}</div>
                                    <div className="item itemValue">{item.value} <span dangerouslySetInnerHTML={{__html: item.metric}}/></div>
                                    <div className="item itemLink">
                                        <a className="loadVisual" onClick={() => this.navigateToPlayer(item.cable, item.position)}>
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
    maxItemsToShow: 100
};