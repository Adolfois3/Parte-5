import React from 'react'
import { useUserDispatch, useUserState } from '../reducers/AuthContext';
import Blog from '../Blog';
import { useState, useEffect, useRef } from 'react'
import { useNotificationDispatch, useNotificationValue } from '../notificationValue'
import NotificationRef from '../NotificationRef';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Blogs from '../../services/Blogs';
import FormBlogs from '../FormBlogs';

const Home = () => {

      const [showConfirmModal, setShowConfirmModal] = useState(false);
        const [formBlogButton, setBlogFormButton] = useState(false);
          const [blogToDelete, setBlogToDelete] = useState(null);
            const [blogForm, setBlogForm] = useState({
              title:'',
              author:'',
              url:'',
            })

          const { user } = useUserState()
          

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
          



            const modalRef = useRef(null)

            useEffect(()=>{
            if(showConfirmModal && modalRef.current){
                modalRef.current.scrollIntoView({
                behavior: 'smooth', 
                block: 'center'
                })
            }
            },[showConfirmModal])

            const blog = useQuery({
          queryKey:["blogs"],
          queryFn:Blogs.getAll,
          refetchOnWindowFocus: false
        })

        
  const handleBlogSubmitQueryMutate = useMutation({
    mutationFn:Blogs.create,
    onSuccess:(newBlogs)=>{
      const blogs = queryClient.getQueryData(["blogs"])
      queryClient.setQueryData(["blogs"], blogs.concat(newBlogs))
      showNotification('El blog se ha añadido con exito', 'SUCCESS');
    },
    onError:(error)=>{
      if(error.response && error.response.status === 400 ){
        showNotification('El servidor rechazo los datos  (BAD REQUEST)', 'ERROR');
      }
      showNotification('No se pudo añadir el blog', 'ERROR');
    }
  })

  
  const handleBlogSubmit = async (event) => {
    event.preventDefault()
    try {
      handleBlogSubmitQueryMutate.mutate(blogForm)
      showNotification('El blog se ha añadido con exito', 'SUCCESS');
      setBlogFormButton(false)

    } catch (error) {
      console.error(error)
      showNotification('No se pudo añadir el blog', 'ERROR');
    }
  }

    const handleBlogFormChange = (event) => {
    const { name, value } = event.target
    setBlogForm(prevData => ({
      ...prevData,
      [name]: value
    }))
  }


          const queryClient = useQueryClient()
//eliminar blogs con querys
  const mutionDelete = useMutation({
  mutationFn:Blogs.deleteBlog,
  onSuccess:(data, deleteBlog)=>{
    queryClient.invalidateQueries({queryKey:["blogs"]})
    queryClient.setQueryData(["blogs", (oldBlogs)=>{
      if(!oldBlogs) return [];
      return oldBlogs.filter((blog)=> blog.id !== deleteBlog.id)
    }])
        queryClient.invalidateQueries({queryKey:["blogs"]})
      showNotification('El blog se ha elimado con exito', 'SUCCESS')
      setShowConfirmModal(false)
      setBlogToDelete(null)

  },
  onError:(error)=>{
    console.error(error)
    showNotification('No se pudo eliminar el blogs', 'ERROR');
    setShowConfirmModal(false)
    setBlogToDelete(null)
  }
})
const deleteBlog =  (blogDelete) => {
  mutionDelete.mutate(blogDelete)
}

const mutationLikesQuey = useMutation({
  mutationFn:Blogs.update, 
  onSuccess:(data)=>{
    queryClient.invalidateQueries({queryKey:["blogs"]}) 

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

    if(blog.isPending){
        return <div>Cargando blogs... Por favor, espera. ⏳</div>;
            }

    if (blog.isError) {
    return <div>Error al cargar la data: {blog.error.message} 🛑</div>;
}
        const blogArray = blog.data
            const sortedBlog = [...blogArray].sort((a,b)=> b.likes - a.likes)
            const blogToConfirm = blogArray.find(b => b.id === blogToDelete)

    if(formBlogButton){
      return (
        <div>
          <NotificationRef/>
        <FormBlogs 
        Submit={handleBlogSubmit} 
        FormChange={handleBlogFormChange} 
        blogForms={blogForm}  ></FormBlogs>
        <button onClick={()=> setBlogFormButton(false)}>Cancel</button>
        </div>
      )
    }

    return (
        <div>
            <button onClick={()=> setBlogFormButton(true)}>Create new blog</button>
            <h1>Blogs</h1>
            {sortedBlog.map(blog =>
            <Blog key={blog.id} 
            blog={blog} user={user}  
            likes={()=> handleVote(blog)}
            delet={()=> {setBlogToDelete(blog.id);
            setShowConfirmModal(true)}} />
            )}
            {showConfirmModal &&(
              <div ref={modalRef}>
              <h3>Confirmar eliminación</h3>
              <p>¿Estás seguro que quieres eliminar el blog {blogToConfirm.title}?</p>
              <button style={{ marginRight: '10px' }} onClick={() => deleteBlog(blogToDelete)}>Sí</button>
              <button onClick={() => setShowConfirmModal(false)}>No</button>
              </div>
            )}
          </div>
          
    )
}

export default Home
