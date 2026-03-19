import React from 'react'
import CustomInput from '../../components/CustomInput'
import BreadcrumbNav from '@/src/components/BreadCrumNav'
import CustomAnalysisComponent from '@/src/components/CustomAnalysisComponent'

const VastuAnalysis: React.FC = () => {
  
  return (
    <section>
      <BreadcrumbNav items={[{ label: 'Vastu Analysis' }]} />
      <CustomAnalysisComponent />
      <CustomInput />
    </section>
  )
}

export default VastuAnalysis