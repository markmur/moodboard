import { BOARDS, IMAGES } from '../constants'

export function uploadImage(blob, meta) {
  return this.storage().put(blob, meta)
}

const handleUploadProgress = snapshot => {
  const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  console.log(percent + '% done')
}

export function addImageToBoard(boardId, file, { name, x, y, width, height }) {
  const url = `images/${name}`
  const ref = this.storage.ref(url)
  const upload = ref.put(file, {
    cacheControl: 'private, max-age=31536000'
  })

  return new Promise((resolve, reject) => {
    upload.on(this.firebase.storage.TaskEvent.STATE_CHANGED, {
      next: handleUploadProgress,
      error: reject,
      complete: async () => {
        const referenceUrl = await ref.getDownloadURL()

        const newReference = this.db
          .collection(BOARDS)
          .doc(boardId)
          .collection(IMAGES)
          .doc()

        let dimensions = {}

        if (width && height) {
          dimensions = {
            width,
            height
          }
        }

        console.log({
          id: newReference.id,
          name,
          href: referenceUrl,
          position: {
            x: x || 0,
            y: y || 0
          },
          dimensions
        })

        newReference
          .set({
            id: newReference.id,
            name,
            createdAt: this.timestamp,
            updatedAt: this.timestamp,
            href: referenceUrl,
            position: {
              x: x || 0,
              y: y || 0
            },
            dimensions
          })
          .then(resolve)
      }
    })
  })
}

export function removeImageFromBoard(boardId, imageId) {
  return this.db
    .collection(`${BOARDS}/${boardId}/${IMAGES}`)
    .doc(imageId)
    .delete()
    .catch(this.handleError('removeImageFromBoard'))
}

export function deleteImage(boardId, image) {
  const deleteReference = this.db
    .collection(`${BOARDS}/${boardId}/${IMAGES}`)
    .doc(image.id)
    .delete()

  // Delete image from storage
  const deleteObject = this.storage.refFromURL(image.href).delete()

  return Promise.all([deleteReference, deleteObject])
}

export function udpateImage(boardId, imageId, field, value) {
  return this.db
    .collection(BOARDS)
    .doc(boardId)
    .collection(IMAGES)
    .doc(imageId)
    .update({
      [field]: value
    })
}

export function updateImagePosition(boardId, imageId, { x, y }) {
  return this.db
    .collection(`${BOARDS}/${boardId}/${IMAGES}`)
    .doc(imageId)
    .update({
      updatedAt: this.timestamp,
      position: {
        x,
        y
      }
    })
    .catch(this.handleError('updateImagePosition'))
}

export function updateImageDimensions(boardId, imageId, { width, height }) {
  return this.db
    .collection(`${BOARDS}/${boardId}/${IMAGES}`)
    .doc(imageId)
    .update({
      updatedAt: this.timestamp,
      dimensions: {
        width,
        height
      }
    })
    .catch(this.handleError('updateImageDimensions'))
}