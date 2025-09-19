import { useState } from "react"
import PropTypes from "prop-types"

const Blog = ({ blog,buttState,likes, delet }) => {
  const [blogCompletes, setBlogComplete] = useState(false)

  const blogStyles = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const blogComplete = () => {
    return(
      <div style={blogStyles}>
    <ul>
      <li><b>Title:</b> {blog.title}      <button onClick={()=> setBlogComplete(false)}>hiden</button></li>
      <li><b>Author:</b> {blog.author}</li>
      <li><b>Url:</b> {blog.url}</li>
      <li><b>Likes:</b> {blog.likes} <button onClick={likes} >Likes</button></li>
      <button onClick={delet}>Delete</button>
    </ul>
    </div>
    )
  }


      if(blogCompletes){
        return( 
          blogComplete()
        )
    }
  return(
    <div style={blogStyles}>
    <ul>
      <li><b>Title:</b> {blog.title} <button onClick={()=> setBlogComplete(true)}>{buttState}</button></li>
    </ul>
  </div>  
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
  }).isRequired,
  buttState: PropTypes.string.isRequired,
  likes: PropTypes.func.isRequired,
  delet: PropTypes.func.isRequired,
};



export default Blog