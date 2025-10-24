/*
 * Copyright 2025, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState } from 'react';
import { InputGroup } from 'react-bootstrap';
import Message from '@mapstore/framework/components/I18N/Message';

//TODO Annotations use  client/MapStore2/web/client/components/misc/coordinateeditors/editors/CRSCoordinateEditor.jsx
//import CRSCoordinateEditor from '@mapstore/framework/components/misc/coordinateeditors/editors/CRSCoordinateEditor';
//import DecimalCoordinateEditor from './editors/DecimalCoordinateEditor';
//import AeronauticalCoordinateEditor from './editors/AeronauticalCoordinateEditor';

import CoordinateEntry from '@mapstore/framework/components/misc/coordinateeditors/CoordinateEntry';

const InputCoordinates = ({
    coordinates = [
        { x: 11, y: 45 }
    ],
    format =  'decimal',
    onChange
}) => {
    const [currentCoords, setCurrentCoords] = useState(coordinates);

    function handleChange(newPoint) {
        const updatedValues = [...currentCoords, newPoint];
        setCurrentCoords(updatedValues);
        onChange(updatedValues);
    }

    return (
        <div className="reprojection-coordinates">
            <div className="input-group-container">
                <InputGroup>
                    <InputGroup.Addon><Message msgId="latitude"/></InputGroup.Addon>
                    <CoordinateEntry
                        format={format}
                        coordinate="lat"
                        value={currentCoords[0].y}
                        // onChange={(dd) => handleChange([dd, currentCoords[1]])}
                    />
                </InputGroup>
            </div>
            <div className="input-group-container">
                <InputGroup>
                    <InputGroup.Addon><Message msgId="longitude"/></InputGroup.Addon>
                    <CoordinateEntry
                        format={format}
                        coordinate="lon"
                        value={currentCoords[0].x}
                        // onChange={(dd) => handleChange([currentCoords[0], dd])}
                    />
                </InputGroup>
            </div>
        </div>
    );
};

export default InputCoordinates;
