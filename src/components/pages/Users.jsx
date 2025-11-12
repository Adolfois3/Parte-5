import { useQuery } from '@tanstack/react-query'
import React from 'react'
import ModuloUsers from '../../services/ModuloUsers'
import { Link } from 'react-router'


const Users = () => {
            const usersQuery = useQuery({
                queryKey:['users'],
                queryFn:ModuloUsers.getUsers,
                refetchOnWindowFocus: false
        })

        if(usersQuery.isPending){
            return <div>Cargando datos de los usuarios</div>
            
        }
        if(usersQuery.error){
            return <div>Hubo un error al traer los datos</div>
        }

        const usersArray = usersQuery.data


const stylesLi = {
    display: 'flex',                 
            justifyContent: 'space-between', 
            width: '300px',                  
            marginBottom: '8px',             
            padding: '4px',
            margin: "0px"
}

  return (


    <div>

        
        <h1>Users</h1>
      <ul>
        {usersArray.flatMap((users)=>(
            <React.Fragment key={users.id}>
            <li style={stylesLi}>
                <Link to={`/users/${users.id}`}>{users.username}</Link>
                <div>
                    <h3>Blogs Created</h3>
                <strong>{users.blogs.length}</strong>
                </div>
            </li>
            </React.Fragment>
            

        ))}
      </ul>
      <ul>
        
      </ul>
    </div>
  )
}

export default Users
