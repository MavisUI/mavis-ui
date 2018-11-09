import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../../_ui/icon/Icon';
import {inject, observer} from 'mobx-react';
import Store from '../../Store';
import * as mobx from 'mobx';
import {observable} from 'mobx';
import CommentSideSelection from './CommentSideSelection';
import Button from '../../_ui/button/Button';
import Notification, {NotificationMessages} from '../../_ui/notification/Notification';

@inject('store')
@observer
export default class Comment extends React.Component {

    @observable markers = [];
    @observable ratings = [];
    @observable commentToEdit = {};

    constructor(props) {
        super(props);
        this.state = {
            showNotification: false,
            message: null
        };
        this.cloneCommentToEdit();
    }

    /**
     * Loads the data for the drop downs.
     * @inheritDoc
     */
    componentDidMount() {
        this.loadData();
    }

    /**
     * @inheritDoc
     * @param prevProps
     */
    componentDidUpdate(prevProps) {
        let {commentToEdit, store} = {...this.props};

        if (commentToEdit !== prevProps.commentToEdit) {
            this.cloneCommentToEdit();
        }
    }

    render() {
        let {open, onClose, frame, baseImagePath} = {...this.props},
            {showNotification, message} = {...this.state},
            css = classNames('comment', {hidden: !open}),
            frequencyMetric = this.getMetricForMarkerId(this.commentToEdit.case),
            isNewEntry = this.commentToEdit._id === undefined;
        return (
            <div className={css}>
                <div className="comment__item comment__close" >
                    <button className="comment__close__button" onClick={() => this.onClose()}>
                        <Icon name="iconCancel"/> schließen
                    </button>
                </div>
                <h2 className="comment__headline">
                    {isNewEntry ? 'Eintrag erstellen' : 'Eintrag bearbeiten'}
                </h2>

                <div className="comment__item comment__cases" id="commentCases">
                    <label>Merkmal</label>
                    <select id="commentCasesSelection"
                            value={this.commentToEdit.case}
                            onChange={(e) => {
                                let markerId = e.target.value,
                                    marker = this.getMarker(markerId),
                                    metric = this.getMetricForMarkerId(markerId);
                                this.commentToEdit.case = markerId;
                                this.commentToEdit.label = marker.label;
                                this.commentToEdit.metric = metric && metric.metric || '';
                            }}>

                        <option value="">Schadensmerkmal auswählen</option>
                        {this.markers.map((marker, i) => <option key={marker._id}
                                                                 value={marker._id}>{marker.label}</option>)}
                    </select>
                </div>

                <div className="comment__item comment__rating" id="commentRating">
                    <label>Schadensklasse</label>
                    <select id="commentRatingSelection"
                            value={this.commentToEdit.rating}
                            onChange={(e) => this.commentToEdit.rating = Number(e.target.value)}>

                        {this.ratings.map((rating, i) => <option key={rating.id}
                                                                 value={rating.id}>{rating.name}</option>)}
                    </select>
                </div>

                <div className="comment__item comment__position">
                    <label htmlFor="commentPositionInput">Von (m)</label>
                    <input type="number"
                           id="commentPositionInput"
                           value={this.commentToEdit.position}
                           onChange={(e) => this.commentToEdit.position = Number(e.target.value)}
                           min="0"
                           steps="0.1"/>
                </div>

                <div className="comment__item comment__distance">
                    <label htmlFor="commentDistanceInput">Bis (m)</label>
                    <input type="number"
                           id="commentDistanceInput"
                           value={(Number(this.commentToEdit.position) + Number(this.commentToEdit.distance)).toFixed(2)}
                           min={Number(this.commentToEdit.position) + 0.1}
                           steps="0.1"
                           onChange={(e) => this.commentToEdit.distance = Number(e.target.value) - this.commentToEdit.position}/>
                </div>

                <div className="comment__item comment__frequency">
                    <label htmlFor="commentFrequencyInput">Häufigkeit/Strecke</label>
                    <input type="number"
                           id="commentFrequencyInput"
                           className="comment__frequency__input"
                           value={this.commentToEdit.value}
                           min="0"
                           onChange={(e) => this.commentToEdit.value = Number(e.target.value)}/>
                    <span className="comment__frequency__metric"
                          dangerouslySetInnerHTML={{__html: frequencyMetric && frequencyMetric.metric}}/>
                </div>

                <div className="comment__item comment__images">
                    <label>Betroffene Seiten</label>
                    <div>
                        <CommentSideSelection
                            value={this.commentToEdit.sides}
                            frame={frame}
                            baseImagePath={baseImagePath}
                            onChange={(sides, images) => {
                                this.commentToEdit.sides = sides;
                                this.commentToEdit.images = images;
                            }}/>
                    </div>
                </div>

                <div className="comment__item comment__text" id="commentText">
                    <label htmlFor="commentTextInput">Kommentar </label>
                    <textarea id="commentTextInput"
                              value={this.commentToEdit.caption}
                              onChange={(e) => this.commentToEdit.caption = e.target.value}/>
                </div>
                <div className="comment__item comment__functions">
                    <Button id="commentReset" type="transparent" onClick={() => this.onReset()}><Icon
                        name="iconRefresh"/> zurücksetzen</Button>
                    {isNewEntry &&
                    <Button id="commentCancel" type="cancel" onClick={() => this.onCancel()}><Icon
                        name="iconCancel"/> abbrechen</Button>
                    }
                    {!isNewEntry &&
                    <Button id="commentRemove" type="grey" onClick={() => this.onDelete()}>
                        <Icon name="iconTrash"/> löschen
                    </Button>
                    }
                    <Button id="commentSave" type="confirm" onClick={() => this.onSave()}>
                        <Icon name="iconConfirm"/> speichern
                    </Button>
                </div>
                <Notification show={showNotification} message={message} onClick={() => this.hideNotification()}/>
            </div>
        )
    }

    /**
     * Validates the current marker.
     * @returns {boolean}
     */
    validate() {
        let c = this.commentToEdit;

        if (!c.case) {
            this.showNotification(NotificationMessages.WARNING_PLEASE_SELECT_MARKER);
            return false;
        }
        if ((c.images || []).length === 0) {
            this.showNotification(NotificationMessages.WARNING_PLEASE_SELECT_SIDES);
            return false;
        }
        return true;
    }

    //// EVENT HANDLERS

    /**
     * Saves the changes to the db.
     */
    onSave() {
        let {onSave, store} = {...this.props},
            db = store.stores.results,
            comment = mobx.toJS(this.commentToEdit);
        if (this.validate()) {
            let promise;
            if (comment._id) {
                promise = db.update({_id: comment._id}, {$set: comment});
            } else {
                promise = db.insert(comment);
            }
            promise
                .then(() => {
                    this.showNotification(NotificationMessages.SUCCESS_CHANGES_HAVE_BEEN_SAVED);
                    onSave(comment);
                })
                .catch(err => {
                    console.error(err);
                    this.showNotification(NotificationMessages.ERROR_FAILURE_TO_SAVE_DATA);
                });

            // ;
        }

    }

    /**
     * Deletes the marker from the db.
     */
    onDelete() {
        let {onDelete, store} = {...this.props},
            db = store.stores.results,
            comment = mobx.toJS(this.commentToEdit);

        db.remove({_id: comment._id})
            .then(() => {
                this.showNotification(NotificationMessages.SUCCESS_CHANGES_HAVE_BEEN_SAVED);
                onDelete(comment);
            })
            .catch(err => {
                console.error(err);
                this.showNotification(NotificationMessages.ERROR_FAILURE_TO_SAVE_DATA);
            });

    }

    /**
     * Event handler when the user clicks the cancel button.
     */
    onCancel() {
        let {onCancel} = {...this.props};
        onCancel();
    }

    /**
     * Event handler when the user clicks the reset button.
     */
    onReset() {
        this.cloneCommentToEdit();
    }

    /**
     * Event handler when the user clicks the close button.
     */
    onClose() {
        let {onClose} = {...this.props};
        onClose();
    }

    /**
     * Shows the given notification message
     * @param message
     */
    showNotification(message) {
        this.setState({
            showNotification: true,
            message: message
        });
    }

    /**
     * Hides the notification
     */
    hideNotification() {
        this.setState({
            showNotification: false
        });
    }


    //// DATA LOADING

    /**
     * Loads the data from the store to populate the dropdowns.
     */
    loadData() {
        this.loadMarkers();
        this.loadRatings();
    }

    /**
     * Loads the markers.
     */
    loadMarkers() {
        let {store} = {...this.props};
        store.stores.modules
            .find({active: true})
            .sort({name: 1})
            .then(markers => {
                this.markers = markers
            });
    }

    /**
     * Loads the ratings
     */
    loadRatings() {
        let {store} = {...this.props};
        store.stores.classes
            .find({})
            .sort({id: 1})
            .then(ratings => {
                this.ratings = ratings;
            });
    }

    /**
     *  Returns the metric for the given marker index.
     * @param markerId
     * @returns {*|null}
     */
    getMetricForMarkerId(markerId) {
        let {store} = {...this.props},
            marker = this.getMarker(markerId);

        return marker && store.metrics.find(metric => metric.id === marker.metric) || null;
    }

    /**
     * Returns the marker based on the id.
     * @param markerId
     * @returns {*}
     */
    getMarker(markerId) {
        return this.markers.find(m => m._id === markerId);
    }

    /**
     * Clones the given comment so it can be edited with changing the given one.
     * If no comment is given, an empty comment will be created
     */
    cloneCommentToEdit() {
        let {commentToEdit, cable, position} = {...this.props};

        this.commentToEdit = commentToEdit ? {...commentToEdit} : {...EmptyComment, position: position};
        this.commentToEdit.cable = cable;
    }
}

Comment.propTypes = {
    store: PropTypes.instanceOf(Store),
    open: PropTypes.bool,
    commentToEdit: PropTypes.object,
    position: PropTypes.number,
    cable: PropTypes.number,
    frame: PropTypes.number,
    baseImagePath: PropTypes.string,
    onClose: PropTypes.func,
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
};
Comment.defaultProps = {
    onCancel: () => {
    },
    onSave: () => {
    },
    onDelete: () => {
    },
    onClose: () => {
    },
    position: 0
};

export const EmptyComment = {
    type: 'manual',
    caption: '',
    case: '',
    distance: 0.1,
    metric: -1,
    position: 0.0,
    rating: 0,
    sides: [],
    value: 0,
    images: [],
    cable: 0
};