import React from 'react';
import PropTypes from 'prop-types';
import Store from '../Store';
import {inject, observer} from 'mobx-react';
import PlayerControls from './PlayerControls';
import Filter from '../ui/filter/Filter';
import PlayerSideView from './PlayerSideView';
import path from 'path';

@inject('store')
@observer
export default class Player extends React.Component {
    render() {
        let {store} = {...this.props},
            playerState = store.playerState,
            cable = this.getCurrentCable(),
            frame = this.getCurrentFrame(),
            baseImagePath = this.getBaseImagePath();
        console.log('baseImagePath', baseImagePath);
        return (
            <div className="player">
                <div id="cableSelection">
                    <label htmlFor="cableSelectionOptions">Seil: </label>
                    <select id="cableSelectOptions" value={playerState.cableIndex} onChange={(e) => playerState.cableIndex = parseInt(e.target.value)}>
                        {store.cableData.map((cable, i) => <option key={i} value={i}>{cable.name}</option> )}
                    </select>
                </div>
                <div id="controlsPlayer">
                <PlayerControls
                    speed={playerState.speed}
                    position={playerState.position}
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
                        hideSort={true}
                        hideCable={true}/>
                </div>
                <div id="graph"></div>

            </div>
        );
    }

    getCurrentFrame() {
        let {store} = {...this.props},
            {position} = {...store.playerState},
            cable = this.getCurrentCable(),
            frames = cable.trigger;
        return Math.max((frames ||[]).findIndex(frame => position < frame) - 1, 0);
    }

    getCurrentCable() {
        let {store} = {...this.props},
            playerState = store.playerState;
        return store.cableData[playerState.cableIndex];
    }

    getBaseImagePath() {
        let {store} = {...this.props},
            {playerState, userState} = {...store},
            imagePath = '/data/' + userState.activeBridge + '/' + playerState.cableIndex;
         return imagePath;
    }
}

Player.propTypes = {
    store: PropTypes.instanceOf(Store)
};