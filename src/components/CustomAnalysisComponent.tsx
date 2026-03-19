import { Layers } from "lucide-react";

const CustomAnalysisComponent : React.FC = () => {
    return (
        <section className="py-12 ">
            <div className="flex items-center gap-2">
                <Layers />
                <h1>Vastu Energy Analysis</h1>
            </div>
        </section>
    );
};

export default CustomAnalysisComponent;