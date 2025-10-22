
//TODO multiple input coordantes formats
// https://github.com/geosolutions-it/armenia-geonode/issues/24#issuecomment-3406474011

//TODO try to reuse Annotations Point inuput comp:
// client/MapStore2/web/client/components/misc/coordinateeditors/editors/CRSCoordinateEditor.jsx
import React, { useState } from 'react';
import { InputGroup, FormGroup } from 'react-bootstrap';
import Message from '@mapstore/framework/components/I18N/Message';

//import CRSCoordinateEditor from '@mapstore/framework/components/misc/coordinateeditors/editors/CRSCoordinateEditor';
//import DecimalCoordinateEditor from './editors/DecimalCoordinateEditor';
//import AeronauticalCoordinateEditor from './editors/AeronauticalCoordinateEditor';
import CoordinateEntry from '@mapstore/framework/components/misc/coordinateeditors/CoordinateEntry';


const inputPoints = ({
    points = [],
    format =  'decimal',
    onChange,
    idx
}) => {
    const [currentValue, setCurrentValue] = useState(value);

    function handleChange(newCoord) {
        const updatedValues = [...currentValue, newCoord];
        setCurrentValue(updatedValues);
        onChange(updatedValues);
    }

    return (
        <div className="coordinate">
            <div className="input-group-container">
                <InputGroup>
                    <InputGroup.Addon><Message msgId="latitude"/></InputGroup.Addon>
                    <CoordinateEntry
                        format={format}
                        coordinate="lat"
                        value={currentValue[0]}
                        onChange={(dd) => handleChange([dd, currentValue[1]])}
                        onKeyDown={this.onSubmit}
                    />
                </InputGroup>
            </div>
            <div className="input-group-container">
                <InputGroup>
                    <InputGroup.Addon><Message msgId="longitude"/></InputGroup.Addon>
                    <CoordinateEntry
                        disabled={this.props.disabled}
                        format={this.props.format}
                        aeronauticalOptions={this.props.aeronauticalOptions}
                        coordinate="lon"
                        value={this.state.lon}
                        onChange={(dd) => this.onChangeLatLonHeight("lon", dd)}
                        onKeyDown={this.onSubmit}
                    />
                </InputGroup>
            </div>
        </div>
    );
};  
export default inputPoints;
