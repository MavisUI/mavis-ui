import React from 'react';
import {observer} from 'mobx-react';
import Tabs from '../_ui/tabs/Tabs';
import Tab from '../_ui/tabs/Tab';
import {CustomMarkersList} from '../settings/custom-markers-list/CustomMarkersList';
import PresetMarkersList from '../settings/preset-markers-list/PresetMarkersList';
import Procedures from '../settings/procedures/Procedures';

@observer
export class SettingsPage extends React.Component {
    render() {
        return (
            <div id="settings">
                <Tabs>
                    <Tab title="Custom">
                        <CustomMarkersList/>
                    </Tab>
                    <Tab title="Presets">
                        <PresetMarkersList/>
                    </Tab>
                    <Tab title="Verfahren">
                        <Procedures/>
                    </Tab>
                </Tabs>
            </div>
        )
    }
}