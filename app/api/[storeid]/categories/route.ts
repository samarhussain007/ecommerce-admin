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
    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse(`Unauthenticated`, { status: 401 });
    }

    if (!name) {
      return new NextResponse(`Name is required`, { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse(`Billboard id is required`, { status: 400 });
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

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeid,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log(`[CATEGORIES_POST]`, error);
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
    const category = await prismadb.category.findMany({
      where: {
        storeid,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log(`[CATEGORIES_GET]`, error);
    return new NextResponse(`${error}`);
  }
}
