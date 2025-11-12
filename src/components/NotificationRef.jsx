import { useNotificationValue } from "./notificationValue"


const NotificationRef = () => {
    const notification = useNotificationValue()
    if(!notification || !notification.message){
        return
    }

    const styles = notification.type === 'ERROR'
    ?{
               color: 'red',
              background: 'lightgrey',
              fontSize: '20px',
              borderStyle: 'solid',
              borderRadius: '5px',
              padding: '10px',
              marginBottom: '10px'
    }
    :{
          color: 'green',
              background: 'lightgreen',
              fontSize: '20px',
              borderStyle: 'solid',
              borderRadius: '5px',
              padding: '10px',
              marginBottom: '10px'
    }


  return (
    <div
    style={styles}>

      {notification.message}
    </div>
  )
}

export default NotificationRef
