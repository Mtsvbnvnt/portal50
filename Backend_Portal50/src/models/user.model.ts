import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  uid: string;
  nombre: string;
  apellido?: string;
  email: string;
  rol: string;
  telefono?: string;
  pais?: string;
  experiencia?: string;
  habilidades?: string[];
  educacion?: { institucion: string; titulo: string; desde: string; hasta: string }[];
  idiomas?: { idioma: string; nivel: string }[];
  cv?: string;                
  videoPresentacion?: string;
  modalidadPreferida?: string;
  activo: boolean;
  isEjecutivo?: boolean;
  fotoPerfil?: string;
  disponibilidad?: string;
  empresaAsignada?: Schema.Types.ObjectId;
  empresasAsignadas?: Schema.Types.ObjectId[]; // Array para múltiples empresas
}

const userSchema = new Schema<IUser>({
  uid: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  apellido: String,
  email: { type: String, required: true },
  rol: String,
  telefono: String,
  pais: String,
  experiencia: String,
  habilidades: [String],
  educacion: [
    {
      institucion: String,
      titulo: String,
      desde: String,
      hasta: String
    }
  ],
  idiomas: [
    {
      idioma: String,
      nivel: String
    }
  ],
  cv: String,          
  videoPresentacion: String,
  modalidadPreferida: {
    type: String,
    enum: ['remota', 'presencial', 'híbrida', 'fraccional', 'tiempo completo', 'proyecto'],
    default: 'fraccional'
  },
  activo: { type: Boolean, default: true },
  isEjecutivo: { type: Boolean, default: false },
  fotoPerfil: { type: String },
  disponibilidad: {
    type: String,
    enum: ['disponible', 'con condiciones', 'no disponible'],
    default: 'disponible'
  },
  empresaAsignada: { type: Schema.Types.ObjectId, ref: 'Empresa' },
  empresasAsignadas: [{ type: Schema.Types.ObjectId, ref: 'Empresa' }] // Array para múltiples empresas
});

export const User = model<IUser>('User', userSchema, 'usuarios');
