import React from 'react'
import PageContainer from '../../components/PageContainer'
import Link from "next/link"

function SuccessPage() {
  return (
    <PageContainer>
  <div className="p-6  md:mx-auto">
    <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto my-6">
      <path fill="currentColor" d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
      </path>
    </svg>
    <div className="text-center">
      <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">Payment Successful!</h3>
      <p className="text-gray-600 my-2">Thank you for completing your secure online payment.</p>
      <p> Have a great day!</p>
      <Link href="/">
      <div className="py-10 text-center flex justify-center items-center">
        <div className="bg-green-600 w-1/2 flex justify-center items-center hover:bg-cyan-500 rounded-lg text-white font-semibold py-3">
          GO BACK 
        </div>
      </div>
      </Link>

    </div>
  </div>
    </PageContainer>

  )
}

export default SuccessPage
