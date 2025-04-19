import { create } from 'zustand'
import {doc,getDoc} from 'firebase/firestore'
import {db} from './firebase.js'
import {useUserStore} from '../lib/useStore.js'

export const useChatStore = create((set) => ({
  chatId: null,
  user:null,
  isCurrentUserBlocked:false,
  isReceiverBlocked:false,

  changeChat:(chatId,user)=>{
    const currentUser=useUserStore.getState().currentUser;
    
    if(user.blocked.includes(currentUser.id)){
        return set({chatId: chatId,
            user:null,
            isCurrentUserBlocked:true,
            isReceiverBlocked:false,})
    }

   else if(currentUser.blocked.includes(user.id)){
        return set({chatId: chatId,
            user:user,
            isCurrentUserBlocked:false,
            isReceiverBlocked:true,})
    }else{

     return set({chatId: chatId,
      user,
      isCurrentUserBlocked:false,
      isReceiverBlocked:false,})
   }
 },
  changeBlock:()=>{
    set(state=>({...state,isReceiverBlocked:!state.isReceiverBlocked}))
  }
}))
