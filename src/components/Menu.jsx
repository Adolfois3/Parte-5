import React from 'react'
import NotificationRef from './NotificationRef'
import { Link } from 'react-router'
import './pages/styles/navbar.css'

const Menu = ({user,handleLogout,setBlogFormButton}) => {

  const style = {
background: "#A6A6A6",
    width: "100%", 
    display: "flex",
    justifyContent: "flex-start", // Agrupa los dos divs al inicio
    alignItems: "center", 
    padding: "5px 10px",
    gap: "20px",
    margin: "0px"
  }

  const inlineGroupStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px" 
}
  return (
    <>
    <nav className='navbar'>
        <div>
              <NotificationRef/>
            </div>
            <div class="container-fluid">
              <div style={inlineGroupStyle}>
              <span>Logged in as: <strong>{user.username}</strong></span>
              <button className='btn btn-success' onClick={handleLogout}>
                Log out
              </button>
              </div>
              <div  style={inlineGroupStyle}>
                
                <Link className="btn btn-secondary" to={"/"}>Blogs</Link>
                <Link className="btn btn-secondary " to={"/users"}>Users</Link>
                
              </div>
              <br />
             

            </div>
            </nav>
            </>
    
  )
}

export default Menu
