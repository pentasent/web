export type EventType =
  | 'conference'
  | 'symposium'
  | 'webinar'
  | 'workshop'
  | 'journal_club'
  | 'panel'
  | 'summit'
  | 'meetup'
  | 'other';

export type EventCategory = EventType;

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  type: string;
  typeLabel?: string;
  description: string;
  date: string;
  startTime?: string;
  endTime?: string;
  isVirtual: boolean;
  location: string;
  organizerName?: string;
  bannerUrl?: string;
  registrationUrl?: string;
  attendeesCount?: number;
}

export type EventFormat = 'online' | 'in_person' | 'hybrid';

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';

export type EventPricingType = 'free' | 'paid';

export type RegistrationType = 'platform' | 'external';

export type RegistrationStatus = 'open' | 'closed' | 'waitlist_only';

export interface PublicEventDTO {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  eventType: EventType;
  format: EventFormat;
  status: EventStatus;
  pricingType: EventPricingType;
  priceAmount: number | null;
  currency: string;
  bannerUrl: string | null;
  timezone: string;
  registrationType: RegistrationType;
  registrationStatus: RegistrationStatus;
  externalRegistrationUrl: string | null;
  capacity: number | null;
  waitlistEnabled: boolean;
  viewCount: number;
  registrationCount: number;
  isFeatured: boolean;
  publishedAt: string | null;
  nextSessionStart: string | null;
  nextSessionEnd: string | null;
  venueSummary: string | null;
  organizerSummary: {
    displayName: string;
    avatarUrl: string | null;
  } | null;
  community: {
    id: string;
    slug: string;
    name: string;
  } | null;
  tags: string[];
  isRegistered?: boolean;
  isOwner?: boolean;
  createdAt: string;
}

export interface EventSessionDTO {
  id: string;
  title: string;
  description: string | null;
  sessionType: string;
  startAt: string;
  endAt: string;
  timezone: string;
  locationType: string;
  venueName: string | null;
  sortOrder: number;
  status: string;
  speakerIds: string[];
}

export interface EventVenueDTO {
  id: string;
  venueName: string;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  stateRegion: string | null;
  postalCode: string | null;
  country: string | null;
  countryCode: string | null;
  landmark: string | null;
  roomName: string | null;
  venueWebsite: string | null;
  directions: string | null;
  accessibilityInformation: string | null;
}

export interface EventOnlineAccessDTO {
  platform: string;
  meetingUrl: string | null;
  accessInstructions: string | null;
  recordingUrl: string | null;
}

export interface EventSpeakerDTO {
  id: string;
  displayName: string;
  title: string | null;
  organizationName: string | null;
  bio: string | null;
  profileUrl: string | null;
  avatarUrl: string | null;
  speakerType: string;
  sortOrder: number;
}

export interface EventOrganizerDTO {
  id: string;
  displayName: string;
  roleTitle: string | null;
  bio: string | null;
  email: string | null;
  profileUrl: string | null;
  avatarUrl: string | null;
  isPrimary: boolean;
}

export interface EventResourceDTO {
  id: string;
  title: string;
  description: string | null;
  resourceType: string;
  url: string;
  cloudinaryUrl: string | null;
  sortOrder: number;
}

export interface EventInstructionDTO {
  id: string;
  title: string;
  body: string;
  instructionType: string;
  sortOrder: number;
  isRequired: boolean;
}

export interface EventFaqDTO {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}

export interface EventRegistrationDTO {
  id: string;
  eventId: string;
  userId: string | null;
  registrationNumber: string;
  registrationStatus: string;
  ticketType: string;
  amountPaid: number;
  currency: string;
  registeredAt: string;
  fullName: string;
  email: string;
  organizationName?: string | null;
  jobTitle?: string | null;
}

export interface EventDetailDTO extends PublicEventDTO {
  description: string;
  sessions: EventSessionDTO[];
  venues: EventVenueDTO[];
  onlineAccess: EventOnlineAccessDTO | null;
  organizers: EventOrganizerDTO[];
  speakers: EventSpeakerDTO[];
  resources: EventResourceDTO[];
  instructions: EventInstructionDTO[];
  faqs: EventFaqDTO[];
  userRegistration: EventRegistrationDTO | null;
}

export interface CreateEventInput {
  title: string;
  shortDescription?: string;
  description: string;
  eventType?: EventType;
  format?: EventFormat;
  pricingType?: EventPricingType;
  priceAmount?: number;
  currency?: string;
  bannerUrl?: string;
  timezone?: string;
  communityId?: string;
  registrationType?: RegistrationType;
  externalRegistrationUrl?: string;
  capacity?: number;
  waitlistEnabled?: boolean;
  sessions?: {
    title: string;
    description?: string;
    sessionType?: string;
    startAt: string;
    endAt: string;
    locationType?: string;
  }[];
  venues?: {
    venueName: string;
    addressLine1?: string;
    city?: string;
    stateRegion?: string;
    postalCode?: string;
    country?: string;
    roomName?: string;
  }[];
  onlineAccess?: {
    platform: string;
    meetingUrl?: string;
    accessInstructions?: string;
  };
  tags?: string[];
  faqs?: {
    question: string;
    answer: string;
    sortOrder?: number;
  }[];
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  status?: EventStatus;
}

export interface RegisterEventInput {
  fullName: string;
  email: string;
  phone?: string;
  countryCode?: string;
  countryName?: string;
  organizationName?: string;
  jobTitle?: string;
  notes?: string;
}
