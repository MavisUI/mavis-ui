import React from 'react';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import Store from '../../Store';

@inject('store')
@observer
export default class MetricSelector extends React.Component{
    render() {
        let {selected, store, onChange} = {...this.props};
        return (
            <select className="metricSelector" value={selected} onChange={(e) => onChange(e.target.value)}>
                {store.metrics.map(metric => <option key={metric.id} value={metric.id} dangerouslySetInnerHTML={{__html: metric.metric}} />)}
            </select>
        );
    }
}

MetricSelector.propTypes = {
    store: PropTypes.instanceOf(Store),
    selected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func
};

MetricSelector.defaultProps = {
    onChange: () => {}
};