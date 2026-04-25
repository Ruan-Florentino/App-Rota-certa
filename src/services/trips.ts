import { db, auth } from '../firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp,
  doc,
  getDoc,
  updateDoc 
} from 'firebase/firestore';
import { z } from 'zod';

// Schema de validação
const tripSchema = z.object({
  title: z.string().min(3, 'Título precisa ter pelo menos 3 caracteres'),
  destination: z.object({
    name: z.string().min(1, 'Destino obrigatório'),
    country: z.string().min(1),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
  }),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  travelers: z.number().min(1).max(50).default(1),
  budget: z.number().min(0).optional(),
  categories: z.array(z.string()).default([]),
  description: z.string().max(1000).optional(),
  isPublic: z.boolean().default(false),
});

export type TripInput = z.infer<typeof tripSchema>;

export class TripService {
  static async create(data: TripInput) {
    try {
      // 1. Verificar autenticação
      if (!auth) throw new Error('Serviço indisponível');
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Você precisa estar logado para criar uma viagem');
      }
      
      // 2. Validar dados
      const validated = tripSchema.parse(data);
      
      // 3. Preparar objeto completo
      const trip = {
        ...data,
        ...validated,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || 'Viajante',
        userAvatar: user.photoURL || null,
        startDate: new Date(validated.startDate).toISOString(),
        endDate: new Date(validated.endDate).toISOString(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'draft',
        version: 1,
        stats: {
          views: 0,
          likes: 0,
          saves: 0,
          comments: 0,
        },
        activities: (data as any).activities || [],
        days: (data as any).days || [],
      };
      
      // 4. Salvar no Firestore
      const docRef = await addDoc(collection(db, 'trips'), trip);
      
      // console.log('✅ Viagem criada:', docRef.id);
      
      return { 
        success: true, 
        id: docRef.id,
        data: { ...trip, id: docRef.id },
      };
      
    } catch (error) {
      console.error('❌ Erro ao criar viagem:', error);
      
      // Error messages específicos
      if (error instanceof z.ZodError) {
        throw new Error(`Campo inválido: ${(error as any).errors[0].message}`);
      }
      
      if ((error as any).code === 'permission-denied') {
        throw new Error('Sem permissão. Verifique seu login e tente novamente.');
      }
      
      if ((error as any).code === 'unavailable') {
        throw new Error('Sem conexão com o servidor. Verifique sua internet.');
      }
      
      throw error instanceof Error 
        ? error 
        : new Error('Erro inesperado ao criar viagem');
    }
  }
  
  static async update(tripId: string, data: Partial<TripInput>) {
    try {
      if (!auth || !db) throw new Error('Indisponível');
      const user = auth.currentUser;
      if (!user) throw new Error('Não autenticado');
      
      const tripRef = doc(db, 'trips', tripId);
      const tripDoc = await getDoc(tripRef);
      
      if (!tripDoc.exists()) {
        throw new Error('Viagem não encontrada');
      }
      
      if (tripDoc.data().userId !== user.uid) {
        throw new Error('Você não tem permissão para editar esta viagem');
      }
      
      await updateDoc(tripRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      
      return { success: true };
      
    } catch (error) {
      console.error('❌ Erro ao atualizar:', error);
      throw error;
    }
  }
}
