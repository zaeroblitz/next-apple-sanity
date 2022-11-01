import Stripe from "stripe";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { NumericFormat } from "react-number-format";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

import getStripe from "../utlis/getStripe";
import { fetchPostJSON } from "../utlis/api-helper";
import { Header, Button, CheckoutProduct } from "../components";
import { selectCartItems, selectCartTotal } from "../redux/cartSlice";

const Checkout = () => {
  const router = useRouter();
  const total = useSelector(selectCartTotal);
  const items = useSelector(selectCartItems);
  const [loading, setLoading] = useState(false);

  const createCheckoutSession = async () => {
    setLoading(true);

    const checkoutSession: Stripe.Checkout.Session = await fetchPostJSON(
      "/api/checkout_sessions",
      {
        items,
      }
    );

    //* Internal Server Error
    if ((checkoutSession as any).statusCode === 500) {
      console.error((checkoutSession as any).message);
      return;
    }

    //* Redirect to Checkout
    const stripe = await getStripe();
    const { error } = await stripe!.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId: checkoutSession.id,
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    console.warn(error.message);

    setLoading(false);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#E7ECEE]">
      <Head>
        <title>Apple Store - Checkout</title>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
      </Head>

      <Header />

      <main className="mx-auto max-w-5xl pb-24">
        <div className="px-5">
          <h1 className="my-4 text-3xl font-semibold lg:text-4xl">
            {items.length > 0 ? "Review your cart" : "No items in your cart"}
          </h1>
          <p className="my-4">Free delivery and free returns.</p>

          {items.length === 0 && (
            <Button
              title="Continue Shopping"
              onClick={() => router.push("/")}
            />
          )}
        </div>

        {items.length > 0 && (
          <div className="mx-5 md:mx-8">
            {items.map((item) => (
              <CheckoutProduct
                key={item.product._id}
                product={item.product}
                quantity={item.quantity}
              />
            ))}

            <div className="my-12 mt-6 ml-auto">
              <div className="divide-y divide-gray-300">
                <div className="pb-4">
                  {/* Subtotal   */}
                  <div className="flex justify-between">
                    <p>Subtotal</p>
                    <NumericFormat
                      displayType="text"
                      prefix="$"
                      thousandSeparator=","
                      decimalSeparator="."
                      value={total}
                    />
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between">
                    <p>Shipping</p>
                    <p>FREE</p>
                  </div>

                  {/* Tax */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-x-1 lg:flex-row">
                      <p>Estimated tax for: </p>
                      <p className="flex cursor-pointer items-end text-blue-500 hover:underline">
                        Enter zip code
                        <ChevronDownIcon className="h-6 w-6" />
                      </p>
                    </div>
                    <p>$ -</p>
                  </div>
                </div>

                <div className="flex justify-between pt-4 text-xl font-semibold">
                  <h4>Total</h4>
                  <NumericFormat
                    displayType="text"
                    prefix="$"
                    thousandSeparator=","
                    decimalSeparator="."
                    value={total}
                  />
                </div>
              </div>

              <div className="my-14 space-y-4">
                <h4 className="text-xl font-semibold">
                  How would you like to checkout
                </h4>

                <div className="flex flex-col gap-4 md:flex-row">
                  {/* Pay Full */}
                  <div className="flex flex-1 flex-col items-center space-y-8 rounded-xl bg-gray-200 p-8 py-12 text-center">
                    <h4 className="mb-4 flex flex-col text-xl font-semibold">
                      Pay in Full
                      <span>
                        <NumericFormat
                          displayType="text"
                          prefix="$"
                          thousandSeparator=","
                          decimalSeparator="."
                          value={total}
                        />
                      </span>
                    </h4>

                    <Button
                      withIcon
                      title="Check Oout"
                      width="w-full"
                      loading={loading}
                      onClick={createCheckoutSession}
                    />
                  </div>

                  {/* Pay Monthly   */}
                  <div className="flex flex-1 flex-col items-center rounded-xl bg-gray-200 p-8 py-12 text-center">
                    <h4 className="mb-4 flex flex-col text-xl font-semibold">
                      <span>Pay Monthly</span>
                      <span>with Apple Card</span>
                      <span>
                        <NumericFormat
                          displayType="text"
                          prefix="$"
                          thousandSeparator=","
                          decimalSeparator="."
                          decimalScale={2}
                          value={total / 12}
                        />
                        {""}
                        /mo. at 0% APR<sup className="-top-1">*</sup>
                      </span>
                    </h4>
                    <Button title="Check Out with Apple Card Monthly Installments" />
                    <p className="mt-2 max-w-[240px] text-[13px]">
                      $0.00 due today, which includes applicable full-price
                      items, down payments, shipping and taxes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Checkout;
