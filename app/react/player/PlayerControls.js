import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../ui/icon/Icon';

export default class PlayerControls extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            interval: null
        }
    }

    render() {
        let {position, speedOptions, speed, onChangeSpeed} = {...this.props},
            {interval} = {...this.state};
        onChangeSpeed = onChangeSpeed ? onChangeSpeed : () => {};
        return (
            <div className="playerControls">
                <menu id="player">
                    <label htmlFor="playerPosition">Position: </label>
                        <input type="number" id="playerPosition" className="playerControls__field__position" value={position} min={0} onChange={(e) => this.setPosition(e.target.value)}/>
                    <label > m</label>
                    <button id="playerToStart" title="zum Anfang" onClick={() => this.toStart()}>
                        <Icon name="iconToStart" />
                    </button>
                    <button id="playerPrevious" title="ein Frame zurück" onClick={() => this.previousFrame()}>
                        <Icon name="iconSkipPrevious" />
                    </button>
                    <button id="playerPlayPause" title="Starten/Stoppen" onClick={() => this.toggle()}>
                        {interval === null && <Icon name="iconPlay" />}
                        {interval && <Icon name="iconPause" /> }
                    </button>
                    <button id="playerNext" title="ein Frame weiter" onClick={() => this.nextFrame()}>
                        <Icon name="iconSkipNext" />
                    </button>
                    <button id="playerToEnd" title="zum Ende" onClick={() => this.toEnd()}>
                        <Icon name="iconToEnd" />
                    </button>
                    <label htmlFor="playerSpeed">Geschwindigkeit: </label>
                    <select id="playerSpeed" name="playerSpeed" value={speed} onChange={(e) => this.setSpeed(e.target.value)}>
                        {(speedOptions || []).map(option => <option key={option.value} value={option.value} dangerouslySetInnerHTML={{__html: option.label}}/>)}
                    </select>
                </menu>
            </div>
        );
    }

    toggle() {
        this.state.interval ? this.pause() : this.play();
    }

    play() {
        let {speed, position} = {...this.props},
            {interval} = {... this.state};
        if (interval) {
            clearInterval(interval);
        }
        interval = setInterval(() => {
            position = (position * 100);
            position++;
            position = (position / 100).toFixed(2);
            this.setPosition(position);
            console.log('tick', position);
        }, speed);
        this.setState({
            interval: interval
        });
    }

    pause() {
        if (this.state.interval) {
            clearInterval(this.state.interval);
        }
        this.setState({
            interval: null
        });
    }

    setPosition(position) {
        position = +position;
        let {onChangePosition} = {...this.props};
        if (onChangePosition) {
            onChangePosition(position);
        }
    }

    setSpeed(speed) {
        let {onChangeSpeed} = {...this.props};
        speed = parseInt(speed);
        this.pause();
        if (onChangeSpeed) {
            onChangeSpeed(speed);
        }
    }

    toStart() {
        // pause player
        this.pause();
        this.setPosition(0);
    }

    previousFrame(){
        let {frames = []} = {...this.props};
        // pause player
        this.pause();

        let previousFrame = this.getCurrentFrame() - 1;

        if(previousFrame >= 0) {
            let position = frames[previousFrame];
            this.setPosition(position);
        }
    }

    nextFrame(){
        let {frames = []} = {...this.props};
        // pause player
        this.pause();
        let nextFrame = this.getCurrentFrame() + 1;


        if(frames[nextFrame]) {
            let position = frames[nextFrame];
            console.log(this.getCurrentFrame(), nextFrame, position);
            this.setPosition(position);
        }
    }

    toEnd() {
        let {frames = []} = {...this.props};
        // pause player
        this.pause();
        this.setPosition(frames[frames.length - 1]);
    }

    getCurrentFrame() {
        let {frames, position} = {...this.props};
        return Math.max((frames ||[]).findIndex(frame => position < frame) - 1, 0);
    }
}

PlayerControls.propTypes = {
    position: PropTypes.number,
    speed: PropTypes.number,
    speedOptions : PropTypes.arrayOf(
        PropTypes.shape(
            {
                value: PropTypes.number,
                name: PropTypes.string,
                selected: PropTypes.bool,
            }
        )
    ),
    onChangeSpeed: PropTypes.func,
    onChangePosition: PropTypes.func,
    frames: PropTypes.arrayOf(PropTypes.number)
};

PlayerControls.defaultProps = {
    speedOptions: [
        {value: 1600, label: '&#188; x'},
        {value: 800, label: '&#189; x'},
        {value: 400, label: '1 x', selected: true},
        {value: 200, label: '2 x'},
        {value: 100, label: '4 x'},
    ]
};