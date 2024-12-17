import { NextRequest, NextResponse } from "next/server";
import { Client, Databases } from "node-appwrite";

// Initialize Appwrite Client
const client = new Client();
const databases = new Databases(client);

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
  .setProject("66b10a0100095b4634e4") // Replace with your project ID
  .setKey("standard_ccfafcfdb4ab4b7460d7379de12a0df172814cd321d0c231626e0e03264112144430c0a3eea131046a21b35d9d06766f6b6a8bb2404af24c25c48eea47696d20e1b91271d8b737094c9a8c363c13fcf15ae571f3c78bdef565d3bc93cafed20d9a724658a780267ae9b4bb98ed8dc36f8eede5cbbc571cde970b9894cb15cc21"); // Replace with your API Key

export async function GET(req: NextRequest) {
  try {
    const counterId = "counter_JCARD"; // ID for the global job card counter document
    const databaseId = "66b10c670021dc021477"; // Replace with your database ID
    const collectionId = "67605a0400085bcc0452"; // Replace with your collection ID

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
    const nextNumber = counterDocument.currentNumber + 1;

    // Step 4: Update the counter in the database
    await databases.updateDocument(databaseId, collectionId, counterId, {
      currentNumber: nextNumber,
    });

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
