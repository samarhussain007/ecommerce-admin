import React from "react";
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import { OrderClient } from "./components/client";

import { OrderColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const OrdersPage = async ({ params }: { params: { storeid: string } }) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeid: params?.storeid,
    },
    include: {
      OrderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.OrderItems.map((orderItem) => orderItem.product?.name).join(
      ", "
    ),
    totalPrice: formatter.format(
      item.OrderItems.reduce((total, item) => {
        return total + Number(item?.product?.price);
      }, 0)
    ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
