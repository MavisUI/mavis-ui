import React from 'react';
import PropTypes from 'prop-types';
import chunk from 'lodash/chunk';
import range from 'lodash/range';
import padStart from 'lodash/padStart'
import Icon from '../../_ui/icon/Icon';
import path from 'path';
import Modal from '../../_ui/modal/Modal';

export default class PlayerSideView extends React.Component {

    /**
     * Returns the image file name for the given frame.
     * @param frame
     * @returns {string}
     */
    static getFileName(frame) {
        return padStart(frame + 1, 4, '0') +'.jpg';
    }

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            selectedSide: null,
            modalOpen: false
        }
    }

    /**
     * @inheritDoc
     * @returns {*}
     */
    render() {
        let {frame} = {...this.props},
            {modalOpen, selectedSide} = {...this.state},
            pictures = this.getPictures(frame),
            pictureChunks = chunk(pictures, 3);
        // preload next images
        this.getPictures(frame + 1);

        return (
            <div className="playerSideView">
                <div id="pictures">
                    {pictureChunks.map((pictureChunk, i) => <div key={i} className="pictureRow">{pictureChunk}</div>)}
                </div>
                <Modal open={modalOpen} type="full" onClose={() => this.setState({modalOpen: false})}>
                    {selectedSide !== null &&
                        <div className="playerSideView__modal" style={{backgroundImage: 'url(' + this.getImageForSide(selectedSide, frame) + ')'}}/>
                    }
                </Modal>
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
        let {sides} = {...this.props};
        return range(sides).map((side, i) => {
            let imagePath = this.getImageForSide(side, frame),
                preload = new Image();
            preload.src = imagePath;
            return (
                <div key={i} className="pictureWindow playerSideView__window">
                    <div className="picture playerSideView__picture" style={{backgroundImage: 'url(' + imagePath + ')'}} onClick={() => this.openModal(side)}>
                        <Icon name={'iconCableActive' + i}/>
                    </div>
                </div>
            );
        });
    }

    /**
     * Returns the image path for the given side and frame.
     * @param {number} side
     * @param {number} frame
     * @returns {string}
     */
    getImageForSide(side, frame) {
        let {basePath, maxFrames} = {...this.props},
            fileName;
        frame = Math.min(frame, maxFrames);
        fileName = PlayerSideView.getFileName(frame);
        return [basePath, side, fileName].join('/');
    }



    /**
     * Opens the modal with the given side
     * @param withSide
     */
    openModal(withSide) {
        this.setState({
            selectedSide: withSide,
            modalOpen: true
        });
    }
}

PlayerSideView.propTypes = {
    sides: PropTypes.number,
    frame: PropTypes.number,
    maxFrames: PropTypes.number,
    basePath: PropTypes.string
};