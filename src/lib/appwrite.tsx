import { Client, Account, Databases, Query, ID, Storage, Functions} from "appwrite";
import { getCookie } from "cookies-next";
import ImageKit from "imagekit";
import {
  convertStringsToArray,
  convertToStrings,
  purposeOfVisits,
} from "./helper";
import { Part } from "./definitions";

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

export const loginUser = async (email: any, password: any) => {
  try {
    const sessionDetails = await account.createEmailPasswordSession(
      email,
      password
    );
    const userDetails = await account.get();

    return { userDetails, sessionDetails };
  } catch (error: any) {
    console.log("THIS IS THE ERROR", error.message);
    return null;
  }
};

export const listAllUsers = async () => {
  const response = await functions.createExecution('6731d19d00250e7e0b6f');
  const obj = JSON.parse(response.responseBody);
  const users = obj.users.users;
  return users;
}

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
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
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
  let finalQuery: any[] = [Query.orderDesc("$createdAt")];
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
  jobCardNumber: number
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
        jobCardNumber,
        images,
        carFuel,
        carOdometer,
        customerAddress,
        purposeOfVisit,
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
  let finalQuery: any[] = [Query.orderDesc("$createdAt")];
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
      []
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

export const createInvoice = async (
  invoiceUrl: string,
  jobCardId: string,
  carNumber: string,
  invoiceType: string,
  invoiceNumber: number
) => {
  try {
    let carsResult = await databases.createDocument(
      config.databaseId,
      config.invoicesCollectionId,
      ID.unique(),
      { invoiceUrl, jobCardId, carNumber, invoiceType, invoiceNumber }
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

export const getAllTaxInvoicesAfterDateTime = async (dateTimeStamp: any) => {
  try {
    let result = await databases.listDocuments(
      config.databaseId,
      config.invoicesCollectionId,
      [
        // Query.orderAsc("$createdAt"),
        // Query.and([
        // Query.greaterThan("$createdAt", "2024-11-13T8:25:36.305+00:00"),
        // Query.equal("invoiceType", "Quote"),
        // ]),

        Query.limit(9999),
      ]
    );
    // console.log("THESE ARE THE NEW INVOICES - ", result);
    return result;
  } catch (error: any) {
    console.log(error.message);
    console.log("JIJFOIDEFI");
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
