import React from 'react'

const CustomInput: React.FC = () => {
  return (
    <div>
    <label htmlFor="">Label</label>
      <input 
      className=''
      type="text" 
      placeholder='fdskjfd' 
      onChange={(e) => console.log(e.target.value)} 
      />
    </div>
  )
};

export default CustomInput;