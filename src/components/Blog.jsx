import { useState } from "react"
import PropTypes from "prop-types"

const Blog = ({ blog,likes, delet, user }) => 
  {const [buttState, setButtState] = useState(false);

    const showDeleteButton ={
      display: user && user.username === blog.user.username ? '': 'none'
    }

const blogStyles = {
paddingTop: 10,
paddingLeft: 2,
border: 'solid',
borderWidth: 1,
marginBottom: 5}

const handleToggle = () => {
setButtState(!buttState);
};


return (
    <div className='blog-item' style={blogStyles}>
      <div className='blog-details'>
        <br />
        <span className='blog-title'>Title:{blog.title}</span>
        <br />
        <span className='blog-author'>Author:{blog.author}</span>
        <button 
          data-testid="view-button" 
          onClick={handleToggle} 
          className='view-button'
        >
          {buttState ? 'hide' : 'view'} 
        </button>
      </div>
      {buttState && (
        <div className='blog-extra-details'> 
          <p className='blog-url'>Url: {blog.url}</p>
          <p className='blog-likes'>
            Likes: {blog.likes} 
            <button onClick={likes}>like</button>
          </p>
          
          <button 
            name="eliminar" 
            style={showDeleteButton} 
            onClick={delet}
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
blog: PropTypes.shape({
title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
 url: PropTypes.string.isRequired,
likes: PropTypes.number.isRequired,
 }).isRequired,
 // Eliminamos 'buttState' de los PropTypes, ya que es un estado interno
 likes: PropTypes.func.isRequired,
 delet: PropTypes.func.isRequired,
};

export default Blog;