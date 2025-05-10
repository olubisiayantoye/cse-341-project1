const { getDb } = require('../data/database');

class Contact {
  static collection() {
    return getDb().collection(process.env.COLLECTION_NAME || 'contacts');
  }

  static async getAll() {
    return await this.collection().find().toArray();
  }

  static async getById(id) {
    const { ObjectId } = require('mongodb');
    return await this.collection().findOne({ _id: new ObjectId(id) });
  }

  static async create(contact) {
    const result = await this.collection().insertOne(contact);
    return { _id: result.insertedId, ...contact };
  }

  static async update(id, updates) {
    const { ObjectId } = require('mongodb');
    await this.collection().updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    return await this.getById(id);
  }

  static async delete(id) {
    const { ObjectId } = require('mongodb');
    return await this.collection().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Contact;