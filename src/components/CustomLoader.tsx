import React from 'react'
import { Puff } from 'react-loader-spinner'
import { CustomLoaderProps } from '../types/componentTypes'

const CustomLoader: React.FC<CustomLoaderProps> = ({loading}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <Puff
        visible={loading}
        height="100"
        width="100"
        color="var(--color-magenta)"
        ariaLabel="puff-loading"
        radius={200}
      />
    </div>
  )
}

export default CustomLoader;