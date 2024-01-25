import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      sizeId: string;
    };
  }
) {
  try {
    const { sizeId } = params;

    if (!sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log(`[SIZE_GET]`, error);
    return new NextResponse(`Internal error`, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      storeid: string;
      sizeId: string;
    };
  }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { storeid, sizeId } = params;
    const { name, value } = body;

    if (!userId) {
      return new NextResponse(`Unauthorized`, { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!storeid) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
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

    const size = await prismadb.size.updateMany({
      where: {
        id: sizeId,
        storeid,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log(`[SIZE_PATCH]`, error);
    return new NextResponse(`Internal error`, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: {
      storeid: string;
      sizeId: string;
    };
  }
) {
  try {
    const { userId } = auth();
    const { storeid, sizeId } = params;

    if (!userId) {
      return new NextResponse(`Unauthenticated`, { status: 401 });
    }

    if (!sizeId) {
      return new NextResponse("SizeId id is required", { status: 400 });
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

    const size = await prismadb.size.deleteMany({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log(`[SIZE_DELETE]`, error);
    return new NextResponse(`Internal error`, { status: 500 });
  }
}
