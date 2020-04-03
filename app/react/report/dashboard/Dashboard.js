import React from 'react';
import Filter from '../../_ui/filter/Filter';
import MarkerCountChart from './MarkerCountChart';
import RatingCountChart from './RatingCountChart';
import SidesAffectedChart from './SidesAffectedChart';

export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            criteria: null
        }
    }

    render() {
        let {data, criteria} = {... this.state};
        return (
            <div className="dashboard" id="reportDashboard">
                <Filter onChange={(d, c) => this.setState({data: d, criteria: c})} hideSort={true}/>
                <div className="dashboard__charts">
                    <div className="dashboard__chart">
                        <MarkerCountChart data={data} criteria={criteria}/>
                    </div>
                    <div className="dashboard__chart">
                        <RatingCountChart data={data} criteria={criteria}/>
                    </div>
                    <div className="dashboard__chart">
                        <SidesAffectedChart data={data} criteria={criteria}/>
                    </div>
                </div>
            </div>
        )
    }
}