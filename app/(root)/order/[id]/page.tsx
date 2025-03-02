import { getOrderById } from "@/lib/actions/order.actions";
import { Metadata } from "next";
import OrderDetailsTable from "./order-details-table";
import { notFound } from "next/navigation";
import { OrderItem, ShippingAddress } from "@/types";
import { auth } from "@/auth";

interface Props {
  params: Promise<{ id: string }>;
}

const OrderDetailsPage = async ({ params }: Props) => {
  const orderId = (await params).id;
  const order = await getOrderById(orderId);

  if (!order) {
    return notFound();
  }

  const session = await auth();

  if (session?.user.id !== order.userId) {
    return (
      <div className="grid place-content-center h-full">Not Authroized</div>
    );
  }

  return (
    <div>
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
          OrderItems: order.OrderItems as OrderItem[],
        }}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
        razorypayClientId={process.env.NEXT_PUBLIC_KEY_ID || "rzp_test"}
        isAdmin={session?.user.role === "admin" || false}
      />
    </div>
  );
};

export default OrderDetailsPage;

export const metadata: Metadata = {
  title: "Order Details",
};
