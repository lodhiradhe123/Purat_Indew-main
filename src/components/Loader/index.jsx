import React from 'react';
import PropTypes from 'prop-types';

const Loader = ({ percentage }) => {
    return (
        <div className="loader-container">
            <span className="loading loading-spinner loading-lg"></span>
            <span className="loading-percentage">{percentage}%</span>
        </div>
    );
};

Loader.propTypes = {
    percentage: PropTypes.number.isRequired
};

export default Loader;
