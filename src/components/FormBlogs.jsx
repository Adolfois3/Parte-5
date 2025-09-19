

export const FormBlogs = ({Submit,FormChange,blogForms}) => {
  return (
      <div>
        <div>
          <h2>Create a New Blog</h2>
          <form onSubmit={Submit}>
            <div>
              <label htmlFor="title">Title</label>
              <input type="text" name="title" onChange={FormChange} value={blogForms.title} />
            </div>
            <div>
              <label htmlFor="author">Author</label>
              <input type="text" name="author" onChange={FormChange} value={blogForms.author} />
            </div>
            <div>
              <label htmlFor="url">Url</label>
              <input type="text" name="url" onChange={FormChange} value={blogForms.url} />
            </div>
            <button type="submit">
              Create
            </button>
          </form>
          </div>
          </div>
  )
}

