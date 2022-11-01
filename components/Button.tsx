interface ButtonProps {
  title: string;
  onClick?: () => void;
  width?: string;
  loading?: boolean;
  padding?: string;
  withIcon?: boolean;
}

const Button = ({
  title,
  onClick,
  width,
  loading,
  padding,
  withIcon,
}: ButtonProps) => {
  return (
    <button
      className={`group relative transform rounded-md bg-gradient-to-r from-pink-500 to-violet-500 px-10 py-3 font-medium text-white transition duration-200 ease-out hover:shadow-xl hover:shadow-pink-500/20 ${
        width ? width : "w-auto"
      } ${padding}`}
      onClick={onClick}
    >
      <span className="absolute bottom-0 left-0 -ml-2 h-full transform transition duration-200 group-hover:scale-125">
        <svg
          viewBox="0 0 487 487"
          className="object-stretch h-full w-auto opacity-100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
            fill="#FFF"
            fillRule="nonzero"
            fillOpacity=".1"
          ></path>
        </svg>
      </span>
      <span className="absolute top-0 right-0 -mr-3 h-full w-12 transform transition duration-200 group-hover:scale-125">
        <svg
          viewBox="0 0 487 487"
          className="h-full w-full object-cover"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
            fill="#FFF"
            fillRule="nonzero"
            fillOpacity=".1"
          ></path>
        </svg>
      </span>
      <div className="flex items-center justify-center gap-x-3">
        {withIcon && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
            />
          </svg>
        )}
        <span className="relative">{loading ? "Loading..." : title}</span>
      </div>
    </button>
  );
};

export default Button;
