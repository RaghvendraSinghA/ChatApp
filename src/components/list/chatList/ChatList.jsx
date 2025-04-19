import AddUser from './addUser/addUser'
import './ChatList.css'
import {useState,useEffect} from 'react'
import {useUserStore} from '../../../lib/useStore.js'
import {onSnapshot,doc,getDoc,updateDoc} from 'firebase/firestore'
import {db} from '../../../lib/firebase.js'
import {useChatStore} from '../../../lib/chatStore.js'
const ChatList=()=>{

    const[addMode,setAddMode]=useState(false)
    const[chats,setChats]=useState([])
    const {currentUser}=useUserStore()
    const {chatId,changeChat}=useChatStore()
    const [input,setInput]=useState('')

    useEffect(()=>{
        const unSub = onSnapshot(doc(db, "userchats", currentUser.id),async(res) => {
            const items=res.data().chats;

            const promisses=items.map(async(item)=>{
            const userDocRef=doc(db,'users',item.receiverId);
            const userDocSnap=await getDoc(userDocRef)

            const user=userDocSnap.data();

            return{...item,user}
        });

        const chatData=await Promise.all(promisses)
        setChats(chatData.sort((a,b)=>b.updatedAt-a.updatedAt));
    }
        )

        return()=>{
            unSub()
        }
    },[currentUser.id])

    const handleSelect=async(chat)=>{
        const userChats=chats.map(item=>{
            const{user,...rest}=item
            return rest
        })

        const chatIndex=userChats.findIndex(item=>item.chatId===chat.chatId)

        userChats[chatIndex].isSeen=true;

        const userChatRef=doc(db,"userchats",currentUser.id);
        try{
            await updateDoc(userChatRef,{
                chats:userChats,

            })

            changeChat(chat.chatId,chat.user)
        }catch(e){
            console.log(e)
        }

    }

    const filteredChats=chats.filter(c=>c.user.username.toLowerCase().includes(input.toLowerCase()))

    return(
        <div className='chatlist'>
         <div className="search">
            <div className="searchBar">
                <img src="./search.png" />
                <input type="text" placeholder="search" onChange={e=>setInput(e.target.value)} />
            </div>
            <img onClick={()=>setAddMode(prev=>!prev)} src={addMode?"./minus.png":"./plus.png"} className="add"/>
         </div>

        {filteredChats.map((chat)=>(
         <div key={chat.chatId} className="item" onClick={()=>handleSelect(chat)} 
         style={{backgroundColor:chat.isSeen?"transparent":"#5183fe",}}>
            <img src={chat.user.blocked.includes(currentUser.id)?"/avatar.png":chat.user.avatar||'./avatar.png'} alt=""/>
            <div className="text">
                <span>{chat.user.blocked.includes(currentUser.id)?"user":chat.user.username}</span>
                <p>{chat.lastMessage}</p>
            </div>
         </div>
         ))}
         {addMode&&<AddUser />}
        </div>
    )
}

export default ChatList