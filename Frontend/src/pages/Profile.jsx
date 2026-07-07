import React from 'react'
import { useAuth } from '../context/AuthContext'

const Profile = () => {
    const {user,logout} = useAuth()
  return (
    <>
      <div className="bg-secondary/10 border border-base-300 rounded-2xl p-8 flex flex-col justify-between text-left h-full">
      <div>
        {user.role}
      </div>
      </div>
    </>
  )
}

export default Profile
