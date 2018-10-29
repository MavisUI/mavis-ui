import React from 'react';
import PropTypes from 'prop-types';
import range from 'lodash/range';
import Icon from '../../_ui/icon/Icon';
import classNames from 'classnames';
import PlayerSideView from '../player/PlayerSideView';

export default class CommentSideSelection extends React.Component {
    render() {
        let {maxSides, value, frame} = {...this.props};
        return (
            <div className="commentSideSelection">
                {range(maxSides).map(side => {
                    let isSelected = (value || []).indexOf(side) > -1,
                        css = classNames('commentSideSelection__image', {active: isSelected}),
                        imagePath = this.getImageForSide(side, frame);
                    return (
                        <div key={side}
                             className={css}
                             style={{backgroundImage: 'url(' + imagePath + ')'}} onClick={() =>  this.toggleSide(side)}>
                            <Icon name={'iconCableActive' + side}/>
                            <Icon name="iconConfirm" />
                        </div>
                    )
                })}
            </div>
        );
    }

    /**
     * Toggles the given side.
     * @param side
     */
    toggleSide(side) {
        let {onChange, value} = {...this.props},
            hasSideSelected = (value || []).filter(s =>  s === side).length > 0,
            newValue = (value || []).filter(s =>  s !== side);
        if (!hasSideSelected) {
            newValue.push(side);
        }
        onChange(newValue);
    }

    /**
     * Returns the image path for the given side and frame.
     * @param {number} side
     * @param {number} frame
     * @returns {string}
     */
    getImageForSide(side, frame) {
        let {baseImagePath} = {...this.props},
            fileName = PlayerSideView.getFileName(frame);
        return [baseImagePath, side, fileName].join('/');
    }
}

CommentSideSelection.propTypes = {
    frame: PropTypes.number,
    value: PropTypes.any,
    onChange: PropTypes.func,
    maxSides: PropTypes.number,
    baseImagePath: PropTypes.string
};

CommentSideSelection.defaultProps = {
    onChange: () => {},
    maxSides: 6
};