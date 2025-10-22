
"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
const Page = () => {
  const router = useRouter()


  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth='))
      ?.split('=')[1]

    if (!token) {
      router.push('/admin/auth/login')
    } else {
      router.push('/admin/dashboard')
    }
  }, [router])

  return <></>
}

export default Page
