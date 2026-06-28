export type PaymentInitializationInput = {
  amountKobo: number;
  email: string;
  reference: string;
  callbackUrl: string;
};

export type PaymentVerificationResult = {
  providerReference: string;
  amountKobo: number;
  status: "success" | "failed" | "processing";
  raw: unknown;
};
