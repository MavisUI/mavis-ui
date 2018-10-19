import React from 'react';
import classNames from 'classnames';

export default class Tabs extends React.Component {

    itemRefs = [];
    lineRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0
        }
    };

    /**
     * @inheritDoc
     */
    componentDidMount() {
        this.updateLinePosition();
    }

    /**
     * @inheritDoc
     */
    componentDidUpdate() {
        this.updateLinePosition();
    }

    /**
     * @inheritDoc
     * @returns {*}
     */
    render() {
        let {children} = {...this.props},
            {selectedIndex} = {...this.state};
        return (
            <div className="tabs">
                <div className="tabs__header">
                    {(children || []).map((c, i) => {
                        this.itemRefs[i] = React.createRef();
                        let css = classNames({tab__header__item: true, active: i === selectedIndex});
                        return (
                            <a key={i}
                               ref={this.itemRefs[i]}
                               className={css}
                               onClick={() => this.onClickTab(i)}>
                                {c.props.title}
                            </a>
                        );
                    })}
                    <span className="tabs__header__line" ref={this.lineRef}/>
                </div>
                <div className="tabs__content">
                    {(children || []).filter((c, i) => i === selectedIndex)}
                </div>
            </div>
        )
    }

    /**
     * Event handler for the click event on a tab item.
     * @param {number} index
     */
    onClickTab(index) {
        this.setState({selectedIndex: index});
    }

    /**
     * Updates the line position and width based on the currently
     * selected tab item.
     */
    updateLinePosition() {
        let activeHeaderItemRef = this.itemRefs[this.state.selectedIndex],
            targetWidth, itemBox;
        if (activeHeaderItemRef && this.lineRef) {
            let itemNode = activeHeaderItemRef.current,
                lineNode = this.lineRef.current;
            if (lineNode && itemNode) {
                itemBox = itemNode.getBoundingClientRect();
                targetWidth = itemBox.width;
                lineNode.style.width = targetWidth + 'px';
                lineNode.style.transform = 'translateX(' + itemNode.offsetLeft + 'px)';
            }
        }
    }
}