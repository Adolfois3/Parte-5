import React from 'react'
import { useParams } from 'react-router'

const UsersId = ({users}) => {
    const id = useParams().id
    const use = users.find(n => n.id === id)

        if(!use){
        return <div>Usuario no encontrado</div>
    }

    if(use.blogs.length === 0){
        return <p>{use.username}   No tiene ningun blog publicado</p>
    }




    if(!use){
        return <div>Usuario no encontrado</div>
    }
  return (
    <div>
        <h3>{use.username}</h3>
        {use.blogs.map( blog =>(
            <li key={blog.id}> -Title: {blog.title}</li>
        ))}
    </div>
  )
}

export default UsersId
