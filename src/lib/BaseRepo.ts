import { databases, config, account } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { HistoryRecorder, HistoryOperations, ObjectType } from '@/history/history-recorder';

export class BaseRepository {
  private collectionId: string;
  private databaseId: string = config.databaseId;
  private historyLogger: HistoryRecorder;
  private objectType: ObjectType;
  private user: any;


  constructor(collectionId: string, objectType: ObjectType) {
    this.collectionId = collectionId;
    this.historyLogger = new HistoryRecorder();
    this.objectType = objectType;
  }

  // Create a document and log it
  async createDocument(data: any): Promise<any> {
    await this.getUser();
    try {
      const createdDoc = await databases.createDocument(
        this.databaseId,
        this.collectionId,
        ID.unique(),
        data
      );

      // Logging the action  
      const log = this.historyLogger.logCreation(data = data);
      await this.historyLogger.logChange(
        createdDoc.$id,
        this.objectType,
        this.user,
        HistoryOperations.CREATE,
        log,
      )
      return createdDoc;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Get a document by ID
  async getDocumentById(documentId: string): Promise<any> {
    try {
      return await databases.getDocument(
        this.databaseId,
        this.collectionId,
        documentId
      );
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Update a document by ID
  async updateDocumentById(documentId: string, data: any): Promise<any> {
    await this.getUser();
    try {
      const currentDoc = await this.getDocumentById(documentId);
      const updatedDoc = await databases.updateDocument(
        this.databaseId,
        this.collectionId,
        documentId,
        data
      );

      await this.historyLogger.logChange(
        documentId,
        this.objectType,
        this.user,
        HistoryOperations.UPDATE,
        undefined,
        currentDoc,
        updatedDoc,
      );

      return updatedDoc;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // List documents with optional queries
  async listDocuments(query: any[] = []): Promise<any> {
    try {
      return await databases.listDocuments(
        this.databaseId,
        this.collectionId,
        query
      );
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Delete a document by ID
  async deleteDocumentById(documentId: string): Promise<any> {
    await this.getUser();
    try {
      const currentStateDoc = await this.getDocumentById(documentId);
      const result = await databases.deleteDocument(
        this.databaseId,
        this.collectionId,
        documentId
      );

      // Logging the action  
      const log = this.historyLogger.logDeletion(currentStateDoc)
      await this.historyLogger.logChange(
        documentId,
        this.objectType,
        this.user,
        HistoryOperations.DELETE,
        log,
      )

      return result;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  // Error handler
  private handleError(error: any): any {
    console.error("Appwrite Error:", error.message);
    return { error: error.message };
  }

  private async getUser() {
    if (!this.user) {
      this.user = await this.getCurrentUser();
    }
    return null;
  }

  private async getCurrentUser () {
    try {
      const user = await account.get();
      console.log(user);
      return user;
    } catch (error: any) {
      return console.log("Authentication error:", error);
    }
  }

}
