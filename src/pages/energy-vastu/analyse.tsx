import BreadcrumbNav from "@/src/components/BreadCrumNav";
import CustomAnalysisComponent from "@/src/components/CustomAnalysisComponent";
import { useCallback, useEffect, useRef, useState } from "react";
import { CanvasAreaHandle } from "@/src/types/vastuTypes";
import CanvasToolbar from "@/src/components/CanvasToolBar";
import CanvasArea, { Pin } from "@/src/components/CanvasAreas";
import { useParams } from "react-router-dom";
import { getVastuAnalysisByID } from "@/src/services/energyVastu/VastuAPIFunctions";

const Field = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex gap-1">
    <span className="text-sm font-semibold text-black whitespace-nowrap">
      {label} :
    </span>
    <span className="text-sm font-normal text-black/90">{value ?? ""}</span>
  </div>
);

const EnergyVastuAnalyse = () => {
  const [tool, setTool] = useState<"move" | "pin" | "tool">("move");
  const [division, setDiv] = useState(8);
  const [degree, setDegree] = useState(0);
  const [gateOptions, setGateOptions] = useState<string[]>([]);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<CanvasAreaHandle>(null);

  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getVastuAnalysisByID(Number(id));
        console.log("user's data:: ",res.data);
        setUserDetails(res.data);
      } catch (error) {
        console.error("Failed to fetch analysis:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const details = userDetails
    ? [
        { label: "Full Name", value: userDetails.full_name },
        { label: "Mobile No.", value: userDetails.mobile_number },
        { label: "Category", value: userDetails.category },
        {
          label: "Date of Purchase",
          value: userDetails.date_of_purchase
            ? new Date(userDetails.date_of_purchase).toLocaleDateString("en-GB") // → DD/MM/YYYY
            : "",
        },
        { label: "Address", value: userDetails.address },
      ]
    : [];

  // Map image URL from API response
  const mapUrl = userDetails?.map_url ?? "" ;
  const handlePinsChange = useCallback((pins: Pin[]) => {
    if (pins.length < 2) {
      setGateOptions([]);
      return;
    }
    const options: string[] = [];
    for (let i = 0; i < pins.length; i++) {
      options.push(`A${i}-A${(i + 1) % pins.length}`);
    }
    setGateOptions(options);
  }, []);

  const handleGateChange = useCallback((value: string) => {
    if (!value) return;
    const match = value.match(/^A(\d+)-A(\d+)$/);
    if (!match) return;
    canvasRef.current?.rotateCompassToGate(
      parseInt(match[1], 10),
      parseInt(match[2], 10)
    );
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <section className="w-[80%] mx-auto">
      <BreadcrumbNav
        items={[
          { label: "Vastu Analysis", href: "/energy-vastu" },
          { label: "Energy Vastu Analyse" },
        ]}
      />

      <CustomAnalysisComponent
        title="Vastu Energy Analysis"
        reportListHref="/list/energy-vastu"
      >
        <div className="grid grid-cols-4 gap-x-3 gap-y-2">
          {details.map((item) => (
            <Field key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </CustomAnalysisComponent>

      <article className="w-full h-full mt-4 rounded-xl p-4 bg-white/50 border-4 border-lightYellow backdrop-blur-lg font-medium">
        <CanvasToolbar
          onMove={() => setTool("move")}
          onPin={() => setTool("pin")}
          onTool={() => setTool("tool")}
          onDivisionChange={setDiv}
          onDegreeChange={setDegree}
          onUndo={() => canvasRef.current?.undo()}
          onDelete={() => canvasRef.current?.deleteAll()}
          onRotateLeft={() => canvasRef.current?.rotateLeft()}
          onRotateRight={() => canvasRef.current?.rotateRight()}
          onZoomIn={() => canvasRef.current?.zoomIn()}
          onZoomOut={() => canvasRef.current?.zoomOut()}
          onMaximize={() => canvasRef.current?.fitToScreen()}
          gateOptions={gateOptions}
          onGateChange={handleGateChange}
        />

        <div className="mt-4">
          <CanvasArea
            ref={canvasRef}
            mapUrl={mapUrl ?? ""} // ← dynamic map from API
            tool={tool}
            division={division}
            degree={degree}
            onPinsChange={handlePinsChange}
          />
        </div>
      </article>
    </section>
  );
};

export default EnergyVastuAnalyse;
