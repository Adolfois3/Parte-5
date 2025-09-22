
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Blogs from './services/Blogs'
import Login from './services/Login'
import  FormBlogs  from './components/FormBlogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [formBlogButton, setBlogFormButton] = useState(false)

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const [blogForm, setBlogForm] = useState({
    title:'',
    author:'',
    url:'',
  })
      const modalRef = useRef(null)
  useEffect(()=>{
  if(showConfirmModal && modalRef.current){
    modalRef.current.scrollIntoView({
      behavior: 'smooth', 
      block: 'center'
    })
  }
},[showConfirmModal])

  // Hook para cargar los blogs al inicio de la aplicación
  useEffect(() => {
    Blogs.getAll()
      .then(blogs => setBlogs(blogs))
  }, [])

  // Hook para verificar si hay un usuario logueado en localStorage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      Blogs.setToken(user.token)
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const users = await Login.login({ username, password })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(users)
      ) 
      Blogs.setToken(users.token)
      setUser(users)
     
      setPassword('')
      setUsername('')
      setSuccessMessage(`¡Bienvenido, ${users.username}! Has iniciado sesión con éxito.`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch(error) {
      console.error(error)
      setErrorMessage('Error: Credenciales inválidas. Por favor, inténtalo de nuevo.')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
    

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
    Blogs.setToken(null)
    setSuccessMessage('¡Has cerrado sesión con éxito!')
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  const handleBlogFormChange = (event) => {
    const { name, value } = event.target
    setBlogForm(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleBlogSubmit = async (event) => {
    event.preventDefault()
    try {
      const newBlog = await Blogs.create(blogForm)
      setBlogs(blogs.concat(newBlog))
      setBlogForm({
        title: '',
        author: '',
        url: ''
      })
      setSuccessMessage(`¡El blog "${newBlog.title}" de ${newBlog.author} se ha añadido con éxito!`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      setBlogFormButton(false)

    } catch (error) {
      console.error(error)
      setErrorMessage('Error: No se pudo crear el blog. Asegúrate de que los campos estén completos.')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  const likesUpdate = async (blogUpdate)=>{
    try{
      const newLikes = {likes: blogUpdate.likes + 1}
      const returnedBlog = await Blogs.update(blogUpdate.id, newLikes)
      setBlogs(
        blogs.map((blog)=> (blog.id !== blogUpdate.id ? blog : returnedBlog))
      )

    }catch(error){
      console.error(error)
      setErrorMessage('Error liking the blog')
      setTimeout(()=>{
        setErrorMessage(null)
      },5000)
    }


  }

  const loginForm = () => {
    return (
      <div>
        <div>
          <h1>Log in to application</h1>
          {errorMessage && (
            <div style={{
              color: 'red',
              background: 'lightgrey',
              fontSize: '20px',
              borderStyle: 'solid',
              borderRadius: '5px',
              padding: '10px',
              marginBottom: '10px'
            }}>
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div style={{
              color: 'green',
              background: 'lightgreen',
              fontSize: '20px',
              borderStyle: 'solid',
              borderRadius: '5px',
              padding: '10px',
              marginBottom: '10px'
            }}>
              {successMessage}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="username">Username</label>
              <input 
                type="text"
                name="username" 
                value={username}
                id="username"
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input 
                type="password"
                id="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                name="password"
              />
            </div>
            <button type="submit">
              Log in
            </button>
          </form>
        </div>
      </div>
    )
  }

    if(formBlogButton){
      return (
        <div>
        <FormBlogs Submit={handleBlogSubmit} FormChange={handleBlogFormChange} blogForms={blogForm}  ></FormBlogs>
        <button onClick={()=> setBlogFormButton(false)}>Cancel</button>
        </div>
      )
    }

const deleteBlog = async (blogDelete) => {
  try {

    await Blogs.deleteBlog(blogDelete.id);
    setBlogs(blogs.filter(blog => blog.id !== blogDelete.id));
    setSuccessMessage('Se eliminó el blog correctamente');
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  } catch (error) {
    console.error(error)
    console.log('Error al eliminar el blog');
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  } finally {

    setShowConfirmModal(false);
    setBlogToDelete(null);
  }
};


  const getBlog = () => {
    const sortedBlog = [...blogs].sort((a,b)=> b.likes - a.likes)

    return (

          <div>
            <h2>Blogs</h2>
            <div>
              <span>Logged in as: <strong>{user.username}</strong></span>
              
              <button onClick={handleLogout}>
                Log out
              </button>
              <br />
              <button onClick={()=> setBlogFormButton(true)}>Create new blog</button>

              
            </div>
            {sortedBlog.map(blog =>
            
              <Blog key={blog.id} blog={blog}  likes={()=> likesUpdate(blog)} delet={()=> {setBlogToDelete(blog); setShowConfirmModal(true)}} />
              
            )}
            {showConfirmModal &&(
              <div ref={modalRef}>
              <h3>Confirmar eliminación</h3>
              <p>¿Estás seguro que quieres eliminar el blog {blogToDelete.title}?</p>
              <button style={{ marginRight: '10px' }} onClick={() => deleteBlog(blogToDelete)}>Sí</button>
              <button onClick={() => setShowConfirmModal(false)}>No</button>
              </div>
            )}

          </div>
    )
  }

  return (
    <>
      {user === null ? loginForm() : getBlog()}
    </>
  )
}


export default App