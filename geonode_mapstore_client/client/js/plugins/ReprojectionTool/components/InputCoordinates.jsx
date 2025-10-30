/*
 * Copyright 2025, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState } from 'react';
import { Form, FormGroup, ControlLabel, InputGroup } from 'react-bootstrap';
import Message from '@mapstore/framework/components/I18N/Message';
import { Glyphicon as GlyphiconRB } from 'react-bootstrap';
import tooltip from '@mapstore/framework/components/misc/enhancers/tooltip';
const Glyphicon = tooltip(GlyphiconRB);

import CoordinateEntry from '@mapstore/framework/components/misc/coordinateeditors/CoordinateEntry';
import CoordinatesEditor from '@mapstore/framework/components/mapcontrols/annotations/CoordinatesEditor';

const InputCoordinates = ({
    coordinates = [],
    //coordinates = [{x:11.1, y:46.1},{x:11.2, y:46.2}],
    format = 'decimal',
    onChange = () => {},
}) => {
    const [currentCoords, setCurrentCoords] = useState(coordinates);

    // function handleChange(idx, type, newCoord) {
    //     const updatedCoords = currentCoords.map((coord, cIdx) => {
    //         if (cIdx === idx) {
    //             return {
    //                 ...coord,
    //                 [type]: parseFloat(newCoord)
    //             };
    //         }
    //         return coord;
    //     });
    //     setCurrentCoords(updatedCoords);
    //     onChange(updatedCoords);
    // }

    const validateLonLat = coord => {
        return coord && 
               typeof coord.lon !== 'undefined' && 
               typeof coord.lat !== 'undefined' &&
               !isNaN(coord.lon) && 
               !isNaN(coord.lat);
    };

    return (
        <Form className="reprojection-coordinates" style={{ display: 'flex', gap: '5px' }}>
            {/* <InputGroup>
                <InputGroup.Addon style={{ height: '20px' }}>
                    <Message msgId="latitude"/>
                </InputGroup.Addon>
                <CoordinateEntry
                    idx={0}
                    format={format}
                    coordinate="lat"
                    value={currentCoords[0].y}
                    onChange={(dd) => handleChange(0, 'y', dd)}
                />
            </InputGroup>
            <InputGroup>
                <InputGroup.Addon>
                    <Message msgId="longitude"/>
                </InputGroup.Addon>
                <CoordinateEntry
                    idx={0}
                    format={format}
                    coordinate="lon"
                    value={currentCoords[0].x}
                    onChange={(dd) => handleChange(0, 'x', dd)}
                    onKeyDown={() => {}}
                />
            </InputGroup> */}
            <InputGroup>
                <CoordinatesEditor
                    type="MultiPoint"
                    format={format}
                    items={[]}
                    components={currentCoords}
                    onRemove={() => {}}
                    onChange={(components, radius, text, crs) => {
                        const validCoords = components.filter(validateLonLat);
                        if (validCoords.length !== components.length) {
                            return;
                        }
                        setCurrentCoords(validCoords);
                        onChange(validCoords);
                    }}/>
            </InputGroup>
        </Form>
    );
};

export default InputCoordinates;
