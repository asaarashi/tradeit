import React from "react";


function Pane(props) {
    const { title, children } = props;
    return (
        <div className={'pane'}>
            <h2 className={'pane-title'}>{title}</h2>
            {children}
        </div>
    );
}

export default Pane;