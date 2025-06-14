import './Login.css'
import {useState} from 'react'
import {toast} from 'react-toastify'
import {createUserWithEmailAndPassword,signInWithEmailAndPassword} from 'firebase/auth'
import {auth,db} from '../../lib/firebase.js'
import { doc, setDoc } from "firebase/firestore";
import {upload} from '../../lib/upload.js' 

const Login=()=>{
    const [avatar,setAvatar]=useState({
        file:null,
        url:"",
    })

    const[loading,setLoading]=useState(false)

    const handleAvatar=(e)=>{
        if(e.target.files[0]){
        setAvatar({
            file:e.target.files[0],
            url:URL.createObjectURL(e.target.files[0])
        })
    }
    }

    const handleLogin=async(e)=>{
        e.preventDefault()
        setLoading(true)

        const formData=new FormData(e.target)

        const {email,password}=Object.fromEntries(formData)
        try{

        await signInWithEmailAndPassword(auth,email,password)

        }catch(e){
            console.log(e)
            toast.error("Error")
        }finally{
            setLoading(false)
        }
    }

    const handleRegister=async(e)=>{
        e.preventDefault()
        setLoading(true)
        const formData=new FormData(e.target)
        //e.target represents form

        const{username,email,password}=Object.fromEntries(formData)

        try{
            const res=await createUserWithEmailAndPassword(auth,email,password)
            const imgUrl=await upload(avatar.file)


        await setDoc(doc(db, "users", res.user.uid), {
        username,email,id:res.user.uid,avatar:imgUrl,
        blocked:[]
        });

        await setDoc(doc(db, "userchats", res.user.uid), {
            chats:[]
            });

        toast.success("Account Created Successfully")

        }catch(e){
            console.log(e)
            toast.error("Error")
        }finally{
            setLoading(false)
        }
    }
    return(<div className='login'>
        <div className="item">
            <h2>Welcome!</h2>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="email" name="email" />
                <input type="password" placeholder="password" name="password" />
                <button disabled={loading} >{loading?"loading":'Login'}</button>
            </form>
        </div>


        <div className="separator"></div>


        <div className="item">
        <h2>Create an Account</h2>
            <form onSubmit={handleRegister}>
                <label htmlFor="file">
                    <img src={avatar.url || './avatar.png'} alt=""/>
                    Upload profile pic</label>
                <input type="file" id="file" style={{display:"none"}} onChange={handleAvatar}/>
                <input type="text" placeholder="Username" name="username" />
                <input type="text" placeholder="email" name="email" />
                <input type="password" placeholder="password" name="password" />
                <button disabled={loading}>{loading?"loading":'Sign Up'}</button>
            </form>
        </div>
        </div>)
}

export default Login