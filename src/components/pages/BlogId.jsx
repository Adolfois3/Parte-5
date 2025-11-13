import React, { useState } from 'react'

import { useBlogs } from '../reducers/BlogsContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query' 
import { useParams } from 'react-router'
import Blogs from '../../services/Blogs'
import './styles/blogId.css'

const BlogId = () => {
    const [commentInput, setCommentInput] = useState('')
    const id = useParams().id
    const { handleVote } = useBlogs() 
    const queryClient = useQueryClient()
        const blogs = queryClient.getQueryData(['blogs'])
    const blog = blogs ? blogs.find(n => n.id === id) : null 

            const comment = useQuery({
          queryKey:['comment', id],
          queryFn:()=> Blogs.getComments({blogId: id}),
          enabled: !!blog,
          refetchOnWindowFocus: false
        })

        const mutationComment = useMutation({
            mutationFn:Blogs.comment,
            onSuccess:(newComment,variables)=>{
                queryClient.invalidateQueries({ queryKey: ['comment', id] });
                setCommentInput('');
            },
            onError:(error)=>{
            if(error.response && error.response.status === 400 ){
        console.log('El servidor rechazo los datos  (BAD REQUEST)', 'ERROR');
      }
            }
        })
        const onChange =(e)=>{
            setCommentInput(e.target.value)
        }

        const handleCommentSubmit = async(event)=>{
            event.preventDefault()
            if(!commentInput.trim()) return

            const commentData = {
                blogId:blog.id,
                comment: commentInput
            }
            try{
                mutationComment.mutate(commentData)
                console.log("Se envio el comentario")
            }catch(error){
                console.error(error)
        }
        }
    
    if (!blog) {

        return <div>Blog no encontrado o cargando...</div>
    }
    
    const commentData = comment.data || []


    
    return (
<div className='content-blog'>
        <h2>Title: {blog.title}</h2>
        <p>Author: <strong>{blog.author}</strong></p>
        <p>URL: <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a></p>
    
        <p>
            {blog.likes} likes 
            <button
            className='button-likes' 
                onClick={() => handleVote(blog)}
                style={{ marginLeft: '10px' }}
            >
                ❤️
            </button>
        </p>
        
       
        <div> 
            <h3>Comments</h3>
            <form onSubmit={handleCommentSubmit}>
                <input className='input-comment' style={{margin:"10px"}} type="text" value={commentInput} onChange={onChange} />
                <button className='btn btn-secondary' disabled={mutationComment.isPending}>
                    {mutationComment.isPending ? 'Enviando...': 'add comment'}
                </button >
            </form>
            <ul>
                {commentData.map((c)=>( 
                    <li key={c.id}>{c.comment}</li>
                ))}
            </ul>
        </div>
        
    </div>
    )
}

export default BlogId