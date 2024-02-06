import prismadb from "@/lib/prismadb";

export const getSalesCount = async (storeid: string) => {
  const salesCount = await prismadb.order.findMany({
    where: {
      storeid,
      isPaid: false,
    },
  });

  return salesCount.length;
};
