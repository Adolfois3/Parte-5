import { useState } from "react"
import PropTypes from "prop-types"

const Blog = ({ blog,likes, delet }) => 
  {const [buttState, setButtState] = useState(false);

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
 <ul>
    <li>
              <span className='blog-title'>Title:{blog.title}</span>
              <button onClick={handleToggle} className='view-button'>
  {buttState ? 'hide' : 'view'}
    </button>
            </li>
  <li>
            <span className='blog-author'>Author:{blog.author}</span>
          </li>
  </ul>
 </div>
 {/* Solo renderiza este div si buttState es true */}
 {buttState && 
 <div className='blog-extra-details'>
   <ul>
  <li><span className='blog-url'>Url: {blog.url}</span></li>
  <li><span className='blog-likes'>Likes: {blog.likes}</span> <button onClick={likes}>like</button></li>
   <button onClick={delet}>Eliminar</button>
  </ul>
</div>
 }
 </div>
 );
}

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