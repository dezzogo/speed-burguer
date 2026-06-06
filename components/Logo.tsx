interface LogoProps {
  label?: string;
}

export default function Logo({ label = 'Speed Burger Logo' }: LogoProps) {
  return (
    <div className="bg-gray-200 text-gray-800 text-xl font-bold py-10 px-12 rounded-[3rem] mb-8 text-center shadow-lg w-full">
      {label}
    </div>
  );
}
