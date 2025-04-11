import {
  Client,
  Account,
  Databases,
  Query,
  ID,
  Storage,
  Functions,
} from "appwrite";
import { getCookie } from "cookies-next";
import ImageKit from "imagekit";
import {
  convertStringsToArray,
  convertToISODateTime,
  convertToStrings,
  purposeOfVisits,
} from "./helper";
import { JobCard } from "./definitions";
import { toast } from "sonner";
import { ObjectType } from "@/history/history-recorder";
import { BaseRepository } from "./BaseRepo";
import { pdf } from "@react-pdf/renderer";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "67cbecaa002877aff9d1",
  databaseId: "67cbf28e001bd9202750",
  carsCollectionId: "67d7de21003c86b8560c",
  tempCarsCollectionId: "67d7de3d0031ba6acf15",
  jobCardsCollectionId: "67d7de2d0011a38fb849",
  partsCollectionId: "67d7de480017e6ef3ab0",
  labourCollectionId: "67d7de52000eb43d616c",
  invoicesCollectionId: "67d7de6300233b0a014f",
  historyCollectionId: "67d7de5c000bf1a62cf6",
  carModelsCollectionId: "67d7de73003c99a6b40e",
  insuranceProvidersCollectionId: "67d7de7b0025ff32fdd1",
  deletedJobCardsCollectionId: "67d7de83001e7cc6f569",
  invoiceStorageBucketId: "67d7d77b000b20e7b15a",
  imageStorageBucketId: "67d7d791000f4f810abf",
  pdfStorageBucketId: "67e2a0ba00251bc01769",
  fetchUserInfoFunctionId: "67d7dbc2002b45a542bc",
  atomicCounterCollectionId: "67d7de6e002d1723d043",
};

export let client: any;
export let account: any;
export let databases: any;
export let storage: any;
export let functions: any;

client = new Client();
client.setEndpoint(config.endpoint).setProject(config.projectId);
//   .setPlatform(config.platform);

account = new Account(client);
databases = new Databases(client);
storage = new Storage(client);
functions = new Functions(client);

export const imagekit = new ImageKit({
  publicKey: "public_YxeQGi/zYRicR5GdhQu7UwOMAYg=",
  privateKey: "private_pPkQ38mNRgbbpt9JElST4HPGQfw=",
  urlEndpoint: "https://ik.imagekit.io/ztq7tvia1",
});

const useDev = false;

let apiUrl: string;

if (useDev) {
  apiUrl = "http://localhost:3000";
} else {
  apiUrl = "https://t3-next-dev.vercel.app";
}

export const getInvoiceNumber = async (
  jobCardId: string,
  invoiceType: string,
  isInsuranceInvoice: boolean,
  series: string
) => {
  try {
    const response = await fetch(`${apiUrl}/api/invoiceCounter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobCardId,
        invoiceType,
        isInsuranceInvoice,
        series,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch invoice number.");
    }

    const data = await response.json();
    return {
      invoiceNumber: data.invoiceNumber,
      invoiceCode: data.invoiceCode,
    };
  } catch (error) {
    console.error("Error fetching invoice number:", error);
    toast("Failed to fetch invoice number ❌");
    return null;
  }
};

export const getNextJobCardNumber = async (): Promise<number | null> => {
  try {
    const response = await fetch(`${apiUrl}/api/jobCardCounter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error(`Error fetching job card number: ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    if (data.jobCardNumber) {
      console.log("Next Job Card Number:", data.jobCardNumber);
      return data.jobCardNumber;
    } else {
      console.error("Failed to fetch job card number:", data.message);
      return null;
    }
  } catch (error) {
    console.error("An error occurred while fetching job card number:", error);
    return null;
  }
};

export function analyzeJobCards(jobCards: JobCard[]) {
  const advisorStats: Record<string, number> = {}; // For tracking stats per advisor
  const serviceCategoryStats: Record<string, number> = {}; // For tracking stats per service category
  const totalAmountByAdvisor: Record<string, number> = {}; // For tracking total amount per advisor

  for (const jobCard of jobCards) {
    const advisorEmail = jobCard.serviceAdvisorID;
    const serviceCategory = jobCard.purposeOfVisit;
    const amount = jobCard.amount || 0; // Default to 0 if no amount

    // Count job cards handled by each advisor
    if (advisorEmail) {
      if (!advisorStats[advisorEmail]) {
        advisorStats[advisorEmail] = 0;
      }
      advisorStats[advisorEmail]++;
    }

    // Calculate total amount made in each service category
    if (serviceCategory) {
      if (!serviceCategoryStats[serviceCategory]) {
        serviceCategoryStats[serviceCategory] = 0;
      }
      serviceCategoryStats[serviceCategory] += amount;
    }

    // Calculate total amount made by each advisor
    if (advisorEmail) {
      if (!totalAmountByAdvisor[advisorEmail]) {
        totalAmountByAdvisor[advisorEmail] = 0;
      }
      totalAmountByAdvisor[advisorEmail] += amount;
    }
  }

  return {
    advisorStats,
    serviceCategoryStats,
    totalAmountByAdvisor,
  };
}

// Function to check if there is an active session
export const checkActiveSession = async () => {
  try {
    const session = await account.getSession("current"); // Get the current session
    console.log("CURRENT SESSION", session);
    return session !== null; // Return true if there is an active session
  } catch (error: any) {
    // If there's an error (e.g., no active session), handle it appropriately
    if (error.code === 401) {
      return false; // No active session
    }
    throw error; // Re-throw other unexpected errors
  }
};

// Function to delete all sessions for the current user
export const deleteSessions = async () => {
  try {
    // Get the list of all sessions
    const sessions = await account.listSessions();
    console.log(sessions);

    // Delete each session
    await Promise.all(
      sessions.sessions.map(async (session: { $id: any }) => {
        await account.deleteSession(session.$id);
      })
    );

    console.log("All sessions deleted successfully");
  } catch (error: any) {
    console.error("Error deleting sessions:", error.message);
    throw error; // Re-throw the error for further handling
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    try {
      const activeSession = await checkActiveSession();
      if (activeSession) {
        // Delete the active sessions if one exists
        await deleteSessions();
      }
    } catch (sessionError: any) {
      if (
        sessionError.message?.includes("missing scope") ||
        sessionError.code === 401
      ) {
        console.warn(
          "Session management failed due to scope issues, proceeding with new session creation."
        );
      } else {
        throw sessionError; // Rethrow if it's not a scope issue
      }
    }

    // Fetch current public IP address
    const currentIp = await fetch("https://api64.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => data.ip)
      .catch(() => null);

    // Log the fetched IP for debugging
    console.log("Current IP address:", currentIp);

    try {
      // Fetch all active sessions for the current user
      const sessions = await account.listSessions();
      console.log("Existing sessions:", sessions);

      let matchingSessionFound = false;

      // Check for sessions with the provided email and IP address
      for (const session of sessions.sessions) {
        if (
          session.providerUid === email && // Match the session email
          session.ip === currentIp // Match the session IP
        ) {
          matchingSessionFound = true;
          console.log("Matching session found:", session);

          // Delete the matching session
          console.log("Deleting session:", session.$id);
          await account.deleteSession(session.$id);
          break; // Exit the loop after finding and deleting the matching session
        }
      }

      if (!matchingSessionFound) {
        console.log("No matching session found for the provided email and IP.");
      }
    } catch (sessionError: any) {
      // Handle scope error or other issues with session listing
      if (
        sessionError.message?.includes("missing scope") ||
        sessionError.code === 401
      ) {
        console.warn(
          "Session management failed due to scope issues, proceeding with new session creation."
        );
      } else {
        throw sessionError; // Rethrow if it's not a scope issue
      }
    }

    // Create a new session after clearing old ones (or if no matching session exists)
    const sessionDetails = await account.createEmailPasswordSession(
      email,
      password
    );
    console.log("New session created:", sessionDetails);

    // Fetch and log user details
    const userDetails = await account.get();
    console.log("User details:", userDetails);
    return { userDetails, sessionDetails };
  } catch (error: any) {
    const errorMsg = error.message;
    return { errorMsg };
  }
};

export const listAllUsers = async () => {
  const response = await functions.createExecution(
    config.fetchUserInfoFunctionId
  );
  const obj = JSON.parse(response.responseBody);
  const users = obj.users.users;
  return users;
};

export const listSessions = async () => {
  try {
    const sessions = await account.listSessions();
    return sessions;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    const result = await account.deleteSessions();
    console.log(result);
    return { success: true, result };
  } catch (error: any) {
    console.error("Logout failed:", error);
    return { success: false, message: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    // console.log("This is the USER");
    return user;
  } catch (error: any) {
    return null;
  }
};

export const getAllTempCars = async (statuses?: number[]) => {
  // console.log("Hitting Backend");
  let finalQuery: any[] = [Query.orderDesc("$createdAt"), Query.limit(999999)];
  if (statuses) {
    if (statuses.length > 1) {
      let queries: any = [];
      statuses.map((stat: number) => {
        queries.push(Query.equal("carStatus", [stat]));
      });
      finalQuery = [...finalQuery, Query.or(queries)];
    } else {
      finalQuery = [...finalQuery, Query.equal("carStatus", statuses[0])];
    }
  }
  try {
    let result = await databases.listDocuments(
      config.databaseId,
      config.tempCarsCollectionId,
      finalQuery
    );
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const createCar = async (
  carNumber: string,
  carMake: string,
  carModel: string,
  purposeOfVisitAndAdvisors: string[],
  location?: string
) => {
  try {
    // let carsResult = await databases.createDocument(
    //   config.databaseId,
    //   config.carsCollectionId,
    //   ID.unique(),
    //   { carNumber, carMake, carModel, location, purposeOfVisitAndAdvisors }
    // );
    // console.log("The created Car is - ", result);
    const baseRepo: BaseRepository = new BaseRepository(
      config.carsCollectionId,
      ObjectType.CAR
    );
    let carsResult = await baseRepo.createDocument({
      carNumber,
      carMake,
      carModel,
      location,
      purposeOfVisitAndAdvisors,
    });

    return carsResult;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const createTempCar = async (
  carNumber: string,
  carMake: string,
  carModel: string,
  purposeOfVisitAndAdvisors: string[],
  carsTableId: string,
  location?: string
) => {
  try {
    let carStatus = 0;
    // let carsResult = await databases.createDocument(
    //   config.databaseId,
    //   config.tempCarsCollectionId,
    //   ID.unique(),
    //   {
    //     carNumber,
    //     carMake,
    //     carModel,
    //     location,
    //     carStatus,
    //     carsTableId,
    //     purposeOfVisitAndAdvisors,
    //   }
    // );
    const baseRepo: BaseRepository = new BaseRepository(
      config.tempCarsCollectionId,
      ObjectType.TEMP_CARS
    );
    let carsResult = await baseRepo.createDocument({
      carNumber,
      carMake,
      carModel,
      location,
      carStatus,
      carsTableId,
      purposeOfVisitAndAdvisors,
    });
    // console.log("The created Car is - ", result);
    return carsResult;
  } catch (error: any) {
    console.log("THIS IS ERROR - ", error.message);
    return null;
  }
};

export const uploadImage = async (file: File) => {
  try {
    const result = await storage.createFile(
      config.imageStorageBucketId, // bucketId
      ID.unique(), // fileId
      file, // file
      [] // permissions (optional)
    );

    // Generate the image URL
    const imageUrl = storage.getFileView(
      config.imageStorageBucketId,
      result.$id
    ).href;

    // Generate a thumbnail URL (resized preview)
    const thumbnailUrl = storage.getFilePreview(
      config.imageStorageBucketId,
      result.$id,
      960,
      540,
      "center"
    ).href; // Adjust width & height as needed

    return {
      id: result.$id,
      imageUrl,
      thumbnailUrl,
    };
  } catch (error: any) {
    console.log("UPLOAD ERROR - ", error.message);
    return null;
  }
};

// export const uploadPDF = async (buffer: Buffer, fileName = "document.pdf") => {
//   try {
//     const blob = new Blob([buffer], { type: "application/pdf" });

//     // Create a File object (if needed)
//     const file = new File([blob], fileName, { type: "application/pdf" });

//     const result = await storage.createFile(
//       config.pdfStorageBucketId, // Your Appwrite bucket ID
//       ID.unique(), // Generate a unique file ID
//       file
//     );

//     // Generate the file download URL
//     const downloadUrl = storage.getFileView(
//       config.pdfStorageBucketId,
//       result.$id
//     ).href;

//     return {
//       id: result.$id,
//       downloadUrl: downloadUrl.toString(),
//     };
//   } catch (error: any) {
//     console.error("UPLOAD ERROR:", error.message);
//     return null;
//   }
// };

// export const uploadPdf = async (file: File) => {
//   try {
//     const result = await storage.createFile(
//       config.imageStorageBucketId, // bucketId
//       ID.unique(), // fileId
//       file, // file
//       [] // permissions (optional)
//     );

//     // Generate the image URL
//     const imageUrl = storage.getFileView(
//       config.imageStorageBucketId,
//       result.$id
//     ).href;

//     // Generate a thumbnail URL (resized preview)
//     const thumbnailUrl = storage.getFilePreview(
//       config.imageStorageBucketId,
//       result.$id
//     ).href; // Adjust width & height as needed

//     return {
//       id: result.$id,
//       imageUrl,
//       thumbnailUrl,
//     };
//   } catch (error: any) {
//     console.log("UPLOAD ERROR - ", error.message);
//     return null;
//   }
// };

export const uploadPDF = async (buffer: Buffer, fileName = "document.pdf") => {
  try {
    const blob = new Blob([buffer], { type: "application/pdf" });

    // Create a File object (if needed)
    const file = new File([blob], fileName, { type: "application/pdf" });

    const result = await storage.createFile(
      config.pdfStorageBucketId, // Your Appwrite bucket ID
      ID.unique(), // Generate a unique file ID
      file
    );

    // Generate the file download URL
    const downloadUrl = storage.getFileView(
      config.pdfStorageBucketId,
      result.$id
    ).href;

    return {
      id: result.$id,
      downloadUrl: downloadUrl.toString(),
    };
  } catch (error: any) {
    console.error("UPLOAD ERROR:", error.message);
    return null;
  }
};

export const getImageUrl = async (id: string) => {
  try {
    const result = storage.getFileView(config.imageStorageBucketId, id);
    return result;
  } catch (error: any) {
    console.log("FETCH ERROR - ", error.message);
    return null;
  }
};

export const uploadInvoice = async (file: File) => {
  try {
    const result = await storage.createFile(
      config.invoiceStorageBucketId, // bucketId
      ID.unique(), // fileId
      file, // file
      [] // permissions (optional)
    );
    // console.log("The UPLOADED INVOICE is - ", result);
    return result;
  } catch (error: any) {
    console.log("THIS IS ERROR - ", error.message);
    return null;
  }
};

export const getInvoiceUrl = async (id: string) => {
  try {
    const result = storage.getFileView(config.invoiceStorageBucketId, id);
    // console.log("The VIEWING INVOICE is - ", result);
    return result;
  } catch (error: any) {
    console.log("THIS IS ERROR - ", error.message);
    return null;
  }
};

export const getCarByCarNumber = async (carNumber: string) => {
  try {
    let result = await databases.listDocuments(
      config.databaseId,
      config.carsCollectionId,
      [Query.equal("carNumber", carNumber), Query.orderDesc("$createdAt")]
    );

    // console.log("FETCHED INVOICEs ", result);
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const createJobCard = async (
  carId: string,
  carNumber: string,
  images: string[],
  carOdometer: string,
  carFuel: string,
  diagnosis: string[],
  customerName: string,
  customerPhone: string,
  customerAddress: string,
  customerEmail: string,
  sendToPartsManager: boolean,
  carsTableId: string,
  jobCardPDF: string
) => {
  try {
    const token = getCookie("user");
    const parsedToken = JSON.parse(String(token));
    const advisorEmail = parsedToken.email;

    // To update the tempcar status
    const tempCar = await getTempCarById(carId);
    if (!tempCar) {
      console.log("Car not found");
      return null;
    }

    const purposeOfVisitAndAdvisors = convertStringsToArray(
      tempCar.purposeOfVisitAndAdvisors
    );
    const purposeOfVisit = purposeOfVisitAndAdvisors.find((pov: any) => {
      if (pov.advisorEmail === advisorEmail) return true;
    }).description;

    console.log(purposeOfVisit);

    const jobCardNumber = await getNextJobCardNumber();
    console.log("Job Card Number - ", jobCardNumber);

    const baseRepo: BaseRepository = new BaseRepository(
      config.jobCardsCollectionId,
      ObjectType.JOB_CARD
    );

    let result = await baseRepo.createDocument({
      carId,
      diagnosis,
      sendToPartsManager,
      carNumber,
      jobCardStatus: 0,
      customerName,
      customerPhone,
      jobCardNumber,
      images,
      carFuel,
      carOdometer,
      customerAddress,
      purposeOfVisit,
      jobCardPDF,
      serviceAdvisorID: advisorEmail,
      customerEmail,
    });

    // let result = await databases.createDocument(
    //   config.databaseId,
    //   config.jobCardsCollectionId,
    //   ID.unique(),
    //   {
    //     carId,
    //     diagnosis,
    //     sendToPartsManager,
    //     carNumber,
    //     jobCardStatus: 0,
    //     customerName,
    //     customerPhone,
    //     jobCardNumber,
    //     images,
    //     carFuel,
    //     carOdometer,
    //     customerAddress,
    //     purposeOfVisit,
    //     jobCardPDF,
    //     serviceAdvisorID: advisorEmail,
    //   }
    // );

    // Check if the user email matches an advisor and update `open` field if it exists
    const updatedPov = purposeOfVisitAndAdvisors.map((pov: any) => {
      if (pov.advisorEmail === advisorEmail && pov.open === false) {
        return { ...pov, open: true }; // Set `open` to true if it matches the advisor email
      }
      return pov;
    });
    const updatedPurposeOfVisitAndAdvisors = convertToStrings(updatedPov);

    let allTempCarJobCardIds: any = tempCar.allJobCardIds;
    allTempCarJobCardIds.push(result["$id"]);

    // await databases.updateDocument(
    //   config.databaseId,
    //   config.tempCarsCollectionId, // collectionId
    //   carId, // documentId
    //   {
    //     carStatus: 1,
    //     jobCardId: result["$id"],
    //     allJobCardIds: allTempCarJobCardIds,
    //     purposeOfVisitAndAdvisors: updatedPurposeOfVisitAndAdvisors,
    //   } // data (optional)
    // );

    const tempCarsBaseRepo: BaseRepository = new BaseRepository(
      config.tempCarsCollectionId,
      ObjectType.TEMP_CARS
    );

    await tempCarsBaseRepo.updateDocumentById(carId, {
      carStatus: 1,
      jobCardId: result["$id"],
      allJobCardIds: allTempCarJobCardIds,
      purposeOfVisitAndAdvisors: updatedPurposeOfVisitAndAdvisors,
    });

    const carHistory = await databases.getDocument(
      config.databaseId,
      config.carsCollectionId, // collectionId
      carsTableId, // documentId
      [] // queries (optional)
    );

    console.log("SELECTED CAR HISTORY - ", carHistory);

    let tempJobCards = carHistory.allJobCards;

    tempJobCards.push(result["$id"]);

    // if(selectedCarDetails.documents[0][])

    // await databases.updateDocument(
    //   config.databaseId,
    //   config.carsCollectionId,
    //   carsTableId,
    //   {
    //     allJobCards: tempJobCards,
    //     customerName,
    //     customerPhone,
    //     customerAddress,
    //   }
    // );

    const carsBaseRepo: BaseRepository = new BaseRepository(
      config.carsCollectionId,
      ObjectType.CAR
    );
    await carsBaseRepo.updateDocumentById(carsTableId, {
      allJobCards: tempJobCards,
      customerName,
      customerPhone,
      customerAddress,
      customerEmail,
    });

    console.log("The created Job Card is - ", result);
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const searchTempCar = async (
  searchTerm: string,
  statuses?: number[]
) => {
  let finalQuery: any[] = [];
  if (statuses) {
    if (statuses.length > 1) {
      let queries: any = [];
      statuses.map((stat: number) => {
        queries.push(Query.equal("carStatus", [stat]));
      });
      finalQuery = [Query.or(queries)];
    } else {
      finalQuery = [Query.equal("carStatus", statuses[0])];
    }
  }
  try {
    let result = await databases.listDocuments(
      config.databaseId,
      config.tempCarsCollectionId,
      [Query.contains("carNumber", [searchTerm]), finalQuery]
    );
    // console.log("THE SEARCHED CARS -", result);
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const deleteTempCar = async (carId: string) => {
  const resultTempCar = await getTempCarById(carId);
  const updatedJobCard = await updateJobCardJobCardStatus(
    resultTempCar.jobCardId,
    7
  );
  try {
    // let result = await databases.deleteDocument(
    //   config.databaseId,
    //   config.tempCarsCollectionId,
    //   carId
    // );

    const baseRepo: BaseRepository = new BaseRepository(
      config.tempCarsCollectionId,
      ObjectType.TEMP_CARS
    );
    let result = await baseRepo.deleteDocumentById(carId);
    // console.log("THE SEARCHED CARS -", result);
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const deletePartItem = async (partId: string) => {
  try {
    let result = await databases.deleteDocument(
      config.databaseId, // databaseId
      config.partsCollectionId, // collectionId
      partId // documentId
    );
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const searchCarHistory = async (searchTerm: string) => {
  try {
    let result = await databases.listDocuments(
      config.databaseId,
      config.carsCollectionId,
      [Query.contains("carNumber", [searchTerm])]
    );
    // console.log("THE SEARCHED CARS -", result);
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const getAllJobCards = async (statuses?: number[]) => {
  // console.log("Hitting Backend");
  let finalQuery: any[] = [Query.orderDesc("$createdAt"), Query.limit(999999)];
  if (statuses) {
    if (statuses.length > 1) {
      let queries: any = [];
      statuses.map((stat: number) => {
        queries.push(Query.equal("jobCardStatus", [stat]));
      });
      finalQuery = [...finalQuery, Query.or(queries)];
    } else {
      finalQuery = [...finalQuery, Query.equal("jobCardStatus", statuses[0])];
    }
  }

  try {
    let result = await databases.listDocuments(
      config.databaseId,
      config.jobCardsCollectionId,
      finalQuery
    );
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const getJobCardById = async (id: string) => {
  // console.log("Hitting Backend");
  try {
    let result = await databases.getDocument(
      config.databaseId,
      config.jobCardsCollectionId,
      id
    );

    // console.log("FETCHED CAR + ", result);
    return result;
  } catch (error: any) {
    // console.log(error.message);
    return null;
  }
};

export const getTempCarById = async (id: string) => {
  // console.log("Hitting Backend");
  try {
    let result = await databases.getDocument(
      config.databaseId,
      config.tempCarsCollectionId,
      id
    );
    return result;
  } catch (error: any) {
    // console.log(error.message);
    return null;
  }
};

export const getCarById = async (id: string) => {
  // console.log("Hitting Backend");
  try {
    let result = await databases.getDocument(
      config.databaseId,
      config.carsCollectionId,
      id
    );
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const updateTempCarById = async (id: string, carStatus: number) => {
  // console.log("Hitting Backend");
  try {
    // let result = await databases.updateDocument(
    //   config.databaseId,
    //   config.tempCarsCollectionId,
    //   id,
    //   {
    //     carStatus,
    //   }
    // );

    const tempCarsBaseRepo: BaseRepository = new BaseRepository(
      config.tempCarsCollectionId,
      ObjectType.TEMP_CARS
    );
    let result = await tempCarsBaseRepo.updateDocumentById(id, {
      carStatus,
    });

    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const updateTempCarFieldsById = async (id: string, data: any) => {
  try {
    const tempCarsBaseRepo: BaseRepository = new BaseRepository(
      config.tempCarsCollectionId,
      ObjectType.TEMP_CARS
    );
    let result = await tempCarsBaseRepo.updateDocumentById(id, data);

    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const getAllParts = async () => {
  // console.log("Hitting Backend");

  try {
    let result = await databases.listDocuments(
      config.databaseId,
      config.partsCollectionId,
      [Query.limit(999999)]
    );
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const getAllCars = async () => {
  // console.log("Hitting Backend");

  try {
    let result = await databases.listDocuments(
      config.databaseId,
      config.carsCollectionId,
      []
    );
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const updateJobCardById = async (
  id: string,
  parts?: string[],
  labour?: string[],
  jobCardStatus?: number,
  subTotal?: number,
  discountAmt?: number,
  amount?: number,
  taxes?: string[],
  insuranceDetails?: string
) => {
  if (parts) {
  }
  try {
    // await databases.updateDocument(
    //   config.databaseId,
    //   config.jobCardsCollectionId, // collectionId
    //   id, // documentId
    //   {
    //     // insuranceDetails,
    //     parts,
    //     labour,
    //     jobCardStatus,
    //     subTotal,
    //     discountAmt,
    //     amount,
    //     insuranceDetails,
    //     taxes,
    //   } // data (optional)
    // );

    const baseRepo: BaseRepository = new BaseRepository(
      config.jobCardsCollectionId,
      ObjectType.JOB_CARD
    );

    await baseRepo.updateDocumentById(id, {
      parts,
      labour,
      jobCardStatus,
      subTotal,
      discountAmt,
      amount,
      insuranceDetails,
      taxes,
    });

    return true;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const getAllLabour = async () => {
  // console.log("Hitting Backend");

  try {
    let result = await databases.listDocuments(
      config.databaseId,
      config.labourCollectionId,
      [Query.limit(999999), Query.orderDesc("$createdAt")]
    );
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const uploadCarImage = async (file: any) => {
  // console.log("Hitting Backend");
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uniqueStr = "";

  for (let i = 0; i <= 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueStr += characters.charAt(randomIndex);
  }

  return new Promise((resolve, reject) => {
    try {
      imagekit.upload(
        {
          file: file, //required
          fileName: uniqueStr + ".jpg", //required
        },
        (err, result) => {
          if (err) {
            console.error("Upload error:", err);
            reject(err);
          }
          console.log("Uploaded file result:", result);
          // setUploadUrl(result.url); // Set the URL of the uploaded image
          resolve(result);
        }
      );
    } catch (error: any) {
      console.log(error.message);
      reject(null);
    }
  });
};

export const updateJobCardInsuranceDetails = async (
  id: string,
  insuranceDetails?: string
) => {
  try {
    // await databases.updateDocument(
    //   config.databaseId,
    //   config.jobCardsCollectionId, // collectionId
    //   id, // documentId
    //   {
    //     // insuranceDetails,

    //     insuranceDetails,
    //   } // data (optional)
    // );

    const baseRepo: BaseRepository = new BaseRepository(
      config.jobCardsCollectionId,
      ObjectType.JOB_CARD
    );
    await baseRepo.updateDocumentById(id, {
      insuranceDetails,
    });

    return true;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

// export const updateInvoiceIsInsurance = async (
//   id: string,
//   isInsuranceInvoice?: boolean
// ) => {
//   try {
//     await databases.updateDocument(
//       config.databaseId,
//       config.invoicesCollectionId, // collectionId
//       id, // documentId
//       {
//         // insuranceDetails,

//         isInsuranceInvoice,
//       } // data (optional)
//     );
//     return true;
//   } catch (error: any) {
//     console.log(error.message);
//     return null;
//   }
// };

export const updateJobCardGSTDetails = async (id: string, gstin?: string) => {
  try {
    // await databases.updateDocument(
    //   config.databaseId,
    //   config.jobCardsCollectionId, // collectionId
    //   id, // documentId
    //   {
    //     // insuranceDetails,

    //     gstin,
    //   } // data (optional)
    // );

    const baseRepo: BaseRepository = new BaseRepository(
      config.jobCardsCollectionId,
      ObjectType.JOB_CARD
    );
    await baseRepo.updateDocumentById(id, {
      gstin,
    });

    return true;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const updateJobCardJobCardStatus = async (
  id: string,
  jobCardStatus?: number
) => {
  try {
    // await databases.updateDocument(
    //   config.databaseId,
    //   config.jobCardsCollectionId, // collectionId
    //   id, // documentId
    //   {
    //     // insuranceDetails,

    //     jobCardStatus,
    //   } // data (optional)
    // );

    const baseRepo: BaseRepository = new BaseRepository(
      config.jobCardsCollectionId,
      ObjectType.JOB_CARD
    );
    await baseRepo.updateDocumentById(id, {
      jobCardStatus,
    });

    return true;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const updateJobCardObservationRemarks = async (
  id: string,
  observationRemarks?: string
) => {
  try {
    // await databases.updateDocument(
    //   config.databaseId,
    //   config.jobCardsCollectionId, // collectionId
    //   id, // documentId
    //   {
    //     // insuranceDetails,

    //     observationRemarks,
    //   } // data (optional)
    // );

    const baseRepo: BaseRepository = new BaseRepository(
      config.jobCardsCollectionId,
      ObjectType.JOB_CARD
    );
    await baseRepo.updateDocumentById(id, {
      observationRemarks,
    });

    return true;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const updateJobCardGatePassDetails = async (
  id: string,
  gatePassPDF?: string
) => {
  try {
    // await databases.updateDocument(
    //   config.databaseId,
    //   config.jobCardsCollectionId, // collectionId
    //   id, // documentId
    //   {
    //     gatePassPDF,
    //   } // data (optional)
    // );

    const baseRepo: BaseRepository = new BaseRepository(
      config.jobCardsCollectionId,
      ObjectType.JOB_CARD
    );
    await baseRepo.updateDocumentById(id, {
      gatePassPDF,
    });

    return true;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const updateJobCardField = async (
  id: string,
  fieldName: string,
  fieldValue: any
) => {
  try {
    // Update the document with the merged data
    // await databases.updateDocument(
    //   config.databaseId,
    //   config.jobCardsCollectionId,
    //   id,
    //   {
    //     [fieldName]: fieldValue,
    //   }
    // );

    const baseRepo: BaseRepository = new BaseRepository(
      config.jobCardsCollectionId,
      ObjectType.JOB_CARD
    );
    await baseRepo.updateDocumentById(id, {
      [fieldName]: fieldValue,
    });

    return true;
  } catch (error: any) {
    console.error(
      `Failed to update field "${fieldName}" in job card: ${error.message}`
    );
    return null;
  }
};

export const updateCarField = async (
  id: string,
  fieldName: string,
  fieldValue: any
) => {
  try {
    // Update the document with the merged data
    // await databases.updateDocument(
    //   config.databaseId,
    //   config.carsCollectionId,
    //   id,
    //   {
    //     [fieldName]: fieldValue,
    //   }
    // );

    const baseRepo: BaseRepository = new BaseRepository(
      config.carsCollectionId,
      ObjectType.CAR
    );
    await baseRepo.updateDocumentById(id, {
      [fieldName]: fieldValue,
    });

    return true;
  } catch (error: any) {
    console.error(
      `Failed to update field "${fieldName}" in job card: ${error.message}`
    );
    return null;
  }
};

export const createInvoice = async (
  invoiceUrl: string,
  jobCardId: string,
  carNumber: string,
  invoiceType: string,
  invoiceNumber: number,
  invoiceSeries: string,
  invoiceCode: string,
  isUpdatedInvoice: boolean,
  insuranceInvoiceType?: string,
  isInsuranceInvoice?: boolean
) => {
  try {
    // let carsResult = await databases.createDocument(
    //   config.databaseId,
    //   config.invoicesCollectionId,
    //   ID.unique(),
    //   {
    //     invoiceUrl,
    //     jobCardId,
    //     carNumber,
    //     invoiceType,
    //     invoiceNumber,
    //     invoiceSeries,
    //     invoiceCode,
    //     isUpdatedInvoice,
    //     insuranceInvoiceType,
    //     isInsuranceInvoice,
    //   }
    // );

    const baseRepo: BaseRepository = new BaseRepository(
      config.invoicesCollectionId,
      ObjectType.INVOICE
    );
    let carsResult = await baseRepo.createDocument({
      invoiceUrl,
      jobCardId,
      carNumber,
      invoiceType,
      invoiceNumber,
      invoiceSeries,
      invoiceCode,
      isUpdatedInvoice,
      insuranceInvoiceType,
      isInsuranceInvoice,
    });
    // console.log("The created Car is - ", result);
    return carsResult;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const getInvoicesByJobCardId = async (jobCardId: string) => {
  try {
    let result = await databases.listDocuments(
      config.databaseId,
      config.invoicesCollectionId,
      [Query.equal("jobCardId", jobCardId), Query.orderDesc("$createdAt")]
    );

    console.log("FETCHED INVOICEs ", result);
    return result;
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
};

export const getAllInvoices = async () => {
  // console.log("Hitting Backend");

  try {
    let result = await databases.listDocuments(
      config.databaseId,
      config.invoicesCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(9999)]
    );
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const deleteJobCardById = async (id: string, reason: string = "") => {
  try {
    if (reason !== "") {
      const DeletedJobCardRepo: BaseRepository = new BaseRepository(
        config.deletedJobCardsCollectionId,
        ObjectType.DELETEDJOBCARD
      );

      const details = await getJobCardById(id);
      //const user = await account.get();
      const entry = {
        jobcardDetails: details,
        // user: user,
        reason: reason,
      };

      await DeletedJobCardRepo.createDocument({
        details: JSON.stringify(entry),
      });
    }

    const BaseRepo: BaseRepository = new BaseRepository(
      config.jobCardsCollectionId,
      ObjectType.JOB_CARD
    );
    const result = await BaseRepo.deleteDocumentById(id);
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const deleteTempCarById = async (id: string) => {
  try {
    const result = await databases.deleteDocument(
      config.databaseId,
      config.tempCarsCollectionId,
      id // documentId
    );
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const deleteInvoiceById = async (id: string) => {
  try {
    const result = await databases.deleteDocument(
      config.databaseId,
      config.invoicesCollectionId,
      id // documentId
    );
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

// export const getInvoiceByJobCardId = async (jobCardId: string) => {
//   try {
//     const result = await databases.listDocuments(
//       config.databaseId,
//       config.invoicesCollectionId,
//       [
//         Query.equal("jobCardId", jobCardId), // Filter by the specified invoice series
//         Query.orderDesc("$createdAt"), // Order by creation date in descending order
//       ]
//     );

//     return result;
//   } catch (error: any) {
//     console.log(error.message);
//     return null;
//   }
// };

export const getLatestInvoiceBySeries = async (invoiceSeries: string) => {
  console.log("INVOCIJDJSDJ", invoiceSeries);
  try {
    const result = await databases.listDocuments(
      config.databaseId,
      config.invoicesCollectionId,
      [
        Query.equal("invoiceSeries", invoiceSeries), // Filter by the specified invoice series
        Query.orderDesc("$createdAt"), // Order by creation date in descending order
      ]
    );
    console.log("HEY HEYEYYEY", result);

    // Return the first document if available, as it will be the latest invoice in that series
    return result.documents.length > 0 ? result.documents[0] : null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAllTaxInvoicesAfterDateTime = async (dateTimeStamp: string) => {
  try {
    const isoDate = convertToISODateTime(dateTimeStamp);

    let result = await databases.listDocuments(
      config.databaseId,
      config.invoicesCollectionId,
      [
        Query.limit(9999),
        Query.greaterThan("$createdAt", isoDate),
        Query.equal("invoiceType", "Tax Invoice"),
      ]
    );
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const getJobCardsBetween = async (from: Date, to: Date) => {
  try {
    const newFrom = from.toISOString();
    const newTo = to.toISOString();

    let result = await databases.listDocuments(
      config.databaseId,
      config.jobCardsCollectionId,
      [
        Query.limit(9999),
        Query.greaterThanEqual("$createdAt", newFrom),
        Query.lessThanEqual("$createdAt", newTo),
      ]
    );
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const getInvoicesBetween = async (from: Date, to: Date) => {
  try {
    const newFrom = from.toISOString();
    const newTo = to.toISOString();

    let result = await databases.listDocuments(
      config.databaseId,
      config.invoicesCollectionId,
      [
        Query.limit(9999),
        Query.greaterThanEqual("$createdAt", newFrom),
        Query.lessThanEqual("$createdAt", newTo),
        Query.equal("invoiceType", "Tax Invoice"),
      ]
    );
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const inputSinglePartAppwrite = async (part: any) => {
  // console.log("The Parts are -", partsArr);

  try {
    let partsResult = await databases.createDocument(
      config.databaseId,
      config.partsCollectionId,
      ID.unique(),
      {
        partName: String(part.partName),
        partNumber: String(part.partNumber),
        hsn: String(part.hsn),
        category: "Spare Parts",
        mrp: Number(part.mrp),
        gst: Number(part.gst),
        cgst: Number(part.cgst),
        sgst: Number(part.sgst),
      }
    );
    console.log("The created part is - ", partsResult);
    return true;
  } catch (error: any) {
    console.log(error.message);
    // return null;
  }
};

export const inputSingleLabourAppwrite = async (work: any) => {
  // console.log("The Parts are -", partsArr);

  try {
    let labourResult = await databases.createDocument(
      config.databaseId,
      config.labourCollectionId,
      ID.unique(),
      {
        labourName: String(work.labourName),
        labourCode: String(work.labourCode),
        hsn: String(work.hsn),
        category: "Labour",
        mrp: Number(work.mrp),
        gst: Number(work.gst),
        cgst: Number(work.cgst),
        sgst: Number(work.sgst),
      }
    );
    console.log("The created labour is - ", labourResult);
    return true;
  } catch (error: any) {
    console.log(error.message);
    // return null;
  }
};

export const inputPartsAppwrite = async (partsArr: any[]) => {
  // console.log("The Parts are -", partsArr);

  partsArr.map(async (part, index) => {
    try {
      let partsResult = await databases.createDocument(
        config.databaseId,
        config.partsCollectionId,
        ID.unique(),
        {
          partName: String(part.partName),
          partNumber: String(part.partNumber),
          hsn: String(part.hsn),
          category: String(part.category),
          mrp: Number(part.mrp),
          gst: Number(part.gst),
          cgst: Number(part.cgst),
          sgst: Number(part.sgst),
        }
      );
      console.log("The created part is - ", partsResult);
      // return carsResult;
    } catch (error: any) {
      console.log(error.message);
      // return null;
    }
  });
};

export const inputLabourAppwrite = async (labourArr: any[]) => {
  // console.log("The Parts are -", partsArr);

  labourArr.map(async (work, index) => {
    console.log(work);
    try {
      let labourResult = await databases.createDocument(
        config.databaseId,
        config.labourCollectionId,
        ID.unique(),
        {
          labourName: String(work.labourName),
          labourCode: String(work.labourCode),
          hsn: String(work.hsn),
          category: String(work.category),
          mrp: Number(work.mrp),
          gst: Number(work.gst),
          cgst: Number(work.cgst),
          sgst: Number(work.sgst),
        }
      );
      console.log("The created part is - ", labourResult);
      // return carsResult;
    } catch (error: any) {
      console.log(error.message);
      // return null;
    }
  });
};

export const addCarModel = async (carMakeId: string, carModel: string) => {
  try {
    // Fetch the current document
    const BaseRepo: BaseRepository = new BaseRepository(
      config.carModelsCollectionId,
      ObjectType.CAR_MODEL
    );
    const document = await BaseRepo.getDocumentById(carMakeId);
    // Append the string to the array
    let updatedArray = document.models || []; // Replace `arrayField` with your field name

    updatedArray.push(carModel);

    //updatedArray = convertToStrings(updatedArray);

    // Update the document
    const response = await BaseRepo.updateDocumentById(carMakeId, {
      models: updatedArray,
    });
    console.log("Document updated successfully:", response);
  } catch (error) {
    console.error("Error updating document:", error);
  }
};

export const fetchCarMakeAndModels = async () => {
  const BaseRepo: BaseRepository = new BaseRepository(
    config.carModelsCollectionId,
    ObjectType.CAR_MODEL
  );
  const document = await BaseRepo.listDocuments([Query.limit(999999)]);
  console.log("Makes: ", document);

  return document;
};

export const checkIfAnotherJobCardCanBeOpened = (tempCar: any) => {
  const valid = tempCar.purposeOfVisitAndAdvisors.length < 2;

  if (!valid) return [false, ""];

  const purposeOfVisitAndAdvisors = convertStringsToArray(
    tempCar.purposeOfVisitAndAdvisors
  );

  const canBeOpenedIn = purposeOfVisitAndAdvisors.map((item: any) => {
    if (item.purposeOfVisitCode === 1) {
      return "service";
    } else {
      return "bodyshop";
    }
  });

  return [valid, canBeOpenedIn];
};

export const fetchPolicyProviders = async () => {
  const BaseRepo: BaseRepository = new BaseRepository(
    config.insuranceProvidersCollectionId, // Replace with the actual collection ID
    ObjectType.INSURANCE_DETAILS // Replace with the actual object type
  );

  const document = await BaseRepo.listDocuments([Query.limit(999999)]);
  console.log("Policy Providers: ", document);

  return document.documents.map((doc: any) => ({
    insurer: doc.insurer,
    address: doc.address,
    GST: doc.GST,
  }));
};

export const getHistory = async () => {
  try {
    let result = await databases.listDocuments(
      config.databaseId,
      config.historyCollectionId,
      [Query.limit(99999), Query.orderDesc("$createdAt")]
    );
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};
