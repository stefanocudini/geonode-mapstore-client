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

const InputCrs = ({
    crsOrigin,
    crsTarget,
    onChange = () => {}
}) => {
    const [origin, setOrigin] = useState(crsOrigin);
    const [target, setTarget] = useState(crsTarget);

    //TODO move in config in first step and next retrieve from geoserver
    const CRS_OPTIONS = [
        { value: "EPSG:4326", label: "EPSG:4326 (WGS84)" },
        { value: "EPSG:3857", label: "EPSG:3857 (Web Mercator)" }
    ];

    const handleCrsChange = (type, value) => {
        if (type === 'origin') {
            setOrigin(value);
            onChange({ crsOrigin: value, crsTarget: target });
        } else {
            setTarget(value);
            onChange({ crsOrigin: origin, crsTarget: value });
        }
    };

    return (
        <Form className="reprojection-crs" style={{ display: 'flex', gap: '5px' }}>
            <div className="col-6">
                <label htmlFor="source-crs">Source CRS</label>
                <select id="source-crs" className="form-control"
                    onChange={(e) => handleCrsChange('origin', e.target.value)}
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
                <select id="target-crs" className="form-control"
                    onChange={(e) => handleCrsChange('target', e.target.value)}
                    value={crsTarget}
                >
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
