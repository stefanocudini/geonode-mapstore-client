/*
 * Copyright 2024, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, {useState} from 'react';
import { createPlugin } from '@mapstore/framework/utils/PluginsUtils';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { Form, FormGroup, ControlLabel, InputGroup, Tabs, Tab } from 'react-bootstrap';

import executeProcess from '@mapstore/framework/observables/wps/execute';
import {reprojectGeometryXML} from './observables/reprojection'

import {
    setReprojectSourceCrs,
    setReprojectTargetCrs,
    setReprojectGeom
} from './actions/reprojection';
// import reprojection from './reducers/reprojection';

import InputCoordinates from './components/InputCoordinates';
import InputCrs from './components/InputCrs';

//TODO connect in next step if needed
// const connectReprojectionTool = connect(
//     createSelector([
//         state => state?.reprojection?.sourceCRS,
//         state => state?.reprojection?.targetCRS,
//         state => state?.reprojection?.geom
//     ], (sourceCRS, targetCRS, geom) => ({
//         sourceCRS,
//         targetCRS,
//         geom
//     })),
//     {
//         setSourceCrs: setReprojectSourceCrs,
//         setTargetCrs: setReprojectTargetCrs,
//         setGeometry: setReprojectGeom
//     }
// );

const ReprojectionTool = ({
    // setSourceCrs,
    // setTargetCrs,
    // setGeometry
}) => {

    const wpsUrl = '/geoserver/wps';
    const executeOptions = {};

    //TODO get from GetCapabilities at mount
    const CRS_LIST = [
        { value: "EPSG:4326", label: "EPSG:4326 (WGS84)" },
        { value: "EPSG:3857", label: "EPSG:3857 (Web Mercator)" }
    ];

    const [inputType, setInputType] = useState('coordinates'); // 'coordinates' | 'layer'

    const [sourceCrs, setSourceCrs] = useState('EPSG:4326');
    const [targetCrs, setTargetCrs] = useState('EPSG:3857');
    const [coordinates, setCoordinates] = useState([{x:11.1, y:46.1},{x:11.2, y:46.2}]);
    const [result, setResult] = useState('');

    const coordinatesToWKT = (coords = []) => {
        // Convert coordinates to WKT format from [{x:.., y:..}, ...] x,y objects
        const wkt = `MULTIPOINT(${coords.map(coord => `(${coord.x} ${coord.y})`).join(', ')})`;
        return wkt;
    }

    const handleChangeCrs = ({ crsSource, crsTarget }) => {
        console.log(`CRS origin changed to ${crsSource}`);
        console.log(`CRS target changed to ${crsTarget}`);
        setSourceCrs(crsSource);
        setTargetCrs(crsTarget);
    }

    const handleChangeCoordinates = (coordinates) => {
        console.log('Coordinates changed:', coordinates);
        setInputType('coordinates');
        setCoordinates(coordinates);
    }

    const handleProcess = () => {
        
        console.log('WPS Processing...');

        //TODO switch by inputType to reprojectGeometryXML|reprojectXML
    
        executeProcess(
            wpsUrl,
            reprojectGeometryXML({
                sourceCrs,
                targetCrs,
                geometry: coordinatesToWKT(coordinates)
            }),
            executeOptions, {
                headers: {
                    'Content-Type': 'application/xml',
                    'Accept': `application/xml, application/json`
                }
            })
        .toPromise()
        .then(response => {
            console.log('response from WPS reprojectGeometry', response);
            setResult(response);
        })
        .catch(() => null);  
    }

    return (
        <div className="reprojection-tool">
            <div className="container-fluid d-flex justify-content-center" style={{ maxWidth: '800px' }}>
                <div className="row mb-4 p-20">
                    <div className="reprojection-header">
                        <h3>Reprojection Tool</h3>
                        <p className="text-muted">Transform coordinates between different coordinate reference systems</p>
                    </div>
                </div>
                <div className="row mb-4 p-20">
                    <InputCrs
                        crsOrigin={CRS_LIST[0].value}
                        crsTarget={CRS_LIST[1].value}
                        onChange={handleChangeCrs}
                    />
                    <br/><br/>
                </div>
                <div className="row mb-4 p-20">
                    <Tabs defaultActiveKey="coordinates" id="reprojection-tabs">
                        <br />
                        <Tab eventKey="coordinates" title="Source Coordinates">
                            <div className="p-20">
                                <InputCoordinates
                                    coordinates={coordinates}
                                    onChange={handleChangeCoordinates}
                                />
                            </div>
                        </Tab>
                        <Tab eventKey="layer" title="Source Layer">
                            <br/><br/>
                            <div className="p-20">
                                <label htmlFor="file-upload">Drop File Layer to Upload</label>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
                <div className="row mb-4 p-20">
                    <br/>
                    <button className="btn btn-primary" onClick={handleProcess}>RUN</button>
                    <small className="text-muted"> Reproject {inputType} from {sourceCrs} to {targetCrs} </small>
                </div>
                <div className="row mb-4 p-20">
                    {result && (
                        <FormGroup>
                            <br/>
                            <ControlLabel>Reprojection Result</ControlLabel>
                            <br/>
                            <textarea
                                readOnly
                                rows={8}
                                value={result}
                                className="reprojection-result w-full mt-4 p-2 border rounded-lg font-mono"
                            />
                        </FormGroup>
                        )}
                </div>
            </div>
        </div>
    );
};

//const ReprojectionToolPlugin = connectReprojectionTool(ReprojectionTool);

export default createPlugin('ReprojectionTool', {
    //component: ReprojectionToolPlugin,
    component: ReprojectionTool,
    containers: {},
    epics: {},
    // reducers: {reprojection}
});
