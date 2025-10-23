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

// import isEqual from 'lodash/isEqual';
// import Message from '@mapstore/framework/components/I18N/Message';
// import ResizableModal from '@mapstore/framework/components/misc/ResizableModal';
// import Portal from '@mapstore/framework/components/misc/Portal';
// import Button from '@mapstore/framework/components/layout/Button';

// import {
//     setReprojection
// } from './actions/reprojection';
// import reprojection from './reducers/reprojection';

import InputPoints from './components/InputPoints';

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
    return (
        <>
            <div>REPROJECTION TOOL</div>
            <div>
                <label className="control-label">Sources coordinates</label>
                <InputPoints
                    // points={[[45, 10]]}
                    // format="decimal"
                    // onChange={(points) => console.log(points)}
                />
            </div>
        </>
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
