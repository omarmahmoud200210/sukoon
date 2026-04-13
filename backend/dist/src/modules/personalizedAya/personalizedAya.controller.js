import PersonalizedAyaService from "./personalizedAya.service.js";
class PersonalizedAyaController {
    personalizedAya;
    constructor(personalizedAya) {
        this.personalizedAya = personalizedAya;
    }
    getPersonalizedQuranAya = async (req, res) => {
        const userId = req.user.id;
        const aya = await this.personalizedAya.getPersonalizedAya(userId);
        return res.status(200).json(aya);
    };
}
export default PersonalizedAyaController;
