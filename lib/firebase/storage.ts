import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot,
} from 'firebase/storage'
import { storage } from './config'
import { MOCK_MODE } from '../mock-data'

export async function uploadVideo(
  file: File,
  onProgress?: (pct: number) => void
): Promise<{ url: string; storageRef: string }> {
  if (MOCK_MODE) {
    // Simulate upload progress then return a placeholder
    for (let p = 0; p <= 100; p += 20) {
      onProgress?.(p)
      await new Promise(r => setTimeout(r, 80))
    }
    const fakeUrl = URL.createObjectURL(file)
    const path = `videos/${Date.now()}_${file.name}`
    return { url: fakeUrl, storageRef: path }
  }
  const path = `videos/${Date.now()}_${file.name.replace(/\s+/g, '_')}`
  const storageRef = ref(storage, path)
  const task = uploadBytesResumable(storageRef, file, { contentType: file.type })

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snap: UploadTaskSnapshot) => {
        const pct = (snap.bytesTransferred / snap.totalBytes) * 100
        onProgress?.(Math.round(pct))
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        resolve({ url, storageRef: path })
      }
    )
  })
}

export async function uploadProfilePicture(
  file: File,
  uid: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  if (MOCK_MODE) return URL.createObjectURL(file)
  const path = `profiles/${uid}/avatar_${Date.now()}`
  const storageRef = ref(storage, path)
  const task = uploadBytesResumable(storageRef, file, { contentType: file.type })

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snap: UploadTaskSnapshot) => {
        const pct = (snap.bytesTransferred / snap.totalBytes) * 100
        onProgress?.(Math.round(pct))
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        resolve(url)
      }
    )
  })
}

export async function deleteStorageFile(path: string): Promise<void> {
  if (MOCK_MODE) return
  try {
    await deleteObject(ref(storage, path))
  } catch {
    // File may already be deleted
  }
}
