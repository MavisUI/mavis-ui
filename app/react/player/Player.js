import React from 'react';
import PropTypes from 'prop-types';
import Store from '../Store';
import {inject, observer} from 'mobx-react';
import PlayerControls from './PlayerControls';
import Filter from '../ui/filter/Filter';
import PlayerSideView from './PlayerSideView';
import path from 'path';
import PlayerGraph from './PlayerGraph';

@inject('store')
@observer
export default class Player extends React.Component {

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
        let {store} = {...this.props},
            {data} = {...this.state},
            playerState = store.playerState,
            cable = this.getCurrentCable(),
            frame = this.getCurrentFrame(),
            baseImagePath = this.getBaseImagePath();
        console.log('frame', frame);
        return (
            <div className="player">
                <div id="cableSelection" className="player__cableSelection">
                    <label htmlFor="cableSelectionOptions">Seil: </label>
                    <select id="cableSelectOptions"
                            value={playerState.cableIndex}
                            onChange={(e) => playerState.cableIndex = parseInt(e.target.value)}>
                        {store.cableData.map((cable, i) => <option key={i} value={i}>{cable.name} ({cable.drivenLength} m)</option> )}
                    </select>
                </div>
                <div id="controlsPlayer" className="player__controls">
                    <PlayerControls
                        speed={playerState.speed}
                        position={playerState.position}
                        maxPosition={cable.drivenLength}
                        frames={cable.trigger}
                        onChangePosition={(position) => playerState.position = position}
                        onChangeSpeed={(speed) => playerState.speed = speed}/>

                </div>
                <div id="controlsComment"></div>
                <div id="visual">
                    <PlayerSideView
                        sides={cable.sides}
                        frame={frame}
                        maxFrames={cable.imageCount}
                        basePath={baseImagePath}/>
                </div>
                <div id="inspectionFilter">
                    <Filter
                        criteria={{cable: playerState.cableIndex}}
                        hideSort={true}
                        hideCable={true}
                        onChange={(d, c) => this.setState({data: d, criteria: c})}/>
                </div>
                <div id="graph">
                    <PlayerGraph
                        position={playerState.position}
                        maxLength={cable.drivenLength}
                        data={data}
                        onChangePosition={(position) => playerState.position = position}/>
                </div>
            </div>
        );
    }

    /**
     * Returns the current frame based on the current position
     * @returns {number}
     */
    getCurrentFrame() {
        let {store} = {...this.props},
            {position} = {...store.playerState},
            cable = this.getCurrentCable(),
            frames = cable.trigger;
        return Math.max((frames ||[]).findIndex(frame => position < frame) - 1, 0);
    }

    /**
     * Returns the current cable data based on the store index.
     * @returns {*}
     */
    getCurrentCable() {
        let {store} = {...this.props},
            playerState = store.playerState;
        return store.cableData[playerState.cableIndex];
    }

    /**
     * Returns the base image path
     * @returns {string}
     */
    getBaseImagePath() {
        let {store} = {...this.props},
            {playerState, userState} = {...store};
        return '/data/' + userState.activeBridge + '/' + playerState.cableIndex;
    }
}

Player.propTypes = {
    store: PropTypes.instanceOf(Store)
};