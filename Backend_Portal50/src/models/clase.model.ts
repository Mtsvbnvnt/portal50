import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  uid: string;
  rol: string;
  nombre: string;
  email: string;
  telefono?: string;
  pais: string;
  empresaId?: mongoose.Types.ObjectId;
  certificado?: boolean;
  videoPresentacion?: string;
  experiencia?: string;
  habilidades: string[];
  educacion: {
    institucion: string;
    titulo: string;
    desde: string;
    hasta: string;
  }[];
  idiomas: {
    idioma: string;
    nivel: string;
  }[];
  activo: boolean;
  creadoEn: Date;
  actualizadoEn: Date;
}

const UserSchema = new Schema<IUser>({
  uid: { type: String, required: true, unique: true },
  rol: { type: String, required: true },
  nombre: { type: String, required: true },
  email: { type: String, required: true },
  telefono: String,
  pais: { type: String, required: true },
  empresaId: { type: Schema.Types.ObjectId, ref: 'usuarios' },
  certificado: { type: Boolean, default: false },
  videoPresentacion: String,
  experiencia: String,
  habilidades: [String],
  educacion: [
    {
      institucion: String,
      titulo: String,
      desde: String,
      hasta: String,
    }
  ],
  idiomas: [
    {
      idioma: String,
      nivel: String,
    }
  ],
  activo: { type: Boolean, default: true },
  creadoEn: { type: Date, default: Date.now },
  actualizadoEn: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('usuarios', UserSchema);
