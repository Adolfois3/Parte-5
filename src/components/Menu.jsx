import React from 'react'
import NotificationRef from './NotificationRef'
import { Link } from 'react-router'

const Menu = ({user,handleLogout,setBlogFormButton}) => {
  return (
    <>
                <div>
              <NotificationRef/>
            </div>
            <h2>Blogs</h2>
            <div>
              <span>Logged in as: <strong>{user.username}</strong></span>
              
              <button onClick={handleLogout}>
                Log out
              </button>
              <div>
                <Link to={"/users"}>Users</Link>
              </div>
              <br />
             

            </div>
            </>
    
  )
}

export default Menu
