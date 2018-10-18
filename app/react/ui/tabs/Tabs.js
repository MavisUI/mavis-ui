import React from 'react';
import classNames from 'classnames';

export default class Tabs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0
        }
    };

    render() {
        let {children} = {...this.props},
            {selectedIndex} = {...this.state};
        return (
            <div className="tabs">
                <div className="tabs__header">
                    {(children || []).map((c, i) => {
                        let css = classNames({tab__header__item: true,  active: i === selectedIndex});
                        return (
                            <a key={i}
                               className={css}
                               onClick={() => this.onClickTab(i)}>
                                {c.props.title}
                            </a>
                        );
                    })}
                </div>
                <div className="tabs__content">
                    {(children || []).filter((c, i) => i === selectedIndex)}
                </div>
            </div>
        )
    }

    onClickTab(index) {
        return this.setState({selectedIndex: index});
    }
}