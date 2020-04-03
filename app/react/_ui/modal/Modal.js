import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import Icon from '../icon/Icon';

export default class Modal extends React.Component {

    constructor(props) {
        super(props);
        this.el = document.createElement('div');
        this.timeout = null;
        this.state = {
            closed: !props.open
        };
        if (props.open) {
            this.open();
        }
    }

    componentDidUpdate(prevProps) {
        let {open} = {...this.props};
        if (prevProps.open !== open) {
            open ? this.open() : this.close();
        }
    }

    componentDidMount() {
        document.body.appendChild(this.el);
    }

    componentWillUnmount() {
        document.body.removeChild(this.el);
    }

    render() {
        return ReactDOM.createPortal(
            this.renderModal(),
            this.el,
        );
    }

    renderModal() {
        let {children, open, type} = {...this.props},
            {closed} = {...this.state},
            css = classNames({modal: true, open: open, closed: closed}),
            contentCss = classNames({modal__content: true}, type),
            styleLess = type === 'noStyle';
        return (
            <div className={css}>
                <div className="modal__overlay" onClick={() => this.tryClose()}/>
                <div className={contentCss}>
                    {!styleLess &&
                        <div className="modal__header">
                            <a className="modal__close" onClick={() =>  this.tryClose()}>
                                <Icon name="iconCancel" />
                            </a>
                        </div>
                    }
                    {children}
                </div>
            </div>
        );
    }

    open() {
        this.setState({
            closed: false
        });

    }

    close() {
        let {onClose} = {...this.props};
        onClose();
        this.setTimeout(() => {
            this.setState({
                closed: true
            });
        });
    }

    tryClose() {
        let {userCanClose} = {...this.props};
        userCanClose ? this.close() : null
    }

    setTimeout(func) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(func, 500);
    }
}

Modal.propTypes = {
    open: PropTypes.bool,
    type: PropTypes.oneOf(['small', 'medium', 'large', 'full', 'noStyle']),
    onClose: PropTypes.func,
    userCanClose: PropTypes.bool
};

Modal.defaultProps = {
    open: false,
    type: 'small',
    userCanClose: true,
    onClose: () => {}
};