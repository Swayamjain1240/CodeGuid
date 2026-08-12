import React from 'react'
import { Loader2 } from "lucide-react"

const Spinner = ({size= "md", className= ""}) => {

    const size = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
    };

  return (  
    <div className='flex justify-center items-center p-2'>
      <Loader2 className={`animate-spin text-cyan-400 ${size[size] || size.md} ${className}`} />
    </div>
  )
}

export default Spinner
