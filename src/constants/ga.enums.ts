// Enums para Google Analytics tracking

export enum GAHitType {
  PAGEVIEW = 'pageview',
  EVENT = 'event',
  TIMING = 'timing_complete',
}

export enum GACategory {
  USER_INTERACTION = 'user_interaction',
  TRIP_MANAGEMENT = 'trip_management',
  RACE_INTERACTION = 'race_interaction',
  PERFORMANCE = 'performance',
  UI_INTERACTION = 'ui_interaction',
}

export enum GAAction {
  LOGIN_SUCCESS = 'login_success',
  LOGIN_ERROR = 'login_error',
  LOGOUT = 'login_logout',
  PROFILE_COMPLETED = 'profile_completed',
  TRIP_CREATED = 'trip_created',
  TRIP_CREATION_ERROR = 'trip_creation_error',
  TRIP_PASSENGER_JOINED = 'trip_passenger_joined',
  TRIP_PASSENGER_LEFT = 'trip_passenger_left',
  RACE_VIEW_DETAIL = 'race_view_detail',
  RACE_VIEW_TRIPS = 'race_view_trips',
  RACE_WEBSITE_CLICK = 'race_website_click',
  BUTTON_CLICK = 'button_click',
  API_RESPONSE = 'api_response',
}
