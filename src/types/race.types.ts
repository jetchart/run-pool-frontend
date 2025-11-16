import { RaceType, RACE_TYPE_INFO } from './userProfile.types';

export { RaceType, RACE_TYPE_INFO };

export interface CreateRaceDistance {
  distance: number;
}

export interface CreateRaceDto {
  imageUrl: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  city: string;
  province: string;
  country: string;
  location: string;
  website: string;
  raceType: RaceType;
  raceDistances: CreateRaceDistance[];
}
