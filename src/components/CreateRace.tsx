import React, { useState, useEffect } from 'react';
import axiosAuth, { axiosPublic } from '../lib/axios';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { RaceType, RACE_TYPE_INFO, type CreateRaceDto, type CreateRaceDistance } from '../types/race.types';
import { ARGENTINE_PROVINCES, getCitiesByProvince, type ArgentineProvince } from '../constants/provinces';

const emptyDistance = (): CreateRaceDistance => ({ distance: 5 });

const CreateRace: React.FC = () => {
  const navigate = useNavigate();
  const { raceId } = useParams<{ raceId: string }>();
  const isEditing = Boolean(raceId);

  const [isLoadingRace, setIsLoadingRace] = useState(false);

  const [form, setForm] = useState<CreateRaceDto>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    city: '',
    province: '',
    country: 'Argentina',
    website: '',
    location: '',
    raceType: RaceType.STREET,
    raceDistances: [emptyDistance()]
  });
  const [files, setFiles] = useState<File[]>([]);

  const onChange = (k: keyof CreateRaceDto, v: any) => {
    setForm(prev => {
      let updated = { ...prev, [k]: v };
      // Si cambia la provincia, limpiar ciudad
      if (k === 'province') {
        updated.city = '';
        updated.location = '';
      }
      // Actualizar location si cambia provincia o ciudad
      if (k === 'city') {
        updated.location = `${v}, ${prev.province}`;
      }
      return updated;
    });
  };

  const updateDistance = (index: number, value: number) => {
    setForm(prev => {
      const d = [...prev.raceDistances];
      d[index] = { distance: value } as CreateRaceDistance;
      return { ...prev, raceDistances: d };
    });
  };

  const addDistance = () => setForm(prev => ({ ...prev, raceDistances: [...prev.raceDistances, emptyDistance()] }));

  const removeDistance = (index: number) => setForm(prev => ({ ...prev, raceDistances: prev.raceDistances.filter((_, i) => i !== index) }));

  const validateForm = (): boolean => {
    /*if (files.length !== 2) {
      toast.error('Debes subir dos imágenes: principal y thumbnail');
      return false;
    }*/
    if (!form.name || !form.description || !form.startDate || !form.endDate || !form.city || !form.province || !form.country || !form.website || !form.location) {
      toast.error('Por favor completa todos los campos obligatorios');
      return false;
    }

    if (!form.raceDistances || form.raceDistances.length === 0) {
      toast.error('Agrega al menos una distancia');
      return false;
    }

    return true;
  };

  useEffect(() => {
    // Si estamos en modo edición, cargar la carrera
    const loadRace = async () => {
      if (!raceId) return;
      setIsLoadingRace(true);
      try {
        const res = await axiosPublic.get(`/races/${raceId}`);
        const race = res.data as any;

        // Mapeo de campos del backend al formulario
        const startDate = race.startDate ? (race.startDate.includes('T') ? race.startDate.split('T')[0] : race.startDate) : '';
        const endDate = race.endDate ? (race.endDate.includes('T') ? race.endDate.split('T')[0] : race.endDate) : '';

        const raceDistances = ((race.distances) || (race.raceDistances) || []).map((d: any) => {
          // soportar distintas formas: { distance } | { distanceId } | número
          const value = d.distance;
          return { distance: Number(value) } as CreateRaceDistance;
        });

        setForm({
          name: race.name || '',
          description: race.description || '',
          startDate,
          endDate,
          city: race.city,
          province: race.province || '',
          country: race.country || 'Argentina',
          website: race.website || '',
            location: race.location || '',
          raceType: race.raceType ?? RaceType.STREET,
          raceDistances: raceDistances.length ? raceDistances : [emptyDistance()]
        });
      } catch (error: any) {
        console.error('Error cargando carrera para edición:', error);
        toast.error('No se pudo cargar la carrera para editar');
        navigate('/');
      } finally {
        setIsLoadingRace(false);
      }
    };

    loadRace();
  }, [raceId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoadingRace(true);
    try {
      // Enviar las fechas usando mediodía UTC para evitar desplazamientos por zona horaria
      const payload = {
        ...form,
        startDate: form.startDate ? `${form.startDate}T12:00:00Z` : form.startDate,
        endDate: form.endDate ? `${form.endDate}T12:00:00Z` : form.endDate,
      } as CreateRaceDto;
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (key === 'raceDistances') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as any);
        }
      });
      files.forEach(file => formData.append('files', file));
      if (isEditing && raceId) {
        await axiosAuth.put(`/races/${raceId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Carrera actualizada correctamente');
        navigate('/');
      } else {
        await axiosAuth.post('/races', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Carrera creada correctamente');
        navigate('/');
      }
    } catch (error: any) {
      console.error('Error creando carrera:', error);
      const message = error?.response?.data?.message || 'Error inesperado al crear la carrera';
      toast.error(message);
    } finally {
      setIsLoadingRace(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Crear Carrera</h1>
          <p className="text-gray-600">Formulario para crear una nueva carrera</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Carrera</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Imágenes *</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={e => {
                    const filesArr = Array.from(e.target.files || []);
                    setFiles(filesArr.slice(0, 2));
                  }}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <small className="text-xs text-gray-500">Subí dos imágenes: principal y thumbnail</small>
                {files.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {files.map((file, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">{file.name}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre *</label>
                <input value={form.name} onChange={e => onChange('name', e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción *</label>
              <textarea value={form.description} onChange={e => onChange('description', e.target.value)} required rows={4} className="w-full px-3 py-2 border rounded-md" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha inicio *</label>
                <input type="date" value={form.startDate} onChange={e => onChange('startDate', e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha fin *</label>
                <input type="date" value={form.endDate} onChange={e => onChange('endDate', e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sitio web *</label>
              <input type="url" value={form.website} onChange={e => onChange('website', e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Provincia *</label>
                <select
                  value={form.province}
                  onChange={e => onChange('province', e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Selecciona una provincia</option>
                  {ARGENTINE_PROVINCES.map(prov => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ciudad *</label>
                <select
                  value={form.city}
                  onChange={e => onChange('city', e.target.value)}
                  required
                  disabled={!form.province}
                  className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">{form.province ? 'Selecciona una ciudad' : 'Primero selecciona una provincia'}</option>
                  {form.province && getCitiesByProvince(form.province as ArgentineProvince).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">País</label>
                <input value={form.country} disabled className="w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed" />
              </div>
            </div>


            <div className="space-y-2">
              <label className="text-sm font-medium">Ubicación a mostrar *</label>
              <input value={form.location} onChange={e => onChange('location', e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de carrera *</label>
              <select value={String(form.raceType)} onChange={e => onChange('raceType', Number(e.target.value) as RaceType)} className="w-full px-3 py-2 border rounded-md">
                {Object.entries(RACE_TYPE_INFO).map(([key, info]) => (
                  <option key={key} value={key}>{info.description}</option>
                ))}
              </select>
            </div>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Distancias</legend>
              {form.raceDistances.map((d, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={d.distance}
                      onChange={e => updateDistance(i, Number(e.target.value))}
                      className="px-2 py-1 border rounded-md w-24"
                      placeholder="Distancia (km)"
                      required
                    />
                    <Button type="button" variant="ghost" onClick={() => removeDistance(i)} disabled={form.raceDistances.length === 1}>Eliminar</Button>
                  </div>
                </div>
              ))}

              <div>
                <Button type="button" onClick={addDistance}>Añadir distancia</Button>
              </div>
            </fieldset>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">Cancelar</Button>
              <Button type="submit" className="flex-1" disabled={isLoadingRace}>
                {isLoadingRace ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Guardando...
                  </span>
                ) : 'Guardar'}
              </Button>
             </div>
           </form>
         </CardContent>
       </Card>
     </div>
   );
 };

 export default CreateRace;
