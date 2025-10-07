import { Schema, model, Document } from 'mongoose';

export interface ISolicitudEmpleo extends Document {
  empresaId: Schema.Types.ObjectId;
  ejecutivoId?: Schema.Types.ObjectId;
  titulo: string;
  descripcion: string;
  modalidad: string;
  jornada: string;
  ubicacion?: string;
  salario?: string;
  etiquetas?: string[];
  preguntas: {
    pregunta: string;
    obligatoria: boolean;
  }[];
  estado: 'pendiente' | 'en_revision' | 'aprobada' | 'rechazada' | 'con_correcciones' | 'publicada';
  fechaSolicitud: Date;
  fechaRevision?: Date;
  fechaPublicacion?: Date;
  comentariosEjecutivo?: string;
  comentariosEmpresa?: string;
  jobId?: Schema.Types.ObjectId; // Referencia al job una vez creado
  historial: {
    fecha: Date;
    estado: string;
    comentario?: string;
    usuario: Schema.Types.ObjectId;
    tipoUsuario: 'empresa' | 'ejecutivo';
  }[];
}

const solicitudEmpleoSchema = new Schema<ISolicitudEmpleo>({
  empresaId: { type: Schema.Types.ObjectId, required: true, ref: 'Empresa' },
  ejecutivoId: { type: Schema.Types.ObjectId, ref: 'User' },
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  modalidad: { 
    type: String, 
    enum: ['presencial', 'remota', 'híbrida'], 
    required: true 
  },
  jornada: { type: String, required: true },
  ubicacion: { type: String },
  salario: { type: String },
  etiquetas: [String],
  preguntas: [{
    pregunta: { type: String, required: true },
    obligatoria: { type: Boolean, default: false }
  }],
  estado: { 
    type: String, 
    enum: ['pendiente', 'en_revision', 'aprobada', 'rechazada', 'con_correcciones', 'publicada'],
    default: 'pendiente'
  },
  fechaSolicitud: { type: Date, default: Date.now },
  fechaRevision: { type: Date },
  fechaPublicacion: { type: Date },
  comentariosEjecutivo: { type: String },
  comentariosEmpresa: { type: String },
  jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
  historial: [{
    fecha: { type: Date, default: Date.now },
    estado: { type: String, required: true },
    comentario: { type: String },
    usuario: { type: Schema.Types.ObjectId, required: true },
    tipoUsuario: { type: String, enum: ['empresa', 'ejecutivo'], required: true }
  }]
}, {
  timestamps: true
});

export const SolicitudEmpleo = model<ISolicitudEmpleo>('SolicitudEmpleo', solicitudEmpleoSchema, 'solicitudes_empleo');