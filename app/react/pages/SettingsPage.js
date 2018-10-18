import React from 'react';
import {observer} from 'mobx-react';

@observer
export class SettingsPage extends React.Component {
    render() {
        return (
            <div id="settings">Settings Page</div>
        )
    }
}