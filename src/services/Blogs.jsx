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
const update = ( newObject) => {
  const updateId = newObject.id
  const updateBody = newObject.newObject
  
  const config = {
    headers:{Authorization:token},
  }
  const request = axios.put(`${baseUrl}/${updateId}`, updateBody, config)
  return request.then(response => response.data)
}

const getComments = async ({blogId}) => {

  if (!blogId || blogId === 'undefined') {
        return []; 
    }
    const response = await axios.get(`${baseUrl}/${blogId}/comments`);
    return response.data;
};
const comment = async ({blogId, comment}) =>{
  const commentData = {
    comment:comment,
  }
  const url = `${baseUrl}/${blogId}/comments`;
  const request = await axios.post(
    url,
    commentData
  )
  return request.data
}


export default { getAll , setToken, create, update, deleteBlog, comment, getComments }