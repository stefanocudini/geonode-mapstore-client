/*
 * Copyright 2025, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, {useState} from 'react';
import { createPlugin } from '@mapstore/framework/utils/PluginsUtils';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { Form, FormGroup, ControlLabel, Glyphicon, InputGroup, Tabs, Tab } from 'react-bootstrap';
import Loader from '@mapstore/framework/components/misc/Loader';

import { show } from '@mapstore/framework/actions/notifications';
import executeProcess from '@mapstore/framework/observables/wps/execute';

import {convertWFS2GeoJSON} from './components/convertions';

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
            ],
            "supportedFileLayerTypes": [
                "geojson","json","kml","shp"
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
    supportedFileLayerTypes
}) => {
    const {geoserverUrl} = getConfigProp('geoNodeSettings');
    
    const [inputType, setInputType] = useState(defaultInputType);

    const [crsList, setCrsList] = useState([]);
    const [sourceCrs, setSourceCrs] = useState(defaultCrsSource);
    const [targetCrs, setTargetCrs] = useState(defaultCrsTarget);

    const [coordinates, setCoordinates] = useState([{lat:undefined, lon:undefined}]);
    const [fileLayer, setFileLayer] = useState(null);
    const [forcedCrs, setForcedCrs] = useState(false);

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');

    const [notifyShow, setNotifyShow] = useState(false)
    const [notifyMsg, setNotifyMsg] = useState({message: 'MESSAGE'})

    //TODO only a placeholder for MS notify system
    const onNotify = (msg = {
        title: 'gnviewer.assetUpload',
        message: 'gnviewer.assetUploadUnsupportedFormatError'
    }, type = 'warning') => {
        setNotifyMsg({message: msg.message});
        setNotifyShow(true);
        setTimeout(() => {
            setNotifyShow(false);
        }, 4000);
    }

    React.useEffect(() => {
        setTimeout(() => {
            setCrsList(defaultCrsList);
            // onNotify({
            //     message: 'CRS list loaded from configuration.'
            // });
        }, 800);
    }, []);

    const coordinatesToWKT = (coords = []) => {
        // Convert coordinates to WKT format from [{lat:.., lon:..}, ...] lat,lon objects
        return `MULTIPOINT(${coords.map(coord => `(${coord.lon} ${coord.lat})`).join(', ')})`;
    }

    const fileLayerToPayload = async () => {

        let payload = '';
        if (!fileLayer) payload = '';

        if(fileLayer.type === 'application/gml+xml' || fileLayer.name?.toLowerCase().endsWith('.gml')) {
            const txt = await fileLayer.text();
            //remove first line: "<?xml version="1.0" encoding="UTF-8"?>"            
            payload = txt.split(/\r?\n/).slice(1).join('\n');
        } else if( fileLayer.type === 'application/geo+json' || 
                    ['.json', '.geojson'].some(ext => fileLayer.name?.toLowerCase().endsWith(ext))
                ) {
            
            // //TODO force sourceCRS change it:
            // "crs": {
            //   "type": "name",
            //   "properties": {
            //     "name": "EPSG:4326"
            //   }
            // },

            const jsonpayload = JSON.parse(await fileLayer.text());
            payload = JSON.stringify(jsonpayload);
        }
        return payload;
    };

    const handleChangeCrs = ({ crsSource, crsTarget }) => {
        setSourceCrs(crsSource);
        setTargetCrs(crsTarget);
    }

    const handleChangeCoordinates = (coordinates) => {
        setInputType('coordinates');
        setCoordinates(coordinates);
    }

    const handleChangeFileLayer = async (files) => {
        setInputType('filelayer');
        setFileLayer(files?.[0]);

        //TODO process file and return promise
        console.log('handleChangeFileLayer', fileLayer);

        return Promise.resolve();
    }

    const handleProcess = async () => {
        const executeOptions = {};
        setResult('');
        let executeXml;
        
        switch (inputType) {
            case 'coordinates':
            executeXml = reprojectGeometryXML({
                sourceCrs,
                targetCrs,
                geometry: coordinatesToWKT(coordinates),
                inputFormat: 'application/wkt'
            });
            break;

            case 'filelayer':
            executeXml = reprojectXML({
                forcedCrs,
                sourceCrs,
                targetCrs,
                features: await fileLayerToPayload(fileLayer),
                inputFormat: 'application/json'
            });
            break;

            //TODO for exists layer reference
            // case 'urllayer':
            // executeXml = reprojectXML({
            //     sourceCrs,
            //     targetCrs,
            //     //layer TODO: implement URL layer/dataset as reference in request
            // });
            // break;
            
            default:
                console.error('Unsupported input type:', inputType);
            return;
        }

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
            let resultText = '';
            
            if (inputType === 'filelayer') {
                resultText = convertWFS2GeoJSON(response);
            }
            else if (inputType === 'coordinates') {
                resultText = response;
            }
            // console.log('Convert Result:', responseText);
            
            setResult(resultText);
        })
        .catch(() => null);  
    }

    const handleReset = () => {
        setSourceCrs(defaultCrsSource);
        setTargetCrs(defaultCrsTarget);
        setInputType(defaultInputType);
        setCoordinates([{lat:undefined, lon:undefined}]);
        setFileLayer(null);        
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
                        </p>
                        <div className="alert alert-warning" role="alert"
                            style={{visibility: notifyShow ? 'visible' : 'hidden'}}
                        >
                            <span className="alert-body">
                                <span>{notifyMsg?.message}</span>
                            </span>
                        </div>
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
                                    // onValidation={() => {
                                    //     console.log('validation',arguments);
                                    // }}
                                />
                            </div>
                        </Tab>
                        <Tab eventKey="filelayer" title="Source File Layer" style={{ minHeight: '80px' }}>
                            <div className="p-40 text-center border-dashed border-secondary">
                                <InputFileLayer
                                    onNotify={onNotify}
                                    supportedFileLayerTypes={supportedFileLayerTypes}
                                    onChange={handleChangeFileLayer}
                                />

                                <div className="gn-force-crs-checkbox text-left" style={{ marginBottom: '10px' }}>
                                    <input
                                        type="checkbox"
                                        id="forceCrs"
                                        checked={forcedCrs}
                                        onChange={(e) => setForcedCrs(e.target.checked)}
                                    />
                                    <label htmlFor="forceCrs" style={{ marginLeft: '5px' }}>
                                        Force source CRS in file
                                    </label>
                                </div>                                
                            </div>
                        </Tab>
                    </Tabs>
                </div>
                <div className="row mb-4 p-40">
                    <br/>
                    <button className="btn btn-primary"
                        onClick={handleProcess}>RUN
                     </button>
                    <small className="text-muted"> Reproject <b>{inputType}</b> from <b>{sourceCrs}</b> to <b>{targetCrs}</b> </small>
                </div>
                <div className="row mb-4 p-40">
                    {!result && loading && (
                        <Loader size={50} style={{margin: 0, auto: 'auto'}}   />
                    )}

                    {result && (
                        <FormGroup>
                            <br/>
                            <ControlLabel>Reprojection Result</ControlLabel>
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
