import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      productId: string;
    };
  }
) {
  try {
    const { productId } = params;

    if (!params.productId) {
      return new NextResponse("productId is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log(`[PRODUCT_GET]`, error);
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
      productId: string;
    };
  }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { storeid, productId } = params;

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) {
      return new NextResponse(`Unauthorized`, { status: 401 });
    }

    if (!name) {
      return new NextResponse(`Name is required`, { status: 400 });
    }

    if (!price) {
      return new NextResponse(`price is required`, { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse(`categoryId is required`, { status: 400 });
    }
    if (!colorId) {
      return new NextResponse(`colorId is required`, { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse(`sizeId is required`, { status: 400 });
    }
    if (!images || !images.length) {
      return new NextResponse(`images are required`, { status: 400 });
    }

    if (!params.storeid) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.productId) {
      return new NextResponse("productId is required", { status: 400 });
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

    await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        sizeId,
        colorId,
        images: {
          deleteMany: {},
        },
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log(`[PRODUCT_PATCH]`, error);
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
      productId: string;
    };
  }
) {
  try {
    const { userId } = auth();
    const { storeid, productId } = params;

    if (!userId) {
      return new NextResponse(`Unauthenticated`, { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
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

    const product = await prismadb.product.deleteMany({
      where: {
        id: productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log(`[PRODUCT_DELETE]`, error);
    return new NextResponse(`Internal error`, { status: 500 });
  }
}
