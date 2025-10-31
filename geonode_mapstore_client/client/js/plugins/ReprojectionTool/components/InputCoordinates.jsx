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

import CoordinatesEditor from '@mapstore/framework/components/mapcontrols/annotations/CoordinatesEditor';

const InputCoordinates = ({
    coordinates = [],
    onChange = () => {},
    onValidation = () => {}
}) => {
    
    const [currentCoords, setCurrentCoords] = useState(coordinates);
    const [format, setFormat] = useState('decimal'); // 'decimal' or 'aeronautical'

    React.useEffect(() => {
        setCurrentCoords(coordinates);
    }, [coordinates]);

    const componentsValidation = {
        "MultiPoint": {
            min: 1, //specific case min is 1
            add: true,
            remove: true,
            validation: "validateCoordinates",
            notValid: "annotations.editor.notValidPolyline"
        }
    }

    const validateLonLat = coord => {
        return coord && 
               typeof coord.lon !== 'undefined' && 
               typeof coord.lat !== 'undefined' &&
               !isNaN(coord.lon) && 
               !isNaN(coord.lat);
    };

    return (
        <Form className="reprojection-coordinates" style={{ display: 'flex', gap: '5px' }}>
            <InputGroup>
                <CoordinatesEditor
                    type="MultiPoint"
                    format={format}
                    items={[]}
                    components={currentCoords}
                    componentsValidation={componentsValidation}
                    onRemove={() => {}}
                    onValidateFeature={onValidation}
                    onChangeFormat={setFormat}
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
