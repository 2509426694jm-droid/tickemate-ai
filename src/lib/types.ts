export type StepId = 1 | 2 | 3 | 4 | 5 | 6;

export interface Step {
  id: StepId;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface Concert {
  id: string;
  artist: string;
  artistKr: string;
  tour: string;
  date: string;
  venue: string;
  venueKr: string;
  city: string;
  image: string;
  difficulty: "Easy" | "Hard" | "Extreme";
  platform: string;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  zone: string;
  price: number;
  available: boolean;
  type: "pit" | "floor" | "lower" | "upper";
}

export interface UserState {
  selectedConcert: Concert | null;
  accountVerified: boolean;
  fanClubJoined: boolean;
  queuePosition: number | null;
  selectedSeat: Seat | null;
  paymentComplete: boolean;
  currentStep: StepId;
}
