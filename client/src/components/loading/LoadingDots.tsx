interface LoadingDotsProps {
  width?: number;
  height?: number;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({
  width = 4,
  height = 4,
}) => {
  return (
    <div className="flex items-center justify-center space-x-2 py-4 my-2">
      <div
        className={`w-${width} h-${height} bg-[#4e21f1] border border-white border-opacity-75 rounded-full animate-bounceDot0`}
      ></div>
      <div
        className={`w-${width} h-${height} bg-[#4e21f1] border border-white border-opacity-75 rounded-full animate-bounceDot1`}
      ></div>
      <div
        className={`w-${width} h-${height} bg-[#4e21f1] border border-white border-opacity-75 rounded-full animate-bounceDot2`}
      ></div>
    </div>
  );
};

export default LoadingDots;
