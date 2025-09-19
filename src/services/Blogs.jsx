import axios from 'axios'
const baseUrl = 'http://localhost:3009/api/blogs'

let token = null

const setToken = newToken =>{
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const deleteBlog = async (id)=>{
  const config = {
    headers:{Authorization:token},
  }
  const request = await axios.delete(`${baseUrl}/${id}`, config)
  return request.data
}
const create = async newObjetc =>{
  const config = {
    headers:{Authorization: token},
  }
  const response = await axios.post(baseUrl, newObjetc, config)
  return response.data
}
const update = (id, newObject) => {
  const config = {
    headers:{Authorization:token},
  }
  const request = axios.put(`${ baseUrl }/${id}`, newObject, config)
  return request.then(response => response.data)
}


export default { getAll , setToken, create, update, deleteBlog }