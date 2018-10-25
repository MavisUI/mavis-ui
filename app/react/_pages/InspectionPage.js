import React from 'react';
import {observer} from 'mobx-react';
import Player from '../visual-inspection/player/Player';

@observer
export class InspectionPage extends React.Component {
    render() {
        return (
            <div className="inner">',
                <div id="inspection">
                    <Player/>
                </div>
            </div>
        )
    }
}