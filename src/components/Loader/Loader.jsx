import React from 'react';
import './Loader.css';

const Loader = () => {
    return (
        <div className="nxor-loader-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px', width: '100%' }}>
            <div className="nxor-loader-wrapper">
                <div className="nxor-circle"></div>
                <div className="nxor-circle"></div>
                <div className="nxor-circle"></div>
                <div className="nxor-shadow"></div>
                <div className="nxor-shadow"></div>
                <div className="nxor-shadow"></div>
            </div>
        </div>
    );
};

export default Loader;
