import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      billboardId: string;
    };
  }
) {
  try {
    const { billboardId } = params;

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const Billboard = await prismadb.billboard.findUnique({
      where: {
        id: billboardId,
      },
    });

    return NextResponse.json(Billboard);
  } catch (error) {
    console.log(`[BILLBOARD_GET]`, error);
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
      billboardId: string;
    };
  }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { storeid, billboardId } = params;

    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse(`Unauthorized`, { status: 401 });
    }

    if (!label) {
      return new NextResponse("label is required", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("imageUrl is required", { status: 400 });
    }

    if (!params.storeid) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
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

    // const store = await prismadb.store.updateMany({
    //   where: {
    //     id: params?.storeid,
    //     userId,
    //   },
    //   data: {
    //     label,
    //     imageUrl
    //   },
    // });

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: billboardId,
        storeid,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log(`[BILLBOARD_PATCH]`, error);
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
      billboardId: string;
    };
  }
) {
  try {
    const { userId } = auth();
    const { storeid, billboardId } = params;

    if (!userId) {
      return new NextResponse(`Unauthenticated`, { status: 401 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
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

    const Billboard = await prismadb.billboard.deleteMany({
      where: {
        id: billboardId,
      },
    });

    return NextResponse.json(Billboard);
  } catch (error) {
    console.log(`[BILLBOARD_DELETE]`, error);
    return new NextResponse(`Internal error`, { status: 500 });
  }
}
