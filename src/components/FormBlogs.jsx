import '../components/pages/styles/createBlogs.css'

const FormBlogs = ({Submit,FormChange,blogForms}) => {
  return (
      <div>
        <div>
          <h2>Create a New Blog</h2>
          <form className="form-group" onSubmit={Submit}>
            <div>
              <label htmlFor="title">Title</label>
              <input 
                type="text" 
                name="title" 
                onChange={FormChange} 
                value={blogForms.title} 
                data-testid='title'
                placeholder="Title"
                className="form-control"
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
                className="form-control"
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
                className="form-control"
              />
            </div>
            <button class="btn btn-primary" type="submit">
              Create
            </button>
          </form>
          </div>
          </div>
  )
}
export default FormBlogs

