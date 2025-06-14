import './Chat.css'
import EmojiPicker from 'emoji-picker-react'
import {useState,useRef,useEffect} from 'react'
//how to make element into view 
import {doc,onSnapshot,updateDoc,arrayUnion,getDoc} from 'firebase/firestore'
import {db} from '../../lib/firebase.js'
import {useChatStore} from '../../lib/chatStore.js'
import {useUserStore} from '../../lib/useStore.js'
import {upload} from '../../lib/upload.js'
const Chat=()=>{
    const [open,setOpen]=useState(false)
    const [text,setText]=useState("")
    const [chat,setChat]=useState()
    const {chatId,user,isCurrentUserBlocked,isReceiverBlocked}=useChatStore()
    const {currentUser}=useUserStore()
    const [img,setImg]=useState({
        file:null,
        url:""
    })


    const endRef=useRef(null)
    const handleEmoji=(e)=>{
        setText(prev=>prev+e.emoji)
        setOpen(false)
    }

    const handleImg=(e)=>{
        if(e.target.files[0]){
        setImg({
            file:e.target.files[0],
            url:URL.createObjectURL(e.target.files[0])
        })
    }
    }

    useEffect(()=>{
        endRef.current?.scrollIntoView({behavior:"smooth"})
    },[])

    useEffect(()=>{
        const unSub=onSnapshot(doc(db,'chats',chatId),(res)=>{
            setChat(res.data())
        })

        return()=>{
            unSub()
        }
    },[chatId])


    const handleSend=async()=>{
        if(text==="") return

        let imgUrl=null

        try{

            if(img.file){
                imgUrl=await upload(img.file)
            }
            await updateDoc(doc(db,"chats",chatId),{
                messages:arrayUnion({
                    senderId:currentUser.id,
                    text,
                    createdAt:new Date(),
                    ...(imgUrl&&{img:imgUrl}),
                })
            });

            const userIDs= [currentUser.id,user.id]

            userIDs.forEach(async(id)=>{

            const userChatsRef=doc(db,"userchats",id)
            const userChatsSnapshot=await getDoc(userChatsRef)

            if(userChatsSnapshot.exists()){
                const userChatsData=userChatsSnapshot.data()
                const chatIndex=userChatsData.chats.findIndex(c=>c.chatId ===chatId)

                userChatsData.chats[chatIndex].lastMessage=text
                userChatsData.chats[chatIndex].isSeen=id===currentUser.id?true:false;
                userChatsData.chats[chatIndex].updatedAt=Date.now()

                await updateDoc(userChatsRef,{
                    chats:userChatsData.chats,
                })
            }

        })
        }catch(e){
            console.log(e)
        }
        setImg({
            file:null,
            url:''
        })

        setText('')
    }

    return(
        <div className='chat'>
            <div className="top">
                <div className="user">
                    <img src={user?.avatar ||'./avatar.png'} alt='' />
                    <div className="texts">
                     <span>{user?.username}</span>
                     <p>Lorem ipsum doler sit amet</p>
                    </div>
                </div>
                <div className="icons">
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt="" />
                </div>
            </div>
            <div className="center">
                {chat?.messages?.map((message)=>(
                <div className={message.senderId===currentUser?.id?"message own":"message"} key={message?.createAt}>
                    <div className="texts">
                        {message.img &&<img src={message.img} alt=""/>}
                        <p>{message.text}
                        </p>
                        {/* <span>{message.c}</span> */}
                    </div>
                </div>
              ))} 
             {img.url&&( <div className="message own">
              <div className="texts">
                <img src={img.url} alt=""/>
              </div>
              </div> )}               
            <div ref={endRef}></div>
            </div>
            
            
            <div className="bottom">
                <div className="icons">
                    <label htmlFor="file">
                    <img src="./img.png" alt="" />
                    </label>
                    <input type="file" id='file' style={{display:"none"}} onChange={handleImg} />
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>

                <input onChange={e=>setText(e.target.value)} value={text} type="text" placeholder=" Type a message.." disabled={isCurrentUserBlocked || isReceiverBlocked} />

                <div className="emoji">
                    <img onClick={()=>setOpen(prev=>!prev)} src='./emoji.png' alt="" />
                    <div className="picker">
                    <EmojiPicker open={open} onEmojiClick={handleEmoji} />
                    </div>
                </div>

                <button onClick={handleSend} className="sendButton" disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
            </div>
        </div>
    )
}

export default Chat