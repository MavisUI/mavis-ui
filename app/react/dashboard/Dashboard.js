import React from 'react';
import Filter from '../ui/filter/Filter';

export default class Dashboard extends React.Component {
    render() {
        return (
            <div className="dashboard">
                <Filter/>
                Dashboard
            </div>
        )
    }
}