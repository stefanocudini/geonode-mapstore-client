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
import { withRouter } from 'react-router';
import isEqual from 'lodash/isEqual';
import Message from '@mapstore/framework/components/I18N/Message';
import ResizableModal from '@mapstore/framework/components/misc/ResizableModal';
import Portal from '@mapstore/framework/components/misc/Portal';
import Button from '@mapstore/framework/components/layout/Button';

import {
    setReprojec
} from './actions/reprojection';

import reprojection from './reducers/reprojection';

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
        //TODO maybe setPreview: setReprojectionPreview
    }
);

const ReprojectionTool = ({
    labelId = 'gnviewer.reprojectionTool',
}) => {
    return (
        <div>REPROJECTION TOOL</div>
    );
};

const ReprojectionToolPlugin = connectReprojectionTool(ReprojectionTool);

export default createPlugin('ReprojectionTool', {
    component: ReprojectionToolPlugin,
    containers: {
    },
    epics: {},
    // reducers: {
    //     reprojection
    // }
});
