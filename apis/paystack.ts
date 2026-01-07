interface PaystackAPI {
  email: string;
  amount: number;
  reference: string;
  callback_url: string;
  metadata: {
    booking_id: string;
    customer_name: string;
    tour_slug: string;
    participants: number;
  };
}

export const paystackAPI = async (details: PaystackAPI) => {
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

  const response = await fetch(
    "https://api.paystack.co/transaction/initialize",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    }
  );

  return response;
};
