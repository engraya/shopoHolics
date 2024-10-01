import React from 'react'
import PageContainer from '../../components/PageContainer'
import Link from "next/link"
import { BsBagCheckFill } from 'react-icons/bs';
import { useShoppingCart } from "use-shopping-cart";
import { runFireworks } from '@src/lib/utils';
import { useEffect } from 'react';
function SuccessPage() {

  const {
    clearCart,
  } = useShoppingCart();

  useEffect(() => {
    clearCart();
    runFireworks();
  }, []);

  return (
    <PageContainer>
  <div className="success-wrapper">
      <div className="success">
        <p className="icon">
          <BsBagCheckFill />
        </p>
        <h2>Thank you for your order!</h2>
        <p className="email-msg">Check your email inbox for the receipt.</p>
        <p className="description">
          If you have any questions, please email
          <a className="email" href="mailto:order@example.com">
            order@example.com
          </a>
        </p>
        <Link href="/">
          <button type="button" className="btn">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
    </PageContainer>

  )
}

export default SuccessPage
