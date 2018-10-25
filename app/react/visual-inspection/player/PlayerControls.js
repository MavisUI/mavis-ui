import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../_ui/icon/Icon';

export default class PlayerControls extends React.Component {

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            interval: null
        }
    }

    /**
     * @inheritDoc
     * @param prevProps
     */
    componentDidUpdate(prevProps) {
        let {speed, position, maxPosition} = {...this.props};
        if (speed !== prevProps.speed && this.isPlaying()) {
            this.pause();
            this.play();
        }
        if (position > maxPosition) {
            this.setPosition(maxPosition);
        }
    }

    /**
     * @inheritDoc
     * @returns {*}
     */
    render() {
        let {position, speedOptions, speed, onChangeSpeed} = {...this.props},
            isPlaying = this.isPlaying();
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
                        {!isPlaying && <Icon name="iconPlay" />}
                        {isPlaying && <Icon name="iconPause" /> }
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

    /**
     * Toggles play and pause of the player.
     */
    toggle() {
        this.state.interval ? this.pause() : this.play();
    }

    /**
     * Starts playing
     */
    play() {
        let {speed} = {...this.props},
            {interval} = {... this.state};
        if (interval) {
            clearInterval(interval);
        }
        interval = setInterval(() => {
            let {position, maxPosition} = {...this.props},
                pos = +(position * 100);
            pos++;
            pos = (pos / 100).toFixed(2);
            pos = Math.min(pos, maxPosition);
            this.setPosition(+pos);
            if (pos === maxPosition) {
                this.pause();
            }

        }, speed);
        this.setState({
            interval: interval
        });
    }

    /**
     * Stops playing.
     */
    pause() {
        if (this.state.interval) {
            clearInterval(this.state.interval);
        }
        this.setState({
            interval: null
        });
    }

    /**
     * Sets the position of the player.
     * @param {number} position
     */
    setPosition(position) {
        position = +position;
        let {onChangePosition} = {...this.props};
        if (onChangePosition) {
            onChangePosition(position);
        }
    }

    /**
     * Sets the speed
     * @param {number} speed
     */
    setSpeed(speed) {
        let {onChangeSpeed} = {...this.props};
        speed = parseInt(speed);
        if (onChangeSpeed) {
            onChangeSpeed(speed);
        }
    }

    /**
     * Jumps to the start.
     */
    toStart() {
        // pause player
        this.pause();
        this.setPosition(0);
    }

    /**
     * Jumps to the previous frame.
     */
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

    /**
     * Jumps to the next frame
     */
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

    /**
     * Jumps to the end.
     */
    toEnd() {
        let {frames = []} = {...this.props};
        // pause player
        this.pause();
        this.setPosition(frames[frames.length - 1]);
    }

    /**
     * Returns the current frame based on the current position.
     * @returns {number}
     */
    getCurrentFrame() {
        let {frames, position} = {...this.props};
        return Math.max((frames ||[]).findIndex(frame => position < frame) - 1, 0);
    }

    /**
     * Returns true if the player is currently playing. False otherwise.
     * @returns {boolean}
     */
    isPlaying() {
        return !!this.state.interval;
    }
}

PlayerControls.propTypes = {
    position: PropTypes.number,
    maxPosition: PropTypes.number,
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