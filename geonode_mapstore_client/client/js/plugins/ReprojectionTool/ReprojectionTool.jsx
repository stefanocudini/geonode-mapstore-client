/*
 * Copyright 2024, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import { createPlugin } from '@mapstore/framework/utils/PluginsUtils';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

// import Message from '@mapstore/framework/components/I18N/Message';

// import {
//     setReprojection
// } from './actions/reprojection';
// import reprojection from './reducers/reprojection';

import InputCoordinates from './components/InputCoordinates';

const connectReprojectionTool = connect(
    createSelector([
        state => state?.reprojection?.sourceCRS,
        state => state?.reprojection?.targetCRS,
        state => state?.reprojection?.geom
    ], (sourceCRS, targetCRS, geom) => ({
        sourceCRS,
        targetCRS,
        geom
    })),
    {
        // TODO maybe setPreview: setReprojectionPreview
    }
);

const ReprojectionTool = ({
}) => {
    const CRS_OPTIONS = [
        { value: "EPSG:4326", label: "EPSG:4326 (WGS84)" },
        { value: "EPSG:3857", label: "EPSG:3857 (Web Mercator)" }
    ];

    return (
        <div className="reprojection-tool">
            <div className="reprojection-container">
                <div className="row">
                    <div className="reprojection-header mb-4">
                        <h3>Reprojection Tool</h3>
                        <p className="text-muted">Transform coordinates between different coordinate reference systems</p>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-6">
                        <label htmlFor="source-crs">Source CRS</label>
                        <select id="source-crs" className="form-control">
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
                </div>
                <div className="row w-80">
                    <div className="nav nav-tabs" role="tablist">
                        <a className="nav-item nav-link active" id="coordinates-tab" data-toggle="tab" href="#coordinates" role="tab" aria-controls="coordinates" aria-selected="true">
                            Source Coordinates
                        </a>
                        <a className="nav-item nav-link" id="results-tab" data-toggle="tab" href="#results" role="tab" aria-controls="results" aria-selected="false">
                            Source Layer
                        </a>
                    </div>
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="coordinates" role="tabpanel" aria-labelledby="coordinates-tab">
                            <div className="p-3">
                                <InputCoordinates
                                    coordinates={[[45, 12]]}
                                    // format="decimal"
                                    // onChange={(coordinates) => console.log(coordinates)}
                                />
                            </div>
                        </div>
                        <div className="tab-pane fade" id="results" role="tabpanel" aria-labelledby="results-tab">
                            <div className="p-3">
                                [upload file]
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ReprojectionToolPlugin = connectReprojectionTool(ReprojectionTool);

export default createPlugin('ReprojectionTool', {
    component: ReprojectionToolPlugin,
    containers: {
    },
    epics: {}
    // reducers: {
    //     reprojection
    // }
});
