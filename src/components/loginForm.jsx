

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
              <label htmlFor="username">Username</label>
              <input 
                type="text"
                name="username" 
                value={username}
                id="username"
                data-testid='username'
                placeholder="username"
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input 
                type="password"
                id="password"
                value={password}
                data-testid='password'
                onChange={({ target }) => setPassword(target.value)}
                name="password"
                placeholder="password"
              />
            </div>
            <button name='Log in' type="submit">
              Log in
            </button>
          </form>
        </div>
      </div>
    )
  }
  
  export default LoginForm
