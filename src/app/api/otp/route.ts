import { withApiHandler } from "@/lib/api";
import { generateOtpSchema } from "@/lib/validation/purchase";
import { generatePurchaseOtp } from "@/lib/otp";
import { getRequestUser } from "@/lib/auth/session";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const body = generateOtpSchema.parse(await request.json());
    const user = await getRequestUser();
    return generatePurchaseOtp({
      purchaseId: body.purchaseId,
      userId: user.id,
    });
  });
}
