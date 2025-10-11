// Enums
export enum Gender {
  MASCULINE = 1,
  FEMININE = 2,
  NON_BINARY = 3,
  PREFER_NOT_TO_SAY = 4,
  OTHER = 5,
}

export interface GenderInfo {
  id: number;
  description: string;
}

export const GENDER_INFO: Record<Gender, GenderInfo> = {
  [Gender.MASCULINE]: {
    id: 1,
    description: 'Masculino',
  },
  [Gender.FEMININE]: {
    id: 2,
    description: 'Femenino',
  },
  [Gender.NON_BINARY]: {
    id: 3,
    description: 'No Binario',
  },
  [Gender.PREFER_NOT_TO_SAY]: {
    id: 4,
    description: 'Prefiero no decir',
  },
  [Gender.OTHER]: {
    id: 5,
    description: 'Otro',
  },
};

export enum RunningExperience {
  BEGINNER = 1,
  INTERMEDIATE = 2,
  ADVANCED = 3,
}

export interface RunningExperienceInfo {
  id: number;
  description: string;
}

export const RUNNING_EXPERIENCE_INFO: Record<RunningExperience, RunningExperienceInfo> = {
  [RunningExperience.BEGINNER]: {
    id: 1,
    description: 'Principiante',
  },
  [RunningExperience.INTERMEDIATE]: {
    id: 2,
    description: 'Intermedio',
  },
  [RunningExperience.ADVANCED]: {
    id: 3,
    description: 'Avanzado',
  },
};

export enum UsuallyTravelRace {
  GO_ALONE = 1,
  GO_WITH_FRIENDS_FAMILY = 2,
  USUALLY_BRING_PEOPLE = 3,
}

export interface UsuallyTravelRaceInfo {
  id: number;
  description: string;
}

export const USUALLY_TRAVEL_RACE_INFO: Record<UsuallyTravelRace, UsuallyTravelRaceInfo> = {
  [UsuallyTravelRace.GO_ALONE]: {
    id: 1,
    description: 'Voy solo',
  },
  [UsuallyTravelRace.GO_WITH_FRIENDS_FAMILY]: {
    id: 2,
    description: 'Voy con amigos/familia',
  },
  [UsuallyTravelRace.USUALLY_BRING_PEOPLE]: {
    id: 3,
    description: 'Suelo llevar gente',
  },
};

export enum RaceType {
  STREET = 1,
  TRAIL = 2,
}

export interface RaceTypeInfo {
  id: number;
  description: string;
}

export const RACE_TYPE_INFO: Record<RaceType, RaceTypeInfo> = {
  [RaceType.STREET]: {
    id: 1,
    description: 'Calle',
  },
  [RaceType.TRAIL]: {
    id: 2,
    description: 'Trail',
  },
};

export enum Distance {
  FIVE_K = 5,
  TEN_K = 20,
  TWENTY_ONE_K = 21,
  FORTY_TWO_K = 42,
}

export interface DistanceInfo {
  id: number;
  description: string;
  shortDescription: string;
}

export const DISTANCE_INFO: Record<Distance, DistanceInfo> = {
  [Distance.FIVE_K]: {
    id: 5,
    description: '5 kilómetros',
    shortDescription: '5K',
  },
  [Distance.TEN_K]: {
    id: 20,
    description: '10 kilómetros',
    shortDescription: '10K',
  },
  [Distance.TWENTY_ONE_K]: {
    id: 21,
    description: '21 kilómetros',
    shortDescription: '21K',
  },
  [Distance.FORTY_TWO_K]: {
    id: 42,
    description: '42 kilómetros',
    shortDescription: '42K',
  },
};

// DTOs
export interface CreateUserProfileCarDto {
  brand: string;
  model: string;
  year: number;
  color: string;
  seats: number;
  licensePlate: string;
}

export interface CreateUserProfileRaceTypeDto {
  raceType: RaceType;
}

export interface CreateUserProfileDistanceDto {
  distance: Distance;
}

export interface CreateCompleteUserProfileDto {
  userId: number;
  name: string;
  surname: string;
  email: string;
  birthYear: number;
  gender: Gender;
  runningExperience: RunningExperience;
  usuallyTravelRace: UsuallyTravelRace;
  imageName?: string;
  cars?: CreateUserProfileCarDto[];
  preferredRaceTypes?: CreateUserProfileRaceTypeDto[];
  preferredDistances?: CreateUserProfileDistanceDto[];
}

// Response DTOs
export interface UserProfileCarResponse {
  id: number;
  brand: string;
  model: string;
  year: number;
  color: string;
  seats: number;
  licensePlate: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfileRaceTypeResponse {
  id: number;
  raceType: RaceType;
}

export interface UserProfileDistanceResponse {
  id: number;
  distance: Distance;
}

export interface UserResponse {
  id: number;
  name: string;
  givenName: string;
  familyName: string;
  email: string;
  pictureUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfileResponse {
  id: number;
  name: string;
  surname: string;
  email: string;
  birthYear: number;
  gender: Gender;
  runningExperience: RunningExperience;
  usuallyTravelRace: UsuallyTravelRace;
  imageName?: string;
  user: UserResponse;
  cars: UserProfileCarResponse[];
  preferredRaceTypes: UserProfileRaceTypeResponse[];
  preferredDistances: UserProfileDistanceResponse[];
  createdAt: Date;
  updatedAt: Date;
}