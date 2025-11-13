
import { useState,} from 'react'
import Blogs from './services/Blogs'
import Login from './services/Login'
import LoginForm from './components/loginForm'
import { useNotificationDispatch } from './components/notificationValue'
import NotificationRef from './components/NotificationRef'
import { NotificationProvider } from './components/notificationValue'
import {  useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import { AuthProvider, useUserDispatch, useUserState } from './components/reducers/AuthContext'
import {  Route, Routes } from 'react-router'
import Users from './components/pages/users'
import Menu from './components/Menu'
import Home from './components/pages/Home'
import UsersId from './components/pages/UsersId'
import ModuloUsers from './services/ModuloUsers'
import BlogId from './components/pages/BlogId'
import { BlogsProvider } from './components/reducers/BlogsContext'

const AppContent = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const queryClient = useQueryClient()

            const blog = useQuery({
            queryKey:["blogs"],
            queryFn:Blogs.getAll,
            refetchOnWindowFocus: false
          })

  const usersQuery = useQuery({
      queryKey: ['users'],
      queryFn: ModuloUsers.getUsers,
      refetchOnWindowFocus: false
  })
  
 


  const notificationDispatch = useNotificationDispatch()

      //Funcion para manejar las notificaciones
      const showNotification = (message,type)=>{
        notificationDispatch({
          type:'SET',
          payload:{message: message, type: type}
        })
         setTimeout(() => {
      notificationDispatch({ type: 'CLEAR' }) 
    }, 5000);
      }

  // Hook para verificar si hay un usuario logueado en localStorage

  const { user } = useUserState()
  const userDispatch = useUserDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const users = await Login.login({ username, password })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(users)
      ) 
      Blogs.setToken(users.token)
      userDispatch({
        type:'LOGIN',
        payload:users
      })
      setPassword('')
      setUsername('')
      showNotification("Has iniciado sesion correctamente", 'SUCCES')
    } catch(error) {
      console.error(error)
            showNotification('Error: Credenciales invalidas', 'ERROR');
    }
  }
    

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    userDispatch({ type: 'LOGOUT'})
    Blogs.setToken(null)
    showNotification('Has cerrado sesion correctamente', 'SUCCESS');
  }
  const mutationLikesQuey = useMutation({
  mutationFn:Blogs.update, 
  onSuccess:(data)=>{
    queryClient.setQueryData(["blogs", (oldBlogs)=>{
      return oldBlogs.map((blog)=> blog.id === data.id ? data: blog)
    }])
  }
})

// Aprox. Líneas 205-217
const handleVote = async (blogsUpdate) =>{
  try{
    const newLikes = blogsUpdate.likes + 1;
    const updateObjetc = { likes: newLikes };
    
    mutationLikesQuey.mutate({
      id:blogsUpdate.id,
      newObject: updateObjetc 
    })
    
    showNotification(`Le diste like al blog ${blogsUpdate.title}`, 'SUCCESS');
    
  }catch(error){
    console.error(error)
    showNotification(`Ya le diste like al blog ${blogsUpdate.title}`, 'ERROR');
  }
}





  const loginForm = () => {
    return (
      <LoginForm 
      handleLogin={handleLogin}
      username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword} />
    )
  }
  
  if(user === null){
    return(
      <>
      <NotificationRef/>
      {loginForm()}
      </>
    )
  }

  const usersArray = usersQuery.data || []
  const blogArraysId = blog.data || []

  return (
    <>
    <BlogsProvider handleVote={handleVote}>
    <Menu
     user={user} 
     handleLogout={handleLogout}/>
     <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/:id' element={<BlogId blogs={blogArraysId}/>}></Route>
      <Route path='/users' element={<Users/>}></Route>
      <Route path='/users/:id' element={<UsersId users={usersArray} />}></Route>
     </Routes>
     </BlogsProvider>
    </>
  )
}




const App = ()=>{
  return(
    <>
    <AuthProvider>
    <NotificationProvider>
    <AppContent/>
    </NotificationProvider>
    </AuthProvider>
    </>
  )
}


export default App