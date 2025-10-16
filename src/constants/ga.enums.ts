// Enums para Google Analytics tracking

export enum GAHitType {
  PAGEVIEW = 'pageview',
  EVENT = 'event',
  TIMING = 'timing_complete',
}

export enum GACategory {
  USER = 'user',
  TRIP = 'trip',
  RACE = 'race',
  PERFORMANCE = 'performance',
}

export enum GAAction {
  USER_LOGIN_SUCCESS = 'user_login_success',
  USER_LOGIN_ERROR = 'user_login_error',
  USER_LOGOUT = 'user_logout',
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
