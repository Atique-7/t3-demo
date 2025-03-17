import { NextRequest, NextResponse } from "next/server";
import { Client, Databases } from "node-appwrite";

// Initialize Appwrite Client
const client = new Client();
const databases = new Databases(client);

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
  .setProject("67cbecaa002877aff9d1") // Replace with your project ID
  .setKey("standard_6c561ebb631cc7217e78905352cb1deb1e9279eb71678973ae0f1aff1cd1331fadcd650b6ad827adf01a2926d05c153db447f9926cd4da448ab129086ca45b836f90f8bacc3e1097c689b07971c05ed0fb9e697c3e58c21196edfad50e25f2644d26824d832e608bc8e69bfbd1df5918fe70a5f480abf4ca255ade07f2600703"); // Replace with your API Key

export async function POST(req: NextRequest) {
  try {
    const counterId = "counter_JCARD"; // ID for the global job card counter document
    const databaseId = "67cbf28e001bd9202750"; // Replace with your database ID
    const collectionId = "67d7de6e002d1723d043"; // Replace with your collection ID

    let counterDocument;

    try {
      // Step 1: Fetch the current job card counter
      counterDocument = await databases.getDocument(
        databaseId,
        collectionId,
        counterId
      );
    } catch (error) {
      // Step 2: If counter doesn't exist, initialize it with 1000
      counterDocument = await databases.createDocument(
        databaseId,
        collectionId,
        counterId,
        { currentNumber: 1000 }
      );
    }

    // Step 3: Increment the counter
    console.log("Current job card number:", counterDocument.currentNumber);
    const nextNumber = counterDocument.currentNumber + 1;
    console.log("Next job card number:", nextNumber);

    // Step 4: Update the counter in the database
    const result = await databases.updateDocument(databaseId, collectionId, counterId, {
      currentNumber: nextNumber,
    });
    console.log("Counter updated successfully:", result);

    // Step 5: Return the next job card number
    return NextResponse.json({
      jobCardNumber: nextNumber,
      message: "Next job card number generated successfully",
    });
  } catch (error: any) {
    console.error("Error generating job card number:", error);
    return NextResponse.json(
      { message: "Failed to generate job card number", error: error.message },
      { status: 500 }
    );
  }
}
