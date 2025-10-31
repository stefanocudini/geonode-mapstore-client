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
    crsList = [],
    crsSource,
    crsTarget,
    onChange = () => {}
}) => {
    const [source, setSource] = useState(crsSource);
    const [target, setTarget] = useState(crsTarget);

    React.useEffect(() => {
        setSource(crsSource);
        setTarget(crsTarget);
    }, [crsSource, crsTarget]);

    const handleCrsChange = (type, value) => {
        if (type === 'source') {
            setSource(value);
            onChange({ crsSource: value, crsTarget: target });
        } else {
            setTarget(value);
            onChange({ crsSource: source, crsTarget: value });
        }
    };

    return (
        <Form className="reprojection-crs" style={{ display: 'flex', gap: '5px' }}>
            <div className="col-6">
                <label htmlFor="source-crs">Source CRS</label>
                <select id="source-crs" className="form-control"
                    placeholder="Select Source CRS"
                    onChange={(e) => handleCrsChange('source', e.target.value)}
                    value={source}
                >
                    {crsList.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="col-6">
                <label htmlFor="target-crs">Target CRS</label>
                <select id="target-crs" className="form-control"
                    placeholder="Select Target CRS"
                    onChange={(e) => handleCrsChange('target', e.target.value)}
                    value={target}
                >
                    {crsList.map(option => (
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
