// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

const firebaseConfig = {
    apiKey: 'AIzaSyDHHNlN-OFIByIhM2W__bWCv88-Foe65ww',
    authDomain: 'instavers-cf02f.firebaseapp.com',
    projectId: 'instavers-cf02f',
    storageBucket: 'instavers-cf02f.appspot.com',
    messagingSenderId: '189539791774',
    appId: '1:189539791774:web:3b49c022716ef3c7cb5c8f',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const upload = async (file, filename) => {
    const storage = getStorage(app)
    const storageRef = ref(storage, filename)

    await uploadBytes(storageRef, file)
    console.log(`Uploaded ${filename}`)
    return
}
export const uploadAvatar = async (file) => {
    const date = new Date()
    const dir = `avatar/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`

    const filename = dir + '/' + Date.now() + '.jpg'
    await upload(file, filename)
    return filename
}
export const uploadImageFirebase = async (list) => {
    const date = new Date()
    const dir = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    const fileNameList = []
    for (let image of list) {
        const filename = dir + '/' + Date.now() + '.jpg'
        await upload(image, filename)
        fileNameList.push(filename)
    }

    console.log('Uploaded all file!')

    console.log('GET URL After uploaded')
    for (let filename of fileNameList) {
        console.log(await getImageUrl(filename))
    }

    return fileNameList
}
export const removeImageFirebase = async (list) => {
    for (let image of list) {
        await removeAvatar(image.image_url)
    }
}

export const getImageUrl = async (filename) => {
    try {
        const storage = getStorage(app)
        const url = await getDownloadURL(ref(storage, filename))
        return url
    } catch (error) {
        console.log('Error', error)
    }
}
export const removeAvatar = async (filename) => {
    try {
        const storage = getStorage(app)
        const desertRef = ref(storage, filename)

        await deleteObject(desertRef)
    } catch (error) {
        console.log('Error', error)
    }
}
