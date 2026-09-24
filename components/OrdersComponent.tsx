"use client";

import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import { TableBody, TableCell, TableRow } from "./ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import PriceFormatter from "./PriceFormatter";
import { format } from "date-fns";
import { X } from "lucide-react";
import { useState } from "react";
import OrderDetailDialog from "./OrderDetailDialog";
import toast from "react-hot-toast";

const OrdersComponent = ({ orders }: { orders: MY_ORDERS_QUERYResult }) => {
  const [selectedOrder, setSelectedOrder] = useState<
    MY_ORDERS_QUERYResult[number] | null
  >(null);
  const handleDelete = () => {
    toast.error("Delete method applied for Admin");
  };
  return (
    <>
      <TableBody>
        {orders.map((order) => (
          <Tooltip key={order?.orderNumber}>
            <TooltipTrigger asChild>
              <TableRow
                className="cursor-pointer hover:bg-gray-100 h-12"
                onClick={() => setSelectedOrder(order)}
              >
                <TableCell className="font-medium">
                  {order.orderNumber?.slice(-10) ?? "N/A"}...
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {order?.orderDate &&
                    format(new Date(order.orderDate), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {order.email}
                </TableCell>
                <TableCell>
                  <PriceFormatter
                    amount={order?.totalPrice}
                    className="text-black font-medium"
                  />
                </TableCell>
                <TableCell>
                  {order?.status && (
                    <Badge
                      className={`px-2 py-1 font-semibold capitalize ${
                        order.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="hidden sm:table-cell">
                  {order?.invoice && (
                    <p className="font-medium line-clamp-1">
                      {order?.invoice ? order?.invoice?.number : "----"}
                    </p>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Delete order"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDelete();
                    }}
                    className="hover:text-shop_dark_green hoverEffect"
                  >
                    <X size={20} />
                  </Button>
                </TableCell>
              </TableRow>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to see order details</p>
            </TooltipContent>
          </Tooltip>
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
