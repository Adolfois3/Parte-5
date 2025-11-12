import React from 'react'
import NotificationRef from './NotificationRef'
import { Link } from 'react-router'

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
    <nav style={style}>
        <div>
              <NotificationRef/>
            </div>
            <div>
              <div style={inlineGroupStyle}>
              <span>Logged in as: <strong>{user.username}</strong></span>
              <button onClick={handleLogout}>
                Log out
              </button>
              </div>
              <div style={inlineGroupStyle}>
                
                <Link to={"/"}>Blogs</Link>
                <Link to={"/users"}>Users</Link>
                
              </div>
              <br />
             

            </div>
            </nav>
            </>
    
  )
}

export default Menu
