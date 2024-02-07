import prismadb from "@/lib/prismadb";

interface GraphData {
  name: string;
  total: number;
}

export const getGraphRevenue = async (storeid: string) => {
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
  const monthlyRevenue: Record<number, number> = {};

  for (let order of paidOrders) {
    const month = order.createdAt.getMonth();
    let revenueForOrder = 0;
    for (let item of order.OrderItems) {
      revenueForOrder += item.product ? item.product?.price?.toNumber() : 0;
    }
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
  }

  const graphData: GraphData[] = [
    { name: "Jan", total: 0 },
    { name: "Feb", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Apr", total: 0 },
    { name: "May", total: 0 },
    { name: "Jun", total: 0 },
    { name: "Jul", total: 0 },
    { name: "Aug", total: 0 },
    { name: "Sep", total: 0 },
    { name: "Oct", total: 0 },
    { name: "Nov", total: 0 },
    { name: "Dec", total: 0 },
  ];

  for (const month in monthlyRevenue) {
    graphData[month].total += monthlyRevenue[parseInt(month)];
  }

  return graphData;
};
