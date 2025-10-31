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

import { show } from '@mapstore/framework/actions/notifications';
import executeProcess from '@mapstore/framework/observables/wps/execute';


import {reprojectGeometryXML, reprojectXML} from './observables/reprojection'

import {
    setReprojectSourceCrs,
    setReprojectTargetCrs,
    setReprojectGeom
} from './actions/reprojection';
// import reprojection from './reducers/reprojection';

import InputCrs from './components/InputCrs';
import InputCoordinates from './components/InputCoordinates';
import InputFileLayer from './components/InputFileLayer';

import { getConfigProp } from '@mapstore/framework/utils/ConfigUtils';

//TODO connect in next step if needed
// const connectReprojectionConnected = connect(
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
 * ReprojectionTool plugin default localConfig:
    {
        "name": "ReprojectionTool",
        "cfg": {
            "defaultInputType": "coordinates",                    
            "defaultCrsSource": "EPSG:4326",
            "defaultCrsTarget": "EPSG:3857",
            "defaultCrsList": [
                { "value": "EPSG:4326", "label": "EPSG:4326 (WGS84)" },
                { "value": "EPSG:3857", "label": "EPSG:3857 (Web Mercator)" }
            ]
        }
    }
 */
const ReprojectionTool = ({
    // setSourceCrs,
    // setTargetCrs,
    // setGeometry
    defaultCrsList,
    defaultCrsSource,
    defaultCrsTarget,
    defaultInputType = 'coordinates', // 'coordinates' | 'filelayer'
}) => {
    const {geoserverUrl} = getConfigProp('geoNodeSettings');
    
    const [inputType, setInputType] = useState(defaultInputType);

    const [crsList, setCrsList] = useState([]);
    const [sourceCrs, setSourceCrs] = useState(defaultCrsSource);
    const [targetCrs, setTargetCrs] = useState(defaultCrsTarget);

    const [coordinates, setCoordinates] = useState([{lat:undefined, lon:undefined}]);

    const [result, setResult] = useState('');

    React.useEffect(() => {
        //TODO fetch from geoserver GetCapabilities
        setTimeout(() => {
            setCrsList(defaultCrsList);
        }, 800);
    }, []);

    const coordinatesToWKT = (coords = []) => {
        // Convert coordinates to WKT format from [{lat:.., lon:..}, ...] lat,lon objects
        return `MULTIPOINT(${coords.map(coord => `(${coord.lon} ${coord.lat})`).join(', ')})`;
    }
    //TODO const fileLayerToGML = (fileBin) => {}

    const handleChangeCrs = ({ crsSource, crsTarget }) => {
        setSourceCrs(crsSource);
        setTargetCrs(crsTarget);
    }

    const handleChangeCoordinates = (coordinates) => {
        setInputType('coordinates');
        console.log('Input Coordinates', coordinates);
        setCoordinates(coordinates);
    }

    //TODO handle filelayer input
    const handleChangeFileLayer = (layer) => {
        setInputType('filelayer');
        // TODO extract convert file to gml before send to process
        console.log('Input File Layer');
    }

    /**
     * request process by inputType:
        'coordinates': gs:ReprojectGeometry (format WKT)
        'filelayer': gs:Reproject (format GML)
     */
    const handleProcess = () => {
        const executeOptions = {};
        setResult('');
        const executeXml = inputType === 'coordinates' ? reprojectGeometryXML({
            sourceCrs,
            targetCrs,
            geometry: coordinatesToWKT(coordinates),
            outputFormat: 'application/wkt'
        }) : reprojectXML({
            sourceCrs,
            targetCrs,
            //TODO features: convertFileLayerToGML(),
            outputFormat: 'application/gml'
        });

        executeProcess(`${geoserverUrl}/wps`,
            executeXml,
            executeOptions,
            {
                headers: {
                    'Content-Type': 'application/xml',
                    'Accept': `application/xml, application/json`
                }
            })
        .toPromise()
        .then(response => {
            setResult(response);
            show({
                title: 'Processed completed',
                message: 'converted successfully',
            })
        })
        .catch(() => null);  
    }

    const handleReset = () => {
        setSourceCrs(defaultCrsSource);
        setTargetCrs(defaultCrsTarget);
        setCoordinates([{lat:undefined, lon:undefined}]);
        setInputType(defaultInputType);
        setResult('');        
    }

    return (
        <div className="reprojection-tool">
            <div className="container-fluid d-flex justify-content-center" style={{ maxWidth: '800px' }}>
                <div className="row mb-4 p-40">
                    <div className="reprojection-header">
                        <h3>Reprojection Tool</h3>
                        <p className="text-muted">
                            Convert coordinates or file between different reference systems.
                            <br/><br/>
                        </p>
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
                            <div className="p-40 text-center border-dashed border-secondary">
                                <InputFileLayer onChange={handleChangeFileLayer} />
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
                                rows={5}
                                value={result}
                                className="reprojection-result w-100 border rounded-lg font-mono"
                            />
                            <button 
                                className="btn btn-secondary ms-2" 
                                onClick={() => handleReset()}
                            >
                                Reset
                            </button>
                            &nbsp;
                            <button 
                                className="btn btn-outline-secondary ms-2" 
                                onClick={() => {
                                    navigator.clipboard.writeText(result)
                                }}
                                title="Copy to clipboard"
                            >
                                Copy
                            </button>                            
                        </FormGroup>
                        )}
                </div>
            </div>
        </div>
    );
};

//const connectReprojectionConnected = connectReprojectionTool(ReprojectionTool);

export default createPlugin('ReprojectionTool', {
    //component: connectReprojectionConnected,
    component: ReprojectionTool,
    containers: {},
    epics: {},
    // reducers: {reprojection}
});
