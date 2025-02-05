import { z } from "zod";

export const createPasswordSchema = (getMessage: (key: string) => string) =>
  z
    .string()
    .min(8, { message: getMessage("minLength") })
    .regex(/[A-ZА-ЯЁ]/, {
      message: getMessage("uppercase"),
    })
    .regex(/[a-zа-яё]/, {
      message: getMessage("lowercase"),
    })
    .regex(/\d/, { message: getMessage("digit") })
    .regex(/[@$!%*?&]/, {
      message: getMessage("specialChar"),
    });
