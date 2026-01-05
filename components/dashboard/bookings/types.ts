export interface BookingsType {
  id: string;
  user_id: string;
  tour_id: string;
  booking_reference: string;
  start_date: string;
  number_of_participants: number;
  total_amount: number;
  booking_status: string;
  payment_status: string;
  payment_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  special_requests: string;
  refund_requested: boolean;
  created_at: string;
  updated_at: string;
  tours: {
    title: string;
    slug: string;
    destination: string;
    image_url: string;
    category: string;
  };
}
