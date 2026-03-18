import { Outlet } from "react-router-dom";
// import NavBar from "../components/NavBar";
// import Chakra from "../assets/AstroChakr.png";
// import NumberChakra from "../assets/NumberChakra.png";
// import ArdhaChakra from "../assets/ArdhaChakra.png";



// const DefaultLayout : React.FC= () => {
//   return (
//     <>
//       <NavBar />
//       <div className="relative min-h-screen w-full bg-purple p-3 sm:p-12 md:p-24 font-sans leading-normal tracking-normal overflow-hidden">
//         {/* Left-side NumberChakra */}
//         <div
//           className="hidden md:block fixed top-0 left-0 h-full w-1/3 bg-no-repeat bg-cover bg-left z-0"
//           style={{
//             backgroundImage: `url(${NumberChakra})`,
//             pointerEvents: "none",
//           }}
//         />

//         {/* Right-side ArdhaChakra */}
//         <div
//           className="hidden md:block fixed top-0 right-0 h-full w-1/3 bg-no-repeat bg-cover bg-right z-0"
//           style={{
//             backgroundImage: `url(${ArdhaChakra})`,
//             pointerEvents: "none",
//           }}
//         />

//         {/* Full background Chakra (only below md) */}
//         <div
//           className="block md:hidden fixed top-0 left-0 h-full bg-no-repeat bg-fill bg-center z-0 transform translate-x-1/2"
//           style={{
//             backgroundImage: `url(${Chakra})`,
//             pointerEvents: "none",
//           }}
//         />

//         <main className="flex items-center justify-center pt-20 sm:pt-10 md:pt-0">
//           <Outlet />
//         </main>
//       </div>
//     </>

//   );
// };

// export default DefaultLayout;



const DefaultLayout: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default DefaultLayout;