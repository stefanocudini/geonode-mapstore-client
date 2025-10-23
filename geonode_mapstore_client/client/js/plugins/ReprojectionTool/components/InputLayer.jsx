/*
 * Copyright 2025, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
//TODO upload vector file
// https://github.com/geosolutions-it/armenia-geonode/issues/24#issuecomment-3406474011


//TODO try to use Dropzone like this /client/js/plugins/ResourceDetails/components/DetailsAssets.jsx
// import React, { useState, useRef, useCallback } from 'react';
// import Dropzone from 'react-dropzone';
// import { Glyphicon } from 'react-bootstrap';
// <div className="gn-details-assets-upload">
//             <Dropzone
//                 ref={dropzoneRef}
//                 onDrop={handleDrop}
//                 accept={allowedDocumentTypes.length > 0
//                     ? allowedDocumentTypes.map(ext => `.${ext}`).join(',')
//                     : undefined
//                 }
//                 multiple={false}
//                 disabled={uploading}
//                 className="gn-upload-dropzone"
//                 activeClassName="gn-dropzone-active"
//                 rejectClassName="gn-dropzone-reject"
//             >
//                 <div className={`gn-upload-area ${uploading ? 'gn-upload-area-disabled' : ''}`}>
//                     <Glyphicon glyph="upload" className="gn-upload-area-icon" />
//                     <div>
//                         <HTML msgId="gnviewer.dragDropAsset" />
//                     </div>
//                     <Button className="gn-assets-upload-button" size="sm" disabled={uploading}>
//                         <Message msgId="gnviewer.browseFile" />
//                     </Button>
//                     <div className="gn-upload-area-supported-file-types">
//                         <Message msgId="gnviewer.supportedFileTypes" />: {allowedDocumentTypes.join(', ')}
//                     </div>
//                 </div>
//             </Dropzone>
//         </div>