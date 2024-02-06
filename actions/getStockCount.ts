import prismadb from "@/lib/prismadb";

export const getStockCount = async (storeid: string) => {
  const stockCount = await prismadb.product.findMany({
    where: {
      storeid,
      isArchived: false,
    },
  });

  return stockCount.length;
};
