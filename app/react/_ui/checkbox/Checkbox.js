import React from 'react';
import crypto  from  'crypto';

export default class Checkbox extends React.Component {

    constructor(props) {
        super(props);
        this.id = ['checkbox',crypto.randomBytes(16).toString("hex")].join('_')
    }

    render() {
        return (
            <div className="checkbox">
                <input className="checkbox__input" type="checkbox"  {...this.props} id={this.id} />
                <label className="checkbox__proxy" htmlFor={this.id} />
            </div>
        )
    }
}
