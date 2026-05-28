import React from 'react'
import { Puff } from 'react-loader-spinner'
import { CustomPageLoaderProps } from '../types/componentTypes'

const CustomPageLoader: React.FC<CustomPageLoaderProps> = ({ loading }) => {
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

export default CustomPageLoader;