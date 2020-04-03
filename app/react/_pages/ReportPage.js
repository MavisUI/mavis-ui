import React from 'react';
import {observer} from 'mobx-react';
import Tabs from '../_ui/tabs/Tabs';
import Tab from '../_ui/tabs/Tab';
import Dashboard from '../report/dashboard/Dashboard';
import MarkerList from '../report/marker-list/MarkerList';

@observer
export class ReportPage extends React.Component {
    render() {
        return (
            <div>
                <Tabs>
                    <Tab title="Dashboard">
                        <Dashboard/>
                    </Tab>
                    <Tab title="Liste">
                        <MarkerList/>
                    </Tab>
                </Tabs>
            </div>
        )
    }
}