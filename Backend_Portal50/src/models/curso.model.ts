import mongoose, { Schema, Document } from 'mongoose';

export interface ICurso extends Document {
  profesionalId: mongoose.Types.ObjectId;
  titulo: string;
  descripcion: string;
  categoria: string;
  videoIntro?: string;
  precio: number;
  tipoPago: 'sesion' | 'mensual';
  agendaDisponible: Date[];
  calificacionPromedio: number;
  activo: boolean;
  creadoEn: Date;
  duracionMinutos: number;
}

const CursoSchema = new Schema<ICurso>({
  profesionalId: { type: Schema.Types.ObjectId, ref: 'usuarios', required: true },
  titulo: { type: String, required: true },
  descripcion: String,
  categoria: String,
  videoIntro: String,
  precio: Number,
  tipoPago: { type: String, enum: ['sesion', 'mensual'], required: true },
  agendaDisponible: [Date],
  calificacionPromedio: { type: Number, default: 0 },
  duracionMinutos: { type: Number, required: true },
  creadoEn: { type: Date, default: Date.now },
  activo: { type: Boolean, default: true }
});

export default mongoose.model<ICurso>('cursos', CursoSchema, 'cursos');
