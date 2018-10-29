import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../../_ui/icon/Icon';
import {inject, observer} from 'mobx-react';
import Store from '../../Store';
import {observable} from 'mobx';
import CommentSideSelection from './CommentSideSelection';
import Button from '../../_ui/button/Button';

@inject('store')
@observer
export default class Comment extends React.Component {

    @observable markers = [];
    @observable ratings = [];
    @observable commentToEdit = {};

    constructor(props) {
        super(props);
        this.cloneCommentToEdit();
    }

    /**
     * Loads the data for the drop downs.
     * @inheritDoc
     */
    componentDidMount() {
        let {commentToEdit} = {...this.props};
        this.loadData();
    }

    /**
     * @inheritDoc
     * @param prevProps
     */
    componentDidUpdate(prevProps) {
        let {commentToEdit, store} = {...this.props};

        if (commentToEdit !== prevProps.commentToEdit) {
            this.commentToEdit = commentToEdit ? {...commentToEdit} : {...EmptyComment};
        }
    }

    render() {
        let {open, onClose, frame, baseImagePath} = {...this.props},
            css = classNames('comment', {hidden: !open}),
            frequencyMetric = this.getMetricForMarker(this.commentToEdit.case);
        console.log('comment to edit', this.commentToEdit);
        return (
            <div className={css}>
                <div className="inner">
                    <div className="comment__item" id="commentClose">
                        <button id="commentCloseButton" onClick={() => this.onClose()}>
                            <Icon name="iconCancel"/> schließen
                        </button>
                    </div>
                    <h2 className="comment__headline">
                        {this.commentToEdit.id ? 'Eintrag bearbeiten' : 'Eintrag erstellen'}
                    </h2>

                    <div className="comment__item" id="commentCases">
                        <label>Merkmal</label>
                        <select id="commentCasesSelection"
                                value={this.commentToEdit.case}
                                onChange={(e) => this.commentToEdit.case = e.target.value}>

                            <option value="">Schadensmerkmal auswählen</option>
                            {this.markers.map((marker, i) => <option key={marker._id}
                                                                     value={marker._id}>{marker.label}</option>)}
                        </select>
                    </div>

                    <div className="comment__item" id="commentRating">
                        <label>Schadensklasse</label>
                        <select id="commentRatingSelection"
                                value={this.commentToEdit.rating}
                                onChange={(e) => this.commentToEdit.rating = Number(e.target.value)}>

                            {this.ratings.map((rating, i) => <option key={rating.id}
                                                                     value={rating.id}>{rating.name}</option>)}
                        </select>
                    </div>

                    <div className="comment__item" id="commentPosition">
                        <label htmlFor="commentPositionInput">Von (m)</label>
                        <input type="number"
                               id="commentPositionInput"
                               value={this.commentToEdit.position}
                               onChange={(e) => this.commentToEdit.position = Number(e.target.value)}
                               min="0"
                               steps="0.1"/>
                    </div>

                    <div className="comment__item" id="commentDistance">
                        <label htmlFor="commentDistanceInput">Bis (m)</label>
                        <input type="number"
                               id="commentDistanceInput"
                               value={Number(this.commentToEdit.position) + Number(this.commentToEdit.distance)}
                               min={Number(this.commentToEdit.position) + 0.1}
                               steps="0.1"
                               onChange={(e) => this.commentToEdit.distance = Number(e.target.value) - this.commentToEdit.position}/>
                    </div>

                    <div className="comment__item" id="commentFrequency">
                        <label htmlFor="commentFrequencyInput">Häufigkeit/Strecke</label>
                        <input type="number"
                               id="commentFrequencyInput"
                               value={this.commentToEdit.value}
                               min="0"
                               onChange={(e) => this.commentToEdit.value = Number(e.target.value)}/>
                        <span className="comment__frequency__metric" dangerouslySetInnerHTML={{__html: frequencyMetric && frequencyMetric.metric}}/>
                    </div>

                    <div className="comment__item" id="commentImages">
                        <label>Betroffene Seiten</label>
                        <div id="commentImagesContainer">
                            <CommentSideSelection
                                value={this.commentToEdit.sides}
                                frame={frame}
                                baseImagePath={baseImagePath}
                                onChange={(sides) =>  this.commentToEdit.sides = sides}/>
                        </div>
                    </div>

                    <div className="comment__item" id="commentText">
                        <label htmlFor="commentTextInput">Kommentar </label>
                        <textarea id="commentTextInput"
                                  value={this.commentToEdit.caption}
                                  onChange={(e) => this.commentToEdit.caption = e.target.value}/>
                    </div>
                    <div className="comment__item" id="commentFunctions">
                        <Button id="commentReset" type="transparent" onClick={() => this.onReset()}><Icon name="iconRefresh"/> zurücksetzen</Button>
                        {!this.commentToEdit.id &&
                            <Button id="commentCancel" type="cancel" onClick={() => this.onCancel()}><Icon name="iconCancel"/> abbrechen</Button>
                        }
                        {this.commentToEdit.id &&
                            <Button id="commentRemove" type="grey" onClick={() => this.onDelete()}>
                                <Icon name="iconTrash"/> löschen
                            </Button>
                        }
                        <Button id="commentSave" type="confirm" onClick={() => this.onSave()}>
                            <Icon name="iconConfirm" /> speichern
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    validate() {

    }

    //// EVENT HANDLERS

    onSave() {
        let {onSave, store} = {...this.props};
        if (this.validate()) {
            store.stores.results
        }
        onSave();
    }

    onDelete() {
        let {onDelete} = {...this.props};
        onDelete();
    }

    onCancel() {
        let {onCancel} = {...this.props};
        onCancel();
    }

    onReset() {
        this.cloneCommentToEdit();
    }

    onClose() {
        let {onClose} = {...this.props};
        onClose();
    }


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
    getMetricForMarker(markerId) {
        let {store} = {...this.props},
            marker = this.markers.find(m => m._id ===  markerId);

        return marker && store.metrics.find(metric => metric.id === marker.metric) || null;
    }

    /**
     * Clones the given comment so it can be edited with changing the given one.
     * If no comment is given, an empty comment will be created
     */
    cloneCommentToEdit() {
        let {commentToEdit} = {...this.props};
        this.loadData();
        this.commentToEdit = commentToEdit ? {...commentToEdit} : {...EmptyComment};
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
    onCancel: () => {},
    onSave: () => {},
    onDelete: () => {},
    onClose: () => {},
    position: 0
};

const EmptyComment = {
    caption: '',
    case: '',
    distance: 0.1,
    metric: -1,
    position: 0.0,
    rating: 0,
    sides: [],
    value: 0,
};