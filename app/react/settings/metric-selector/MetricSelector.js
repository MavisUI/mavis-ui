import React from 'react';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import Store from '../../Store';

@inject('store')
@observer
export default class MetricSelector extends React.Component{
    render() {
        let {selected, store, onChange, viewOnly} = {...this.props},
            selectedMetric = store.metrics.find(metric =>  metric.id === selected);
        return (
            <div className="metricSelector">
                {viewOnly ?
                    <span dangerouslySetInnerHTML={{__html: selectedMetric && selectedMetric.metric}} />
                    :
                    <select className="metricSelector__select" value={selected} onChange={(e) => onChange(e.target.value)}>
                        {store.metrics.map(metric => <option key={metric.id} value={metric.id} dangerouslySetInnerHTML={{__html: metric.metric}} />)}
                    </select>
                }
            </div>

        );
    }
}

MetricSelector.propTypes = {
    store: PropTypes.instanceOf(Store),
    selected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func,
    viewOnly: PropTypes.bool
};

MetricSelector.defaultProps = {
    onChange: () => {}
};