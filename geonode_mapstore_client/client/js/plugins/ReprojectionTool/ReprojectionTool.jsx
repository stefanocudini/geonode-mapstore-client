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

import { getConfigProp } from '@mapstore/framework/utils/ConfigUtils';

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

/**
 * 
 * plugin localConfig
 * "reprojection_tool": [
            {
                "name": "ReprojectionTool",
                "cfg": {
                    "defaultInputType": "coordinates",                    
                    "defaultCrsOrigin": "EPSG:4326",
                    "defaultCrsTarget": "EPSG:3857",
                    "defaultCrsList": [
                        { "value": "EPSG:4326", "label": "EPSG:4326 (WGS84)" },
                        { "value": "EPSG:3857", "label": "EPSG:3857 (Web Mercator)" }
                    ]
                }
            }
        ]
 */
const ReprojectionTool = ({
    // setSourceCrs,
    // setTargetCrs,
    // setGeometry
}) => {
    
    const {geoserverUrl} = getConfigProp('geoNodeSettings');

    //TODO check retrieve plugin config
    const {reprojection_tool} = getConfigProp('plugins');
    const reprojectionConfig = reprojection_tool?.[0]?.cfg;

    const {
        defaultCrsList,        
        defaultCrsOrigin,
        defaultCrsTarget,
        defaultInputType = 'coordinates', // 'coordinates' | 'filelayer'
    } = reprojectionConfig || {};
    
    const [inputType, setInputType] = useState(defaultInputType);
    
    const [crsList, setCrsList] = useState([]);
    const [sourceCrs, setSourceCrs] = useState(defaultCrsOrigin);
    const [targetCrs, setTargetCrs] = useState(defaultCrsTarget);
    
    const [coordinates, setCoordinates] = useState([{x:11.1, y:46.1},{x:11.2, y:46.2}]);
    
    const [result, setResult] = useState('');

    React.useEffect(() => {
        //TODO fetch from geoserver GetCapabilities of get from geonode static config?
        setTimeout(() => {
            setCrsList(defaultCrsList);
        }, 2500);
    }, []);

    const coordinatesToWKT = (coords = []) => {
        // Convert coordinates to WKT format from [{x:.., y:..}, ...] x,y objects
        const wkt = `MULTIPOINT(${coords.map(coord => `(${coord.x} ${coord.y})`).join(', ')})`;
        return wkt;
    }

    const handleChangeCrs = ({ crsSource, crsTarget }) => {
        setSourceCrs(crsSource);
        setTargetCrs(crsTarget);
    }

    const handleChangeCoordinates = (coordinates) => {
        setInputType('coordinates');
        setCoordinates(coordinates);
    }

    //TODO handle filelayer input
    // const handleChangeFileLayer = (layer) => {
    // TODO extract convert file to gml before send to process
    //     setInputType('filelayer');
    // }

    const handleProcess = () => {
        const executeOptions = {};
        //TODO switch by inputType:
        // 'coordinates': reprojectGeometryXML (format WKT)
        // 'filelayer': reprojectXML (format GML)
        //
        setResult('');
        executeProcess(
            `${geoserverUrl}/wps`,
            reprojectGeometryXML({
                sourceCrs,
                targetCrs,
                geometry: coordinatesToWKT(coordinates),
                outputFormat: 'application/wkt'
            }),
            executeOptions, {
                headers: {
                    'Content-Type': 'application/xml',
                    'Accept': `application/xml, application/json`
                }
            })
        .toPromise()
        .then(response => {
            setResult(response);
        })
        .catch(() => null);  
    }

    return (
        <div className="reprojection-tool">
            <div className="container-fluid d-flex justify-content-center" style={{ maxWidth: '800px' }}>
                <div className="row mb-4 p-40">
                    <div className="reprojection-header">
                        <h3>Reprojection Tool</h3>
                        <p className="text-muted">Transform coordinates between different coordinate reference systems</p>
                    </div>
                </div>
                <div className="row mb-4 p-20">
                    <InputCrs
                        crsList={crsList}
                        crsSource={sourceCrs}
                        crsTarget={targetCrs}
                        onChange={handleChangeCrs}
                    />
                    <br/><br/>
                </div>
                <div className="row mb-4 p-20">
                    <Tabs defaultActiveKey="coordinates" id="reprojection-tabs" onSelect={(k) => setInputType(k)}>
                        <br />
                        <Tab eventKey="coordinates" title="Source Coordinates" style={{ minHeight: '80px' }}>
                            <div className="p-40">
                                <InputCoordinates
                                    coordinates={coordinates}
                                    onChange={handleChangeCoordinates}
                                />
                            </div>
                        </Tab>
                        <Tab eventKey="filelayer" title="Source File Layer" style={{ minHeight: '80px' }}>
                            <div className="p-40">
                                <label htmlFor="file-upload">Drop File Layer to Upload</label>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
                <div className="row mb-4 p-40">
                    <br/>
                    <button className="btn btn-primary" onClick={handleProcess}>Send</button>
                    <small className="text-muted"> Reproject <b>{inputType}</b> from <b>{sourceCrs}</b> to <b>{targetCrs}</b> </small>
                </div>
                <div className="row mb-4 p-40">
                    {result && (
                        <FormGroup>
                            <br/>
                            <ControlLabel>Reprojection Result (WKT format)</ControlLabel>
                            <br/>
                            <textarea style={{ width: '100%' }}
                                onClick={(e) => e.target.select()}
                                readOnly
                                rows={8}
                                value={result}
                                className="reprojection-result w-100 border rounded-lg font-mono"
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
