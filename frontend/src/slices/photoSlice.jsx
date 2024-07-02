import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import photoService from "../services/photoService";

const initialState = {
    photos: [],
    photo: {},
    error: false,
    success: false,
    loading: false,
    message: null,
}

// Publish user photo
export const publishPhoto = createAsyncThunk("photo/publish", async(photo, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token

    const data = await photoService.publishPhoto(photo, token)

    // Check for errors
    if(data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
})

// Get user photos
export const getUserPhotos = createAsyncThunk("photo/userphotos", async(id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token

    const data = await photoService.getUserPhotos(id, token)

    return data
})

// Delete a photos
export const deletePhotos = createAsyncThunk("photo/delete", async(photoData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token

    const data = await photoService.updatePhoto({title: photoData.title}, photoData.id, token)

    // Check for errors
    if(data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
})

// Update a photo
export const updatePhotos = createAsyncThunk("photo/update", async(id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token

    const data = await photoService.deletePhoto(id, token)

    // Check for errors
    if(data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
})

export const photoSlice = createSlice({
    name: "photo",
    initialState,
    reducers: {
        resetMessage: (state) => {
            state.message = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(publishPhoto.pending, (state) => {
            state.loading = true
            state.error = null
        }).addCase(publishPhoto.fulfilled, (state, action) => {
            state.loading = false
            state.success = true
            state.error = null
            state.photo = action.payload
            state.photos.unshift(state.photo)
            state.message = "Foto publicada com sucesso!"
        }).addCase(publishPhoto.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.photo = {}
        }).addCase(getUserPhotos.pending, (state) => {
            state.loading = true
            state.error = null
        }).addCase(getUserPhotos.fulfilled, (state, action) => {
            state.loading = false
            state.success = true
            state.error = null
            state.photos = action.payload
        }).addCase(deletePhotos.pending, (state) => {
            state.loading = true
            state.error = null
        }).addCase(deletePhotos.fulfilled, (state, action) => {
            state.loading = false
            state.success = true
            state.error = null
            state.photos = state.photos.filter((photo) => {
                return photo._id !== action.payload.id
            })
            state.message = action.payload.message
        }).addCase(deletePhotos.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.photo = {}
        }).addCase(updatePhotos.pending, (state) => {
            state.loading = true
            state.error = null
        }).addCase(deletePhotos.fulfilled, (state, action) => {
            state.loading = false
            state.success = true
            state.error = null
            state.photos.map((photo) => {
                if(photo._id === action.payload.photo._id) {
                    return photo.title = action.payload.photo.title
                }
                return photo
            })
            state.message = action.payload.message
        }).addCase(updatePhotos.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.photo = {}
        })
    }
})

export const { resetMessage } = photoSlice.actions
export default photoSlice.reducer
