import './Detail.css'
import {auth} from '../../lib/firebase.js'
import {useChatStore} from '../../lib/chatStore.js'
import {useUserStore} from '../../lib/useStore.js'
import {updateDoc,doc,arrayRemove,arrayUnion} from 'firebase/firestore'
import {db} from '../../lib/firebase.js'
const Detail=()=>{
    const{chatId,user,isCurrentUserBlocked,isReceiverBlocked,changeBlock}=useChatStore()
    const{currentUser}=useUserStore()


    const handleBlock=async ()=>{
        if(!user) return;

        const userDocRef=doc(db,'users',currentUser.id)
        try{
            await updateDoc(userDocRef,{
                blocked:isReceiverBlocked ?arrayRemove(user.id):arrayUnion(user.id)
            })
        changeBlock()
        }catch(e){
            console.log(e)
        }
    }
    return(
        <div className='detail'>
            <div className="user">
                <img src={user?.avatar || "./avatar.png"} alt="" />
                <h2>{user?.username ||"ChatAppUser"}</h2>
                <p>Lorem ipsum diddididid did dadi.....</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Setting</span>
                        <img src="./arrowUp.png" alt=""/>
                    </div>
                </div>
            

            
                <div className="option">
                    <div className="title">
                        <span>Privacy & help</span>
                        <img src="./arrowUp.png" alt=""/>
                    </div>
                </div>
           

            
                <div className="option">
                    <div className="title">
                        <span>Shared photos</span>
                        <img src="./arrowDown.png" alt=""/>
                    </div>
                    
                    <div className="photos">
                        <div className="photoItem">
                            <div className="photoDetail">
                            <img src='./bg.jpg' alt="" height='300px' width="300px"  />
                            <span>Img 2025.png</span>
                           </div>
                         <img src="./download.png" alt="" className="icon" />
                        </div>

                        <div className="photoItem">
                            <div className="photoDetail">
                            <img src='./bg.jpg' alt="" height='300px' width="300px"  />
                            <span>Img 2025.png</span>
                           </div>
                         <img src="./download.png" className="icon" alt="" />
                        </div>

                        <div className="photoItem">
                            <div className="photoDetail">
                            <img src='./bg.jpg' alt="" height='300px' width="300px"  />
                            <span>Img 2025.png</span>
                           </div>
                         <img src="./download.png" className="icon" alt="" />
                        </div>
                    </div>
                </div>

                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="./arrowUp.png" alt=""/>
                    </div>
                </div>

                <button onClick={handleBlock}>{isCurrentUserBlocked ?"You are blocked!" :isReceiverBlocked?"User Blocked" :"Block user"}</button>
                <button className='logout' onClick={()=>auth.signOut()}>Logout</button>
            </div>
        </div>
    )
}
export default Detail