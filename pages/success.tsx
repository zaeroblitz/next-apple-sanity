import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useMediaQuery } from "react-responsive";
import { NumericFormat } from "react-number-format";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/solid";

import { Button } from "../components";
import { fetchLineItems } from "../utlis/fetchLineItems";

interface Props {
  products: StripeProduct[];
}

const Success = ({ products }: Props) => {
  const router = useRouter();
  const { session_id } = router.query;
  const [mounted, setMounted] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const subtotal = products.reduce(
    (total, product) => total + product.price.unit_amount / 100,
    0
  );
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isTableOrMobile = useMediaQuery({ query: "(max-width: 1024px)" });
  const showOrderSummaryCondition = isTableOrMobile ? showOrderSummary : true;

  const handleShowOrderSummary = () => {
    setShowOrderSummary(!showOrderSummary);
  };

  return (
    <div>
      <Head>
        <title>Thank You! - Apple Store</title>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
      </Head>

      <header className="mx-auto max-w-xl">
        <Link href="/">
          <div className="relative ml-4 h-16 w-8 cursor-pointer transition lg:hidden">
            <Image
              src="http://rb.gy/vsvv2o"
              fill
              className="object-contain"
              alt="Apple Icon"
            />
          </div>
        </Link>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-9">
        <section className="order-2 mx-auto max-w-xl pb-12 lg:col-span-5 lg:mx-0 lg:max-w-none lg:pr-16 lg:pt-16 lg:pl-16 2xl:pl-44">
          <Link href="/">
            <div className="relative ml-14 hidden h-24 w-12 cursor-pointer transition lg:inline-flex">
              <Image
                src="http://rb.gy/vsvv2o"
                fill
                className="object-contain"
                alt="Apple Icon"
              />
            </div>
          </Link>

          <div className="my-8 ml-4 flex space-x-4 lg:ml-14 xl:ml-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-black">
              <CheckIcon className="h-8 w-8" />
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Order #{session_id?.slice(-5)}
              </p>
              <h4 className="text-lg">
                Thank You{" "}
                {session ? session.user?.name?.split(" ")[0] : "Guest"}
              </h4>
            </div>
          </div>

          <div className="mx-4 divide-y divide-gray-300 rounded-md border border-gray-300 p-4 lg:ml-14">
            {/* Order */}
            <div className="space-y-2 pb-3">
              <p>Your order is confirmed</p>
              <p className="text-sm text-gray-600">
                We&apos;ve accepted your order, ande we&apos;re getting it
                ready. Come back to this page for updates on your shipment
                status.
              </p>
            </div>

            {/* Tracking Number */}
            <div className="pt-3 text-sm">
              <p className="font-medium text-gray-600">Other Tracking Number</p>
              <p>CN214441625</p>
            </div>
          </div>

          {/* Order Status */}
          <div className="my-4 mx-4 space-y-2 rounded-md border border-gray-300 p-4 lg:ml-14">
            <p>Order Status</p>
            <p className="text-sm text-gray-600">
              You&apos;ll get shipping and delivery updates by email and text.
            </p>
          </div>

          <div className="my-4 mx-4 flex flex-col items-center justify-between space-x-2 p-4 lg:ml-14 lg:flex-row">
            <p className="hidden lg:inline">Need Help? Contact Us</p>
            {mounted && (
              <Button
                title="Continue Shopping"
                onClick={() => router.push("/")}
                width={isTableOrMobile ? "w-full" : undefined}
                padding="py-4"
              />
            )}
          </div>
        </section>

        {mounted && (
          <section className="border-y border-l border-gray-300 bg-[#FAFAFA] lg:order-2 lg:col-span-4 lg:h-screen lg:border-y-0">
            <div
              className={`w-full ${
                showOrderSummaryCondition && "border-b"
              } border-gray-300 text-sm lg:hidden`}
            >
              <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-6">
                <button
                  onClick={handleShowOrderSummary}
                  className="flex items-center space-x-2"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  <p>Show order summary</p>
                  {showOrderSummaryCondition ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </button>

                <NumericFormat
                  displayType="text"
                  prefix="$"
                  thousandSeparator=","
                  decimalSeparator="."
                  decimalScale={2}
                  value={subtotal}
                  className="text-xl font-medium text-black"
                />
              </div>
            </div>

            {showOrderSummaryCondition && (
              <div className="mx-auto max-w-xl divide-y border-gray-300 p-4 lg:mx-0 lg:max-w-lg lg:px-10 lg:py-16">
                <div className="space-y-4 pb-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center space-x-4 text-sm font-medium"
                    >
                      <div className="tex-white relative flex h-16 w-16 items-center justify-center rounded-md border-gray-300 bg-[#F1F1F1] text-xs">
                        <div className="relative h-7 w-7 animate-bounce rounded-md">
                          <Image
                            src="https://rb.gy/vsvv2o"
                            fill
                            className="object-contain"
                            alt="Apple Logo"
                          />
                        </div>

                        <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[gray] text-xs text-white">
                          {product.quantity}
                        </div>
                      </div>
                      <p className="flex-1">{product.description}</p>
                      <NumericFormat
                        displayType="text"
                        prefix="$"
                        thousandSeparator=","
                        decimalSeparator="."
                        decimalScale={2}
                        value={product.price.unit_amount / 100}
                      />
                    </div>
                  ))}
                </div>

                {/* Transaction Summary */}
                <div className="space-y-1 py-4">
                  {/* Subtotal */}
                  <div className="flex justify-between text-sm">
                    <p className="text-[gray]">Subtotal</p>
                    <NumericFormat
                      displayType="text"
                      prefix="$"
                      thousandSeparator=","
                      decimalSeparator="."
                      decimalScale={2}
                      value={subtotal}
                    />
                  </div>

                  {/* Discount */}
                  <div className="flex justify-between text-sm">
                    <p className="text-[gray]">Discount</p>
                    <NumericFormat
                      displayType="text"
                      prefix="$"
                      thousandSeparator=","
                      decimalSeparator="."
                      decimalScale={2}
                      value={0}
                    />
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between text-sm">
                    <p className="text-[gray]">Shipping</p>
                    <NumericFormat
                      displayType="text"
                      prefix="$"
                      thousandSeparator=","
                      decimalSeparator="."
                      decimalScale={2}
                      value={20}
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <p>Total</p>
                  <p className="flex items-center gap-x-2 text-xs text-[gray]">
                    USD
                    <span className="text-xl font-medium text-black">
                      <NumericFormat
                        displayType="text"
                        prefix="$"
                        thousandSeparator=","
                        decimalSeparator="."
                        decimalScale={2}
                        value={subtotal + 20}
                      />
                    </span>
                  </p>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default Success;

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const sessionId = context.query.session_id as string;
  const products = await fetchLineItems(sessionId);

  return {
    props: {
      products: products,
    },
  };
};
