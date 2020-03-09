import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {FooterText} from '../FooterText';

function FooterAuth({className}) {
    return (
        <p className={classNames(className, 'small')}>
            <FooterText/><br/>
        </p>
    )
}

FooterAuth.propTypes = {
    className: PropTypes.string
};

export {FooterAuth};
