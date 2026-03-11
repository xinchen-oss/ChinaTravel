import mongoose from 'mongoose';



const forumPostSchema = new mongoose.Schema(
  {
    titulo: { type: String, },
    contenido: { type: String, required: true },
    ciudad: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
    imagen: { type: String },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    parentPost: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumPost', default: null },
  },
  { timestamps: true }
);

export default mongoose.model('ForumPost', forumPostSchema);
