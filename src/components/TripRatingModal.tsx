import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Star } from 'lucide-react';
import axiosAuth from '../lib/axios';
import { toast } from 'sonner';

import { TripRatingType } from './TripCard';

interface TripRatingModalProps {
  open: boolean;
  onClose: () => void;
  trip: any; // TripResponse
  raterId: number;
  ratedId: number;
  ratedName: string;
  ratedPictureUrl?: string;
  fromCity: string;
  toCity: string;
  ratingType: TripRatingType;
}

export const TripRatingModal: React.FC<TripRatingModalProps> = ({
  open,
  onClose,
  trip,
  raterId,
  ratedId,
  ratedName,
  ratedPictureUrl,
  fromCity,
  toCity,
  ratingType,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      toast.error('Selecciona una calificación.');
      return;
    }
    setIsSubmitting(true);
    try {
      await axiosAuth.post('/trip-ratings', {
        tripId: trip.id,
        raterId,
        ratedId,
        type: ratingType,
        rating,
        comment: comment.trim() || undefined,
      });
      toast.success('¡Valoración enviada!');
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al enviar la valoración');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Calificar tu viaje</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-2 py-2">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold mb-2">
            {ratedPictureUrl ? (
              <img src={ratedPictureUrl} alt={ratedName} className="w-full h-full object-cover rounded-full" />
            ) : (
              <span>{ratedName.split(' ').map(n => n[0]).join('').slice(0,2)}</span>
            )}
          </div>
          <div className="text-lg font-semibold">{ratedName}</div>
          <div className="text-sm text-gray-500 mb-2">¿Cómo estuvo tu viaje de <b>{fromCity}</b> a <b>{toCity}</b>?</div>
          <div className="flex items-center gap-1 mb-2">
            {[1,2,3,4,5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
                aria-label={`Calificar ${star} estrellas`}
              >
                <Star
                  className={`w-8 h-8 ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  fill={rating >= star ? '#facc15' : 'none'}
                />
              </button>
            ))}
          </div>
          <textarea
            className="w-full border rounded-md p-2 text-sm resize-none mb-2"
            rows={3}
            placeholder="¿Querés dejar un mensaje? (opcional)"
            value={comment}
            onChange={e => setComment(e.target.value)}
            maxLength={300}
          />
          <Button
            className="w-full mt-2"
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar valoración'}
          </Button>
          <Button
            className="w-full mt-1"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Omitir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
