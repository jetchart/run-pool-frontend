import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Star } from 'lucide-react';
import axiosAuth from '../lib/axios';
import { toast } from 'sonner';
import { RaceHeader } from './RaceHeader';
import { TripRatingType } from './TripCard';

interface Passenger {
  id: number;
  name: string;
  pictureUrl?: string;
}

interface PassengerRatingModalProps {
  open: boolean;
  onClose: () => void;
  tripId: number;
  passengers: Passenger[];
  driverId: number;
  race: any;
}

export const PassengerRatingModal: React.FC<PassengerRatingModalProps> = ({
  open,
  onClose,
  tripId,
  passengers,
  driverId,
  race,
}) => {
  const [ratings, setRatings] = useState<{ [id: number]: number }>({});
  const [comments, setComments] = useState<{ [id: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRating = (passengerId: number, rating: number) => {
    setRatings(prev => ({ ...prev, [passengerId]: rating }));
  };

  const handleComment = (passengerId: number, comment: string) => {
    setComments(prev => ({ ...prev, [passengerId]: comment }));
  };

  const handleSubmitAll = async () => {
    setIsSubmitting(true);
    try {
      await Promise.all(
        passengers.map(p =>
          ratings[p.id]
            ? axiosAuth.post('/trip-ratings', {
                tripId,
                raterId: driverId,
                ratedId: p.id,
                type: TripRatingType.DRIVER_TO_PASSENGER,
                rating: ratings[p.id],
                comment: comments[p.id]?.trim() || undefined,
              })
            : Promise.resolve()
        )
      );
      toast.success('¡Valoraciones enviadas!');
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al enviar las valoraciones');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <RaceHeader race={race} />
        <DialogHeader>
          <DialogTitle>Calificar pasajeros</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6 py-2">
          {passengers.map(p => (
            <div key={p.id} className="flex flex-col gap-2 border-b pb-4 last:border-b-0">
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold">
                  {p.pictureUrl ? (
                    <img src={p.pictureUrl} alt={p.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span>{p.name.split(' ').map(n => n[0]).join('').slice(0,2)}</span>
                  )}
                </div>
                <div className="text-base font-semibold mr-2">{p.name}</div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRating(p.id, star)}
                      className="focus:outline-none"
                      aria-label={`Calificar ${star} estrellas`}
                    >
                      <Star
                        className={`w-6 h-6 ${ratings[p.id] >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        fill={ratings[p.id] >= star ? '#facc15' : 'none'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                className="w-full border rounded-md p-2 text-sm resize-none mb-2"
                rows={2}
                placeholder="¿Querés dejar un mensaje? (opcional)"
                value={comments[p.id] || ''}
                onChange={e => handleComment(p.id, e.target.value)}
                maxLength={300}
              />
            </div>
          ))}
        </div>
        <Button
          className="w-full mt-2"
          onClick={handleSubmitAll}
          disabled={isSubmitting || passengers.length === 0 || !passengers.every(p => !!ratings[p.id])}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar todas las valoraciones'}
        </Button>
        <Button
          className="w-full mt-1"
          variant="ghost"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Omitir
        </Button>
      </DialogContent>
    </Dialog>
  );
};
