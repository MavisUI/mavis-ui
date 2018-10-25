import React from 'react';
import {observer} from 'mobx-react';
import Tabs from '../_ui/tabs/Tabs';
import Tab from '../_ui/tabs/Tab';

@observer
export class SettingsPage extends React.Component {
    render() {
        return (
            <div id="settings">
                <Tabs>
                    <Tab title="Custom">
                        Custom
                    </Tab>
                    <Tab title="Presets">
                        Presets
                    </Tab>
                    <Tab title="Verfahren">
                        Verfahren
                    </Tab>
                </Tabs>
            </div>
        )
    }
}