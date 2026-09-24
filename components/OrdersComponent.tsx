"use client";

import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import { TableBody, TableCell, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import PriceFormatter from "./PriceFormatter";
import dayjs from "dayjs";
import { Eye } from "lucide-react";
import { useState } from "react";
import OrderDetailDialog from "./OrderDetailDialog";

export const ORDER_STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  shipped: "bg-indigo-100 text-indigo-800",
  out_for_delivery: "bg-purple-100 text-purple-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

export const formatOrderStatus = (status: string) => status.replace(/_/g, " ");

const OrdersComponent = ({ orders }: { orders: MY_ORDERS_QUERYResult }) => {
  const [selectedOrder, setSelectedOrder] = useState<
    MY_ORDERS_QUERYResult[number] | null
  >(null);
  return (
    <>
      <TableBody>
        {orders.map((order) => (
          <TableRow
            key={order._id}
            className="cursor-pointer hover:bg-gray-100 h-12"
            onClick={() => setSelectedOrder(order)}
          >
            <TableCell className="font-medium">
              {order.orderNumber?.slice(-10) ?? "N/A"}...
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {order?.orderDate && dayjs(order.orderDate).format("DD/MM/YYYY")}
            </TableCell>
            <TableCell>{order.customerName}</TableCell>
            <TableCell className="hidden sm:table-cell">{order.email}</TableCell>
            <TableCell>
              <PriceFormatter
                amount={order?.totalPrice}
                className="text-black font-medium"
              />
            </TableCell>
            <TableCell>
              {order?.status && (
                <Badge
                  className={`px-2 py-1 font-semibold capitalize ${ORDER_STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-800"}`}
                >
                  {formatOrderStatus(order.status)}
                </Badge>
              )}
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <p className="font-medium line-clamp-1">
                {order?.invoice?.number ?? "----"}
              </p>
            </TableCell>
            <TableCell className="text-center">
              {/* The row is clickable too; this button is the keyboard-accessible way in */}
              <Button
                variant="ghost"
                size="sm"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedOrder(order);
                }}
                className="hover:text-shop_dark_green hoverEffect"
              >
                <Eye />
                View
                <span className="sr-only"> order {order.orderNumber}</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <OrderDetailDialog
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
};

export default OrdersComponent;
