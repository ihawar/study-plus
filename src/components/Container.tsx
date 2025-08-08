type ContainerProps = {
  title: string;
  children: React.ReactNode;
};
export default function Container({ title, children }: ContainerProps) {
  return (
    <div className="bg-gray-100 rounded-2xl min-w-[min(60vw,20rem)] shadow-xl h-fit">
      <div className="bg-green-100 rounded-2xl">
        <h1 className="text-primary-600 font-bold text-[1.2rem] md:text-[1.6rem] px-4 py-4 text-center">
          {title}
        </h1>
      </div>
      <div className="px-4 py-4 flex justify-center items-center">
        {children}
      </div>
    </div>
  );
}
