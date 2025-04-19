import Chat from "./components/chat/Chat"
import Detail from "./components/detail/Detail"
import List from "./components/list/List"
import Login from "./components/login/login";
import Notification from './components/notification/Notification.jsx'
import {useEffect} from 'react'
import {onAuthStateChanged} from 'firebase/auth'
import {auth} from './lib/firebase.js'
import {useUserStore} from './lib/useStore.js'
import {useChatStore} from './lib/chatStore.js'

function App() {
    const {currentUser,isLoading,fetchUserInfo}=useUserStore()
    const{chatId}=useChatStore()


    useEffect(()=>{
      const unSub=onAuthStateChanged(auth,(user)=>{
        fetchUserInfo(user?.uid)
      })

      return()=>{
        unSub()
      }
    },[fetchUserInfo])

    console.log(currentUser)

    if(isLoading){
      return <div className='loading'>Loading...</div>
    }
  return (
    <div className="container">
      {currentUser?<><List />
              {chatId &&<Chat />}
              {chatId &&<Detail />}
              </>:<Login />}
      <Notification />
    </div>
  )
}

export default App
