import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: { storeid: string };
  }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { storeid } = params;
    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse(`Unauthenticated`, { status: 401 });
    }

    if (!label) {
      return new NextResponse(`Label is required`, { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse(`imageUrl is required`, { status: 400 });
    }

    if (!storeid) {
      return new NextResponse(`Store id is required`, { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeid,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse(`Store doesnt belong to you (Unauthorized)`, {
        status: 400,
      });
    }

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeid,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    return new NextResponse(`${error}`);
  }
}

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { storeid: string };
  }
) {
  try {
    const { storeid } = params;
    if (!storeid) {
      return new NextResponse(`Store id is required`, { status: 400 });
    }
    const billboard = await prismadb.billboard.findMany({
      where: {
        storeid,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    return new NextResponse(`[]`);
  }
}
