const FormBlogs = ({Submit,FormChange,blogForms}) => {
  return (
      <div>
        <div>
          <h2>Create a New Blog</h2>
          <form onSubmit={Submit}>
            <div>
              <label htmlFor="title">Title</label>
              <input 
                type="text" 
                name="title" 
                onChange={FormChange} 
                value={blogForms.title} 
                data-testid='title'
                placeholder="Title"
                
              />
            </div>
            <div>
              <label htmlFor="author">Author</label>
              <input 
                type="text" 
                name="author" 
                onChange={FormChange} 
                value={blogForms.author} 
                data-testid='author'
                placeholder="Author"
              />
            </div>
            <div>
              <label htmlFor="url">Url</label>
              <input 
                type="text" 
                name="url" 
                onChange={FormChange} 
                value={blogForms.url} 
                data-testid='url'
                placeholder="Url"
              />
            </div>
            <button type="submit">
              Create
            </button>
          </form>
          </div>
          </div>
  )
}
export default FormBlogs

