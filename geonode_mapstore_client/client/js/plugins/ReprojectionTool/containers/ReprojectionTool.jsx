/*
 * Copyright 2024, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import validator from '@rjsf/validator-ajv8';
import Form from '@rjsf/core';
import { Alert } from 'react-bootstrap';
import isEmpty from 'lodash/isEmpty';


import MainEventView from '@js/components/MainEventView';
import MainLoader from '@js/components/MainLoader';
import { getMessageById } from '@mapstore/framework/utils/LocaleUtils';

function ReprojectionTool({
    
}, { messages }) {

    function handleSubmit(formData) {
        // TODO submit
    }

    if (loading) {
        return (<MainLoader />);
    }

    return (
        <div className="gn-reprojection">
            <div className="gn-reprojection-header">
                {!isEmpty(updateError) && <Alert bsStyle={updateError.type} style={{ margin: '0.25rem 0' }}>
                    {updateError.message}
                    {!isEmpty(rootErrors) && <ul>{rootErrors.map((_error, idx) => <li key={idx}>{_error}</li>)}</ul>}
                </Alert>}
            </div>
            <div className="gn-reprojection-container">
                
            </div>
            {updating ? <MainLoader style={{ opacity: 0.5 }} /> : null}
        </div>
    );
}

ReprojectionTool.contextTypes = {
    messages: PropTypes.object
};

ReprojectionTool.defaultProps = {
    capitalizeFieldTitle: true
};

export default ReprojectionTool;
