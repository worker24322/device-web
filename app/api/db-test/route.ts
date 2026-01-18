import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collections = await db.listCollections({}, { nameOnly: true }).toArray();

    return NextResponse.json({
      success: true,
      database: db.databaseName,
      collections: collections.map((collection) => collection.name),
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Không thể kết nối tới MongoDB",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
