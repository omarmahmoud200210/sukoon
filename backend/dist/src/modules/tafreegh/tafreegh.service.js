import TafreeghRepository from "./tafreegh.repository.js";
class TafreeghService {
    tafreeghRepository;
    constructor(tafreeghRepository) {
        this.tafreeghRepository = tafreeghRepository;
    }
    async getAllTafreeghs(userId) {
        return await this.tafreeghRepository.getAllTafreeghs(userId);
    }
    async getTafreeghById(id, userId) {
        return await this.tafreeghRepository.getTafreeghById(id, userId);
    }
    async createTafreegh(userId, content) {
        return await this.tafreeghRepository.createTafreegh(userId, content);
    }
    async updateTafreegh(id, userId, content) {
        return await this.tafreeghRepository.updateTafreegh(id, userId, content);
    }
    async deleteTafreegh(id, userId) {
        return await this.tafreeghRepository.deleteTafreegh(id, userId);
    }
    async deleteAllTafreegh(userId) {
        return await this.tafreeghRepository.deleteAllTafreegh(userId);
    }
}
export default TafreeghService;
