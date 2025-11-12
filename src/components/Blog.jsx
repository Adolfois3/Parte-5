import { useState } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router";

const Blog = ({ blog,likes, delet, user }) => 
  {

    const showDeleteButton ={
      display: user && user.username === blog.user.username ? '': 'none'
    }
    
const blogStyles = {
border: 'solid',
borderWidth: 1,
height: "fit-content"
}

const textStyle = {
  margin:"0px"
}




return (
  <>
    <div className='blog-item' style={blogStyles}>
      <div className='blog-details'>
        <br />
        <h2 style={textStyle}><Link to={`/${blog.id}`}>{blog.title}</Link></h2>
        <br />
      </div>
          <button 
            name="eliminar" 
            style={showDeleteButton} 
            onClick={delet}
          >
            Eliminar
          </button>
        
      
    </div>
    </>
  );
};

Blog.propTypes = {
blog: PropTypes.shape({
title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
 url: PropTypes.string.isRequired,
likes: PropTypes.number.isRequired,
 }).isRequired,
 likes: PropTypes.func.isRequired,
 delet: PropTypes.func.isRequired,
};

export default Blog;