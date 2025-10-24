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
//import MessageHtml from '@mapstore/framework/components/I18N/HTML';

//TODO Annotations use  client/MapStore2/web/client/components/misc/coordinateeditors/editors/CRSCoordinateEditor.jsx
//import CRSCoordinateEditor from '@mapstore/framework/components/misc/coordinateeditors/editors/CRSCoordinateEditor';
//import DecimalCoordinateEditor from './editors/DecimalCoordinateEditor';
//import AeronauticalCoordinateEditor from './editors/AeronauticalCoordinateEditor';

import CoordinateEntry from '@mapstore/framework/components/misc/coordinateeditors/CoordinateEntry';

const InputCrs = ({
    crsOrigin,
    crsTarget,
    onChange
}) => {
    const [crsOrigin, setCrsOrigin] = useState(crsOrigin);
    const [crsTarget, setCrsTarget] = useState(crsTarget);

    //TODO move in config in first step and next retrieve from geoserver
    const CRS_OPTIONS = [
        { value: "EPSG:4326", label: "EPSG:4326 (WGS84)" },
        { value: "EPSG:3857", label: "EPSG:3857 (Web Mercator)" }
    ];


    function handleChange(newCrs) {
        setCurrentCoords(updatedValues);
        onChange(updatedValues);
    }

    return (
        <Form className="reprojection-crs" style={{ display: 'flex', gap: '5px' }}>
            <div className="col-6">
                <label htmlFor="source-crs">Source CRS</label>
                <select id="source-crs" className="form-control"
                    onChange={(e) => setCrsOrigin(e.target.value)}
                    value={crsOrigin}
                >
                    <option value="">Select Source CRS</option>
                    {CRS_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="col-6">
                <label htmlFor="target-crs">Target CRS</label>
                <select id="target-crs" className="form-control">
                    <option value="">Select Target CRS</option>
                    {CRS_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

        </Form>
    );
};

export default InputCrs;
