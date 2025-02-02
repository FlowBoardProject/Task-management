import Slider from "../components/Slider";
import FAQ from "../components/FAQ";
import CardsDesign from "../components/CardsDesign";
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <Slider/>
        <CardsDesign/>
        <FAQ/>
      </div>
    </div>
  );
}
