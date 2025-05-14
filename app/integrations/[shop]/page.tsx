'use client'



import '@/styles/integrations/new-integration.scss'


import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

async function StoreIntegrationWindowPopup(props: {

    params: { shop: string };
  }) {
 const router = useRouter()
    useEffect(() =>{
        if (window.opener) {
            // ✅ Normal flow: send data back and close
            window.opener.postMessage({ shop:props.params.shop }, `https://${process.env.NEXT_PUBLIC_FRONTEND_URL}`);
          } else {
            router.replace('/')
          }
    }, [])
  return (
    <h2>Installation complete! You can close this window.</h2>
  );
}

export default StoreIntegrationWindowPopup;


