import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async (storeid: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeid,
      isPaid: false,
    },
    include: {
      OrderItems: {
        include: {
          product: true,
        },
      },
    },
  });
  const totalRevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.OrderItems.reduce((totalOrderPrice, item) => {
      const productPrice = item.product ? item.product?.price?.toNumber() : 0;
      return totalOrderPrice + productPrice;
    }, 0);
    return total + orderTotal;
  }, 0);

  return totalRevenue;
};
