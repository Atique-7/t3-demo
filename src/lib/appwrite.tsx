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

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  // platform: "com.index.t3",
  projectId: "66b10a0100095b4634e4",
  databaseId: "66b10c670021dc021477",
  carsCollectionId: "66deb8920021a5819b2c",
  tempCarsCollectionId: "66e933af0022ed863b96",
  jobCardsCollectionId: "66e80a830013e7a81f31",
  partsCollectionId: "66f6ce58000446f6aeaf",
  labourCollectionId: "66fa5dc6003941f79697",
  carImagesBucketId: "67053962002be8598a04",
  invoicesCollectionId: "6710ba53003b4b25a23d",
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

// export async function fetchJobCardsBasedonTime(filterType = "all") {
//   try {
//     const queries = [];

//     // Get current date and time
//     const currentDate = new Date();
//     const currentYear = currentDate.getFullYear();
//     const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based

//     if (filterType === "month") {
//       // Filter for the current month
//       const startOfMonth = `${currentYear}-${currentMonth}-01T00:00:00Z`;
//       const endOfMonth = new Date(currentYear, currentMonth, 0).toISOString();
//       queries.push(Query.greaterThanEqual("createdAt", startOfMonth));
//       queries.push(Query.lessThanEqual("createdAt", endOfMonth));
//     } else if (filterType === "year") {
//       // Filter for the current yearD
//       const startOfYear = `${currentYear}-01-01T00:00:00Z`;
//       const endOfYear = `${currentYear}-12-31T23:59:59Z`;
//       queries.push(Query.greaterThanEqual("createdAt", startOfYear));
//       queries.push(Query.lessThanEqual("createdAt", endOfYear));
//     }

//     // Fetch documents based on queries
//     const response = await databases.listDocuments(
//       config.databaseId,
//       config.jobCardsCollectionId,
//       queries
//     );

//     console.log(
//       `Fetched ${response.documents.length} job cards for filter: ${filterType}`
//     );
//     return response.documents;
//   } catch (error) {
//     console.error("Error fetching job cards:", error);
//     throw error;
//   }
// }

export function analyzeJobCards(jobCards: JobCard[]) {
  const advisorStats: Record<string, number> = {}; // For tracking stats per advisor
  const serviceCategoryStats: Record<string, number> = {}; // For tracking stats per service category
  const totalAmountByAdvisor: Record<string, number> = {}; // For tracking total amount per advisor

  for (const jobCard of jobCards) {
    const advisorEmail = jobCard.serviceAdvisorId;
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
    // console.error("Login failed:", error.message);
    // throw new Error(
    //   error.message || "An unexpected error occurred during login."
    // );
  }
};

export const listAllUsers = async () => {
  const response = await functions.createExecution("6731d19d00250e7e0b6f");
  const obj = JSON.parse(response.responseBody);
  const users = obj.users.users;
  return users;
};

export const getLastJobCardNumber = async () => {
  try {
    // Fetch the last created job card by sorting by creation time (descending)
    const response = await databases.listDocuments(
      config.databaseId,
      config.jobCardsCollectionId,
      [
        Query.orderDesc("$createdAt"), // Sort by creation date in descending order
        Query.limit(1), // Limit the result to the first document
      ]
    );

    if (response.documents.length === 0) {
      throw new Error("No job cards found in the database.");
    }

    const lastJobCard = response.documents[0];
    const lastJobCardNumber = lastJobCard.jobCardNumber;

    console.log("Last job card number fetched:", lastJobCardNumber);

    return lastJobCardNumber;
  } catch (error) {
    console.error("Error fetching the last job card number:", error);
    throw error;
  }
};

export const validateJobCardNumber = async (
  currentJobCardNumber: number
): Promise<number> => {
  try {
    // Fetch the latest job card number
    const latestJobCardNumber = await getLastJobCardNumber();

    console.log(
      `Current Job Card Number: ${currentJobCardNumber}, Latest Job Card Number: ${latestJobCardNumber}`
    );

    // Check if the latest job card number has increased
    if (latestJobCardNumber >= currentJobCardNumber) {
      console.warn(
        `Job card number conflict detected. Updating to the latest value: ${
          latestJobCardNumber + 1
        }`
      );
      return latestJobCardNumber + 1; // Return the next available number
    }

    // If no change, return the current job card number
    return currentJobCardNumber;
  } catch (error: any) {
    console.error("Error validating job card number:", error.message || error);
    throw error;
  }
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

// export const logoutUser = async () => {
//   try {
//     const result = await account.deleteSessions();
//     return result;
//   } catch (error: any) {
//     console.log(error.message);
//     return null;
//   }
// };

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
    let carsResult = await databases.createDocument(
      config.databaseId,
      config.carsCollectionId,
      ID.unique(),
      { carNumber, carMake, carModel, location, purposeOfVisitAndAdvisors }
    );
    // console.log("The created Car is - ", result);
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
    let carsResult = await databases.createDocument(
      config.databaseId,
      config.tempCarsCollectionId,
      ID.unique(),
      {
        carNumber,
        carMake,
        carModel,
        location,
        carStatus,
        carsTableId,
        purposeOfVisitAndAdvisors,
      }
    );
    // console.log("The created Car is - ", result);
    return carsResult;
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

    console.log("FETCHED INVOICEs ", result);
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
  sendToPartsManager: boolean,
  carsTableId: string,
  jobCardNumber: number,
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

    const validJobCardNumber = await validateJobCardNumber(jobCardNumber);
    console.log(validJobCardNumber);

    let result = await databases.createDocument(
      config.databaseId,
      config.jobCardsCollectionId,
      ID.unique(),
      {
        carId,
        diagnosis,
        sendToPartsManager,
        carNumber,
        jobCardStatus: 0,
        customerName,
        customerPhone,
        jobCardNumber: validJobCardNumber,
        images,
        carFuel,
        carOdometer,
        customerAddress,
        purposeOfVisit,
        jobCardPDF,
        serviceAdvisorID: advisorEmail,
      }
    );

    // Check if the user email matches an advisor and update `open` field if it exists
    const updatedPov = purposeOfVisitAndAdvisors.map((pov: any) => {
      if (pov.advisorEmail === advisorEmail && pov.open === false) {
        return { ...pov, open: true }; // Set `open` to true if it matches the advisor email
      }
      return pov;
    });
    const updatedPurposeOfVisitAndAdvisors = convertToStrings(updatedPov);

    let allTempCarJobCardIds = tempCar.allJobCardIds;
    allTempCarJobCardIds.push(result["$id"]);

    await databases.updateDocument(
      config.databaseId,
      config.tempCarsCollectionId, // collectionId
      carId, // documentId
      {
        carStatus: 1,
        jobCardId: result["$id"],
        allJobCardIds: allTempCarJobCardIds,
        purposeOfVisitAndAdvisors: updatedPurposeOfVisitAndAdvisors,
      } // data (optional)
    );

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

    await databases.updateDocument(
      config.databaseId,
      config.carsCollectionId,
      carsTableId,
      {
        allJobCards: tempJobCards,
        customerName,
        customerPhone,
        customerAddress,
      }
    );

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
  try {
    let result = await databases.deleteDocument(
      config.databaseId,
      config.tempCarsCollectionId,
      carId
    );
    // console.log("THE SEARCHED CARS -", result);
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
    console.log(error.message);
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
    console.log(error.message);
    return null;
  }
};

export const updateTempCarById = async (id: string, carStatus: number) => {
  // console.log("Hitting Backend");
  try {
    let result = await databases.updateDocument(
      config.databaseId,
      config.tempCarsCollectionId,
      id,
      {
        carStatus,
      }
    );
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
    await databases.updateDocument(
      config.databaseId,
      config.jobCardsCollectionId, // collectionId
      id, // documentId
      {
        // insuranceDetails,
        parts,
        labour,
        jobCardStatus,
        subTotal,
        discountAmt,
        amount,
        insuranceDetails,
        taxes,
      } // data (optional)
    );
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
      [Query.limit(999999)]
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
    await databases.updateDocument(
      config.databaseId,
      config.jobCardsCollectionId, // collectionId
      id, // documentId
      {
        // insuranceDetails,

        insuranceDetails,
      } // data (optional)
    );
    return true;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const updateJobCardGSTDetails = async (id: string, gstin?: string) => {
  try {
    await databases.updateDocument(
      config.databaseId,
      config.jobCardsCollectionId, // collectionId
      id, // documentId
      {
        // insuranceDetails,

        gstin,
      } // data (optional)
    );
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
    await databases.updateDocument(
      config.databaseId,
      config.jobCardsCollectionId, // collectionId
      id, // documentId
      {
        // insuranceDetails,

        observationRemarks,
      } // data (optional)
    );
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
    await databases.updateDocument(
      config.databaseId,
      config.jobCardsCollectionId, // collectionId
      id, // documentId
      {
        gatePassPDF,
      } // data (optional)
    );
    return true;
  } catch (error: any) {
    console.log(error.message);
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
    let carsResult = await databases.createDocument(
      config.databaseId,
      config.invoicesCollectionId,
      ID.unique(),
      {
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
      }
    );
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
    return null;
  }
};

export const getAllInvoices = async () => {
  // console.log("Hitting Backend");

  try {
    let result = await databases.listDocuments(
      config.databaseId,
      config.invoicesCollectionId,
      [Query.orderDesc("$createdAt")]
    );
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};
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
