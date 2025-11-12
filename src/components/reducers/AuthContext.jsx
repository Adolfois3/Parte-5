import { createContext, useContext, useEffect, useReducer } from "react";
import Blogs from "../../services/Blogs";

const initiaState = {
    user:null
}

const authReducer = (state, action)=>{
    switch (action.type){
        case'LOGIN':
        return {
            ...state,
            user:action.payload
        };
        case'LOGOUT':
        return initiaState;
    default:
        return state
    }
}

const UserStateContext = createContext(initiaState)
const UserDispatchContext = createContext(null)


export const AuthProvider =({children})=>{
    const [state, dispatch] = useReducer(authReducer, initiaState)

    useEffect(()=>{
        const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')

        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            // Si hay un usuario en localStorage, hacemos un dispatch de LOGIN
            dispatch({
                type: 'LOGIN',
                payload: user 
            });
            // También establecemos el token globalmente para las llamadas a la API
            Blogs.setToken(user.token);
        }
    }, [])


    return (
        <UserDispatchContext.Provider value={dispatch}>
            <UserStateContext.Provider value={state}>
                {children}

            </UserStateContext.Provider>

        </UserDispatchContext.Provider>
    )
}

export const useUserState = ()=> useContext(UserStateContext)
export const useUserDispatch = ()=> useContext(UserDispatchContext)

