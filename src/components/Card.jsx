const Card = ({ children }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden">
      {children}
    </div>
  );
};

const CardImage = ({ src, alt }) => {
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-56 object-cover"
    />
  );
};

const CardTitle = ({ children }) => {
  return (
    <h3 className="text-lg font-semibold text-gray-800">
      {children}
    </h3>
  );
};

const CardDescription = ({ children }) => {
  return (
    <p className="text-sm text-gray-500 mt-1">
      {children}
    </p>
  );
};

export { Card, CardImage, CardTitle, CardDescription };
