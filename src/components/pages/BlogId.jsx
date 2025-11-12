import React from 'react'

import { useBlogs } from '../reducers/BlogsContext'
import { useQueryClient } from '@tanstack/react-query' 
import { useParams } from 'react-router'

const BlogId = () => {

    const { handleVote } = useBlogs() 
    const id = useParams().id
    

    const queryClient = useQueryClient()
    

    const blogs = queryClient.getQueryData(['blogs'])
    const blog = blogs ? blogs.find(n => n.id === id) : null 


    

    if (!blog) {

        return <div>Blog no encontrado o cargando...</div>
    }


    
    return (
        <div>
            <h2>Title:  {blog.title}</h2>
            <p>Author: <strong>{blog.author}</strong></p>
            <p>URL: <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a></p>
            
            <p>
                {blog.likes} likes 
                <button 
                    
                    onClick={() => handleVote(blog)}
                    style={{ marginLeft: '10px' }}
                >
                    Like
                </button>
            </p>
            
        </div>
    )
}

export default BlogId