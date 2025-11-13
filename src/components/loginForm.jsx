

  const LoginForm = ({notificationRef,handleLogin,username,password,setPassword,setUsername}) => {
    return (
      <div>
        <div>
          <h1>Log in to application</h1>
          <div>
            <p>
              {notificationRef}
            </p>
          </div>
          <form onSubmit={handleLogin}>
            <div>
              <label style={{margin:"5px"}} htmlFor="username">Username</label>
              <input 
                type="text"
                name="username" 
                value={username}
                id="username"
                data-testid='username'
                placeholder="username"
                onChange={({ target }) => setUsername(target.value)}
                className="form-control"
                style={{margin:"10px"}}
              />
            </div>
            <div>
              <label style={{margin:"5px"}} htmlFor="password">Password</label>
              <input 
                type="password"
                id="password"
                value={password}
                data-testid='password'
                onChange={({ target }) => setPassword(target.value)}
                name="password"
                placeholder="password"
                className="form-control"
                style={{margin:"10px"}}
              />
            </div>
            <button style={{margin:"10px"}} className="btn btn-primary" name='Log in' type="submit">
              Log in
            </button>
          </form>
        </div>
      </div>
    )
  }
  
  export default LoginForm
