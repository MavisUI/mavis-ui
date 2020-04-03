import React from 'react';
import {inject, observer} from 'mobx-react';
import BridgeRenderer from '../bridge-renderer/BridgeRenderer';
import Filter from '../_ui/filter/Filter';
import PropTypes from 'prop-types';
import Store from '../Store';

@inject('store')
@observer
export class ModelPage extends React.Component {

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            criteria: null
        }
    }

    render() {
        let {store} = {...this.props},
            {data} = {...this.state};
        return (
            <div>
                <Filter
                    hideCable={true}
                    hideSort={true}
                    hideCableSides={true}
                    onChange={(d, c) => this.setState({data: d, criteria: c})} />
                <BridgeRenderer markers={data} data={store.constructionData}/>
            </div>
        );
    }
}

ModelPage.propTypes = {
    store: PropTypes.instanceOf(Store)
};