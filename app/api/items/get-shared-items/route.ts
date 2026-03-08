import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import File from "@/models/file.modal";
import Folder from "@/models/folder.modal";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId } = await req.json();

    // 🔍 Dono collections se public items uthao
    const [files, folders] = await Promise.all([
      File.find({ userId, isPublic: true, isTrashed: false }),
      Folder.find({ userId, isPublic: true, isTrashed: false })
    ]);

    return NextResponse.json({ files, folders }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch shared items" }, { status: 500 });
  }
}