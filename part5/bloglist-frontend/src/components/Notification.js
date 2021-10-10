import React from 'react';

const Notification = ({ message, type }) => {
    if (message === null) {
        return null;
    }

    const errorStyle = {
        color: '#ba3939',
        border: '1px solid #a33a3a',
        background: '#ffe0e0',
    };

    const successStyle = {
        color: '#2b7515',
        background: ' #ecffd6',
        border: '1px solid #617c42',
    };

    const style = type === 'error' ? errorStyle : successStyle;
    return (
        <div className="error" style={style}>
            {message}
        </div>
    );
};

export default Notification;
