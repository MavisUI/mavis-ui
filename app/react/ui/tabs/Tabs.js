import React from 'react';

export default class Tabs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0
        }
    };

    render() {
        let {children} = {... this.props},
            {selectedIndex} = {... this.state};
        return (
            <div className="tabs">
                <div className="tabs__header">
                    {(children || []).map((c, i) => <a key={i} className="tab__header__item" onClick={() => this.onClickTab(i)}>{c.props.title}</a>)}
                </div>
                <div className="tabs__content">
                    {(children || []).filter((c, i) => selectedIndex === i)}
                </div>
            </div>
        )
    }

    onClickTab(index) {
        return this.setState({selectedIndex: index});
    }
}