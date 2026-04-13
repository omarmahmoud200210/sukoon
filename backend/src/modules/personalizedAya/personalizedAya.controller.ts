import PersonalizedAyaService from "./personalizedAya.service.js";
import type { RequestHandler } from "express";

class PersonalizedAyaController {
  constructor(private personalizedAya: PersonalizedAyaService) {}

  getPersonalizedQuranAya: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const aya = await this.personalizedAya.getPersonalizedAya(userId);
    return res.status(200).json(aya);
  };
}

export default PersonalizedAyaController;
