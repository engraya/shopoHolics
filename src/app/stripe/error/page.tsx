import React from 'react'
import PageContainer from '../../components/PageContainer'
import Link from "next/link"
function ErrorPage() {
    return (
      <PageContainer>
      <div className="p-6  md:mx-auto">
        <div className="text-center">
          <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">Payment UnSuccessful!</h3>
          <p className="text-gray-600 my-2">You can make Purchase and try again.</p>
          <p>Thanks for your Patronage!</p>
          <Link href="/categories">
          <div className="py-10 text-center flex justify-center items-center">
            <div className="bg-cyan-600 w-1/2 flex justify-center items-center hover:bg-cyan-500 rounded-lg text-white font-semibold py-3">
              Shop Again
            </div>
          </div>
          </Link>
    
        </div>
      </div>
        </PageContainer>
      )
}

export default ErrorPage





