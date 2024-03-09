import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

function RouteGuard({ children }) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  console.log('authorizedauthorizedauthorizedauthorized', authorized)

  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath)

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false)
    router.events.on('routeChangeStart', hideContent)

    // on route change complete - run auth check
    router.events.on('routeChangeComplete', authCheck)

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', hideContent)
      router.events.off('routeChangeComplete', authCheck)
    }
  }, [])

  function authCheck(url) {
    // redirect to login page if accessing a private page and not logged in
    console.log('khahohohohohohohohoh', url)
    const path = url.split('?')[0]
    const userDetail = localStorage.getItem('access_token')

    // const publicPaths = ['/login'];
    // console.log(publicPaths,path);
    // let check = false;
    // for(let i = 0; i < publicPaths.length ; i++){
    //     if(!path.includes(publicPaths[i])) {
    //         check = true;
    //         break;
    //     }
    // }

    //muốn thêm page private thì sửa như sau
    //if (!userDetail && (path.includes('sca') || path.includes('public1') || path.includes('public2'))) {...}
    if (!userDetail && (path.includes('sca') || path.includes('appointment-history') || path.includes('profile'))) {
      setAuthorized(false)
      router.push({
        pathname: '/login',
        query: { returnUrl: router.asPath }
      })
    } else {
      setAuthorized(true)
    }
  }

  return authorized && children
}

export default RouteGuard
