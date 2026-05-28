import React from 'react'
import { ThreeDots } from 'react-loader-spinner'
import { CustomLoaderProps } from '../types/componentTypes'

const CustomLoader: React.FC<CustomLoaderProps> = ({ loading }) => {
    return (
        <div className="flex items-center justify-center">
            <ThreeDots
                visible={loading}
                height="50"
                width="50"
                color="var(--color-magenta)"
                ariaLabel="three-dots-loading"
                radius={100}
            />
        </div>
    )
}

export default CustomLoader;