import Image from "next/image";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { NumericFormat } from "react-number-format";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

import { urlFor } from "../sanity";
import { CartItemProps, removeFromCart } from "../redux/cartSlice";

const CheckoutProduct = ({ product, quantity }: CartItemProps) => {
  const dispatch = useDispatch();

  const removeItemFromCart = () => {
    dispatch(removeFromCart({ id: product._id }));

    toast.success(`${product.title} removed from cart`, {
      icon: "🗑",
    });
  };

  return (
    <div className="flex flex-col border-b border-gray-300 pb-5 lg:flex-row lg:items-center">
      <div className="relative h-44 w-44">
        <Image
          src={urlFor(product.image[0]).url()}
          alt={product.title}
          fill
          className="object-contain"
        />
      </div>

      <div className="flex flex-1 items-end lg:items-center">
        <div className="flex-1 space-y-4">
          <div className="flex flex-col gap-x-8 text-xl lg:flex-row lg:text-2xl">
            <h4 className="font-semibold lg:w-96">{product.title}</h4>
            <p className="flex items-end gap-x-1 font-semibold">
              {quantity}
              <ChevronDownIcon className="h-6 w-6 text-blue-500" />
            </p>
          </div>

          <p className="flex cursor-pointer items-end text-blue-500 hover:underline">
            Show Product Details
            <ChevronDownIcon className="h-6 w-6" />
          </p>
        </div>

        <div className="flex flex-col items-end space-y-4">
          <h4 className="text-xl font-semibold lg:text-2xl">
            <NumericFormat
              displayType="text"
              prefix="$"
              thousandSeparator=","
              decimalSeparator="."
              value={product.price}
            />
          </h4>

          <button
            onClick={removeItemFromCart}
            className="text-blue-500 hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProduct;
