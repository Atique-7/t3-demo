import { databases, config  } from '@/lib/appwrite';
import { ID } from 'appwrite';

export enum ObjectType {
    CAR = 'cars',
    JOB_CARD = 'job_cards',
    PARTS = 'parts',
    LABOUR = 'labour',
    TEMP_CARS = 'temp-cars',
    INVOICE = 'invoice',
    CAR_MODEL = 'car-model',
  }

export enum HistoryOperations {
    CREATE = 'created',
    UPDATE = 'updated',
    DELETE = 'deleted',
  }

export class HistoryRecorder {
    private historyCollectionId: string;

    constructor() {
        this.historyCollectionId = config.historyCollectionId;
    }

    // Log history entry as a string
    async logChange(
        objectId: string,
        objectType: ObjectType,
        user: any,
        operationType: HistoryOperations,
        changes?: any[], // Make changes an optional parameter
        prevData?: any,
        newData?: any,
    ) {
        const timestamp = new Date().toISOString();

        // Check if changes are provided; if not, calculate them
        const trackedChanges = changes || this.trackChanges(prevData, newData);

        if (!trackedChanges.length || objectType === ObjectType.CAR_MODEL) {
            return;
        }

        const historyEntry = {
            objectId: objectId,
            objectType: objectType,
            operationType: operationType,
            userId: user.$id,
            userEmail: user.email,
            userName: user.name,
            timestamp: timestamp,
            changes: trackedChanges,
        };


        const stringifiedHistoryEntry = Object.entries(historyEntry).map(([key, value]) => {
            // Convert complex objects or arrays to a JSON string
            if (typeof value === 'object') {
                return `${key}: ${JSON.stringify(value)}`;
            }
            // For other types, convert to string directly
            return `${key}: ${String(value)}`;
        });

        await databases.createDocument(config.databaseId, this.historyCollectionId, ID.unique(), {
            history: stringifiedHistoryEntry,
        });
    }

    logCreation(data: any): any[] {
        const changes = [];
        const filteredNewState = this.filterRelevantChanges(data);

        for (const key in filteredNewState) {
            const change = {
                object: key,
                prevState: null,
                currentState: filteredNewState[key],
            };
            changes.push(change);
        }

        return changes;
    }

    logDeletion(prevState: any): any[] {
        const changes = [];
        const filteredPrevState = this.filterRelevantChanges(prevState);

        for (const key in filteredPrevState) {
            const change = {
                object: key,
                prevState: filteredPrevState[key],
                currentState: null,
            };
            changes.push(change); // Stringify the change object
        }

        return changes;
    }

    private trackChanges(prevData: any, newData: any): any[] {
        const changes = [];
        const filteredPrevState = this.filterRelevantChanges(prevData);
        const filteredNewState = this.filterRelevantChanges(newData);
    
        for (const key in filteredNewState) {
            // Skip unchanged keys and handle deep comparisons for objects
            if (!this.areValuesEqual(filteredPrevState[key], filteredNewState[key])) {
                const change = {
                    object: key,
                    prevState: filteredPrevState[key] || null,
                    currentState: filteredNewState[key],
                };
                changes.push(change);
            }
        }
    
        return changes;
    }
    
    // Helper function to compare values, with handling for deep objects and arrays
    private areValuesEqual(val1: any, val2: any): boolean {
        if (val1 === val2) return true;
    
        // Handle case for arrays or objects (deep comparison)
        if (typeof val1 === 'object' && typeof val2 === 'object') {
            return JSON.stringify(val1) === JSON.stringify(val2);
        }
    
        return false;
    }

    private filterRelevantChanges(data: any) {
        const excludedFields = ['$collectionId', '$createdAt', '$updatedAt', '$id', '$permissions', '$databaseId'];
        const filteredState: any = {};

        for (const key in data) {
            if (!excludedFields.includes(key)) {
                filteredState[key] = data[key];
            }
        }

        return filteredState;
    }
}
