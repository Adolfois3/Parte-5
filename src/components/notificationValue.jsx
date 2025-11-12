import React, { useReducer, createContext, useContext } from "react";


const notificationReducer = (state, action) => {
    switch(action.type){
        case 'SET':
            return {
                message: action.payload.message || action.payload, 
                type: action.payload.type || 'SUCCES' || 'ERROR'
            };
            
        case 'CLEAR':
            return {message: null, type: null};
            
        default:
            return state;
    }
}


const NotificationContext = createContext();

export const NotificationProvider = (props) => {
    const [notification, notificatioDispatch] = useReducer(notificationReducer, {message: null, type: null});

    return(
        <NotificationContext.Provider value={[notification, notificatioDispatch]}>
            {props.children}
        </NotificationContext.Provider>
    );
}

export default NotificationContext;


export const useNotificationValue = () => {
    const [notification, ] = useContext(NotificationContext);
    return notification;
}


export const useNotificationDispatch = () => {
    const [, notificatioDispatch] = useContext(NotificationContext);
    return notificatioDispatch;
}