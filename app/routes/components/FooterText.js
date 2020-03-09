import React from 'react';
import PropTypes from 'prop-types';

const FooterText = (props) => (
    <React.Fragment>
        (C) {props.year} All Rights Reserved. {props.name}
    </React.Fragment>
);
FooterText.propTypes = {
    year: PropTypes.node,
    name: PropTypes.node
};
FooterText.defaultProps = {
    year: new Date().getFullYear(),
    name: "Projektlabor Rheine"
};

export {FooterText};
