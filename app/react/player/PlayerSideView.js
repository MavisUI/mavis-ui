import React from 'react';
import PropTypes from 'prop-types';
import chunk from 'lodash/chunk';
import range from 'lodash/range';
import padStart from 'lodash/padStart'
import Icon from '../ui/icon/Icon';
import path from 'path';

export default class PlayerSideView extends React.Component {

    /**
     * @inheritDoc
     * @returns {*}
     */
    render() {
        let {frame} = {...this.props},
            pictures = this.getPictures(frame),
            pictureChunks = chunk(pictures, 3);
        // preload next images
        this.getPictures(frame + 1);

        return (
            <div className="playerSideView">
                <div id="pictures">
                    {pictureChunks.map((pictureChunk, i) => <div key={i} className="pictureRow">{pictureChunk}</div>)}
                </div>
            </div>
        );
    }

    /**
     * Returns picture DOM nodes for the given frame based on the amount
     * of sides passed as props.
     * @param {int} frame
     * @returns {*}
     */
    getPictures(frame) {
        let {sides, basePath, maxFrames} = {...this.props};
        frame = Math.min(frame, maxFrames);
        return range(sides).map((side, i) => {
            let fileName = this.getFileName(frame),
                imagePath = [basePath, side, fileName].join('/'),
                preload = new Image();
            preload.src = imagePath;
            return (
                <div key={i} className="pictureWindow playerSideView__window">
                    <div className="picture playerSideView__picture" style={{backgroundImage: 'url(' + imagePath + ')'}}>
                        <Icon name={'iconCableActive' + i}/>
                    </div>
                </div>
            );
        });
    }

    /**
     * Returns the image file name for the given frame.
     * @param frame
     * @returns {string}
     */
    getFileName(frame) {
        return padStart(frame + 1, 4, '0') +'.jpg';
    }
}

PlayerSideView.propTypes = {
    sides: PropTypes.number,
    frame: PropTypes.number,
    maxFrames: PropTypes.number,
    basePath: PropTypes.string
};