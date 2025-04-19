import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {storage} from './firebase.js'

const upload=async(file)=>{
const date=new Date()
const metadata = {
  contentType: 'image/jpeg'
};

const storageRef = ref(storage,`images/${date+file.name}`);
const uploadTask = uploadBytesResumable(storageRef, file, metadata);

return new Promise((res,rej)=>{
uploadTask.on('state_changed',
  (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  }, 

  (error) => {
        rej("Something went wrong"+error.code)
  }, 
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      res(downloadURL);
    });
  }
);

})

}

export {upload}