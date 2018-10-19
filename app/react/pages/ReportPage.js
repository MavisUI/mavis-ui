import React from 'react';
import {observer} from 'mobx-react';
import Tabs from '../ui/tabs/Tabs';
import Tab from '../ui/tabs/Tab';
import Dashboard from '../dashboard/Dashboard';

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
                        Liste
                    </Tab>
                </Tabs>
            </div>
        )
    }
}