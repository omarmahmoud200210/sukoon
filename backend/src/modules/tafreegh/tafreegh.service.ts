import TafreeghRepository from "./tafreegh.repository.js";

class TafreeghService {
  constructor(private tafreeghRepository: TafreeghRepository) {}

  async getAllTafreeghs(userId: number) {
    return await this.tafreeghRepository.getAllTafreeghs(userId);
  }

  async getTafreeghById(id: number, userId: number) {
    return await this.tafreeghRepository.getTafreeghById(id, userId);
  }

  async createTafreegh(userId: number, content: string) {
    return await this.tafreeghRepository.createTafreegh(userId, content);
  }

  async updateTafreegh(id: number, userId: number, content?: string) {
    return await this.tafreeghRepository.updateTafreegh(id, userId, content);
  }

  async deleteTafreegh(id: number, userId: number) {
    return await this.tafreeghRepository.deleteTafreegh(id, userId);
  }

  async deleteAllTafreegh(userId: number) {
    return await this.tafreeghRepository.deleteAllTafreegh(userId);
  }
}

export default TafreeghService;
