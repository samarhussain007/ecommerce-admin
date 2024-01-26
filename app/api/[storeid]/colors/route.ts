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
    const { name, value } = body;

    if (!userId) {
      return new NextResponse(`Unauthenticated`, { status: 401 });
    }

    if (!name) {
      return new NextResponse(`Name is required`, { status: 400 });
    }

    if (!value) {
      return new NextResponse(`Value is required`, { status: 400 });
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

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeid,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log(`[COLORS_POST]`, error);
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
    const color = await prismadb.color.findMany({
      where: {
        storeid,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log(`[COLORS_GET]`, error);
    return new NextResponse(`${error}`);
  }
}
