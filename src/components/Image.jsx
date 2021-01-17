import React from 'react'

const Image = ({photo}) => {
    return (
        <div className="img" >
            <img src={photo} alt="pic" />
        </div>
    )
}

export default Image